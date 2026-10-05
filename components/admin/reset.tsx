"use client";

import { useEffect, useState } from "react";
import { I } from "@/lib/icons";
import { LogoBlock } from "@/components/chrome";
import { getSupabase } from "@/lib/supabase/client";
import type { SiteContent } from "@/lib/defaultContent";

export function AdminReset({ content, onDone }: { content: SiteContent; onDone: () => void }) {
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState<boolean | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) { setSessionReady(false); return; }

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setSessionReady(true);
    });

    const init = async () => {
      // Lien Supabase : soit ?code= (PKCE) soit #access_token= (implicit, détecté automatiquement)
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await sb.auth.exchangeCodeForSession(code);
        if (!error) { setSessionReady(true); return; }
      }
      const { data } = await sb.auth.getSession();
      setSessionReady(Boolean(data.session));
    };
    init();

    return () => subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.length < 8) { setErr("8 caractères minimum."); return; }
    if (pass !== pass2) { setErr("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    setErr("");
    try {
      const sb = getSupabase();
      const { error } = await sb!.auth.updateUser({ password: pass });
      if (error) { setErr("Lien expiré ou invalide. Redemandez un lien."); return; }
      setOk(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl ring-1 ring-slate-900/5 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.3)] p-8">
          <LogoBlock content={content} variant="login" />
          {sessionReady === false ? (
            <div className="mt-7 text-[13.5px] text-slate-600 text-center leading-relaxed">
              Lien de réinitialisation invalide ou expiré.
              <button onClick={onDone} className="block mx-auto mt-4 text-[#1E9BE0] font-semibold hover:underline">
                Retour à la connexion
              </button>
            </div>
          ) : ok ? (
            <div className="mt-7 text-[13.5px] text-slate-600 text-center leading-relaxed">
              Mot de passe mis à jour. Vous pouvez vous connecter.
              <button onClick={onDone} className="block mx-auto mt-4 text-[#1E9BE0] font-semibold hover:underline">
                Aller à la connexion
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="text-[12.5px] font-semibold text-slate-700">Nouveau mot de passe</label>
                <div className="mt-1.5 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{I.lock("w-4 h-4")}</span>
                  <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px]" />
                </div>
              </div>
              <div>
                <label className="text-[12.5px] font-semibold text-slate-700">Confirmer</label>
                <div className="mt-1.5 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{I.lock("w-4 h-4")}</span>
                  <input type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-[#1E9BE0] focus:ring-2 focus:ring-[#1E9BE0]/10 outline-none text-[14px]" />
                </div>
              </div>
              {err && <div className="text-[13px] text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</div>}
              <button type="submit" disabled={loading || sessionReady !== true} className="w-full bg-[#0A2A6B] hover:bg-[#071B4C] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors">
                {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
