"use client";

import { useEffect, useState } from "react";
import { I } from "@/lib/icons";
import { Btn, Confirm, TextField } from "@/components/fields";
import { getSupabase } from "@/lib/supabase/client";
import { ROLE_LABELS, type AdminRole } from "@/lib/roles";
import type { ToastFn } from "@/lib/types";

type AdminUserRow = { email: string; role: AdminRole; created_at: string };

const ROLE_DESC: Record<AdminRole, string> = {
  super_admin: "Accès total + gestion des comptes",
  admin: "Toutes les sections sauf les comptes",
  editor: "Contenu du site uniquement",
};

export function AdminAccounts({ onToast }: { onToast: ToastFn }) {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");
  const [confirmDel, setConfirmDel] = useState<AdminUserRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [myEmail, setMyEmail] = useState("");

  const authedFetch = async (input: string, init: RequestInit = {}) => {
    const { data } = await getSupabase()!.auth.getSession();
    const token = data.session?.access_token;
    return fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    });
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/admin/users");
      const json = await res.json();
      if (!res.ok) { onToast(json.error || "Erreur de chargement", "error"); return; }
      setUsers(json.users || []);
      const { data } = await getSupabase()!.auth.getUser();
      setMyEmail(data.user?.email?.toLowerCase() || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!email.trim()) {
      onToast("E-mail requis", "error");
      return;
    }
    if (password && password.length < 8) {
      onToast("Mot de passe : 8 caractères minimum (ou vide pour inviter par e-mail)", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await authedFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password, role }),
      });
      const json = await res.json();
      if (!res.ok) { onToast(json.error || "Échec de création", "error"); return; }
      onToast(password ? `Compte ${email.trim()} créé` : `Invitation envoyée à ${email.trim()}`);
      setAdding(false); setEmail(""); setPassword(""); setRole("editor");
      load();
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (u: AdminUserRow, newRole: AdminRole) => {
    const res = await authedFetch("/api/admin/users", {
      method: "PATCH",
      body: JSON.stringify({ email: u.email, role: newRole }),
    });
    const json = await res.json();
    if (!res.ok) { onToast(json.error || "Échec", "error"); return; }
    onToast("Rôle mis à jour");
    setUsers((us) => us.map((x) => (x.email === u.email ? { ...x, role: newRole } : x)));
  };

  const remove = async (u: AdminUserRow) => {
    const res = await authedFetch("/api/admin/users", {
      method: "DELETE",
      body: JSON.stringify({ email: u.email }),
    });
    const json = await res.json();
    setConfirmDel(null);
    if (!res.ok) { onToast(json.error || "Échec", "error"); return; }
    onToast("Compte supprimé");
    setUsers((us) => us.filter((x) => x.email !== u.email));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900">Comptes administrateurs</h1>
          <p className="text-[14px] text-slate-500 mt-1">Gérez les accès au back-office et leurs permissions.</p>
        </div>
        <Btn variant="primary" icon={I.plus("w-4 h-4")} onClick={() => setAdding(true)}>Nouveau compte</Btn>
      </div>

      {adding && (
        <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-900/5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="E-mail" value={email} onChange={setEmail} placeholder="prenom@ecocleanexpert.ci" type="email" />
            <TextField label="Mot de passe (vide = invitation par e-mail)" value={password} onChange={setPassword} type="password" placeholder="Laisser vide pour envoyer une invitation" />
          </div>
          <div>
            <label className="text-[12.5px] font-semibold text-slate-700 block mb-1.5">Rôle</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-colors ${
                    role === r ? "border-[#1E9BE0] bg-[#1E9BE0]/5 text-[#1E9BE0]" : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {ROLE_LABELS[r]}
                  <span className="block text-[11px] font-normal text-slate-400">{ROLE_DESC[r]}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="primary" onClick={add}>{saving ? "Envoi…" : password ? "Créer le compte" : "Envoyer l'invitation"}</Btn>
            <Btn variant="outline" onClick={() => setAdding(false)}>Annuler</Btn>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl ring-1 ring-slate-900/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[13px] text-slate-400">Chargement…</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-[13px] text-slate-400">Aucun compte.</div>
        ) : (
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">E-mail</th>
                <th className="px-5 py-3 font-semibold">Rôle</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Créé le</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u.email.toLowerCase() === myEmail;
                return (
                  <tr key={u.email} className="border-b border-slate-50 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-slate-800">
                      {u.email}
                      {isMe && <span className="ml-2 text-[10.5px] font-semibold text-[#5CC63D] bg-[#5CC63D]/10 px-1.5 py-0.5 rounded">Vous</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) => changeRole(u, e.target.value as AdminRole)}
                        className="text-[13px] border border-slate-200 rounded-lg px-2 py-1.5 bg-white disabled:opacity-50"
                      >
                        {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                          <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {!isMe && (
                        <button aria-label="Supprimer" onClick={() => setConfirmDel(u)} className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 inline-flex items-center justify-center">
                          {I.trash("w-4 h-4")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Confirm
        open={Boolean(confirmDel)}
        title="Supprimer le compte"
        message={`Supprimer l'accès de ${confirmDel?.email} ? Son compte Auth sera aussi supprimé.`}
        onConfirm={() => confirmDel && remove(confirmDel)}
        onCancel={() => setConfirmDel(null)}
      />
    </div>
  );
}
