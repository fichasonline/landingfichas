import { z } from "zod";

const optionalText = (max = 255) =>
  z.preprocess((value) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }

    return value;
  }, z.string().max(max).optional());

const optionalUrl = z.preprocess((value) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  return value;
}, z.string().url().max(2048).optional());

const normalizeWhatsapp = (value: unknown) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return undefined;
    }

    const digitsOnly = trimmed.replace(/\D/g, "");
    return digitsOnly.length > 0 ? digitsOnly : undefined;
  }

  return value;
};

const optionalWhatsapp = z.preprocess(
  normalizeWhatsapp,
  z
    .string()
    .min(8, "Revisa el WhatsApp. Usa un numero valido.")
    .max(20, "Revisa el WhatsApp. Usa un numero mas corto.")
    .optional(),
);

export const leadFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Contanos tu nombre para poder registrarte.")
    .max(80, "Usa un nombre mas corto."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Ingresa un email valido.")
    .max(160, "Usa un email mas corto."),
  whatsapp: optionalWhatsapp,
  consentEmail: z
    .boolean()
    .refine(
      (value) => value,
      "Necesitamos tu consentimiento para enviarte la agenda.",
    ),
});

export const leadRequestSchema = leadFormSchema.extend({
  eventId: optionalText(120),
  formId: optionalText(80),
  sourceUrl: optionalUrl,
  landingPath: optionalText(512),
  referrer: optionalText(2048),
  utm_source: optionalText(255),
  utm_medium: optionalText(255),
  utm_campaign: optionalText(255),
  utm_content: optionalText(255),
  utm_term: optionalText(255),
  fbp: optionalText(255),
  fbc: optionalText(255),
});

export type LeadFormValues = {
  nombre: string;
  email: string;
  whatsapp?: string;
  consentEmail: boolean;
};

export type LeadRequestInput = z.infer<typeof leadRequestSchema>;
