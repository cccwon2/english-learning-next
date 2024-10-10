import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "텍스트와 대상 언어를 모두 제공해야 합니다." },
        { status: 400 }
      );
    }

    const translatedText = await translateText(text, targetLang);

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "번역 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const response = await axios.post(
    "https://api-free.deepl.com/v2/translate",
    null,
    {
      params: {
        auth_key: process.env.DEEPL_API_KEY,
        text: text,
        target_lang: targetLang,
      },
    }
  );

  return response.data.translations[0].text;
}
