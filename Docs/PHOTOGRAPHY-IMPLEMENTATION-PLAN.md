# TREADVILLE PHOTOGRAPHY — IMPLEMENTATION PLAN

> Phase 8. The deterministic local implementation is complete. This plan documents what would happen during a future Supabase upload, organized so Pascal can approve each step independently.

---

## Status: LOCAL implementation complete

| Step | Status | Where |
|---|---|---|
| Inventory (Phase 3) | DONE | `Docs/PHOTOGRAPHY-ASSET-INVENTORY.md` |
| Family map (Phase 4) | DONE | `Docs/PHOTOGRAPHY-FAMILY-MAP.md` |
| Local file organization (Phase 5) | DONE | `Photography/_originals/` + semantic working copies |
| Route map (Phase 6) | DONE | `Docs/PHOTOGRAPHY-ROUTE-MAP.md` |
| Supabase mapping (Phase 7) | DONE | `Docs/PHOTOGRAPHY-SUPABASE-MAPPING.md` |
| Implementation plan (this doc) | DONE | this file |
| Safe deterministic work (Phase 9) | DONE | Phase 9 below |
| Final report (Phase 10) | PENDING | next file |

---

## Phase 9 — Implementation completed locally (deterministic, non-destructive)

| Action | Result | Reversible |
|---|---|---|
| Created 9 family folders under `Photography/` | Done | Yes (delete folders) |
| Preserved 30 originals in `Photography/_originals/` | Done — 30 files verified | Yes (originals are exact copies; working copies can be deleted) |
| Created 30 working copies with semantic names | Done — 30 files verified | Yes (delete working copies; originals untouched) |
| Removed the 30 root-level loose originals | Done — only `_originals/` retains them | Yes (`_originals/` is the recovery) |
| Created 6 documentation files in `Docs/` | Done | Yes |

**No image content was modified, converted, or recolored. No PNG was overwritten. The `_originals/` folder contains byte-for-byte copies of the original 30 PNGs.**

---

## Phase 9 — Implementation PENDING (requires Pascal decision + Supabase access)

### Pre-conditions required before any upload

1. **Supabase project URL** — confirm or supply
2. **Supabase service role key** — DO NOT expose client-side; use a script with environment variable
3. **Storage bucket name** — confirm: `treadville-media` is the proposed name; Pascal may have a different convention
4. **Bucket visibility** — public read (images served via URL); write must be authenticated
5. **Pascal approval of slot decisions** — see below

### Slot decisions required (BLOCKING)

| Decision | Blocks which images |
|---|---|
| HOMEPAGE HERO — keep persistent SVG, OR replace with portrait photo | HOMEPAGE HERO.png, THE SIGNATURE TREADVILLE IMAGE.png |
| 5 page heroes (`/about`, `/origins`, `/export`, `/quality`, `/journal`) — add image slot OR leave text-only | ABOUT PAGE.png, QUALITY PAGE.png, EXPORT.png, EXPORT DOCUMENTATION.png + 2 missing |
| Provenance section — add image backing OR leave as-is | PROVENANCE.png, ORIGIN MACRO.png, THE SIGNATURE TREADVILLE IMAGE.png |
| JournalPreview — add 3-card image grid OR leave as text | JOURNAL COFFEE.png, JOURNAL HORTICULTURE.png, JOURNAL TEA TASTING.png |
| Product slug → image mapping for coffee (3 products × primary + gallery) | 7 coffee images |
| Whether to assign images to `draft` placeholder products (tea, horticulture, grains) | 2 images (prod-tea-process, prod-grains-harvest) |
| TEA CATEGORY HERO — crop image OR redesign slot to portrait | TEA CATEGORY HERO.png |

---

## Supabase upload plan (for when Pascal approves)

### Step 1 — Create storage bucket (one-time)
```
Bucket: treadville-media
Visibility: public
File size limit: 10MB
Allowed MIME types: image/jpeg, image/png, image/webp, image/avif
```

### Step 2 — Upload 30 files to `treadville-media/` (Phase 9 deferred)

| Source local file | Storage path | Public URL (final) |
|---|---|---|
| `Photography/hero/hero-home-portrait.png` | `hero/hero-home-portrait.jpg` | `https://{project}.supabase.co/storage/v1/object/public/treadville-media/hero/hero-home-portrait.jpg` |
| `Photography/hero/hero-signature.png` | `hero/hero-signature.jpg` | ... |
| `Photography/categories/coffee/hero-coffee.png` | `categories/coffee/hero-coffee.jpg` | ... |
| `Photography/categories/coffee/cat-coffee-card.png` | `categories/coffee/cat-coffee-card.jpg` | ... |
| `Photography/categories/tea/hero-tea.png` | `categories/tea/hero-tea.jpg` | ... |
| `Photography/categories/tea/cat-tea-card.png` | `categories/tea/cat-tea-card.jpg` | ... |
| `Photography/categories/horticulture/hero-horticulture.png` | `categories/horticulture/hero-horticulture.jpg` | ... |
| `Photography/categories/horticulture/cat-hort-card.png` | `categories/horticulture/cat-hort-card.jpg` | ... |
| `Photography/categories/grains/hero-grains.png` | `categories/grains/hero-grains.jpg` | ... |
| `Photography/categories/grains/cat-grains-card.png` | `categories/grains/cat-grains-card.jpg` | ... |
| `Photography/products/coffee/prod-coffee-pdp.png` | `products/coffee/prod-coffee-pdp.jpg` | ... |
| `Photography/products/coffee/prod-coffee-cherry.png` | `products/coffee/prod-coffee-cherry.jpg` | ... |
| `Photography/products/coffee/prod-coffee-lifestyle.png` | `products/coffee/prod-coffee-lifestyle.jpg` | ... |
| `Photography/products/coffee/prod-coffee-macro.png` | `products/coffee/prod-coffee-macro.jpg` | ... |
| `Photography/products/coffee/prod-coffee-process.png` | `products/coffee/prod-coffee-process.jpg` | ... |
| `Photography/products/coffee/prod-coffee-raw.png` | `products/coffee/prod-coffee-raw.jpg` | ... |
| `Photography/products/tea/prod-tea-process.png` | `products/tea/prod-tea-process.jpg` | ... |
| `Photography/products/grains/prod-grains-harvest.png` | `products/grains/prod-grains-harvest.jpg` | ... |
| `Photography/pages/about/page-about-hero.png` | `pages/about/page-about-hero.jpg` | ... |
| `Photography/pages/quality/page-quality.png` | `pages/quality/page-quality.jpg` | ... |
| `Photography/pages/export/hero-export.png` | `pages/export/hero-export.jpg` | ... |
| `Photography/pages/export/page-export-doc.png` | `pages/export/page-export-doc.jpg` | ... |
| `Photography/provenance/provenance-landscape.png` | `provenance/provenance-landscape.jpg` | ... |
| `Photography/provenance/provenance-macro.png` | `provenance/provenance-macro.jpg` | ... |
| `Photography/journal/journal-coffee.png` | `journal/journal-coffee.jpg` | ... |
| `Photography/journal/journal-hort.png` | `journal/journal-hort.jpg` | ... |
| `Photography/journal/journal-tea.png` | `journal/journal-tea.jpg` | ... |
| `Photography/review/farm-work.png` | `review/farm-work.jpg` | ... |
| `Photography/review/category-collection.png` | `review/category-collection.jpg` | ... |

(28 images mapped. Missing 2: page_origins_hero, page_journal_hero — flagged in Phase 4.)

**Note on format:** The current PNG files should ideally be re-encoded as WebP or AVIF for production delivery (per direction inventory: "AVIF or WebP for delivery"). The current PNG originals are safe archival copies. Re-encoding step is a Pascal decision — the original PNGs preserve quality.

### Step 3 — Database updates (after Pascal approval, one transaction at a time)

**Categories (safe, low-risk):**
```sql
UPDATE categories SET image_url = 'https://{project}.supabase.co/storage/v1/object/public/treadville-media/categories/coffee/cat-coffee-card.jpg' WHERE slug = 'coffee';
UPDATE categories SET image_url = '.../categories/tea/cat-tea-card.jpg' WHERE slug = 'tea';
UPDATE categories SET image_url = '.../categories/horticulture/cat-hort-card.jpg' WHERE slug = 'horticulture';
UPDATE categories SET image_url = '.../categories/grains/cat-grains-card.jpg' WHERE slug = 'grains';
```

**Products — coffee (REVIEW — needs Pascal per-slug decision):**
```sql
-- Example only; Pascal must confirm primary image for each slug
UPDATE products SET image_url = '.../products/coffee/prod-coffee-pdp.jpg', gallery = ARRAY['.../products/coffee/prod-coffee-macro.jpg','.../products/coffee/prod-coffee-process.jpg']::text[] WHERE slug = 'treadville-moka-espresso';
-- ... repeat for treadville-supreme and treadville-kenya-aa-gold
```

**Products — tea / horticulture / grains (DO NOT execute):** All records are `draft` placeholders. Real catalogue required first.

**Site content — page heroes (only if Pascal approves slot creation):**
```sql
INSERT INTO site_content (key, value) VALUES
  ('page_about_hero', '.../pages/about/page-about-hero.jpg'),
  ('page_quality_hero', '.../pages/quality/page-quality.jpg'),
  ('page_export_hero', '.../pages/export/hero-export.jpg'),
  -- ... etc
ON CONFLICT (key) DO NOTHING;
```
**Caveat:** the components do not currently read these keys. Inserting values without the matching component change has zero visual effect.

---

## Step 4 — Component changes (only with Pascal's approval)

| Component | Change | Risk |
|---|---|---|
| `src/app/shop/[category]/page.tsx:43-45` | Replace pure CSS gradient with image overlay (consuming a new `cat.image_url` use or `site_content.category_hero`) | MEDIUM — changes the visible page hero, may need re-grading |
| `src/app/about/page.tsx`, `/origins`, `/export`, `/quality`, `/journal` | Add `<img>` or `next/image` slot to each page hero | MEDIUM — visible page-level change |
| `src/components/Provenance.tsx` | Optional image backing | LOW — additive |
| `src/components/JournalPreview.tsx` | Optional 3-card image grid | LOW — additive |
| `src/components/HeroSlideshow.tsx:147-150` | Replace persistent SVG `CHAPTERS[0]` with portrait photo | MEDIUM — changes the most visible page; requires careful fallback |

---

## Verification

After any upload or DB change:
1. `npm run build` — must compile clean
2. `npx tsc --noEmit` — must pass
3. Manual UI test of each affected route on desktop + mobile
4. Visual check: image loads, no broken URL, no aspect distortion, no lightbox/hover regressions
5. `git status` + commit if intentional

---

## What I will NOT do without explicit Pascal approval

- Upload to Supabase Storage
- Execute UPDATE / INSERT against `categories`, `products`, or `site_content`
- Modify any component file
- Add new `site_content` keys
- Convert PNGs to WebP/AVIF (preserves archival originals)
- Delete any original PNG
