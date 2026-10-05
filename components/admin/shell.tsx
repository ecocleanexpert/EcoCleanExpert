"use client";

import { useState, type ReactNode } from "react";
import { I } from "@/lib/icons";
import { LogoBlock } from "@/components/chrome";
import { Toast } from "@/components/fields";
import { AdminDashboard } from "@/components/admin/dashboard";
import { AdminRequests } from "@/components/admin/requests";
import { AdminStats } from "@/components/admin/stats";
import { AdminFAQ } from "@/components/admin/faq";
import { AdminLegal } from "@/components/admin/legal";
import { AdminServices } from "@/components/admin/services";
import { AdminBeforeAfter } from "@/components/admin/beforeafter";
import { AdminTestimonials } from "@/components/admin/testimonials";
import { AdminZones } from "@/components/admin/zones";
import { AdminContent } from "@/components/admin/content";
import { AdminMedia } from "@/components/admin/media";
import type { MediaItem, QuoteRequest, SetContent, SetMedia, SetRequests } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export const ADMIN_NAV = [
  { key: "dashboard", label: "Tableau de bord", icon: I.dash },
  { key: "requests", label: "Demandes de devis", icon: I.inbox },
  { key: "stats", label: "Statistiques", icon: I.trend },
  { key: "services", label: "Services", icon: I.spark },
  { key: "faq", label: "FAQ", icon: I.info },
  { key: "legal", label: "Mentions légales", icon: I.file },
  { key: "beforeafter", label: "Avant / Après", icon: I.image },
  { key: "testimonials", label: "Témoignages", icon: I.users },
  { key: "zones", label: "Zones", icon: I.pin },
  { key: "content", label: "Contenu du site", icon: I.file },
  { key: "media", label: "Médiathèque", icon: I.image },
];

export function StatCard({ icon, label, value, hint }: { icon: ReactNode; label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl bg-[#1E9BE0]/10 text-[#1E9BE0] flex items-center justify-center">{icon}</div>
        {hint && <span className="text-[11px] font-semibold text-[#5CC63D] bg-[#5CC63D]/10 px-2 py-0.5 rounded-full">{hint}</span>}
      </div>
      <div className="mt-4 text-[26px] font-extrabold text-slate-900 leading-none">{value}</div>
      <div className="mt-1.5 text-[13px] text-slate-500">{label}</div>
    </div>
  );
}

export function AdminShell({ content, setContent, media, setMedia, requests, setRequests, onLogout, onBack }: { content: SiteContent; setContent: SetContent; media: MediaItem[]; setMedia: SetMedia; requests: QuoteRequest[]; setRequests: SetRequests; onLogout: () => void; onBack: () => void }) {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const onToast = (msg: any, type = "success") => setToast({ msg, type });

  const renderContent = () => {
    switch (tab) {
      case "dashboard": return <AdminDashboard content={content} media={media} requests={requests} onNav={setTab} />;
case "requests": return <AdminRequests requests={requests} setRequests={setRequests} onToast={onToast} />;
case "stats": return <AdminStats content={content} setContent={setContent} onToast={onToast} />;
case "services": return <AdminServices content={content} setContent={setContent} media={media} onToast={onToast} />;
case "faq": return <AdminFAQ content={content} setContent={setContent} onToast={onToast} />;
case "legal": return <AdminLegal content={content} setContent={setContent} onToast={onToast} />;
      case "beforeafter": return <AdminBeforeAfter content={content} setContent={setContent} media={media} onToast={onToast} />;
      case "testimonials": return <AdminTestimonials content={content} setContent={setContent} media={media} onToast={onToast} />;
      case "zones": return <AdminZones content={content} setContent={setContent} onToast={onToast} />;
      case "content": return <AdminContent content={content} setContent={setContent} media={media} onToast={onToast} />;
      case "media": return <AdminMedia media={media} setMedia={setMedia} onToast={onToast} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#071B2C] text-white/80 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-20 flex items-center px-4 border-b border-white/10">
          <LogoBlock content={content} variant="sidebar" />
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {ADMIN_NAV.map((n) => {
            const active = tab === n.key;
            return (
              <button key={n.key} onClick={() => { setTab(n.key); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors mb-1 ${active ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/60"}`}>
                <span className={active ? "text-[#5CC63D]" : ""}>{n.icon("w-5 h-5")}</span>
                {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:bg-white/5 transition-colors">{I.globe("w-4 h-4")} Voir le site</button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:bg-white/5 transition-colors">{I.out("w-4 h-4")} Déconnexion</button>
        </div>
      </aside>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" />}
      <div className="flex-1 min-w-0">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-5 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600">{I.menu("w-5 h-5")}</button>
            <span className="text-[13px] text-slate-500 hidden sm:inline">Administration — Eco Clean Expert</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E9BE0] to-[#5CC63D] text-white text-[12px] font-bold flex items-center justify-center">A</div>
              <div className="hidden sm:block leading-tight">
                <div className="text-[13px] font-semibold text-slate-900">Admin</div>
                <div className="text-[11px] text-slate-400">Super administrateur</div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-8 max-w-[1200px]">{renderContent()}</main>
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
