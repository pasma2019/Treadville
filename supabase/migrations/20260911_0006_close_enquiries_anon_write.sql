-- ============================================================
-- Treadville — M2 trust-boundary hardening (Slice 10)
-- public.enquiries: stop anonymous/authenticated direct PostgREST INSERT
--
-- Context:
--   The public enquiry form submits through the submitEnquiryAction Server
--   Action, which validates, rate-limits and audits. Slice 10 moves the
--   database write onto the trusted service-role client (the same pattern as
--   the order path), so the browser's direct PostgREST route is no longer
--   needed. This migration closes that route at the privilege and policy
--   layers for the low-privilege client roles.
--
-- Verified before writing (authoritative catalog evidence):
--   * PUBLIC has NO grant on enquiries (no aclitem entry, no
--     role_table_grants rows for PUBLIC). The brief's PUBLIC-grant trap does
--     not apply — the grants are role-specific.
--   * anon, authenticated and service_role each hold explicit full grants
--     (arwdDxtm) from postgres, applied via Supabase default privileges at
--     table creation.
--   * service_role and postgres bypass RLS (pg_roles.rolbypassrls = true);
--     anon and authenticated do not.
--   So the anonymous write surface was: explicit anon INSERT grant + the
--   permissive "Anyone can submit enquiry" RLS INSERT policy (with_check true).
--
-- Post-migration privileges (enquiries):
--   anon           no INSERT (revoked) — all other grants untouched
--   authenticated  no INSERT (revoked) — all other grants untouched
--   service_role   full grants retained (trusted server-side insert)
--   postgres       owner, full rights
--   PUBLIC         unchanged (never had a grant)
-- ============================================================

-- 1. Privilege layer: block direct INSERT by the low-privilege client roles.
--    SELECT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER/MAINTAIN grants are
--    intentionally untouched: the admin surfaces still read and update
--    enquiries through the session-role client under the admin RLS policies.
revoke insert on table public.enquiries from anon;
revoke insert on table public.enquiries from authenticated;

-- 2. Policy layer: the "Anyone can submit enquiry" INSERT policy is now
--    obsolete — no anon/authenticated role may insert, and the trusted
--    service role bypasses RLS entirely. Remove it rather than leave a
--    misleading permissive policy that implies a public write path exists.
drop policy if exists "Anyone can submit enquiry" on public.enquiries;

-- service_role and owner (postgres) retain full privileges; the trusted
-- submission path runs through src/lib/supabase/server.ts
-- createServiceRoleClient() and is unchanged in spirit — only its role
-- changed from anon to service_role.