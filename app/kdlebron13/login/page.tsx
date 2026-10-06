"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import { AdminLogin } from "@/components/kdlebron13/login";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { content } = useSite();

  useEffect(() => {
    if (isSupabaseConfigured) {
      getSupabase()!
        .auth.getSession()
        .then(({ data }) => {
          if (data.session) router.replace("/kdlebron13");
        });
    } else if (sessionStorage.getItem("ece_admin") === "1") {
      router.replace("/kdlebron13");
    }
  }, [router]);

  return (
    <AdminLogin
      content={content}
      onLogin={() => router.replace("/kdlebron13")}
      onBack={() => router.push("/")}
    />
  );
}
