-- Treadville prototype schema — 3 tables only, on purpose.
-- No auth, no orders, no customers, no RLS beyond "public can do everything"
-- (this is a 2-day prototype, not production — tighten before Phase 3).

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2),
  image_url text,
  gallery text[] default '{}',
  featured boolean not null default false,
  stock integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

-- Prototype-only RLS: public read/write, no auth.
-- DO NOT ship this policy set to production — it's here so the admin
-- screens work without building an auth system for a KSh 3,000 demo.
alter table categories enable row level security;
alter table products enable row level security;
alter table site_content enable row level security;

create policy "public full access" on categories for all using (true) with check (true);
create policy "public full access" on products for all using (true) with check (true);
create policy "public full access" on site_content for all using (true) with check (true);
