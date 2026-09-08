# PHASE 27 — PRODUCTION VALIDATION

This document records what was verified in Phase 27. Tests are marked:
- **CODE** — verified by source code inspection
- **MANUAL** — requires browser / dashboard / Supabase access
- **NOT TESTABLE** — cannot be verified in this environment

---

## 1. REPOSITORY STATE

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Git branch | `prototype/phase-2d-signature` | Confirmed | PASS | `git -c core.pager=cat status` |
| Uncommitted changes present | Acknowledged | 19 unpushed commits + untracked files | PASS | git status output |
| Proxy file name (Next.js 16) | `proxy.ts` at root | Present, function `proxy` | PASS | filesystem + `proxy.ts:4` |

---

## 2. NEXT.JS VERSION

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `package.json` | `16.3.3` or higher | `16.3.3` | PASS | `package.json:23` |
| `node_modules/next` | matches package.json | `16.3.3` | PASS | `node_modules/next/package.json:3` |
| Patch upgrade available | 16.3.4 | 16.3.4 exists on npm | PASS | `npm view next/16.3.4` |
| Patch upgrade applied | — | NOT applied (kept 16.3.3) | DEFERRED | Manual action |

**Decision:** Did not auto-upgrade. 16.3.3 is stable; 16.3.4 is a manual step.

---

## 3. TYPE SCRIPT + BUILD

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `npx tsc --noEmit` | 0 errors | 0 errors | PASS | TS check |
| `npm run build` | Pass | Pass | PASS | Build output |
| Total routes | Same or more | 30 routes | PASS | Build output |
| New routes | — | None | PASS | Build output |
| No module resolution errors | Yes | Yes | PASS | Build output |

---

## 4. ENVIRONMENT VARIABLES

| Variable | Type | Used in | Verified | Status |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | PUBLIC | `lib/supabase/*.ts` | Yes | PASS |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | PUBLIC | `lib/supabase/*.ts` | Yes | PASS |
| `SUPABASE_SERVICE_ROLE_KEY` | SERVER | `lib/supabase/server.ts` | Yes | PASS |
| `NEXT_PUBLIC_SITE_URL` | SERVER | `lib/admin-actions.ts:351` | Yes | PASS |
| `RESEND_API_KEY` | SERVER | `lib/enquiry-notify.ts` | Yes | PASS |
| `ENQUIRY_NOTIFICATION_EMAIL` | SERVER | `lib/enquiry-notify.ts` | Yes | PASS |
| `ENQUIRY_FROM_EMAIL` | SERVER | `lib/enquiry-notify.ts` | Yes | PASS |
| `VERCEL_OIDC_TOKEN` | AUTO | (Vercel-managed) | Yes | PASS |
| `DARAJA_*` | SERVER | `app/admin/integrations/*` | Yes | PASS |

**No NEXT_PUBLIC_ secrets found.** Service role only in `createServiceRoleClient()`.

---

## 5. EDGE PROXY (admin protection)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| File at project root | `proxy.ts` | Yes | PASS | filesystem |
| Function named correctly | `proxy` | Yes | PASS | `proxy.ts:4` |
| Matcher excludes static | Yes | Yes | PASS | `proxy.ts:55-58` |
| Allows public admin routes | login/forgot/reset | Yes | PASS | `proxy.ts:32-38` |
| Redirects authenticated from login | → /admin | Yes | PASS | `proxy.ts:40-42` |
| Redirects unauthenticated from /admin/* | → /admin/login?next= | Yes | PASS | `proxy.ts:44-48` |
| Server-side protection also | `requireAdmin()` in pages | Yes | PASS | grep |

---

## 6. SUPABASE CLIENT ARCHITECTURE

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Browser client | Anon only | Yes | PASS | `lib/supabase/client.ts` |
| Server client | SSR cookie bridge | Yes | PASS | `lib/supabase/server.ts:4-28` |
| Service role client | Server-only | Yes | PASS | `lib/supabase/server.ts:30-39` |
| Service role usage | Server files only | Yes | PASS | grep |
| `createServiceRoleClient` callers | All server-side | Yes | PASS | grep |
| No service role in browser bundle | Yes | Yes | PASS | grep |

---

## 7. ENQUIRY FLOW (CODE-VERIFIED)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `/contact` form renders | 5 fields | Yes | PASS | `contact/page.tsx` |
| `?type=` pre-selects type | Yes | Yes | PASS | `contact/page.tsx` |
| `?product=` fetches context | Yes | Yes | PASS | `contact/page.tsx:24-37` |
| Banner shows product name | Yes | Yes | PASS | `contact/page.tsx:31` |
| Invalid slug fails gracefully | Yes | Yes | PASS | `contact/page.tsx:33-35` |
| DB validation (name, email, type, message) | Yes | Yes | PASS | `enquiry-actions.ts:22-25` |
| DB insert | Yes | Yes | PASS | `enquiry-actions.ts:34-40` |
| Email send | Yes (after DB) | Yes (awaited) | PASS | `enquiry-actions.ts:43-55` |
| Email failure tolerance | Non-blocking | Yes | PASS | `enquiry-actions.ts:58-60` |
| Success state | Yes | Yes | PASS | `contact/page.tsx:101` |
| Error state | Yes | Yes | PASS | `enquiry-actions.ts:38-40` |
| HTML escaping in email | Yes | Yes | PASS | `enquiry-notify.ts:escapeHtml()` |
| Reply-to in email | Customer email | Yes | PASS | `enquiry-notify.ts:105` |

---

## 8. ANALYTICS (CODE-VERIFIED)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `@vercel/analytics` installed | Yes | Yes | PASS | `package.json:21` |
| `<Analytics />` in layout | Yes | Yes | PASS | `layout.tsx` |
| Page views auto-tracked | Yes | Yes | PASS | Vercel Analytics default |
| `product_enquiry_started` event | Fires on `?product=` | Yes | PASS | `contact/page.tsx:26` |
| `product_enquiry_loaded` event | Fires on name load | Yes | PASS | `contact/page.tsx:32` |
| `enquiry_submitted` event | Fires on success | Yes | PASS | `contact/page.tsx:46-52` |
| PII in `product_enquiry_started` | `product_slug` only | Yes | PASS | code |
| PII in `enquiry_submitted` | `type`, `has_product` | Yes | PASS | code |
| No PII | No name/email/phone/message | Confirmed | PASS | code |

---

## 9. SEO (CODE-VERIFIED)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `metadataBase` | `https://treadville.co.ke` | Yes | PASS | `layout.tsx:47` |
| Title template | `%s · Treadville` | Yes | PASS | `layout.tsx:28` |
| Default description | Yes | Yes | PASS | `layout.tsx:30-31` |
| OG image | `/og-default.png` | Yes | PASS | `layout.tsx:61` |
| Twitter card | summary_large_image | Yes | PASS | `layout.tsx:68` |
| Favicon | `/icon.png` | Yes | PASS | `layout.tsx:89` |
| Apple touch icon | `/apple-touch-icon.png` | Yes | PASS | `layout.tsx:91` |
| Canonical on `/` | Yes | Yes | PASS | `layout.tsx:48-50` |
| Sitemap exists | `src/app/sitemap.ts` | Yes | PASS | filesystem |
| Sitemap excludes admin | Yes | Yes | PASS | `sitemap.ts` |
| Robots exists | `src/app/robots.ts` | Yes | PASS | filesystem |
| Robots disallows admin | Yes | Yes | PASS | `robots.ts` |
| JSON-LD: Organization | Yes | Yes | PASS | `structured-data.tsx` |
| JSON-LD: WebSite | Yes | Yes | PASS | `structured-data.tsx` |
| JSON-LD: Product | Yes (on detail) | Yes | PASS | `structured-data.tsx` |
| JSON-LD: Article | Yes (on journal) | Yes | PASS | `structured-data.tsx` |
| JSON-LD: Breadcrumb | Yes (multiple) | Yes | PASS | `structured-data.tsx` |
| No fake reviews | — | None | PASS | code |

---

## 10. IMAGES (CODE-VERIFIED)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| OG image exists | `/public/og-default.png` | Yes | PASS | filesystem |
| Favicon exists | `/public/icon.png` | Yes | PASS | filesystem |
| Apple touch exists | `/public/apple-touch-icon.png` | Yes | PASS | filesystem |
| Homepage hero | DB-driven | Yes | PASS | `site_content: homepage_hero` |
| About hero | DB-driven | Yes | PASS | `site_content: about_hero` |
| Quality hero | DB-driven | Yes | PASS | `site_content: quality_hero` |
| Export hero | DB-driven | Yes | PASS | `site_content: export_hero` |
| Category hero | DB-driven | Yes | PASS | `site_content: category_hero_*` |
| Category image | DB-driven | Yes | PASS | `category.image_url` |
| Product image | DB-driven | Yes | PASS | `product.image_url` |
| Product gallery | DB-driven | Yes | PASS | `product.gallery` |
| Article cover | DB-driven | Yes | PASS | `article.cover_image_url` |
| No stock photo URLs | None | None | PASS | grep |
| No `unsplash.com` | None | None | PASS | grep |
| No `pexels.com` | None | None | PASS | grep |
| No `/images/` hardcoded | None | None | PASS | grep |
| Graceful image fallback | Yes | Yes | PASS | `ProductImage.tsx onError` |

---

## 11. JOURNAL (CODE-VERIFIED)

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| `getArticles(true)` filters published | Yes | Yes | PASS | `lib/queries.ts` |
| `getArticleBySlug` filters published | Yes | Yes | PASS | `lib/queries.ts` |
| Draft articles 404 | Yes | Yes | PASS | `journal/[slug]/page.tsx` |
| Empty state | "Coming soon" | Yes | PASS | `journal/page.tsx:88-99` |
| Tiptap HTML rendering | Yes (admin-authored) | Yes | PASS | `journal/[slug]/page.tsx:51` |
| Plain text fallback | Yes | Yes | PASS | `journal/[slug]/page.tsx` |
| No hardcoded articles | Yes | Confirmed | PASS | grep |
| Article JSON-LD | Yes (on detail) | Yes | PASS | `structured-data.tsx` |

---

## 12. DOMAIN SWEEP

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| No `localhost` in src/ | Yes | Yes | PASS | grep |
| No `127.0.0.1` in src/ | Yes | Yes | PASS | grep |
| No `0.0.0.0` in src/ | Yes | Yes | PASS | grep |
| No preview URLs | Yes | Yes | PASS | grep |
| All production URLs | `treadville.co.ke` | Yes | PASS | grep |

---

## 13. SECURITY

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Admin proxy (Edge) | Active | Yes | PASS | `proxy.ts` |
| Admin Server Actions | `requireAdmin()` | Yes | PASS | grep |
| Admin pages | `requireAdmin()` | Yes | PASS | grep |
| Admin layout | Redirects to /admin/login | Yes | PASS | `admin/layout.tsx:8-10` |
| SYSTEM_ADMIN gate | `requireRole(['SYSTEM_ADMIN'])` | Yes | PASS | grep |
| Service role | Server-only | Yes | PASS | grep |
| No secrets in client | Yes | Yes | PASS | grep |
| No console.log of secrets | Yes | Yes | PASS | grep |
| API: product-context | Public name only | Yes | PASS | `api/product-context/route.ts` |
| API: 404 for unpublished | Yes | Yes | PASS | `api/product-context/route.ts:12-15` |
| `dangerouslySetInnerHTML` | Admin-authored only | Yes | PASS | `journal/[slug]/page.tsx:51` |
| HTML in email | Escaped | Yes | PASS | `enquiry-notify.ts:escapeHtml()` |

---

## 14. VERCEL DEPLOYMENT

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Repository on Git | Required | Manual | MANUAL | Pascal action |
| Vercel project exists | Required | Manual | MANUAL | Pascal action |
| Env vars set in Vercel | 8 vars required | Manual | MANUAL | Pascal action |
| `NEXT_PUBLIC_SITE_URL` set | Yes | Manual | MANUAL | Pascal action |
| Resend vars set | Optional | Manual | MANUAL | Pascal action |
| Custom domain | `treadville.co.ke` | Manual | MANUAL | Pascal action |

**Status:** Code-ready. Deployment is a manual step requiring Vercel dashboard access.

---

## 15. SUPABASE PRODUCTION

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| RLS enabled | Yes | Schema SQL | PASS | `supabase/schema.sql` |
| Tables present | All | Schema | PASS | schema |
| Storage buckets | 3 buckets | Manual check | MANUAL | Pascal action |
| Buckets public | Yes | Manual | MANUAL | Pascal action |
| Auth redirect URLs | Configured | Manual | MANUAL | Pascal action |
| Admin user exists | Yes | Manual | MANUAL | Pascal action |
| Sample data | Real | Manual | MANUAL | Pascal action |

**Reference:** `Docs/PHASE-26-SUPABASE-CHECKLIST.md` for full manual checklist.

---

## 16. PRODUCTION SMOKE TEST

| Route | Status | Evidence |
|---|---|---|
| `/` | NOT TESTABLE | No deployment |
| `/about` | NOT TESTABLE | No deployment |
| `/contact` | NOT TESTABLE | No deployment |
| `/shop` | NOT TESTABLE | No deployment |
| `/shop/coffee` | NOT TESTABLE | No deployment |
| `/product/[slug]` | NOT TESTABLE | No deployment |
| `/journal` | NOT TESTABLE | No deployment |
| `/admin/login` | NOT TESTABLE | No deployment |
| `/sitemap.xml` | NOT TESTABLE | No deployment |
| `/robots.txt` | NOT TESTABLE | No deployment |

**Note:** All production smoke tests require deployment to Vercel. Pascal must perform these after deployment.

---

## 17. PERFORMANCE

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Lighthouse LCP | < 2.5s target | NOT TESTABLE | NOT TESTABLE | No production URL |
| Lighthouse CLS | < 0.1 target | NOT TESTABLE | NOT TESTABLE | No production URL |
| Vercel Analytics | Live | NOT TESTABLE | NOT TESTABLE | No production URL |

**Code-verified performance:**
- `next/font` (server-loaded, no layout shift)
- Hero `fetchpriority="high"`, `decoding="async"`
- Below-fold `loading="lazy"`
- CSS animations use `transform`/`opacity` only
- No unnecessary `next/image` migration (not warranted)

---

## 18. SUMMARY

| Category | Code-verified | Manual required | Blocked |
|---|---|---|---|
| Repository state | ✓ | Push to GitHub | — |
| Build | ✓ | Deploy to Vercel | — |
| TypeScript | ✓ | — | — |
| Middleware | ✓ | Verify in production | — |
| Env vars | ✓ Documented | Set in Vercel | — |
| Email | ✓ Implemented | Configure Resend | — |
| Analytics | ✓ Implemented | Verify in Vercel dashboard | — |
| SEO | ✓ Implemented | Verify in production HTML | — |
| Journal | ✓ DB-driven | Verify in production | — |
| Images | ✓ No stock photos | Verify in production | — |
| Security | ✓ Server-only secrets | Verify in production | — |
| Supabase | ✓ RLS + clients | Verify production state | — |
| Performance | — | Run Lighthouse | No URL |
| Smoke tests | — | Run after deploy | No URL |
