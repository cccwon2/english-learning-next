"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ConversationWithUser } from "@/types/Conversation";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const grade = localStorage.getItem("grade");
    const classNum = localStorage.getItem("class");

    if (name && grade && classNum) {
      fetchUserId(name, grade, classNum);
    }
  }, []);

  async function fetchUserId(
    name: string,
    grade: string,
    classNum: string
  ): Promise<void> {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("name", name)
      .eq("grade", grade)
      .eq("class", classNum)
      .single();

    if (error) throw error;
    if (data) setUserId(data.id);
  }

  const {
    data: history,
    isLoading,
    error,
  } = useQuery(["chatHistory", userId], () => fetchChatHistory(userId), {
    enabled: !!userId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">대화 기록</h1>
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        홈으로 돌아가기
      </Link>
      <ul className="space-y-4">
        {history?.map((item: ConversationWithUser) => (
          <li key={item.id} className="border p-4 rounded-lg">
            <p className="font-bold">
              {item.isUserMessage ? "질문" : "답변"}: {item.message}
            </p>
            {!item.isUserMessage && item.translation?.translatedResponse && (
              <p>번역: {item.translation.translatedResponse}</p>
            )}
            <p className="text-sm text-gray-500">
              {item.user.name} ({item.user.grade}학년 {item.user.class}반) -{" "}
              {new Date(item.createdAt).toLocaleString()}
            </p>
            {item.translation?.language && (
              <p className="text-xs text-gray-400">
                언어: {item.translation.language}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function fetchChatHistory(
  userId: string | null
): Promise<ConversationWithUser[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      *,
      user (
        id,
        name,
        grade,
        class
      ),
      translation (
        translatedMessage,
        response,
        translatedResponse,
        language
      )
    `
    )
    .eq("userId", userId)
    .order("createdAt", { ascending: false });

  if (error) throw error;
  return data as ConversationWithUser[];
}
