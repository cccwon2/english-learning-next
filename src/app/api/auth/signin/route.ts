import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const { email, password } = await request.json();

    // Supabase를 사용한 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 400 }
      );
    }

    // 로그인 성공
    return NextResponse.json(
      {
        message: "로그인 성공",
        user: data.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그인 오류:", error);
    return NextResponse.json(
      { message: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
