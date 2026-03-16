import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politicas de Privacidad | Fichas Weekly",
  description:
    "Informacion sobre privacidad, cookies y tratamiento de datos de Fichas Weekly.",
  alternates: {
    canonical: "/politicas-de-privacidad",
  },
};

const eventDetails = [
  { label: "Fecha y hora del evento", status: "Obligatorio API" },
  { label: "Nombre del evento", status: "Obligatorio API" },
  { label: "URL de origen del evento", status: "Obligatorio API" },
  { label: "Origen de la accion", status: "Obligatorio API" },
  { label: "Identificador de evento", status: "Referencia unica" },
];

const technicalData = [
  "Direccion IP de cliente",
  "Agente de usuario cliente (Obligatorio API)",
  "Cookie de identificador (fbc)",
  "Cookie del navegador (fbp)",
];

const personalData = [
  "Nombre",
  "Apellidos",
  "E-mail",
  "Telefono",
  "Ciudad",
  "Pais",
  "Estado o Provincia",
  "Codigo Postal",
  "Fecha de Nacimiento",
  "Sexo",
  "ID Externo",
  "ID Suscripcion",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-300 selection:bg-violet/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-violet/12 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-cyan-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:py-24">
        <a
          href="/"
          className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al inicio
        </a>

        <header className="mb-16">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Politicas de Privacidad
            <br className="hidden md:block" />
            <span className="text-violet"> y Cookies</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">
            En cumplimiento con los estandares de Meta y la API de Conversiones,
            detallamos el tratamiento de datos y los parametros de eventos que
            recolectamos para mejorar tu experiencia.
          </p>
        </header>

        <div className="space-y-12">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Parametros de detalles del evento
            </h2>
            <p className="mb-6 leading-relaxed">
              Seleccionamos los parametros necesarios para enviar con los eventos
              de contacto. La eficacia de nuestra comunicacion y el rendimiento de
              la plataforma dependen de la precision de estos datos.
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {eventDetails.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-zinc-900/50 p-4"
                >
                  <span className="font-medium text-zinc-200">{item.label}</span>
                  <span className="whitespace-nowrap rounded bg-violet/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-soft">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Instrucciones para la instalacion de la API de Conversiones
            </h2>
            <p className="leading-relaxed">
              Configuramos la infraestructura para asegurar que los parametros
              seleccionados creen un flujo de datos correcto hacia Meta. Esto
              permite que el sistema de conversiones valore la calidad de los
              datos enviados y optimice los resultados de interaccion.
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Informacion del cliente
            </h2>
            <p className="mb-6 leading-relaxed">
              Recopilamos informacion especifica de los clientes enviada desde
              nuestro servidor. Estos datos se utilizan para encontrar
              coincidencias con identificadores de cuentas de Facebook, atribuir
              rendimiento y mostrar informacion relevante a personas con mas
              posibilidades de interes.
            </p>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
                <h3 className="mb-2 font-medium text-white">
                  Datos tecnicos (no cifrados con hash)
                </h3>
                <ul className="grid grid-cols-1 gap-2 text-sm text-zinc-400 sm:grid-cols-2">
                  {technicalData.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4">
                <h3 className="mb-2 font-medium text-white">
                  Datos de identificacion personal
                </h3>
                <ul className="grid grid-cols-2 gap-x-1 gap-y-3 text-sm text-zinc-400 sm:grid-cols-3">
                  {personalData.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-white">
              Opciones de tratamiento de datos
            </h2>
            <p className="leading-relaxed">
              Respetamos las regulaciones locales sobre procesamiento de datos.
              Los usuarios pueden gestionar sus preferencias y desactivar ciertos
              seguimientos de acuerdo con las normativas vigentes en su pais o
              estado de residencia.
            </p>
          </section>
        </div>

        <footer className="mt-20 border-t border-white/5 pt-12 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} Fichas Weekly. Todos los derechos reservados.</p>
        </footer>
      </div>
    </main>
  );
}
