import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { sendRequestNotification } from "@/lib/mail";
import type { QuoteRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
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
