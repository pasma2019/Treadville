# TREADVILLE PHOTOGRAPHY — ROUTE MAP

> Phase 6. For every ACCEPT-classified image, the actual current route, component, and data field are listed. Verified from the live codebase (not assumptions).

---

## Verified live architecture (read from code)

| Surface | Route | Component | Data field | Current state |
|---|---|---|---|---|
| Homepage hero | `/` | `src/components/HeroSlideshow.tsx:147-150` | none (persistent SVG `CHAPTERS[0]`) | SVG scene only |
| Category card (lead) | `/` (CategoryDiscovery) | `src/components/CategoryDiscovery.tsx:271-277` | `cat.image_url` | Falls back to atmospheric gradient + ChapterMark if null |
| Category card (companion) | `/` (CategoryDiscovery) | `src/components/CategoryDiscovery.tsx:340-347` | `cat.image_url` | Same fallback |
| Category page hero | `/shop/[category]` | `src/app/shop/[category]/page.tsx:43-44` | none (radial gradient `categoryAtmosphere()`) | Gradient only — no image slot |
| Category product card | `/shop/[category]` | `src/app/shop/[category]/page.tsx:102-108` | `product.image_url` | Falls back to CategoryMark placeholder if null |
| Product gallery (PDP) | `/product/[slug]` | `src/app/product/[slug]/page.tsx:100-106` | `product.image_url` + `product.gallery[]` | Already wired — uses `ProductGallery` |
| Page hero (5 pages) | `/about`, `/origins`, `/export`, `/quality`, `/journal` | each `page.tsx` | none — text-only with dark gradient | No image slot exists |
| Provenance section | `/` | `src/components/Provenance.tsx` | none | Text + topographic SVG; no photo slot |

---

## Image-to-route assignments (ACCEPT-classified only)

### 01 — Hero
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| HOMEPAGE HERO.png | `hero/hero-home-portrait.png` | `/` (homepage) | `HeroSlideshow.tsx` right visual (currently persistent SVG) | Not currently data-driven for hero photo | 2:3 portrait | Replace SVG OR add behind-typed overlay; requires Pascal component decision |

### 02 — Coffee category hero
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| COFFEE CATEGORY HERO.png | `categories/coffee/hero-coffee.png` | `/shop/coffee` | `src/app/shop/[category]/page.tsx:43-45` atmosphere div | none (would need new prop OR `cat.image_url` secondary use) | 3:2 landscape | Slot is gradient-only; hero needs new image-prop OR change `categoryAtmosphere()` to consume an image |

### 03 — Tea category hero
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| TEA CATEGORY HERO.png | `categories/tea/hero-tea.png` | `/shop/tea` | `src/app/shop/[category]/page.tsx:43-45` | none (as above) | 4:5 portrait — image is portrait; slot is wide | REVIEW — component must accommodate portrait, or image cropped landscape |

### 04 — Horticulture category hero
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| HORTICULTURE HERO.png | `categories/horticulture/hero-horticulture.png` | `/shop/horticulture` | `src/app/shop/[category]/page.tsx:43-45` | none | 3:2 landscape | Same as coffee hero — needs slot change |

### 05 — Grains category hero
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| GRAIN HERO.png | `categories/grains/hero-grains.png` | `/shop/grains` | `src/app/shop/[category]/page.tsx:43-45` | none | 3:2 landscape | Same as above |

### 06 — Category cards
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| COFFEE CATEGORY CARD.png | `categories/coffee/cat-coffee-card.png` | `/` (CategoryDiscovery) | `CategoryDiscovery.tsx:177-184, 273, 342` `CategoryImageLayerFor` | `cat.image_url` for category slug `coffee` | 4:3 landscape (companion) | Wire via `UPDATE categories SET image_url = ... WHERE slug='coffee'` |
| TEA CATEGORY CARD.png | `categories/tea/cat-tea-card.png` | `/` (CategoryDiscovery) | same | `cat.image_url` for slug `tea` | 4:3 landscape | same |
| HORTICULTURE CATEGORY CARD.png | `categories/horticulture/cat-hort-card.png` | `/` (CategoryDiscovery) | same | `cat.image_url` for slug `horticulture` | 4:3 landscape | same |
| GRAINS CATEGORY CARD.png | `categories/grains/cat-grains-card.png` | `/` (CategoryDiscovery) | same | `cat.image_url` for slug `grains` | 4:3 landscape | same |

### 07 — Product primary
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| PREMIUM COFFEE PDP.png | `products/coffee/prod-coffee-pdp.png` | `/product/treadville-moka-espresso` (closest match by use) | `ProductGallery` via `product.image_url` | `products.image_url` for matching slug | 5:6 portrait (cropped from 3:2) | Pascal must confirm exact slug match. Currently seed: moka-espresso, supreme, kenya-aa-gold |

### 09 — Provenance
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| PROVENANCE.png | `provenance/provenance-landscape.png` | `/` (Provenance section) | `src/components/Provenance.tsx` | none — no image slot | 3:2 landscape | Add image slot if Pascal approves |
| ORIGIN MACRO.png | `provenance/provenance-macro.png` | `/` (Provenance section) or `/origins` page hero | same | none | 3:2 landscape | Same slot decision |

### 10 — Export / story
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| EXPORT.png | `pages/export/hero-export.png` | `/export` page hero | `src/app/export/page.tsx` | none | 3:2 landscape | Add image slot to page hero |
| EXPORT DOCUMENTATION.png | `pages/export/page-export-doc.png` | `/export` page (in-body section) | depends on page structure | none | 3:2 landscape | Section body / inline editorial |

### 11 — Journal preview
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| JOURNAL COFFEE.png | `journal/journal-coffee.png` | `/` (JournalPreview) or `/journal` | `src/components/JournalPreview.tsx` | none | 3:2 landscape | Slot not yet created |
| JOURNAL HORTICULTURE.png | `journal/journal-hort.png` | same | same | none | 3:2 landscape | same |
| JOURNAL TEA TASTING.png | `journal/journal-tea.png` | same | same | none | 3:2 landscape | same |

### 12 — Page heroes
| Image | Working filename | Route | Component | Data field | Crop | Notes |
|---|---|---|---|---|---|---|
| ABOUT PAGE.png | `pages/about/page-about-hero.png` | `/about` | `src/app/about/page.tsx` | none | 3:2 landscape | Add image slot |
| QUALITY PAGE.png | `pages/quality/page-quality.png` | `/quality` | `src/app/quality/page.tsx` | none | 3:2 landscape | Add image slot |
| EXPORT.png | `pages/export/hero-export.png` | `/export` (also listed in family 10) | same | none | 3:2 landscape | One image serves both family 10 and 12; treat as page hero for `/export` |

---

## Slot architecture summary

**Already data-driven (drop image in DB, no code change needed):**
- `cat.image_url` → 4 category cards (family 06)
- `product.image_url` → product primary (family 07) — needs slug
- `product.gallery[]` → product gallery (family 08) — needs slug
- `site_content.hero_image` → dead code (not used by `HeroSlideshow`)

**Not data-driven (slot must be created — Pascal decision required):**
- Homepage hero photo (HeroSlideshow right visual)
- Category page hero (per `src/app/shop/[category]/page.tsx`)
- Page heroes (`/about`, `/origins`, `/export`, `/quality`, `/journal`)
- Provenance section (image backing)
- Journal preview (3-card image grid)

**Missing routes (no images):**
- `/origins` page hero
- `/journal` page hero
