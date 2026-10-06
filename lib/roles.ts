"use client";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type AdminRole = "super_admin" | "admin" | "editor";

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  editor: "Éditeur",
};

/** Onglets accessibles par rôle */
export const ROLE_TABS: Record<AdminRole, string[]> = {
  super_admin: [
    "dashboard", "requests", "stats", "services", "faq", "legal",
    "beforeafter", "testimonials", "zones", "content", "media", "accounts",
  ],
  admin: [
    "dashboard", "requests", "stats", "services", "faq", "legal",
    "beforeafter", "testimonials", "zones", "content", "media",
  ],
  editor: [
    "dashboard", "services", "faq", "legal", "beforeafter",
    "testimonials", "zones", "content", "media",
  ],
};

export async function getMyRole(): Promise<AdminRole> {
  if (!isSupabaseConfigured) return "super_admin"; // mode démo
  const sb = getSupabase()!;
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email) return "editor";
  // RPC security definer : indépendant de la RLS (lecture toujours fiable)
  const { data: rpcRole } = await sb.rpc("my_role");
  if (rpcRole) return rpcRole as AdminRole;
  const { data } = await sb
    .from("admin_users")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();
  return (data?.role as AdminRole) || "editor";
}

export async function getMyEmail(): Promise<string> {
  if (!isSupabaseConfigured) return "admin@ecocleanexpert.ci";
  const { data: { user } } = await getSupabase()!.auth.getUser();
  return user?.email || "";
}
