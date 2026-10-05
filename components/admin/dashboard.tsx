"use client";

import { I } from "@/lib/icons";
import { StatCard } from "@/components/admin/shell";
import type { MediaItem, QuoteRequest } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminDashboard({ content, media, requests, onNav }: { content: SiteContent; media: MediaItem[]; requests: QuoteRequest[]; onNav: (tab: string) => void }) {
  const statsCount = (content.stats?.items || []).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-extrabold text-slate-900">Tableau de bord</h1>
        <p className="text-[14px] text-slate-500 mt-1">Vue d'ensemble de votre site.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={I.inbox("w-5 h-5")} label="Demandes de devis" value={requests.length} hint={requests.filter(r => r.status === "Nouveau").length > 0 ? `${requests.filter(r => r.status === "Nouveau").length} nouvelles` : null} />
        <StatCard icon={I.image("w-5 h-5")} label="Avant / Après" value={content.beforeAfter.filter((b) => b.active).length} />
        <StatCard icon={I.trend("w-5 h-5")} label="Chiffres affichés" value={statsCount} />
        <StatCard icon={I.pin("w-5 h-5")} label="Zones couvertes" value={content.zones.filter((z) => z.active).length} />
      </div>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[15px] font-bold text-slate-900">Actions rapides</h2>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "Voir les demandes de devis", key: "requests" },
{ label: "Mettre à jour mes chiffres", key: "stats" },
{ label: "Gérer la FAQ", key: "faq" },
{ label: "Ajouter un service", key: "services" },
              { label: "Ajouter un avant / après", key: "beforeafter" },
              { label: "Ajouter un témoignage", key: "testimonials" },
              { label: "Uploader une image", key: "media" },
              { label: "Modifier le contenu du site", key: "content" },
            ].map((a) => (
              <button key={a.key} onClick={() => onNav(a.key)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left">
                <span className="text-[13.5px] font-medium text-slate-700">{a.label}</span>
                {I.arrow("w-4 h-4 text-slate-400")}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 p-6">
          <h2 className="text-[15px] font-bold text-slate-900">Médiathèque</h2>
          <p className="mt-1 text-[13px] text-slate-500">{media.length} image{media.length !== 1 ? "s" : ""} téléversée{media.length !== 1 ? "s" : ""}</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {media.slice(0, 8).map((m) => (
              <div key={m.id} className="aspect-square rounded-lg overflow-hidden ring-1 ring-slate-900/5">
                <img src={m.dataUrl} alt={m.name} className="w-full h-full object-cover" />
              </div>
            ))}
            {media.length === 0 && <p className="col-span-4 text-center text-[12px] text-slate-400 py-6">Aucune image</p>}
          </div>
          <button onClick={() => onNav("media")} className="mt-4 text-[13px] font-semibold text-[#1E9BE0] hover:underline">Gérer la médiathèque →</button>
        </div>
      </div>
    </div>
  );
}
/* ============================================================
   ADMIN DEMANDES DE DEVIS
============================================================ */
