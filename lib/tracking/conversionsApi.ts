import "server-only";

import { createHash } from "node:crypto";

type MetaServerEventInput = {
  eventId: string;
  eventName: string;
  eventSourceUrl?: string;
  customData?: Record<string, unknown>;
  testEventCode?: string;
  userData?: {
    email?: string;
    phone?: string;
    fbc?: string;
    fbp?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
};

const META_GRAPH_API_VERSION = "v20.0";

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function compact<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, current]) => current !== undefined),
  ) as T;
}

export async function sendMetaConversionEvent(input: MetaServerEventInput) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return {
      sent: false,
      reason: "missing_meta_credentials",
    } as const;
  }

  const userData = compact({
    em: input.userData?.email
      ? hashValue(input.userData.email.trim().toLowerCase())
      : undefined,
    ph: input.userData?.phone
      ? hashValue(normalizePhone(input.userData.phone))
      : undefined,
    fbc: input.userData?.fbc,
    fbp: input.userData?.fbp,
    client_ip_address: input.userData?.clientIpAddress,
    client_user_agent: input.userData?.clientUserAgent,
  });

  const payload = compact({
    data: [
      compact({
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
        custom_data: compact(input.customData ?? {}),
      }),
    ],
    test_event_code: input.testEventCode ?? process.env.META_TEST_EVENT_CODE,
  });

  const response = await fetch(
    `https://graph.facebook.com/${META_GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      sent: false,
      reason: await response.text(),
    } as const;
  }

  return {
    sent: true,
    response: (await response.json()) as unknown,
  } as const;
}
