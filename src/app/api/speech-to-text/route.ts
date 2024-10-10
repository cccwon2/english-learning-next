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

    // 음성을 텍스트로 변환 (한국어)
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "ko",
    });

    const koreanText = transcription.text;

    // 한국어 텍스트를 영어로 번역
    const translationResponse = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      null,
      {
        params: {
          auth_key: process.env.DEEPL_API_KEY,
          text: koreanText,
          target_lang: "EN",
        },
      }
    );

    const englishText = translationResponse.data.translations[0].text;

    return NextResponse.json({ text: koreanText, englishText: englishText });
  } catch (error) {
    console.error("오류:", error);
    return NextResponse.json(
      { error: "음성-텍스트 변환 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
