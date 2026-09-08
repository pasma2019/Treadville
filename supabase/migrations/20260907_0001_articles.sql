-- ============================================================
-- Treadville — articles table migration
-- Phase 27 — Journal backend fix
--
-- Article contract (verified from src/lib/types.ts):
--   id              uuid
--   title           text not null
--   slug            text not null unique
--   excerpt         text nullable
--   body            text nullable
--   author_name     text nullable
--   cover_image_url text nullable
--   status          text not null default 'draft' check in ('draft','published')
--   published_at    timestamptz nullable
--   created_at      timestamptz not null default now()
--   updated_at      timestamptz not null default now()
--
-- Query patterns exercised by src/lib/queries.ts:
--   getArticles():    articles.* order by updated_at desc
--                     optionally status = 'published'
--   getArticleBySlug: articles.* where slug = $1 and status = 'published'
--
-- This migration is idempotent. It is safe to run against a database that
-- already has the articles table created from supabase/schema.sql.
-- ============================================================

create extension if not exists "uuid-ossp";

-- Idempotent table creation. If the table already exists from schema.sql
-- this is a no-op for the table itself but adds the new index below.
create table if not exists public.articles (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null,
  excerpt         text,
  body            text,
  author_name     text,
  cover_image_url text,
  status          text not null default 'draft'
                    check (status in ('draft', 'published')),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Unique slug — idempotent (add constraint only if missing)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'articles_slug_key'
      and conrelid = 'public.articles'::regclass
  ) then
    alter table public.articles
      add constraint articles_slug_key unique (slug);
  end if;
end $$;

-- Index: status + updated_at for the public listing query
-- getArticles() filters status='published' and orders by updated_at desc.
create index if not exists articles_status_updated_at_idx
  on public.articles (status, updated_at desc);

-- Index: published_at for future date-sorted queries
create index if not exists articles_published_at_idx
  on public.articles (published_at desc);

-- ============================================================
-- RLS — public read of published, admin full access
-- Matches existing convention from supabase/schema.sql
-- (categories, products, product_metadata)
-- ============================================================

alter table public.articles enable row level security;

-- Drop-and-recreate the policies idempotently so this migration is
-- safe to run on top of the existing schema.sql policies.
drop policy if exists "Public read published articles" on public.articles;
drop policy if exists "Admins manage articles"         on public.articles;

-- Public: read only published articles
create policy "Public read published articles"
  on public.articles
  for select
  using (status = 'published');

-- Admins: full CRUD on all articles
-- Uses the existing admin_roles table from schema.sql.
-- The "for all" clause covers INSERT, UPDATE, DELETE for owners and
-- system admins — matching the convention used for products and categories.
create policy "Admins manage articles"
  on public.articles
  for all
  using (
    exists (
      select 1 from public.admin_roles
      where admin_roles.user_id = auth.uid()
        and admin_roles.role in ('OWNER', 'SYSTEM_ADMIN')
    )
  )
  with check (
    exists (
      select 1 from public.admin_roles
      where admin_roles.user_id = auth.uid()
        and admin_roles.role in ('OWNER', 'SYSTEM_ADMIN')
    )
  );

-- ============================================================
-- No updated_at trigger added.
-- The existing schema.sql convention does not use triggers for
-- updated_at. updated_at is set by the application layer on save.
-- Keeping that convention — do not introduce unnecessary infra.
-- ============================================================
