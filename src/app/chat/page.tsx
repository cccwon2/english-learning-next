"use client";

import { useQuery } from "@tanstack/react-query";
import ChatInterface from "../../components/ChatInterface";
import Loading from "../loading";
import Error from "../error";

export default function ChatPage() {
  const {
    data: chatData,
    isLoading,
    error,
  } = useQuery(["chatData"], fetchChatData);

  if (isLoading) return <Loading />;
  if (error)
    return (
      <Error error={error as Error} reset={() => window.location.reload()} />
    );

  return (
    <main className="min-h-screen">
      <ChatInterface initialData={chatData} />
    </main>
  );
}

async function fetchChatData() {
  // 실제 API 호출 로직
  // 예시: const response = await fetch('/api/chat-history');
  // return response.json();
  return [];
}
