import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { sendRequestNotification } from "@/lib/mail";
import type { QuoteRequest } from "@/lib/types";

// Rate limiting persistant via Supabase : 5 demandes / 10 min / IP
async function isRateLimited(ip: string): Promise<boolean> {
  const sb = getServiceSupabase();
  if (!sb) return false; // pas de DB → pas de blocage
  const { data, error } = await sb.rpc("hit_rate_limit", {
    k: `requests:${ip}`,
    max_hits: 5,
    window_sec: 600,
  });
  if (error) {
    console.error("rate limit:", error);
    return false;
  }
  return data === true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes, réessayez plus tard" },
      { status: 429 }
    );
  }

  let body: QuoteRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  if (!body?.name?.trim() || !body?.phone?.trim()) {
    return NextResponse.json(
      { error: "Nom et téléphone requis" },
      { status: 400 }
    );
  }

  // Limites de taille anti-abus
  const tooLong =
    (body.name || "").length > 120 ||
    (body.phone || "").length > 30 ||
    (body.email || "").length > 160 ||
    (body.service || "").length > 120 ||
    (body.commune || "").length > 80 ||
    (body.message || "").length > 2000;
  if (tooLong) {
    return NextResponse.json({ error: "Champs trop longs" }, { status: 400 });
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email.trim())) {
    return NextResponse.json({ error: "E-mail invalide" }, { status: 400 });
  }

  const request: QuoteRequest = {
    id: typeof body.id === "number" ? body.id : Date.now(),
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: body.email?.trim() || "",
    service: body.service || "",
    commune: body.commune || "",
    message: body.message?.trim() || "",
    date: body.date || new Date().toISOString(),
    status: "Nouveau",
  };

  const sb = getServiceSupabase();
  if (sb) {
    const { error } = await sb.from("requests").insert({
      name: request.name,
      phone: request.phone,
      email: request.email,
      service: request.service,
      commune: request.commune,
      message: request.message,
      status: request.status,
    });
    if (error) {
      console.error("insert request:", error);
      return NextResponse.json({ error: "Échec enregistrement" }, { status: 500 });
    }
  }

  const mail = await sendRequestNotification(request);
  return NextResponse.json({ ok: true, emailed: mail.sent });
}
