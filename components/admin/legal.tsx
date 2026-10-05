"use client";

import { useEffect, useState } from "react";
import { I } from "@/lib/icons";
import { Btn, TextArea, TextField } from "@/components/fields";
import type { SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminLegal({ content, setContent, onToast }: { content: SiteContent; setContent: SetContent; onToast: ToastFn }) {
  const legal = content.legal || {};
  const [tab, setTab] = useState("company");
  const [draft, setDraft] = useState(legal);

  useEffect(() => { setDraft(legal); }, [legal]);

  const updateCompany = (k: any, v: any) => setDraft({ ...draft, company: { ...draft.company, [k]: v } });
  const updateMentions = (k: any, v: any) => setDraft({ ...draft, mentions: { ...draft.mentions, [k]: v } });
  const updatePrivacy = (k: any, v: any) => setDraft({ ...draft, privacy: { ...draft.privacy, [k]: v } });
  const updateSection = (which: any, i: any, k: any, v: any) => {
    const key = which === "mentions" ? "mentions" : "privacy";
    const arr = [...(draft[key]?.sections || [])];
    arr[i] = { ...arr[i], [k]: v };
    setDraft({ ...draft, [key]: { ...draft[key], sections: arr } });
  };
  const addSection = (which: any) => {
    const key = which === "mentions" ? "mentions" : "privacy";
    const arr = [...(draft[key]?.sections || [])];
    const id = Math.max(0, ...arr.map((s) => s.id)) + 1;
    arr.push({ id, title: "Nouvelle section", body: "" });
    setDraft({ ...draft, [key]: { ...draft[key], sections: arr } });
  };
  const removeSection = (which: any, id: any) => {
    const key = which === "mentions" ? "mentions" : "privacy";
    const arr = (draft[key]?.sections || []).filter((s) => s.id !== id);
    setDraft({ ...draft, [key]: { ...draft[key], sections: arr } });
  };

  const save = () => { setContent((c) => ({ ...c, legal: draft })); onToast("Pages légales enregistrées"); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Pages légales</h1>
          <p className="text-[14px] text-slate-500 mt-1">Complétez vos informations légales obligatoires. Pensez à renseigner RCCM et CC.</p>
        </div>
        <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "company", label: "Informations entreprise" },
          { key: "mentions", label: "Mentions légales" },
          { key: "privacy", label: "Politique de confidentialité" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-colors ${
              tab === t.key ? "bg-[#0A2A6B] text-white" : "bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-slate-900/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Onglet : Informations entreprise */}
      {tab === "company" && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-5">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 mb-4">Informations officielles</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Nom de l'entreprise" value={draft.company?.name || ""} onChange={(v) => updateCompany("name", v)} />
              <TextField label="Forme juridique" value={draft.company?.legalForm || ""} onChange={(v) => updateCompany("legalForm", v)} placeholder="Ex : Entreprise individuelle" />
              <div className="sm:col-span-2">
                <TextField label="Adresse complète" value={draft.company?.address || ""} onChange={(v) => updateCompany("address", v)} placeholder="Ex : Cocody Angré, 7ème tranche, Abidjan" />
              </div>
              <TextField label="RCCM" value={draft.company?.rccm || ""} onChange={(v) => updateCompany("rccm", v)} placeholder="Ex : CI-ABJ-2024-B-12345" />
              <TextField label="Compte Contribuable (CC)" value={draft.company?.cc || ""} onChange={(v) => updateCompany("cc", v)} placeholder="Ex : 2400123 A" />
              <TextField label="Téléphone" value={draft.company?.phone || ""} onChange={(v) => updateCompany("phone", v)} />
              <TextField label="Email de contact" value={draft.company?.email || ""} onChange={(v) => updateCompany("email", v)} placeholder="contact@ecocleanexpert.ci" />
              <TextField label="Directeur de la publication" value={draft.company?.director || ""} onChange={(v) => updateCompany("director", v)} placeholder="Nom du responsable légal" />
              <TextField label="Hébergeur" value={draft.company?.hosting || ""} onChange={(v) => updateCompany("hosting", v)} placeholder="Nom + adresse de l'hébergeur" />
              <TextField label="Dernière mise à jour" value={draft.company?.lastUpdate || ""} onChange={(v) => updateCompany("lastUpdate", v)} placeholder="Ex : Janvier 2025" />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">{I.info("w-4 h-4")}</div>
            <div className="text-[13px] text-amber-900 leading-relaxed">
              <strong>Important :</strong> Le RCCM et le CC sont <strong>obligatoires</strong> sur un site commercial en Côte d'Ivoire. Si vous ne les avez pas encore, contactez le CEPICI ou la Chambre de Commerce d'Abidjan pour les obtenir.
            </div>
          </div>
        </div>
      )}

      {/* Onglet : Mentions légales */}
      {tab === "mentions" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Titre de la page" value={draft.mentions?.title || ""} onChange={(v) => updateMentions("title", v)} />
            </div>
            <TextArea label="Introduction" value={draft.mentions?.intro || ""} onChange={(v) => updateMentions("intro", v)} rows={3} />
          </div>

          <div className="space-y-3">
            {(draft.mentions?.sections || []).map((s, i) => (
              <div key={s.id} className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center text-[12px] font-bold shrink-0">{i + 1}</span>
                  <input
                    value={s.title}
                    onChange={(e) => updateSection("mentions", i, "title", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-[#1E9BE0] outline-none text-[14px] font-semibold"
                  />
                  <button onClick={() => removeSection("mentions", s.id)} className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center shrink-0" aria-label="Supprimer">
                    {I.trash("w-4 h-4")}
                  </button>
                </div>
                <textarea
                  value={s.body}
                  onChange={(e) => updateSection("mentions", i, "body", e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] outline-none text-[13.5px] resize-y"
                />
              </div>
            ))}
            <button onClick={() => addSection("mentions")} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#1E9BE0] text-[13px] font-semibold text-slate-500 hover:text-[#1E9BE0] transition-colors flex items-center justify-center gap-2">
              {I.plus("w-4 h-4")} Ajouter une section
            </button>
          </div>
        </div>
      )}

      {/* Onglet : Confidentialité */}
      {tab === "privacy" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <TextField label="Titre de la page" value={draft.privacy?.title || ""} onChange={(v) => updatePrivacy("title", v)} />
            </div>
            <TextArea label="Introduction" value={draft.privacy?.intro || ""} onChange={(v) => updatePrivacy("intro", v)} rows={3} />
          </div>

          <div className="space-y-3">
            {(draft.privacy?.sections || []).map((s, i) => (
              <div key={s.id} className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#5CC63D]/10 text-[#5CC63D] flex items-center justify-center text-[12px] font-bold shrink-0">{i + 1}</span>
                  <input
                    value={s.title}
                    onChange={(e) => updateSection("privacy", i, "title", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-[#5CC63D] outline-none text-[14px] font-semibold"
                  />
                  <button onClick={() => removeSection("privacy", s.id)} className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center shrink-0" aria-label="Supprimer">
                    {I.trash("w-4 h-4")}
                  </button>
                </div>
                <textarea
                  value={s.body}
                  onChange={(e) => updateSection("privacy", i, "body", e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#5CC63D] outline-none text-[13.5px] resize-y"
                />
              </div>
            ))}
            <button onClick={() => addSection("privacy")} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#5CC63D] text-[13px] font-semibold text-slate-500 hover:text-[#5CC63D] transition-colors flex items-center justify-center gap-2">
              {I.plus("w-4 h-4")} Ajouter une section
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Btn variant="primary" size="lg" icon={I.save("w-5 h-5")} onClick={save}>Enregistrer les pages légales</Btn>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN SERVICES
============================================================ */
