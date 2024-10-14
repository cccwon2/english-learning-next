import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createClient();

  // Supabase 세션 종료
  await supabase.auth.signOut();

  const response = NextResponse.json(
    { success: true, message: "로그아웃 되었습니다." },
    { status: 200 }
  );

  // Supabase 인증 관련 쿠키 제거
  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.includes("-auth-token")) {
      response.cookies.set(cookie.name, "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  });

  return response;
}
