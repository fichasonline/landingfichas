import { NextResponse } from "next/server";
import { z } from "zod";

import { sendMetaConversionEvent } from "@/lib/tracking/conversionsApi";

const metaRouteSchema = z.object({
  eventName: z.string().trim().min(1).max(60),
  eventId: z.string().trim().min(1).max(120),
  sourceUrl: z.string().trim().url().max(2048).optional(),
  email: z.string().trim().toLowerCase().email().max(160).optional(),
  phone: z.string().trim().max(30).optional(),
  fbp: z.string().trim().max(255).optional(),
  fbc: z.string().trim().max(255).optional(),
  customData: z.record(z.unknown()).optional(),
});

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
    const parsed = metaRouteSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message ?? "Payload invalido.",
        },
        {
          status: 400,
        },
      );
    }

    const data = parsed.data;
    const result = await sendMetaConversionEvent({
      eventId: data.eventId,
      eventName: data.eventName,
      eventSourceUrl: data.sourceUrl,
      userData: {
        email: data.email,
        phone: data.phone,
        fbp: data.fbp,
        fbc: data.fbc,
        clientIpAddress: getClientIp(request),
        clientUserAgent: request.headers.get("user-agent") ?? undefined,
      },
      customData: data.customData,
    });

    if (!result.sent) {
      return NextResponse.json(
        {
          success: false,
          reason: result.reason,
        },
        {
          status: 503,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        result: result.response,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Meta conversion failed.",
      },
      {
        status: 500,
      },
    );
  }
}
