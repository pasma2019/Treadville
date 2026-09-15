-- ============================================================
-- Treadville — articles admin RLS policy -> JWT role claim
-- Slice 14A.1 — minimum security repair
--
-- Context:
--   schema.sql defines "Admins manage articles" using the
--   JWT role claim:
--     (auth.jwt() -> 'app_metadata' ->> 'role') in
--     ('OWNER','SYSTEM_ADMIN')
--
--   Migration 20260907_0001_articles.sql:91-107 instead dropped
--   and recreated that policy using a subquery against
--   public.admin_roles. That variant:
--     * diverges from the single authorization mechanism used by
--       every other admin policy in the system (verified live:
--       17 policies across 12 tables use auth.jwt()),
--     * contradicts the documented rationale for JWT claims
--       (schema.sql:190-193) which chose claims specifically to
--       avoid self-referential RLS recursion against admin_roles.
--
-- This migration restores the established JWT-role model for the
-- articles admin policy. It is idempotent: it drops whichever
-- variant currently exists and recreates the JWT-role version,
-- so it is safe to apply against a database built from
-- schema.sql, a database that already ran 0001_articles, or a
-- database that already has the JWT variant.
--
-- Scope: this migration touches ONLY the "Admins manage articles"
-- policy on public.articles. The public "read published only"
-- SELECT policy, the articles schema, data, and all other tables
-- are untouched.
-- ============================================================

-- Drop whatever variant currently exists (JWT claim or admin_roles join)
drop policy if exists "Admins manage articles" on public.articles;

-- Recreate using the same JWT-role claim used by schema.sql and
-- all other admin policies (categories, products, site_content,
-- product_metadata, orders, enquiries, etc.).
create policy "Admins manage articles"
  on public.articles
  for all
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );