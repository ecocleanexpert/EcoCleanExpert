"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import { AdminLogin } from "@/components/admin/login";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { content } = useSite();

  useEffect(() => {
    if (isSupabaseConfigured) {
      getSupabase()!
        .auth.getSession()
        .then(({ data }) => {
          if (data.session) router.replace("/admin");
        });
    } else if (sessionStorage.getItem("ece_admin") === "1") {
      router.replace("/admin");
    }
  }, [router]);

  return (
    <AdminLogin
      content={content}
      onLogin={() => router.replace("/admin")}
      onBack={() => router.push("/")}
    />
  );
}
