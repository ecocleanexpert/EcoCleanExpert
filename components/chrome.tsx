"use client";

import { useEffect, useState } from "react";
import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import type { SiteContent } from "@/lib/defaultContent";

export function LogoBlock({ content, variant = "header" }: { content: SiteContent; variant?: "header" | "footer" | "sidebar" | "login" }) {
  const logo = { header: "h-10 lg:h-12", footer: "h-12", sidebar: "h-10", login: "h-14" }[variant];
  const nameC = { header: "text-[#0A2A6B] text-[15px] lg:text-[19px]", footer: "text-white text-[17px]", sidebar: "text-white text-[13px]", login: "text-[#0A2A6B] text-[17px]" }[variant];
  const tagC = { header: "text-slate-500 text-[9.5px] lg:text-[11.5px]", footer: "text-white/50 text-[10.5px]", sidebar: "text-white/40 text-[10px]", login: "text-slate-500 text-[11px]" }[variant];
  const tagT = { header: "Expert du nettoyage express", footer: "Expert du nettoyage express", sidebar: "Administration", login: "Espace administrateur" }[variant];
  const wrapCls = (variant === "footer" || variant === "sidebar") ? "bg-white rounded-lg p-1 inline-flex items-center justify-center shrink-0" : "";
  const wrapSize = variant === "footer" ? "w-16 h-16 p-2 rounded-xl" : variant === "sidebar" ? "w-11 h-11 p-1 rounded-lg" : "";
  const src = content.brand.logo;
  const logoSrc = /^(https?:|data:|\/)/.test(src) ? src : `/${src}`;
  const webpSrc = /\.(png|jpe?g)$/i.test(logoSrc) ? logoSrc.replace(/\.(png|jpe?g)$/i, ".webp") : null;
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${wrapCls} ${wrapSize}`}>
        <picture>
          {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
          <img src={logoSrc} alt="Logo Eco Clean Expert" width={48} height={48} className={`${logo} w-auto object-contain`} loading="eager" fetchPriority="high" decoding="sync" />
        </picture>
      </div>
      <div className="leading-[1.05]">
        <div className={`font-extrabold tracking-[-0.02em] ${nameC}`}>{content.brand.name}</div>
        <div className={`font-medium mt-0.5 ${tagC}`}>{tagT}</div>
      </div>
    </div>
  );
}

/* ============================================================
   BARRE FIXE MOBILE — Appeler + WhatsApp
============================================================ */
export function MobileBar({ content }: { content: SiteContent }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.18)]">
        <div className="grid grid-cols-2 gap-2 p-3 max-w-md mx-auto">
          <a
            href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-semibold py-3 rounded-xl transition-colors text-[13.5px]"
          >
            {I.phone("w-4 h-4")} Appeler
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#2E7D22] hover:bg-[#25681A] text-white font-semibold py-3 rounded-xl transition-colors text-[13.5px] shadow-sm"
          >
            {I.wa("w-4 h-4")} WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */

export function Header({ content, onAdmin }: { content: SiteContent; onAdmin: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
  { href: "#accueil", label: "Accueil" }, { href: "#services", label: "Services" },
  { href: "#avant-apres", label: "Avant / Après" }, { href: "#pourquoi", label: "À propos" },
  { href: "#tarifs", label: "Tarifs" }, { href: "#faq", label: "FAQ" }, { href: "#devis", label: "Devis" },
];
  const goto = (e: { preventDefault: () => void }, href: string) => { e.preventDefault(); setOpen(false); const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.06)]" : "bg-white/80 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="h-16 lg:h-20 flex items-center justify-between gap-4">
          <a href="#accueil" onClick={(e) => goto(e, "#accueil")} className="shrink-0"><LogoBlock content={content} variant="header" /></a>
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (<a key={l.href} href={l.href} onClick={(e) => goto(e, l.href)} className="px-3.5 py-2 text-[14px] font-medium text-slate-600 hover:text-[#1E9BE0] rounded-lg hover:bg-slate-50 transition-colors">{l.label}</a>))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
  <a
    href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
    className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-[14px] font-semibold px-4 py-2.5 rounded-full transition-colors"
  >
    {I.phone("w-4 h-4")} Appeler
  </a>
  <a
    href={waLink()}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 bg-[#2E7D22] hover:bg-[#25681A] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
  >
    {I.wa("w-4 h-4")} Devis WhatsApp
  </a>
</div>
<div className="flex lg:hidden items-center gap-2">
  <a
    href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
    aria-label="Appeler"
    className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm"
  >
    {I.phone("w-5 h-5")}
  </a>
  <button
    onClick={() => setOpen((v) => !v)}
    aria-label="Menu"
    className="w-10 h-10 rounded-full border border-slate-200 text-slate-700 flex items-center justify-center"
  >
    {open ? I.x("w-5 h-5") : I.menu("w-5 h-5")}
  </button>
</div>
        </div>
      </div>
      <div className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${open ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 pb-5 pt-1 bg-white border-t border-slate-100">
          <nav className="flex flex-col py-2">
            {links.map((l) => (<a key={l.href} href={l.href} onClick={(e) => goto(e, l.href)} className="py-3 text-[15px] font-medium text-slate-700 border-b border-slate-50 last:border-0">{l.label}</a>))}
          </nav>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#5CC63D] text-white font-semibold py-3.5 rounded-full">{I.wa("w-5 h-5")} Demander un devis WhatsApp</a>
        </div>
      </div>
    </header>
  );
}


/* ============================================================
   HERO — Image plein écran + panneau + typewriter
============================================================ */

export function Footer({ content, onAdmin, onNavigate }: { content: SiteContent; onAdmin: () => void; onNavigate: (t?: string) => void }) {
  const services = content.services.filter((s) => s.active).sort((a, b) => a.order - b.order);
  return (
    <footer className="bg-[#071B2C] text-white/70">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <LogoBlock content={content} variant="footer" />
            <p className="mt-5 text-[14px] leading-relaxed max-w-xs">Le nettoyage professionnel pour des espaces plus sains et plus agréables, à domicile et auprès des professionnels.</p>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">Liens rapides</h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {[{ href: "#accueil", label: "Accueil" }, { href: "#services", label: "Services" }, { href: "#avant-apres", label: "Avant / Après" }, { href: "#pourquoi", label: "À propos" }, { href: "#tarifs", label: "Tarifs" }, { href: "#contact", label: "Contact" }].map((l) => (<li key={l.href}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>))}
            </ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">Nos services</h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">{services.map((s) => (<li key={s.id}><a href="#services" className="hover:text-white transition-colors">{s.title}</a></li>))}</ul>
          </div>
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-[14px]">
              <li><a href={`tel:${content.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 hover:text-white transition-colors"><span className="text-[#5CC63D]">{I.phone("w-4 h-4")}</span> {content.contact.phone}</a></li>
              <li className="inline-flex items-center gap-2.5"><span className="text-[#5CC63D]">{I.pin("w-4 h-4")}</span> {content.contact.city}</li>
              <li className="inline-flex items-center gap-2.5"><span className="text-[#5CC63D]">{I.clock("w-4 h-4")}</span> {content.contact.hours}</li>
            </ul>
                        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-[#2E7D22] hover:bg-[#25681A] text-white text-[13.5px] font-semibold px-4 py-2.5 rounded-full transition-colors">{I.wa("w-4 h-4")} WhatsApp</a>
            {/* Mention groupe parent */}
            {content.parentCompany?.showInFooter !== false && content.parentCompany?.name && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-3">
                  Un service du groupe
                </p>
                <div className="flex items-center gap-3">
                  {content.parentCompany.logo && (
                    <div className="bg-white rounded-lg p-1.5 w-14 h-14 flex items-center justify-center shrink-0">
                      <img
                        src={content.parentCompany.logo}
                        alt={content.parentCompany.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold text-white">
                      {content.parentCompany.name}
                    </div>
                    {content.parentCompany.legalForm && (
                      <div className="text-[10.5px] text-white/50 mt-0.5">
                        {content.parentCompany.legalForm} — {content.parentCompany.tagline}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Réseaux sociaux */}
            {(content.social?.facebook || content.social?.instagram || content.social?.tiktok) && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-3">Suivez-nous</p>
                <div className="flex items-center gap-2.5">
                  {content.social?.facebook && (
                    <a
                      href={content.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#1877F2] text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                      {I.facebook("w-5 h-5")}
                    </a>
                  )}
                  {content.social?.instagram && (
                    <a
                      href={content.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                      {I.instagram("w-5 h-5")}
                    </a>
                  )}
                  {content.social?.tiktok && (
                    <a
                      href={content.social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="TikTok"
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-black text-white/70 hover:text-white flex items-center justify-center transition-colors"
                    >
                      {I.tiktok("w-5 h-5")}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-12 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-white/65">
                    <span>
            © {new Date().getFullYear()} {content.brand.name} — un service de{" "}
            <strong className="text-white/60">{content.parentCompany?.name || "JULMARKETING Corporation"}</strong>.
          </span>
          <div className="flex items-center gap-5">
  <button onClick={() => onNavigate && onNavigate("mentions")} className="hover:text-white/80 transition-colors">Mentions légales</button>
  <button onClick={() => onNavigate && onNavigate("privacy")} className="hover:text-white/80 transition-colors">Politique de confidentialité</button>
</div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGES LÉGALES — Mentions + Politique
============================================================ */
