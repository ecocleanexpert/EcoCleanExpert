"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Img } from "@/components/ui";
import { Btn, Confirm, ImageField, MediaPicker, TextField, Toggle } from "@/components/fields";
import type { MediaItem, SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminBeforeAfter({ content, setContent, media, onToast }: { content: SiteContent; setContent: SetContent; media: MediaItem[]; onToast: ToastFn }) {
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [pickerFor, setPickerFor] = useState<any>(null);
  const [confirmDel, setConfirmDel] = useState<any>(null);

  const openNew = () => { setDraft({ title: "", desc: "", before: "", after: "", active: true }); setEditing("new"); };
  const openEdit = (b: any) => { setDraft({ ...b }); setEditing(b.id); };

  const save = () => {
    if (!draft.title?.trim()) { onToast("Le titre est obligatoire", "error"); return; }
    if (!draft.before || !draft.after) { onToast("Ajoutez les images AVANT et APRÈS", "error"); return; }
    setContent((c) => {
      if (editing === "new") {
        const id = Math.max(0, ...c.beforeAfter.map((b) => b.id)) + 1;
        return { ...c, beforeAfter: [...c.beforeAfter, { ...draft, id }] };
      }
      return { ...c, beforeAfter: c.beforeAfter.map((b) => (b.id === editing ? { ...b, ...draft } : b)) };
    });
    onToast(editing === "new" ? "Transformation ajoutée" : "Transformation modifiée");
    setEditing(null);
  };

  const remove = (id: any) => { setContent((c) => ({ ...c, beforeAfter: c.beforeAfter.filter((b) => b.id !== id) })); onToast("Transformation supprimée"); setConfirmDel(null); };
  const toggle = (id: any) => setContent((c) => ({ ...c, beforeAfter: c.beforeAfter.map((b) => (b.id === id ? { ...b, active: !b.active } : b)) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Avant / Après</h1>
          <p className="text-[14px] text-slate-500 mt-1">Gérez vos transformations avant / après.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew}>Nouvelle transformation</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouvelle transformation" : "Modifier la transformation"}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <ImageField label="Image AVANT" value={draft.before} onChange={(v) => setDraft({ ...draft, before: v })} onOpenLibrary={() => setPickerFor("before")} aspect="aspect-[16/10]" />
            <ImageField label="Image APRÈS" value={draft.after} onChange={(v) => setDraft({ ...draft, after: v })} onOpenLibrary={() => setPickerFor("after")} aspect="aspect-[16/10]" />
            <div className="sm:col-span-2"><TextField label="Titre" value={draft.title || ""} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Ex : Canapé 3 places — Cocody" /></div>
            <div className="sm:col-span-2"><TextField label="Description" value={draft.desc || ""} onChange={(v) => setDraft({ ...draft, desc: v })} placeholder="Ex : Détachage complet et extraction." /></div>
            <div className="sm:col-span-2"><Toggle checked={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} label="Visible sur le site" /></div>
          </div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {content.beforeAfter.map((b) => (
            <div key={b.id} className="px-5 py-4 flex items-center gap-4">
              <div className="flex gap-1 shrink-0">
                <div className="w-16 h-12 rounded-lg overflow-hidden ring-1 ring-slate-900/5"><Img src={b.before} alt="avant" className="w-full h-full object-cover" /></div>
                <div className="w-16 h-12 rounded-lg overflow-hidden ring-1 ring-slate-900/5"><Img src={b.after} alt="après" className="w-full h-full object-cover" /></div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14.5px] font-semibold text-slate-900 truncate">{b.title}</span>
                  {!b.active && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Inactif</span>}
                </div>
                <div className="text-[13px] text-slate-500 truncate">{b.desc}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(b.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{b.active ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{I.pencil("w-4 h-4")}</button>
                <button onClick={() => setConfirmDel(b)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">{I.trash("w-4 h-4")}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaPicker open={pickerFor !== null} onClose={() => setPickerFor(null)} media={media} onPick={(url) => setDraft({ ...draft, [pickerFor]: url })} />
      <Confirm open={!!confirmDel} title="Supprimer cette transformation ?" message={`"${confirmDel?.title}" sera définitivement supprimée.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}

/* ============================================================
   ADMIN TÉMOIGNAGES
============================================================ */
