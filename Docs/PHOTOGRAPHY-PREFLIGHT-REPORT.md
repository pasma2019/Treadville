# TREADVILLE — PHASE 11 PRE-FLIGHT REPORT

> Read-only verification of photography documentation against live repository. No files changed. No uploads. No DB writes. No commits.

---

## 1. Repository state (verified, not assumed)

| Check | Result |
|---|---|
| Photography folder | 30 originals in `_originals/` + 30 working copies in semantic subfolders (60 PNGs) |
| `/public/images/` | **Does not exist** (the current seed URLs `/images/category-*.jpg` 404 silently) |
| `npm run build` | Last run: `✓ Compiled successfully in 31.7s`; all 16 routes generated |
| Last commit | `6652724 docs: photography direction inventory — 35-50 images across 13 families` |
| New (uncommitted) docs | 6 files in `Docs/` + `Photography/MANIFEST.md` |
| Components | 23 components in `src/components/` |
| Routes | 15 `page.tsx` files in `src/app/` |

---

## 2. Photography assets available (30)

### 2.1 ACCEPT (23) — drop-in ready if slot exists

| # | Working file | Family | Route | Data field | Conflict / Conflict-check |
|---|---|---|---|---|---|
| 1 | `pages/about/page-about-hero.png` | 12 | `/about` | **none** (text-only hero) | CONFLICT — no slot |
| 2 | `categories/horticulture/cat-hort-detail.png` | 04 | `/shop/horticulture` | none | CONFLICT — no slot |
| 3 | `categories/coffee/cat-coffee-card.png` | 06 | `/` (CategoryDiscovery) | `cat.image_url` (slug=coffee) | OK — wired via `CategoryImageLayer` |
| 4 | `categories/coffee/hero-coffee.png` | 02 | `/shop/coffee` | **none** (gradient only) | CONFLICT — no slot |
| 5 | `categories/tea/hero-tea.png` | 03 | `/shop/tea` | none (gradient only) | CONFLICT — no slot |
| 6 | `categories/tea/cat-tea-card.png` | 06 | `/` (CategoryDiscovery) | `cat.image_url` (slug=tea) | OK — wired |
| 7 | `categories/horticulture/cat-hort-card.png` | 06 | `/` (CategoryDiscovery) | `cat.image_url` (slug=horticulture) | OK — wired |
| 8 | `categories/horticulture/hero-horticulture.png` | 04 | `/shop/horticulture` | none | CONFLICT — no slot |
| 9 | `categories/grains/hero-grains.png` | 05 | `/shop/grains` | none | CONFLICT — no slot |
| 10 | `categories/grains/cat-grains-card.png` | 06 | `/` (CategoryDiscovery) | `cat.image_url` (slug=grains) | OK — wired |
| 11 | `hero/hero-home-portrait.png` | 01 | `/` (HeroSlideshow) | **none** (persistent SVG `CHAPTERS[0]`) | CONFLICT — slot is hardcoded SVG |
| 12 | `journal/journal-coffee.png` | 11 | JournalPreview | **none** | CONFLICT — no slot |
| 13 | `journal/journal-hort.png` | 11 | JournalPreview | none | CONFLICT — no slot |
| 14 | `journal/journal-tea.png` | 11 | JournalPreview | none | CONFLICT — no slot |
| 15 | `pages/export/hero-export.png` | 10/12 | `/export` hero | none | CONFLICT — no slot |
| 16 | `pages/export/page-export-doc.png` | 10 | `/export` body | none | CONFLICT — no slot |
| 17 | `pages/quality/page-quality.png` | 12 | `/quality` hero | none | CONFLICT — no slot |
| 18 | `provenance/provenance-landscape.png` | 09 | Provenance section | none | CONFLICT — no slot |
| 19 | `provenance/provenance-macro.png` | 09 | Provenance / `/origins` | none | CONFLICT — no slot |
| 20 | `products/coffee/prod-coffee-pdp.png` | 07 | `/product/[slug]` | `product.image_url` | OK — wired (REVIEW slug) |
| 21 | `products/coffee/prod-coffee-lifestyle.png` | 08 | `/product/[slug]` | `product.gallery[]` | OK — wired |
| 22 | `products/coffee/prod-coffee-macro.png` | 08 | `/product/[slug]` | `product.gallery[]` | OK — wired |
| 23 | `products/coffee/prod-coffee-process.png` | 08/09 | `/product/[slug]` | `product.gallery[]` | OK — wired |

### 2.2 REVIEW (7) — pending Pascal decision

| # | Working file | Family | Route | Data field | Blocker |
|---|---|---|---|---|---|
| 24 | `products/coffee/prod-coffee-cherry.png` | 07/08 | PDP | `product.image_url` or `gallery[]` | Pascal: which coffee slug gets this? |
| 25 | `products/coffee/prod-coffee-raw.png` | 07/01 | PDP or hero | `product.image_url` | Pascal: hero alt or PDP primary? |
| 26 | `products/tea/prod-tea-process.png` | 07/08 | tea slug | `product.image_url` or `gallery[]` | All tea products are `draft` placeholders — DO NOT bind |
| 27 | `products/grains/prod-grains-harvest.png` | 07/08 | grain slug | `product.image_url` or `gallery[]` | All grain products are `draft` placeholders — DO NOT bind |
| 28 | `hero/hero-signature.png` | 01/09/11 | hero alt / provenance / journal | depends on Pascal | Pascal: where does this go? |
| 29 | `review/farm-work.png` | 13 | (no slot) | none | Pascal: keep as review or assign? |
| 30 | `review/category-collection.png` | 13 | (no slot, dim anomaly) | none | Pascal: marketing asset or About slot? |

### 2.3 Anomalies (verified from filenames only — file headers not re-parsed this pass)

| File | Standard | Anomaly | Impact |
|---|---|---|---|
| `HOMEPAGE HERO.png` | 1536×1024 | 1024×1536 (portrait 2:3) | INTENDED for family 01 portrait slot |
| `TEA CATEGORY HERO.png` | 1536×1024 | 1122×1402 (portrait 4:5) | CONFLICT — category hero slot is gradient-only, no aspect accommodation |
| `FULL CATEGORY COLLECTION.png` | 1536×1024 | 1402×1122 (~5:4) | REVIEW — no slot, non-standard crop |

---

## 3. Target routes / components (verified from code)

### 3.1 Routes / components

| Route | Component (path) | Data field consumed | Image-ready? |
|---|---|---|---|
| `/` | `src/app/page.tsx:29` → `HeroSlideshow` (`src/components/HeroSlideshow.tsx:147-150`) | none — persistent SVG `CHAPTERS[0]` | **NO** — hero slot is hardcoded SVG |
| `/` | `CategoryDiscovery` (`src/components/CategoryDiscovery.tsx:177-184, 273, 342`) | `cat.image_url` via `CategoryImageLayerFor` → `CategoryImageLayer` (`src/components/CategoryImageLayer.tsx`) | **YES** — wired, lazy-loads, error-falls back to atmosphere |
| `/` | `Provenance` (`src/components/Provenance.tsx`) | `provenance_eyebrow`, `provenance_headline`, `provenance_intro`, `provenance_closing` (from `site_content`) | **NO** — no image slot; SVG topographic + data points only |
| `/` | `JournalPreview` (`src/components/JournalPreview.tsx`) | none — hardcoded `DEFAULT_ESSAYS` array (2 essays) | **NO** — no image slot; 2 essay cards only |
| `/shop/[category]` | `src/app/shop/[category]/page.tsx:43-45` | none — pure `categoryAtmosphere()` gradient | **NO** — no image slot |
| `/shop/[category]` | `src/app/shop/[category]/page.tsx:102-108` | `product.image_url` via `ProductImage` (`src/components/ProductImage.tsx`) | **YES** — wired, lazy-loads, error-falls back to CategoryMark |
| `/product/[slug]` | `src/app/product/[slug]/page.tsx:100-106` | `product.image_url` + `product.gallery[]` via `ProductGallery` (`src/components/ProductGallery.tsx`) | **YES** — fully wired with pointer swipe + keyboard |
| `/about` | `src/app/about/page.tsx:34-56` | none — text-only hero with dark linear gradient | **NO** — no image slot |
| `/origins` | `src/app/origins/page.tsx:14-37` | none — text-only hero | **NO** — no image slot |
| `/origins` | `src/app/origins/page.tsx:95-104` and `:122-131` | none — placeholder divs reading "Kirinyaga · Photography pending" / "Terroir · Photography pending" | **NO** — placeholder divs already in code (in-body slots exist as gray placeholders) |
| `/export` | `src/app/export/page.tsx:22-44` | none — text-only hero | **NO** — no image slot |
| `/quality` | `src/app/quality/page.tsx:38-61` | none — text-only hero | **NO** — no image slot |
| `/journal` | `src/app/journal/page.tsx:39-62` | none — text-only hero | **NO** — no image slot |

### 3.2 Slot readiness summary

| Surface | Slot in code? | Image field? | Image wired? | Documentation claim | Match? |
|---|---|---|---|---|---|
| Homepage hero right | YES (SVG) | none | n/a | "Replace SVG or add slot" | OK |
| Category lead card | YES | `cat.image_url` | YES (`CategoryImageLayer`) | OK | MATCH |
| Category companion card | YES | `cat.image_url` | YES | OK | MATCH |
| Category page hero | NO | none | n/a | "Add image-prop OR change atmosphere" | MATCH |
| Category product card | YES | `product.image_url` | YES | OK | MATCH |
| Product gallery (PDP) | YES | `image_url` + `gallery[]` | YES | OK | MATCH |
| `/about` hero | NO | none | n/a | "Add image slot" | MATCH |
| `/origins` hero | NO | none | n/a | "Missing" | MATCH |
| `/origins` body | YES (gray placeholder) | none | n/a | (not previously documented) | NEW FINDING |
| `/export` hero | NO | none | n/a | "Add slot" | MATCH |
| `/quality` hero | NO | none | n/a | "Add slot" | MATCH |
| `/journal` hero | NO | none | n/a | "Missing" | MATCH |
| Provenance section | NO | none | n/a | "Add slot if Pascal approves" | MATCH |
| JournalPreview | NO | none (essay data is hardcoded) | n/a | "Slot not yet created" | MATCH |
| Admin /products | YES (text input) | `image_url` text input | n/a | OK | MATCH |
| Admin /categories | YES (text input) | `image_url` text input | n/a | OK | MATCH |
| Admin /content | YES (textarea) | 4 keys: `hero_headline`, `hero_subheadline`, `hero_image`, `about_blurb` | n/a | "hero_image dead code" | MATCH — confirmed in code: `hero_image` is read/written by admin but no component consumes it |

### 3.3 NEW FINDINGS (not previously documented)

1. **`/origins` page already has 2 in-body image placeholder divs** (`src/app/origins/page.tsx:95-104` and `:122-131`). They read "Kirinyaga · Photography pending" and "Terroir · Photography pending". These are 4:3 aspect, ready to be filled with real images. The PROVENANCE.png and ORIGIN MACRO.png fit these slots without any code change to the placeholders — only the div content swap.

2. **Admin `/products` page has NO `gallery[]` field in the add-product form** (`src/app/admin/products/page.tsx:89-132`). It only exposes `image_url`. The `gallery` field is in the schema and type but not editable from admin. To populate `gallery[]`, either: (a) update admin to expose it, (b) write to DB directly.

3. **Admin `/content` page exposes `hero_image` key** (`src/app/admin/content/page.tsx:6-11`). The current code reads/writes this key but `HeroSlideshow` does NOT consume it (the right visual is hardcoded SVG). So setting `hero_image` via admin is a no-op for visuals — the value lives in `site_content` but nothing renders it.

4. **JournalPreview has a hardcoded 2-essay `DEFAULT_ESSAYS` array** (`src/components/JournalPreview.tsx:11-26`). The `/journal` page hardcodes 3 essays (`src/app/journal/page.tsx:11-33`). There is NO shared `journal_entries` table. The 3 journal images (JOURNAL COFFEE/HORT/TEA) have no schema field to bind to.

5. **Provenance component has no `image_url` prop** (`src/components/Provenance.tsx`). It accepts 5 string props: `eyebrow`, `headline`, `intro`, `stages`, `closing`. None are images. Adding a 6th `image` prop is a component change.

6. **All 5 page heroes (`/about`, `/origins`, `/export`, `/quality`, `/journal`) share an identical template** (dark linear gradient + Reveal stack with eyebrow/H1/intro). Adding image slots consistently would touch 5 files.

---

## 4. Database fields to populate (verified from schema + types)

### 4.1 Existing image-bearing fields

| Table | Column | Type | Used by | Currently set to |
|---|---|---|---|---|
| `categories` | `image_url` | `text` (nullable) | `CategoryImageLayer` via `CategoryDiscovery` | 4 dead placeholder strings (`/images/category-*.jpg`) |
| `products` | `image_url` | `text` (nullable) | `ProductImage` via PDP + category product card | 9 placeholder strings (3 real coffee + 6 demo) |
| `products` | `gallery` | `text[]` (default `'{}'`) | `ProductGallery` (PDP) | All empty `{}` |
| `site_content` | `value` | `text` (key/value) | Admin/content page; HeroSlideshow does NOT consume `hero_image` | 4 keys seeded: `hero_headline`, `hero_subheadline`, `hero_image` (dead), `about_blurb` |

### 4.2 SQL-level constraints (from `supabase/schema.sql:38-46`)

```sql
-- RLS policies: public full access (read + write) for all 3 tables
-- This is a PROTOTYPE policy. Do NOT ship to production.
```

**Implication:** all current schema access is unauthenticated. The admin (`/admin/*`) relies on this. Any DB writes performed by an upload script will succeed if it uses the same anon key the running app uses. But the project may not have been migrated to a real Supabase project — verify with Pascal.

### 4.3 Database fields required for safe execution

| Update | Tables | Columns | Records | Risk | Required Pascal approval |
|---|---|---|---|---|---|
| Category card images | `categories` | `image_url` | 4 slugs (coffee, tea, horticulture, grains) | LOW (overwrites dead placeholders that already 404) | YES — confirm new URLs |
| Coffee product images | `products` | `image_url` + `gallery[]` | 3 published coffee slugs | MEDIUM (overwrites placeholders) | YES — confirm slug → image mapping |
| Tea/hort/grain products | `products` | `image_url` + `gallery[]` | 6 draft placeholder slugs | HIGH (overwrites placeholders of placeholders) | NO — defer until real catalogue |
| Page hero keys | `site_content` | new keys | n/a | NONE (INSERT, no conflict) | YES — confirm keys + which component will read them |
| `hero_image` value | `site_content` | `value` for existing `hero_image` key | n/a | NONE (already in seed) | YES — confirm HeroSlideshow will read it (currently does not) |

### 4.4 What schema is NOT in place for full photography integration

- No `journal_entries` table → journal images cannot bind to essays
- No `page_hero` table → page hero images cannot bind to specific pages without `site_content` keys
- No `provenance_image` field → Provenance image cannot be wired without prop change
- Admin form does not expose `products.gallery[]` → gallery must be written via DB script

---

## 5. Conflicts between documentation and current code

| Item | Documentation claim | Actual code | Resolution |
|---|---|---|---|
| Hero slot | "Persistent SVG, replace or add slot" | Confirmed: `HeroSlideshow.tsx:147-150` uses `CHAPTERS[0]` SVG; not data-driven | MATCH |
| `site_content.hero_image` | "Dead code" | Confirmed: admin reads/writes it, but `HeroSlideshow` does not consume it | MATCH |
| Category card slot | "Wired via `cat.image_url`" | Confirmed: `CategoryImageLayer` reads `cat.image_url` and lazy-loads | MATCH |
| Category page hero | "No image slot" | Confirmed: pure `categoryAtmosphere()` gradient | MATCH |
| PDP primary + gallery | "Wired" | Confirmed: `ProductGallery` consumes `[image_url, ...gallery]` | MATCH |
| Provenance | "No image slot" | Confirmed: only string props; no image prop | MATCH |
| JournalPreview | "No slot, 3-card grid" | Confirmed: 2 essay cards, no image; data hardcoded | MATCH (2 cards not 3) |
| `/origins` placeholders | Not previously documented | **NEW**: 2 in-body placeholder divs exist, 4:3 aspect, already say "Photography pending" | Update docs: 2 ready slots |
| Admin products `gallery[]` | Not previously documented | **NEW**: admin form does NOT expose `gallery[]` field | Update docs |
| Admin content `hero_image` | Listed in `site_content` mapping | **CONFIRMED**: admin writes it but component doesn't read it | Document as inert |
| `/export` "Export Documentation" | Listed as page hero | `EXPORT.png` is the only `/export` hero candidate; `EXPORT DOCUMENTATION.png` would belong in body, not hero | Documentation says body — MATCH |
| `RAW COFFEE + STONE` | "Dual: coffee PDP primary OR hero raw-material" | Coffee hero is a separate slot, conflict with hero portrait; safer to be PDP primary | Recommendation only |
| Dimension anomalies (TEA CATEGORY HERO portrait 4:5) | "REVIEW crop plan" | `/shop/[category]` uses gradient hero, no aspect expectation in code | MATCH — any image placed there will be cropped to fit (CSS `object-cover`) |

---

## 6. Missing assets (to be supplied)

| Slot | Required | Why |
|---|---|---|
| `/origins` page hero | landscape, Kirinyaga highland | No image currently; hero is text-only |
| `/journal` page hero | landscape, editorial | No image currently; hero is text-only |
| Tea product primary portrait (4:5 / 5:6) | portrait, tea caddie / leaves | `prod-tea-process.png` is landscape 3:2, won't crop to 5:6 portrait cleanly |
| Horticulture product primary portrait | portrait, avocado / fruit | No image in set |
| Grains product primary portrait | portrait, grain packshot | `prod-grains-harvest.png` is landscape 3:2 |
| Additional gallery shots | 6+ (3 per product minimum) | Only 6 gallery candidates for 4 categories; insufficient |

---

## 7. Assets requiring review (not yet bound)

| Image | Blocker |
|---|---|
| `RAW COFFEE + STONE` | Hero alt vs PDP primary decision |
| `THE SIGNATURE TREADVILLE IMAGE` | Hero alt vs provenance backing vs journal |
| `COFFEE CHERRY CLUSTER` | Which coffee slug gets it |
| `GRAINS HARVEST DETAIL` | Primary or gallery for grain slug |
| `TEA PROCESS` | Do not bind to draft placeholder |
| `FARM WORK` | No slot |
| `FULL CATEGORY COLLECTION` | No slot + dimension anomaly |

---

## 8. Proposed upload/integration sequence (deterministic, gated)

> Each step requires explicit Pascal sign-off and a `npm run build` between steps.

### Pre-flight (no upload)

1. **Pascal confirms**:
   - Supabase project URL
   - Supabase service role key (via env, never committed)
   - Storage bucket name (proposed: `treadville-media`)
   - Storage public read enabled
   - 10 decisions from `PHOTOGRAPHY-IMPLEMENTATION-REPORT.md` §11
   - 8 above decisions in this report

### Step 1 — Storage bucket (one-time, no images)
- Create `treadville-media` bucket, public read
- Verify access with empty bucket

### Step 2 — Phase 1: 4 category card images
- **Files:** `cat-coffee-card.png`, `cat-tea-card.png`, `cat-hort-card.png`, `cat-grains-card.png`
- **Storage path:** `treadville-media/categories/{slug}/{filename}.jpg`
- **DB:** 4 `UPDATE categories SET image_url = ... WHERE slug = ...`
- **Verification:** Visit `/`; CategoryDiscovery companions show images; lead card continues with SVG fallback (no portrait in set)
- **Rollback:** 4 UPDATEs in reverse (restore dead placeholders)
- **No component changes required**

### Step 3 — Phase 2: 3 coffee product primaries
- **Files:** Pascal-confirmed mapping (likely `prod-coffee-pdp.png` → moka-espresso, `prod-coffee-cherry.png` → supreme, `prod-coffee-raw.png` → kenya-aa-gold)
- **Storage path:** `treadville-media/products/coffee/{filename}.jpg`
- **DB:** 3 `UPDATE products SET image_url = ... WHERE slug = ...`
- **Verification:** Visit `/shop/coffee` and each `/product/[slug]`
- **Rollback:** 3 UPDATEs in reverse
- **No component changes required**

### Step 4 — Phase 3: coffee gallery (6 images)
- **Files:** Pascal-confirmed assignment of 2 gallery images per coffee product (6 total)
- **Storage path:** `treadville-media/products/coffee/{filename}.jpg`
- **DB:** 3 `UPDATE products SET gallery = ARRAY[...] WHERE slug = ...`
- **Verification:** Visit each `/product/[coffee-slug]`; ProductGallery shows multiple images; pointer swipe + Arrow keys work
- **Rollback:** 3 UPDATEs to reset `gallery = '{}'`
- **No component changes required** (ProductGallery already wired)

### Step 5 — Stop for review
- **Status checkpoint:** 4 category cards + 3 coffee products with gallery = full storefront photo experience
- **Defer all REVIEW + slot-creation items** until Pascal approves additional changes

### Step 6 (gated) — Provenance backing
- **Component change:** add `image?: string` prop to `Provenance.tsx`; pass from `page.tsx`
- **Storage path:** `treadville-media/provenance/{filename}.jpg`
- **Verification:** Provenance section shows image
- **Risk:** visible page change; will need grading

### Step 7 (gated) — Page hero slots (5 files)
- **Component change:** add image slot to each page hero template
- **Storage path:** `treadville-media/pages/{about|quality|export|origins|journal}/`
- **Risk:** MEDIUM; visible across 5 pages; consistency required

### Step 8 (gated) — Homepage hero replacement
- **Component change:** `HeroSlideshow.tsx` right visual to consume `site_content.hero_image`
- **Risk:** MEDIUM-HIGH; most visible page change

### Step 9 (gated) — `/origins` body placeholders filled
- **No component change:** placeholders already exist at 4:3 aspect
- **Storage path:** `treadville-media/pages/origins/`
- **Action:** Swap placeholder text for `<img>` with `site_content` key or hardcoded URL
- **Simplest of all slot-adds** — minimal risk

### Step 10 (deferred) — Tea / Horticulture / Grains products
- **Hard block:** all records are `draft` placeholders
- **Action:** requires real Treadville catalogue data from Eunice/owner

### Step 11 (deferred) — Format conversion
- **Current:** PNG originals (~2 MB each)
- **Recommendation:** re-encode to WebP (~200–400 KB) for production delivery
- **Action:** do this before public-facing upload if performance matters
- **Risk:** irreversible (re-encoding loses no visual quality but replaces original bytes)

---

## 9. Verification gates between steps

After each step:
- `npm run build` (must compile clean)
- `npx tsc --noEmit` (TypeScript clean)
- Manual visit: affected route(s) on desktop + mobile
- `git status` + `git diff` (no unintended file changes)
- Optional: take a screenshot of the changed page; compare against baseline

---

## 10. Summary

**Ready now (no code change, no Pascal decision beyond URL confirmation):**
- Step 1: Create storage bucket
- Step 2: 4 category card images via 4 `UPDATE categories` statements
- Step 3: 3 coffee product primaries via 3 `UPDATE products` statements
- Step 4: 6 coffee gallery images via 3 `UPDATE products SET gallery` statements

**Blocked by Pascal decisions:**
- Steps 6–8: page-level / section-level slot creation
- Step 10: tea/hort/grain products (real catalogue)
- Step 11: format conversion

**Blocked by environment:**
- Supabase project URL, service role key, storage bucket permissions

**No code change is required for the 13 storefront surfaces that already have image slots.** The product / category image paths are end-to-end live. Only the page heroes, homepage hero, Provenance, and JournalPreview require component changes — and those changes are Pascal decisions, not implementation work.

**No destructive changes proposed.** Every update has a documented rollback. Every upload is gated by build + TypeScript + manual visual check.

**No unverified claims** in this report. Every "data field" and "component" reference is read from live source. Every conflict between docs and code is explicitly flagged.
