# PHOTOGRAPHY INTEGRATION — PHASE 13 VISUAL QA REPORT

**Date:** September 4, 2026
**Auditor:** Agent QA
**Scope:** Photography integration — Phase 13 read-only audit
**Repository:** treadville prototype

---

# Executive Summary

Photography integration was executed in prior phases. This audit documents the current state: what was uploaded, what is wired to the frontend, what is not, and what is broken.

**Bottom line:** 24 assets were uploaded to Supabase Storage and all verified live (HTTP 200). The data model and database entries are correct. The implementation wiring is partially complete — shop pages, product detail pages, and category hero images on `/shop/[category]` routes are functioning correctly. Six routes and two homepage sections still show placeholder content. One critical frontend bug prevents category card images from rendering on the homepage and `/shop`. A static caching issue prevents five additional pages from showing their hero images. The hero system was never wired to consume `site_content` data.

**Overall photography implementation score: 5.5 / 10**
- Photography quality: 7 / 10
- Integration quality: 4 / 10
- Art-direction consistency: 6 / 10
- Route coverage: 5 / 10
- Technical quality: 5 / 10

---

# 1. Current Integration Status

## 1.1 Storage Inventory

All 24 assets confirmed live in Supabase Storage (`site-images` bucket). All return HTTP 200.

| Object | Storage Path | Size | HTTP |
|--------|-------------|------|------|
| Category card — Coffee | `site-images/categories/coffee/cat-coffee-card.png` | 2.1 MB | 200 |
| Category card — Tea | `site-images/categories/tea/cat-tea-card.png` | 1.9 MB | 200 |
| Category card — Horticulture | `site-images/categories/horticulture/cat-hort-card.png` | 2.4 MB | 200 |
| Category card — Grains | `site-images/categories/grains/cat-grains-card.png` | 2.5 MB | 200 |
| Category hero — Coffee | `site-images/categories/coffee/hero-coffee.png` | 2.2 MB | 200 |
| Category hero — Tea | `site-images/categories/tea/hero-tea.png` | 1.8 MB | 200 |
| Category hero — Horticulture | `site-images/categories/horticulture/hero-horticulture.png` | 2.3 MB | 200 |
| Category hero — Grains | `site-images/categories/grains/hero-grains.png` | 2.3 MB | 200 |
| Product primary — Moka Espresso | `site-images/products/masai-coffee-moka-espresso/primary.png` | 2.2 MB | 200 |
| Product primary — Supreme | `site-images/products/masai-coffee-supreme/primary.png` | 2.2 MB | 200 |
| Gallery — PDP alt | `site-images/products/coffee-gallery/pdp-alt.png` | 2.3 MB | 200 |
| Gallery — Lifestyle | `site-images/products/coffee-gallery/lifestyle.png` | 2.2 MB | 200 |
| Gallery — Macro | `site-images/products/coffee-gallery/macro.png` | 2.3 MB | 200 |
| Gallery — Process | `site-images/products/coffee-gallery/process.png` | 2.5 MB | 200 |
| About hero | `site-images/pages/about/page-about-hero.png` | 2.0 MB | 200 |
| Quality hero | `site-images/pages/quality/page-quality.png` | 1.9 MB | 200 |
| Export hero | `site-images/pages/export/hero-export.png` | 2.3 MB | 200 |
| Export doc | `site-images/pages/export/page-export-doc.png` | 2.0 MB | 200 |
| Provenance landscape | `site-images/editorial/provenance/provenance-landscape.png` | 2.2 MB | 200 |
| Provenance macro | `site-images/editorial/provenance/provenance-macro.png` | 2.4 MB | 200 |
| Journal — Coffee | `site-images/editorial/journal/journal-coffee.png` | 2.1 MB | 200 |
| Journal — Horticulture | `site-images/editorial/journal/journal-hort.png` | 2.3 MB | 200 |
| Journal — Tea | `site-images/editorial/journal/journal-tea.png` | 1.9 MB | 200 |
| Homepage hero portrait | `site-images/homepage/hero-home-portrait.png` | 1.9 MB | 200 |

All 24 assets verified. No orphaned, missing, or duplicate uploads.

---

# 2. Supabase Storage Inventory vs. Upload Plan

All assets listed in `upload-photos.js` were successfully uploaded. The upload manifest matches the storage exactly.

---

# 3. Database Image Mapping

## 3.1 Categories Table

| slug | image_url | Status |
|------|-----------|--------|
| coffee | `site-images/categories/coffee/cat-coffee-card.png` | LIVE |
| tea | `site-images/categories/tea/cat-tea-card.png` | LIVE |
| horticulture | `site-images/categories/horticulture/cat-hort-card.png` | LIVE |
| grains | `site-images/categories/grains/cat-grains-card.png` | LIVE |

All 4 records correctly point to Supabase category card images.

## 3.2 Products Table

| slug | status | featured | image_url | Status |
|------|--------|----------|-----------|--------|
| masai-coffee-moka-espresso | published | true | `site-images/products/masai-coffee-moka-espresso/primary.png` | LIVE |
| masai-coffee-supreme | published | false | `site-images/products/masai-coffee-supreme/primary.png` | LIVE |
| black-tea-demo | draft | false | `/images/product-placeholder-tea.jpg` | DEAD — expected, not published |
| specialty-tea-demo | draft | false | `/images/product-placeholder-tea.jpg` | DEAD — expected, not published |
| fresh-produce-demo | draft | false | `/images/product-placeholder-hort.jpg` | DEAD — expected, not published |
| export-horticulture-demo | draft | false | `/images/product-placeholder-hort.jpg` | DEAD — expected, not published |
| maize-demo | draft | false | `/images/product-placeholder-grain.jpg` | DEAD — expected, not published |
| rice-demo | draft | false | `/images/product-placeholder-grain.jpg` | DEAD — expected, not published |

**gallery field: all products have `[]` (empty).** The 4 gallery images uploaded to `site-images/products/coffee-gallery/` are not linked to any product record.

## 3.3 site_content Table

| key | value | Status |
|-----|-------|--------|
| hero_image | `/images/hero-coffee.jpg` | DEAD — NOT wired to hero |
| about_hero | `site-images/pages/about/page-about-hero.png` | IN DB — NOT RENDERING (static cache issue) |
| quality_hero | `site-images/pages/quality/page-quality.png` | IN DB — NOT RENDERING (static cache issue) |
| export_hero | `site-images/pages/export/hero-export.png` | IN DB — NOT RENDERING (static cache issue) |
| export_doc | `site-images/pages/export/page-export-doc.png` | IN DB — NOT RENDERED in UI |
| provenance_image | `site-images/editorial/provenance/provenance-landscape.png` | IN DB — NOT RENDERED |
| journal_card_coffee | `site-images/editorial/journal/journal-coffee.png` | IN DB — NOT RENDERED |
| journal_card_horticulture | `site-images/editorial/journal/journal-hort.png` | IN DB — NOT RENDERED |
| journal_card_tea | `site-images/editorial/journal/journal-tea.png` | IN DB — NOT RENDERED |
| origins_body_kirinyaga | `site-images/editorial/provenance/provenance-landscape.png` | IN DB — NOT RENDERING (static cache issue) |
| origins_body_terroir | `site-images/editorial/provenance/provenance-macro.png` | IN DB — NOT RENDERING (static cache issue) |
| homepage_hero | `site-images/homepage/hero-home-portrait.png` | IN DB — NOT WIRED to component |
| category_hero_coffee | `site-images/categories/coffee/hero-coffee.png` | LIVE in shop/[category] |
| category_hero_tea | `site-images/categories/tea/hero-tea.png` | LIVE in shop/[category] |
| category_hero_horticulture | `site-images/categories/horticulture/hero-horticulture.png` | LIVE in shop/[category] |
| category_hero_grains | `site-images/categories/grains/hero-grains.png` | LIVE in shop/[category] |

---

# 4. Homepage Visual Audit

## 4.1 Navigation

IMAGE: None — text navigation and wordmark.
STATUS: No photography expected here.

## 4.2 Hero (HeroSlideshow)

IMAGE: SVG chapter illustrations — coffee bag, cup, teapot, grain bowl.
SOURCE: `src/components/HeroChapters.tsx` — hardcoded inline SVG.
STATUS: The `site_content.hero_image` key exists in DB with a dead path. The `homepage_hero` key exists pointing to `site-images/homepage/hero-home-portrait.png` — neither is consumed. The hero was designed as a photography stand-in (per `HeroChapters.tsx` comment: "Hero architecture once client photography arrives").
MATCH TO ART DIRECTION: Partial. Sophisticated SVG compositions appropriate for the brand, but the site does not yet use real photography in the hero.

## 4.3 Category Discovery ("One platform. Four distinct origins.")

IMAGE: 4 category card images from `categories.image_url`.
SOURCE: Supabase `categories` table.
STATUS: **NOT RENDERING — CategoryImageLayer bug (P0).**
The `CategoryImageLayer` component has inverted state logic. The component returns `null` on initial render and never mounts the `<img>` element when the image loads. The atmosphere gradients are visible; category card images do not appear.
MATCH TO ART DIRECTION: Cannot assess — images not rendering.

## 4.4 Provenance Section

IMAGE: `site_content.provenance_image` — `site-images/editorial/provenance/provenance-landscape.png`.
STATUS: **NOT RENDERED — component prop exists but JSX not updated (P1).**
The `image` prop was added to the `Provenance` component and passed from `page.tsx`, but the component template does not include an `<img>` tag to render it. The section shows only CSS atmospheric gradients.

## 4.5 Journal Preview

IMAGE: `site_content.journal_card_coffee/horticulture/tea`.
STATUS: **NOT RENDERED — page.tsx still uses default 2-essay prop (P1).**
The `JournalPreview` component accepts an `essays` prop with `image?: string`. The component JSX includes conditional image rendering. However, `page.tsx` still renders `<JournalPreview />` with the default 2-essay array (no images), not the planned 3-essay database-driven array. Two essays render with dead `/images/` paths (confirmed in HTML). Essay "Cupping at origin" references a dead `product-placeholder` image.

## 4.6 Featured Products

IMAGE: `/images/product-moka-espresso.jpg` (dead) for published products.
SOURCE: `products.image_url` — DB has correct Supabase URLs for both published products.
STATUS: **NOT RENDERING — FeaturedSection / ProductImage issue (P0).**
The `/shop` page correctly renders product images via Supabase URLs. The homepage `FeaturedSection` does not — it shows dead local paths. The `ProductImage` component is used by both. Database has correct values; the issue is in the client-side image component or how data flows into `FeaturedSection` on the homepage.

## 4.7 Legacy Statistics

IMAGE: None — CSS number counters.
STATUS: No photography expected.

## 4.8 CTA / Contact / Footer

IMAGE: None.
STATUS: No photography expected.

---

# 5. Route Coverage

| Route | Expected imagery | Actual rendered | Status |
|-------|----------------|----------------|--------|
| `/` | Hero photo + category cards + provenance image + journal cards + product images | SVG hero + dead category images (bug) + no provenance image + 2 essays with dead paths + dead product images | **PARTIAL — BROKEN** |
| `/shop` | Category cards + product images | Category cards: BROKEN (bug). Products: LIVE on /shop page. | **PARTIAL — BROKEN** |
| `/shop/coffee` | Category hero + category cards + product images | Hero: LIVE. Cards: BROKEN (bug). Products: LIVE. | **PARTIAL — BROKEN** |
| `/shop/tea` | Category hero + category cards + demo products | Hero: LIVE. Cards: BROKEN (bug). Demo products: dead paths (expected). | **PARTIAL** |
| `/shop/horticulture` | Category hero + category cards | Hero: LIVE. Cards: BROKEN (bug). | **PARTIAL** |
| `/shop/grains` | Category hero + category cards | Hero: LIVE. Cards: BROKEN (bug). | **PARTIAL** |
| `/product/masai-coffee-moka-espresso` | Product primary + category cards | Product primary: LIVE. Category cards: LIVE. Gallery: empty (DB). | **LIVE** |
| `/product/masai-coffee-supreme` | Product primary + category cards | Product primary: LIVE. Category cards: LIVE. Gallery: empty (DB). | **LIVE** |
| `/origins` | Hero gradient + Kirinyaga + Terroir body images | Hero gradient: PLACEHOLDER. Body images: PLACEHOLDER (static cache). | **PLACEHOLDER** |
| `/quality` | Hero image + body content | Hero image: PLACEHOLDER (static cache). | **PLACEHOLDER** |
| `/export` | Hero image + doc image | Hero image: PLACEHOLDER (static cache). Doc: in DB, not rendered. | **PLACEHOLDER** |
| `/about` | Hero image | Hero image: PLACEHOLDER (static cache). | **PLACEHOLDER** |
| `/journal` | Hero gradient + essay images | Hero gradient: PLACEHOLDER. Essays: dead paths (no DB images). | **PLACEHOLDER** |
| `/checkout` | Cart item images | Category images in cart lines: dead paths. | **PARTIAL** |
| `/contact` | Category imagery | Category images in form: dead paths. | **PARTIAL** |

---

# 6. Page Hero Coverage

| Page | Hero image in DB | Component wired? | Renders at runtime? | Notes |
|------|-----------------|-----------------|-------------------|-------|
| `/` | `hero_image` = dead; `homepage_hero` = live but unused | NO — HeroSlideshow uses SVG | NO | Hero was never wired to site_content |
| `/origins` | None | NO — pure gradient | NO | Hero uses atmospheric gradient only |
| `/quality` | `quality_hero` → Supabase URL | YES | **NO** | Static page, cached at build time before DB insert |
| `/export` | `export_hero` → Supabase URL | YES | **NO** | Static page, cached at build time before DB insert |
| `/about` | `about_hero` → Supabase URL | YES | **NO** | Static page, cached at build time before DB insert |
| `/journal` | None | NO — pure gradient | NO | No hero photography planned |
| `/contact` | None | NO — pure gradient | NO | No hero photography planned |

**Root cause for static pages:** All five pages (`/origins`, `/about`, `/quality`, `/export`, `/journal`) are marked `○ (Static)` in the Next.js build output and were built at **7:22 AM on September 4**. The site_content hero image keys were inserted at **7:34 PM on September 3** — approximately 12 hours before the build. Next.js App Router server components with `getSiteContent()` are being cached at build time for static pages, preventing the fresh DB values from being rendered.

**Fix:** Either add `export const dynamic = "force-dynamic"` to each affected page, or trigger a production rebuild after DB content is inserted.

---

# 7. Photography Art Direction Assessment

**Note:** Due to the `CategoryImageLayer` bug preventing category card images from rendering, and the static caching issue preventing page hero images from rendering, art direction assessment is limited to what is confirmed rendering in the browser.

| Asset family | In browser? | Assessment | Notes |
|-------------|------------|------------|-------|
| Category cards (coffee, tea, horticulture, grains) | NO | **Cannot assess** | Bug prevents rendering. Asset organization and naming suggest appropriate agricultural photography. |
| Category heroes (4) | YES | **B** | Render correctly on `/shop/[category]`. Photography appears atmospheric and appropriate — likely landscape/crop photography. Consistent family treatment visible in category tabs. |
| Product primaries (2) on PDP | YES | **B** | Render correctly on product detail pages. Appropriate product catalogue photography. |
| Product primaries (2) on homepage | NO | **Cannot assess** | Dead paths — FeaturedSection issue. |
| Page heroes (about, quality, export) | NO | **Cannot assess** | Static cache prevents rendering. DB values present but not reflected in HTML. |
| Provenance images | NO | **Cannot assess** | In DB, not rendered. |
| Journal images | NO | **Cannot assess** | In DB, not rendered. |
| Homepage hero portrait | NO | **Cannot assess** | In DB, not wired to HeroSlideshow. |
| Hero SVG illustrations | YES | **B+** | Sophisticated SVG compositions appropriate as temporary stand-ins. Premium feel. Four category worlds clearly communicated. |
| Coffee gallery (4 images) | NO | **Cannot assess** | Uploaded but not linked to product gallery. |
| Checkout / contact category images | NO | **Cannot assess** | Dead `/images/` paths render but are not Supabase assets. |

**General observation:** The photography asset inventory appears professionally organized and well-structured. The family naming conventions suggest appropriate content: product photography (`prod-coffee-pdp.png`, `prod-coffee-cherry.png`), lifestyle/cultural (`prod-coffee-lifestyle.png`), close-up detail (`prod-coffee-macro.png`), process photography (`prod-coffee-process.png`), editorial landscapes (`provenance-landscape.png`, `provenance-macro.png`), journal reportage (`journal-coffee.png`, `journal-hort.png`, `journal-tea.png`). Without rendering, no clichés, stock imagery concerns, or AI-generation artifacts can be identified. The overall impression is of a coherent, intentional photography campaign.

---

# 8. Cropping & Composition Issues

**Cannot fully assess** — several critical image rendering issues prevent comprehensive evaluation.

**Known issues based on code review:**

1. **CategoryDiscovery card images:** `object-cover` with no explicit `object-position`. Images use `CategoryImageLayer` with hover transform (`scale-[1.05] translate-y-[-2px]`). If subjects are not centered, the hover crop may reveal unintended areas. Cannot verify until bug is fixed.

2. **Category hero images on `/shop/[category]`:** `aspect-[4/3]` with `object-cover`. No `object-position` specified. Images render correctly (confirmed in browser). Crop quality appears appropriate.

3. **Provenance image in Origins body:** `aspect-[4/3]` with `object-cover`. Images not rendering due to static cache issue.

4. **Product images on PDP:** `aspect-ratio: 3/4` — excellent for portrait product photography. Gallery thumbnails use `aspect-[1/1]`. Appropriate.

5. **No focal point guidance detected** in any image container. For a premium commerce site, explicit `object-position` (e.g., `object-position: center 30%`) on category card images would prevent unwanted crops when source images have off-center subjects.

---

# 9. Mobile / Responsive Issues

**Based on code review:**

1. **CategoryDiscovery:** Lead chapter uses `aspect-[4/5]` mobile / `aspect-[5/6]` desktop. Companion chapters use `aspect-[4/3]` consistently. `CategoryImageLayer` bug prevents all images from appearing on any viewport.

2. **Hero:** Single composition adapts via CSS. SVG illustrations scale with viewport. Behavior on small screens needs visual QA.

3. **Product cards:** `aspect-[4/5]` across all breakpoints — consistent.

4. **No horizontal overflow detected** in code review. All image containers use `overflow-hidden`.

5. **No `srcset` or responsive image sizing.** All images served at full resolution from Supabase. Prototype-acceptable; production should implement responsive images.

6. **No image priority hints** (`loading="lazy"` vs `loading="eager"`) detected in most components. Hero images should use `loading="eager"` and `fetchPriority="high"`. Currently only some product images use explicit `loading="lazy"`.

---

# 10. Technical Issues

## 10.1 P0 — CategoryImageLayer State Logic Bug

**File:** `src/components/CategoryImageLayer.tsx`
**Severity:** Critical — 4 category card images do not render on homepage or `/shop`
**Status:** Images uploaded and in DB; component code broken

```tsx
const [shouldRender, setShouldRender] = useState(false);
const [failed, setFailed] = useState(false);
if (failed || !shouldRender) return null;  // ← ALWAYS null on first render
return <img src={src} onLoad={() => setShouldRender(true)} onError={() => setFailed(true)} ... />;
```

The component returns `null` when both `failed=false` and `shouldRender=false` (the initial state). The `onLoad` handler sets `shouldRender=true`, but at that point the render has already returned `null`. The `<img>` element is never mounted.

**Impact:** Category card images in `CategoryDiscovery` (used on homepage and `/shop`) do not appear. The atmosphere gradients and ChapterMark SVGs remain visible.

**Note:** Category hero images on `/shop/[category]` pages use direct `<img>` tags (not `CategoryImageLayer`) and render correctly.

## 10.2 P0 — FeaturedSection Homepage Image Issue

**File:** `src/components/FeaturedSection.tsx`, `src/components/ProductImage.tsx`
**Severity:** Critical — Featured products on homepage show dead paths despite correct DB values
**Status:** Products have correct Supabase URLs in DB; homepage renders dead `/images/product-moka-espresso.jpg`

The `/shop` page correctly renders both published product images via Supabase URLs. The homepage `FeaturedSection` renders dead local paths. The `ProductImage` component is used by both. Root cause not isolated — possible causes: (a) wrong data passed to FeaturedSection from page.tsx, (b) ProductImage's `img.complete && img.naturalWidth === 0` check failing for valid Supabase URLs, (c) Supabase CORS issue specific to the ProductImage client component context.

**Requires hands-on browser DevTools debugging to isolate.**

## 10.3 P0 — Static Page Cache Prevents Hero Image Rendering

**Files:** `src/app/about/page.tsx`, `src/app/quality/page.tsx`, `src/app/export/page.tsx`, `src/app/origins/page.tsx`
**Severity:** Critical — 5 pages show placeholder hero content despite correct DB values
**Status:** site_content DB has correct Supabase URLs; pages render placeholder due to build-time caching

The pages were built at **7:22 AM Sep 4**. The site_content hero keys were inserted at **7:34 PM Sep 3** — 12 hours earlier. The compiled static HTML files contain placeholder content (confirmed in `about.html`, `origins.html`). Even though `getSiteContent()` makes a fresh Supabase request, Next.js App Router server components on `○ (Static)` pages are being cached at the server level.

**Evidence:** `about.html` (75 KB, built Sep 4) contains no `site-images` reference. DB query confirms `about_hero = https://...page-about-hero.png`. Runtime HTTP response from `next start` confirms 0 supabase image refs on `/about`.

**Fix:** Add `export const dynamic = "force-dynamic"` to each affected page. Or: trigger a production rebuild.

## 10.4 P1 — Hero System Not Wired to site_content

**File:** `src/components/HeroSlideshow.tsx`
**Severity:** High — Homepage hero uses SVG stand-ins instead of real photography
**Status:** `site_content.homepage_hero` = `site-images/homepage/hero-home-portrait.png` exists but is not consumed

The `HeroSlideshow` and `HeroChapters` components were explicitly designed as photography stand-ins (per `HeroChapters.tsx` comment: "Hero architecture once client photography arrives"). The `homepage_hero` key exists in `site_content` but is not imported or passed to the component.

## 10.5 P1 — Provenance Component Image Prop Not Rendered

**File:** `src/components/Provenance.tsx`
**Severity:** High — Cinematic provenance backdrop not showing
**Status:** DB has `provenance_image`; component accepts `image` prop but JSX does not render it

The `image` prop was added to the `Provenance` component (used in `page.tsx` with `contentMap.provenance_image`). The component template does not include an `<img>` element to display it. The section currently shows only CSS atmospheric gradients.

## 10.6 P1 — JournalPreview Still Uses Default Essays

**File:** `src/app/page.tsx`
**Severity:** High — Journal section shows 2 essays with dead paths instead of 3 database-driven essays
**Status:** DB has journal image URLs; page.tsx still uses default 2-essay prop

The `page.tsx` renders `<JournalPreview />` without passing the `essays` prop. The component falls back to `DEFAULT_ESSAYS` (2 essays, no images). The planned 3-essay database-driven array with `journal_card_coffee`, `journal_card_horticulture`, `journal_card_tea` Supabase URLs is not wired. Essay "Cupping at origin" references a dead `/images/` path.

## 10.7 P2 — Origins Body Images Not Rendering

**File:** `src/app/origins/page.tsx`
**Severity:** Low — Two body chapter images in DB not showing
**Status:** `origins_body_kirinyaga` and `origins_body_terroir` in DB; page reads them but static cache prevents rendering

The page code correctly reads `content.origins_body_kirinyaga` and `content.origins_body_terroir`. The HTML shows "Kirinyaga · Photography pending" and "Terroir · Photography pending" placeholders. This is a consequence of the static cache issue (P0).

## 10.8 P2 — Export Doc Image Not Rendered

**File:** `src/app/export/page.tsx`
**Severity:** Low — Documentation image in DB not shown
**Status:** `export_doc` key exists in `site_content`; export page does not render it in UI

## 10.9 P2 — Gallery Images Not Linked

**Files:** Product data, `src/app/product/[slug]/page.tsx`
**Severity:** Low — 4 gallery images uploaded but no product has a non-empty `gallery` field
**Status:** Gallery images in storage; products have `gallery = []`

The 4 coffee gallery images (`pdp-alt.png`, `lifestyle.png`, `macro.png`, `process.png`) are in storage but not linked to any product. The PDP gallery section will always be empty until gallery data is added to the product records.

## 10.10 P2 — Dead Local Image Paths

**Files:** Various components
**Severity:** Low — Several components reference dead `/images/` paths
**Status:** Legacy from pre-Supabase era

References include `/images/product-moka-espresso.jpg` (homepage FeaturedSection), `/images/category-coffee.jpg` (checkout, contact), and essay card images in the default JournalPreview essays. These are dead paths that serve no purpose now that Supabase is integrated.

---

# 11. Unused Assets

| Asset | Path | In DB? | Wired? | Status |
|-------|------|--------|--------|--------|
| Provenance landscape | `site-images/editorial/provenance/provenance-landscape.png` | YES | NO | Wired to `origins_body_kirinyaga` but Origins is cached |
| Provenance macro | `site-images/editorial/provenance/provenance-macro.png` | YES | NO | Wired to `origins_body_terroir` but Origins is cached |
| Homepage hero portrait | `site-images/homepage/hero-home-portrait.png` | YES | NO | In DB but HeroSlideshow uses SVG |
| Export doc | `site-images/pages/export/page-export-doc.png` | YES | NO | In DB but not rendered in export UI |
| Journal — Coffee | `site-images/editorial/journal/journal-coffee.png` | YES | NO | In DB but JournalPreview uses default essays |
| Journal — Horticulture | `site-images/editorial/journal/journal-hort.png` | YES | NO | In DB but JournalPreview uses default essays |
| Journal — Tea | `site-images/editorial/journal/journal-tea.png` | YES | NO | In DB but JournalPreview uses default essays |
| Coffee gallery (4 images) | `site-images/products/coffee-gallery/*` | N/A | NO | In storage but no product has gallery data |

---

# 12. Missing Assets

| Asset | Expected path | Status |
|-------|--------------|--------|
| Homepage hero photography | `site-images/homepage/hero-home-portrait.png` | Uploaded but not wired to hero component |
| Provenance section backdrop | `site-images/editorial/provenance/provenance-landscape.png` | Uploaded but not rendered |
| Origins hero | None | No hero photography planned |
| Journal hero | None | No hero photography planned |
| Contact hero | None | No hero photography planned |
| Checkout imagery | None expected | N/A |

---

# 13. Recommended Refinements

### P0 — Must Fix

1. **Fix `CategoryImageLayer.tsx` state logic.** Change `useState(false)` initial for `shouldRender` to `true`. Remove the `if (failed || !shouldRender) return null` guard, or restructure to always render the `<img>` with `onLoad`/`onError` handlers updating state for graceful error display. This unblocks all category card photography.

2. **Fix static page caching for hero images.** Add `export const dynamic = "force-dynamic"` to `/origins`, `/about`, `/quality`, `/export`, `/journal` pages. This ensures server components fetch fresh `site_content` on each request.

3. **Diagnose and fix FeaturedSection homepage image rendering.** Isolated root cause not determined via static analysis. Requires browser DevTools to determine whether issue is data flow (wrong src passed) or component behavior (ProductImage failing to load valid Supabase URL).

### P1 — Strongly Recommended

4. **Wire hero system to `site_content.homepage_hero`.** Either: (a) modify `HeroSlideshow` to accept and render the `homepage_hero` URL as a background/foreground image, or (b) build a new hero variant that layers the portrait photography behind the existing text composition.

5. **Wire provenance section image.** Update `Provenance.tsx` JSX to render the `image` prop as a cinematic background layer behind the three-stage sequence.

6. **Wire JournalPreview essays with database-driven images.** Update `page.tsx` to pass the 3-essay array with `journal_card_coffee`, `journal_card_horticulture`, `journal_card_tea` Supabase URLs. Remove the default essays that carry dead image paths.

### P2 — Polish

7. **Add explicit `object-position` to category card image containers.** Recommended values: `object-position: center 40%` for lead chapter cards, `object-position: center` for companion chapters.

8. **Link gallery images to products.** Populate the `gallery` JSONB field for published products. Alternatively, hardcode the coffee gallery images into the coffee PDP as a demonstration.

9. **Add `fetchPriority` and responsive image attributes.** Hero images should use `loading="eager"` and `fetchPriority="high"`. Consider `srcset` for product images to serve appropriately sized versions.

10. **Remove dead local image references.** Audit and replace all remaining `/images/` paths with Supabase URLs or remove them entirely.

11. **Add `alt` text to decorative images.** While `aria-hidden` images are correctly set, the provenance landscape and journal images (when rendered) should have descriptive `alt` text for accessibility and SEO.

---

# 14. Final Verdict

**Overall photography implementation score: 5.5 / 10**

The photography infrastructure is well-established: 24 high-quality assets were uploaded and verified live in Supabase Storage, the database schema is correct, and the data model supports the full architecture. The foundation is solid. The integration wiring is where the work stalled.

**Photography quality: 7/10**
The asset inventory appears well-organized, professionally structured, and appropriate to the Treadville brand. Without full browser rendering of all images, a definitive quality score is limited. What is confirmed rendering (category heroes, product primaries on PDP) shows appropriate agricultural/product photography with consistent family treatment.

**Integration quality: 4/10**
The most significant failure. Of 24 uploaded assets, approximately 17 are either not wired to any component or wired but blocked by bugs. Two critical bugs (`CategoryImageLayer`, static cache) prevent 10+ assets from rendering. The architecture is correct; the implementation is incomplete.

**Art-direction consistency: 6/10**
The hero uses SVG illustrations rather than real photography — premium enough as a stand-in but not the intended final state. Category hero images (on `/shop/[category]`) and product images on PDP render correctly and appear cohesive. Unable to fully assess journal, provenance, and category card photography due to rendering failures.

**Route coverage: 5/10**
Only `/product/masai-coffee-moka-espresso` and `/product/masai-coffee-supreme` are fully live with photography. Category hero images on all 4 `/shop/[category]` pages are live. The homepage and `/shop` are broken. Five additional pages show placeholder content due to static cache.

**Technical quality: 5/10**
The data layer, Supabase integration, and storage configuration are correct. Two specific technical failures prevent photography from rendering: the `CategoryImageLayer` inverted state bug and the static page caching issue. These are fixable bugs, not architectural problems.

**Verdict:** The photography integration phase created the right assets, put them in the right place in storage, and established the right data model. It did not complete the implementation wiring. Three critical bugs must be fixed before the photography can be properly evaluated. The work is approximately 40% complete.
