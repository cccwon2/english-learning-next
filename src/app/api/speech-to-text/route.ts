import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!req.body) {
    return NextResponse.json(
      { error: "요청 본문이 없습니다" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 업로드되지 않았습니다" },
        { status: 400 }
      );
    }

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "ko",
    });

    const koreanText = transcription.text;

    const englishText = await translateToEnglish(koreanText);

    return NextResponse.json({ text: koreanText, englishText: englishText });
  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json(
      { error: "음성-텍스트 변환 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

async function translateToEnglish(text: string): Promise<string> {
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
}
