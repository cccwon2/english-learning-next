import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";
import { Conversation, ConversationTranslation } from "@/types/Conversation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, userId, grade, classNumber, name } = await req.json();

    console.log("Received data:", {
      message,
      userId,
      grade,
      classNumber,
      name,
    });

    if (!message || !userId || !grade || !classNumber || !name) {
      console.log("Missing fields:", {
        message,
        userId,
        grade,
        classNumber,
        name,
      });
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields: { message, userId, grade, classNumber, name },
        },
        { status: 400 }
      );
    }

    console.log("Translating to English...");
    const englishMessage = await translateToEnglish(message);
    console.log("English translation:", englishMessage);

    console.log("Getting AI response...");
    const englishResponse = await getAIResponse(englishMessage, grade);
    console.log("AI response:", englishResponse);

    console.log("Translating to Korean...");
    const koreanTranslation = await translateToKorean(englishResponse);
    console.log("Korean translation:", koreanTranslation);

    console.log("Getting or creating user...");
    const userIdNumber = await getOrCreateUser(
      userId,
      name,
      grade,
      classNumber
    );
    console.log("User ID:", userIdNumber);

    console.log("Saving conversation...");
    await saveConversation(
      userIdNumber,
      message,
      englishResponse,
      englishMessage,
      koreanTranslation
    );
    console.log("Conversation saved successfully");

    return NextResponse.json({
      originalMessage: message,
      englishMessage,
      englishResponse,
      koreanTranslation,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: text,
          target_lang: "EN",
        },
      }
    );
    return response.data.translations[0].text;
  } catch (error) {
    console.error("Error in translateToEnglish:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    throw new Error(
      `Failed to translate to English: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function translateToKorean(text: string): Promise<string> {
  try {
    console.log("Translating to Korean:", text);
    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: text,
          target_lang: "KO",
        },
      }
    );
    console.log("Translation response:", response.data);
    if (
      response.data &&
      response.data.translations &&
      response.data.translations[0]
    ) {
      return response.data.translations[0].text;
    } else {
      throw new Error("Unexpected response format from DeepL API");
    }
  } catch (error) {
    console.error("Error in translateToKorean:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      throw new Error(
        `Failed to translate to Korean: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error(
      `Failed to translate to Korean: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function getAIResponse(message: string, grade: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an English tutor for a ${grade}th grade elementary school student. Provide simple and clear responses suitable for their level.`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 150,
    });
    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("Error in getAIResponse:", error);
    throw new Error("Failed to get AI response");
  }
}

async function getOrCreateUser(
  userId: string,
  name: string,
  grade: string,
  classNumber: string
): Promise<number> {
  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }

    if (userData) {
      return userData.id;
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        name,
        grade,
        class: classNumber,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    if (!newUser) throw new Error("Failed to create new user");
    return newUser.id;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw new Error("Failed to get or create user");
  }
}

async function saveConversation(
  userId: number,
  message: string,
  englishResponse: string,
  englishMessage: string,
  koreanTranslation: string
) {
  try {
    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .insert([
        {
          userId: userId,
          message: message,
          isUserMessage: true,
        } as Conversation,
        {
          userId: userId,
          message: englishResponse,
          isUserMessage: false,
        } as Conversation,
      ])
      .select();

    if (conversationError) throw conversationError;

    const { error: translationError } = await supabase
      .from("conversation_translations")
      .insert([
        {
          conversationId: conversationData[0].id,
          translatedMessage: englishMessage,
          response: englishResponse,
          translatedResponse: koreanTranslation,
        } as ConversationTranslation,
        {
          conversationId: conversationData[1].id,
          translatedMessage: koreanTranslation,
        } as ConversationTranslation,
      ]);

    if (translationError) throw translationError;
  } catch (error) {
    console.error("Error in saveConversation:", error);
    throw new Error("Failed to save conversation");
  }
}
