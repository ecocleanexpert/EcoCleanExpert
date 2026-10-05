"use client";

import { useRef, useState } from "react";
import { I } from "@/lib/icons";
import { Btn } from "@/components/fields";
import { compressImage, dataUrlSize, formatSize } from "@/lib/utils";
import type { MediaItem, SetMedia, ToastFn } from "@/lib/types";

export function AdminMedia({ media, setMedia, onToast }: { media: MediaItem[]; setMedia: SetMedia; onToast: ToastFn }) {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<any>(null);

  const filtered = media.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newItems: MediaItem[] = [];
    for (const file of Array.from(files) as File[]) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const dataUrl = await compressImage(file);
        newItems.push({ id: Date.now() + Math.random(), name: file.name, dataUrl, size: dataUrlSize(dataUrl), date: new Date().toISOString() });
      } catch (e) { console.error(e); }
    }
    if (newItems.length > 0) {
      setMedia((m) => [...m, ...newItems]);
      onToast(`${newItems.length} image${newItems.length > 1 ? "s" : ""} ajoutée${newItems.length > 1 ? "s" : ""}`);
    }
    setUploading(false);
  };

  const remove = (id: any) => { setMedia((m) => m.filter((x) => x.id !== id)); onToast("Image supprimée"); };

  const totalSize = media.reduce((s, m) => s + (m.size || 0), 0);
  const limit = 4.5 * 1024 * 1024;
  const usage = Math.min(100, Math.round((totalSize / limit) * 100));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Médiathèque</h1>
          <p className="text-[14px] text-slate-500 mt-1">Téléversez et gérez toutes vos images. Elles sont compressées automatiquement.</p>
        </div>
        <Btn variant="primary" icon={I.upload("w-4 h-4")} onClick={() => inputRef.current?.click()}>Téléverser</Btn>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      </div>

      <div onDragOver={(e) => { e.preventDefault(); }} onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="bg-white rounded-2xl ring-1 ring-slate-900/5 border-2 border-dashed border-slate-200 hover:border-[#1E9BE0] transition-colors p-8 text-center cursor-pointer"
        onClick={() => inputRef.current?.click()}>
        <div className="w-14 h-14 rounded-2xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center mx-auto">
          {uploading ? <div className="w-6 h-6 border-2 border-[#1E9BE0] border-t-transparent rounded-full spin" /> : I.upload("w-6 h-6")}
        </div>
        <p className="mt-4 text-[14px] font-semibold text-slate-700">{uploading ? "Traitement..." : "Glissez vos images ici, ou cliquez pour parcourir"}</p>
        <p className="mt-1 text-[12.5px] text-slate-500">Plusieurs fichiers acceptés · JPG, PNG, WebP · Compression automatique</p>
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[12.5px] text-slate-600 mb-1.5">
            <span>Espace utilisé</span>
            <span className="font-semibold">{formatSize(totalSize)} / ~4,5 Mo</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full transition-all ${usage > 85 ? "bg-red-500" : usage > 60 ? "bg-[#F59E0B]" : "bg-[#5CC63D]"}`} style={{ width: `${usage}%` }} />
          </div>
        </div>
        <div className="relative sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{I.search("w-4 h-4")}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white outline-none text-[13.5px]" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">{I.image("w-6 h-6")}</div>
          <p className="mt-4 text-[14px] font-semibold text-slate-700">{media.length === 0 ? "Aucune image pour le moment" : "Aucun résultat"}</p>
          <p className="mt-1 text-[13px] text-slate-500">{media.length === 0 ? "Téléversez vos premières images." : "Essayez un autre terme de recherche."}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden ring-1 ring-slate-900/5 bg-slate-50">
                <img src={m.dataUrl} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => window.open(m.dataUrl, "_blank")} className="w-9 h-9 rounded-lg bg-white/95 text-slate-700 flex items-center justify-center hover:bg-white transition-colors" aria-label="Voir" title="Aperçu">{I.eye("w-4 h-4")}</button>
                  <button onClick={() => { navigator.clipboard.writeText(m.name); onToast("Nom copié", "info"); }} className="w-9 h-9 rounded-lg bg-white/95 text-slate-700 flex items-center justify-center hover:bg-white transition-colors" aria-label="Copier le nom" title="Copier le nom">{I.file("w-4 h-4")}</button>
                  <button onClick={() => remove(m.id)} className="w-9 h-9 rounded-lg bg-white/95 text-red-500 flex items-center justify-center hover:bg-white transition-colors" aria-label="Supprimer" title="Supprimer">{I.trash("w-4 h-4")}</button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[11px] font-semibold text-white truncate">{m.name}</p>
                  <p className="text-[10px] text-white/70">{formatSize(m.size || 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
