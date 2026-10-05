"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import { Img, Reveal } from "@/components/ui";
import type { SiteContent } from "@/lib/defaultContent";
import { slugify } from "@/lib/slugs";

export function Services({ content }: { content: SiteContent }) {
  const iconMap: Record<string, (c?: string) => JSX.Element> = { sofa: I.sofa, chair: I.chair, carpet: I.carpet, car: I.car, building: I.building, hammer: I.hammer };
  const items = content.services.filter((s) => s.active).sort((a, b) => a.order - b.order);
  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 lg:mb-14">
            <div>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Nos services</div>
              <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08] max-w-xl">Des solutions de nettoyage pour tous vos espaces.</h2>
            </div>
            <a href="#contact" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1E9BE0] hover:gap-3 transition-all shrink-0">Demander un devis {I.arrow("w-4 h-4")}</a>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {items.map((s, i) => {
            const iconFn = iconMap[s.icon] || I.spark;
            return (
              <Reveal key={s.id} delay={i * 60}>
                <article className="group bg-white rounded-2xl overflow-hidden ring-1 ring-slate-900/5 hover:ring-[#1E9BE0]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <Img src={s.image} alt={`${s.title} — nettoyage professionnel Abidjan`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 to-transparent" />
<div className="absolute bottom-3 left-3 w-11 h-11 rounded-xl bg-slate-900/45 backdrop-blur flex items-center justify-center text-white shadow-md">{iconFn("w-5 h-5")}</div>                  </div>
                  <div className="p-5">
                    <h3 className="text-[17px] font-bold text-slate-900">
                      <a href={`/services/${slugify(s.title)}`} className="hover:text-[#1E9BE0] transition-colors">{s.title}</a>
                    </h3>
                    <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[13px] font-semibold text-[#0A2A6B]">{s.price}</span>
                      <a href={waLink(`Bonjour, je souhaite un devis pour : ${s.title}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-700 hover:text-[#5CC63D] transition-colors">Devis {I.wa("w-4 h-4")}</a>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   COMPARE
============================================================ */
export function Compare({ before, after, title }: { before: string; after: string; title?: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<any>(null);
  const dragging = useRef(false);
  const update = useCallback((clientX: any) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);
  useEffect(() => {
    const move = (e: any) => { if (dragging.current) update(e.clientX); };
    const up = () => { dragging.current = false; };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up); };
  }, [update]);
  return (
    <div ref={ref} role="slider" aria-label={`Comparaison — ${title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} tabIndex={0}
      onKeyDown={(e) => { if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4)); if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4)); }}
      onPointerDown={(e) => { dragging.current = true; update(e.clientX); }}
      className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden select-none touch-none cursor-ew-resize ring-1 ring-slate-900/10 outline-none focus-visible:ring-2 focus-visible:ring-[#5CC63D]">
      <Img src={after} alt={`Après — ${title}`} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img src={before} alt={`Avant — ${title}`} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold tracking-wide uppercase">Avant</span>
      <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-[#5CC63D] text-white text-[11px] font-bold tracking-wide uppercase">Après</span>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.15)]" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-lg ring-1 ring-slate-900/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6-4 6 4 6M15 6l4 6-4 6" /></svg>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter({ content }: { content: SiteContent }) {
  const items = content.beforeAfter.filter((b) => b.active);
  const [idx, setIdx] = useState(0);
  const current = items[idx];
  if (!current) return null;
  return (
    <section id="avant-apres" className="py-16 lg:py-24 bg-[#0A2A6B] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          <div>
            <Reveal>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#5CC63D] uppercase">Avant / Après</div>
              <h2 className="mt-4 text-[30px] sm:text-[38px] lg:text-[46px] font-extrabold tracking-[-0.02em] leading-[1.06]">La transformation parle d'elle-même.</h2>
              <p className="mt-5 text-[16px] text-white/70 leading-relaxed max-w-md">Découvrez le résultat réel de nos interventions sur des canapés, tapis, fauteuils et bien plus encore.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8 flex gap-3">
                {items.map((it, i) => (
                  <button key={it.id} onClick={() => setIdx(i)} aria-label={`Voir ${it.title}`} className={`relative w-20 h-16 rounded-xl overflow-hidden ring-2 transition-all ${i === idx ? "ring-[#5CC63D] scale-105" : "ring-white/15 hover:ring-white/40"}`}>
                    <Img src={it.before} alt={it.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Reveal>
            {current && (<Reveal delay={180}><div className="mt-8 hidden lg:block"><h3 className="text-[18px] font-bold">{current.title}</h3><p className="mt-1.5 text-[14px] text-white/60 max-w-sm">{current.desc}</p></div></Reveal>)}
          </div>
          <Reveal delay={100}>
            <div className="relative">
              {current && <Compare before={current.before} after={current.after} title={current.title} />}
              {current && (<div className="mt-4 lg:hidden"><h3 className="text-[16px] font-bold">{current.title}</h3><p className="mt-1 text-[13px] text-white/60">{current.desc}</p></div>)}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
============================================================ */
export function HowItWorks({ content }: { content: SiteContent }) {
  return (
    <section id="process" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal><div className="text-center max-w-2xl mx-auto"><div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Comment ça marche ?</div><h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">Un service simple et rapide.</h2></div></Reveal>
        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-[38px] left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          {content.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-[76px] h-[76px] rounded-2xl bg-white ring-1 ring-slate-900/5 shadow-[0_14px_36px_-18px_rgba(15,23,42,0.3)] relative z-10">
                  <span className="text-[22px] font-extrabold text-[#1E9BE0]">{s.n}</span>
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#5CC63D]" />
                </div>
                <h3 className="mt-5 text-[16px] font-bold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-[14px] text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   WHY US
============================================================ */
export function WhyUs({ content }: { content: SiteContent }) {
  const iconMap: Record<string, (c?: string) => JSX.Element> = { users: I.users, shield: I.shield, spark: I.spark, home: I.home, pin: I.pin };
  return (
    <section id="pourquoi" className="py-16 lg:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_70px_-30px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5">
              <Img src={content.whyUsImage} alt="Équipe Eco Clean Expert avec son matériel professionnel à Abidjan" className="w-full h-[340px] sm:h-[440px] lg:h-[520px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A6B]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-[11px] font-semibold tracking-wide uppercase">{I.pin("w-3.5 h-3.5")} Abidjan, Côte d'Ivoire</div></div>
            </div>
          </Reveal>
          <div>
            <Reveal><div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">À propos</div><h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">Pourquoi choisir Eco Clean Expert ?</h2></Reveal>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {content.pillars.map((p, i) => {
                const iconFn = iconMap[p.icon] || I.spark;
                return (
                  <Reveal key={p.title} delay={i * 70}>
                    <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 h-full">
<div className="text-[#1E9BE0]">{iconFn("w-7 h-7")}</div>                      <h3 className="mt-4 text-[15px] font-bold text-slate-900">{p.title}</h3>
                      <p className="mt-1 text-[13.5px] text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION — NOTRE GROUPE (entreprise mère)
============================================================ */
export function ParentCompanySection({ content }: { content: SiteContent }) {
  const pc = content.parentCompany || {};
  if (!pc.name || pc.showInAbout === false) return null;

  return (
    <section id="groupe" className="py-16 lg:py-24 bg-gradient-to-br from-[#071B2C] to-[#0A2A6B] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
                <img
                  src={pc.logo || "images/julmarketing-logo.png"}
                  alt={pc.name}
                  width={340}
                  height={200}
                  className="w-full max-w-[340px] mx-auto object-contain"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 px-4 py-2 bg-[#5CC63D] rounded-full text-white text-[11px] font-bold uppercase tracking-wider shadow-lg">
                Groupe
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#5CC63D] uppercase">Notre groupe</div>
              <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] leading-[1.08]">
                {pc.name}
                {pc.legalForm && <span className="text-[#5CC63D]"> {pc.legalForm}</span>}
              </h2>
              <p className="mt-5 text-[16px] text-white/75 leading-relaxed max-w-xl">
                {pc.shortIntro || `Eco Clean Expert est une marque du groupe ${pc.name}, entreprise multisectorielle basée à Abidjan.`}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#5CC63D]/20 text-[#5CC63D] flex items-center justify-center shrink-0">
                    {I.shield("w-5 h-5")}
                  </div>
                  <div>
                    <p className="text-[13px] text-white/80 leading-relaxed">
                      <strong className="text-white">Pourquoi c'est important pour vous :</strong> en tant que branche spécialisée du groupe {pc.name}, Eco Clean Expert bénéficie de la solidité, de la confiance et des moyens d'une entreprise multisectorielle établie à Abidjan.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION NOS CHIFFRES — compteurs animés
============================================================ */
