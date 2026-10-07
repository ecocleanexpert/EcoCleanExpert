import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/server";
import { sendStatusEmail } from "@/lib/mail";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Réservé aux administrateurs connectés : notifie le client d'un
// changement de statut de sa demande de devis.
export async function POST(req: NextRequest) {
  if (!url || !anonKey) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const anon = createClient(url, anonKey);
  const { data: { user }, error } = await anon.auth.getUser(token);
  if (error || !user?.email) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }
  const sb = getServiceSupabase();
  if (!sb) {
    return NextResponse.json({ error: "Service indisponible" }, { status: 503 });
  }
  const { data: me } = await sb
    .from("admin_users")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();
  if (!me) {
    return NextResponse.json({ error: "Droits admin requis" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const { request, status } = body || {};
  if (!request?.id || !status) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const mail = await sendStatusEmail(request, status);
  return NextResponse.json({ ok: true, emailed: mail.sent });
}
