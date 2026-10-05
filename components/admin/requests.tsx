"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import { Btn, Confirm } from "@/components/fields";
import type { QuoteRequest, SetRequests, ToastFn } from "@/lib/types";

export function AdminRequests({ requests, setRequests, onToast }: { requests: QuoteRequest[]; setRequests: SetRequests; onToast: ToastFn }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [confirmDel, setConfirmDel] = useState<any>(null);

  const statuses = ["Nouveau", "En cours", "Traité", "Annulé"];

  const filtered = requests.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(s) ||
        r.phone.includes(s) ||
        (r.service || "").toLowerCase().includes(s) ||
        (r.commune || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const updateStatus = (id: any, status: any) => {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    onToast("Statut mis à jour");
  };

  const remove = (id: any) => {
    setRequests((rs) => rs.filter((r) => r.id !== id));
    onToast("Demande supprimée");
    setConfirmDel(null);
    if (selected?.id === id) setSelected(null);
  };

  const formatDate = (iso: any) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = (now.getTime() - d.getTime()) / 1000;
      if (diff < 60) return "À l'instant";
      if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
      if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
      if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
    } catch { return "—"; }
  };

  const statusColor = (s: any) => {
    if (s === "Nouveau") return "bg-[#5CC63D]/10 text-[#4CAF50]";
    if (s === "En cours") return "bg-[#F59E0B]/10 text-[#B45309]";
    if (s === "Traité") return "bg-slate-100 text-slate-500";
    return "bg-red-50 text-red-500";
  };

  const exportCsv = () => {
    const header = ["Date", "Nom", "Téléphone", "Email", "Service", "Commune", "Statut", "Message"];
    const esc = (v: string) => `"${String(v || "").replace(/"/g, '""')}"`;
    const rows = filtered.map((r) =>
      [r.date, r.name, r.phone, r.email, r.service, r.commune, r.status, r.message]
        .map(esc)
        .join(";")
    );
    const csv = "﻿" + [header.map(esc).join(";"), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `demandes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    onToast(`${filtered.length} demande(s) exportée(s)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Demandes de devis</h1>
          <p className="text-[14px] text-slate-500 mt-1">
            {requests.length} demande{requests.length !== 1 ? "s" : ""} reçue{requests.length !== 1 ? "s" : ""} au total.
          </p>
        </div>
        <Btn variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
          {I.upload("w-4 h-4 rotate-180")} Exporter CSV
        </Btn>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {["all", ...statuses].map((s) => {
            const count = s === "all" ? requests.length : requests.filter((r) => r.status === s).length;
            const active = filter === s;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition-colors ${
                  active ? "bg-[#0A2A6B] text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s === "all" ? "Toutes" : s} <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
        <div className="relative sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{I.search("w-4 h-4")}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-transparent focus:border-slate-200 focus:bg-white outline-none text-[13.5px]"
          />
        </div>
      </div>

      {/* Liste vide */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center mx-auto">
            {I.inbox("w-6 h-6")}
          </div>
          <p className="mt-4 text-[14px] font-semibold text-slate-700">
            {requests.length === 0 ? "Aucune demande pour le moment" : "Aucun résultat"}
          </p>
          <p className="mt-1 text-[13px] text-slate-500">
            {requests.length === 0
              ? "Les demandes envoyées via le formulaire apparaîtront ici."
              : "Essayez un autre filtre ou un autre terme."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1E9BE0] to-[#5CC63D] text-white text-[13px] font-bold flex items-center justify-center shrink-0">
                  {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14.5px] font-semibold text-slate-900 truncate">{r.name}</span>
                    <span className={`text-[10.5px] font-bold uppercase px-2 py-0.5 rounded ${statusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-[13px] text-slate-500 truncate">
                    {r.service} · {r.commune} · {r.phone}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[12px] text-slate-400">{formatDate(r.date)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modale détail */}
      {selected && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl ring-1 ring-slate-900/5 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white">
              <div className="min-w-0">
                <h3 className="text-[18px] font-bold text-slate-900">{selected.name}</h3>
                <p className="text-[12.5px] text-slate-500 mt-0.5">
                  {new Date(selected.date).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                {I.x("w-5 h-5")}
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Téléphone</div>
                  <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="text-[14px] font-semibold text-[#1E9BE0] hover:underline">{selected.phone}</a>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Service</div>
                  <div className="text-[14px] font-semibold text-slate-900">{selected.service}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Commune</div>
                  <div className="text-[14px] font-semibold text-slate-900">{selected.commune}</div>
                </div>
                {selected.email && (
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Email</div>
                    <a href={`mailto:${selected.email}`} className="text-[14px] font-semibold text-[#1E9BE0] hover:underline break-all">{selected.email}</a>
                  </div>
                )}
              </div>
              {selected.message && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Message</div>
                  <div className="bg-slate-50 rounded-xl p-3.5 text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Statut</div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                      className={`px-3 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors ${
                        selected.status === s ? "bg-[#0A2A6B] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a href={waLink(`Bonjour ${selected.name}, je vous recontacte concernant votre demande de ${selected.service} à ${selected.commune}.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#5CC63D] hover:bg-[#4CAF50] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  {I.wa("w-4 h-4")} Répondre sur WhatsApp
                </a>
                <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors">
                  {I.phone("w-4 h-4")} Appeler
                </a>
                <button onClick={() => setConfirmDel(selected)} className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors ml-auto">
                  {I.trash("w-4 h-4")} Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Confirm
        open={!!confirmDel}
        title="Supprimer cette demande ?"
        message={`La demande de "${confirmDel?.name}" sera définitivement supprimée.`}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => remove(confirmDel.id)}
      />
    </div>
  );
}

/* ============================================================
   ADMIN STATISTIQUES
============================================================ */
