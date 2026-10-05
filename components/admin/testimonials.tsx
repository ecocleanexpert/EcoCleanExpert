"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Img } from "@/components/ui";
import { Btn, Confirm, ImageField, MediaPicker, TextArea, TextField, Toggle } from "@/components/fields";
import type { MediaItem, SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminTestimonials({ content, setContent, media, onToast }: { content: SiteContent; setContent: SetContent; media: MediaItem[]; onToast: ToastFn }) {
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [pickerFor, setPickerFor] = useState<any>(null);
  const [confirmDel, setConfirmDel] = useState<any>(null);

  const openNew = () => { setDraft({ name: "", text: "", photo: "", rating: 5, active: true }); setEditing("new"); };
  const openEdit = (t: any) => { setDraft({ ...t }); setEditing(t.id); };

  const save = () => {
    if (!draft.name?.trim()) { onToast("Le prénom est obligatoire", "error"); return; }
    if (!draft.text?.trim()) { onToast("Le texte de l'avis est obligatoire", "error"); return; }
    setContent((c) => {
      if (editing === "new") {
        const id = Math.max(0, ...c.testimonials.map((t) => t.id)) + 1;
        return { ...c, testimonials: [...c.testimonials, { ...draft, id }] };
      }
      return { ...c, testimonials: c.testimonials.map((t) => (t.id === editing ? { ...t, ...draft } : t)) };
    });
    onToast(editing === "new" ? "Témoignage ajouté" : "Témoignage modifié");
    setEditing(null);
  };

  const remove = (id: any) => { setContent((c) => ({ ...c, testimonials: c.testimonials.filter((t) => t.id !== id) })); onToast("Témoignage supprimé"); setConfirmDel(null); };
  const toggle = (id: any) => setContent((c) => ({ ...c, testimonials: c.testimonials.map((t) => (t.id === id ? { ...t, active: t.active === false } : t)) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Témoignages</h1>
          <p className="text-[14px] text-slate-500 mt-1">Ajoutez et gérez les avis de vos clients.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew}>Nouveau témoignage</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouveau témoignage" : "Modifier le témoignage"}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <ImageField label="Photo du client" value={draft.photo} onChange={(v) => setDraft({ ...draft, photo: v })} onOpenLibrary={() => setPickerFor("photo")} hint="Optionnel" />
            <div className="space-y-4">
              <TextField label="Prénom" value={draft.name || ""} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="Ex : Aïcha K." />
              <div>
                <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">Note</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setDraft({ ...draft, rating: n })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${n <= (draft.rating || 5) ? "text-[#F59E0B]" : "text-slate-300"}`}>
                      {I.star("w-5 h-5")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="sm:col-span-2"><TextArea label="Texte de l'avis" value={draft.text || ""} onChange={(v) => setDraft({ ...draft, text: v })} placeholder="Ex : Mon canapé est comme neuf ! Service rapide et professionnel." rows={3} /></div>
            <div className="sm:col-span-2"><Toggle checked={draft.active !== false} onChange={(v) => setDraft({ ...draft, active: v })} label="Publié sur le site" /></div>
          </div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      {content.testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">{I.users("w-6 h-6")}</div>
          <p className="mt-4 text-[14px] font-semibold text-slate-700">Aucun témoignage pour le moment</p>
          <p className="mt-1 text-[13px] text-slate-500">Ajoutez votre premier témoignage client.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {content.testimonials.map((t) => (
              <div key={t.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-900/5">
                  <Img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-slate-900 truncate">{t.name}</span>
                    <span className="flex gap-0.5 text-[#F59E0B]">{Array.from({ length: t.rating || 5 }).map((_, k) => <span key={k}>{I.star("w-3 h-3")}</span>)}</span>
                    {t.active === false && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Masqué</span>}
                  </div>
                  <div className="text-[13px] text-slate-500 truncate">"{t.text}"</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button aria-label={t.active !== false ? "Désactiver" : "Activer"} onClick={() => toggle(t.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{t.active !== false ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                  <button aria-label="Modifier" onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{I.pencil("w-4 h-4")}</button>
                  <button aria-label="Supprimer" onClick={() => setConfirmDel(t)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">{I.trash("w-4 h-4")}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <MediaPicker open={pickerFor !== null} onClose={() => setPickerFor(null)} media={media} onPick={(url) => setDraft({ ...draft, photo: url })} />
      <Confirm open={!!confirmDel} title="Supprimer ce témoignage ?" message={`L'avis de "${confirmDel?.name}" sera définitivement supprimé.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}

/* ============================================================
   ADMIN ZONES
============================================================ */
