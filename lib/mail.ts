import type { QuoteRequest } from "./types";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@ecocleanexpert.ci";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Eco Clean Expert <noreply@ecocleanexpert.site>";

export async function sendRequestNotification(r: QuoteRequest) {
  if (!RESEND_API_KEY) return { sent: false, reason: "no_key" as const };

  const text = [
    `Nouvelle demande de devis — Eco Clean Expert`,
    ``,
    `Nom : ${r.name}`,
    `Téléphone : ${r.phone}`,
    `Email : ${r.email || "—"}`,
    `Service : ${r.service || "—"}`,
    `Commune : ${r.commune || "—"}`,
    r.message ? `Message : ${r.message}` : "",
    ``,
    `Reçue le ${new Date(r.date).toLocaleString("fr-FR", { timeZone: "Africa/Abidjan" })}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `Nouvelle demande de devis — ${r.name} (${r.service || "service"})`,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Resend:", res.status, body);
    return { sent: false, reason: "api_error" as const, status: res.status };
  }
  return { sent: true };
}
