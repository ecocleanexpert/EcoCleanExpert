import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/server";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function requireSuperAdmin(req: NextRequest) {
  if (!url || !anonKey) {
    return { error: NextResponse.json({ error: "Supabase non configuré" }, { status: 503 }) };
  }
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token) {
    return { error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }) };
  }
  const anon = createClient(url, anonKey);
  const { data: { user }, error } = await anon.auth.getUser(token);
  if (error || !user?.email) {
    return { error: NextResponse.json({ error: "Session invalide" }, { status: 401 }) };
  }
  const sb = getServiceSupabase();
  if (!sb) {
    return { error: NextResponse.json({ error: "Service indisponible" }, { status: 503 }) };
  }
  const { data: me } = await sb
    .from("admin_users")
    .select("role")
    .eq("email", user.email)
    .maybeSingle();
  if (me?.role !== "super_admin") {
    return { error: NextResponse.json({ error: "Droits super-admin requis" }, { status: 403 }) };
  }
  return { sb, user };
}

export async function GET(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (auth.error) return auth.error;
  const { data, error } = await auth.sb!.from("admin_users").select("email, role, created_at").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (auth.error) return auth.error;
  const { email, password, role } = await req.json();
  if (!email?.trim()) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }
  if (password && password.length < 8) {
    return NextResponse.json({ error: "Mot de passe : 8 caractères minimum" }, { status: 400 });
  }
  if (!["super_admin", "admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
  }
  const sb = auth.sb!;
  let createErr;
  if (password) {
    ({ error: createErr } = await sb.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
    }));
  } else {
    // Invitation par e-mail via Resend : generateLink crée le compte
    // et fournit le lien d'activation sans passer par le SMTP Supabase
    const { data: linkData, error: linkErr } = await sb.auth.admin.generateLink({
      type: "invite",
      email: email.trim().toLowerCase(),
      options: { redirectTo: `${req.nextUrl.origin}/kdlebron13/reset` },
    });
    createErr = linkErr;
    if (!createErr) {
      const actionLink = linkData?.properties?.action_link;
      const resendKey = process.env.RESEND_API_KEY;
      if (actionLink && resendKey) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Eco Clean Expert <noreply@ecocleanexpert.site>",
            to: [email.trim().toLowerCase()],
            subject: "Invitation — Administration Eco Clean Expert",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
                <h2 style="color:#0A2A6B">Bienvenue sur Eco Clean Expert</h2>
                <p>Vous avez été invité(e) à administrer le site <strong>ecocleanexpert.site</strong>.</p>
                <p><a href="${actionLink}" style="display:inline-block;background:#2E7D22;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold">Activer mon compte</a></p>
                <p style="color:#666;font-size:13px">Ce lien vous permet de définir votre mot de passe. Il expire après 24&nbsp;h.</p>
              </div>`,
          }),
        });
        if (!res.ok) {
          console.error("Resend invite:", res.status, await res.text());
        }
      }
    }
  }
  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 400 });
  const { error } = await sb.from("admin_users").upsert({ email: email.trim().toLowerCase(), role });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (auth.error) return auth.error;
  const { email, role } = await req.json();
  if (!email || !["super_admin", "admin", "editor"].includes(role)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }
  if (email.toLowerCase() === auth.user!.email?.toLowerCase() && role !== "super_admin") {
    return NextResponse.json({ error: "Impossible de rétrograder votre propre compte" }, { status: 400 });
  }
  const { error } = await auth.sb!.from("admin_users").update({ role }).eq("email", email.toLowerCase());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireSuperAdmin(req);
  if (auth.error) return auth.error;
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });
  if (email.toLowerCase() === auth.user!.email?.toLowerCase()) {
    return NextResponse.json({ error: "Impossible de supprimer votre propre compte" }, { status: 400 });
  }
  const sb = auth.sb!;
  await sb.from("admin_users").delete().eq("email", email.toLowerCase());
  const { data: found } = await sb.auth.admin.listUsers();
  const target = found?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (target) await sb.auth.admin.deleteUser(target.id);
  return NextResponse.json({ ok: true });
}
