-- ============================================================
-- Treadville — payments table migration
-- Slice 24 — Payment Architecture Foundation
--
-- Tables added:
--   public.payments  payment records linked to orders
--
-- This is the ONLY database change permitted in Slice 24.
-- Existing orders, order_items, and RLS policies are untouched.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- PAYMENTS
-- ------------------------------------------------------------
-- One order may have many payment records (e.g. partial payments,
-- retries, refunds). Each payment is tied to exactly one provider.
--
-- The quote-first model means most orders will not have payment
-- records yet. This table exists to support future payment flows
-- without altering the existing orders schema.
-- ============================================================

create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete restrict,
  provider          text not null check (provider in ('mpesa', 'stripe')),
  amount            numeric(12,2) not null check (amount > 0),
  currency          text not null check (length(currency) = 3),
  status            text not null default 'pending'
                      check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  reference_number  text not null unique,
  provider_reference text,
  metadata          jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- REFERENCE NUMBERS
-- ------------------------------------------------------------
-- Format: PAY-YYYY-NNNNNN  (e.g. PAY-2026-000001)
--
-- Separated from order reference numbers by the PAY- prefix.
-- A global monotonic sequence supplies the numeric segment.
-- The BEFORE INSERT trigger unconditionally assigns
-- NEW.reference_number, so a caller-supplied value is discarded.
-- ============================================================

create sequence if not exists public.payment_reference_seq start 1;

create or replace function public.assign_payment_reference()
returns trigger
language plpgsql
as $$
begin
  new.reference_number := 'PAY-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.payment_reference_seq')::text, 6, '0');
  return new;
end;
$$;

drop trigger if exists trg_payments_assign_reference on public.payments;
create trigger trg_payments_assign_reference
  before insert on public.payments
  for each row execute function public.assign_payment_reference();

-- ============================================================
-- INDEXES
-- ------------------------------------------------------------
-- Support the queries the admin and application layers will run.
-- ============================================================

create index if not exists payments_order_id_idx
  on public.payments (order_id);
create index if not exists payments_provider_idx
  on public.payments (provider);
create index if not exists payments_status_idx
  on public.payments (status);
create index if not exists payments_created_at_idx
  on public.payments (created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ------------------------------------------------------------
-- Keep updated_at in sync on direct UPDATE statements.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_payments_set_updated_at on public.payments;
create trigger trg_payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS + POLICIES
-- ------------------------------------------------------------
-- Security model mirrors the existing commerce tables:
--
-- - No public (anon/authenticated) policies exist.
--   Anonymous and authenticated browser clients are denied
--   all access to payments by default.
--
-- - Admin users (OWNER, SYSTEM_ADMIN via JWT app_metadata role)
--   receive full access through the standard admin policy.
--
-- - All application-layer writes run through the service role
--   (createServiceRoleClient), same as orders/order_items.
--
-- If safe authenticated-user RLS (e.g. "read own order's payments")
-- cannot be established without touching protected auth infrastructure,
-- this is intentionally left as a future enhancement rather than
-- weakening security in this slice.
-- ============================================================

alter table public.payments enable row level security;

drop policy if exists "Admins manage payments" on public.payments;
create policy "Admins manage payments"
  on public.payments for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );
