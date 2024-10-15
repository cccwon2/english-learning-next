"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function ChatPage() {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({ ...session.user, email: session.user.email || "" });
      } else if (!loading) {
        router.push("/auth/signin");
      }
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ ...session.user, email: session.user.email || "" });
      } else {
        router.push("/auth/signin");
      }
    });

    checkUser();

    return () => subscription.unsubscribe();
  }, [setUser, router]);

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

  if (!user) {
    return null; // 로딩 중이 아니고 사용자가 없으면 아무것도 렌더링하지 않음 (리다이렉트 처리됨)
  }

  return (
    <div className="container mx-auto p-4">
      <ChatInterface />
    </div>
  );
}
