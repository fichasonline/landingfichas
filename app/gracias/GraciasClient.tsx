"use client";

import { useEffect, useState } from "react";

const LOGO_GLOW = "/svg/LOGO%20CON%20LUZ.svg";
const REDIRECT_URL = "https://fichasonline.uy";
const COUNTDOWN_SECONDS = 20;

export function GraciasClient() {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (seconds <= 0) {
      window.location.href = REDIRECT_URL;
      return;
    }

    const timer = window.setTimeout(() => {
      setSeconds((currentSeconds) => currentSeconds - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [seconds]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060b] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,117,255,0.28),transparent_38%),radial-gradient(circle_at_bottom,rgba(29,223,111,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 [mask-image:linear-gradient(180deg,rgba(0,0,0,0.85),transparent_95%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-12 sm:px-8">
        <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-10 text-center shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-10 sm:py-14">
          <img
            src={LOGO_GLOW}
            alt="Fichas Online"
            width="220"
            height="104"
            className="mx-auto mb-10 h-auto w-[180px] sm:w-[220px]"
          />

          <h1 className="text-[2.75rem] font-semibold uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[4rem]">
            <span className="block">Ya estas</span>
            <span className="block text-violet">adentro</span>
          </h1>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300 sm:text-base">
            Te contactamos pronto con toda la info
          </p>

          <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-violet/70" />

          <div className="mx-auto mt-8 max-w-md space-y-4 text-sm font-medium uppercase leading-[1.35] tracking-[0.08em] text-white/72 sm:text-base">
            <p className="text-xl font-semibold tracking-[0.16em] text-violet sm:text-2xl">
              Que es Fichas Online
            </p>
            <p>
              La comunidad de poker mas activa de Uruguay. Grilla de mesas en tiempo real,
              torneos, resultados y las ultimas novedades del circuito en un solo lugar.
            </p>
            <p>
              Desde cash games hasta los torneos mas grandes del pais, en Fichas Online sabes
              donde jugar y cuando.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-sm rounded-[24px] border border-violet/30 bg-white/[0.04] px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Entra a la plataforma en
            </p>
            <div className="mt-3 text-6xl font-black leading-none text-violet [text-shadow:0_0_24px_rgba(143,117,255,0.55)]">
              {seconds}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              segundos
            </p>
          </div>

          <a
            href={REDIRECT_URL}
            className="mt-8 inline-flex w-full max-w-sm items-center justify-center rounded-full bg-emerald-400 px-5 py-4 text-sm font-black uppercase tracking-[0.16em] text-[#0b0d12] transition hover:bg-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            Ir a Fichas Online ahora
          </a>
        </div>
      </section>
    </main>
  );
}
