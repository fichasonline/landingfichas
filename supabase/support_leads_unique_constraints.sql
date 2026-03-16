update public.support_leads
set email = lower(trim(email))
where email is not null
  and email <> lower(trim(email));

update public.support_leads
set phone = nullif(regexp_replace(trim(phone), '\D', '', 'g'), '')
where phone is not null;

with ranked_by_email as (
  select
    ctid,
    row_number() over (
      partition by email
      order by ctid
    ) as row_num
  from public.support_leads
  where email is not null
)
delete from public.support_leads as leads
using ranked_by_email
where leads.ctid = ranked_by_email.ctid
  and ranked_by_email.row_num > 1;

with ranked_by_phone as (
  select
    ctid,
    row_number() over (
      partition by phone
      order by ctid
    ) as row_num
  from public.support_leads
  where phone is not null
)
delete from public.support_leads as leads
using ranked_by_phone
where leads.ctid = ranked_by_phone.ctid
  and ranked_by_phone.row_num > 1;

create unique index if not exists support_leads_email_unique_idx
  on public.support_leads (email)
  where email is not null;

create unique index if not exists support_leads_phone_unique_idx
  on public.support_leads (phone)
  where phone is not null;
