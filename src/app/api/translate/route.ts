import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { text, targetLang } = await req.json();

  try {
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

    const translatedText = response.data.translations[0].text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
