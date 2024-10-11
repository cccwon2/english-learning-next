"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConversationWithProfile } from "@/types/Conversation";
import { Session } from "@supabase/supabase-js";

export default function HistoryPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<ConversationWithProfile[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchChatHistory(session.user.id);
    });
  }, []);

  async function fetchChatHistory(userId: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        profile:profiles (
          id,
          name,
          grade,
          class
        ),
        translation:conversation_translations (
          translated_message,
          response,
          translated_response,
          language
        )
      `
      )
      .eq("profile.userId", userId)
      .order("createdAt", { ascending: false });

    if (error) console.error("Error fetching chat history:", error);
    else setHistory(data as ConversationWithProfile[]);
  }

  if (!session) return <div>로그인 후 히스토리를 볼 수 있습니다.</div>;

  return (
    <div className="container mx-auto p-4">
      {history.map((conversation) => (
        <div key={conversation.id} className="mb-4 p-4 border rounded">
          <p className="font-bold">
            사용자: {conversation.profile?.name || "알 수 없음"}
          </p>
          <p>메시지: {conversation.message}</p>
          <p>응답: {conversation.translation?.response}</p>
          {conversation.translation && (
            <div className="mt-2">
              <p>
                번역된 메시지: {conversation.translation?.translated_message}
              </p>
              <p>
                번역된 응답: {conversation.translation?.translated_response}
              </p>
              <p>언어: {conversation.translation?.language}</p>
            </div>
          )}
          <p className="text-sm text-gray-500">
            작성 시간: {new Date(conversation.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
