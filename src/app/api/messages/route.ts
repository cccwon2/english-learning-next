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
    const [conversations, count] = await Promise.all([
      prisma.conversation.findMany({
        where: { user_id: userId },
        include: { translation: true },
        orderBy: { created_at: "asc" },
        skip: offset,
        take: limit,
      }),
      prisma.conversation.count({ where: { user_id: userId } }),
    ]);

    const messages = conversations.map((item) => ({
      id: item.id,
      content: item.message,
      isUser: item.is_user_message,
      translation: item.translation?.translated_response,
    }));

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
