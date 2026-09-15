-- ============================================================
-- Treadville — Slice 11
-- public.enquiries: add admin-only DELETE RLS policy
--
-- Deletion runs through deleteEnquiryAction
-- (src/lib/admin-actions.ts): requireAdmin() gate, then a session-role
-- (authenticated) PostgREST DELETE. The table previously had no DELETE
-- policy, so an authorized admin's delete request was RLS-denied
-- (0 rows affected). This adds DELETE gated by the same established JWT
-- app_metadata role expression already used by the enquiries SELECT and
-- UPDATE policies (OWNER / SYSTEM_ADMIN), and intentionally omits a
-- TO-role restriction to stay consistent with those two existing policies
-- (roles = PUBLIC, gated purely by the qualifying JWT claim).
--
-- anon and ordinary authenticated users never match the qual, so DELETE
-- remains denied for them (deny-by-policy; the table DELETE privilege is
-- unchanged).
--
-- Slice 10 M2 posture is untouched: INSERT remains privilege-revoked for
-- anon/authenticated, and no INSERT policy exists.
-- ============================================================

drop policy if exists "Admins delete enquiries" on public.enquiries;
create policy "Admins delete enquiries"
  on public.enquiries
  for delete
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
  );