"use client";

import type { MouseEvent } from "react";

import { trackWhatsAppClick } from "@/lib/tracking/events";

type TrackedWhatsAppButtonProps = {
  href: string;
  label: string;
  context: string;
  className?: string;
  variant?: "primary" | "secondary";
};

export function TrackedWhatsAppButton({
  href,
  label,
  context,
  className,
  variant = "secondary",
}: TrackedWhatsAppButtonProps) {
  const isEnabled = Boolean(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isEnabled) {
      event.preventDefault();
      return;
    }

    trackWhatsAppClick({
      button_location: context,
      cta_label: label,
      destination: href,
    });
  };

  return (
    <a
      href={isEnabled ? href : "#registro"}
      target={isEnabled ? "_blank" : undefined}
      rel={isEnabled ? "noreferrer" : undefined}
      onClick={handleClick}
      className={[
        variant === "primary" ? "cta-primary" : "cta-secondary",
        !isEnabled ? "pointer-events-none opacity-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </a>
  );
}
