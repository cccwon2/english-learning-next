"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";
import Link from "next/link";

const Header = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);

  const handleLogout = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setUser(null); // userAtom 초기화
        router.push("/auth/signin");
      } else {
        throw new Error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
    setShowConfirm(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-sky-300 z-10">
      <h1 className="text-2xl font-bold text-gray-800">AI 영어 학습 앱</h1>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-800">{user.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="p-2 border-gray-800 text-gray-800 rounded-md font-bold hover:bg-sky-400 hover:text-white cursor-pointer transition-colors duration-200"
            >
              로그아웃
            </Button>
          </>
        ) : (
          <Link href="/auth/signin">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-sky-400"
            >
              로그인
            </Button>
          </Link>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">로그아웃 하시겠습니까?</p>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                아니오
              </Button>
              <Button
                variant="default"
                onClick={handleLogout}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                예
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
