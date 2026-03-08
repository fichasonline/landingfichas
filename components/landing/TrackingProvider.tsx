"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  createEventId,
  startScrollDepthTracking,
  trackPageView,
} from "@/lib/tracking/events";
import { initMetaPixel } from "@/lib/tracking/metaPixel";
import { persistAttribution } from "@/lib/utils/utm";

export function TrackingProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    persistAttribution();
    initMetaPixel();
    trackPageView({
      eventId: createEventId("page_view"),
    });

    const cleanup = startScrollDepthTracking();

    return cleanup;
  }, [pathname, search]);

  return null;
}
