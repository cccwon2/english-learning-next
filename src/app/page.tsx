"use client";

import { motion } from "framer-motion";
import UserInfoForm from "../components/UserInfoForm";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkUserSession = useCallback(async (userId?: string) => {
    const storedUserId = userId || localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    const grade = localStorage.getItem("grade");
    const classNum = localStorage.getItem("class");

    if (storedUserId && name && grade && classNum) {
      try {
        const { data } = await supabase
          .from("users")
          .select("id")
          .eq("id", storedUserId)
          .single();

        if (data) {
          setIsLoggedIn(true);
        } else {
          clearLocalStorage();
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        clearLocalStorage();
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const clearLocalStorage = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("grade");
    localStorage.removeItem("class");
  };

  const handleStartChat = () => {
    router.push("/chat");
  };

  const handleLogout = () => {
    clearLocalStorage();
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-center p-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        영어 학습 채팅봇
      </motion.h1>
      {isLoggedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <button
            onClick={handleStartChat}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            채팅 시작하기
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            로그아웃
          </button>
        </motion.div>
      ) : (
        <UserInfoForm onLoginSuccess={checkUserSession} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/history" className="mt-4 text-blue-500 hover:underline">
          대화 기록 보기
        </Link>
      </motion.div>
    </motion.main>
  );
}
