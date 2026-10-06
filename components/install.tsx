"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function PwaInstall() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || dismissed || !deferred || !isMobile) return null;

  const install = async () => {
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
    else setDismissed(true);
  };

  return (
    <div className="fixed bottom-[84px] inset-x-3 z-40 lg:hidden animate-[slideUp_.35s_ease-out]">
      <div className="bg-[#0A2A6B] text-white rounded-2xl shadow-[0_16px_50px_-12px_rgba(10,42,107,0.6)] p-4 flex items-center gap-3">
        <img src="/images/icon-192.png" alt="" width="44" height="44" className="rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-bold leading-tight">Installer Eco Clean Expert</div>
          <div className="text-[11.5px] text-white/70 leading-tight mt-0.5">Accès rapide sur ton écran d'accueil</div>
        </div>
        <button
          onClick={install}
          className="shrink-0 bg-[#5CC63D] hover:bg-[#4CAF50] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl transition-colors"
        >
          Installer
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Fermer"
          className="shrink-0 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
