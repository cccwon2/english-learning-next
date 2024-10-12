import axios from "axios";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, userId, grade } = await req.json();

    if (!message || !userId || !grade) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const englishMessage = await translateToEnglish(message);
    const englishResponse = await getAIResponse(englishMessage, grade);
    const koreanTranslation = await translateToKorean(englishResponse);

    await saveConversation(
      userId,
      message,
      englishResponse,
      englishMessage,
      koreanTranslation
    );

    return NextResponse.json({
      originalMessage: message,
      englishMessage,
      englishResponse,
      koreanTranslation,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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

async function saveConversation(
  userId: string,
  message: string,
  englishResponse: string,
  englishMessage: string,
  koreanTranslation: string
) {
  try {
    // 사용자의 profile 조회
    const profile = await prisma.profile.findUnique({
      where: { user_id: parseInt(userId) },
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    // 사용자 메시지 저장
    const userConversation = await prisma.conversation.create({
      data: {
        profile_id: profile.id,
        message,
        is_user_message: true,
      },
    });

    // AI 응답 저장
    const aiConversation = await prisma.conversation.create({
      data: {
        profile_id: profile.id,
        message: englishResponse,
        is_user_message: false,
      },
    });

    // 사용자 메시지 번역 저장
    await prisma.conversationTranslation.create({
      data: {
        conversation_id: userConversation.id,
        translated_message: englishMessage,
        response: englishResponse,
        translated_response: koreanTranslation,
      },
    });

    // AI 응답 번역 저장
    await prisma.conversationTranslation.create({
      data: {
        conversation_id: aiConversation.id,
        translated_message: koreanTranslation,
      },
    });
  } catch (error) {
    console.error("Error in saveConversation:", error);
    throw new Error("Failed to save conversation");
  }
}
