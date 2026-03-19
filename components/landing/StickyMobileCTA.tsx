"use client";

import { useEffect, useState } from "react";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed bottom-0 inset-x-0 z-50 sm:hidden transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="border-t border-white/10 bg-[#06060e]/95 px-4 py-3 backdrop-blur-sm">
        <a
          href="#registro"
          className="cta-primary w-full text-base py-4"
        >
          Recibir agenda semanal gratis
        </a>
      </div>
    </div>
  );
}
