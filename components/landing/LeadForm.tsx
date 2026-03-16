"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  createEventId,
  trackFormStart,
  trackLead,
} from "@/lib/tracking/events";
import { getClientAttribution } from "@/lib/utils/utm";
import {
  leadFormSchema,
  type LeadFormValues,
} from "@/lib/validation/lead";

type LeadFormProps = {
  formId: string;
  title?: string;
  description?: string;
  submitLabel: string;
  compact?: boolean;
};

type SubmitState = {
  message?: string;
  status: "idle" | "error" | "submitting" | "success";
};

const defaultValues: LeadFormValues = {
  nombre: "",
  email: "",
  whatsapp: "",
  consentEmail: false,
};

export function LeadForm({
  formId,
  title,
  description,
  submitLabel,
  compact = false,
}: LeadFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const trackedStartRef = useRef(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues,
  });

  const handleFormStart = () => {
    if (trackedStartRef.current) {
      return;
    }

    trackedStartRef.current = true;
    trackFormStart({
      form_id: formId,
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState({
      status: "submitting",
    });

    const eventId = createEventId("lead");
    const attribution = getClientAttribution();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          eventId,
          formId,
          sourceUrl: attribution.source_url,
          landingPath: attribution.landing_path,
          referrer: attribution.referrer,
          utm_source: attribution.utm_source,
          utm_medium: attribution.utm_medium,
          utm_campaign: attribution.utm_campaign,
          utm_content: attribution.utm_content,
          utm_term: attribution.utm_term,
          fbp: attribution.fbp,
          fbc: attribution.fbc,
        }),
      });

      const payload = (await response.json()) as {
        duplicate?: boolean;
        error?: string;
        success?: boolean;
      };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "No pudimos registrar tu mail.");
      }

      if (!payload.duplicate) {
        trackLead({
          eventId,
          form_id: formId,
        });
      }

      reset(defaultValues);
      trackedStartRef.current = false;
      setSubmitState({
        status: "success",
        message: payload.duplicate
          ? "Ese email o WhatsApp ya estaba registrado. No volvimos a cargarlo."
          : "Listo. Ya quedaste registrado para recibir la agenda semanal.",
      });
    } catch (error) {
      setSubmitState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "No pudimos registrar tus datos. Intenta de nuevo en unos minutos.",
      });
    }
  });

  if (submitState.status === "success") {
    return (
      <div className="space-y-5">
        {title ? (
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
        ) : null}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
        >
          {submitState.message}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {title ? (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {description ? (
            <p className="text-sm leading-6 text-white/62">{description}</p>
          ) : null}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit} onFocusCapture={handleFormStart}>
        <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
          <div className={compact ? "" : "sm:col-span-2"}>
            <label className="field-label" htmlFor={`${formId}-nombre`}>
              Nombre
            </label>
            <input
              id={`${formId}-nombre`}
              type="text"
              autoComplete="name"
              placeholder="Como queres que te llamemos"
              className="input-shell"
              aria-invalid={Boolean(errors.nombre)}
              {...register("nombre")}
            />
            {errors.nombre ? (
              <p className="mt-2 text-sm text-rose-300">{errors.nombre.message}</p>
            ) : null}
          </div>

          <div className={compact ? "" : "sm:col-span-2"}>
            <label className="field-label" htmlFor={`${formId}-email`}>
              Email
            </label>
            <input
              id={`${formId}-email`}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="tuemail@ejemplo.com"
              className="input-shell"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-2 text-sm text-rose-300">{errors.email.message}</p>
            ) : null}
          </div>

          <div className={compact ? "" : "sm:col-span-2"}>
            <label className="field-label" htmlFor={`${formId}-whatsapp`}>
              WhatsApp <span className="text-white/40">(opcional)</span>
            </label>
            <input
              id={`${formId}-whatsapp`}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+54 9 11 1234 5678"
              className="input-shell"
              aria-invalid={Boolean(errors.whatsapp)}
              {...register("whatsapp")}
            />
            {errors.whatsapp ? (
              <p className="mt-2 text-sm text-rose-300">{errors.whatsapp.message}</p>
            ) : null}
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/70">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-white/15 bg-transparent text-violet focus:ring-violet"
            {...register("consentEmail")}
          />
          <span>Acepto recibir novedades y agenda semanal por email</span>
        </label>
        {errors.consentEmail ? (
          <p className="text-sm text-rose-300">{errors.consentEmail.message}</p>
        ) : null}

        {submitState.message ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={[
              "rounded-2xl border px-4 py-3 text-sm",
              submitState.status === "success"
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                : "border-rose-400/30 bg-rose-400/10 text-rose-100",
            ].join(" ")}
          >
            {submitState.message}
          </motion.div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={[
            "cta-primary w-full",
            isSubmitting ? "cursor-wait opacity-80" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isSubmitting ? "Registrando..." : submitLabel}
        </button>

        <div className="space-y-1">
          <p className="fine-print">
            Sin vueltas. Te mandamos la agenda semanal y novedades relevantes.
          </p>
          <p className="fine-print">Podes darte de baja cuando quieras.</p>
        </div>
      </form>
    </div>
  );
}
