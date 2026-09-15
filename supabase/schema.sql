-- Treadville prototype schema — Phase 19
-- Extensions

create extension if not exists "uuid-ossp";

-- ============================================================
-- SECTION 1 — TABLE DEFINITIONS (all tables first, then indexes)
-- ------------------------------------------------------------
-- Every table in the schema is defined here before any RLS policy
-- exists. Policies reference other tables (e.g. profiles policies
-- query admin_roles), so all tables must exist before any policy
-- is created.
-- ============================================================

-- ============================================================
-- PROFILES: one row per auth user
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ADMIN ROLES: assigns roles to profiles
-- ============================================================

create table if not exists admin_roles (
  user_id uuid primary key references profiles(id) on delete cascade,
  role text not null check (role in ('OWNER', 'SYSTEM_ADMIN')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- ENQUIRIES: contact form submissions
-- ============================================================

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  type text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_review', 'responded', 'closed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOG: immutable record of admin actions
-- ============================================================

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CATALOGUE TABLES (existing — updated policies)
-- ============================================================

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

-- ============================================================
-- ARTICLES: Phase 20 — Journal CMS
-- ============================================================

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  author_name text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_status_idx on articles (status);
create index if not exists articles_published_at_idx on articles (published_at desc);

-- ============================================================
-- STORAGE FILES: Phase 20 — image metadata tracking
-- ============================================================

create table if not exists storage_files (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  original_filename text,
  mime_type text,
  file_size integer,
  bucket text not null,
  uploader_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists storage_files_bucket_idx on storage_files (bucket);
create index if not exists storage_files_uploader_idx on storage_files (uploader_id);

-- Ensure no duplicate storage paths (prevents accidental overwrites)
-- Drop-then-add so a re-run on an already-populated project is idempotent.
alter table storage_files drop constraint if exists storage_files_storage_path_key;
alter table storage_files add constraint storage_files_storage_path_key unique (storage_path);

-- ============================================================
-- PRODUCT METADATA: Phase 22 — category-specific product attributes
-- ============================================================

create table if not exists product_metadata (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  key text not null,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, key)
);

create index if not exists product_metadata_product_id_idx on product_metadata (product_id);

-- ============================================================
-- SECTION 2 — RLS + POLICIES (after all tables exist)
-- ------------------------------------------------------------
-- Every table is defined above, so the RLS policies below may
-- reference admin_roles, products, etc. freely without forward
-- reference errors.
-- ============================================================

alter table profiles enable row level security;

-- Users can read their own profile
drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles (role carried in the JWT app_metadata claim)
drop policy if exists "Admins read all profiles" on profiles;
create policy "Admins read all profiles"
  on profiles for select
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

alter table admin_roles enable row level security;

-- Role membership is carried in the JWT (app_metadata.role), so role
-- checks below read the token claim rather than querying admin_roles.
-- This avoids the self-referential RLS recursion that previously made
-- every admin query fail with "infinite recursion detected".

-- Admins can read all roles
drop policy if exists "Admins read roles" on admin_roles;
create policy "Admins read roles"
  on admin_roles for select
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- SYSTEM_ADMIN can assign roles
drop policy if exists "SYSTEM_ADMIN manages roles" on admin_roles;
create policy "SYSTEM_ADMIN manages roles"
  on admin_roles for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SYSTEM_ADMIN'
  );

-- Removed in the JWT-claim rewrite: the old self-referential
-- insert policy is dropped here so re-running the script on a project
-- that previously had it leaves no stale policies behind.
drop policy if exists "OWNER can manage own role" on admin_roles;

alter table enquiries enable row level security;

-- Admins can delete enquiries.
-- Slice 11: the public/anonymous INSERT policy ("Anyone can submit enquiry")
-- was removed in the Slice 10 M2 remediation; public submissions now run
-- through the trusted service-role path in submitEnquiryAction. DELETE is
-- granted here so the existing admin delete workflow (deleteEnquiryAction,
-- session-role client) is permitted by RLS, gated by the same admin JWT
-- role expression as the SELECT/UPDATE policies.
drop policy if exists "Admins delete enquiries" on enquiries;
create policy "Admins delete enquiries"
  on enquiries for delete
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- Admins can read enquiries
drop policy if exists "Admins read enquiries" on enquiries;
create policy "Admins read enquiries"
  on enquiries for select
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- Admins can update enquiry status
drop policy if exists "Admins update enquiries" on enquiries;
create policy "Admins update enquiries"
  on enquiries for update
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

alter table audit_log enable row level security;

-- Only service role should write to audit_log — enforced at application layer
-- Admins can read the log
drop policy if exists "Admins read audit log" on audit_log;
create policy "Admins read audit log"
  on audit_log for select
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'SYSTEM_ADMIN'
  );

-- CATEGORIES: public read, admin write
alter table categories enable row level security;

drop policy if exists "Public read active categories" on categories;
create policy "Public read active categories"
  on categories for select
  using (active = true);

drop policy if exists "Admins manage categories" on categories;
create policy "Admins manage categories"
  on categories for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- PRODUCTS: public read of published only, admin full access
alter table products enable row level security;

drop policy if exists "Public read published products" on products;
create policy "Public read published products"
  on products for select
  using (status = 'published');

drop policy if exists "Admins manage products" on products;
create policy "Admins manage products"
  on products for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- SITE CONTENT: public read, admin write
alter table site_content enable row level security;

drop policy if exists "Public read content" on site_content;
create policy "Public read content"
  on site_content for select
  using (true);

drop policy if exists "Admins manage content" on site_content;
create policy "Admins manage content"
  on site_content for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

alter table articles enable row level security;

-- Public: read published articles only
drop policy if exists "Public read published articles" on articles;
create policy "Public read published articles"
  on articles for select
  using (status = 'published');

-- Admins: full access
drop policy if exists "Admins manage articles" on articles;
create policy "Admins manage articles"
  on articles for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

alter table storage_files enable row level security;

-- No public access to file records
drop policy if exists "No public access to storage_files" on storage_files;
create policy "No public access to storage_files"
  on storage_files for all
  using (false);

-- Admins: read all
drop policy if exists "Admins read storage_files" on storage_files;
create policy "Admins read storage_files"
  on storage_files for select
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );

-- Service role writes (via Server Actions only) — no INSERT policy for anon/authenticated

alter table product_metadata enable row level security;

-- Public: read metadata for published products
drop policy if exists "Public read product metadata" on product_metadata;
create policy "Public read product metadata"
  on product_metadata for select
  using (
    exists (
      select 1 from products
      where products.id = product_metadata.product_id
      and products.status = 'published'
    )
  );

-- Admins: full access
drop policy if exists "Admins manage product metadata" on product_metadata;
create policy "Admins manage product metadata"
  on product_metadata for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );