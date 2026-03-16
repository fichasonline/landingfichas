# Fichas Weekly Landing

Landing en Next.js 14 orientada a captacion de leads para una comunidad informativa de torneos de poker. La pagina prioriza claridad, confianza y seguimiento semanal antes que un tono comercial agresivo.

## Stack

- Next.js 14 App Router
- React 18 + TypeScript estricto
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod
- Supabase para persistencia
- Resend para email de bienvenida
- Meta Pixel + base lista para Conversions API

## Instalacion

```bash
npm install
npm run dev
```

Para validar el proyecto antes de deployar:

```bash
npm run typecheck
npm run build
```

## Variables de entorno

Usa `.env.example` como base y crea `.env.local`.

```bash
NEXT_PUBLIC_META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
NEXT_PUBLIC_WHATSAPP_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
```

Notas:

- `NEXT_PUBLIC_WHATSAPP_URL`: enlace completo de WhatsApp, por ejemplo `https://wa.me/5491112345678?text=Hola%2C%20quiero%20mas%20info`.
- `NEXT_PUBLIC_SITE_URL`: URL publica del sitio. En Vercel usa el dominio final.
- `SUPABASE_ANON_KEY` queda disponible para futuras lecturas cliente, aunque esta version usa `SUPABASE_SERVICE_ROLE_KEY` solo del lado servidor para insertar leads.
- `META_TEST_EVENT_CODE` es opcional, util para probar eventos en el Event Manager de Meta.

## Conexion con Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta el SQL de [supabase/leads_agenda_semanal.sql](/Users/franciscosalvatierra/Desarrollo/landingfichas/supabase/leads_agenda_semanal.sql).
3. Copia `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`.
4. Levanta la app y envia un formulario.

La API guarda los leads en la tabla `leads_agenda_semanal`. Ese script ya normaliza `email` y `whatsapp`, elimina duplicados existentes y crea indices unicos para que no se repitan. En desarrollo, si Supabase no esta configurado, hace fallback a `/tmp/leads_agenda_semanal.jsonl` para que puedas probar el flujo completo localmente.

## Tracking y medicion

Eventos implementados:

- `PageView` al cargar la landing
- `Lead` al submit exitoso
- `WhatsAppClick` al hacer click en enlaces de WhatsApp
- `FormStart` cuando el usuario interactua por primera vez con el formulario
- `ScrollDepth` en 25, 50, 75 y 100

Detalles:

- Los eventos se centralizan en [lib/tracking/events.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/lib/tracking/events.ts).
- Meta Pixel se inicializa desde [lib/tracking/metaPixel.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/lib/tracking/metaPixel.ts).
- La atribucion guarda `utm_*`, `fbclid`, `fbp`, `fbc`, `referrer`, `landing_path` y `source_url` en `localStorage` y cookies auxiliares desde [lib/utils/utm.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/lib/utils/utm.ts).
- Si GTM esta presente, los eventos tambien se empujan a `window.dataLayer`.

## Como probar el Pixel

1. Configura `NEXT_PUBLIC_META_PIXEL_ID`.
2. Opcionalmente agrega `META_TEST_EVENT_CODE`.
3. Ejecuta `npm run dev`.
4. Abre la landing con parametros UTM si quieres validar atribucion.
5. Entra a Meta Events Manager y revisa:
   - `PageView` al cargar
   - `FormStart` al tocar un campo
   - `WhatsAppClick` al presionar el CTA
   - `Lead` luego de un submit exitoso

## Como queda preparada la Conversions API

- El browser genera un `event_id` por submit.
- Ese mismo `event_id` viaja al backend en [app/api/leads/route.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/app/api/leads/route.ts).
- El backend puede mandar el evento `Lead` a Meta desde [lib/tracking/conversionsApi.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/lib/tracking/conversionsApi.ts).
- Esa deduplicacion deja listo el puente entre Pixel y CAPI.

Si quieres probar CAPI manualmente, existe [app/api/meta-conversions/route.ts](/Users/franciscosalvatierra/Desarrollo/FichasLanding/app/api/meta-conversions/route.ts) como base para eventos server-side.

## Email de bienvenida

Si configuras `RESEND_API_KEY`, el backend manda un correo de confirmacion con asunto `Ya quedaste en la agenda semanal` y un boton a WhatsApp. Si no configuras Resend, el registro del lead sigue funcionando y el envio se omite.

## Deploy en Vercel

1. Importa el repo en Vercel.
2. Define las variables de entorno del `.env.example`.
3. Asegura que `NEXT_PUBLIC_SITE_URL` apunte al dominio de produccion.
4. Deploy.

La aplicacion queda lista para Vercel tal como esta, usando App Router y route handlers.
