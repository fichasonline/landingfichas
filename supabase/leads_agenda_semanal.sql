create extension if not exists pgcrypto;

create table if not exists public.leads_agenda_semanal (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  whatsapp text,
  consent_email boolean not null default false,
  created_at timestamptz not null default now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  landing_path text,
  source_url text,
  event_id text,
  fbp text,
  fbc text,
  ip inet,
  user_agent text
);

create index if not exists leads_agenda_semanal_created_at_idx
  on public.leads_agenda_semanal (created_at desc);

create index if not exists leads_agenda_semanal_email_idx
  on public.leads_agenda_semanal (lower(email));
