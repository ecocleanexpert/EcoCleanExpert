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

  const cursorOnLine1 = !line2;

  return (
    <h1 className="mt-3 text-[30px] leading-[1.05] sm:text-[40px] lg:text-[52px] font-extrabold tracking-[-0.03em] text-[#0A2A6B] min-h-[64px] sm:min-h-[88px] lg:min-h-[108px]">
      <span>
        {line1}
        {cursorOnLine1 && (
          <span className="cursor-blink inline-block w-[3px] h-[0.85em] bg-[#1E9BE0] ml-1 align-middle rounded-sm" />
        )}
      </span>
      <br />
      <span className="text-[#1E9BE0]">
        {line2}
        {!cursorOnLine1 && (
          <span className="cursor-blink inline-block w-[3px] h-[0.85em] bg-[#1E9BE0] ml-1 align-middle rounded-sm" />
        )}
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
      className="relative w-full overflow-hidden min-h-[720px] lg:min-h-[760px] flex items-center"
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
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-24 lg:py-28">
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

              {/* CTA — boutons réorganisés */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {/* Bouton principal — WhatsApp */}
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex-1 inline-flex items-center justify-center gap-2.5 bg-[#5CC63D] hover:bg-[#4CAF50] text-white text-[14px] font-semibold px-5 h-14 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(92,198,61,0.65)] whitespace-nowrap"
                >
                  <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                    {I.wa("w-4 h-4")}
                  </span>
                  <span>{h.ctaPrimary}</span>
                  <span className="transition-transform group-hover:translate-x-0.5">{I.arrow("w-4 h-4")}</span>
                </a>

                {/* Bouton secondaire — Voir transformations */}
                <a
                  href="#avant-apres"
                  className="group flex-1 inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 text-[14px] font-semibold px-5 h-14 rounded-full transition-colors ring-1 ring-slate-200 whitespace-nowrap"
                >
                  <span className="w-7 h-7 rounded-full bg-[#1E9BE0] text-white flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 ml-0.5" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>{h.ctaSecondary}</span>
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
