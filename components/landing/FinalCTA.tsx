import { LeadForm } from "@/components/landing/LeadForm";
import { Reveal } from "@/components/landing/Reveal";
import { TrackedWhatsAppButton } from "@/components/landing/TrackedWhatsAppButton";

type FinalCTAProps = {
  whatsappUrl: string;
};

const finalNotes = [
  "Agenda semanal por mail",
  "Novedades utiles y fechas clave",
  "WhatsApp opcional para ampliar info",
];

export function FinalCTA({ whatsappUrl }: FinalCTAProps) {
  return (
    <section id="registro" className="section-shell section-space">
      <Reveal className="panel border-violet/18 bg-[linear-gradient(180deg,rgba(143,117,255,0.08),rgba(10,10,18,0.94)_100%)] p-6 sm:p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-5">
            <div className="eyebrow">CTA final</div>
            <h2 className="section-title">
              Recibi la agenda semanal y segui la movida con mas claridad
            </h2>
            <p className="section-copy max-w-none">
              Deja tu mail y te la mandamos. Si preferis hablar directo, tambien
              podes escribir por WhatsApp y pedir mas info.
            </p>

            <div className="grid gap-3">
              {finalNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-base text-white/74"
                >
                  {note}
                </div>
              ))}
            </div>

            <TrackedWhatsAppButton
              href={whatsappUrl}
              label="Pedir info por WhatsApp"
              context="final_cta"
              className="w-full sm:w-auto"
            />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#090a15]/88 p-5 sm:p-6">
            <LeadForm
              formId="final-form"
              title="Sumate a la comunidad"
              description="Registrate para recibir la agenda semanal y tener una referencia clara de lo que se juega."
              submitLabel="Sumarme a la comunidad"
              compact
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
