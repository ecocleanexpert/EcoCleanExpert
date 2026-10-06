"use client";

import { useEffect, useRef, useState } from "react";
import { I } from "@/lib/icons";
import { AnimatedNumber, Reveal } from "@/components/ui";
import { waLink } from "@/lib/constants";
import type { SiteContent } from "@/lib/defaultContent";

export function StatsSection({ content }: { content: SiteContent }) {
  const stats = content.stats || { items: [] };
  const items = (stats.items || []).filter((s) => s.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  if (items.length === 0) return null;

  const iconMap: Record<string, (c?: string) => JSX.Element> = {
    users: I.users, spark: I.spark, shield: I.shield, home: I.home, pin: I.pin,
    building: I.building, hammer: I.hammer, sofa: I.sofa, chair: I.chair,
    carpet: I.carpet, car: I.car, star: I.star, check: I.check, trend: I.trend,
  };

  return (
    <section id="chiffres" className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Nos chiffres</div>
            <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">
              {stats.title || "Nos chiffres"}
            </h2>
            {stats.subtitle && <p className="mt-4 text-[15.5px] text-slate-600 max-w-lg mx-auto">{stats.subtitle}</p>}
          </div>
        </Reveal>

        <div className={`grid gap-5 lg:gap-6 ${
          items.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
          items.length === 2 ? "grid-cols-2 max-w-2xl mx-auto" :
          items.length === 3 ? "grid-cols-1 sm:grid-cols-3" :
          "grid-cols-2 lg:grid-cols-4"
        }`}>
          {items.map((s, i) => {
            const iconFn = iconMap[s.icon] || I.trend;
            return (
              <Reveal key={s.id} delay={i * 100}>
                <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 lg:p-7 ring-1 ring-slate-900/5 h-full overflow-hidden group hover:ring-[#1E9BE0]/20 transition-all">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#1E9BE0]/5 blur-2xl pointer-events-none group-hover:bg-[#5CC63D]/10 transition-colors" />
                  <div className="relative">
  <div className="text-[#1E9BE0] mb-4 group-hover:text-[#5CC63D] transition-colors">
    {iconFn("w-8 h-8")}
  </div>
  <div className="text-[42px] lg:text-[54px] font-extrabold tracking-[-0.03em] text-slate-900 leading-none">
                      <AnimatedNumber value={s.value} suffix={s.suffix || ""} />
                    </div>
                    <div className="mt-3 text-[14px] text-slate-600 font-medium leading-snug">{s.label}</div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
  
}
/* ============================================================
   FAQ — accordéon
============================================================ */
export function FAQItem({ item, isOpen, onToggle }: { item: SiteContent["faq"]["items"][number]; isOpen: boolean; onToggle: () => void }) {
  const ref = useRef<any>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
  }, [item.a, isOpen]);

  return (
    <div className={`bg-white rounded-2xl ring-1 transition-all duration-300 overflow-hidden ${isOpen ? "ring-[#1E9BE0]/30 shadow-[0_12px_36px_-16px_rgba(30,155,224,0.25)]" : "ring-slate-900/5 hover:ring-slate-900/10"}`}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start justify-between gap-4 px-5 lg:px-6 py-5 text-left"
      >
        <span className={`text-[15px] lg:text-[16px] font-semibold leading-snug transition-colors ${isOpen ? "text-[#1E9BE0]" : "text-slate-900"}`}>
          {item.q}
        </span>
        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-[#1E9BE0] text-white rotate-180" : "bg-slate-100 text-slate-500"}`}>
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        style={{ maxHeight: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
        className="transition-all duration-300 ease-out overflow-hidden"
      >
        <div ref={ref} className="px-5 lg:px-6 pb-5 -mt-1">
          <div className="text-[14px] text-slate-600 leading-relaxed">{item.a}</div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection({ content }: { content: SiteContent }) {
  const faq = content.faq || { items: [] };
  const items = (faq.items || []).filter((f) => f.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
  const [openId, setOpenId] = useState(items[0]?.id || null);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-10 lg:py-16 bg-slate-50/70">
      <div className="max-w-4xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">FAQ</div>
            <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">
              {faq.title || "Questions fréquentes"}
            </h2>
            {faq.subtitle && <p className="mt-4 text-[15.5px] text-slate-600 max-w-lg mx-auto">{faq.subtitle}</p>}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 40}>
                <FAQItem
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              </Reveal>
            ))}
          </div>
        </Reveal>

        {/* CTA après FAQ */}
        {(faq.ctaTitle || faq.ctaButton) && (
          <Reveal delay={200}>
            <div className="mt-12 bg-gradient-to-br from-[#0A2A6B] to-[#071B4C] rounded-3xl p-8 lg:p-10 text-center text-white relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#5CC63D]/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <h3 className="text-[22px] lg:text-[26px] font-extrabold tracking-[-0.02em] leading-tight">
                  {faq.ctaTitle || "Vous avez une autre question ?"}
                </h3>
                <p className="mt-3 text-[15px] text-white/70 max-w-md mx-auto">
                  {faq.ctaText || "Écrivez-nous sur WhatsApp, nous répondons en moins d'une heure."}
                </p>
                <a
                  href={waLink("Bonjour Eco Clean Expert, j'ai une question à propos de vos services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 bg-[#2E7D22] hover:bg-[#25681A] text-white font-semibold px-7 py-3.5 rounded-full transition-all shadow-[0_14px_40px_-12px_rgba(92,198,61,0.7)]"
                >
                  {I.wa("w-5 h-5")} {faq.ctaButton || "Poser ma question"}
                </a>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
/* ============================================================
   FORMULAIRE DE CONTACT + ENVOI WHATSAPP
============================================================ */
