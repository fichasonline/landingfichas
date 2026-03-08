import "server-only";

import { Resend } from "resend";

type WelcomeEmailInput = {
  nombre: string;
  email: string;
  whatsappUrl?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendWelcomeEmail(input: WelcomeEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    return {
      status: "skipped",
    } as const;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(input.nombre);
  const safeWhatsappUrl = input.whatsappUrl;

  try {
    await resend.emails.send({
      from: "Fichas Weekly <onboarding@resend.dev>",
      to: [input.email],
      subject: "Ya quedaste en la agenda semanal",
      html: `
        <div style="background:#070710;padding:32px;font-family:Arial,sans-serif;color:#f4f5ff;">
          <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:24px;padding:32px;background:#101120;">
            <p style="margin:0 0 12px;font-size:14px;letter-spacing:0.18em;text-transform:uppercase;color:#c6bbff;">Fichas Weekly</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;">Ya quedaste en la agenda semanal</h1>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:rgba(244,245,255,0.82);">Gracias, ${safeName}. Desde ahora vas a recibir la grilla semanal con torneos, fechas clave y novedades para seguir la movida con mas claridad.</p>
            <p style="margin:0 0 26px;font-size:16px;line-height:1.65;color:rgba(244,245,255,0.82);">Si queres consultar algo puntual antes, te dejamos un canal directo para escribir por WhatsApp.</p>
            ${
              safeWhatsappUrl
                ? `<a href="${safeWhatsappUrl}" style="display:inline-block;padding:14px 22px;border-radius:16px;background:#8f75ff;color:#ffffff;text-decoration:none;font-weight:700;">Consultar por WhatsApp</a>`
                : ""
            }
          </div>
        </div>
      `,
    });

    return {
      status: "sent",
    } as const;
  } catch (error) {
    console.error("WELCOME_EMAIL_FAILED", error);

    return {
      status: "failed",
      error: error instanceof Error ? error.message : "unknown_error",
    } as const;
  }
}
