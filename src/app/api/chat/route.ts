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
  const { message, grade, classNumber, name } = await req.json();

  try {
    // 한국어 메시지를 영어로 번역
    const translationResponse = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: message,
          target_lang: "EN",
        },
      }
    );

    const englishMessage = translationResponse.data.translations[0].text;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an English tutor for a ${grade}th grade elementary school student. Provide simple and clear responses suitable for their level.`,
        },
        { role: "user", content: englishMessage },
      ],
      max_tokens: 150,
    });

    const englishResponse = completion.choices[0].message.content;

    // 영어 응답을 한국어로 번역
    const koreanTranslationResponse = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: englishResponse,
          target_lang: "KO",
        },
      }
    );

    const koreanTranslation =
      koreanTranslationResponse.data.translations[0].text;

    // Supabase에 저장
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("name", name)
      .eq("grade", grade)
      .eq("class", classNumber)
      .single();

    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }

    let userId: number;
    if (!userData) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          name,
          grade,
          class: classNumber,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!newUser) throw new Error("Failed to create new user");
      userId = newUser.id;
    } else {
      userId = userData.id;
    }

    // conversations 테이블에 저장
    const { data: conversationData, error: conversationError } = await supabase
      .from("conversations")
      .insert([
        {
          user_id: userId,
          message: message,
          is_user_message: true,
        } as Conversation,
        {
          user_id: userId,
          message: englishResponse,
          is_user_message: false,
        } as Conversation,
      ])
      .select();

    if (conversationError) throw conversationError;

    // conversation_translations 테이블에 저장
    const { error: translationError } = await supabase
      .from("conversation_translations")
      .insert([
        {
          conversation_id: conversationData[0].id,
          translated_message: englishMessage,
          response: englishResponse,
          translated_response: koreanTranslation,
        } as ConversationTranslation,
        {
          conversation_id: conversationData[1].id,
          translated_message: koreanTranslation,
        } as ConversationTranslation,
      ]);

    if (translationError) throw translationError;

    return NextResponse.json({
      originalMessage: message,
      englishMessage,
      englishResponse,
      koreanTranslation,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
