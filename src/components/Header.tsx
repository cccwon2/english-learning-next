"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 페이지와 회원가입 페이지에서는 Header를 렌더링하지 않음
  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    return null;
  }

  const handleLogout = async (): Promise<void> => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.push("/auth/signin");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-2xl font-bold">AI 영어 학습 앱</h1>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirm(true)}
        className="p-2 border-gray-300 rounded-md font-bold hover:text-blue-500 hover:border-blue-500 cursor-pointer transition-colors duration-200"
      >
        로그아웃
      </Button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
