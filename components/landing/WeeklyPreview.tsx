import { Reveal } from "@/components/landing/Reveal";

const week = [
  {
    day: "Lunes",
    tag: "Arranque",
    events: [
      { time: "19:30", title: "Deepstack inicio", meta: "Sala Centro" },
      { time: "22:00", title: "Turbo nocturno", meta: "Buy-in ejemplo" },
    ],
  },
  {
    day: "Martes",
    tag: "Ritmo",
    events: [
      { time: "18:45", title: "Knockout midweek", meta: "Cupos limitados" },
      { time: "21:30", title: "Clasificatorio", meta: "Mesa final domingo" },
    ],
  },
  {
    day: "Miercoles",
    tag: "Mitad de semana",
    events: [
      { time: "19:00", title: "Stack profundo", meta: "Nivel largo" },
      { time: "22:10", title: "Second chance", meta: "Reentrada" },
    ],
  },
  {
    day: "Jueves",
    tag: "Fecha fuerte",
    events: [
      { time: "20:00", title: "Main semanal", meta: "Bounty especial" },
      { time: "23:00", title: "Late turbo", meta: "Cierre rapido" },
    ],
  },
  {
    day: "Viernes",
    tag: "Noche",
    events: [
      { time: "19:30", title: "Friday classic", meta: "Sala principal" },
      { time: "23:45", title: "Night stack", meta: "Field amplio" },
    ],
  },
  {
    day: "Sabado",
    tag: "Weekend",
    events: [
      { time: "16:00", title: "Satelite weekend", meta: "Paso al domingo" },
      { time: "20:30", title: "Freezeout sabado", meta: "Sin recarga" },
    ],
  },
  {
    day: "Domingo",
    tag: "Cierre",
    events: [
      { time: "15:30", title: "Main dominical", meta: "Torneo destacado" },
      { time: "21:00", title: "Clausura turbo", meta: "Ultima llamada" },
    ],
  },
];

export function WeeklyPreview() {
  return (
    <section id="preview" className="section-shell section-space">
      <Reveal className="space-y-4">
        <div className="eyebrow">Preview semanal</div>
        <h2 className="section-title">
          Asi se puede ver una grilla semanal bien ordenada
        </h2>
        <p className="section-copy">
          Es un ejemplo visual estatico, pensado para que se entienda rapido el
          tipo de agenda que llega por mail. No es una cartelera real.
        </p>
      </Reveal>

      <Reveal className="panel mt-10 p-4 sm:p-6 lg:p-8 xl:p-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-violet-soft/80">
              Agenda ejemplo
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Lunes a domingo, con bloques claros y notas utiles
            </h3>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60">
            Mail semanal + novedades + acceso directo a WhatsApp si queres
            ampliar info.
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {week.map((day) => (
            <div
              key={day.day}
              className="rounded-[24px] border border-white/10 bg-[#090a15]/85 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{day.day}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-soft/75">
                    {day.tag}
                  </p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_18px_rgba(124,247,255,0.45)]" />
              </div>

              <div className="mt-5 space-y-3">
                {day.events.map((event) => (
                  <div
                    key={`${day.day}-${event.time}-${event.title}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
                  >
                    <p className="font-mono text-xs text-white/45">{event.time}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/92">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/50">
                      {event.meta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
