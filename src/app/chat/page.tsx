"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";
import { motion } from "framer-motion";

const supabase = createClient();

export default function ChatPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (!session) router.push("/");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) router.push("/");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
        />
      </div>
    );
  }

  if (!session) {
    return null; // 로그인되지 않은 경우 아무것도 렌더링하지 않음 (리다이렉트 처리됨)
  }

  return (
    <div className="container mx-auto p-4">
      <ChatInterface user={session.user} />
    </div>
  );
}
