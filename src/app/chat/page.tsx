"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
    }
  }, [user, router]);

  if (!user) {
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

  return (
    <div className="container mx-auto p-4">
      <ChatInterface />
    </div>
  );
}
