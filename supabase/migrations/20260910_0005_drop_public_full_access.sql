-- Slice 9a (C1 fix): remove the stray unauthenticated full-access RLS policies
-- present only in the live project — they are not part of the documented schema.
-- They granted anon/authenticated PostgREST INSERT/UPDATE/DELETE on the public
-- catalogue and content tables, bypassing admin Server Actions, rate limiting,
-- sanitization, and audit logging.
--
-- Public reads remain governed by the existing "Public read ..." policies.

drop policy if exists "public full access" on products;
drop policy if exists "public full access" on categories;
drop policy if exists "public full access" on site_content;