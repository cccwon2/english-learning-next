import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const userId = searchParams.get("userId");

  console.log("userId: ", userId);

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const offset = (page - 1) * limit;

  try {
    const conversations = await prisma.conversation.findMany({
      where: { user_id: userId },
      include: {
        translation: true,
      },
      orderBy: { created_at: "asc" },
      skip: offset,
      take: limit,
    });

    console.log(
      "Fetched conversations:",
      JSON.stringify(conversations, null, 2)
    );

    const count = await prisma.conversation.count({
      where: { user_id: userId },
    });

    const messages = conversations.map((item) => {
      console.log("Processing item:", item); // 각 항목 처리 로그
      return {
        id: item.id.toString(),
        content: item.message,
        isUser: item.is_user_message,
        translation: item.is_user_message
          ? null
          : item.translation?.translated_message,
        createdAt: item.created_at.toISOString(),
      };
    });

    console.log("Processed messages:", messages); // 처리된 메시지 로그

    const hasMore = offset + limit < count;

    return NextResponse.json({ messages, hasMore });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
