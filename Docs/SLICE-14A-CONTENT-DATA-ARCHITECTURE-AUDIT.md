# SLICE 14A — CONTENT & DATA ARCHITECTURE AUDIT

**Status:** AUDIT COMPLETE — READ-ONLY — NO IMPLEMENTATION
**Date:** Slice 14A
**Verification method:** Full repository inspection (Source, Queries, Server Actions, Admin UI, Migrations, Schema, Seed), plus captured live-state snapshot `db-state.json` (project build `hqdovxqxperwprbqbyqo`). A direct live `pg` connection was attempted but the Supabase direct host is IPv6-only at audit time (`ENOTFOUND db.hqdovxqxperwprbqbyqo.supabase.co`); the most recent in-repo live snapshot (`db-state.json`, produced by the prior slice's service-role capture) was used as the authoritative current-state record and is cross-checked against anon vs svc capture. All application-layer claims cite `file:line`.

---

## 1. EXECUTIVE SUMMARY

1. **The backend is NOT CMS-ready today, but the foundations are sound.** The data model, RLS posture, audit trail, and server-action mutation pattern are the right skeleton; the gaps are structural (missing tables), semantic (content keys not wired to what the storefront reads), and workflow (no media module, no navigation module, no system for heroes/settings that the storefront actually consumes).
2. **Strong:** a real mutation layer with role checks + audit on nearly every write (`src/lib/admin-actions.ts`); RLS is meaningful (public = published-only, admin = JWT-role-gated); articles and products already have the full create→draft→publish→delete loop; product metadata is a clean `(product_id, key)` EAV; a storage-files ledger (`storage_files`) exists.
3. **Weak:** `site_content` is a generic key/value dump that is both *under-consumed* (only `about_blurb` actually reaches the storefront) and *over-used* as a catch-all for heroes, section copy, images, and settings — no page structure, no sections, no ordering, no publishing, no SEO.
4. **Weak:** the storefront renders its most important business copy from hardcoded TSX — homepage hero thesis (HeroSlideshow.tsx), all About/Quality/Origins/Export editorial bodies, export destinations, contact details, certification claims, empty states, CTAs, stat claims. `src/app/(storefront)/` pages are code-owned content.
5. **Structurally missing:** `navigation`/`menus` tables (header is DB categories but footer/IA are code), `settings` table (contact/business values are hardcoded in 4+ files), `pages`/`sections` (editorial pages are per-route code), a real media manager (only product/category/article image upload; heroes are paste-a-URL), dynamic OG per page.
6. **Biggest architectural risk:** the *assumption gap* between Admin and Storefront. Three admin-editable things are dead/write-only (`hero_headline`, `hero_subheadline`, `hero_image`; `company_*` settings), while 20+ content keys the storefront actually renders have no admin editor. The CMS appears to exist but actually cannot change what customers see — and a naive "CMS build" would harden an inert system.
7. **Frontend redesign can proceed safely (≈80% independent),** because all product/category/article data flows through one query layer (`src/lib/queries.ts`) and RLS; the redesign must keep touching only storefront presentation and consume the same queries, plus a content model that is actually wired.
8. **Eunice cannot operate the site without code today.** She can upload product/category/article images and edit 4 content strings, but cannot change a hero, any editorial paragraph, contact details, navigation, or publish/layout new pages — all of that is code.
9. **Schema drift is real:** `schema.sql` is the "Phase 19" canonical file missing the entire commerce layer (customers/orders/order_items/order_communications, 4 functions, 1 sequence, 1 trigger) which exists only in migrations; the `articles` admin policy also diverges between schema.sql (JWT claim) and migration 0001 (admin_roles subquery).
10. **Recommendation:** build Slice 14B→14F as a *wired* CMS: content sections + media manager + navigation + settings + SEO, verified by the "Eunice Test" end-to-end, rather than more admin CRUD shells.

---

## 2. CURRENT ARCHITECTURE

### Application architecture
- **Framework:** Next.js (next.config.ts, `src/app` router), React 19, TypeScript, Tailwind CSS.
- **Rendering:** storefront is `force-dynamic` (src/app/(storefront)/layout.tsx:11) — every request hits Postgres, no caching layer (`revalidate = 0` on all storefront pages; no `unstable_cache` anywhere in src/lib/queries.ts).
- **Data access:** a single shared module `src/lib/queries.ts` for storefront reads, using the **anon** client inside Server Components; Admin uses the session client (`src/lib/supabase/server.ts`) and the service-role client for user/storage/audit writes.
- **Mutations:** Server Actions (`"use server"` in `src/lib/admin-actions.ts`, `enquiry-actions.ts`, `order-actions.ts`) with `requireAdmin()`/`requireRole()` guards, rate limiting, sanitization, and `logAudit` on virtually every write.
- **Security:** CSP + security headers injected by `src/proxy.ts` (per-request nonces), `forceDynamic` for nonce propagation, role from JWT `app_metadata.role`.

### Data architecture
- 10 tables in schema.sql + 4 commerce tables in migrations = **14 tables**, 1 sequence, 4 functions, 1 trigger, ~28 indexes/constraints, ~20 RLS policies.
- Relationships: `profiles→auth.users`; `admin_roles.user_id→profiles`; `products.category_id→categories` (CASCADE); `product_metadata.product_id→products` (CASCADE); `order_items.product_id→products` (RESTRICT); `orders.customer_id→customers` (RESTRICT); order/audit/storage FKs to `auth.users`.
- Public anon reads: categories (active), products (published), site_content (ALL rows), articles (published), product_metadata (published parents). Everything else is admin/service-role.
- Commerce writes only reachable via the `create_order` SECURITY DEFINER RPC (service-role granted); enquiry INSERT is service-role only after migration 0006.

### Content architecture
- **Products/categories/articles:** database-owned; admin-manageable end-to-end (create → draft → publish → delete; image upload via signed URL). ✅
- **site_content:** database table, admin-editable for 4 keys, storefront consumes ~16 static + 4 dynamic keys via `getSiteContent()` — but only 1 of the 4 admin keys is actually read by a page. The page content (About/Quality/Origins/Export/hero/sections) is **code**.
- **SEO:** titles/descriptions are per-page `generateMetadata` code; OG is fixed from root layout (`/og-default.png`) except journal articles; JSON-LD built in `src/lib/structured-data.tsx` from code + DB fields.

### Admin architecture
- Two nav tiers: OWNER (Dashboard, Categories, Products, Content, Journal, Settings, Enquiries, Orders) and SYSTEM_ADMIN (+ Users, Security, Activity, Integrations) — AdminSidebar.tsx:139.
- No `middleware.ts`; gating is server-component layout + per-page + per-action.
- Audit: `audit_log` written via service role; read is SYSTEM_ADMIN-only (OWNER dashboard's activity panel silently returns zero).

### Media architecture
- Single public bucket `site-images`. Upload = `createImageUploadAction` → signed PUT → `recordImageUploadAction` → `storage_files` row. Products/categories/articles have the widget; heroes/site-content images do NOT (paste URL only).
- `public/images/` is empty; seed and 6 demo products reference dead `/images/…` local paths. 11 objects recorded in storage snapshot, all resolving 200.

### Security architecture
- RLS is JWT-role based (`(auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER','SYSTEM_ADMIN')`).
- Public full-access policies dropped (migration 0005); anon enquiry INSERT revoked (0006).
- Article bodies sanitized with DOMPurify on write and at render; uploaded files MIME-allowlisted + 10 MB cap; fields validated server-side.

---

## 3. CONTENT CONTROL MATRIX

Legend — **Source**: DB = Supabase row; CODE = TSX/TS/const/generateMetadata; MIX = DB with code fallback. **Editable in Admin**: YES/NO/PARTIAL (which admin module). **DB/Code-backed**, **Recommended owner**, **Priority** (P0/P1/P2).

| Content | Current Source | Editable in Admin? | DB-backed? | Code-backed? | Recommended Owner | Priority |
|---|---|---|---|---|---|---|
| Homepage hero thesis (H1 + paragraph + stats) | CODE — HeroSlideshow.tsx:6-13,74-78 | NO | no | yes | Site content (page sections) | P0 |
| Homepage hero image | MIX — `site_content.homepage_hero` (page.tsx:35) | PARTIAL (paste URL via Content) | yes | fallback none | Media + Site content | P0 |
| Homepage provenance / story / featured sections | MIX — site_content keys w/ code fallback (page.tsx:40-70,107-194) | NO (keys not editable) | yes (unwired) | fallback | Site content (sections) | P0 |
| Homepage stats (30+, 04, 80+) | CODE — page.tsx:151-177 | NO | no | yes | Site content (stats) | P1 |
| JournalPreview essays (homepage) | CODE — page.tsx:73-100 (static, not linked to articles) | NO | no | yes | Articles CMS (reuse) | P1 |
| Categories | DB — categories | YES (Categories module) | yes | no | Business data | DONE |
| Category images | DB — categories.image_url | YES (upload widget) | yes | no | Business data / Media | DONE |
| Category descriptions (fallback copy) | CODE — CategoryDiscovery.tsx:13-35 | PARTIAL | DB preferred | fallback dict | Business data | P1 |
| Products | DB — products | YES (Products module) | yes | no | Business data | DONE |
| Product images + gallery | DB — products.image_url / gallery | YES (upload widget) | yes | no | Business data / Media | DONE |
| Product metadata | DB — product_metadata | YES (ProductStudio fields) | yes | no | Business data / category-aware | P0 |
| Product metadata labels | CODE — product page EYEBROW_MAP / METADATA_DISPLAY_LABELS | NO | no | yes | Config (business logic) | P2 |
| Product SEO (title/desc) | MIX — DB desc + code fallback | NO (no SEO fields) | partial | fallback | Business data (SEO cols) | P1 |
| Footer brand + links | CODE — SiteFooter.tsx:25-213 | NO | no | yes | Navigation + Settings | P0 |
| Header IA + labels | CODE/i18n — SiteHeader.tsx:12-18,132-160; i18n en/fr/de | PARTIAL (categories DB) | partial | i18n dict | Navigation (menus) | P0 |
| About page | CODE — about/page.tsx (PILLARS:17-34, body 83-139) | NO | no | yes | Editorial content (pages) | P0 |
| Quality page (certification claims) | CODE — quality/page.tsx:17-38,96-177 | NO | no | yes | Editorial content | P0 |
| Origins page | CODE — origins/page.tsx:47-163, 192-195 (+2 "Photography pending" placeholders 109,144) | NO | no | yes | Editorial content | P0 |
| Export page (destinations + capabilities) | CODE — export/page.tsx:17-22,109-136 | NO | no | yes | Editorial content | P0 |
| Journal index + articles | DB — articles | YES (Journal module) | yes | no | Editorial content | DONE |
| Journal listing copy / empty state | CODE — journal/page.tsx:54-92 | NO | no | yes | Site content | P2 |
| Contact details (phone/email/address) | CODE ×4 — contact/page.tsx:120-133,249-264,273; SiteFooter.tsx:162-189; EnquirySection.tsx:122-130; structured-data.tsx:39-46 | NO | no | yes | Settings (site config) | P0 |
| Response-time promise ("2 business days") | CODE — contact/page.tsx:86,282; EnquirySection.tsx:121,218; checkout/page.tsx:38-41 | NO | no | yes | Settings | P1 |
| Empty states (shop/category/cart/journal) | CODE — shop:79-102, shop/[category]:254-280, CartDrawer:89, journal:81-92 | NO | no | yes | Site content | P2 |
| SEO titles/descriptions | CODE — per-page generateMetadata | NO | partial (category/product/article title) | yes (most) | SEO metadata (per content type) | P0 |
| OG title/description/image | CODE — root layout.tsx:51-71 (`/og-default.png`) | NO | yes only for articles | yes (rest) | SEO metadata | P0 |
| Sitemap | CODE-driven — sitemap.ts (categories, no products/articles) | NO | partial | yes | Generated | P1 |
| Business claims (30+ yrs, SCA 80+, KEPHIS/SGS/USDA, 100% Arabica, export regions) | CODE — home:151-194; HeroSlideshow:10; quality:17-38; export:17-22; Provenance.tsx:91-96; layout keywords | NO | no | yes | Client-approved content (editorial) | P0 |
| Site-wide images (heroes, provenance, origins, journal cards) | DB site_content | PARTIAL (URL paste for hero_image only) | yes | missing keys unwired | Media + Site content | P0 |
| Error/loading/404 states | CODE — error.tsx, not-found.tsx, loading.tsx | NO | no | yes | Presentation (keep code) | — |
| Labels/CTAs (Enquire, Request a sample, etc.) | CODE — ProductCard.tsx:80,87; ProductDetailClient.tsx:24-38; shop/[category]:238 etc. | NO | no | yes | Config/i18n (keep code where not business) | P2 |
| Checkout disclosures ("Prototype · No payment") | CODE — checkout/page.tsx:217-219; CartDrawer.tsx:135-137 | NO | no | yes | Config (keep code), documented launch gate | P2 |

---

## 4. HARDCODED CONTENT INVENTORY

Classification legend: **KEEP** = presentation/business-logic; **DB/CMS** = move to database; **SETTINGS** = site-settings module; **NAV** = navigation management; **PRODUCT/CATEGORY** = content-row field; **EDITORIAL** = editable page content.

### 4.1 Contact details (duplicated in 4 places — highest maintenance risk)
- `+254 722 479985`, `info@treadville.co.ke`, `Nairobi, Kenya`:
  - contact/page.tsx:120,123,127,130,251-264,273 — **SETTINGS**
  - SiteFooter.tsx:162-189 — **SETTINGS**
  - EnquirySection.tsx:122-130 — **SETTINGS**
  - structured-data.tsx:39-46 (JSON-LD) — **SETTINGS**

### 4.2 Business claims / certifications (client-approved, currently code)
- "30+ years": home page.tsx:152,155,194; HeroSlideshow.tsx:10; Provenance.tsx:95; about/page.tsx:117,120 — **EDITORIAL**
- "SCA 80+": home page.tsx:171-176; quality/page.tsx:19-21; Provenance.tsx:94 — **EDITORIAL**
- "KEPHIS / SGS / USDA": quality/page.tsx:24-36; export/page.tsx:122 — **EDITORIAL**
- Export destinations (Europe/Middle East/Asia Pacific/East Africa): export/page.tsx:18-21 — **EDITORIAL**
- "100% Arabica": Provenance.tsx:96 — **EDITORIAL**
- Terroir claims (Kirinyaga, Mt. Kenya, volcanic, glacial): HeroSlideshow.tsx:48; Provenance.tsx:93; origins/page.tsx:84-94,192-195; layout.tsx keywords:30-40 — **EDITORIAL**
- Legal name "Treadville Company Limited": SiteFooter.tsx:210; structured-data.tsx:29,68; layout.tsx:41-43 — **SETTINGS**

### 4.3 Editorial page bodies (entire pages are code)
- About: PILLARS array about/page.tsx:17-34; body 83-139 — **EDITORIAL**
- Quality: STANDARDS array quality/page.tsx:17-38; body 96-177 — **EDITORIAL**
- Origins: narrative origins/page.tsx:47-163, stats 192-195, placeholders 109,144 — **EDITORIAL**
- Export: capabilities 109-136, destinations 17-22 — **EDITORIAL**

### 4.4 Homepage hero + homepage sections
- H1 thesis + metadata: HeroSlideshow.tsx:6-13,74-78 — **EDITORIAL**
- Provenance stages: page.tsx:50-69 — **EDITORIAL**
- Stats: page.tsx:151-177 — **EDITORIAL**
- JournalPreview essays (static, unlinked to articles): page.tsx:73-100 — **DB/CMS (articles)**

### 4.5 Navigation
- Header IA links: SiteHeader.tsx:12-18 — **NAV**
- Footer columns/links: SiteFooter.tsx:45-197 — **NAV**
- Header category labels override: SiteHeader.tsx:132,213 (`t.nav[cat.slug] ?? cat.name`) — **NAV** (i18n acceptable as presentation; DB is fallback)
- Footer category links hardcoded: SiteFooter.tsx:58-80 — **NAV**

### 4.6 Category descriptors outside the DB
- CategoryDiscovery CATEGORY_META: CategoryDiscovery.tsx:13-35 — **DB/CMS (category.description)** + code fallback **KEEP**
- CategoryQuickNav (dead component): CategoryQuickNav.tsx:12-41 — **REMOVE (dead code)**
- shop/[category] empty-state dict: shop/[category]/page.tsx:254-280 — **DB/CMS overriding with code copy** (P1)

### 4.7 SEO / OG
- Root title/description/keywords/authors: layout.tsx:24-43 — **SETTINGS (SEO)**
- OG title/desc/image + twitter: layout.tsx:51-71 (image `/og-default.png`) — **SETTINGS (SEO)**
- Per-page titles/descriptions: about/quality/origins/export/shop/journal/contact `generateMetadata` — **SEO per content type**
- `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`: structured-data.tsx:4-7 — **SETTINGS**

### 4.8 Empty states / disclosures
- Shop empty state: shop/page.tsx:79-102 — **DB/CMS (P2)**
- Category empty states: shop/[category]/page.tsx:254-280 — **DB/CMS (P2)**
- Cart empty state: CartDrawer.tsx:89 — **KEEP (presentation)**
- Journal empty state: journal/page.tsx:81-92 — **DB/CMS (P2)**
- Product gallery "Image coming soon": ProductGallery.tsx:35 — **KEEP**
- ProductImage "Image pending": ProductImage.tsx:16 — **KEEP**
- Prototype disclosures: checkout/page.tsx:217-219, CartDrawer.tsx:135-137 — **KEEP (launch gate)**
- `origins` "Photography pending": origins/page.tsx:109,144 — **EDITORIAL**

### 4.9 CTAs, labels, stat claims
- "Enquire", "Request this lot", "Request a quote/sample", "Explore the collection", "Work with Treadville", "Speak to us", "See the catalogue", "Start a conversation", "Browse catalogue", "View all products": distributed across ProductCard.tsx:80,87; ProductDetailClient.tsx:24-38; HeroSlideshow.tsx:81-92; shop/[category]:238,306-315; about:204-215; quality:207-218; origins:232-242; export:222-233; checkout:51,77; CartDrawer:133; SiteHeader:129. — **KEEP (i18n/config; not business data; future i18n)**

### 4.10 Response-time promises
- "within two business days": contact/page.tsx:86,282; EnquirySection.tsx:121,218; checkout/page.tsx:38-41 — **SETTINGS** (verifiable operational promise)

### 4.11 Dead / demo code containing customer-facing strings
- NewsletterForm.tsx:15,25,50 — "TODO: Wire to Supabase / CRM. Currently non-functional." — **NOT RENDERED (remove or wire before launch)**
- CategoryQuickNav.tsx:12-41 — not rendered — **REMOVE**
- i18n dictionaries en/fr/de — many keys never consumed (hero, footer, shop.comingSoon, product.*, contact.prototypeDisclaimer, checkout.*) — **CLEANUP (P2)**

### 4.12 Contact form deep-link mismatch (pre-existing technical defect)
- Footer/product CTAs use `/contact?type=sample` and `/contact?type=quote` (SiteFooter.tsx:97,103; ProductDetailClient.tsx:31,38) but the contact select options are `General enquiry / Sample request / Export / wholesale / Press & media / Partnership` (contact/page.tsx:9-15) — pre-selection silently fails. — **FIX (P0, technical)**

### 4.13 Hardcoded image paths
- `/og-default.png`: layout.tsx:58,70 — **KEEP (replace asset)**
- `/icon.png`: structured-data.tsx:31,132 — **KEEP**
- `/admin/admin-auth.jpg`: AdminAuthShell.tsx:43-44 — **KEEP**
- Seed image paths `/images/category-*.jpg`, `/images/product-*.jpg`: seed.sql:6-35 — **STALE (public/images is empty); 6 live demo products still carry dead local paths (db-state.json)** — **FIX (P0)**

---

## 5. SITE CONTENT CMS AUDIT

**Schema** (schema.sql:97-102): `id uuid PK`, `key text UNIQUE NOT NULL`, `value text nullable`, `updated_at timestamptz NOT NULL`. RLS: public SELECT all rows (:292-295); admin ALL (:297-302).

**Current rows** (19, live snapshot): `hero_headline`, `hero_subheadline`, `hero_image`, `about_blurb`, `about_hero`, `quality_hero`, `export_hero`, `export_doc`, `provenance_image`, `journal_card_coffee/horticulture/tea`, `origins_body_kirinyaga`, `origins_body_terroir`, `homepage_hero`, `category_hero_coffee/tea/horticulture/grains`.

**Admin editing:** only 4 keys via Content module (content/page.tsx:15-40) + 6 `company_*` keys via Settings (SettingsClient.tsx:15-20) → `setSiteContentAction` (admin-actions.ts:276-301, audits + revalidates).

**Storefront consumption** (via `getSiteContent()` queries.ts:55-59 → `Record<key,value>`):
- Keys the storefront READS and falls back to code: `homepage_hero` (page.tsx:35), `provenance_*` (40-70), `journal_card_*` (81-97), `featured_*` (107-109), `story_*` (131-194), `about_blurb` (143), `category_hero_*` (shop/[category]:47), `about_hero` (about:38), `quality_hero` (quality:42), `export_hero` (export:26), `origins_body_*` (origins:19-20).
- Keys admin CAN edit that the storefront NEVER reads: `hero_headline`, `hero_subheadline`, `hero_image` (dead admin keys — the visible hero is HeroSlideshow code), `company_name/tagline/email/phone/location/description` (write-only settings — nothing reads them).
- Keys the storefront READS that admin CANNOT edit: 15 static + 4 dynamic (the entire hero/provenance/story/featured/journal-card/about/quality/export/origins/category-hero set).

**Assessment against the CMS checklist:**
1. Structured sections — **NO** (flat key/value strings).
2. Images — **partially** (URL strings only; only `hero_image` editable as raw URL textarea; no upload widget; site-content image keys unwired).
3. Ordering — **NO**.
4. Drafts/publishing — **NO**.
5. SEO — **NO**.
6. Page-specific content — **schema-level NO** (all editors edit global keys; keys are page-prefixed by convention only).
7. Future frontend redesign support — **weak** (any new redesign still must read `Record<key,value>` with no structure; short blurb keys OK, but multi-paragraph editorial pages cannot be represented).
8. Generic dump — **YES, it is becoming a dumping ground.** 19 heterogeneous keys (single strings, images, page heroes) in one column, no type, no schema, no validation, admin UI exposes only 4.

**Verdict:** the current `site_content` is insufficient as a professional CMS model. It is a compatible legacy migration target but should be **superseded** (or complemented) by a structured model: `content_sections` (page/section/type/order/status/images/SEO) for structured pages and heroes, `settings` (key/value with typed value + category) for global config, `navigation` (menus/items), and keeping `site_content` readable as legacy fallback. Recommended evolution is additive, not destructive — the storefront query layer `getSiteContent()` keeps working for backward-compatible keys while new structured reads are added.

---

## 6. DATA OWNERSHIP MODEL

| Class | Recommended source of truth | Editable by | Notes |
|---|---|---|---|
| Products (name/slug/category/description/status/featured/price) | `products` table | Eunice/Pascal via Admin | Already correct. Add product SEO fields (P1). |
| Product gallery | `products.gallery` (text[]) | Admin (ImageUpload) | Already correct. Add reorder (P1). |
| Product metadata | `product_metadata` EAV | Admin (ProductStudio per category) | Already correct; needs audit hook (F3) + structured per-category keys already in product-metadata.ts. |
| Categories (name/slug/desc/image/order/active) + category SEO | `categories` | Admin | Already correct; add SEO columns + change-delete safety (F1). |
| Editorial pages (About/Quality/Origins/Export/story sections) | New `content_sections` (structured page sections) | Eunice via Content module | Replace code-owned page bodies. |
| Homepage structure | New `content_sections` (ordered sections) + `settings` hero image | Eunice | Today code (pages.tsx + HeroSlideshow). |
| Journal/articles | `articles` | Eunice via Journal module | Already correct. |
| Media (images, alt, role, entity link, ordering) | Supabase Storage (objects) + `storage_files` ledger + entity columns | Admin via Media module | Extend upload widget to heroes/site images; enforce deletes. |
| Navigation (header/footer/menus) | New `navigation` (menus, items, order, visibility) | Eunice via Navigation module | Header categories stay DB; add IA/footer/menu items. |
| SEO (title/desc/OG/canonical/robots) | Per-entity SEO fields (products/categories/articles) + `settings` for global defaults | Eunice | Generate OG dynamically from DB per page. |
| Site settings (name, email, phone, address, socials, promises) | New `settings` (typed key/value, category "general/contact/seo") | Eunice | Kill the write-only `company_*` keys; wire footer/contact/JSON-LD from Settings. |
| Business claims / certifications | Code constant per page → MOVED to editorial content (client-approved copy) — stays in CMS once pages are CMS-backed. | Eunice (after client approval) | Do NOT put in DB until copy is approved; treat as editorial content class. |
| Presentation (colors/typography/spacing/animations) | **Code/design tokens (`src/lib/accents.ts`, Tailwind)** | Pascal | **NOT database-managed.** |
| Component labels/CTAs/empty-state microcopy | **Code/i18n** | Pascal | NOT database-managed. |
| Route graph / layout structure | **Code** | Pascal | NOT database-managed. |

---

## 7. DATABASE / SCHEMA AUDIT

### Tables (14 total)
schema.sql: `profiles`, `admin_roles`, `enquiries`, `audit_log`, `categories`, `products`, `site_content`, `articles`, `storage_files`, `product_metadata`. Migrations only: `customers`, `orders`, `order_items`, `order_communications`.

### Schema drift — confirmed
1. **schema.sql is stale (P0):** missing `customers`, `orders`, `order_items`, `order_communications`, sequence `order_reference_seq`, function `assign_order_reference` + trigger, functions `canonical_ke_phone`, `consistent_customer_name`, `create_order` (SECURITY DEFINER), and 10 migration-only indexes. A fresh DB built from schema.sql alone would lack the entire commerce layer.
2. **`articles` admin policy conflict (P1):** schema.sql:313-318 uses JWT claim; migration 20260907_0001:91-107 drops/recreates it using a `admin_roles` subquery (the only policy in the codebase doing so; introduces the self-referential recursion risk the JWT design avoided).
3. **Redundant indexes (P2):** `articles_published_at_idx` defined in both schema.sql:123 and migration 0001:65.

### Indexes / constraints gaps (P1)
- `products.category_id` FK has **no index** — the most-used join column.
- `products.status`, `products.featured`, `categories.active`, `enquiries.status/created_at`, `audit_log.created_at` — no indexes despite being RLS/order/where predicates.
- Uniqueness present: `categories.slug`, `products.slug`, `articles.slug`, `site_content.key`, `product_metadata(product_id,key)`, `orders.reference_number`.

### Relationship concerns
- `products.category_id → categories` **ON DELETE CASCADE (P0):** deleting a category silently deletes every product + product_metadata. Admin delete does not guard (admin-actions.ts:257-270).
- `order_items.product_id → products` **ON DELETE RESTRICT (P0):** `deleteProductAction` will surface a raw DB error for any ordered product (admin-actions.ts:149-164) — needs friendly handling (soft-delete/archived status instead).
- `orders.customer_id → customers` RESTRICT; `admin_roles.user_id → profiles` CASCADE; `profiles.id → auth.users` CASCADE — sound.

### Fields carrying multiple meanings / nullable concerns
- `products.stock` integer default 0 — **never used** (no inventory logic); misleading.
- `products.price` nullable — intentional (quote-first), but the storefront never displays price; quote-model decision should be acknowledged in UI copy (it is).
- `products.gallery` not NOT NULL (default '{}') — fine, but unindexed array (no array usage querying).
- `site_content.value` single column carries strings AND image URLs — mixed meaning (see §5).
- `storage_files` is written but never reconciled/deleted against actual objects (orphans).

### Missing structures (P0/P1)
- No `navigation`/`menus` table.
- No `settings` table.
- No `content_sections` (page/section) table for editorial content.
- No per-entity SEO columns (products/categories already partially derive; no OG fields).
- No `articles` ordering by published_at in list (queries.ts:76 orders by `updated_at` — editorial oddity, P2).

---

## 8. PRODUCT / CATEGORY ARCHITECTURE

**Assessment of the future professional catalogue workflow** — mostly GREEN, targeted gaps:

| Capability | Supported today? | Evidence |
|---|---|---|
| Create product | YES | createProductAction admin-actions.ts:27-73 |
| Edit product | YES | updateProductAction :75-129 |
| Save draft / publish / unpublish | YES | status field; setProductStatusAction :131-147 |
| Delete | PARTIAL | deleteProductAction :149-164 — fails rawly when order history exists (RESTRICT FK) |
| Duplicate | NO | no action (P2) |
| Upload primary image | YES | ImageUpload widget (ProductStudio :273-277) |
| Multiple gallery images | YES | gallery array (ProductStudio :321-323) |
| Reorder gallery images | NO | P1 — no ordering controls (text[] appended) |
| Replace an existing image | PARTIAL | widget re-uploads but **old storage object is orphaned** (no delete) |
| Remove an image | PARTIAL | local onRemove only; storage object + storage_files row not cleaned; `deleteImageAction` exists but is dead code (admin-actions.ts:881-908, no importers) |
| Category-specific metadata | YES | product-metadata.ts per-slug schema + product_metadata EAV (but P0: no audit hook for metadata writes) |
| Preview before publishing | NO | P1 — no preview route for drafts (storefront rejects drafts server-side, product/[slug]:53,75) |
| Change category | YES | category_id field in ProductStudio |
| Change slug safely | PARTIAL | slug auto-derived on create; update allows edits but no uniqueness-clean failure handling documented (P2) |
| Change SEO metadata | NO | P1 — no SEO columns on products |
| Mark featured | YES | featured boolean (ProductStudio) |
| Optional pricing | YES (nullable) | price field; quote-first model documented in UI |
| Availability / inventory without redesign | PARTIAL | `stock` int exists but is unused/misleading; recommend `availability_status`/`backorder` enum or rename — model can support, needs definition (P1) |

**Conclusion:** the product/category data layer is CMS-ready for content workflow. The gaps are **safety** (delete cascade/restrict handling), **media hygiene** (orphan storage), **metadata audit**, **SEO**, and **preview**. No restructuring needed.

---

## 9. MEDIA ARCHITECTURE

### Chain map
```
Admin form (ImageUpload.tsx)
  → createImageUploadAction(file name/type/size)      admin-actions.ts:799
  → Signed PUT to Storage bucket "site-images" (+x-upsert)  admin-actions.ts:826
  → recordImageUploadAction(url)                       admin-actions.ts:848  (writes storage_files + audit)
  → onUpload(publicUrl) → fd.set("image_url"|gallery|cover_image_url, url)
  → DB column → queries.ts → <img> in storefront
```
**Widget consumers:** ProductStudio (primary+gallery), CategoriesClient (image_url), ArticleForm (cover_image_url). ✅ working chain.

### Where the chain breaks down
1. **Hero / site-content images have NO upload path (P0).** Content module `hero_image` is a raw-URL textarea (content/page.tsx:29-33; ContentClient pure textareas). The other 15 site-content image keys have no admin UI at all.
2. **Orphan accumulation (P0).** Remove/replace never deletes storage objects; `deleteImageAction` (admin-actions.ts:881) is never imported; product/category/article deletes never touch storage. `storage_files` diverges from reality.
3. **Dead local paths (P0).** `public/images/` is empty; 6 live demo products reference `/images/product-placeholder-*.jpg`; seed.sql paths are dead. `hero_image` site_content still points to `/images/hero-coffee.jpg` (local, missing).
4. **No branded fallback on heroes (P1).** HeroSlideshow.tsx:24 plain `<img>` no `onError`; CategoryImageLayer.tsx:20 returns null; ProductImage.tsx has the good fallback pattern ("Image pending" + CategoryMark).
5. **OG image fixed (P0).** All pages except journal articles share `/og-default.png` (layout.tsx:58,70); product/category OG never set to their image.
6. **Bucket naming inconsistency (P2).** Code uses `site-images` (admin-actions.ts:797); Photography/MANIFEST.md:42 says `treadville-media`. No env key for bucket.
7. **next/image unavailable (P2).** No `images.remotePatterns` for the Supabase origin; raw `<img>` used everywhere.

### Recommended ownership model
- **Object store:** Supabase Storage bucket `site-images` (canonical name; align docs).
- **Ledger:** `storage_files` becomes the media registry (path, alt, width/height, entity link, uploader) reconciled on delete.
- **References:** keep `image_url`/`gallery`/`cover_image_url`/site-image keys as the entity-side binding; add a top-level **Media** admin module (gallery picker + reuse + delete with object+ledger cleanup) and wire hero/site-content uploads through it.
- **Alt text:** add alt column to `storage_files` + surface in UI.

---

## 10. ADMIN CAPABILITY MATRIX

| Module | Exists | Functional | DB-backed | Safe | Professional | Missing |
|---|---|---|---|---|---|---|
| Dashboard | YES | YES | yes | PARTIAL | PARTIAL | OWNER can't see audit panel (SYSTEM_ADMIN-only SELECT); counts fine |
| Categories | YES | YES | yes | **NO (F1 cascade delete)** | PARTIAL | delete-guard, orphan image cleanup, SEO, image replace writes storage_files? (no) |
| Products | YES | YES | yes | PARTIAL (F9 raw error) | PARTIAL | metadata audit (F3), media cleanup, SEO, preview, gallery reorder, duplicate |
| Content | YES | YES | yes | PARTIAL (unrestricted key input) | **NO (dead keys)** | wired keys (hero/sections heroes), upload widget, sections/pages model |
| Media | **NO** | — | partial (storage_files) | — | — | module missing; image deletes on all entities |
| Navigation | **NO** | — | — | — | — | no menus table/module |
| Settings | YES | YES | yes | PARTIAL | **NO (write-only)** | company_* keys never read; account tab save blocked by RLS (F4) |
| Journal | YES | YES | yes | YES | YES | none critical (sanitized, audited, publish flow complete) |
| Orders | YES | YES | yes | YES | YES | email notification missing; `delivery_location` not collected |
| Enquiries | YES | YES | yes | YES | YES | none critical |
| Users/Roles | YES | YES | yes | YES | PARTIAL | two sources of truth (JWT claim + admin_roles) |
| Integrations | STUB | NO | no | — | NO | cosmetic "Not set" display only |

---

## 11. FRONTEND INDEPENDENCE ASSESSMENT

**Q:** Can the storefront be completely redesigned without changing the underlying business data model?

**Estimate: ≈80% independent today, ~95% after the CMS slices.**

Already decoupled (healthy):
- Products/categories/articles/metadata flow through a single query layer (`src/lib/queries.ts`); pages receive domain data, not presentation.
- RLS guarantees public reads are published/active only — a redesign consuming the same queries stays correct.
- Image references are URL strings (mostly storage) — portable to any layout change.
- Product pages can be redesigned without product storage changes (same query, new presentation).
- JSON-LD is generated from data.

Acceptable coupling (fine to keep):
- Design tokens (accents.ts, Tailwind) — presentation class intended to live in code.
- Component labels/CTAs/empty-state microcopy — presentation.

Undesirable coupling that must be fixed before/with the redesign (blocking own-none but degrading):
- Editorial page bodies live inside `.tsx` (about/quality/origins/export) → a redesign cannot restructure/relocate editorial copy without code edits. Move to CMS. **P0**
- Homepage section structure (Provenance stages, JournalPreview static essays, stats) is code. **P0**
- OG = fixed global image — any redesign changes share messaging but still wrong metadata. **P0**
- Footer/contact values duplicated in 4+ code files → redesign cannot reuse contact data. **P0**
- `getFeaturedProducts` has no ORDER BY (non-deterministic "curated" order). **P1**

**Remaining coupling after CMS phase:** route graph/layout structure, presentation, labels, commerce-specific UI (cart/checkout), and the design itself — all intentionally code. There is **no dependency on the frontend's specific field shapes** because data is served as rows and rendered by the new presentation layer.

---

## 12. SECURITY / GOVERNANCE ASSESSMENT

**Risks introduced by making more content editable:**

| Risk | Current posture | New posture needed | Priority |
|---|---|---|---|
| Stored XSS via rich text | Articles sanitized DOMPurify on write + render (sanitize.ts:28-57; admin-actions.ts:657-658,712-714). **Site_content / settings / product/category/description/slug NOT sanitized** (plain text fields; only editors write them, but if editorial pages become CMS-rich-text, sanitize must extend there) | Apply `sanitizeArticleHtml`-grade sanitization to any rich-text CMS field; keep plain text/URL fields validated (URL allowlist: http/https + own storage origin) | P0 |
| Malicious/catastrophic SVGs | Upload accept `image/jpeg,image/png,image/webp` (ImageUpload.tsx:158); server MIME allowlist + 10 MB (admin-actions.ts:790-811) — **SVG already excluded** ✅ | Maintain allowlist when extending uploads; block HTML/XML mime types; add magic-byte check | P0 |
| Arbitrary file upload | Signed PUT via server action with server-side type/size checks ✅ | Add content-sniffing bytes + dimension limits for images; enforce bucket RLS in SQL (currently dashboard-only) | P1 |
| Oversized uploads | 10 MB cap server-side ✅ | Keep cap; add per-user quota in media module | P2 |
| Unsafe image URLs (paste) | `hero_image` URL textarea accepts any string — a pasted `javascript:` or external tracker URL gets stored and rendered into `<img>` | Validate URL scheme + host allowlist at write time; prefer uploads over pastes | P0 |
| Unauthorized publishing | Role gating on every admin action (requireAdmin/auth.ts:48-54) + RLS JWT-role checks ✅ | Keep; extend to content_sections/navigation/settings modules with same pattern | — |
| Unauthorized deletion | Category delete cascade (F1) and product delete RESTRICT error (F9) | Guard category delete (block if products exist or soft-delete), friendly product archive; require confirmations; audit all deletes | P0 |
| Privilege escalation | Roles honored from JWT (auth.ts:24); invite/role change SYSTEM_ADMIN-only (admin-actions.ts:533,581,607); self-removal guard :608. **Two sources of truth (JWT vs admin_roles)** — only migration-0001 articles policy reads admin_roles | Reconcile to single source (JWT) or enforce sync; document | P1 |
| Auditability | `audit_log` service-role write; 22 audit actions; **gaps:** `upsertProductMetadata` (F3), `session_created/destroyed`, delete of metadata. OWNER cannot read audit (SYSTEM_ADMIN only) | Audit all mutations incl. metadata + login; decide OWNER read scope | P1 |
| Public read of site_content | Anon SELECT **on all rows** (:292-295) — future settings (email/phone) must NOT go here; settings table should be admin-only or filtered | Keep settings/navigation out of public-readable tables; scope public content reads to published sections only | P0 |
| CSRF (Server Actions) | Next Server Actions carry built-in origin checks ✅ | None | — |
| Content moderation / rollback | None — edits overwrite values | Add `updated_by` + keep simple audit trail per content row; consider versioning only if justified (audit_log details suffice for P1) | P1 |

---

## 13. CMS ARCHITECTURE RECOMMENDATION

**Default proven:** Next.js + Supabase + custom Admin/CMS. Evidence supports this — the mutation/auth/audit/RLS skeleton is already professional; no external CMS is warranted. Smallest professional architecture:

### Data layer (additive; do not break existing)
1. **`content_sections`** table — structured editorial blocks:
   `id, key (unique, page-scoped), page, section, title, body, image_url, image_alt, sort_order, status ('draft'/'published'), seo_title, seo_description, og_image, updated_at, updated_by`.
   Seed from current hardcoded copy so storefront renders DB first with code fallback (same "DB preferred, code fallback" pattern already in pages.tsx).
2. **`settings`** table — typed global config:
   `key unique, value jsonb, category ('general','contact','social','seo','operational'), updated_at, updated_by`, admin-only RLS, read by storefront via server component. Kill write-only `company_*`; wire footer/contact/JSON-LD.
3. **`navigation`** table — menus:
   `id, menu ('header_primary','header_shop','footer','mobile'), label, href, sort_order, active, parent_id null`. Header categories remain DB; IA/footer/menu items come from navigation.
4. **Per-entity SEO columns** on `products` and `categories` (`seo_title`, `seo_description`, `og_image` nullable) — dynamic OG via existing `journal/[slug]` pattern.
5. **Media module** over existing `storage_files` (`alt`, `entity_type`, `entity_id`, reconciled deletes) to serve heroes, site images, and pickers.

### Query/presentation
- One extended `queries.ts`: `getContentSections()`, `getSettings()`, `getNavigation(menu)`, per-page `getPageSections(page)`.
- Storefront pages consume DB-first + code fallback (preserves the redesign's freedom).
- Admin revalidates the affected paths (already does for site_content — extend to new tables).

### Admin (additive to existing pattern)
- Extend **Content** into a real page/section editor (per page: hero, sections, images, publish state) using the same server-action + audit pattern.
- Add **Media** (upload, alt, reuse, delete-with-cleanup).
- Add **Navigation** (menu items).
- Extend **Settings** (typed, readable by storefront; fix the Account-save RLS bug F4).
- Keep Orders/Enquiries/Users as-is.

### Explicit non-goals
- No payments, no customers accounts, no multi-currency, no versioning, no workflows. The quote-first order model stays.

---

## 14. RECOMMENDED FUTURE ADMIN STRUCTURE

| Module | Justification |
|---|---|
| Dashboard | exists; fix OWNER audit visibility |
| Products | exists; add SEO, metadata audit, safe delete/archive, gallery reorder, preview |
| Categories | exists; add delete-guard, SEO, image cleanup |
| **Media** | **new** — the single most enabling module for Eunice (upload/change any site image without code) |
| **Content** | evolve — page/section editor with structured fields + images + publish state |
| **Navigation** | **new** — header/footer/menu management |
| **Settings** | evolve — typed global values wired to footer/contact/JSON-LD/OG |
| Journal | exists (strong); keep |
| Enquiries | exists (strong); keep |
| Orders | exists (strong); add email notification (P1) |
| Users/Roles | exists; reconcile dual source of truth |
| SEO | fold into per-entity fields + Settings (not a separate module) |
| Integrations | exists as stub; keep stub, no build now |

---

## 15. IMPLEMENTATION SLICES (proposal only — NOT implemented)

1. **Slice 14B — Product/Category operations hardening** (F1 delete-guard, F9 friendly delete/archive, F3 metadata audit, SEO columns, gallery reorder, preview drafts).
2. **Slice 14C — Media module** (upload/alt/reuse/delete with storage + ledger cleanup; wire widget into heroes/site-content; fix dead local paths; hero image fallbacks).
3. **Slice 14D — Content sections CMS** (content_sections table, page editor for About/Quality/Origins/Export + homepage sections, DB-first + code fallback, publish state, sanitized rich text).
4. **Slice 14E — Settings + Navigation + SEO/OG** (settings table wired to footer/contact/JSON-LD; navigation menus; per-page dynamic OG; per-entity SEO).
5. **Slice 14F — Editorial content load + Eunice Test** (seed approved copy/imagery; full end-to-end verification incl. live database).

Each slice independently verifiable; Slice 13/14A deliver the audit baseline; this slice confirms no writes.

---

## 16. P0 / P1 / P2

### P0 — CMS foundation
1. Fix category delete cascade silent data loss (F1).
2. Fix friendly delete/archive for ordered products (F9).
3. Add audit to product_metadata writes (F3).
4. Wire site-content keys so what Admin edits is what the storefront renders (or deprecate dead keys `hero_headline/hero_subheadline/hero_image`, wire real ones).
5. Build Media module / wire hero + site-content image uploads; stop orphan accumulation; delete dead local image references (seed + 6 demo products + `hero_image`).
6. Content sections model for editorial pages (About/Quality/Origins/Export + homepage) so copy leaves `.tsx`.
7. Settings table wired to footer/contact/JSON-LD replacing 4x-duplicated contact data; fix Account-save RLS bug (F4).
8. Per-page dynamic OG/SEO (products/categories at minimum; global defaults from Settings).
9. Contact form `?type=` deep-link mismatch fix.
10. URL validation on any pasted site-image value; sanitize any new rich-text CMS field.

### P1 — Professional operations
11. Safe slug editing + friendly uniqueness errors; product preview before publish; gallery reorder.
12. `storage_files` ledger reconciliation + alt text; added indexes (products.category_id, products.status, products.featured, categories.active, enquiries.status/created_at, audit_log.created_at).
13. Resolve schema.sql vs migrations drift (regenerate canonical or document migration-plus-schema as source of truth); reconcile articles policy conflict; single role source of truth.
14. Login/session + metadata audit completeness; decide OWNER audit read scope.
15. Email notification for orders (enquiry path already has Resend).
16. Deterministic featured ordering (ORDER BY) + pagination for large catalogues later.
17. Collect `delivery_location` in checkout.

### P2 — Future
18. Product duplicate, availability/inventory enum, quotes in orders, article ordering by published_at, i18n cleanup, dead-code removal (NewsletterForm, CategoryQuickNav, CategoryImage), `next/image` adoption (remotePatterns), starter: sitemap product/journal URLs.

---

## 17. THE "EUNICE TEST"

### Scenario A — 20 new photos, 6 new products tomorrow
| Step | Can she today? | Evidence |
|---|---|---|
| 1. Upload new photos | YES (to product/category/article) | ImageUpload chain works |
| 2. Create products | YES | createProductAction |
| 3. Assign categories | YES | category select in ProductStudio |
| 4. Assign images | YES | ImageUpload → image_url/gallery |
| 5. Enter metadata | YES | per-category metadata form (though untracked — F3) |
| 6. Preview before publishing | NO | no draft preview route (server rejects drafts) |
| 7. Publish | YES | setProductStatusAction |
| 8. Replace an image later | PARTIAL | re-upload works but old object orphaned |
| 9. Unpublish | YES | setProductStatusAction |
| 10. All without calling Pascal | **ALMOST** — steps 6 and 8-maybe functionality work; she never touches code. Vertical-slice gap: her new photos must be pre-uploaded by the ImageUpload widget (works), but if she wants a hero/site-wide image, that's step B | |

### Scenario B — replace the homepage hero image
| Step | Can she today? |
|---|---|
| 1. Upload new hero image | **NO** — hero is a URL-paste field in Content (content/page.tsx:29-33), no widget. |
| 2. Save it so the homepage uses it | **PARTIAL/NO** — Admin edits `hero_image` (dead key) but the storefront reads `homepage_hero` (page.tsx:35). Changing the hero today requires a developer or DB script. |

**Verdict: NO — requires Pascal.**

### Scenario C — change the About page
| Step | Can she today? |
|---|---|
| 1. Change hero/headline/body | **NO** — About page is code (about/page.tsx:8-139). |
| 2. Replace its image | **NO** — `about_hero` not exposed in any admin editor. |
| 3. Publish revision (client-approved) | **NO** — no CMS for editorial pages. |

**Verdict: NO — requires Pascal.**

---

## 18. FINAL ARCHITECTURAL VERDICT

# AMBER — Architecture is sound but requires targeted changes before CMS implementation.

**Why not GREEN:** the mutation/auth/audit/RLS foundations are genuinely strong and the product/category/article data layer is already CMS-usable, but the content system is *inert* (editable keys the storefront ignores, code-owned editorial pages, no media-for-heroes, no navigation/settings, no per-page SEO) and there is production-blocking schema drift and a cascade/restrict safety gap. **Why not RED:** there is no need to restructure — the recommended CMS is additive (content_sections, settings, navigation, media-over-storage_files, per-entity SEO) on top of the existing proven skeleton; the query layer already separates data from presentation; RLS/audit patterns are reusable as-is.

---

## VERIFICATION & SAFETY RECORD
- **Files changed by this slice:** none.
- **Files already dirty before this slice (pre-existing, untouched):** the 21 modified + untracked set recorded at slice start (next.config.ts, package*, storefront/checkout, journal/[slug], two layouts, login, CartContext, CartDrawer, AdminSidebar, ArticleForm, CategoriesClient, ImageUpload, ProductStudio, admin-actions.ts, audit-utils, enquiry-actions, structured-data, types.ts, schema.sql; untracked worktree incl. docs/Photography/db-*.js/supabase migrations/etc.).
- **Files intentionally left untouched:** everything.
- **Live database:** no reads available (direct host IPv6-only); no writes performed. Live-state assertions rely on the in-repo captured snapshot `db-state.json` (anon==svc=8 products, all draft; 4 active categories; 19 site_content rows; 1 public bucket `site-images`; 11 storage objects, all 200). Supersedes the unresolved Slice 13 product-count contradiction (which this audit resolves as: 8 products, all draft — anon and svc agree in the captured state).
- **Verification performed:** full storefront + components + admin + lib + migrations + schema + seed inspection; all four audit agents traced mutation chains to file:line; direct spot-checks (content page fields, upload/delete actions, deleteImageAction dead-code, force-dynamic); live-snapshot cross-check.
- **Temp artifacts:** `%TEMP%\opencode\pgtest\slice14a-live.js` (failed connection script, cleaned post-audit).

## STOP — no implementation. Await explicit instruction for Slice 14B.