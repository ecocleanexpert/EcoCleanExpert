"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "ece_consent_v1";
export const CONSENT_EVENT = "ece-consent";

export function getConsent(): "accepted" | "refused" | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "accepted" || v === "refused" ? v : null;
}

export function ConsentBanner() {
  const [choice, setChoice] = useState<"accepted" | "refused" | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(getConsent());
    setReady(true);
  }, []);

  const decide = (v: "accepted" | "refused") => {
    window.localStorage.setItem(CONSENT_KEY, v);
    setChoice(v);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (!ready || choice) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[80] px-4 pb-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl ring-1 ring-slate-900/10 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.4)] p-5 sm:flex sm:items-center sm:gap-5">
        <p className="text-[13.5px] text-slate-600 leading-relaxed">
          Nous utilisons des cookies pour mesurer l&apos;audience du site et
          améliorer votre expérience. Consultez notre{" "}
          <Link href="/politique-confidentialite" className="text-[#1173A9] font-semibold hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="mt-4 sm:mt-0 flex gap-2.5 shrink-0">
          <button
            onClick={() => decide("refused")}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={() => decide("accepted")}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#0A2A6B] hover:bg-[#071B4C] transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
