# TREADVILLE PHOTOGRAPHY — SUPABASE MAPPING

> Phase 7. Maps accepted images to existing `categories`, `products`, and `site_content` tables. No new tables created. No records invented.

---

## Schema reference (verified from `supabase/schema.sql`)

| Table | Key image columns | Notes |
|---|---|---|
| `categories` | `image_url text` | Single image per category |
| `products` | `image_url text` + `gallery text[]` | Primary + 0..N gallery |
| `site_content` | `key text unique`, `value text` | Free-form key/value. `hero_image` key currently seeded but unused by code |

**No new tables needed.** All image data lives in these three existing columns.

---

## Categories (4 records seeded, 4 card images)

| Category slug | Current seed `image_url` | Recommended image (working) | Recommended storage path | Status |
|---|---|---|---|---|
| `coffee` | `/images/category-coffee.jpg` | `cat-coffee-card.png` | `categories/coffee/cat-coffee-card.png` | UPDATE `image_url` |
| `tea` | `/images/category-tea.jpg` | `cat-tea-card.png` | `categories/tea/cat-tea-card.png` | UPDATE `image_url` |
| `horticulture` | `/images/category-horticulture.jpg` | `cat-hort-card.png` | `categories/horticulture/cat-hort-card.png` | UPDATE `image_url` |
| `grains` | `/images/category-grains.jpg` | `cat-grains-card.png` | `categories/grains/cat-grains-card.png` | UPDATE `image_url` |

**Storage path** corresponds to the planned Supabase Storage folder: `treadville-media/categories/{slug}/{filename}.jpg`

---

## Products (9 records seeded)

The 7 product images (after slug mapping decision) are candidates for the 9 product records. Most product records (tea, horticulture, grains) are currently `draft` placeholders. **No product-specific association is forced; all are flagged REVIEW until Pascal confirms the real Treadville catalogue is ready.**

### Coffee products (3 records, all `published`)

| Product slug | Current `image_url` | Current `gallery` | Candidate images | Confidence |
|---|---|---|---|---|
| `treadville-moka-espresso` | `/images/product-moka-espresso.jpg` | `{}` | `prod-coffee-pdp.png` (primary) + `prod-coffee-macro.png` + `prod-coffee-process.png` + `prod-coffee-lifestyle.png` | MEDIUM (REVIEW — Pascal must pick which product gets `prod-coffee-pdp.png`) |
| `treadville-supreme` | `/images/product-supreme.jpg` | `{}` | `prod-coffee-cherry.png` (primary) + 2 gallery candidates | LOW (REVIEW) |
| `treadville-kenya-aa-gold` | `/images/product-kenya-aa.jpg` | `{}` | `prod-coffee-raw.png` (primary) + 2 gallery candidates | LOW (REVIEW) |

**Gallery distribution proposal (REVIEW):** distribute 6 coffee gallery candidates across 3 products, 2 per product:
- Moka Espresso: `prod-coffee-pdp.png` (primary) + `prod-coffee-macro.png` + `prod-coffee-process.png` (gallery)
- Supreme: `prod-coffee-cherry.png` (primary) + `prod-coffee-lifestyle.png` (gallery)
- Kenya AA Gold: `prod-coffee-raw.png` (primary) + remaining 1 from coffee set

**Action:** Do NOT overwrite the existing seed `image_url` until Pascal decides. The current `/images/product-*.jpg` placeholders are non-functional anyway (file does not exist in `/public/images/`); they will silently 404 if no update occurs.

### Tea products (2 records, all `draft`)

| Product slug | Current `image_url` | Status | Candidate primary | Candidate gallery |
|---|---|---|---|---|
| `black-tea-demo` | `/images/product-placeholder-tea.jpg` | draft, placeholder | `prod-tea-process.png` (REVIEW) | none |
| `specialty-tea-demo` | `/images/product-placeholder-tea.jpg` | draft, placeholder | none (no tea primary in set) | none |

**Action:** No product image should be assigned to a draft placeholder product without Pascal's confirmation. Tea catalogue real data required first.

### Horticulture products (2 records, all `draft`)

| Product slug | Current `image_url` | Status | Candidate primary | Candidate gallery |
|---|---|---|---|---|
| `fresh-produce-demo` | `/images/product-placeholder-hort.jpg` | draft | none (no horticulture primary in set) | none |
| `export-horticulture-demo` | `/images/product-placeholder-hort.jpg` | draft | none | none |

**Action:** Same — no assignment without real catalogue.

### Grains products (2 records, all `draft`)

| Product slug | Current `image_url` | Status | Candidate primary | Candidate gallery |
|---|---|---|---|---|
| `maize-demo` | `/images/product-placeholder-grain.jpg` | draft | `prod-grains-harvest.png` (REVIEW) | none |
| `rice-demo` | `/images/product-placeholder-grain.jpg` | draft | none | none |

**Action:** Same — no assignment without real catalogue. Grains harvest detail could potentially go to the maize demo if Pascal approves.

---

## Page-level imagery (existing schema, no new tables)

The page heroes (`/about`, `/origins`, `/export`, `/quality`, `/journal`) and section-level imagery (Provenance, JournalPreview) have **no existing data field** in the current schema. Options:

### Option A — Use `site_content` (already exists, free-form)
- Add new keys: `page_about_hero`, `page_origins_hero`, `page_export_hero`, `page_quality_hero`, `page_journal_hero`, `provenance_image`, `journal_card_coffee`, `journal_card_horticulture`, `journal_card_tea`, `homepage_hero_portrait`
- Each value = full Supabase Storage URL
- No schema change. Components must be edited to read these keys (Pascal decision — currently the 5 page heroes and Provenance section are pure CSS gradient + type)

### Option B — Extend existing tables
- Add column `page_hero_url` to `site_content` (would require JSON value with key per page) OR create a separate `pages` table
- **NOT recommended** for prototype; Option A is the smaller change

**Decision required from Pascal.** This document does not implement either; the safest non-destructive action is to record the intended keys here for a future manual migration.

---

## Summary of safe updates (zero-risk, can be executed without Pascal)

| Action | Risk | Note |
|---|---|---|
| Set `categories.image_url` for 4 categories from `/images/category-*.jpg` to Supabase Storage URLs | LOW (only affects category cards; current values are dead placeholders anyway) | Once Pascal confirms storage URLs |
| Set `products.image_url` for the 3 coffee products | MEDIUM (overwrites placeholder URLs that already 404) | Pascal must confirm slug → image mapping first |
| Set `products.gallery[]` for the 3 coffee products | MEDIUM (new data, no overwrite of existing) | Pascal must confirm assignment |
| Set `products.image_url` for the 6 draft placeholders (tea, hort, grains) | HIGH — overwrites placeholder URLs of a placeholder product | DO NOT DO without Pascal sign-off + real catalogue |
| Add `site_content` keys for page heroes | NONE if using INSERT — no overwrites | But the components do not yet read these keys |

---

## Supabase Storage structure (planned)

```
treadville-media/
├── hero/
│   ├── hero-home-portrait.jpg       (HOMEPAGE HERO.png)
│   └── hero-signature.jpg           (THE SIGNATURE TREADVILLE IMAGE.png)  [REVIEW]
├── categories/
│   ├── coffee/
│   │   ├── hero-coffee.jpg          (COFFEE CATEGORY HERO.png)
│   │   └── cat-coffee-card.jpg      (COFFEE CATEGORY CARD.png)
│   ├── tea/
│   │   ├── hero-tea.jpg             (TEA CATEGORY HERO.png)
│   │   └── cat-tea-card.jpg         (TEA CATEGORY CARD.png)
│   ├── horticulture/
│   │   ├── hero-horticulture.jpg    (HORTICULTURE HERO.png)
│   │   └── cat-hort-card.jpg        (HORTICULTURE CATEGORY CARD.png)
│   └── grains/
│       ├── hero-grains.jpg          (GRAIN HERO.png)
│       └── cat-grains-card.jpg      (GRAINS CATEGORY CARD.png)
├── products/
│   ├── coffee/                      (5 images — see Phase 8)
│   ├── tea/
│   │   └── prod-tea-process.jpg
│   ├── horticulture/                (empty — no image in set)
│   └── grains/
│       └── prod-grains-harvest.jpg
├── pages/
│   ├── about/page-about-hero.jpg
│   ├── quality/page-quality.jpg
│   ├── export/hero-export.jpg
│   ├── export/page-export-doc.jpg
│   ├── origins/                     (empty — image missing)
│   └── journal/                     (empty — image missing)
├── provenance/
│   ├── provenance-landscape.jpg
│   └── provenance-macro.jpg
├── journal/
│   ├── journal-coffee.jpg
│   ├── journal-hort.jpg
│   └── journal-tea.jpg
└── review/                          (REVIEW items — FARM WORK, FULL CATEGORY COLLECTION, signature)
```

---

## What was NOT done (deliberately)

- No database updates performed
- No `site_content` keys added
- No product `image_url` or `gallery` written
- No new tables created
- No Supabase upload attempted (credentials, permissions, and storage bucket not verified)
