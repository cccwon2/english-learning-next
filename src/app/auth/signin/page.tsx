"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      alert("로그인에 성공했습니다.");
      // 로그인 성공 후 chat 페이지로 리다이렉트
      router.push("/chat");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            로그인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "처리 중..." : "로그인"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-600">
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            계정이 없으신가요? 회원가입
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
