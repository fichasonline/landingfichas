import { Reveal } from "@/components/landing/Reveal";

const steps = [
  {
    id: "01",
    title: "Te registras",
    description:
      "Dejas nombre, mail y WhatsApp solo si queres un canal mas directo.",
  },
  {
    id: "02",
    title: "Recibis la agenda semanal",
    description:
      "Te llega una grilla clara por mail con torneos, fechas clave y novedades.",
  },
  {
    id: "03",
    title: "Si queres, consultas por WhatsApp",
    description:
      "Cuando te surja una duda puntual, escribis y te orientamos sin vueltas.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section-shell section-space">
      <Reveal className="space-y-4">
        <div className="eyebrow">Como funciona</div>
        <h2 className="section-title">Simple, rapido y sin vueltas</h2>
        <p className="section-copy">
          La idea es ordenar la informacion semanal para que sigas la agenda con
          mas claridad, sin tener que salir a juntar datos por todos lados.
        </p>
      </Reveal>

      <Reveal className="mt-10 grid gap-4 lg:grid-cols-3">
        {steps.map((step) => (
          <div key={step.id} className="panel p-6 sm:p-7 lg:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl border border-violet/20 bg-violet/10 px-4 py-2 font-mono text-sm text-violet-soft">
                {step.id}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-violet/25 to-transparent" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-7 text-white/65">
              {step.description}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
