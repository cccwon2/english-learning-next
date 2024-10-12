import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Prisma 클라이언트 초기화
const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const {
      email,
      password,
      name,
      grade,
      class: classNum,
    } = await request.json();

    // Supabase를 사용한 회원가입
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { message: "회원가입 중 오류가 발생했습니다." },
        { status: 400 }
      );
    }

    if (data.user) {
      try {
        // User 정보 저장
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            created_at: new Date(),
          },
        });

        // Profile 정보 저장
        await prisma.profile.create({
          data: {
            user_id: data.user.id,
            name,
            grade,
            class: classNum,
          },
        });
      } catch (dbError) {
        console.error("데이터베이스 오류:", dbError);
        // Supabase에서 생성된 사용자 삭제
        await supabase.auth.admin.deleteUser(data.user.id);
        return NextResponse.json(
          { message: "사용자 정보 저장 중 오류가 발생했습니다." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 오류:", error);
    return NextResponse.json(
      { message: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
