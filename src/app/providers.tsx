"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </JotaiProvider>
    </QueryClientProvider>
  );
}
