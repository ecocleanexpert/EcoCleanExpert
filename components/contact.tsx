"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { waLink } from "@/lib/constants";
import { Reveal } from "@/components/ui";
import type { QuoteRequest } from "@/lib/types";
import type { SiteContent } from "@/lib/defaultContent";

export function ContactFormSection({ content, onNewRequest }: { content: SiteContent; onNewRequest?: (r: QuoteRequest) => void }) {
  const cf = content.contactForm || {};
  const services = content.services.filter((s) => s.active).sort((a, b) => a.order - b.order);
  const communes = cf.communes || [];

  const [form, setForm] = useState({
    name: "", phone: "", email: "", service: "", commune: "", message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (k: any, v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
    if ((touched as Record<string, boolean>)[k]) validateField(k, v);
  };
  const onBlur = (k: any) => {
    setTouched((t: any) => ({ ...t, [k]: true }));
    validateField(k, (form as Record<string, string>)[k]);
  };

  const validateField = (k: any, v: any) => {
    let err = "";
    const val = String(v || "").trim();
    if (k === "name" && val.length < 2) err = "Indiquez votre nom complet.";
    if (k === "phone") {
      const digits = val.replace(/[^0-9]/g, "");
      if (digits.length < 8) err = "Numéro invalide (au moins 8 chiffres).";
    }
    if (k === "service" && !val) err = "Choisissez un service.";
    if (k === "commune" && !val) err = "Choisissez votre commune.";
    if (k === "message" && val.length > 600) err = "Message trop long (600 caractères max).";
    setErrors((e: any) => ({ ...e, [k]: err }));
    return !err;
  };

  const validateAll = () => {
    const required = ["name", "phone", "service", "commune"];
    const newErrors: Record<string, string> = {};
    let ok = true;
    required.forEach((k) => {
      const valid = validateField(k, (form as Record<string, string>)[k]);
      if (!valid) ok = false;
      newErrors[k] = (errors as Record<string, string>)[k];
    });
    setTouched({ name: true, phone: true, service: true, commune: true, message: true });
    return ok;
  };

  const buildMessage = () => {
    const lines = [
      "Bonjour Eco Clean Expert, je souhaite un devis.",
      "",
      `Nom : ${form.name.trim()}`,
      `Téléphone : ${form.phone.trim()}`,
    ];
    if (form.email.trim()) lines.push(`Email : ${form.email.trim()}`);
    lines.push(`Service : ${form.service}`);
    lines.push(`Commune : ${form.commune}`);
    if (form.message.trim()) lines.push("", `Message : ${form.message.trim()}`);
    return lines.join("\n");
  };

  const submit = (e: any) => {
    e.preventDefault();
    if (!validateAll()) return;
    setSubmitting(true);

    const request = {
      id: Date.now(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      service: form.service,
      commune: form.commune,
      message: form.message.trim(),
      date: new Date().toISOString(),
      status: "Nouveau",
    };

    // Enregistrement local pour l'admin
    if (onNewRequest) onNewRequest(request);

    // Ouverture WhatsApp
    const url = waLink(buildMessage());
    window.open(url, "_blank");

    setSubmitting(false);
    setSubmitted(true);
  };

  const reset = () => {
    setForm({ name: "", phone: "", email: "", service: "", commune: "", message: "" });
    setErrors({});
    setTouched({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <section id="devis" className="py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-5 lg:px-8">
          <Reveal>
            <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)] p-8 lg:p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#5CC63D]/10 text-[#5CC63D] flex items-center justify-center mx-auto">
                {I.check("w-8 h-8")}
              </div>
              <h2 className="mt-5 text-[26px] lg:text-[32px] font-extrabold tracking-[-0.02em] text-slate-900">
                {cf.successTitle || "Demande envoyée !"}
              </h2>
              <p className="mt-3 text-[15px] text-slate-600 max-w-md mx-auto leading-relaxed">
                {cf.successText || "Nous vous répondons en moins d'une heure sur WhatsApp."}
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 bg-[#5CC63D] hover:bg-[#4CAF50] text-white font-semibold px-6 py-3.5 rounded-full transition-colors">
                  {I.wa("w-5 h-5")} Ouvrir WhatsApp
                </a>
                <a href={`tel:${content.contact.phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold px-6 py-3.5 rounded-full transition-colors">
                  {I.phone("w-5 h-5")} Appeler
                </a>
              </div>
              <button onClick={reset} className="mt-6 text-[13px] text-slate-500 hover:text-slate-700 underline">
                Envoyer une nouvelle demande
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  const inputBase = "w-full px-4 py-3 rounded-xl border bg-white outline-none text-[14px] transition-colors";
  const inputOk = "border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10";
  const inputErr = "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100";

  return (
    <section id="devis" className="py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-5 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
            <div className="text-[12px] font-bold tracking-[0.18em] text-[#1E9BE0] uppercase">Devis gratuit</div>
            <h2 className="mt-3 text-[30px] sm:text-[38px] lg:text-[42px] font-extrabold tracking-[-0.02em] text-slate-900 leading-[1.08]">
              {cf.title || "Demandez votre devis gratuit"}
            </h2>
            {cf.subtitle && <p className="mt-4 text-[15.5px] text-slate-600 max-w-lg mx-auto">{cf.subtitle}</p>}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)] overflow-hidden">
            <div className="grid lg:grid-cols-[1.3fr_1fr]">
              {/* Formulaire */}
              <form onSubmit={submit} className="p-6 lg:p-10 space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      onBlur={() => onBlur("name")}
                      placeholder="Ex : Aïcha Koné"
                      className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                    />
                    {errors.name && <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      onBlur={() => onBlur("phone")}
                      placeholder="Ex : 01 42 08 97 76"
                      className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
                    />
                    {errors.phone && <p className="mt-1 text-[12px] text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                    Email <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="vous@exemple.com"
                    className={`${inputBase} ${inputOk}`}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                      Service souhaité <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setField("service", e.target.value)}
                      onBlur={() => onBlur("service")}
                      className={`${inputBase} ${errors.service ? inputErr : inputOk} ${form.service ? "" : "text-slate-400"}`}
                    >
                      <option value="">Choisir un service</option>
                      {services.map((s) => (<option key={s.id} value={s.title}>{s.title}</option>))}
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.service && <p className="mt-1 text-[12px] text-red-600">{errors.service}</p>}
                  </div>
                  <div>
                    <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                      Commune <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.commune}
                      onChange={(e) => setField("commune", e.target.value)}
                      onBlur={() => onBlur("commune")}
                      className={`${inputBase} ${errors.commune ? inputErr : inputOk} ${form.commune ? "" : "text-slate-400"}`}
                    >
                      <option value="">Choisir une commune</option>
                      {communes.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                    {errors.commune && <p className="mt-1 text-[12px] text-red-600">{errors.commune}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">
                    Message <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    onBlur={() => onBlur("message")}
                    rows={4}
                    placeholder="Décrivez brièvement votre besoin (surface, état, nombre de pièces...)"
                    className={`${inputBase} ${errors.message ? inputErr : inputOk} resize-y`}
                  />
                  <div className="mt-1 flex justify-between text-[11.5px]">
                    {errors.message ? <span className="text-red-600">{errors.message}</span> : <span className="text-slate-400">Plus de détails = devis plus précis</span>}
                    <span className="text-slate-400">{form.message.length}/600</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-[#5CC63D] hover:bg-[#4CAF50] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(92,198,61,0.6)]"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full spin" />
                  ) : (
                    <>{I.wa("w-5 h-5")} {cf.submitLabel || "Envoyer ma demande"}</>
                  )}
                </button>

                <p className="text-[11.5px] text-slate-400 text-center leading-relaxed">
                  En cliquant, vous ouvrez WhatsApp avec votre demande pré-remplie. Aucune donnée n'est partagée sans votre accord.
                </p>
              </form>

              {/* Colonne latérale : infos + contact direct */}
              <div className="bg-gradient-to-br from-[#0A2A6B] to-[#071B4C] p-6 lg:p-10 text-white relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#5CC63D]/10 blur-3xl pointer-events-none" />
                <div className="relative h-full flex flex-col">
                  <h3 className="text-[20px] font-extrabold tracking-[-0.02em]">
                    Pourquoi nous choisir ?
                  </h3>
                  <ul className="mt-6 space-y-4 flex-1">
                    {[
                      "Devis gratuit en moins d'1h",
                      "Intervention à domicile partout à Abidjan",
                      "Satisfait ou nous revenons gratuitement",
                      "Produits sûrs pour votre famille",
                    ].map((t, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#5CC63D]/20 text-[#5CC63D] flex items-center justify-center shrink-0 mt-0.5">
                          {I.check("w-3.5 h-3.5")}
                        </span>
                        <span className="text-[14px] text-white/85 leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-[12.5px] text-white/60 mb-3">{cf.orText || "ou contactez-nous directement"}</p>
                    <div className="space-y-2.5">
                      <a href={`tel:${content.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="w-9 h-9 rounded-lg bg-[#5CC63D]/20 text-[#5CC63D] flex items-center justify-center shrink-0">
                          {I.phone("w-4 h-4")}
                        </span>
                        <div className="leading-tight">
                          <div className="text-[11px] text-white/60">Appeler</div>
                          <div className="text-[14px] font-semibold">{content.contact.phone}</div>
                        </div>
                      </a>
                      <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="w-9 h-9 rounded-lg bg-[#5CC63D]/20 text-[#5CC63D] flex items-center justify-center shrink-0">
                          {I.wa("w-4 h-4")}
                        </span>
                        <div className="leading-tight">
                          <div className="text-[11px] text-white/60">WhatsApp</div>
                          <div className="text-[14px] font-semibold">Réponse &lt; 1h</div>
                        </div>
                      </a>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <span className="w-9 h-9 rounded-lg bg-[#5CC63D]/20 text-[#5CC63D] flex items-center justify-center shrink-0">
                          {I.clock("w-4 h-4")}
                        </span>
                        <div className="leading-tight">
                          <div className="text-[11px] text-white/60">Disponibilité</div>
                          <div className="text-[14px] font-semibold">{content.contact.hours}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
/* ============================================================
   PRICING
============================================================ */
