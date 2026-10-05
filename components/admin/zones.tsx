"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Btn, Confirm, TextField, Toggle } from "@/components/fields";
import type { SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminZones({ content, setContent, onToast }: { content: SiteContent; setContent: SetContent; onToast: ToastFn }) {
  const [editing, setEditing] = useState<any>(null);
  const [draftName, setDraftName] = useState("");
  const [confirmDel, setConfirmDel] = useState<any>(null);

  const save = () => {
    if (!draftName.trim()) { onToast("Le nom est obligatoire", "error"); return; }
    setContent((c) => {
      if (editing === "new") {
        const id = Math.max(0, ...c.zones.map((z) => z.id)) + 1;
        return { ...c, zones: [...c.zones, { id, name: draftName.trim(), active: true }] };
      }
      return { ...c, zones: c.zones.map((z) => (z.id === editing ? { ...z, name: draftName.trim() } : z)) };
    });
    onToast(editing === "new" ? "Zone ajoutée" : "Zone modifiée");
    setEditing(null); setDraftName("");
  };

  const remove = (id: any) => { setContent((c) => ({ ...c, zones: c.zones.filter((z) => z.id !== id) })); onToast("Zone supprimée"); setConfirmDel(null); };
  const toggle = (id: any) => setContent((c) => ({ ...c, zones: c.zones.map((z) => (z.id === id ? { ...z, active: !z.active } : z)) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Zones d'intervention</h1>
          <p className="text-[14px] text-slate-500 mt-1">Ajoutez ou modifiez les communes couvertes.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={() => { setDraftName(""); setEditing("new"); }}>Nouvelle zone</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouvelle zone" : "Modifier la zone"}</h2>
          <div className="mt-5 max-w-md"><TextField label="Nom de la commune" value={draftName} onChange={setDraftName} placeholder="Ex : Cocody" /></div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => { setEditing(null); setDraftName(""); }}>Annuler</Btn>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {content.zones.map((z) => (
            <div key={z.id} className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center shrink-0">{I.pin("w-5 h-5")}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14.5px] font-semibold text-slate-900">{z.name}</span>
                  {!z.active && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Inactif</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(z.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{z.active ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                <button onClick={() => { setDraftName(z.name); setEditing(z.id); }} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center">{I.pencil("w-4 h-4")}</button>
                <button onClick={() => setConfirmDel(z)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">{I.trash("w-4 h-4")}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Confirm open={!!confirmDel} title="Supprimer cette zone ?" message={`"${confirmDel?.name}" sera définitivement supprimée.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}

/* ============================================================
   ADMIN CONTENU
============================================================ */
