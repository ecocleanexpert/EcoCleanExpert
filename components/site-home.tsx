"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { I } from "@/lib/icons";
import { useSite } from "@/lib/store";
import { Landing } from "@/components/landing";

export function SiteHome() {
  const router = useRouter();
  const { content, addRequest } = useSite();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

      {/* Retour en haut */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Retour en haut"
          className="fixed bottom-24 right-4 lg:bottom-20 lg:right-5 z-40 w-12 h-12 rounded-full bg-[#1E9BE0] hover:bg-[#1785c4] text-white shadow-lg flex items-center justify-center transition-colors"
          aria-label="Retour en haut"
        >
          {I.arrow("w-5 h-5 -rotate-90")}
        </button>
      )}
    </>
  );
}
