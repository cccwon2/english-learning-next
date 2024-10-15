"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { FiSend, FiMic } from "react-icons/fi"; // 아이콘 사용

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  translation?: string;
  createdAt: string;
}

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslation, setShowTranslation] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (isLoading || !hasMore || !user?.id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/messages`, {
        params: {
          page,
          limit: 20,
          userId: user.id,
        },
      });
      const newMessages = response.data.messages;
      setMessages((prevMessages) => {
        const uniqueMessages = newMessages.filter(
          (newMsg: Message) =>
            !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
        );
        return [...prevMessages, ...uniqueMessages];
      });
      setHasMore(response.data.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadMessages();
    }
  }, [loadMessages, user?.id]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMessages();
        }
      },
      { threshold: 1 }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsGeneratingResponse(true);

    try {
      const response = await axios.post("/api/chat", {
        message: content,
        userId: user.id,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.englishResponse,
        isUser: false,
        translation: response.data.koreanTranslation,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      if (axios.isAxiosError(error)) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: `오류: ${
              error.response?.data?.error || "알 수 없는 오류가 발생했습니다."
            }`,
            isUser: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: "메시지 전송 중 오류가 발생했습니다.",
            isUser: false,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setIsGeneratingResponse(false);
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorder.current?.stop();
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          };
          mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, {
              type: "audio/wav",
            });
            audioChunks.current = [];

            const formData = new FormData();
            formData.append("audio", audioBlob, "recording.wav");

            try {
              const response = await axios.post(
                "/api/speech-to-text",
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );
              sendMessage(response.data.text);
            } catch (error) {
              console.error("Error converting speech to text:", error);
            }
          };
          mediaRecorder.current.start();
        })
        .catch((error) => console.error("Error accessing microphone:", error));
    }
    setIsRecording(!isRecording);
  };

  const toggleTranslation = (id: string) => {
    setShowTranslation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 새로운 useEffect 추가
  useEffect(() => {
    const adjustHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    adjustHeight();
    window.addEventListener("resize", adjustHeight);

    return () => window.removeEventListener("resize", adjustHeight);
  }, []);

  return (
    <div
      className="flex flex-col bg-sky-100 fixed inset-0 overflow-hidden"
      style={{
        top: "4rem",
        height: "calc(var(--vh, 1vh) * 100 - 4rem)",
      }}
    >
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-lg ${
              message.isUser
                ? "bg-yellow-400 ml-auto text-gray-800"
                : "bg-white text-gray-800"
            } max-w-[70%]`}
          >
            <p className="break-words">{message.content}</p>
            {message.translation && !message.isUser && (
              <div>
                <button
                  onClick={() => toggleTranslation(message.id)}
                  className="text-sm text-blue-500 mt-1"
                >
                  {showTranslation[message.id] ? "원문 보기" : "번역 보기"}
                </button>
                {showTranslation[message.id] && (
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    {message.translation}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
        {isGeneratingResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-2 rounded-lg bg-white max-w-[70%]"
          >
            <p className="text-gray-600">답변 생 중...</p>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-t-2 border-b-2 border-gray-600 rounded-full mt-2"
            />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 로딩 스피너 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full"
          />
        </div>
      )}

      {/* 입력창 */}
      <div className="p-4 bg-sky-200 fixed bottom-0 left-0 right-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 rounded-full border border-gray-400 focus:outline-none focus:border-yellow-400"
            placeholder="메시지를 입력하세요..."
            disabled={isGeneratingResponse}
          />
          <button
            type="submit"
            className="bg-yellow-400 p-2 rounded-full text-gray-800"
            disabled={isLoading || isGeneratingResponse}
          >
            <FiSend />
          </button>
          <button
            type="button"
            onClick={toggleRecording}
            className={`p-2 rounded-full ${
              isRecording ? "bg-red-500" : "bg-yellow-400"
            } text-gray-800`}
            disabled={isLoading || isGeneratingResponse}
          >
            <FiMic />
          </button>
        </form>
      </div>
    </div>
  );
}
