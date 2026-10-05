"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Btn, Confirm, TextArea, TextField, Toggle } from "@/components/fields";
import type { SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminFAQ({ content, setContent, onToast }: { content: SiteContent; setContent: SetContent; onToast: ToastFn }) {
  const faq = content.faq || { title: "", subtitle: "", ctaTitle: "", ctaText: "", ctaButton: "", items: [] };
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [confirmDel, setConfirmDel] = useState<any>(null);
  const [header, setHeader] = useState({
    title: faq.title || "",
    subtitle: faq.subtitle || "",
    ctaTitle: faq.ctaTitle || "",
    ctaText: faq.ctaText || "",
    ctaButton: faq.ctaButton || "",
  });

  const saveHeader = () => {
    setContent((c) => ({ ...c, faq: { ...c.faq, ...header } }));
    onToast("En-tête FAQ enregistré");
  };

  const openNew = () => { setDraft({ q: "", a: "", active: true }); setEditing("new"); };
  const openEdit = (f: any) => { setDraft({ ...f }); setEditing(f.id); };

  const save = () => {
    if (!draft.q?.trim()) { onToast("La question est obligatoire", "error"); return; }
    if (!draft.a?.trim()) { onToast("La réponse est obligatoire", "error"); return; }
    setContent((c) => {
      const items = c.faq?.items || [];
      if (editing === "new") {
        const id = Math.max(0, ...items.map((f) => f.id)) + 1;
        return { ...c, faq: { ...c.faq, items: [...items, { ...draft, id, order: items.length + 1 }] } };
      }
      return { ...c, faq: { ...c.faq, items: items.map((f) => (f.id === editing ? { ...f, ...draft } : f)) } };
    });
    onToast(editing === "new" ? "Question ajoutée" : "Question modifiée");
    setEditing(null);
  };

  const remove = (id: any) => {
    setContent((c) => ({ ...c, faq: { ...c.faq, items: (c.faq?.items || []).filter((f) => f.id !== id) } }));
    onToast("Question supprimée");
    setConfirmDel(null);
  };
  const toggle = (id: any) => setContent((c) => ({ ...c, faq: { ...c.faq, items: (c.faq?.items || []).map((f) => (f.id === id ? { ...f, active: !f.active } : f)) } }));
  const move = (id: any, dir: any) => setContent((c) => {
    const list = [...(c.faq?.items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const i = list.findIndex((f) => f.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return c;
    [list[i], list[j]] = [list[j], list[i]];
    return { ...c, faq: { ...c.faq, items: list.map((f, k) => ({ ...f, order: k + 1 })) } };
  });

  const items = (faq.items || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">FAQ</h1>
          <p className="text-[14px] text-slate-500 mt-1">Répondez aux questions fréquentes de vos clients pour lever leurs objections.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew}>Nouvelle question</Btn>
      </div>

      {/* En-tête de la section */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-4">
        <h2 className="text-[15px] font-bold text-slate-900">En-tête de la section</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Titre" value={header.title} onChange={(v) => setHeader({ ...header, title: v })} placeholder="Ex : Questions fréquentes" />
          <TextField label="Sous-titre" value={header.subtitle} onChange={(v) => setHeader({ ...header, subtitle: v })} placeholder="Ex : Tout ce que vous devez savoir." />
        </div>
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">Bloc CTA en bas de FAQ</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Titre du CTA" value={header.ctaTitle} onChange={(v) => setHeader({ ...header, ctaTitle: v })} placeholder="Ex : Vous avez une autre question ?" />
            <TextField label="Texte du bouton" value={header.ctaButton} onChange={(v) => setHeader({ ...header, ctaButton: v })} placeholder="Ex : Poser ma question" />
            <div className="sm:col-span-2">
              <TextField label="Texte descriptif" value={header.ctaText} onChange={(v) => setHeader({ ...header, ctaText: v })} placeholder="Ex : Écrivez-nous sur WhatsApp." />
            </div>
          </div>
        </div>
        <Btn variant="primary" size="sm" icon={I.save("w-4 h-4")} onClick={saveHeader}>Enregistrer l'en-tête</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouvelle question" : "Modifier la question"}</h2>
          <div className="mt-5 space-y-4">
            <TextField label="Question" value={draft.q || ""} onChange={(v) => setDraft({ ...draft, q: v })} placeholder="Ex : Combien de temps dure une intervention ?" />
            <TextArea label="Réponse" value={draft.a || ""} onChange={(v) => setDraft({ ...draft, a: v })} placeholder="Réponse détaillée et rassurante..." rows={4} />
            <Toggle checked={draft.active !== false} onChange={(v) => setDraft({ ...draft, active: v })} label="Visible sur le site" />
          </div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      {items.length === 0 && editing === null ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center mx-auto">{I.info("w-6 h-6")}</div>
          <p className="mt-4 text-[14px] font-semibold text-slate-700">Aucune question pour le moment</p>
          <p className="mt-1 text-[13px] text-slate-500">Ajoutez les questions que vos clients vous posent le plus souvent.</p>
          <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew} className="mt-4">Ajouter ma première question</Btn>
        </div>
      ) : items.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {items.map((f) => (
              <div key={f.id} className="px-5 py-4 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[13px] font-bold">{f.order}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-slate-900 truncate">{f.q}</span>
                    {!f.active && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded shrink-0">Masquée</span>}
                  </div>
                  <div className="text-[13px] text-slate-500 line-clamp-2">{f.a}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => move(f.id, -1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Monter"><span style={{ transform: "rotate(90deg)", display: "inline-block" }}>{I.arrowL("w-4 h-4")}</span></button>
                  <button onClick={() => move(f.id, 1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Descendre"><span style={{ transform: "rotate(90deg)", display: "inline-block" }}>{I.arrow("w-4 h-4")}</span></button>
                  <button onClick={() => toggle(f.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Activer/désactiver">{f.active !== false ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                  <button onClick={() => openEdit(f)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Modifier">{I.pencil("w-4 h-4")}</button>
                  <button onClick={() => setConfirmDel(f)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" aria-label="Supprimer">{I.trash("w-4 h-4")}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Confirm open={!!confirmDel} title="Supprimer cette question ?" message={`"${confirmDel?.q}" sera définitivement supprimée.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}

/* ============================================================
   ADMIN — MENTIONS LÉGALES & CONFIDENTIALITÉ
============================================================ */
