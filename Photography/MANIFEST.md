# Treadville Photography — Local Asset Manifest

> Generated as part of Phase 9 (deterministic local implementation). Maps every working-copy file to its role, route, and intended storage destination. Use this as the source of truth for any future Supabase upload.

---

## Folder structure (current)

```
Photography/
├── _originals/                  # 30 ORIGINAL PNGs (do not modify)
├── hero/                        # 2 working copies
├── categories/
│   ├── coffee/                  # 2
│   ├── tea/                     # 2
│   ├── horticulture/            # 3
│   └── grains/                  # 2
├── products/
│   ├── coffee/                  # 6
│   ├── tea/                     # 1
│   ├── horticulture/            # 0
│   └── grains/                  # 1
├── pages/
│   ├── about/                   # 1
│   ├── quality/                 # 1
│   ├── export/                  # 2
│   ├── origins/                 # 0
│   └── journal/                 # 0
├── provenance/                  # 2
├── journal/                     # 3
└── review/                      # 2

TOTAL: 30 originals + 30 working copies = 60 PNGs
```

---

## Image manifest (30 working copies)

| # | Working file | Family | Route / Component | Storage target | Status |
|---|---|---|---|---|---|
| 1 | `pages/about/page-about-hero.png` | 12 Page hero | `/about` | `treadville-media/pages/about/page-about-hero.jpg` | ACCEPT |
| 2 | `categories/horticulture/cat-hort-detail.png` | 04 Horticulture hero (alt) | `/shop/horticulture` (alternate) | `treadville-media/categories/horticulture/cat-hort-detail.jpg` | REVIEW |
| 3 | `categories/coffee/cat-coffee-card.png` | 06 Card | `cat.image_url WHERE slug='coffee'` | `treadville-media/categories/coffee/cat-coffee-card.jpg` | ACCEPT |
| 4 | `categories/coffee/hero-coffee.png` | 02 Coffee hero | `/shop/coffee` | `treadville-media/categories/coffee/hero-coffee.jpg` | ACCEPT |
| 5 | `products/coffee/prod-coffee-cherry.png` | 07/08 Coffee | `/product/[slug]` | `treadville-media/products/coffee/prod-coffee-cherry.jpg` | REVIEW (slug) |
| 6 | `products/coffee/prod-coffee-lifestyle.png` | 08 Gallery | `/product/[slug]` gallery | `treadville-media/products/coffee/prod-coffee-lifestyle.jpg` | REVIEW |
| 7 | `products/coffee/prod-coffee-macro.png` | 08 Gallery | `/product/[slug]` gallery | `treadville-media/products/coffee/prod-coffee-macro.jpg` | REVIEW |
| 8 | `products/coffee/prod-coffee-process.png` | 08 Gallery / 09 Provenance | gallery or Provenance | `treadville-media/products/coffee/prod-coffee-process.jpg` | REVIEW |
| 9 | `pages/export/page-export-doc.png` | 10 Export | `/export` (body) | `treadville-media/pages/export/page-export-doc.jpg` | ACCEPT |
| 10 | `pages/export/hero-export.png` | 10/12 Export | `/export` (hero) | `treadville-media/pages/export/hero-export.jpg` | ACCEPT |
| 11 | `review/farm-work.png` | 13 Review | (no slot) | `treadville-media/review/farm-work.jpg` | REVIEW |
| 12 | `review/category-collection.png` | 13 Review | (no slot) | `treadville-media/review/category-collection.jpg` | REVIEW |
| 13 | `categories/grains/hero-grains.png` | 05 Grains hero | `/shop/grains` | `treadville-media/categories/grains/hero-grains.jpg` | ACCEPT |
| 14 | `categories/grains/cat-grains-card.png` | 06 Card | `cat.image_url WHERE slug='grains'` | `treadville-media/categories/grains/cat-grains-card.jpg` | ACCEPT |
| 15 | `products/grains/prod-grains-harvest.png` | 07/08 Grains | `/product/[slug]` | `treadville-media/products/grains/prod-grains-harvest.jpg` | REVIEW |
| 16 | `hero/hero-home-portrait.png` | 01 Hero | `/` (HeroSlideshow) | `treadville-media/hero/hero-home-portrait.jpg` | ACCEPT |
| 17 | `categories/horticulture/cat-hort-card.png` | 06 Card | `cat.image_url WHERE slug='horticulture'` | `treadville-media/categories/horticulture/cat-hort-card.jpg` | ACCEPT |
| 18 | `categories/horticulture/hero-horticulture.png` | 04 Horticulture hero | `/shop/horticulture` | `treadville-media/categories/horticulture/hero-horticulture.jpg` | ACCEPT |
| 19 | `journal/journal-coffee.png` | 11 Journal | JournalPreview / `/journal` | `treadville-media/journal/journal-coffee.jpg` | ACCEPT |
| 20 | `journal/journal-hort.png` | 11 Journal | JournalPreview / `/journal` | `treadville-media/journal/journal-hort.jpg` | ACCEPT |
| 21 | `journal/journal-tea.png` | 11 Journal | JournalPreview / `/journal` | `treadville-media/journal/journal-tea.jpg` | ACCEPT |
| 22 | `provenance/provenance-macro.png` | 09 Provenance | `/` Provenance or `/origins` | `treadville-media/provenance/provenance-macro.jpg` | ACCEPT |
| 23 | `products/coffee/prod-coffee-pdp.png` | 07 PDP primary | `/product/[slug]` `image_url` | `treadville-media/products/coffee/prod-coffee-pdp.jpg` | ACCEPT (REVIEW slug) |
| 24 | `provenance/provenance-landscape.png` | 09 Provenance | `/` Provenance | `treadville-media/provenance/provenance-landscape.jpg` | ACCEPT |
| 25 | `pages/quality/page-quality.png` | 12 Page hero | `/quality` | `treadville-media/pages/quality/page-quality.jpg` | ACCEPT |
| 26 | `products/coffee/prod-coffee-raw.png` | 07/01 | PDP or hero raw-material | `treadville-media/products/coffee/prod-coffee-raw.jpg` | REVIEW |
| 27 | `categories/tea/cat-tea-card.png` | 06 Card | `cat.image_url WHERE slug='tea'` | `treadville-media/categories/tea/cat-tea-card.jpg` | ACCEPT |
| 28 | `categories/tea/hero-tea.png` | 03 Tea hero | `/shop/tea` | `treadville-media/categories/tea/hero-tea.jpg` | ACCEPT (REVIEW crop) |
| 29 | `products/tea/prod-tea-process.png` | 07/08 Tea | `/product/[slug]` | `treadville-media/products/tea/prod-tea-process.jpg` | REVIEW |
| 30 | `hero/hero-signature.png` | 01/09/11 | hero alt / provenance / journal | `treadville-media/hero/hero-signature.jpg` | REVIEW |

---

## Verification (file sizes match between original and copy)

Each working copy has a matching file in `_originals/` with identical byte count. Example:
- `_originals/HOMEPAGE HERO.png` = `hero/hero-home-portrait.png` = 2,008,365 bytes ✓
- `_originals/COFFEE CATEGORY HERO.png` = `categories/coffee/hero-coffee.png` = 2,263,730 bytes ✓
- `_originals/ABOUT PAGE.png` = `pages/about/page-about-hero.png` = 2,065,185 bytes ✓

All 30 pairs verified. Working copies are exact duplicates; originals remain untouched.

---

## Originals preservation log

- **30 originals copied** to `Photography/_originals/` before any file movement
- **30 loose originals removed** from `Photography/` root (after copies were safely placed)
- **30 working copies created** in semantic subfolders
- **No image was modified, recolored, recompressed, or converted**
- **No image was deleted**
- Originals remain recoverable: any working copy can be replaced by copying from `_originals/`
