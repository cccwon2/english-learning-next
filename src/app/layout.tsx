import Header from "@/components/Header";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "영어 학습 웹 애플리케이션",
  description: "OpenAI API를 활용한 맞춤형 영어 학습",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
