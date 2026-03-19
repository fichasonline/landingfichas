"use client";

import { motion } from "framer-motion";

import { LeadForm } from "@/components/landing/LeadForm";
import { TrackedWhatsAppButton } from "@/components/landing/TrackedWhatsAppButton";

type HeroProps = {
  whatsappUrl: string;
};

const heroNotes = [
  "Agenda semanal ordenada en un solo mail",
  "Novedades y fechas clave sin ruido",
  "Canal directo por WhatsApp para consultar",
];

const quickCards = [
  {
    label: "Formato",
    value: "Grilla semanal clara",
  },
  {
    label: "Enfoque",
    value: "Informacion util y al dia",
  },
  {
    label: "Canal extra",
    value: "WhatsApp opcional",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Hero({ whatsappUrl }: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-center py-4 sm:py-6 lg:py-8">
      <div className="section-shell">
        <div className="panel w-full border-violet/20 bg-[linear-gradient(180deg,rgba(143,117,255,0.1),rgba(12,12,24,0.82)_28%,rgba(10,10,18,0.92)_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,247,255,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(143,117,255,0.2),transparent_30%)]" />
          <motion.div
            className="relative grid gap-10 px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-12 lg:py-14 xl:px-16 xl:py-16"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col justify-between gap-10">
              <div className="space-y-6">
                <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4">
                  <div className="eyebrow">Gratis · Sin spam · Baja cuando quieras</div>
                  <a
                    href="#como-funciona"
                    className="text-sm font-medium text-white/58 transition hover:text-white"
                  >
                    Ver como funciona
                  </a>
                </motion.div>

                <motion.div variants={item} className="space-y-5">
                  <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl lg:text-7xl">
                    La agenda de torneos de poker de la semana, en tu mail
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                    Un mail semanal con la grilla completa de torneos, fechas clave y novedades. Sin buscar, sin perderte nada.
                  </p>
                </motion.div>

                <motion.ul
                  variants={item}
                  className="grid gap-3 text-sm text-white/72 sm:grid-cols-3"
                >
                  {heroNotes.map((note) => (
                    <li
                      key={note}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 leading-6"
                    >
                      {note}
                    </li>
                  ))}
                </motion.ul>
              </div>

              <motion.div variants={item} className="grid gap-3 sm:grid-cols-3">
                {quickCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-soft/80">
                      {card.label}
                    </p>
                    <p className="mt-2 text-base font-medium text-white/88">
                      {card.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={item} className="relative">
              <div className="panel h-full border-white/12 bg-[#090a15]/85 p-5 sm:p-6 lg:p-8">
                <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-violet/20 bg-violet/10 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-soft">
                      100% gratis · Baja cuando quieras
                    </p>
                    <p className="mt-1 text-sm text-white/70">
                      Solo necesitas tu mail. Un envio por semana, nada mas.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-center">
                    <p className="font-mono text-xs text-emerald-300">Gratis</p>
                    <p className="text-lg font-semibold text-white">✓</p>
                  </div>
                </div>

                <LeadForm
                  formId="hero-form"
                  title="Quiero la grilla por mail"
                  description="Deja tus datos y te sumamos al envio semanal con agenda, novedades y fechas clave."
                  submitLabel="Recibir agenda semanal"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <TrackedWhatsAppButton
                    href={whatsappUrl}
                    label="Pedir info por WhatsApp"
                    context="hero"
                    className="w-full"
                  />
                  <a href="#preview" className="cta-secondary w-full">
                    Ver como llega la agenda
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
