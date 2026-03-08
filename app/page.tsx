import { Suspense } from "react";

import { Benefits } from "@/components/landing/Benefits";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TrackingProvider } from "@/components/landing/TrackingProvider";
import { TrustSection } from "@/components/landing/TrustSection";
import { WeeklyPreview } from "@/components/landing/WeeklyPreview";

export default function Page() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "";

  return (
    <>
      <Suspense fallback={null}>
        <TrackingProvider />
      </Suspense>
      <main className="page-shell pb-16 sm:pb-20 lg:pb-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top,rgba(143,117,255,0.28),transparent_58%)]" />
        <div className="pointer-events-none absolute right-[-10%] top-[20%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(124,247,255,0.14),transparent_70%)] blur-3xl" />
        <Hero whatsappUrl={whatsappUrl} />
        <HowItWorks />
        <Benefits />
        <WeeklyPreview />
        <TrustSection whatsappUrl={whatsappUrl} />
        <FinalCTA whatsappUrl={whatsappUrl} />
        <footer className="section-shell section-space pb-10 sm:pb-12 lg:pb-16">
          <div className="border-t border-white/10 py-8 text-sm text-white/55">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>Fichas Weekly. Agenda informativa de torneos y novedades semanales.</p>
              <p>La agenda puede cambiar segun sala, cupos y organizacion de cada fecha.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
