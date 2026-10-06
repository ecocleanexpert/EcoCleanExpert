"use client";

import { useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import { AdminReset } from "@/components/admin/reset";

export default function AdminResetPage() {
  const router = useRouter();
  const { content } = useSite();

  return <AdminReset content={content} onDone={() => router.replace("/kdlebron13/login")} />;
}
