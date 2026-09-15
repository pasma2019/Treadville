-- ============================================================
-- Treadville — commerce foundation migration
-- Slice 1 — Commerce V1 database foundation + security architecture
--
-- Tables added:
--   public.customers    one row per known customer (dedup deferred)
--   public.orders       enquiry/quote-first order record
--   public.order_items  line items — product name is snapshotted
--
-- Column contract reflected in src/lib/types.ts:
--
-- customers:
--   id                uuid primary key
--   full_name         text not null
--   phone             text not null
--   email             text nullable          (no unique — dedup deferred)
--   delivery_location text nullable
--   created_at        timestamptz not null default now()
--   updated_at        timestamptz not null default now()
--
-- orders:
--   id                 uuid primary key
--   reference_number   text not null unique   (assigned DB-side, see below)
--   customer_id        uuid not null references customers(id) on delete restrict
--   status             text not null default 'pending'
--                      check in ('pending','contacted','quoted','confirmed',
--                                'fulfilled','completed','cancelled')
--   customer_name      text not null          (snapshot)
--   customer_phone     text not null          (snapshot)
--   customer_email     text nullable          (snapshot)
--   delivery_location  text nullable
--   customer_notes     text nullable
--   internal_notes     text nullable          (admin only)
--   created_at         timestamptz not null default now()
--   updated_at         timestamptz not null default now()
--
-- order_items:
--   id           uuid primary key
--   order_id     uuid not null references orders(id) on delete cascade
--   product_id   uuid not null references products(id) on delete restrict
--   product_name text not null               (snapshot — survives product edits/deletes guard)
--   quantity     integer not null check (quantity > 0)
--   created_at   timestamptz not null default now()
--
-- Design decisions (Slice 1 spec):
--   * Quote-first model: no price columns and no payment columns.
--     Commercial terms are negotiated before fulfilment; payment records,
--     if ever needed, belong in a dedicated payment_transactions table later.
--   * No UNIQUE on customers.email / customers.phone.
--     Dedup (normalized email primary, normalized phone secondary) is
--     deliberately deferred to a later slice. Do NOT add unique indexes
--     on either column until the dedup policy exists.
--   * customers / orders / order_items have NO public (anon/authenticated)
--     policies. The browser can never write or read these tables directly.
--     Future public submission runs server-side via the existing service-role
--     pattern (src/lib/supabase/server.ts createServiceRoleClient, the same
--     pattern used by audit_log and admin_roles management). Admins receive
--     full access via the standard JWT role claim.
--
-- This migration is idempotent. It is safe to run against a database that
-- already has (or partially has) these tables.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- CUSTOMERS
-- ============================================================

create table if not exists public.customers (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  phone             text not null,
  email             text,
  delivery_location text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- ORDERS
-- ------------------------------------------------------------
-- reference_number is NOT NULL UNIQUE and is assigned by a database
-- trigger (see REFERENCE NUMBERS below). Any value supplied by the
-- caller is unconditionally overwritten — the browser can never choose
-- or spoof an order reference.
-- ============================================================

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  reference_number  text not null unique,
  customer_id       uuid not null references public.customers(id) on delete restrict,
  status            text not null default 'pending'
                      check (status in ('pending', 'contacted', 'quoted', 'confirmed', 'fulfilled', 'completed', 'cancelled')),
  customer_name     text not null,
  customer_phone    text not null,
  customer_email    text,
  delivery_location text,
  customer_notes    text,
  internal_notes    text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- ORDER ITEMS
-- ------------------------------------------------------------
-- product_id is NOT NULL and on delete restrict: once a product has
-- order history it cannot be silently destroyed from the admin, which
-- protects the historical record. product_name is snapshotted at write
-- time so order history stays intact even if the product is renamed.
-- ============================================================

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  quantity     integer not null check (quantity > 0),
  created_at   timestamptz not null default now()
);

-- ============================================================
-- REFERENCE NUMBERS
-- ------------------------------------------------------------
-- Format: TV-YYYY-NNNNNN  (e.g. TV-2026-000001)
--
-- A global monotonic sequence supplies the numeric segment. The year
-- prefix matches the example format specified for the slice. Because
-- the sequence never resets, the combined string cannot collide.
--
-- The BEFORE INSERT trigger unconditionally assigns NEW.reference_number,
-- so a caller-supplied value is always discarded. This satisfies the
-- "not client-suppliable" requirement at the database layer regardless
-- of which role performs the insert.
-- ============================================================

create sequence if not exists public.order_reference_seq start 1;

create or replace function public.assign_order_reference()
returns trigger
language plpgsql
as $$
begin
  new.reference_number := 'TV-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_reference_seq')::text, 6, '0');
  return new;
end;
$$;

-- Drop-then-create so a re-run on an already-migrated project is idempotent.
drop trigger if exists trg_orders_assign_reference on public.orders;
create trigger trg_orders_assign_reference
  before insert on public.orders
  for each row execute function public.assign_order_reference();

-- ============================================================
-- UNIQUE REFERENCE NUMBER — idempotent guard
-- ------------------------------------------------------------
-- Covered inline when the table is created fresh; this guarantees the
-- constraint also exists if the table pre-dates this migration.
-- ============================================================

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'orders_reference_number_key'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_reference_number_key unique (reference_number);
  end if;
end $$;

-- ============================================================
-- INDEXES
-- ------------------------------------------------------------
-- Postgres does not automatically index FK columns. These support the
-- queries each table will actually run.
-- ============================================================

-- Lookup an order by its customer, and the admin orders list.
create index if not exists orders_customer_id_idx
  on public.orders (customer_id);
create index if not exists orders_status_created_at_idx
  on public.orders (status, created_at desc);

-- Line items for an order; reverse-lookup from a product page.
create index if not exists order_items_order_id_idx
  on public.order_items (order_id);
create index if not exists order_items_product_id_idx
  on public.order_items (product_id);

-- Future normalized-email dedup lookup keys on the lowercased email.
-- The email column itself stays nullable and un-unique.
create index if not exists customers_lower_email_idx
  on public.customers (lower(email));

-- Phone lookup. No functional index: phone normalization policy is not
-- yet defined, so a plain index is the honest option.
create index if not exists customers_phone_idx
  on public.customers (phone);

-- ============================================================
-- RLS + POLICIES
-- ------------------------------------------------------------
-- Convention: reads the role from the JWT app_metadata claim exactly as
-- supabase/schema.sql does ((auth.jwt() -> 'app_metadata' ->> 'role')).
-- Do NOT switch to querying admin_roles: schema.sql chose the JWT claim
-- to avoid infinite-recursion policy failures.
--
-- No public policy exists on any commerce table, so anon/authenticated
-- clients are denied everything by default. Admins get full access.
-- Any future public submission runs through the service role server-side.
-- ============================================================

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers"
  on public.customers for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders"
  on public.orders for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

drop policy if exists "Admins manage order_items" on public.order_items;
create policy "Admins manage order_items"
  on public.order_items for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- ============================================================
-- No updated_at trigger added.
-- The existing schema.sql convention does not use triggers for
-- updated_at. updated_at is set by the application layer on save.
-- Keeping that convention — do not introduce unnecessary infra.
-- ============================================================