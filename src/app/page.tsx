"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Auth from "@/app/auth/signin/page";
import ChatInterface from "@/components/ChatInterface";
import { Session } from "@supabase/supabase-js";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {!session ? <Auth /> : <ChatInterface user={session.user} />}
    </div>
  );
}
