-- ============================================================
-- Treadville — order communications migration
-- Slice 5 — Customer communication workflow (manual-send, admin-recorded)
--
-- Table added:
--   public.order_communications  one row per admin-logged outreach to a customer
--
-- Column contract (src/lib/types.ts NOT extended this slice — the
-- detail page reads these fields directly from the admin query):
--
-- order_communications:
--   id               uuid primary key default gen_random_uuid()
--   order_id         uuid not null references orders(id) on delete cascade
--   channel          text not null check (channel in ('whatsapp','other'))
--   message_summary  text not null     (what was communicated — a record,
--                                       not a delivery-tracked payload)
--   sent_by          uuid null references auth.users(id) on delete set null
--   sent_by_email    text              (snapshot — auth.users is not readable
--                                      via PostgREST, so without this the admin
--                                      UI cannot show *who* logged the message;
--                                      mirrors audit_log.actor_email exactly)
--   sent_at          timestamptz not null default now()
--   created_at       timestamptz not null default now()
--
-- Design decisions (Slice 5 spec):
--   * Communication is a MANUAL workflow. Nothing in this schema, and no
--     status change, triggers a message. "Open in WhatsApp" merely opens a
--     wa.me click-to-chat link in the admin's browser; the app never knows
--     whether the message was delivered. The row below is the record that
--     "an admin says they sent this" — nothing more.
--   * No status column: there is no delivery/read tracking (out of scope).
--   * No template_id / template system column: templates this slice are a
--     plain editable UI pre-fill, not a managed library.
--   * channel CHECK is intentionally small ('whatsapp','other') with 'other'
--     as the escape hatch for manual channels (e.g. a phone call). No
--     dedicated phone-call logging UI is built — the value is only useful
--     paired with the message_summary / note.
--   * sent_by is NULLABLE with on delete set null, mirroring audit_log.actor_id.
--     A deleted auth user must not cascade-destroy the communication record.
--   * sent_by_email is the readable-name snapshot, mirroring
--     audit_log.actor_email. auth.users is not exposed to PostgREST, so a
--     uuid-only column would make the history's "who sent it" unresolvable.
--   * index (order_id) supports the detail-page history query;
--     index (sent_at) supports any future reverse-chron rollups.
--
-- RLS: identical to the other commerce tables — admin-only, read from the
-- JWT app_metadata role claim, no anon/authenticated policies anywhere.
--
-- This migration is idempotent and safe to re-run.
-- ============================================================

-- ============================================================
-- ORDER COMMUNICATIONS
-- ============================================================

create table if not exists public.order_communications (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  channel          text not null check (channel in ('whatsapp', 'other')),
  message_summary  text not null,
  sent_by          uuid references auth.users(id) on delete set null,
  sent_by_email    text,
  sent_at          timestamptz not null default now(),
  created_at       timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ------------------------------------------------------------
-- Postgres does not automatically index FK columns. These support the
-- two queries this table will actually run: the detail-page history
-- for one order, and any sent_at-ordered rollup.
-- ============================================================

create index if not exists order_communications_order_id_idx
  on public.order_communications (order_id);
create index if not exists order_communications_sent_at_idx
  on public.order_communications (sent_at);

-- ============================================================
-- RLS + POLICIES
-- ------------------------------------------------------------
-- Convention: reads the role from the JWT app_metadata claim exactly as
-- supabase/schema.sql does ((auth.jwt() -> 'app_metadata' ->> 'role')).
--
-- No public policy exists, so anon/authenticated clients are denied
-- everything by default. Admins get full access. Any future public
-- submission runs through the service role server-side.
-- ============================================================

alter table public.order_communications enable row level security;

drop policy if exists "Admins manage order_communications" on public.order_communications;
create policy "Admins manage order_communications"
  on public.order_communications for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );