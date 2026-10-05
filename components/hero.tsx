"use client";

import { useEffect, useMemo, useState } from "react";
import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import { Img } from "@/components/ui";
import type { SiteContent } from "@/lib/defaultContent";

export function TypewriterHero({ phrases, settings }: { phrases: { line1: string; line2: string }[]; settings?: SiteContent["hero"]["typewriter"] }) {
  const [idx, setIdx] = useState(0);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState("typing1");

  // Valeurs paramétrables depuis l'admin (avec fallback par défaut)
  const typingSpeed = Number(settings?.typingSpeed) || 35;
  const erasingSpeed = Number(settings?.erasingSpeed) || 15;
  const pauseBetweenLines = Number(settings?.pauseBetweenLines) || 100;
  const holdDuration = Number(settings?.holdDuration) || 3000;
  const pauseBeforeErasing = Number(settings?.pauseBeforeErasing) || 200;

  useEffect(() => {
    const current = phrases[idx];
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (phase === "typing1") {
      if (line1.length < current.line1.length) {
        timer = setTimeout(() => setLine1(current.line1.slice(0, line1.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setPhase("typing2"), pauseBetweenLines);
      }
    } else if (phase === "typing2") {
      if (line2.length < current.line2.length) {
        timer = setTimeout(() => setLine2(current.line2.slice(0, line2.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setPhase("holding"), holdDuration);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => setPhase("erasing"), pauseBeforeErasing);
    } else if (phase === "erasing") {
      if (line2.length > 0) {
        timer = setTimeout(() => setLine2(line2.slice(0, -1)), erasingSpeed);
      } else if (line1.length > 0) {
        timer = setTimeout(() => setLine1(line1.slice(0, -1)), erasingSpeed);
      } else {
        setIdx((idx + 1) % phrases.length);
        setPhase("typing1");
      }
    }
    return () => clearTimeout(timer);
  }, [line1, line2, phase, idx, phrases, typingSpeed, erasingSpeed, pauseBetweenLines, holdDuration, pauseBeforeErasing]);

  const longest = useMemo(() => {
    let l1 = "";
    let l2 = "";
    phrases.forEach((p) => {
      if ((p.line1 || "").length > l1.length) l1 = p.line1;
      if ((p.line2 || "").length > l2.length) l2 = p.line2;
    });
    return { line1: l1, line2: l2 };
  }, [phrases]);

  const cursorOnLine1 = !line2;

  return (
    <h1 className="relative mt-3 text-[30px] leading-[1.05] sm:text-[40px] lg:text-[46px] font-extrabold tracking-[-0.03em] text-[#0A2A6B]">
      {/* Ghost : réserve l'espace de la phrase la plus longue */}
      <span className="invisible block" aria-hidden="true">
        <span className="block">{longest.line1 || " "}</span>
        <span className="block">{longest.line2 || " "}</span>
      </span>
      {/* Texte animé en absolu : ne peut pas agrandir le h1 */}
      <span className="absolute top-0 left-0 right-0 pointer-events-none">
        <span className="block min-h-[1.05em]">
          {line1}
          {cursorOnLine1 && (
            <span className="cursor-blink inline-block w-[3px] h-[0.85em] bg-[#1E9BE0] ml-1 align-middle rounded-sm" />
          )}
        </span>
        <span className="block text-[#1E9BE0] min-h-[1.05em]">
          {line2}
          {!cursorOnLine1 && (
            <span className="cursor-blink inline-block w-[3px] h-[0.85em] bg-[#1E9BE0] ml-1 align-middle rounded-sm" />
          )}
        </span>
      </span>
    </h1>
  );
}
export function Hero({ content }: { content: SiteContent }) {
  const h = content.hero;
  const iconMap: Record<string, (c?: string) => JSX.Element> = { home: I.home, spark: I.spark, shield: I.shield };

  const phrases = useMemo(() => {
  const source = (h.phrases && h.phrases.length > 0)
    ? h.phrases
    : [
        { line1: "Du sale", line2: "au propre." },
        { line1: "De la poussière", line2: "à la propreté." },
        { line1: "Du terne", line2: "à l'éclat." },
      ];
  // Mélange aléatoire à chaque rechargement de page
  return [...source].sort(() => Math.random() - 0.5);
}, [h.phrases]);

  return (
    <section
      id="accueil"
      className="relative w-full overflow-hidden min-h-[720px] lg:min-h-[700px] flex items-center"
    >
      {/* Image de fond plein écran */}
      <div className="absolute inset-0">
        <Img
          src={h.image}
          alt="Nettoyage professionnel Eco Clean Expert à Abidjan"
          loading="eager"
          fetchPriority="high"
          className="w-full h-full object-cover object-center"
        />
        {/* Voile dégradé pour garantir la lisibilité sur mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent sm:from-white/20 sm:via-transparent sm:to-transparent lg:hidden" />
      </div>

      {/* Contenu — panneau blanc transparent */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-24">
        <div className="lg:max-w-[580px]">
            <div className="bg-white/85 sm:bg-white/75 lg:bg-white/60 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-[0_24px_70px_-24px_rgba(15,23,42,0.35)] ring-1 ring-white/40">

              {/* Label */}
              <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">
                <span className="w-6 h-px bg-[#1E9BE0]" />
                {h.label}
              </div>

              {/* Titre typewriter */}
              <TypewriterHero phrases={phrases} settings={h.typewriter} />

              {/* Trait vert */}
              <div className="mt-4 h-[5px] w-14 rounded-full bg-[#5CC63D]" />

              {/* Sous-titre */}
              <p className="mt-5 text-[15px] lg:text-[16.5px] text-slate-700 leading-relaxed max-w-md">
                {h.subtitle}
              </p>

              {/* Avantages */}
              <ul className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {h.advantages.map((a, i) => {
                  const iconFn = iconMap[a.icon] || I.check;
                  return (
                    <li key={i} className="flex flex-col items-start gap-1.5 text-[10.5px] sm:text-[11px] lg:text-[11.5px] font-semibold text-slate-700 leading-[1.15]">
                      <span className="text-[#1E9BE0]">{iconFn("w-6 h-6 sm:w-7 sm:h-7")}</span>
                      <span>{a.label}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Prix */}
              <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-200/60 flex items-baseline gap-2">
                <span className="text-[13px] lg:text-[13.5px] font-semibold text-slate-600">{h.priceLabel}</span>
                <span className="text-[26px] lg:text-[30px] font-extrabold tracking-[-0.02em] text-[#0A2A6B]">{h.price}</span>
              </div>

              {/* CTA — boutons premium */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {/* Bouton principal — WhatsApp */}
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:flex-1 inline-flex items-center justify-between gap-3 bg-gradient-to-r from-[#5CC63D] to-[#4CAF50] hover:from-[#4CAF50] hover:to-[#3F9A38] text-white font-bold px-4 sm:px-5 py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_32px_-10px_rgba(92,198,61,0.75)] hover:shadow-[0_16px_40px_-10px_rgba(92,198,61,0.85)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 ring-2 ring-white/30">
                      {I.wa("w-5 h-5")}
                    </span>
                    <span className="text-[13.5px] sm:text-[13px] lg:text-[14.5px] leading-tight">{h.ctaPrimary}</span>
                  </span>
                  <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                    {I.arrow("w-4 h-4")}
                  </span>
                </a>

                {/* Bouton secondaire — Voir transformations */}
                <a
                  href="#avant-apres"
                  className="group w-full sm:flex-1 inline-flex items-center justify-between gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold px-4 sm:px-5 py-4 rounded-2xl transition-all duration-300 ring-1 ring-slate-200 hover:ring-slate-300 shadow-[0_4px_16px_-6px_rgba(15,23,42,0.08)]"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#1E9BE0] to-[#0A2A6B] text-white flex items-center justify-center shrink-0 shadow-md">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 ml-0.5" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="absolute inset-0 rounded-full bg-[#1E9BE0] opacity-40 animate-ping" style={{ animationDuration: "2.5s" }} />
                    </span>
                    <span className="text-[13.5px] sm:text-[13px] lg:text-[14.5px] leading-tight">{h.ctaSecondary}</span>
                  </span>
                  <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                    {I.arrow("w-4 h-4 text-slate-600")}
                  </span>
                </a>
              </div>

            </div>
        </div>
      </div>
    </section>
  );
}
/* ============================================================
   SERVICES
============================================================ */
