import { Reveal } from "@/components/landing/Reveal";

const benefits = [
  {
    title: "Agenda mas ordenada",
    description: "Tenes la semana resumida en un solo lugar, con foco en lo importante.",
  },
  {
    title: "Fechas con tiempo",
    description: "Te enteras antes de torneos y movimientos clave para organizarte mejor.",
  },
  {
    title: "Menos ruido",
    description: "Ahorras tiempo buscando info dispersa entre grupos, mensajes y posteos sueltos.",
  },
  {
    title: "WhatsApp abierto",
    description: "Si algo no te queda claro, podes escribir y pedir mas contexto cuando quieras.",
  },
  {
    title: "Movida mas clara",
    description: "Seguis la agenda semanal con una referencia simple, prolija y facil de consultar.",
  },
];

export function Benefits() {
  return (
    <section className="section-shell section-space">
      <Reveal className="space-y-4">
        <div className="eyebrow">Valor</div>
        <h2 className="section-title">Por que sumarte</h2>
        <p className="section-copy">
          No es una lista para presionarte. Es una forma mas ordenada de seguir
          la agenda, enterarte con tiempo y tener un canal simple para consultar.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {benefits.map((benefit, index) => (
          <Reveal
            key={benefit.title}
            className={[
              "panel p-5 sm:p-6 lg:p-7",
              index === 0 ? "md:col-span-2 xl:col-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/50">
              Beneficio
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              {benefit.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/64 sm:text-base">
              {benefit.description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
