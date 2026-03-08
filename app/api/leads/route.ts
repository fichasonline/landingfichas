import { appendFile } from "node:fs/promises";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sendWelcomeEmail } from "@/lib/email";
import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import { sendMetaConversionEvent } from "@/lib/tracking/conversionsApi";
import { leadRequestSchema } from "@/lib/validation/lead";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!forwardedFor) {
    return undefined;
  }

  return forwardedFor.split(",")[0]?.trim();
}

export async function POST(request: Request) {
  try {
    const json = (await request.json()) as unknown;
    const parsed = leadRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Datos invalidos.",
        },
        {
          status: 400,
        },
      );
    }

    const data = parsed.data;
    const cookieStore = cookies();
    const ip = getClientIp(request);
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const referrer = data.referrer ?? request.headers.get("referer") ?? undefined;
    const fbp =
      data.fbp ??
      cookieStore.get("_fbp")?.value ??
      cookieStore.get("fichas_fbp")?.value;
    const fbc =
      data.fbc ??
      cookieStore.get("_fbc")?.value ??
      cookieStore.get("fichas_fbc")?.value;

    const record = {
      nombre: data.nombre,
      email: data.email,
      whatsapp: data.whatsapp ?? null,
      consent_email: data.consentEmail,
      utm_source: data.utm_source ?? null,
      utm_medium: data.utm_medium ?? null,
      utm_campaign: data.utm_campaign ?? null,
      utm_content: data.utm_content ?? null,
      utm_term: data.utm_term ?? null,
      referrer: referrer ?? null,
      landing_path: data.landingPath ?? null,
      source_url: data.sourceUrl ?? null,
      event_id: data.eventId ?? null,
      fbp: fbp ?? null,
      fbc: fbc ?? null,
      ip: ip ?? null,
      user_agent: userAgent ?? null,
    };

    let savedIn: "supabase" | "tmp";

    if (isSupabaseConfigured()) {
      const supabase = createSupabaseAdminClient();
      const { error } = await supabase
        .from("leads_agenda_semanal")
        .insert(record);

      if (error) {
        throw new Error(error.message);
      }

      savedIn = "supabase";
    } else if (process.env.NODE_ENV !== "production") {
      await appendFile(
        "/tmp/leads_agenda_semanal.jsonl",
        `${JSON.stringify({
          ...record,
          created_at: new Date().toISOString(),
        })}\n`,
      );

      savedIn = "tmp";
    } else {
      throw new Error("SUPABASE_NOT_CONFIGURED");
    }

    const emailResult = await sendWelcomeEmail({
      nombre: data.nombre,
      email: data.email,
      whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL,
    });

    const metaResult = await sendMetaConversionEvent({
      eventId: data.eventId ?? `lead_${Date.now()}`,
      eventName: "Lead",
      eventSourceUrl:
        data.sourceUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
      userData: {
        email: data.email,
        phone: data.whatsapp,
        fbp,
        fbc,
        clientIpAddress: ip,
        clientUserAgent: userAgent,
      },
      customData: {
        form_id: data.formId,
        landing_path: data.landingPath,
        referrer,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
      },
    });

    return NextResponse.json(
      {
        success: true,
        savedIn,
        emailStatus: emailResult.status,
        capiStatus: metaResult.sent ? "sent" : "skipped",
        eventId: data.eventId,
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("LEAD_SUBMIT_FAILED", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "No pudimos registrar el lead.",
      },
      {
        status: 500,
      },
    );
  }
}
