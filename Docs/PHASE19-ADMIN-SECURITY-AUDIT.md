# PHASE 19 — ADMIN SECURITY AUDIT

**Date:** Phase 19, Step 1
**Scope:** Full inspection of admin surface, auth, Supabase access, server-side protections, RLS, environment, and direct-API threat model.

---

## 1. Executive Summary

The current Treadville admin is **publicly accessible and unauthenticated**. There is no Supabase Auth wired up, no middleware, no server-side route protection, no role model, and no row-level-security other than a public `for all using (true) with check (true)` policy. Anyone who can reach the site can:

- Read the entire `categories`, `products`, and `site_content` tables.
- Insert, update, or delete any category, product, or content row.
- Upload via service-role scripts (only Pascal can do this — but the surface is identical to what an attacker would do).
- Trigger any data-loss scenario via `/admin/products` or `/admin/categories` with a single click.

The contact form is purely a UI shell — no `enquiries` table exists, no Server Action persists data.

Phase 19 will replace this with a real Supabase Auth (SSR cookie-based) + `profiles`/`admin_roles` model + RLS + a proxy middleware. The implementation report will state what was actually wired.

---

## 2. Current State Inventory

### 2.1 Routes
| Path | Type | Current protection | Real-world risk |
|---|---|---|---|
| `/admin` | Page (server component) | None | Anyone sees dashboard |
| `/admin/categories` | Page (client) | None | Anyone reads/writes/deletes categories |
| `/admin/products` | Page (client) | None | Anyone reads/writes/deletes products |
| `/admin/content` | Page (client) | None | Anyone edits site copy |
| `/admin/login` | **Does not exist** | n/a | No login UI |
| `/admin/logout` | **Does not exist** | n/a | No logout flow |

### 2.2 Files inspected
- `src/app/admin/layout.tsx` — client component, no auth check; explicitly displays "No authentication yet" footer.
- `src/app/admin/page.tsx` — server component but **never reads session**; queries Supabase directly.
- `src/app/admin/categories/page.tsx` — client; calls `createCategory`, `updateCategory`, `deleteCategory` from `@/lib/queries` directly.
- `src/app/admin/products/page.tsx` — same pattern, all mutations client-side.
- `src/app/admin/content/page.tsx` — same pattern, calls `setSiteContent` directly.
- `src/lib/supabase.ts` — exports a single client using `NEXT_PUBLIC_SUPABASE_ANON_KEY`. No server client, no service-role client.
- `src/lib/queries.ts` — every function uses the anon client. Reads AND writes.
- `src/lib/types.ts` — three entities: Category, Product, SiteContent. No Enquiry, no Profile, no Role.
- `src/app/contact/page.tsx` — purely client; `onSubmit` only toggles a `submitted` state.

### 2.3 No middleware
There is no `src/middleware.ts`, no `proxy.ts`. There is no proxy/middleware in the Next.js 16 sense either. Session refresh never happens.

### 2.4 No server client
Only `createClient(url, anonKey)` exists. There is no `createServerClient` / `@supabase/ssr` usage. There is no `SUPABASE_SERVICE_ROLE_KEY` use in the application code (only in offline Node scripts under the repo root, which are run manually).

### 2.5 No auth dependencies
`package.json`:
```
"@supabase/supabase-js": "^2.112.4"
```
`@supabase/ssr` is **not** installed. NextAuth is not installed. No other auth library.

### 2.6 Database
- `categories`, `products`, `site_content` — all `enable row level security`, all have a single policy `public full access ... using (true) with check (true)`. This is functionally no-RLS.
- No `enquiries` table.
- No `profiles` or `admin_users` table.
- No `audit_log` table.
- No orders/payments tables.

### 2.7 Storage
No Supabase Storage usage in application code. Images referenced in seed data live at `/images/...` paths in Supabase Storage. No RLS on buckets was configured in the schema files. The application does not currently upload to Storage — image URLs are stored as text.

### 2.8 Environment
- `.env.local` (not inspected for content per AGENTS.md guidance).
- `.env.local.example` declares only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- No `SUPABASE_SERVICE_ROLE_KEY` is referenced in application code.
- No Daraja/M-Pesa environment variables exist yet.

---

## 3. Threat Model — Direct HTTP and Direct API

### 3.1 Unauthenticated read of admin data
**Question:** Can an anonymous user read the catalogue + content?
**Answer:** Yes.
- `/admin` renders `getCategories()` and `getProducts()` (server component) → tables are public.
- `/admin/categories` client component calls `getCategories()` → public.
- `/admin/products` → public.
- `/admin/content` → public.
- Public storefront uses the same `getProducts({ publishedOnly: true })` — so the same is true for the storefront, which is intended.

**Verdict:** admin pages reveal draft products (which are not meant to be public) because there is no auth gate and no RLS restriction.

### 3.2 Unauthenticated mutation
**Question:** Can an anonymous user POST/UPDATE/DELETE?
**Answer:** Yes, by simply loading `/admin/products` in a browser and clicking the buttons. All calls go through the anon key, but the policy `for all using (true) with check (true)` allows it.
- The same holds for direct Supabase REST calls from `curl`/Postman using the anon key. No JWT is required.

**Verdict:** Critical. Any visitor can delete every product, change every price, and rewrite hero copy.

### 3.3 Authenticated non-admin
There is no concept of "authenticated" yet. The `anon` key is what every visitor carries. RLS would need to be added before role checks could matter.

### 3.4 Service-role exposure
**Question:** Is the service role key exposed to the browser?
**Answer:** No. The application code never references it; it is used only in offline scripts (`db-mutate.js`, `upload-photos.js`, etc.) that Pascal runs locally. There is no `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`.

### 3.5 Cookie / session
No cookies are set for Supabase. No `Set-Cookie` headers from any Supabase endpoint. No `getSession`/`getUser` calls anywhere.

### 3.6 Server Actions / Route Handlers / API routes
There are **no** Server Actions, **no** Route Handlers, and **no** API routes in the application. All mutations are client-side direct Supabase calls. This means there is no server-side code surface to add checks to — every check has to live in RLS or in a future server route.

### 3.7 Direct exposure of draft/unpublished data
The storefront's `getProducts({ publishedOnly: true })` filter prevents draft products from showing on the public shop. **However**, `/admin/products` and `/admin/categories` use `getProducts()` without `publishedOnly`, and there is no auth gate. So any visitor can see all drafts, including anything Eunice has not yet published.

### 3.8 Contact form / enquiries
The form sets local `submitted` state and renders a "thank you" card. There is no database write, no Server Action, no API call. Nothing is persisted. This is a UX problem (visitors think they have contacted Treadville when nothing was sent) and an information-architecture problem for the admin (there is nothing for the admin to read).

### 3.9 Audit log
No audit log exists. No way to know who created/edited what.

### 3.10 Daraja / M-Pesa
No Daraja code, no secrets, no integration. There is no risk of secret exposure today because there is no integration. Risk to manage: future code MUST keep secrets server-side only.

---

## 4. Concrete Vulnerabilities (Ranked)

| # | Severity | Vulnerability | Mitigation in Phase 19 |
|---|---|---|---|
| 1 | CRITICAL | Anyone can mutate the entire catalogue via the public Supabase anon key + the `public full access` policy | Replace policy with role-based policies; add `enquiries` table + writes via authenticated server route |
| 2 | CRITICAL | `/admin` is publicly accessible (no auth gate) | Server-side session check in `app/admin/layout.tsx`; redirect to `/admin/login` |
| 3 | CRITICAL | Draft products are visible to anonymous users via `/admin/products` | RLS: only `OWNER`/`SYSTEM_ADMIN` can read draft rows |
| 4 | HIGH | No audit trail for catalogue changes | Add `audit_log` table; writes from server route only |
| 5 | HIGH | No login UI / no logout / no password reset | Build `/admin/login` with Supabase Auth (SSR) |
| 6 | HIGH | No role model | Add `profiles` + `admin_roles` tables; enforce via RLS + server checks |
| 7 | MEDIUM | Contact form is fake — visitors think they sent something | Add `enquiries` table + Server Action to persist; add `/admin/enquiries` page |
| 8 | MEDIUM | No user management — only one possible admin (no invite flow) | Add `/admin/users` page using `supabase.auth.admin.inviteUserByEmail` from server |
| 9 | MEDIUM | No integration configuration surface | Add `/admin/system/integrations` with Daraja UI shell (no live secrets) |
| 10 | LOW | Server-client used in scripts is environment-variable-only — good. But documented for Pascal to keep it that way. | Document in `PHASE19-IMPLEMENTATION-REPORT.md` |

---

## 5. What Will Change (Summary of Implementation Plan)

1. **Install `@supabase/ssr`** and add server-side clients (`createServerClient` for server components, route handlers, and Server Actions; same for client components).
2. **Add a `proxy.ts` (Next.js 16 proxy)** that refreshes the Supabase session cookie on every request to `/admin/*`.
3. **Add `profiles` and `admin_roles` tables** in `supabase/schema.sql`. Profile = `id uuid pk references auth.users`, `email`, `display_name`, `created_at`. Role = `user_id uuid references profiles(id)`, `role text check (role in ('OWNER', 'SYSTEM_ADMIN'))`.
4. **Replace the `public full access` policies** with:
   - `categories`, `products`, `site_content` — public read of `active`/`published` rows; admin write only.
   - `profiles`, `admin_roles` — read self; write SYSTEM_ADMIN only.
   - `enquiries` — insert from anyone (Service Role-mediated) or from authenticated visitors; read OWNER/SYSTEM_ADMIN only.
   - `audit_log` — insert from server only (Service Role); read SYSTEM_ADMIN.
5. **Build `/admin/login`** with email + password (Supabase Auth) + forgot-password link (sends reset email).
6. **Server-side gate in `app/admin/layout.tsx`** — if no session → redirect to `/admin/login?next=…`. If session but no `OWNER`/`SYSTEM_ADMIN` role → 403 page.
7. **Move all admin mutations behind a Server Action** (or thin Route Handler) that:
   - Re-checks the session and role server-side.
   - Logs to `audit_log`.
   - Performs the mutation via the service-role client (or the user's JWT — depends on RLS pattern).
8. **Image upload via Storage** — pre-signed URL pattern, server signs, browser uploads directly, then writes the resulting object path to the `image_url`/`gallery` field.
9. **Integrations page** with Daraja configuration form (read-only display of which env vars are set, never echo values).
10. **Add `Docs/PHASE19-COMMERCE-FOUNDATION.md`** documenting the future `orders` / `payments` / `payment_events` model — not implemented, only documented.

---

## 6. Constraints Respected

- No products will be invented in the migration.
- No Masai content will be reintroduced.
- No original photography will be touched.
- No payment transactions will be fabricated.
- No Daraja/M-Pesa secrets will be placed in any `NEXT_PUBLIC_*` variable.
- The public storefront architecture is unchanged.

---

## 7. Out-of-Scope (Documented but not built)

- Actual payment processing (STK Push, C2B, B2C).
- Email delivery (Supabase password reset emails require SMTP — Pascal will configure in Supabase project settings).
- Customer accounts on the storefront.
- Wholesale pricing tiers.
- Multi-currency.
- Logistics/shipping.
- Real analytics.

These are documented in `PHASE19-COMMERCE-FOUNDATION.md` as future phases.

---

## 8. Next Step

Proceed to Step 2 — install `@supabase/ssr`, build the server + browser clients, and wire the proxy/middleware. Then build the role model and login.
