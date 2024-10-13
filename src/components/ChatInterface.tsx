"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  translation?: string;
}

interface ChatInterfaceProps {
  user: User;
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTranslation, setShowTranslation] = useState<{
    [key: number]: boolean;
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
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
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
    const newMessage: Message = { id: Date.now(), content, isUser: true };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsGeneratingResponse(true);

    try {
      const response = await axios.post("/api/chat", {
        message: content,
        userId: user.id,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: response.data.englishResponse,
          isUser: false,
          translation: response.data.koreanTranslation,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      if (axios.isAxiosError(error)) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: `오류: ${
              error.response?.data?.error || "알 수 없는 오류가 발생했습니다."
            }`,
            isUser: false,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            content: "메시지 전송 중 오류가 발생했습니다.",
            isUser: false,
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

  const toggleTranslation = (id: number) => {
    setShowTranslation((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {hasMore && (
          <div ref={loadingRef} className="text-center">
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-block w-6 h-6 border-t-2 border-b-2 border-gray-600 rounded-full"
              />
            )}
          </div>
        )}
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-2 rounded-lg ${
              message.isUser ? "bg-blue-100 ml-auto" : "bg-gray-100"
            } max-w-[80%]`}
          >
            <p className="break-words">{message.content}</p>
            {!message.isUser && message.translation && (
              <div>
                <button
                  onClick={() => toggleTranslation(message.id)}
                  className="text-sm text-blue-500 mt-1"
                >
                  {showTranslation[message.id] ? "번역 숨기기" : "번역 보기"}
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
            className="p-2 rounded-lg bg-gray-100 max-w-[80%]"
          >
            <p className="text-gray-600">답변 생성 중...</p>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-4 h-4 border-t-2 border-b-2 border-gray-600 rounded-full mt-2"
            />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="메시지를 입력하세요..."
            disabled={isGeneratingResponse}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-r-lg"
            disabled={isLoading || isGeneratingResponse}
          >
            전송
          </button>
          <button
            type="button"
            onClick={toggleRecording}
            className={`ml-2 p-2 rounded-lg ${
              isRecording ? "bg-red-500" : "bg-green-500"
            } text-white`}
            disabled={isLoading || isGeneratingResponse}
          >
            {isRecording ? "녹음 중지" : "음성 입력"}
          </button>
        </form>
      </div>
    </div>
  );
}
