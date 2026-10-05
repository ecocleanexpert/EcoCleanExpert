"use client";

import { useEffect } from "react";
import { I } from "@/lib/icons";
import { LogoBlock } from "@/components/chrome";
import type { SiteContent } from "@/lib/defaultContent";

export function LegalPage({ content, type, onBack }: { content: SiteContent; type: "mentions" | "privacy"; onBack: (t?: string) => void }) {
  const legal = content.legal || {};
  const page = type === "privacy" ? legal.privacy : legal.mentions;
  const company = legal.company || {};
  if (!page) return null;

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header simple */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-4">
          <button onClick={() => onBack()} className="inline-flex items-center gap-2 text-[13.5px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
            {I.arrowL("w-4 h-4")} Retour au site
          </button>
          <LogoBlock content={content} variant="header" />
        </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-5 lg:px-8 py-10 lg:py-16">
        <div className="text-center mb-10 lg:mb-14">
          <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Informations légales</div>
          <h1 className="mt-3 text-[30px] sm:text-[38px] lg:text-[44px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">
            {page.title}
          </h1>
          <p className="mt-4 text-[12.5px] text-slate-500">
            Dernière mise à jour : {company.lastUpdate || "—"}
          </p>
        </div>

        {/* Encart synthèse */}
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 mb-8">
          <p className="text-[14.5px] text-slate-700 leading-relaxed">{page.intro}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {page.sections.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 lg:p-7">
              <h2 className="text-[17px] lg:text-[18px] font-bold text-slate-900 mb-3">{s.title}</h2>
              <div className="text-[14px] text-slate-600 leading-relaxed whitespace-pre-wrap">{s.body}</div>
            </div>
          ))}
        </div>

        {/* Bloc contact */}
        <div className="mt-10 bg-gradient-to-br from-[#0A2A6B] to-[#071B4C] rounded-2xl p-6 lg:p-8 text-white">
          <h3 className="text-[17px] lg:text-[19px] font-extrabold tracking-[-0.02em]">
            Une question sur ces informations ?
          </h3>
          <p className="mt-2 text-[14px] text-white/70">
            Notre équipe reste à votre disposition pour toute précision.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${company.email || "contact@ecocleanexpert.ci"}`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold px-5 py-3 rounded-xl transition-colors text-[13.5px] border border-white/15"
            >
              {I.mail("w-4 h-4")} {company.email || "contact@ecocleanexpert.ci"}
            </a>
            <a
              href={`tel:${(company.phone || content.contact.phone).replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 bg-[#5CC63D] hover:bg-[#4CAF50] text-white font-semibold px-5 py-3 rounded-xl transition-colors text-[13.5px]"
            >
              {I.phone("w-4 h-4")} {company.phone || content.contact.phone}
            </a>
          </div>
        </div>

        {/* Navigation entre les pages */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {type === "privacy" ? (
            <button onClick={() => onBack("mentions")} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors text-[13.5px]">
              Voir les mentions légales
            </button>
          ) : (
            <button onClick={() => onBack("privacy")} className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors text-[13.5px]">
              Voir la politique de confidentialité
            </button>
          )}
          <button onClick={() => onBack()} className="inline-flex items-center justify-center gap-2 bg-[#0A2A6B] hover:bg-[#071B4C] text-white font-semibold px-5 py-3 rounded-xl transition-colors text-[13.5px]">
            {I.home("w-4 h-4")} Retour à l'accueil
          </button>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   LANDING
============================================================ */
