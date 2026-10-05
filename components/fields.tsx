"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { I } from "@/lib/icons";
import { compressImage, formatSize } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "green" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function ImageUploader({ value, onChange, label, hint, aspect = "aspect-square" }: { value: string; onChange: (v: string, name?: string) => void; label?: string; hint?: string; aspect?: string }) {
  const inputRef = useRef<any>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (file: any) => {
    setErr("");
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Format non supporté (JPG, PNG, WebP)"); return; }
    setLoading(true);
    try {
      const dataUrl = await compressImage(file);
      onChange(dataUrl, file.name);
    } catch (e) { setErr("Erreur de chargement"); }
    setLoading(false);
  };

  return (
    <div>
      {label && <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          drag ? "border-[#5CC63D] bg-[#5CC63D]/5" : "border-slate-200 hover:border-[#1E9BE0] hover:bg-slate-50"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        {value ? (
          <div className={`relative ${aspect}`}>
            <img src={value} alt="Aperçu" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <span className="text-white text-[12px] font-semibold bg-slate-900/70 px-3 py-1.5 rounded-full">Cliquer pour remplacer</span>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); onChange("", ""); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-red-500 shadow-md flex items-center justify-center transition-colors" aria-label="Supprimer">
              {I.trash("w-4 h-4")}
            </button>
          </div>
        ) : (
          <div className={`${aspect} flex flex-col items-center justify-center text-center p-4`}>
            {loading ? (
              <div className="w-8 h-8 border-2 border-[#1E9BE0] border-t-transparent rounded-full spin" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">{I.upload("w-6 h-6")}</div>
                <p className="text-[13px] font-semibold text-slate-700">Glisser ou cliquer</p>
                <p className="text-[11px] text-slate-400 mt-1">{hint || "JPG, PNG, WebP"}</p>
              </>
            )}
          </div>
        )}
      </div>
      {err && <p className="text-[12px] text-red-600 mt-1.5">{err}</p>}
    </div>
  );
}

export function MediaPicker({ open, onClose, media, onPick }: { open: boolean; onClose: () => void; media: MediaItem[]; onPick: (dataUrl: string) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[16px] font-bold text-slate-900">Choisir une image</h3>
          <button aria-label="Fermer" onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500">{I.x("w-5 h-5")}</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {media.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {I.image("w-10 h-10 mx-auto mb-3 text-slate-300")}
              <p className="text-[14px]">Aucune image dans la médiathèque.</p>
              <p className="text-[12px] mt-1">Téléversez d'abord des images depuis l'onglet Médiathèque.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {media.map((m) => (
                <button key={m.id} onClick={() => { onPick(m.dataUrl); onClose(); }}
                  className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-slate-900/5 hover:ring-2 hover:ring-[#5CC63D] transition-all">
                  <img src={m.dataUrl} alt={m.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImageField({ value, onChange, label, hint, onOpenLibrary, aspect }: { value: string; onChange: (v: string, name?: string) => void; label?: string; hint?: string; onOpenLibrary?: () => void; aspect?: string }) {
  return (
    <div>
      <ImageUploader value={value} onChange={onChange} label={label} hint={hint} aspect={aspect} />
      {onOpenLibrary && (
        <button type="button" onClick={onOpenLibrary}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[12.5px] font-medium text-slate-700 transition-colors">
          {I.image("w-4 h-4")} Choisir depuis la médiathèque
        </button>
      )}
    </div>
  );
}

export function Btn({ variant = "primary", size = "md", icon, children, ...rest }: BtnProps) {
  const variants = {
    primary: "bg-[#0A2A6B] hover:bg-[#071B4C] text-white",
    green: "bg-[#2E7D22] hover:bg-[#25681A] text-white",
    ghost: "bg-slate-100 hover:bg-slate-200 text-slate-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600",
    outline: "bg-white border border-slate-200 hover:border-slate-300 text-slate-700",
  };
  const sizes = { sm: "px-3 py-1.5 text-[12.5px]", md: "px-4 py-2.5 text-[13.5px]", lg: "px-5 py-3 text-[14px]" };
  return (
    <button className={`inline-flex items-center gap-2 font-semibold rounded-xl transition-colors ${variants[variant]} ${sizes[size]}`} {...rest}>
      {icon}{children}
    </button>
  );
}

export function TextField({ label, value, onChange, placeholder, type = "text" }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      {label && <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">{label}</label>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px] bg-white" />
    </div>
  );
}
export function NumberField({ label, value, onChange, min = 0, max = 99999, step = 1, hint, recommended }: { label: string; value: number | string; onChange: (v: number | string) => void; min?: number; max?: number; step?: number; hint?: string; recommended?: number | string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[12.5px] font-semibold text-slate-700">{label}</label>
        {recommended && (
          <span className="text-[10.5px] text-slate-400">
            reco : <button type="button" onClick={() => onChange(Number(recommended))} className="text-[#1E9BE0] hover:underline font-semibold">{recommended}</button>
          </span>
        )}
      </div>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = e.target.value === "" ? "" : Number(e.target.value);
            if (v === "" || (!isNaN(v) && v >= min && v <= max)) onChange(v);
          }}
          className="w-full px-3.5 py-2.5 pr-12 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px] bg-white font-semibold"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">ms</span>
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      {label && <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">{label}</label>}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px] bg-white resize-y" />
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative w-10 rounded-full transition-colors ${checked ? "bg-[#5CC63D]" : "bg-slate-300"}`} style={{ height: 22 }}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "left-[22px]" : "left-0.5"}`} style={{ height: 18, width: 18 }} />
      </button>
      {label && <span className="text-[13.5px] text-slate-700">{label}</span>}
    </label>
  );
}

export function Toast({ message, type = "success", onClose }: { message: string; type?: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2600); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "bg-[#5CC63D]", error: "bg-red-500", info: "bg-[#1E9BE0]" };
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] ${(colors as Record<string, string>)[type] || colors.success} text-white px-5 py-3 rounded-xl shadow-lg text-[13.5px] font-medium flex items-center gap-3`}>
      {type === "success" ? I.check("w-4 h-4") : I.info("w-4 h-4")}
      {message}
    </div>
  );
}

export function Confirm({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-2xl w-full max-w-md p-6">
        <h3 className="text-[16px] font-bold text-slate-900">{title}</h3>
        <p className="text-[13.5px] text-slate-600 mt-2">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Btn variant="ghost" onClick={onCancel}>Annuler</Btn>
          <Btn variant="danger" onClick={onConfirm}>Supprimer</Btn>
        </div>
      </div>
    </div>
  );
}
