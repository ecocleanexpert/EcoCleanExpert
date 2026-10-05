"use client";

import { useRouter } from "next/navigation";
import { I } from "@/lib/icons";
import { useSite } from "@/lib/store";
import { Landing } from "@/components/landing";

export function SiteHome() {
  const router = useRouter();
  const { content, addRequest } = useSite();

  const navigate = (target?: string) => {
    if (target === "mentions") router.push("/mentions-legales");
    else if (target === "privacy") router.push("/politique-confidentialite");
    else router.push("/");
  };

  return (
    <>
      <Landing
        content={content}
        onAdmin={() => router.push("/admin")}
        onNewRequest={addRequest}
        onNavigate={navigate}
      />

      {/* Bouton Appeler flottant — desktop uniquement (mobile a la barre fixe) */}
      <a
        href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
        title={`Appeler ${content.contact.phone}`}
        className="hidden lg:flex fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-[#5CC63D] hover:bg-[#4CAF50] text-white shadow-lg items-center justify-center transition-colors"
        aria-label="Appeler"
      >
        {I.phone("w-5 h-5")}
      </a>

      {/* Cadenas admin — desktop uniquement */}
      <button
        onClick={() => router.push("/admin")}
        title="Espace administrateur"
        className="hidden lg:flex fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-[#071B2C] text-white/80 hover:text-white shadow-lg items-center justify-center transition-colors"
        aria-label="Administration"
      >
        {I.lock("w-5 h-5")}
      </button>
    </>
  );
}
