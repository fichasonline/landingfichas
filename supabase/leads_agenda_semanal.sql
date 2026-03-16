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

update public.leads_agenda_semanal
set email = lower(trim(email))
where email <> lower(trim(email));

update public.leads_agenda_semanal
set whatsapp = nullif(regexp_replace(trim(whatsapp), '\D', '', 'g'), '')
where whatsapp is not null;

with ranked_by_email as (
  select
    id,
    row_number() over (
      partition by email
      order by created_at asc, id asc
    ) as row_num
  from public.leads_agenda_semanal
)
delete from public.leads_agenda_semanal as leads
using ranked_by_email
where leads.id = ranked_by_email.id
  and ranked_by_email.row_num > 1;

with ranked_by_whatsapp as (
  select
    id,
    row_number() over (
      partition by whatsapp
      order by created_at asc, id asc
    ) as row_num
  from public.leads_agenda_semanal
  where whatsapp is not null
)
delete from public.leads_agenda_semanal as leads
using ranked_by_whatsapp
where leads.id = ranked_by_whatsapp.id
  and ranked_by_whatsapp.row_num > 1;

with ranked_by_event_id as (
  select
    id,
    row_number() over (
      partition by event_id
      order by created_at asc, id asc
    ) as row_num
  from public.leads_agenda_semanal
  where event_id is not null
)
delete from public.leads_agenda_semanal as leads
using ranked_by_event_id
where leads.id = ranked_by_event_id.id
  and ranked_by_event_id.row_num > 1;

create index if not exists leads_agenda_semanal_created_at_idx
  on public.leads_agenda_semanal (created_at desc);

create index if not exists leads_agenda_semanal_email_idx
  on public.leads_agenda_semanal (lower(email));

create unique index if not exists leads_agenda_semanal_email_unique_idx
  on public.leads_agenda_semanal (email);

create unique index if not exists leads_agenda_semanal_whatsapp_unique_idx
  on public.leads_agenda_semanal (whatsapp)
  where whatsapp is not null;

create unique index if not exists leads_agenda_semanal_event_id_unique_idx
  on public.leads_agenda_semanal (event_id)
  where event_id is not null;
