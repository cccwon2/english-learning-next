import { NextResponse } from "next/server";
import { adminAuthClient } from "@/utils/supabase/admin";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Supabase를 사용한 회원가입
    try {
      const { data, error } = await adminAuthClient.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "user",
        },
      });

      if (error) {
        console.error("Supabase 회원가입 오류:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return NextResponse.json(
          {
            message: "회원가입 중 오류가 발생했습니다.",
            error: error.message,
            details: JSON.stringify(error),
          },
          { status: error.status || 500 }
        );
      }

      if (!data?.user) {
        console.error("사용자 데이터가 없습니다.");
        return NextResponse.json(
          { message: "사용자 생성에 실패했습니다." },
          { status: 500 }
        );
      }

      console.log("Supabase auth.user id: ", data.user.id);

      return NextResponse.json(
        { message: "회원가입이 완료되었습니다. 이메일을 확인해 주세요." },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Supabase 회원가입 상세 오류:", error);
      console.error("Error stack:", error.stack);
      return NextResponse.json(
        {
          message: "회원가입 중 오류가 발생했습니다.",
          error: error.message || "알 수 없는 오류",
          details: JSON.stringify(error),
          stack: error.stack,
        },
        { status: error.status || 500 }
      );
    }
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "회원가입 중 오류가 발생했습니다.", error: String(error) },
      { status: 500 }
    );
  }
}
