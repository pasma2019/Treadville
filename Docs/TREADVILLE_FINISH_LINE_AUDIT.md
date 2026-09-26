# TREADVILLE — FINISH-LINE AUDIT

> Formal pre-payment / pre-production audit specification for the Treadville V1 experience.
>
> This document governs the finish-line audit: establishing the true state of the project **before** payment and checkout are implemented, and verifying that everything else is production-ready.

---

## 1. Audit Objective

The purpose of this audit is to establish the true finish-line state of Treadville V1 **before payment and checkout are implemented**.

The audit must determine whether the project is functionally complete **except for the payment and checkout system**, and whether what remains can be pushed to GitHub and deployed to the production Vercel environment once payment and checkout are done.

This is **not** a redesign, a cleanup, or an open-ended improvement pass. It is a verification pass:

- What exists.
- What works.
- What is broken.
- What is placeholder or staged.
- What must be fixed before launch.
- What is intentionally deferred (payment and checkout).

The audit must record concrete evidence for every finding. Unsupported claims ("looks good", "verified", "fine") are not permitted without evidence.

---

## 2. Current V1 Scope

The expected completed scope of Treadville V1 is:

- **Homepage** — premium editorial flagship: hero, product worlds, origin story, featured collection, quality, export, journal, enquiry.
- **Shop** — catalogue index across all four categories.
- **Category pages** — Coffee, Tea, Horticulture, Grains.
- **Product detail pages** — identity, category, description, imagery, origin, quality metadata, availability, enquiry CTA, related products.
- **Product enquiry flow** — product-level enquiry initiation.
- **Enquiry basket** — client-side basket (or equivalent) holding product references pending an enquiry.
- **Enquiry submission** — validated submission via Server Action.
- **Reference generation** — readable enquiry/product reference created atomically (e.g. `public.create_order` RPC returning a trigger-generated reference).
- **WhatsApp / contact integration** — direct contact paths (WhatsApp, email, phone, contact form).
- **About** — brand and business narrative.
- **Origins** — Kenyan provenance and terroir storytelling.
- **Export** — export capability and process.
- **Journal** — editorial publishing.
- **Contact** — enquiry form with product-context support.
- **Terms of Service** — legal page.
- **Privacy Policy** — legal page.
- **Admin authentication** — sign-in to the private operations portal.
- **Admin product management** — create / edit / publish products via the same data model as the storefront.
- **Admin enquiry/order management** — process incoming trade enquiries.
- **Supabase database** — categories, products, site content, articles, orders, communications.
- **RLS** — row-level security posture (public read-only where appropriate, admin-only where required).
- **Role enforcement** — OWNER / SYSTEM_ADMIN / ADMIN separation on privileged surfaces.
- **Product / media management** — image handling via the existing media pipeline (Supabase storage-backed).

Payment and checkout are deliberately **excluded** from the current V1 scope. See section 4.

---

## 3. Catalogue Scope

The current intended catalogue is fixed. Do **not** inventory, add, or invent additional products or specifications during the audit.

### Coffee

- FAQ++ AA Grade
- Premium AB Grade
- Anaerobic Processed

### Tea

- Premium Black Tea
- Fresh Tea Leaves

### Grains

- Kenyan Beans
- Green Grams
- Kenyan Rice

### Horticulture

- Hass Avocado

Notes:

- Coffee entries may carry verified Treadville metadata (grade, origin, altitude, processing, region, SCA range, tasting notes, variety) where the live data provides it.
- Tea, Grains and Horticulture are demo-category content awaiting client information. The audit should verify that placeholder copy is honest (clearly demo / to-be-supplied) and never implies verified Treadville facts.

---

## 4. Commerce Architecture

The intended and expected flow is:

```
Browse
  → Product
    → Enquiry Basket
      → Submit Enquiry
        → Reference
          → Admin handling
            → Quote / confirmation
              → Fulfilment
```

Key requirements for the audit:

- The browse → product → enquiry → reference path is the **commercial core** and must remain intact.
- Enquiry lines carry product identity and quantity only — no payment amounts are collected.
- Submission is server-validated (bounds, formats, duplicate handling) via Server Action.
- Order/enquiry creation is **atomic** through `public.create_order` (SECURITY DEFINER, trigger-generated reference).
- The enquiry reference is shown to the customer on success.
- Admin can see, filter and progress enquiries/interactions in the admin surface.

Clearly state:

> **Payment and checkout are intentionally deferred.** The audit does not require them to exist, and must not implement them. The audit must verify that the existing surface honestly communicates this state (e.g. prototype / no-payment markers) and that no live-looking but non-functional payment UI is exposed.

---

## 5. Audit Areas

The audit must produce checklists and findings for each area below. Every item must end in a PASS or a classified finding.

### Public storefront

- [ ] Homepage renders all flagship sections with content from the data layer (not hard-coded)
- [ ] Shop index lists the intended catalogue
- [ ] Every public route returns 200 with correct content
- [ ] Empty / loading / error / 404 states are intentional and branded
- [ ] No horizontal overflow at desktop or mobile
- [ ] No broken links in primary and footer navigation

### Catalogue

- [ ] Categories are data-driven (admin → storefront)
- [ ] Category pages render the intended products for each category
- [ ] Category accent treatment is applied without breaking the shared Treadville system
- [ ] Demo categories carry honest placeholder copy

### Product pages

- [ ] Product detail renders identity, category, description, imagery, origin and quality metadata from the data model
- [ ] Add-to-enquiry / request CTAs work and update the basket
- [ ] Related products resolve within the catalogue
- [ ] Invalid/missing product slugs produce a branded 404 (not a crash)

### Enquiry flow

- [ ] Add to enquiry → basket → submit → reference path works end-to-end
- [ ] Basket persists client-side and revalidates against the published data on rehydration
- [ ] Server-side validation rejects invalid quantities/products
- [ ] Empty-basket state is present and helpful
- [ ] Success state shows the reference
- [ ] Checkout/enquiry surface is honest about the payment state

### Admin

- [ ] Admin login renders the operations portal
- [ ] Category administration: add / edit / deactivate
- [ ] Product administration: add / edit / publish — reflected on the storefront
- [ ] Enquiry/order administration: list, filter, progress enquiries
- [ ] Admin pages redirect unauthenticated visitors to login
- [ ] Non-admin authenticated sessions must not loop or gain access

### Authentication

- [ ] Sign-in flow works for admin accounts
- [ ] Sign-out works
- [ ] Session refresh path is handled (proxy / middleware)
- [ ] Role sourced from the authenticated identity (e.g. `app_metadata.role`)

### Authorization

- [ ] Every admin Server Action begins with `requireAdmin()` / `requireRole()`
- [ ] Privileged surfaces (users, activity, integrations, security) require SYSTEM_ADMIN
- [ ] No client-side-only authorization gates

### Supabase

- [ ] Client uses the anon key only
- [ ] Service-role client exists server-side only
- [ ] Environment variables used for all credentials
- [ ] No credentials committed

### RLS

- [ ] Public tables expose only read policies appropriate to the public
- [ ] Commerce / admin tables are admin-only
- [ ] No public write policies that contradict the posture
- [ ] Deployed RLS state noted as verified-only-statically or confirmed live

### Database

- [ ] Migrations are present and ordered for categories, products, content, articles, orders, communications
- [ ] Payment migrations/files, if present, are treated as **future/deferred payment scope** — never as a requirement that payment already be implemented; the production database requirement is the existing enquiry/order architecture
- [ ] Atomic order creation RPC exists and is defensible
- [ ] Seed data aligns with the code's content keys (e.g. `homepage_hero_*`) and the live catalogue
- [ ] Centralized data access (queries layer), no scattered direct calls

### Journal

- [ ] Journal index lists published articles
- [ ] Article detail renders full content
- [ ] Article metadata (title, description, canonical, robots) is correct

### Media / images

- [ ] No broken images across storefront, products, journal, admin
- [ ] Images have sensible dimensions / aspect handling
- [ ] Important images have fallback behavior
- [ ] Local-only/relative media referenced by seed does not leak into production rendering

### Responsive design

- [ ] Homepage, shop, category, product, journal, checkout/enquiry, admin render at desktop and mobile
- [ ] No hover-only functionality on touch
- [ ] Touch targets are adequate
- [ ] No microscopic text

### Accessibility (where applicable)

- [ ] `lang` is set
- [ ] Single logical `h1` per page
- [ ] Alt text on meaningful images
- [ ] Visible focus states
- [ ] Keyboard navigability of primary controls
- [ ] `prefers-reduced-motion` respected
- [ ] Contrast is reasonable for primary text

### SEO / metadata

- [ ] Titles and canonical URLs correct per route
- [ ] Products, categories, journal, legal pages `index, follow`
- [ ] Sitemap covers intended public pages
- [ ] `robots` directives correct
- [ ] No obvious metadata inheritance on critical routes (e.g. checkout inheriting homepage)

### Security

- [ ] CSP and security headers present
- [ ] `permissions-policy` blocks undesired features (e.g. `payment=()`)
- [ ] No service-role / secret exposure client-side
- [ ] Server Actions validate inputs
- [ ] Rate limiting on sensitive actions
- [ ] Upload handling (if present) is constrained
- [ ] Privileged operations gated by role
- [ ] `.env*` ignored by Git

### Performance

- [ ] Production build completes cleanly
- [ ] Routes are server-rendered where appropriate, client components minimal
- [ ] Images handled by the existing optimization pipeline
- [ ] No layout-thrash / width-height animations observed
- [ ] Runtime console is clean on real pages

### Production build

- [ ] `npm run build` passes on the current tree
- [ ] `npx tsc --noEmit` passes on the current tree
- [ ] `npm run lint` state is reported (including known pre-existing issues — see section 7)

### Environment variables

- [ ] Required env names are documented (`.env.example` / `.env.local.example`)
- [ ] No secrets committed
- [ ] Env-dependent behavior (e.g. payment provider enablement) is understood and safe in default state

### Development leftovers

- [ ] No local-only console noise that would fail production expectation (e.g. Vercel Insights 404 on localhost — expected, document it)
- [ ] No debug output / `console.log` in production paths

### Payment boundary

- [ ] Existing payment scaffolding is inert in the default configuration
- [ ] Enabling payment providers does not silently present a non-functional payment UI
- [ ] Payment-provider enablement is read safely (see hydration concern in section 12 / payment notes)
- [ ] Orders carry no payment data today
- [ ] Payment files (migrations, admin surface, lib) are staged and identifiable for the future change

---

## 6. Responsive Verification

The audit must verify representative pages at:

- **1440px desktop**
- **390px mobile**

For each width, check the following surfaces:

- [ ] Homepage (hero, scrim, category badges, sections)
- [ ] Shop
- [ ] Category page (Coffee; plus Tea, Horticulture, Grains for consistent structure)
- [ ] Product page
- [ ] Enquiry basket / checkout-enquiry surface (empty and with an item)
- [ ] Journal
- [ ] Admin login
- [ ] Admin product interface
- [ ] Admin enquiry/order interface

Checks per surface: no horizontal overflow, no visual breakage, primary CTA reachable, no hover-dependent functionality, sensible typography scale.

---

## 7. Technical Verification

The audit must check:

- [ ] **TypeScript** — `npx tsc --noEmit` exits 0
- [ ] **Production build** — `npm run build` passes on the current tree
- [ ] **Lint** — `npm run lint` result must be recorded, not assumed
- [ ] **Existing tests / smoke checks** — run any that exist; if none, say so
- [ ] **Route generation** — all intended routes resolve (200) with correct content
- [ ] **Hydration errors** — none on real pages
- [ ] **Server/client boundaries** — Server Actions used correctly; env reads not hydrating client components (flag any found)
- [ ] **Console errors** — clean on real pages; known localhost-only noise classified
- [ ] **Production-only issues** — Vercel-specific script availability, build-time env baking

**Known unrelated lint issue:** if `npm run lint` still fails with

```
Cannot find module 'es-abstract/2024/AddEntriesFromIterable'
```

(caused by the `object.fromentries` → `es-abstract` transitive resolution), this must be **explicitly classified** (e.g. PRE-EXISTING / UNRELATED — tooling) rather than silently ignored, and the impact on any lint CI gate stated.

---

## 8. Security Verification

The audit must check:

- [ ] **Supabase RLS** — policies reviewed; deployed state either verified live or explicitly marked static-review-only
- [ ] **Admin authorization** — every admin Server Action gated
- [ ] **Role enforcement** — OWNER / SYSTEM_ADMIN separation on privileged admin pages
- [ ] **Service-role exposure** — service-role client exists server-side only
- [ ] **Client-side secret exposure** — no secrets reachable from the browser bundle
- [ ] **Server actions** — input validation, bounds, rate limiting
- [ ] **Route handlers** — public API routes safe and bounded (e.g. product-context)
- [ ] **Input validation** — format/type/length checks server-side
- [ ] **Upload security** — media upload constrained (types, size, auth) where present
- [ ] **Privileged operations** — role-checked (users, activity, integrations, security)

---

## 9. Production Content Verification

Scan the repository for development/placeholder artifacts. Findings must be **classified, not blindly deleted** — some placeholders are intentional (demo categories, to-be-supplied content).

Search for:

- [ ] TODO
- [ ] FIXME
- [ ] placeholder
- [ ] lorem ipsum
- [ ] mock
- [ ] demo
- [ ] sample
- [ ] temporary
- [ ] localhost
- [ ] preview URLs
- [ ] debug output
- [ ] console.log
- [ ] fake claims
- [ ] fake certifications

For each hit, record:

1. Location
2. Whether it is reachable by production users
3. Whether it is intentional demo/staged content
4. The classification (see section 10)

---

## 10. Finish-Line Classification

Every finding must receive **exactly one** of:

- **BLOCKER** — must be fixed before production; shipping without it is unacceptable
- **REQUIRED BEFORE LAUNCH** — genuine defect that should be fixed as launch-checklist work before production
- **PAYMENT-SPECIFIC** — relevant only to the future payment/checkout work; must not regress and must be handled when payment lands
- **POLISH** — cosmetic / non-blocking refinement
- **PRE-EXISTING / UNRELATED** — pre-existing environmental, tooling, or non-code concern (e.g. the lint toolchain, localhost-only Vercel Insights noise)
- **PASS** — verified working, with concrete evidence

No finding may be left unclassified.

---

## 11. Final Gate

The audit must answer the question:

> If payment and checkout were implemented today, is anything else currently missing that would prevent us from pushing this project to GitHub and deploying the production version to Vercel?

The possible final answers are:

- **YES — additional work remains before payment.**
- **NO — payment + checkout are the only remaining functional scope.**

The final answer must be supported by the sections above and must list any REQUIRED-BEFORE-LAUNCH items that accompany a "NO" so the reader understands the launch checklist, not just the verdict.

---

## 12. Final Report Format

Every audit must produce a report using the fixed template below. Each PASS must carry concrete evidence: a route, a command + exit code, a file:line reference, a browser check, or a live-rendering observation. "Looks good" or "Verified" with no evidence is not a PASS.

# TREADVILLE — FINISH-LINE AUDIT REPORT

## A. Overall Status
One-paragraph verdict + counts table (BLOCKER / REQUIRED / PAYMENT-SPECIFIC / POLISH / PRE-EXISTING / PASS).

## B. Public Experience
Homepage, shop, categories, product pages, enquiry flow, contact/WhatsApp, legal pages — evidence per surface.

## C. Catalogue
Coffee / Tea / Grains / Horticulture — live product presence and demo-content honesty.

## D. Admin
Authentication, authorization, roles, product management, enquiry/order management.

## E. Database / Supabase
Migrations, RPC, seed/code key alignment, RLS (state noted), data access.

## F. Journal
Index + article detail + metadata.

## G. Media / Images
Broken images, sizing, storage usage, fallbacks.

## H. Mobile / Desktop
Responsive evidence at 1440 and 390 for the required surfaces.

## I. Security
RLS, auth, roles, secrets, server actions, inputs, uploads, privileged ops.

## J. SEO / Metadata
Titles, canonicals, robots, sitemap.

## K. Production Build
Run results for build, tsc, lint, tests, route generation, console errors.

## L. Payment Boundary
Current payment state, honesty of the surface, deferred-scope confirmation, payment-safety warnings.

## M. Remaining Work
Concise action list from the findings (never the execution itself).

## N. Final Gate
The single-sentence YES / NO answer to the question in section 11, with supporting notes.

---

*Prepared by the opencode agent operating under the Treadville AGENTS.md product standard.*