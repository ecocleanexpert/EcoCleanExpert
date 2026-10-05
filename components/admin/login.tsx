"use client";

import { useState } from "react";
import { I } from "@/lib/icons";
import { LogoBlock } from "@/components/chrome";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminLogin({ onLogin, onBack, content }: { onLogin: (a: { email: string }) => void; onBack: () => void; content: SiteContent }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "admin@ecocleanexpert.ci";
  const ADMIN_PASSWORD = "EcoClean2025!";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) { setErr("Veuillez renseigner vos identifiants."); return; }
    setLoading(true);
    setErr("");
    try {
      if (isSupabaseConfigured) {
        const sb = getSupabase();
        const { error } = await sb!.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });
        if (error) {
          setErr("Email ou mot de passe incorrect.");
          return;
        }
        onLogin({ email });
        return;
      }
      // Repli démo (localStorage) tant que Supabase n'est pas configuré
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() || pass !== ADMIN_PASSWORD) {
        setErr("Email ou mot de passe incorrect.");
        return;
      }
      sessionStorage.setItem("ece_admin", "1");
      onLogin({ email });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-[13px] text-slate-500 hover:text-slate-800">{I.arrowL("w-4 h-4")} Retour au site</button>
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.3)] p-8">
          <LogoBlock content={content} variant="login" />
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label className="text-[12.5px] font-semibold text-slate-700">Adresse e-mail</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{I.mail("w-4 h-4")}</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ecocleanexpert.ci" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px]" />
              </div>
            </div>
            <div>
              <label className="text-[12.5px] font-semibold text-slate-700">Mot de passe</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{I.lock("w-4 h-4")}</span>
                <input type={showPass ? "text" : "password"} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPass ? I.eye_off("w-4 h-4") : I.eye("w-4 h-4")}</button>
              </div>
            </div>
            {err && <div className="text-[13px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
            <button type="submit" disabled={loading} className="w-full bg-[#0A2A6B] hover:bg-[#071B4C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors">
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-5 text-[11.5px] text-slate-400 text-center leading-relaxed">Accès réservé. Session sécurisée.</p>
        </div>
      </div>
    </div>
  );
}
