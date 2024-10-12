import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

// Prisma 클라이언트 초기화
const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      grade,
      class: classNum,
    } = await request.json();

    console.log("Received signup data:", { email, name, grade, classNum });

    // Supabase를 사용한 회원가입
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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

      if (!data.user) {
        console.error("사용자 데이터가 없습니다.");
        return NextResponse.json(
          { message: "사용자 생성에 실패했습니다." },
          { status: 500 }
        );
      }

      console.log("Supabase user created:", data.user.id);

      try {
        // Profile 생성
        const profile = await prisma.profile.create({
          data: {
            user_id: parseInt(data.user.id),
            name,
            grade,
            class: classNum,
          },
        });
        console.log("Profile created:", profile);
      } catch (dbError) {
        console.error("Profile 생성 오류:", dbError);
        // 프로필 생성에 실패한 경우 Supabase 사용자 삭제
        await supabase.auth.admin.deleteUser(data.user.id);
        return NextResponse.json(
          { message: "프로필 생성 중 오류가 발생했습니다." },
          { status: 500 }
        );
      }

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
  } finally {
    await prisma.$disconnect();
  }
}
