"use client";

import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import { Img, Reveal } from "@/components/ui";
import type { SiteContent } from "@/lib/defaultContent";

export function Pricing({ content }: { content: SiteContent }) {
  const items = content.services.filter((s) => s.active).sort((a, b) => a.order - b.order);
  const iconMap: Record<string, (c?: string) => JSX.Element> = { sofa: I.sofa, chair: I.chair, carpet: I.carpet, car: I.car, building: I.building, hammer: I.hammer };
  return (
    <section id="tarifs" className="py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Tarifs</div>
            <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">Des prix clairs, un devis rapide.</h2>
            <p className="mt-4 text-[15px] text-slate-600 max-w-lg mx-auto">Les tarifs définitifs dépendent de la surface, de l'état et du type de tissu. Contactez-nous pour un devis précis.</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="mt-10 bg-white rounded-3xl ring-1 ring-slate-900/5 overflow-hidden shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)]">
            {items.map((s, i) => {
              const iconFn = iconMap[s.icon] || I.spark;
              return (
                <div key={s.id} className={`flex items-center justify-between gap-4 px-6 py-5 ${i !== items.length - 1 ? "border-b border-slate-100" : ""}`}>
                  <div className="flex items-center gap-4 min-w-0">
<span className="text-[#1E9BE0] shrink-0">{iconFn("w-6 h-6")}</span>                    <div className="min-w-0"><div className="text-[15px] font-semibold text-slate-900 truncate">{s.title}</div><div className="text-[13px] text-slate-500 truncate">{s.desc}</div></div>
                  </div>
                  <div className="text-right shrink-0"><div className="text-[14px] font-bold text-[#0A2A6B]">{s.price}</div></div>
                </div>
              );
            })}
            <div className="px-6 py-5 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[13px] text-slate-600">Un besoin spécifique ? Nous établissons un devis personnalisé.</span>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#5CC63D] hover:bg-[#4CAF50] text-white text-[14px] font-semibold px-5 py-3 rounded-full transition-colors">{I.wa("w-4 h-4")} Demander un devis</a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
============================================================ */
export function Testimonials({ content }: { content: SiteContent }) {
  const has = content.testimonials && content.testimonials.length > 0;
  return (
    <section id="avis" className="py-16 lg:py-24 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Avis clients</div>
              <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">Ils nous font confiance.</h2>
            </div>
          </div>
        </Reveal>
        {has ? (
          <div className="grid md:grid-cols-3 gap-5">
            {content.testimonials.filter(t => t.active !== false).map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <article className="bg-white rounded-2xl p-6 ring-1 ring-slate-900/5 h-full">
                  <div className="flex items-center gap-3">
                    <Img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="text-[14px] font-bold text-slate-900">{t.name}</div>
                      <div className="flex gap-0.5 text-[#F59E0B] mt-0.5">{Array.from({ length: t.rating || 5 }).map((_, k) => <span key={k}>{I.star("w-3.5 h-3.5")}</span>)}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] text-slate-600 leading-relaxed">"{t.text}"</p>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="grid md:grid-cols-3 gap-5">
              {[0, 1, 2].map((k) => (
                <div key={k} className="bg-white/60 rounded-2xl p-6 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center min-h-[180px]">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">{I.users("w-5 h-5")}</div>
                  <p className="mt-4 text-[13px] font-semibold text-slate-500">Espace réservé</p>
                  <p className="mt-1 text-[12px] text-slate-400 max-w-[200px]">Vos vrais témoignages clients s'afficheront ici. Ajoutez-les depuis l'administration.</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   ZONES
============================================================ */
export function Zones({ content }: { content: SiteContent }) {
  const zones = content.zones.filter((z) => z.active);
  return (
    <section id="zones" className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <Reveal>
              <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Zones d'intervention</div>
              <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">Nous intervenons partout à Abidjan.</h2>
              <p className="mt-5 text-[15.5px] text-slate-600 leading-relaxed max-w-md">Vous ne trouvez pas votre commune ? Contactez-nous, nous étudions chaque demande.</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {zones.map((z) => (<span key={z.id} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-50 ring-1 ring-slate-900/5 text-[13.5px] font-medium text-slate-700">{I.pin("w-3.5 h-3.5")} {z.name}</span>))}
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E9BE0]/10 text-[13.5px] font-semibold text-[#1E9BE0]">+ et autres communes</span>
              </div>
            </Reveal>
            <Reveal delay={200}><a href={waLink("Bonjour, intervenez-vous dans ma commune à Abidjan ?")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 bg-[#5CC63D] hover:bg-[#4CAF50] text-white font-semibold px-6 py-3.5 rounded-full transition-colors">{I.wa("w-5 h-5")} Vérifier ma commune</a></Reveal>
          </div>
          <Reveal delay={100}>
            <div className="relative rounded-3xl overflow-hidden ring-1 ring-slate-900/5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)]">
              <Img src="images/abidjan.webp" alt="Vue d'Abidjan — zone d'intervention" className="w-full h-[340px] sm:h-[420px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A6B]/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 bg-white/95 backdrop-blur rounded-2xl p-4">
                <div className="w-11 h-11 rounded-xl bg-[#5CC63D]/10 text-[#5CC63D] flex items-center justify-center shrink-0">{I.pin("w-5 h-5")}</div>
                <div className="leading-tight"><div className="text-[14px] font-bold text-slate-900">Abidjan, Côte d'Ivoire</div><div className="text-[12px] text-slate-500">Intervention à domicile & professionnels</div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
============================================================ */
export function FinalCTA({ content }: { content: SiteContent }) {
  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Img src={content.cta.image} alt="Intervention de nettoyage professionnel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2A6B]/95 via-[#0A2A6B]/85 to-[#0A2A6B]/60" />
      </div>
      <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-20 lg:py-28">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-[32px] sm:text-[42px] lg:text-[52px] font-extrabold tracking-[-0.02em] text-white leading-[1.05]">{content.cta.title}</h2>
            <p className="mt-5 text-[17px] text-white/75">{content.cta.subtitle}</p>
<div className="mt-8 flex flex-col sm:flex-row gap-3">
  <a
    href={waLink()}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2.5 bg-[#5CC63D] hover:bg-[#4CAF50] text-white font-semibold px-7 py-4 rounded-full transition-all shadow-[0_14px_40px_-12px_rgba(92,198,61,0.7)]"
  >
    {I.wa("w-5 h-5")} {content.cta.button}
  </a>
  <a
    href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
    className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-7 py-4 rounded-full transition-colors border border-white/20"
  >
    {I.phone("w-5 h-5")} Appeler maintenant
  </a>
</div>          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
============================================================ */
