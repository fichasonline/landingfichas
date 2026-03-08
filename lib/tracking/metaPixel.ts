type FbqCommand = "init" | "track" | "trackCustom";

type FbqFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  loaded?: boolean;
  push?: (...args: unknown[]) => void;
  version?: string;
};

declare global {
  interface Window {
    _fbq?: FbqFunction;
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: FbqFunction;
  }
}

const STANDARD_META_EVENTS = new Set(["PageView", "Lead"]);

function cleanPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

function createFbqStub(): FbqFunction {
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue = fbq.queue ?? [];
    fbq.queue.push(args);
  }) as FbqFunction;

  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  fbq.push = (...args: unknown[]) => fbq(...args);

  return fbq;
}

export function initMetaPixel() {
  if (typeof window === "undefined") {
    return;
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) {
    return;
  }

  if (!window.fbq) {
    const fbq = createFbqStub();
    window.fbq = fbq;
    window._fbq = fbq;
    window.fbq("init", pixelId);
  }

  if (document.getElementById("meta-pixel-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "meta-pixel-script";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
}

export function trackMetaEvent(
  eventName: string,
  payload: Record<string, unknown> = {},
  eventId?: string,
) {
  if (typeof window === "undefined") {
    return;
  }

  initMetaPixel();

  if (!window.fbq) {
    return;
  }

  const mode: FbqCommand = STANDARD_META_EVENTS.has(eventName)
    ? "track"
    : "trackCustom";
  const cleanedPayload = cleanPayload(payload);

  if (eventId) {
    window.fbq(mode, eventName, cleanedPayload, { eventID: eventId });
    return;
  }

  window.fbq(mode, eventName, cleanedPayload);
}
