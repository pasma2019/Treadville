# TREADVILLE — FINISH-LINE AUDIT REPORT

> Audit executed against `docs/TREADVILLE_FINISH_LINE_AUDIT.md` (the formal source of truth).
> Evidence legend: **browser-tested** = rendered + interacted via headless Chrome against `http://127.0.0.1:3000` (production `next start`, build from this session) at 1440×1000 and 390×844 · **enumerated** = present in the build route table / file inventory · **source-inspected** = read and reasoned, not live-verified (auth/payment boundaries noted).
> No application code was changed during this audit.

## A. Overall Status

Treadville V1 is functionally complete for every area except payment and checkout. The live production build renders the full storefront with correct data, the enquiry pipeline is validated end-to-end up to an atomic server-only RPC, the admin surface is gated and wired, RLS/authorization posture is sound at the static level, and browser sessions were clean (no console/hydration errors, no broken images, no overflow). No BLOCKERs found. Four REQUIRED items remain as launch-checklist work (none prevents the push/deploy itself).

| Classification | Count |
| --- | --: |
| BLOCKER | 0 |
| REQUIRED BEFORE LAUNCH | 4 |
| PAYMENT-SPECIFIC | 4 |
| POLISH | 4 |
| PRE-EXISTING / UNRELATED | 3 |
| PASS | 25 |

## B. Public Experience

- **Homepage** — browser-tested 200. Hero photograph (storage `site-images/1790437770194-…png`) + scrim gradient + 100.8px Cormorant Garamond ivory headline render; gold category badges (`cat-badge`/`dot`/`label`) present on Product Worlds; nav, secondary CTAs, footer links resolve. Section content comes from the data layer (`src/app/(storefront)/page.tsx` fetches `getCategories/getFeaturedProducts/getSiteContent/getArticles`; badge classes verified in DOM at desktop and 390px). **PASS**
- **Shop** `/shop` — 200; catalogue index lists live products with storage images, 0 broken, 0 missing `width/height`. **PASS**
- **Category pages** `/shop/coffee|tea|horticulture|grains` — browser-tested 200; each renders the intended products + honest copy (see C); active-only categories enforced server-side (`src/lib/queries.ts`). **PASS**
- **Product detail** `/product/anaerobic-processed` (live slug set: `anaerobic-processed`, `premium-ab-grade`, `faq-aa-grade`, `treadville-specialty-coffee`) — full metadata block (altitude/grade/origin/processing/region/SCA/tasting/variety), gallery, "ADD TO ENQUIRY", related products. Invalid slug → branded 404 (browser-tested). **PASS**
- **Enquiry flow** — browse → add (button text flips to "ADDED TO ENQUIRY"; localStorage `treadville:cart:v1` written) → `/checkout` review with quantities, remove, "Pricing is provided by Treadville after enquiry review.", details fields, honest no-payment notice; empty state "Your enquiry is empty" branded. **PASS** (success-reference write not executed — see K)
- **Contact / WhatsApp** — `/contact` 200 with product-context support (`?product=`) via `/api/product-context`; WhatsApp link in drawer/footer (source-inspected). Terms `/terms`, Privacy `/privacy` — browser-tested 200 with real legal content. **PASS** (except R3, below)

## C. Catalogue

Live products verified in rendered DOM against the audit spec:
- **Coffee**: Anaerobic Processed, Premium AB Grade, FAQ++ AA Grade — on `/shop/coffee`; verified metadata on Anaerobic page. **PASS**
- **Tea**: Premium Black Tea, Fresh Tea Leaves — on `/shop/tea`. **PASS**
- **Grains**: Kenyan Beans, Green Grams, Kenyan Rice — on `/shop/grains`. **PASS**
- **Horticulture**: Hass Avocado — on `/shop/horticulture`. **PASS**
- Demo honesty: Tea/Horticulture/Grains category pages state "Demo category — real Treadville … to be supplied by client." — no unverified company claims presented as fact. **PASS**
- **R2 (REQUIRED BEFORE LAUNCH):** `supabase/seed.sql:55-57` seeds `hero_headline/hero_subheadline/hero_image` while the app reads `homepage_hero*` (`src/lib/cms-fields.ts:55,64,74`), and seed slugs/images (`treadville-moka-espresso`, `/images/*.jpg`) don't match the live catalogue/storage scheme. Live site unaffected; a fresh DB from this repo renders a hero with no photograph + a stale catalogue.

## D. Admin

- Auth: `getUser()` network-verified, role from `app_metadata.role`; `isAdmin` = OWNER or SYSTEM_ADMIN (`src/lib/auth.ts:44-46`). **PASS**
- `/admin/login` browser-tested — branded portal ("Treadville OPS … Welcome back"). Logged-out `/admin/products` → redirect to `/admin/login` (browser-tested). **PASS**
- Every admin Server Action begins `requireAdmin()`/`requireRole()` (`src/lib/admin-actions.ts` lines 53,102,168,186,211,248,269,316,339,429,446,469,531,577,651,699,725,766,817,867,892,1018,1068,1098,1112,1142,1172,1225); privileged pages users/activity/integrations/security → `requireRole(["SYSTEM_ADMIN"])`. **PASS**
- Product/category/enquiry management client surfaces (`ProductStudio`, `CategoriesClient`, `OrdersClient`/`OrderDetailClient`, `EnquiriesClient`) source-inspected, wired to gated actions. Admin protected routes enumerated in build table (products, categories, enquiries, orders, orders/[id], journal, content, users, settings, security, activity, integrations, payments). **PASS** — limitation: admin product/enquiry interfaces were source-inspected, not browser-driven (no admin credentials available this audit; the auth gate itself was browser-verified).
- **R1 (REQUIRED BEFORE LAUNCH):** authenticated non-admin hitting `/admin` loops forever — `src/proxy.ts:121-127` redirects signed-in users from `/admin/login` → `/admin`, while `src/app/admin/(protected)/layout.tsx:8-10` redirects non-admins from `/admin` → `/admin/login`.

## E. Database / Supabase

- Migrations ordered 0001–0009 (articles; commerce customers/orders; **create_order RPC**; order_communications; public-write drops; anon-write closure; admin delete; articles jwt-role; payments). **PASS**
- `public.create_order` — inspected migration `20260909_0002` + fix `0003`: **SECURITY DEFINER** (line 180), single implicit transaction (exceptions `invalid_input`/`invalid_items` roll back), reference + `status='pending'` assigned by an in-transaction trigger (lines 285-287), reads product rows itself for name snapshots/validation, EXECUTE revoked from public/anon/authenticated and granted **only to service_role** (lines 346-359). Server-invoked over the service client at `src/lib/order-actions.ts:130`; client can never call it. **PASS**
- RLS: public read-only for published products/articles/active categories/site_content; customers/orders/order_items/order_communications admin-only; "public full access" and "Anyone can submit enquiry" policies dropped (0005/0006); anon/authenticated INSERT on enquiries revoked (0006). **STATIC REVIEW ONLY — LIVE DEPLOYED STATE NOT VERIFIED** (no live DB access available).
- Data access centralized (`src/lib/queries.ts`, `src/lib/{order,enquiry,admin}-actions.ts`); no scattered DB calls in UI (CartContext re-fetch is the documented RLS-restricted public read path). **PASS**
- Clarification recorded in the audit document: payment migration `20260919_0009` + payment files are **deferred scope**, not a current requirement. **PASS**
- **R2** applies here (seed/code key + slug misalignment).

## F. Journal

- `/journal` browser-tested — "2 ESSAYS · From the field", both live article links; empty-state "Coming soon" only renders when `articles.length === 0` (`src/app/(storefront)/journal/page.tsx:87-98`); homepage journal preview shows the 2 essays. Article `/journal/understanding-kenyan-specialty-coffee` browser-tested 200 with title/canonical. **PASS**

## G. Media / Images

- 0 broken images across all browser-tested pages; images served from Supabase storage `site-images`; product/category/about/origins/export imagery all load; `width/height` set on non-hero imagery. Fallbacks exist and are honest: `src/components/ProductImage.tsx:16` "Image pending", `src/components/ProductGallery.tsx:35` "Image coming soon" (unused by the live catalogue — no pending images rendered). **PASS**

## H. Mobile / Desktop

Browser-tested at **1440×1000** and **390×844**: homepage, shop, coffee/tea/horticulture/grains, product page, journal, checkout (empty + with item), admin login, admin redirect (products). No horizontal overflow (every page `scrollWidth ≤ clientWidth`), primary CTAs reachable, no hover-only interactions (all actions button-based), hero headline fits (342px wide, ~3 lines at 390px). Screenshots retained at `C:\Users\Admin\AppData\Local\Temp\opencode\finishline\*.png`. **PASS**

## I. Security

- **RLS** — see E (**STATIC REVIEW ONLY — LIVE DEPLOYED STATE NOT VERIFIED**).
- **Service-role / client secrets** — service client only in `src/lib/supabase/server.ts`; `process.env` scan shows no `NEXT_PUBLIC_` secret; browser console contains no secrets; admin security page reads env presence only as booleans. **PASS**
- **Headers** — `next.config.ts:14-35`: nosniff, referrer, permissions-policy incl. `payment=()`, `X-Frame-Options: DENY`, HSTS; per-request nonce CSP in `src/proxy.ts`. **PASS**
- **Server actions** — `submitOrderAction`: rate limit (35), field checks (51-53), JSON bounds `MAX_LINES=100` + `MAX_QUANTITY_PER_LINE=1000` (15,23,70,85), per-line product verification, single service-role RPC. `submitEnquiryAction` similarly flagged. Browser-verified: the checkout form uses `required` + `noValidate`; invalid submissions POST to the action and are rejected server-side before any DB write. **PASS**
- **Uploads** — admin `ImageUpload.tsx` constrained (client preview + server-side storage), gated by admin actions (source-inspected). **PASS / static**
- **Rate limiting** — `src/lib/rate-limit.ts` applied to both submission actions. **PASS**
- **R1** (admin redirect loop) is the one security-adjacent defect (see D).
- `.env*` ignored (`gitignore` verified); `.env.example` documents required names; `.env.local` present on disk and untracked. **PASS**

## J. SEO / Metadata

- Browser-verified: product/article/category/contact/legal pages all emit correct `<title> · Treadville`, `canonical`, `robots: index, follow`; `src/app/sitemap.ts` emits static + active categories + published articles + published products (each in a try/catch graceful block). **PASS**
- **POLISH-1:** `/checkout` (client page, no server wrapper) inherits homepage title + canonical.
- **POLISH-2:** admin pages (incl. `/admin/login`) share the homepage title template.

## K. Production Build

- `npx tsc --noEmit` → **exit 0** (run this session). **PASS**
- `npm run build` → **exit 0** this session; full route table emitted (public 14 pages, admin 17, api). **PASS**
- Browser on prod build: **0 console errors, 0 hydration errors** on all real pages. **PASS**
- Tests: **none exist** — `package.json` scripts are only `dev/build/start/lint`; no test runner dependency. No smoke-test suite to run.
- Enquiry success/reference: not live-submitted during the audit to avoid writing test data into the production orders table; the write path is proven statically (server action → service-role `create_order` → trigger reference → `referenceNumber` returned at `src/lib/order-actions.ts:178`). Client-side add → basket → checkout-review flow was browser-tested.
- Route verification legend: **browser-tested** — `/`, `/shop`, `/shop/{coffee,tea,horticulture,grains}`, `/product/anaerobic-processed`, `/checkout`, `/journal`, `/journal/[slug]`, `/about`, `/origins`, `/quality`, `/export`, `/contact`, `/terms`, `/privacy`, `/admin/login`, `/admin/products` (redirect). **Enumerated** — all routes above plus `/product/{premium-ab-grade,faq-aa-grade,treadville-specialty-coffee}`, `/admin/{categories,enquiries,orders,orders/[id],journal,content,users,settings,security,activity,integrations,payments}`, `/admin/{forgot,reset}-password`, `/api/product-context` (build route table). **Source-inspected** — admin protected page internals and payment lib.

## L. Payment Boundary

1. Existing payment code: `src/lib/payment/` (index/mpesa/stripe), `payment-config.ts`, `payment-providers.ts`, `src/lib/types/payment.ts`, `/admin/payments` + `PaymentsClient.tsx`, migration `20260919_0009`. **Inert** — no provider calls the bridge; orders carry no payment data.
2. Public checkout honesty — browser-verified: with no providers configured the UI shows "Payment methods are currently being configured" and "PROTOTYPE · NO PAYMENT IS PROCESSED"; no card/M-Pesa fields, no amounts. **No non-functional pay button exists.**
3. Orders never require payment details.
4. Future attachment point: `src/lib/order-actions.ts:130` (`submitOrderAction`) before/around the `create_order` call; `orders.status` and the `payments` table provide the seam. Payment can be layered without destabilizing the enquiry flow — a pure extension after validation, with RLS/DOM wiring already reserving the boundary. **PASS (architecturally clean)** — with **PAYMENT-SPECIFIC** cautions:
   - **P1:** enabling `PAYMENT_*_ENABLED` before the bridge is real would surface payable-looking methods that can't charge — never enable until payment lands.
   - **P2:** `payment-config.ts` env reads are evaluated at module scope in a client component (browser-side they resolve false/undefined — no secret exposure, but misleading semantics and a future hydration/consistency risk when wired; move to the server seam).
   - **P3:** `.env.example` documents M-Pesa/Stripe "activate … at checkout" enablement while the bridge is inert — realign with the payment slice.
   - **P4:** payment files are currently untracked in git (staged for the payment work) — must be committed with that slice.

## M. Remaining Work

Launch checklist (no code was changed during this audit):
1. **R1** — role-aware `/admin/login` redirect in `src/proxy.ts` (kill the auth loop).
2. **R2** — re-sync `supabase/seed.sql` content keys (`homepage_hero*`), slugs, and storage-image scheme for fresh-install fidelity.
3. **R3** — align `/contact?type=…` query values with the select option values (e.g. `type=Sample request`).
4. **R4** — add root `src/app/not-found.tsx` (+ `error.tsx`) so top-level unknown URLs get the branded 404 instead of the default Next page.
5. **Release process** — the entire modern V1 is uncommitted (HEAD `d782fa5`, 2026-09-17; 18 tracked files + untracked `terms/`, `privacy/`, `payments/`, `src/lib/payment/`, `src/components/home/`, `Docs/`). Commit the full working tree before pushing; confirm `.env.local` stays ignored.
6. **Lint toolchain** — resolve the `es-abstract` resolution if a lint CI gate is desired.
7. **POLISH** — checkout server-metadata wrapper; admin title metadata; consolidate the two anon-client construction paths (`src/lib/supabase.ts` vs `src/lib/supabase/client.ts`); remove or keep the never-rendered `NewsletterForm` (it self-labels as demo).

## N. Final Gate

**NO — payment + checkout are the only remaining functional scope.**

The repository and running application prove the full V1 (storefront, catalogue, enquiry pipeline to an atomic service-role RPC, admin, RLS, journal, media, SEO, responsive, headers) is present and working; the four REQUIRED items (R1–R4) and the lint/release items above are genuine but non-blocking launch-checklist fixes that do not prevent pushing this project to GitHub or deploying the production build to Vercel, and every PAYMENT-SPECIFIC item is deferred by design with no public surface suggesting payment is available today.

## O. R1–R4 Remediation (executed 2026-09-26)

Evidence legend applies as in the audit: **browser-tested** = rendered via headless Chrome against production `next start` at 1440×1000 and 390×844 · **source-inspected** = read and reasoned (authenticated admin states are source-verified only — no admin credentials exist for live verification) · checks: `npx tsc --noEmit` clean, `npm run build` clean. Lint remains blocked by the pre-existing toolchain `es-abstract/2024/AddEntriesFromIterable` resolution failure (reported below, not remediated).

**R1 — role-aware `/admin/login` redirect / admin auth loop. PASS.**
- Changed:
  - `src/proxy.ts` — session role read inline at the edge (`app_metadata.role`), `userIsAdmin = role === "OWNER" || role === "SYSTEM_ADMIN"` (mirrors `src/lib/auth.ts` `isAdmin`); signed-in user at `/admin/login` → `/admin` if admin else `/`; new guard redirecting signed-in non-admins off every protected `/admin/*` path to `/` instead of bouncing them into the `/admin` ↔ `/admin/login` loop; logged-out protected access still → `/admin/login?next=<path>`; per-request CSP preserved on every redirect.
  - `src/app/admin/(protected)/layout.tsx` — non-admin redirect changed from `/admin/login` to `/` (removes the server-side loop for signed-in non-admins); logged-out still `/admin/login`. Matches the proxy and `auth.ts` role check exactly.
- Verified:
  - Browser, 1440×1000 + 390×844, logged-out `/admin` and `/admin/products` → redirected to `/admin/login?next=%2Fadmin…` (login renders). Authenticated non-admin behavior (proxy → `/`, layout → `/`, login page → `/`) is source-verified only. Admin behavior (proxy/layout pass, login → `/admin`) source-verified. Loop eliminated at both layers.

**R2 — seed fidelity: content keys, slugs, storage-image scheme. PASS.**
- Changed: `supabase/seed.sql` fully re-synced against live-rendered data and `src/lib/cms-fields.ts` read keys. Categories (4, verified live descriptions + storage URLs, sort 1–4), products (10, verified live names/slugs/images/descriptions, `price NULL`, `featured false`, `stock 0`, `status published`), `product_metadata` (verified live attribute key/value rows joined by slug), `site_content` (all keys the homepage/origins/hero actually read — `homepage_hero*`, `story_*`, `provenance_*`, `about_hero`, `quality_hero`, `origins_body_*`, `export_hero`, `category_hero_*` — against verified live strings, e.g. `homepage_hero_subheadline` and `provenance_intro` exactly as rendered). All inserts guarded with `ON CONFLICT DO NOTHING` (re-runnable). New-category/new-product intro remains fully data-driven.
- Fixed during verification: storage base host corrected `bqbyo` → `bqbyqo` (seed had dropped a character; live and `.env.local` use `…bqbyqo.supabase.co`) — all 25 image URLs re-checked live (200, `image/png`).
- Verified: build clean; live storefront renders canonical slugs/images; product pages show the full metadata set and quote-first CTAs.

**R3 — `/contact?type=` query values mis-aligned with select options. PASS.**
- Changed: `src/app/(storefront)/contact/page.tsx` — alias map + `resolveEnquiryType`: `sample`→`Sample request`, `quote`→`Export / wholesale`; valid canonical values pass through; anything else falls back to the placeholder. `initialType` and the select `defaultValue` now use the resolved value.
- Verified (browser): `/contact?type=sample` → select preselected `Sample request`; `?type=quote` → `Export / wholesale`; `?type=frobnicate` (unknown) → placeholder; valid canonical values unchanged. Submission continues to validate against the canonical `type`.

**R4 — root `not-found` / `error` for top-level unknown URLs. PASS.**
- Changed: added `src/app/not-found.tsx` and `src/app/error.tsx` (root, outside the `(storefront)` group) so unmatched URLs anywhere (including `/admin/…` and non-storefront paths) get the branded editorial 404/error instead of the default Next page; error surface intentionally exposes no runtime details.
- Verified (browser): top-level unknown URL renders "This page has moved or doesn't exist." with working `/shop` + `/` links at 1440×1000 and 390×844, no horizontal overflow, no hydration errors. The root not-found is statically prerendered, so it uses static markup rather than the JS-driven `Reveal` (whose `data-reveal-visible=false` initial state would keep content hidden when the per-request CSP nonce differs from the build-time script nonce on the cached page).

**Regression status.** All previously verified routes re-checked at both viewports after the above: `/`, `/shop`, `/shop/[category]`, `/product/anaerobic-processed`, `/contact?type=sample`, `/admin` (logged-out redirect), top-level 404. No horizontal overflow, no hydration errors, no broken images, no console errors. Locked components (`CategoryBadge`, category photo-hero scrim) untouched.

**Technical.** `npx tsc --noEmit` — clean. `npm run build` — clean. `npm run lint` — blocked by pre-existing `es-abstract/2024/AddEntriesFromIterable` resolution within `eslint-plugin-react` (object.fromentries chain); unrelated to these changes; recommended toolchain fix elsewhere. Dev/prod servers share `.next`: running a build over a live `next start` serves stale chunk manifests until the server is restarted (rotation done as part of verification; final server runs the fresh build).

**No payment implementation was performed.** The payment boundary remains exactly as audited: `src/lib/payment/*`, `payment-config.ts`, `payment-providers.ts`, `/admin/payments` + `PaymentsClient.tsx`, migration `20260919_0009_payments.sql` are inert by design; checkout still presents "PROTOTYPE · NO PAYMENT IS PROCESSED"; orders do not require payment details.

## P. Final Gate (post-remediation)

**R1–R4 REMEDIATION: PASS**

**READY FOR PAYMENT SLICE: YES**

The payment-enabling seams identified in the audit are unchanged and intact; nothing in this remediation touches the payment architecture. The launch checklist items R1–R4 from section M are resolved and verified with the evidence above; the remaining non-blocking items are the lint toolchain and the release/commit step.

---

*Prepared by the opencode agent operating under the Treadville AGENTS.md product standard.*