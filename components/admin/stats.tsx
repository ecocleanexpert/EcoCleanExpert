"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { Btn, Confirm, NumberField, TextField, Toggle } from "@/components/fields";
import type { SetContent, ToastFn } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminStats({ content, setContent, onToast }: { content: SiteContent; setContent: SetContent; onToast: ToastFn }) {
  const stats = content.stats || { title: "Nos chiffres", subtitle: "", items: [] };
  const [editing, setEditing] = useState<any>(null);
  const [draft, setDraft] = useState<any>({});
  const [confirmDel, setConfirmDel] = useState<any>(null);
  const [title, setTitle] = useState(stats.title);
  const [subtitle, setSubtitle] = useState(stats.subtitle || "");

  const iconMap: Record<string, (c?: string) => JSX.Element> = {
    users: I.users, spark: I.spark, shield: I.shield, home: I.home, pin: I.pin,
    building: I.building, hammer: I.hammer, sofa: I.sofa, chair: I.chair,
    carpet: I.carpet, car: I.car, star: I.star, check: I.check, trend: I.trend,
  };

  const saveHeader = () => {
    setContent((c) => ({ ...c, stats: { ...(c.stats || {}), title, subtitle } }));
    onToast("Titre enregistré");
  };

  const openNew = () => { setDraft({ value: "", suffix: "", label: "", icon: "trend", active: true }); setEditing("new"); };
  const openEdit = (s: any) => { setDraft({ ...s }); setEditing(s.id); };

  const save = () => {
    if (!draft.label?.trim()) { onToast("Le libellé est obligatoire", "error"); return; }
    if (!draft.value?.toString().trim()) { onToast("La valeur est obligatoire", "error"); return; }
    setContent((c) => {
      const items = c.stats?.items || [];
      if (editing === "new") {
        const id = Math.max(0, ...items.map((s) => s.id)) + 1;
        return { ...c, stats: { ...c.stats, items: [...items, { ...draft, id, order: items.length + 1 }] } };
      }
      return { ...c, stats: { ...c.stats, items: items.map((s) => (s.id === editing ? { ...s, ...draft } : s)) } };
    });
    onToast(editing === "new" ? "Chiffre ajouté" : "Chiffre modifié");
    setEditing(null);
  };

  const remove = (id: any) => {
    setContent((c) => ({ ...c, stats: { ...c.stats, items: (c.stats?.items || []).filter((s) => s.id !== id) } }));
    onToast("Chiffre supprimé");
    setConfirmDel(null);
  };
  const toggle = (id: any) => setContent((c) => ({ ...c, stats: { ...c.stats, items: (c.stats?.items || []).map((s) => (s.id === id ? { ...s, active: !s.active } : s)) } }));
  const move = (id: any, dir: any) => setContent((c) => {
    const list = [...(c.stats?.items || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
    const i = list.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return c;
    [list[i], list[j]] = [list[j], list[i]];
    return { ...c, stats: { ...c.stats, items: list.map((s, k) => ({ ...s, order: k + 1 })) } };
  });

  const items = (stats.items || []).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Statistiques</h1>
          <p className="text-[14px] text-slate-500 mt-1">Mettez à jour vos chiffres clés à chaque accomplissement. Ils s'animent automatiquement sur le site.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew}>Nouveau chiffre</Btn>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6 space-y-4">
        <h2 className="text-[15px] font-bold text-slate-900">Titre de la section</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <TextField label="Titre" value={title} onChange={setTitle} placeholder="Ex : Nos chiffres" />
          <TextField label="Sous-titre" value={subtitle} onChange={setSubtitle} placeholder="Ex : Des résultats concrets." />
        </div>
        <Btn variant="primary" size="sm" icon={I.save("w-4 h-4")} onClick={saveHeader}>Enregistrer le titre</Btn>
      </div>

      {editing !== null && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[16px] font-bold text-slate-900">{editing === "new" ? "Nouveau chiffre" : "Modifier le chiffre"}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <TextField label="Valeur (chiffre)" value={draft.value || ""} onChange={(v) => setDraft({ ...draft, value: v })} placeholder="Ex : 500, 3, 100" />
            <TextField label="Suffixe (optionnel)" value={draft.suffix || ""} onChange={(v) => setDraft({ ...draft, suffix: v })} placeholder="Ex : +, %, ans, /7" />
            <div className="sm:col-span-2">
              <TextField label="Libellé" value={draft.label || ""} onChange={(v) => setDraft({ ...draft, label: v })} placeholder="Ex : Clients satisfaits à Abidjan" />
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">Icône</label>
              <select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] outline-none text-[14px] bg-white">
                {Object.keys(iconMap).map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <Toggle checked={draft.active !== false} onChange={(v) => setDraft({ ...draft, active: v })} label="Visible sur le site" />
            </div>
            <div className="sm:col-span-2 bg-slate-50 rounded-xl p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Aperçu</div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center">
                  {(iconMap[draft.icon] || I.trend)("w-6 h-6")}
                </div>
                <div>
                  <div className="text-[28px] font-extrabold text-slate-900 leading-none">{draft.value || "0"}{draft.suffix || ""}</div>
                  <div className="text-[13px] text-slate-600 mt-1">{draft.label || "Libellé"}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Btn variant="primary" icon={I.save("w-4 h-4")} onClick={save}>Enregistrer</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
          </div>
        </div>
      )}

      {items.length === 0 && editing === null ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center mx-auto">{I.trend("w-6 h-6")}</div>
          <p className="mt-4 text-[14px] font-semibold text-slate-700">Aucun chiffre pour le moment</p>
          <p className="mt-1 text-[13px] text-slate-500">Ajoutez vos chiffres clés (clients, années d'expérience, taux de satisfaction…).</p>
          <p className="mt-1 text-[12px] text-slate-400">Aucune donnée n'est inventée — vous seul décidez quoi afficher.</p>
          <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={openNew} className="mt-4">Ajouter mon premier chiffre</Btn>
        </div>
      ) : items.length > 0 && (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {items.map((s) => {
const iconFn = iconMap[s.icon] || I.trend;              return (
                <div key={s.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="text-[#1E9BE0] shrink-0">
  {iconFn("w-6 h-6")}
</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-extrabold text-slate-900">{s.value}{s.suffix || ""}</span>
                      {!s.active && <span className="text-[10.5px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Masqué</span>}
                    </div>
                    <div className="text-[13px] text-slate-500 truncate">{s.label}</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => move(s.id, -1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Monter"><span style={{ transform: "rotate(90deg)", display: "inline-block" }}>{I.arrowL("w-4 h-4")}</span></button>
                    <button onClick={() => move(s.id, 1)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Descendre"><span style={{ transform: "rotate(90deg)", display: "inline-block" }}>{I.arrow("w-4 h-4")}</span></button>
                    <button onClick={() => toggle(s.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Activer/désactiver">{s.active !== false ? I.eye("w-4 h-4") : I.eye_off("w-4 h-4")}</button>
                    <button onClick={() => openEdit(s)} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-500 flex items-center justify-center" aria-label="Modifier">{I.pencil("w-4 h-4")}</button>
                    <button onClick={() => setConfirmDel(s)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" aria-label="Supprimer">{I.trash("w-4 h-4")}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Confirm open={!!confirmDel} title="Supprimer ce chiffre ?" message={`"${confirmDel?.label}" sera définitivement supprimé.`} onCancel={() => setConfirmDel(null)} onConfirm={() => remove(confirmDel.id)} />
    </div>
  );
}
/* ============================================================
   ADMIN FAQ
============================================================ */
