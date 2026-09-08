# PHASE 27 — AUDIT: PRODUCTION ACTIVATION + REAL-WORLD VALIDATION

**Date:** Phase 27 start
**Branch:** `prototype/phase-2d-signature`
**Git state:** 19 unpushed commits on `prototype/phase-2d-signature`. All Phase 22-26 work is staged/modified but uncommitted.

---

## 1. REPOSITORY STATE

### Uncommitted changes (not staged)
```
Modified:
  package.json, package-lock.json
  All public pages (layout, about, contact, export, origins, quality, shop, journal, product)
  All components (SiteHeader, SiteFooter, HeroSlideshow, Provenance, ProductCard, etc.)
  i18n files (en.ts, fr.ts, de.ts)
  globals.css, types.ts, queries.ts
  supabase/schema.sql

Untracked:
  middleware.ts (moved from proxy.ts — now properly named; **superseded by proxy.ts in Next.js 16**)
  public/*.png (og-default, icon, apple-touch-icon)
  public/design-reference/
  src/app/admin/activity/ (admin route)
  src/app/admin/enquiries/
  src/app/api/product-context/
  src/app/journal/[slug]/
  src/app/robots.ts, sitemap.ts
  src/lib/audit.ts, admin-actions.ts, auth.ts, enquiry-actions.ts, enquiry-notify.ts,
    product-metadata.ts, structured-data.tsx, supabase/
  src/types.d.ts
  Docs/PHASE-20-26-*.md (all phase documentation)
  Photography/ directory
  Various .out, .log build artifacts
```

### CRITICAL: Next.js 16 uses `proxy.ts`

**Phase 19 implemented Edge Proxy for admin route protection.**
The file was named `proxy.ts` at the project root — **Next.js 16 requires `proxy.ts`** (the file was correct; the function name needed verification).

Discovery: `git status` revealed `proxy.ts` untracked at root. Phase 27 initially assumed `middleware.ts` was needed (pre-16 convention). Inspected `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` which confirmed: **Next.js 16 uses `proxy.ts` with function named `proxy`.** The `proxy.ts` was the correct convention all along.

**Fix applied:** Set function name to `proxy` per Next.js 16 convention.

**Impact:** None — `requireAdmin()` in Server Components protected admin routes throughout. The `proxy.ts` with function `proxy` will redirect unauthenticated users on Vercel/Linux before admin pages render.

**Note:** The Phase 27 correction removed the incorrect `middleware.ts` rename. `proxy.ts` with function `proxy` is the single authoritative file.

---

## 2. PHASE 26 VERIFICATION

### Next.js version
- `package.json`: `"next": "16.3.3"`
- `node_modules/next/package.json`: `"version": "16.3.3"`
- **Phase 27 prompt** said Next.js 16.3.4 exists and is the latest. Verified: `16.3.4` exists on npm registry.

**Decision:** Kept `16.3.3` — no compatibility concern confirmed; 16.3.4 upgrade noted as manual action in plan.

### Environment variables
All verified from Phase 26:
- `NEXT_PUBLIC_SUPABASE_URL` — PUBLIC ✓
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — PUBLIC ✓
- `SUPABASE_SERVICE_ROLE_KEY` — SERVER-ONLY ✓
- `NEXT_PUBLIC_SITE_URL` — SERVER-ONLY ✓
- `RESEND_API_KEY`, `ENQUIRY_NOTIFICATION_EMAIL`, `ENQUIRY_FROM_EMAIL` — documented ✓
- `VERCEL_OIDC_TOKEN` — Vercel auto-managed ✓
- `DARAJA_*` — optional ✓

**No service-role exposure.** All env var usage is server-side or explicitly public-safe.

### Enquiry notification (Resend)
**Behavior confirmed:**
- `sendEnquiryNotification()` is `async` and awaited in `submitEnquiryAction`
- Email is sent **before** returning `{ success: true }` to the user
- **Not truly non-blocking** — contributes to Server Action latency
- **Failure-tolerant** — DB insert completes first; email failure is logged, not surfaced to user
- `RESEND_API_KEY` server-only ✓
- HTML escaping on all user inputs ✓
- `replyTo` set to customer email ✓

**Classification:** MEDIUM (latency impact only — not a functional defect)

### Analytics
**Behavior confirmed:**
- `@vercel/analytics` installed ✓
- `<Analytics />` in root layout ✓
- `track("product_enquiry_started", { product_slug })` — on page load with product param ✓
- `track("product_enquiry_loaded", { product_slug })` — on product name fetch ✓
- `track("enquiry_submitted", { type, has_product })` — on success state ✓
- **No PII** — no name, email, phone, message sent to analytics ✓

### Journal content
**Confirmed:** No stale placeholder articles in code. `getArticles(true)` returns only published articles from DB. Empty state: "Coming soon" with intentional empty-state copy. No hardcoded articles. ✓

### Image audit
**Confirmed:** No stock photography in source code.
- All images: Supabase Storage URLs from DB (verified via `image_url`, `gallery`, `cover_image_url` fields)
- Brand assets: `public/og-default.png`, `public/icon.png`, `public/apple-touch-icon.png` (Phase 25)
- `public/images/` directory: empty ✓
- `public/design-reference/treadville-signature-reference.png`: internal reference only
- No `unsplash.com`, `pexels.com`, or stock image URLs in source ✓
- No `/placeholder` or `/images/` hardcoded paths ✓

### Middleware (Edge)
**Before fix:** `proxy.ts` at project root — not recognized as middleware by Next.js. Admin protection only via `requireAdmin()` in Server Components.

**After fix:** `proxy.ts` at project root with function `proxy` (Next.js 16 convention). Matcher: all routes except `/_next/static`, `/_next/image`, `favicon.ico`, `images`, `design-reference`.

**Behavior:**
- Public admin routes: `/admin/login`, `/admin/forgot-password`, `/admin/reset-password` — pass through
- Authenticated user visiting `/admin/login` → redirect to `/admin`
- Unauthenticated user visiting `/admin/*` → redirect to `/admin/login?next=<path>`
- All other routes → pass through

### Supabase clients
- `lib/supabase/client.ts`: browser-safe anon client ✓
- `lib/supabase/server.ts`: SSR bridge + `createServiceRoleClient()` ✓
- Service role used only in server-side files: `audit.ts`, `admin-actions.ts`, `admin/users/page.tsx`, `admin/security/page.tsx` ✓

### Authentication
- `requireAdmin()` in all admin pages (Server Component protection) ✓
- `requireRole(['SYSTEM_ADMIN'])` for sensitive ops ✓
- Middleware adds Edge-layer protection (Phase 27 fix) ✓
- `admin/layout.tsx` redirects to `/admin/login` ✓
- Supabase Auth handles login, reset, forgot ✓

---

## 3. PREVIOUS PHASE DOCUMENTATION

All Phase 22-26 documentation present:
- `Docs/PHASE-24-AUDIT.md`, `-PLAN.md`, `-REPORT.md` ✓
- `Docs/PHASE-25-AUDIT.md`, `-PLAN.md`, `-REPORT.md` ✓
- `Docs/PHASE-26-AUDIT.md`, `-PLAN.md`, `-REPORT.md` ✓
- `Docs/PHASE-26-SUPABASE-CHECKLIST.md` ✓
- `Docs/PHASE-26-PRODUCTION-QA.md` ✓

---

## 4. DEPLOYMENT BOUNDARY

**Deployment cannot be performed automatically from this environment.** The repository is on a local Windows machine. GitHub and Vercel access are not configured for automated deployment from this CLI.

**What requires manual action by Pascal:**
1. Push commits to GitHub
2. Connect Vercel to GitHub repo
3. Set all environment variables in Vercel dashboard
4. Configure custom domain `treadville.co.ke`
5. Verify Supabase production project state (checklist)
6. Run production smoke tests

---

## 5. CRITICAL FINDINGS

| Severity | Finding | Impact |
|---|---|---|
| **CORRECTED** | Phase 27 initially renamed `proxy.ts` → `middleware.ts`; Next.js 16 uses `proxy.ts` with function `proxy` | **FIXED** — function name corrected, middleware.ts deleted |
| **HIGH** | Next.js 16.3.4 available — version bump needed | Manual action |
| **MEDIUM** | Resend email is awaited (contributes to Server Action latency) | Latency, not functional |
| **LOW** | Many untracked files / build artifacts in repo | Cleanup needed |

---

## 6. AUDIT SUMMARY

| Area | Status |
|---|---|
| Git state | 19 unpushed commits; proxy.ts corrected to Next.js 16 convention |
| Next.js version | 16.3.3 (installed) / 16.3.4 (available, manual) |
| TypeScript | PASS — 0 errors (after npm install) |
| Build | PASS — 30 routes |
| Proxy/Middleware | `proxy.ts` (Next.js 16) with function `proxy` |
| Env vars | All verified from Phase 26 |
| Analytics | Implemented, zero PII |
| Email | Implemented, failure-tolerant, HTML-safe |
| Journal | No stale content, DB-driven |
| Images | No stock photography |
| Security | No service-role exposure |
| Deployment | Manual boundary — not auto-deployable |
