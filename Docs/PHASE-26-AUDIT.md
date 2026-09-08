# PHASE 26 — AUDIT: PRODUCTION ACTIVATION + CONVERSION SYSTEM

**Date:** Phase 26 start
**Branch:** `prototype/phase-2d-signature`

---

## 1. PHASE 25 BASELINE

31 routes. TypeScript 0 errors. Build passes.
- Brand assets: `og-default.png`, `icon.png`, `apple-touch-icon.png` — all created
- SEO: sitemap, robots, JSON-LD, canonicals — implemented
- Security: RLS, requireAdmin(), service-role server-only — intact
- Images: all Supabase-driven or brand assets
- Enquiry: persists to DB, product context, type filter — working
- No analytics, no email notification

---

## 2. ENVIRONMENT VARIABLE AUDIT

### All variables referenced in source code

| Variable | Source files | Type | Public? | Required |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `supabase.ts`, `server.ts`, `client.ts` | PUBLIC | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `supabase.ts`, `server.ts`, `client.ts` | PUBLIC | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `server.ts` | SERVER | No | Yes |
| `NEXT_PUBLIC_SITE_URL` | `admin-actions.ts:351` | **SERVER-SIDE ONLY** (in `"use server"`) | No | Yes |
| `VERCEL_OIDC_TOKEN` | `layout.tsx` (auto-managed) | AUTO | Vercel | No |
| `DARAJA_CONSUMER_KEY` | `admin/integrations/page.tsx` | SERVER | No | Optional |
| `DARAJA_CONSUMER_SECRET` | `admin/integrations/page.tsx` | SERVER | No | Optional |
| `DARAJA_SHORTCODE` | `admin/integrations/page.tsx` | SERVER | No | Optional |
| `DARAJA_PASSKEY` | `admin/integrations/page.tsx` | SERVER | No | Optional |
| `DARAJA_ENVIRONMENT` | `admin/integrations/page.tsx` | SERVER | No | Optional |
| `DARAJA_CALLBACK_URL` | `admin/integrations/page.tsx` | SERVER | No | Optional |

### `NEXT_PUBLIC_SITE_URL` — CRITICAL GAP
**Used in `admin-actions.ts:351`** for Supabase auth invite redirect URL:
```ts
redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login`,
```
This is a **server-side** variable (in `"use server"` file). It is **NOT** prefixed `NEXT_PUBLIC_` at the call site — it uses the raw `process.env` access. The `?? ""` fallback is dangerous: if unset, invites redirect to `/admin/login` with no host, breaking email-based admin invites.

**Must be set in Vercel dashboard:** `NEXT_PUBLIC_SITE_URL=https://treadville.co.ke`

Note: Despite the `NEXT_PUBLIC_` prefix naming, this variable is accessed only server-side. The prefix name is misleading but harmless — the actual runtime value is read in server code only.

### Security classification
| Variable | Status |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | ✓ Server-only, never in browser |
| `DARAJA_*` vars | ✓ Server-only, only in admin pages |
| `NEXT_PUBLIC_*` | ✓ PUBLIC (anon key safe, URL safe) |
| No secrets in logs | ✓ No `console.log` with credentials |

**No public service-role exposure found.**

---

## 3. EXISTING ANALYTICS

**None.** No `@vercel/analytics`, no Google Analytics, no Plausible, no Umami.
No analytics SDK in `package.json`. No tracking code in layout.

---

## 4. EXISTING EMAIL NOTIFICATION

**None.** Enquiries persist to DB only. No email sent on submission.
`submitEnquiryAction` in `enquiry-actions.ts` is clean:
```ts
const { error } = await supabase.from("enquiries").insert({...});
return { success: true };
```
No email. If DB insert fails, error returned. If succeeds, success returned.

---

## 5. SUPABASE CLIENT ARCHITECTURE

| File | Purpose | Auth |
|---|---|---|
| `lib/supabase.ts` | Module-level anon client (browser-safe) | Anon key |
| `lib/supabase/client.ts` | Named client (browser-safe) | Anon key |
| `lib/supabase/server.ts` | `createClient()` — browser-supabase SSR bridge | Anon key |
| `lib/supabase/server.ts` | `createServiceRoleClient()` — server-only | Service role |

Service role used in: `audit.ts`, `admin-actions.ts`, `admin/users/page.tsx`, `admin/security/page.tsx` — all server-side only.

**No service-role reaches browser.** ✓

---

## 6. ENQUIRY FLOW — CURRENT STATE

| Entry | Status | Notes |
|---|---|---|
| `/contact` | ✓ Works | 5 fields, validation, DB persist |
| `/contact?type=sample` | ✓ Works | Type pre-selected |
| `/contact?product=<slug>` | ✓ Works | Fetches name, shows banner, prepends context |
| DB persistence | ✓ Works | `enquiries` table insert |
| Success state | ✓ Works | "Thank you" panel |
| Error state | ✓ Works | Error message returned |
| Email notification | ✗ **MISSING** | Business requirement: needs notification |

---

## 7. PRODUCT ENQUIRY FLOW

`/api/product-context/route.ts`:
- `GET /api/product-context?slug=<slug>`
- `getProductBySlug(slug)` → returns `{ name, slug }`
- Filters `status = "published"` — drafts excluded ✓
- Returns 404 for unpublished ✓
- Graceful: returns `{ name: null }` for errors

**No broken slug exposure. No unpublished product data leakage.** ✓

---

## 8. SECURITY SWEEP

| Area | Check | Status |
|---|---|---|
| `createServiceRoleClient` | Only in server-side files | ✓ |
| Service role in client | grep for service role in client components | ✓ Clean |
| `dangerouslySetInnerHTML` | Only in `journal/[slug]` (admin-authored) | ✓ Acceptable |
| Auth redirect | `NEXT_PUBLIC_SITE_URL` with fallback `""` | ⚠️ Gap (see above) |
| Admin protection | `requireAdmin()` in all pages | ✓ |
| SYSTEM_ADMIN | `requireRole(['SYSTEM_ADMIN'])` | ✓ |
| Proxy/middleware | None — no route middleware | ✓ |
| Supabase client | Only anon key in browser | ✓ |
| Console logs | No credentials logged | ✓ |
| Error messages | No DB credentials leaked | ✓ |
| Password reset | Supabase-managed | ✓ |
| RLS | Enabled on all tables | ✓ |

---

## 9. IMAGE AUDIT — PRODUCTION STATE

| Image | Source | Status |
|---|---|---|
| OG image | `public/og-default.png` (created Phase 25) | ✓ Valid |
| Favicon | `public/icon.png` (created Phase 25) | ✓ Valid |
| Apple touch icon | `public/apple-touch-icon.png` (created Phase 25) | ✓ Valid |
| Homepage hero | `site_content: homepage_hero` (Supabase) | DB-driven ✓ |
| About hero | `site_content: about_hero` (Supabase) | DB-driven ✓ |
| Quality hero | `site_content: quality_hero` (Supabase) | DB-driven ✓ |
| Export hero | `site_content: export_hero` (Supabase) | DB-driven ✓ |
| Origins body | `site_content: origins_body_*` (Supabase) | DB-driven ✓ |
| Provenance image | `site_content: provenance_image` (Supabase) | DB-driven ✓ |
| Journal cards | `site_content: journal_card_*` (Supabase) | DB-driven ✓ |
| Category hero | `site_content: category_hero_[slug]` (Supabase) | DB-driven ✓ |
| Category card image | `category.image_url` (Supabase) | DB-driven ✓ |
| Product images | `product.image_url`, `product.gallery` (Supabase) | DB-driven ✓ |
| Article covers | `article.cover_image_url` (Supabase) | DB-driven ✓ |
| `public/images/` | Empty | ✓ Correct |

**All production images are Supabase-driven. No hardcoded placeholder URLs. Graceful fallbacks on broken images.**

---

## 10. PERFORMANCE BASELINE

No measured baseline (no analytics installed). Inspection findings:

| Item | Status |
|---|---|
| Hero `fetchpriority="high"` | ✓ Phase 24 |
| Hero `decoding="async"` | ✓ Phase 24 |
| Below-fold `loading="lazy"` | ✓ Throughout |
| `next/font` (server-loaded) | ✓ Cormorant Garamond + DM Sans |
| CSS animations | ✓ `transform`/`opacity` only |
| Client components | ✓ Minimal — admin panels are client-heavy but admin-only |
| JS bundle | Not measured — no tool installed |
| LCP | Not measured — no production data |
| CLS | Not measured — no production data |

---

## 11. PRODUCTION CONFIGURATION

| Item | Status |
|---|---|---|
| `package.json` engines | `node: ">=20.0.0"` ✓ |
| `packageManager` | `npm@10.0.0` ✓ |
| `scripts.build` | `next build --webpack` ✓ |
| `scripts.dev` | `next dev --webpack` ✓ |
| `next.config.ts` | Minimal — no custom config needed |
| TypeScript | Strict ✓ |
| Tailwind | v4 via `@tailwindcss/postcss` ✓ |
| Supabase | `@supabase/ssr` + `@supabase/supabase-js` ✓ |
| React | 19.2.8 ✓ |
| Next.js | 16.3.3 — **newer than latest stable (15.x)** |

### Next.js version concern
**Next.js 16.3.3 is ahead of the current stable release (15.x).** This is intentional per previous phases. Not downgrading. Vercel will use the version from `package.json`. If there are issues, they will surface in Vercel deployment.

---

## 12. VERCEL CONFIGURATION

No `.vercel/` directory committed. No `vercel.json` file.
Vercel will auto-detect:
- Framework: Next.js
- Build command: `npm run build`
- Output directory: `.next`
- Install command: `npm install`

**Environment variables to set in Vercel dashboard:**
1. `NEXT_PUBLIC_SUPABASE_URL` = `https://hqdovxqxperwprbqbyqo.supabase.co`
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon key)
3. `SUPABASE_SERVICE_ROLE_KEY` = (service role key)
4. `NEXT_PUBLIC_SITE_URL` = `https://treadville.co.ke` ← **NEW — required for admin invites**
5. `VERCEL_OIDC_TOKEN` = (auto-populated by Vercel)

---

## 13. DOMAIN SWEEP

`grep` for localhost/IPs: **No results.**

All URLs use:
- `https://treadville.co.ke` (production)
- Relative paths (`/admin/login`, etc.)
- No hardcoded localhost, no IPs, no preview URLs

---

## 14. CTA AUDIT

| CTA | Route | Status |
|---|---|---|
| Homepage → Shop | `/shop` | ✓ Valid |
| Homepage → About | `/about` | ✓ Valid |
| Homepage → Journal | `/journal` | ✓ Valid |
| Homepage → Export | `/export` | ✓ Valid |
| Homepage → Contact | `/contact` | ✓ Valid |
| Shop → Category | `/shop/[category]` | ✓ Valid slug |
| Category → Product | `/product/[slug]` | ✓ Valid slug |
| Product → Enquire | `/contact?product=[slug]` | ✓ Dynamic, validated |
| Nav category links | `/shop/[category]` | ✓ From DB |
| Footer links | Various | ✓ Valid |
| Journal → Contact | `/contact` | ✓ Valid |

**No dead CTAs. No stale slugs. All routes are dynamic from DB or hardcoded correct routes.**

---

## 15. ERROR HANDLING AUDIT

| Scenario | Behavior | Status |
|---|---|---|
| Product not found | `notFound()` → 404 page | ✓ |
| Category not found | `notFound()` → 404 page | ✓ |
| Article not found | `notFound()` → 404 page | ✓ |
| Unpublished product slug | `notFound()` → 404 | ✓ |
| Unpublished article slug | `notFound()` → 404 | ✓ |
| DB unavailable | Error caught, graceful UI | ✓ |
| Enquiry DB failure | `{ error: "..." }` returned | ✓ |
| Product context API fail | `{ name: null }` returned | ✓ |
| Image 404 | `onError` → graceful placeholder | ✓ |
| Invalid `?type=` | Falls back to "Select type" | ✓ |
| Invalid `?product=` | No banner shown, form works | ✓ |
| Not logged in → admin | Redirect to `/admin/login` | ✓ |
| Wrong role → restricted | `ForbiddenError` thrown | ✓ |

---

## 16. CRITICAL FINDINGS

| Severity | Issue | Impact |
|---|---|---|
| **CRITICAL** | `NEXT_PUBLIC_SITE_URL` not set — admin invites redirect to empty host | Breaks admin user invitation emails |
| **HIGH** | No email notification for enquiries | Business doesn't get real-time alerts |
| **HIGH** | No analytics — no conversion measurement | Can't track enquiry conversions |
| **MEDIUM** | `NEXT_PUBLIC_SITE_URL` variable name misleading | Appears public but is server-only |

---

## 17. PRESERVE

- All 31 routes
- All Phase 22-25 functionality
- RLS + auth architecture
- Supabase client separation
- Product metadata system
- Tiptap journal CMS
- SEO infrastructure (sitemap, robots, JSON-LD, canonicals)
- Brand assets (OG, icon, apple-touch-icon)
- Enquiry DB persistence

---

## 18. PROPOSED IMPLEMENTATION ORDER

### Priority 1: Fix CRITICAL gap
- Add `NEXT_PUBLIC_SITE_URL` to `.env.local.example`
- Document requirement to set it in Vercel dashboard

### Priority 2: Email notification (Resend)
- Install `resend` package
- Add `RESEND_API_KEY` + `ENQUIRY_TO_EMAIL` to `.env.example`
- Update `submitEnquiryAction` to send email after DB insert
- Make email failure non-blocking (log, don't fail the user response)

### Priority 3: Analytics (Vercel Analytics)
- Install `@vercel/analytics`
- Add `<Analytics />` to root `layout.tsx`
- Track: `enquiry_submitted` conversion event (no PII)

### Priority 4: Documentation
- `PHASE-26-AUDIT.md` ← this file
- `PHASE-26-PLAN.md`
- `PHASE-26-SUPABASE-CHECKLIST.md`
- `PHASE-26-PRODUCTION-QA.md`
- `PHASE-26-REPORT.md`

---

## 19. LAUNCH BLOCKERS — PRELIMINARY

### CRITICAL
- [ ] `NEXT_PUBLIC_SITE_URL` not configured — admin invites broken

### HIGH
- [ ] No email notification — no real-time business alerts
- [ ] No analytics — no conversion measurement

### MEDIUM
- [ ] No Vercel deployment verified (not deployed yet)
- [ ] No real-world performance data

### LOW
- [ ] `next/image` migration (only if LCP > 2.5s on production)
- [ ] HTML sanitization (only if user-generated content introduced)
