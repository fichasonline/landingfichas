import { Reveal } from "@/components/landing/Reveal";
import { TrackedWhatsAppButton } from "@/components/landing/TrackedWhatsAppButton";

type TrustSectionProps = {
  whatsappUrl: string;
};

const trustPoints = [
  "Informacion ordenada, clara y al dia.",
  "Una forma simple de seguir la agenda semanal.",
  "Si tenes dudas, escribis y te orientamos.",
];

export function TrustSection({ whatsappUrl }: TrustSectionProps) {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Reveal className="panel p-6 sm:p-8 lg:p-10">
          <div className="eyebrow">Confianza</div>
          <h2 className="mt-5 section-title">
            Informacion clara para seguir la movida
          </h2>
          <p className="mt-5 section-copy max-w-none">
            La idea es simple: ayudarte a tener la agenda semanal mas a mano,
            con informacion ordenada y un canal directo para consultar lo que
            necesites.
          </p>

          <div className="mt-8 grid gap-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-base leading-7 text-white/76"
              >
                {point}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="panel p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-violet-soft/80">
            Canal directo
          </p>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-[#0a0b16]/90 p-5">
            <p className="text-sm uppercase tracking-[0.18em] text-white/42">
              WhatsApp
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Si queres mas contexto, escribis y listo
            </h3>
            <p className="mt-3 text-base leading-7 text-white/62">
              No hace falta pasar por un embudo raro. Si te sirve hablar directo,
              dejamos el canal abierto para resolver dudas o pedir mas info.
            </p>
            <TrackedWhatsAppButton
              href={whatsappUrl}
              label="Pedir info por WhatsApp"
              context="trust"
              className="mt-6 w-full sm:w-auto"
            />
          </div>

          <div className="mt-5 rounded-[24px] border border-dashed border-violet/25 bg-violet/10 p-5 text-sm leading-7 text-white/68">
            Seguimiento semanal, tono directo y datos claros. Nada de urgencias
            falsas ni promesas raras.
          </div>
        </Reveal>
      </div>
    </section>
  );
}
