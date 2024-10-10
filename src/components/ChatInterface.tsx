"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query"; // useQuery 제거
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  translation?: string;
}

interface ChatInterfaceProps {
  initialData?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialData = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialData);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [userInfo, setUserInfo] = useState({ name: "", grade: "", class: "" });

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const grade = localStorage.getItem("userGrade");
    const classNumber = localStorage.getItem("userClass");

    if (!name || !grade || !classNumber) {
      router.push("/");
    } else {
      setUserInfo({ name, grade, class: classNumber });
    }
  }, [router]);

  const sendMessageMutation = useMutation(
    async (message: string) => {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, ...userInfo }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json();
    },
    {
      onSuccess: (data) => {
        const userMessage: Message = {
          role: "user",
          content: data.originalMessage,
        };
        const assistantMessageEn: Message = {
          role: "assistant",
          content: data.englishResponse,
        };
        const assistantMessageKo: Message = {
          role: "assistant",
          content: data.koreanTranslation,
        };
        setMessages((prev) => [
          ...prev,
          userMessage,
          assistantMessageEn,
          assistantMessageKo,
        ]);
        setIsLoading(false);
      },
      onError: (error: any) => {
        console.error("Error:", error);
        setError("메시지 전송에 실패했습니다.");
        setIsLoading(false);
      },
    }
  );

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, targetLang: "EN" }),
      });

      if (!response.ok) throw new Error("Failed to translate message");

      const { translatedText } = await response.json();
      sendMessageMutation.mutate(translatedText);
    } catch (error) {
      console.error("Translation error:", error);
      setError("번역에 실패했습니다.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        await handleSpeechToText(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setError("마이크 접근에 실패했습니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleSpeechToText = async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to convert speech to text");

      const { text, englishText } = await response.json();
      setInput(text);
      sendMessageMutation.mutate(englishText);
    } catch (error) {
      console.error("Error:", error);
      setError("음성 인식에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-bold">채팅</h1>
        <Link href="/history" className="text-blue-500 hover:underline">
          대화 기록 보기
        </Link>
      </div>
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <p>{message.content}</p>
                {message.role === "assistant" && index % 2 === 1 && (
                  <p className="text-sm text-gray-600 mt-1">영어 응답</p>
                )}
                {message.role === "assistant" && index % 2 === 0 && (
                  <p className="text-sm text-gray-600 mt-1">한국어 번역</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* 입력 영역 */}
      <div className="p-4 border-t">
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="메시지를 입력하세요..."
            disabled={isLoading || isRecording}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded"
            disabled={isLoading || isRecording || !input.trim()}
          >
            {isLoading ? "전송 중..." : "전송"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 ${
              isRecording ? "bg-red-500" : "bg-green-500"
            } text-white rounded`}
            disabled={isLoading}
          >
            {isRecording ? "녹음 중지" : "음성 녹음"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;
