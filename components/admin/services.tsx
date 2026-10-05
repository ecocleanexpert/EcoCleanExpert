"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Img } from "@/components/ui";
import { Btn, Confirm, ImageField, MediaPicker, TextArea, TextField, Toggle } from "@/components/fields";
import type { MediaItem, SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminServices({ content, setContent, media, onToast }: { content: SiteContent; setContent: SetContent; media: MediaItem[]; onToast: ToastFn }) {
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [pickerFor, setPickerFor] = useState<any>(null);
  const [confirmDel, setConfirmDel] = useState<any>(null);

  const iconMap: Record<string, (c?: string) => JSX.Element> = { sofa: I.sofa, chair: I.chair, carpet: I.carpet, car: I.car, building: I.building, hammer: I.hammer };

  const openNew = () => { setDraft({ title: "", desc: "", price: "Sur devis", icon: "sofa", image: "", active: true }); setEditing("new"); };
  const openEdit = (s: any) => { setDraft({ ...s }); setEditing(s.id); };

  const save = () => {
    if (!draft.title?.trim()) { onToast("Le titre est obligatoire", "error"); return; }
    setContent((c) => {
      if (editing === "new") {
        const id = Math.max(0, ...c.services.map((s) => s.id)) + 1;
        return { ...c, services: [...c.services, { ...draft, id, order: c.services.length + 1 }] };
      }
      return { ...c, services: c.services.map((s) => (s.id === editing ? { ...s, ...draft } : s)) };
    });
    onToast(editing === "new" ? "Service ajouté" : "Service modifié");
    setEditing(null);
  };

  const remove = (id: any) => { setContent((c) => ({ ...c, services: c.services.filter((s) => s.id !== id) })); onToast("Service supprimé"); setConfirmDel(null); };
  const toggle = (id: any) => setContent((c) => ({ ...c, services: c.services.map((s) => (s.id === id ? { ...s, active: !s.active } : s)) }));
  const move = (id: any, dir: any) => setContent((c) => {
    const list = [...c.services].sort((a, b) => a.order - b.order);
    const i = list.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return c;
    [list[i], list[j]] = [list[j], list[i]];
    return { ...c, services: list.map((s, k) => ({ ...s, order: k + 1 })) };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Services</h1>
          <p className="text-[14px] text-slate-500 mt-1">Créez, modifiez, activez et réordonnez vos prestations.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew}>Nouveau service</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouveau service" : "Modifier le service"}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <ImageField label="Image du service" value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} hint="JPG, PNG — compressée automatiquement" onOpenLibrary={() => setPickerFor("service")} aspect="aspect-[16/10]" />
            </div>
            <TextField label="Titre" value={draft.title || ""} onChange={(v) => setDraft({ ...draft, title: v })} placeholder="Ex : Nettoyage de canapés" />
            <TextField label="Prix affiché" value={draft.price || ""} onChange={(v) => setDraft({ ...draft, price: v })} placeholder="Ex : À partir de 15 000 F CFA" />
            <div className="sm:col-span-2">
              <TextField label="Description courte" value={draft.desc || ""} onChange={(v) => setDraft({ ...draft, desc: v })} placeholder="Ex : Nettoyage en profondeur des tissus." />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">Icône</label>
              <select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] outline-none text-[14px] bg-white">
                {Object.keys(iconMap).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <Toggle checked={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} label="Service actif (visible sur le site)" />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {[...content.services].sort((a, b) => a.order - b.order).map((s) => {
            const iconFn = iconMap[s.icon] || I.spark;
            return (
              <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-slate-900/5">
                  <Img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14.5px] font-semibold text-slate-900 truncate">{s.title}</span>
                    {!s.active && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Inactif</span>}
                  </div>
                  <div className="text-[13px] text-slate-500 truncate">{s.desc} · <span className="font-semibold text-[#0A2A6B]">{s.price}</span></div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => move(s.id, -1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Monter"><span style={{transform: "rotate(90deg)", display: "inline-block"}}>{I.arrowL("w-4 h-4")}</span></button>
                  <button onClick={() => move(s.id, 1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Descendre"><span style={{transform: "rotate(90deg)", display: "inline-block"}}>{I.arrow("w-4 h-4")}</span></button>
                  <button onClick={() => toggle(s.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Activer/désactiver">{s.active ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                  <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Modifier">{I.pencil("w-4 h-4")}</button>
                  <button onClick={() => setConfirmDel(s)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" aria-label="Supprimer">{I.trash("w-4 h-4")}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MediaPicker open={pickerFor !== null} onClose={() => setPickerFor(null)} media={media} onPick={(url) => setDraft({ ...draft, image: url })} />
      <Confirm open={!!confirmDel} title="Supprimer le service ?" message={`"${confirmDel?.title}" sera définitivement supprimé.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}

/* ============================================================
   ADMIN AVANT / APRÈS
============================================================ */
