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

async function sendClientEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { sent: false, reason: "no_key" as const };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend client:", res.status, await res.text());
    return { sent: false, reason: "api_error" as const, status: res.status };
  }
  return { sent: true };
}

/** Accusé de réception envoyé au client juste après sa demande de devis. */
export async function sendClientConfirmation(r: QuoteRequest) {
  if (!r.email) return { sent: false, reason: "no_email" as const };
  const firstName = r.name.split(" ")[0];
  return sendClientEmail(
    r.email,
    "Demande de devis bien reçue — Eco Clean Expert",
    `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0A2A6B">Merci ${firstName} !</h2>
      <p>Nous avons bien reçu votre demande de devis${r.service ? ` pour <strong>${r.service}</strong>` : ""}${r.commune ? ` à <strong>${r.commune}</strong>` : ""}.</p>
      <p>Notre équipe vous recontacte <strong>très rapidement</strong> au ${r.phone} pour confirmer votre intervention.</p>
      <p style="margin-top:24px">À très vite,<br/><strong>L'équipe Eco Clean Expert</strong><br/>
      <span style="color:#666;font-size:13px">Nettoyage professionnel à Abidjan — ecocleanexpert.site</span></p>
    </div>`
  );
}

/** E-mail envoyé au client quand l'admin change le statut de sa demande. */
export async function sendStatusEmail(r: QuoteRequest, status: string) {
  if (!r.email) return { sent: false, reason: "no_email" as const };
  const firstName = r.name.split(" ")[0];
  const msg: Record<string, string> = {
    "En cours": "Votre demande est <strong>en cours de traitement</strong>. Nous préparons votre intervention.",
    "Traité": "Votre demande a été <strong>traitée</strong>. Merci de votre confiance !",
    "Annulé": "Votre demande a été <strong>annulée</strong>. Contactez-nous s'il s'agit d'une erreur.",
    "Nouveau": "Votre demande est repassée en statut <strong>nouveau</strong>.",
  };
  return sendClientEmail(
    r.email,
    `Votre demande de devis — ${status} — Eco Clean Expert`,
    `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
      <h2 style="color:#0A2A6B">Bonjour ${firstName},</h2>
      <p>${msg[status] || `Le statut de votre demande est maintenant <strong>${status}</strong>.`}</p>
      <p style="color:#666;font-size:13px">Demande${r.service ? ` : ${r.service}` : ""}${r.commune ? ` — ${r.commune}` : ""}</p>
      <p style="margin-top:24px">L'équipe Eco Clean Expert<br/>
      <span style="color:#666;font-size:13px">ecocleanexpert.site</span></p>
    </div>`
  );
}
