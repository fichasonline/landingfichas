import { getClientAttribution } from "@/lib/utils/utm";
import { trackMetaEvent } from "@/lib/tracking/metaPixel";

type TrackingPrimitive = boolean | number | string;

type TrackingEventInput = Record<string, TrackingPrimitive | undefined> & {
  eventId?: string;
};

function cleanPayload(payload: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

function pushToDataLayer(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event,
    ...payload,
  });
}

export function createEventId(prefix: string) {
  const sanitizedPrefix = prefix.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  return `${sanitizedPrefix}_${uuid}`;
}

function dispatchTrackingEvent(
  metaEventName: string,
  dataLayerEvent: string,
  extra: TrackingEventInput = {},
) {
  const attribution = getClientAttribution();
  const { eventId, ...rest } = extra;
  const resolvedEventId =
    typeof eventId === "string" && eventId.length > 0
      ? eventId
      : createEventId(metaEventName);

  const payload = cleanPayload({
    event_name: metaEventName,
    event_id: resolvedEventId,
    source_url: attribution.source_url,
    landing_path: attribution.landing_path,
    referrer: attribution.referrer,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    fbp: attribution.fbp,
    fbc: attribution.fbc,
    ...rest,
  });

  pushToDataLayer(dataLayerEvent, payload);
  trackMetaEvent(metaEventName, payload, resolvedEventId);

  return resolvedEventId;
}

export function trackPageView(extra: TrackingEventInput = {}) {
  return dispatchTrackingEvent("PageView", "page_view", extra);
}

export function trackLead(extra: TrackingEventInput = {}) {
  return dispatchTrackingEvent("Lead", "lead", extra);
}

export function trackWhatsAppClick(extra: TrackingEventInput = {}) {
  return dispatchTrackingEvent("WhatsAppClick", "whatsapp_click", extra);
}

export function trackFormStart(extra: TrackingEventInput = {}) {
  return dispatchTrackingEvent("FormStart", "form_start", extra);
}

export function trackScrollDepth(extra: TrackingEventInput = {}) {
  return dispatchTrackingEvent("ScrollDepth", "scroll_depth", extra);
}

export function startScrollDepthTracking() {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const thresholds = [25, 50, 75, 100];
  const seen = new Set<number>();
  let ticking = false;

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollableHeight <= 0
          ? 100
          : Math.round((window.scrollY / scrollableHeight) * 100);

      thresholds.forEach((threshold) => {
        if (progress >= threshold && !seen.has(threshold)) {
          seen.add(threshold);
          trackScrollDepth({
            eventId: createEventId(`scroll_${threshold}`),
            scroll_depth: threshold,
          });
        }
      });

      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => {
    window.removeEventListener("scroll", onScroll);
  };
}
