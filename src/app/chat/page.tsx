"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

const supabase = createClient();

export default function ChatPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push("/");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) router.push("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">채팅</h1>
      <ChatInterface user={session.user} />
    </div>
  );
}
