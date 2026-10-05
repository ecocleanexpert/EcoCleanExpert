"use client";

import { useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import { LegalPage } from "@/components/legal";

export function LegalRoute({ type }: { type: "mentions" | "privacy" }) {
  const router = useRouter();
  const { content } = useSite();

  const onBack = (target?: string) => {
    if (target === "mentions") router.push("/mentions-legales");
    else if (target === "privacy") router.push("/politique-confidentialite");
    else router.push("/");
  };

  return <LegalPage content={content} type={type} onBack={onBack} />;
}
