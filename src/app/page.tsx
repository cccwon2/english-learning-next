"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Auth from "@/app/auth/signin/page";
import ChatInterface from "@/components/ChatInterface";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";

export default function Home() {
  const [user, setUser] = useAtom(userAtom);

  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(
        session?.user
          ? { ...session.user, email: session.user.email || "" }
          : null
      );
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(
        session?.user
          ? { ...session.user, email: session.user.email || "" }
          : null
      );
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <div className="container mx-auto p-4">
      {!user ? <Auth /> : <ChatInterface />}
    </div>
  );
}
