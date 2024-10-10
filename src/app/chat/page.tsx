"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const [userInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    grade: string;
    class: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const name = localStorage.getItem("name");
      const grade = localStorage.getItem("grade");
      const classNum = localStorage.getItem("class");

      if (name && grade && classNum) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("id")
            .eq("name", name)
            .eq("grade", grade)
            .eq("class", classNum)
            .single();

          if (error) throw error;

          if (data) {
            setUserInfo({ id: data.id, name, grade, class: classNum });
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    fetchUserInfo();
  }, [router]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">채팅</h1>
      <ChatInterface userInfo={userInfo} />
    </div>
  );
}
