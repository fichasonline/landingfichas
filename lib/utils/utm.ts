export type AttributionData = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
  referrer?: string;
  landing_path?: string;
  source_url?: string;
};

const STORAGE_KEY = "fichas_attribution_v1";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

function isBrowser() {
  return typeof window !== "undefined";
}

function cleanAttribution(
  attribution: Partial<AttributionData>,
): AttributionData {
  return Object.fromEntries(
    Object.entries(attribution).filter(([, value]) => {
      if (typeof value === "string") {
        return value.trim().length > 0;
      }

      return value !== undefined && value !== null;
    }),
  ) as AttributionData;
}

function readStoredAttribution(): AttributionData {
  if (!isBrowser()) {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    return cleanAttribution(JSON.parse(rawValue) as AttributionData);
  } catch {
    return {};
  }
}

function saveStoredAttribution(attribution: AttributionData) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
}

function readCookie(name: string) {
  if (!isBrowser()) {
    return undefined;
  }

  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : undefined;
}

function writeCookie(name: string, value: string) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
}

function createFbp() {
  return `fb.1.${Date.now()}.${Math.random().toString().slice(2, 12)}`;
}

function createFbc(fbclid: string) {
  return `fb.1.${Date.now()}.${fbclid}`;
}

export function persistAttribution() {
  if (!isBrowser()) {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const stored = readStoredAttribution();
  const fbclid = searchParams.get("fbclid") ?? stored.fbclid;
  const fbc =
    (fbclid ? createFbc(fbclid) : undefined) ??
    readCookie("_fbc") ??
    readCookie("fichas_fbc") ??
    stored.fbc;
  const fbp =
    readCookie("_fbp") ?? readCookie("fichas_fbp") ?? stored.fbp ?? createFbp();

  const nextAttribution = cleanAttribution({
    utm_source: searchParams.get("utm_source") ?? stored.utm_source,
    utm_medium: searchParams.get("utm_medium") ?? stored.utm_medium,
    utm_campaign: searchParams.get("utm_campaign") ?? stored.utm_campaign,
    utm_content: searchParams.get("utm_content") ?? stored.utm_content,
    utm_term: searchParams.get("utm_term") ?? stored.utm_term,
    fbclid,
    fbp,
    fbc,
    referrer: stored.referrer ?? document.referrer,
    landing_path: stored.landing_path ?? window.location.pathname,
    source_url: window.location.href,
  });

  saveStoredAttribution(nextAttribution);

  if (nextAttribution.fbp) {
    writeCookie("fichas_fbp", nextAttribution.fbp);
  }

  if (nextAttribution.fbc) {
    writeCookie("fichas_fbc", nextAttribution.fbc);
  }

  return nextAttribution;
}

export function getClientAttribution(): AttributionData {
  if (!isBrowser()) {
    return {};
  }

  const stored = readStoredAttribution();

  return cleanAttribution({
    ...stored,
    source_url: window.location.href,
    landing_path: stored.landing_path ?? window.location.pathname,
    referrer: stored.referrer ?? document.referrer,
    fbp: readCookie("_fbp") ?? readCookie("fichas_fbp") ?? stored.fbp,
    fbc: readCookie("_fbc") ?? readCookie("fichas_fbc") ?? stored.fbc,
  });
}
