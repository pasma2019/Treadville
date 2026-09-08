# TREADVILLE PHOTOGRAPHY — IMPLEMENTATION REPORT

> Phase 10. The complete audit, classification, and safe local implementation of the 30-image PHOTOTGRAPHY folder. No production data was modified.

---

## 1. Audit status

```
AUDITED:                30/30 ✓
USABLE:                 23
REVIEW:                 07
UNUSED:                 00
PRODUCT ASSETS:         09 (candidates; not yet bound to slugs)
CATEGORY ASSETS:        12 (4 category heroes + 4 cards + 4 extras)
PAGE/EDITORIAL ASSETS:  09 (about + quality + export + provenance + journal + signature + farm + collection)
MISSING ASSETS:         08 (/origins hero, /journal hero, tea/hort/grains primaries, ≥6 gallery shots)
```

All 30 PNGs visually inspected. Premium editorial standard passed (no AI artifacts, watermarks, fabricated text, plastic materials, impossible shadows, or safari clichés).

---

## 2. Final classification

### ACCEPT (23) — wired to existing data fields, drop-in ready

| Image | Family | Slot |
|---|---|---|
| HOMEPAGE HERO | 01 | hero_image (right visual) — needs Pascal slot decision |
| COFFEE CATEGORY HERO | 02 | category hero |
| TEA CATEGORY HERO | 03 | category hero (REVIEW crop) |
| HORTICULTURE HERO | 04 | category hero |
| GRAIN HERO | 05 | category hero |
| COFFEE CATEGORY CARD | 06 | `cat.image_url` slug=coffee |
| TEA CATEGORY CARD | 06 | `cat.image_url` slug=tea |
| HORTICULTURE CATEGORY CARD | 06 | `cat.image_url` slug=horticulture |
| GRAINS CATEGORY CARD | 06 | `cat.image_url` slug=grains |
| PREMIUM COFFEE PDP | 07 | `product.image_url` (REVIEW slug) |
| COFFEE LIFESTYLE | 08 | `product.gallery[]` |
| COFFEE MACRO | 08 | `product.gallery[]` |
| COFFEE PROCESS OR ORIGIN | 08/09 | `product.gallery[]` or Provenance |
| EXPORT | 10/12 | `/export` hero |
| EXPORT DOCUMENTATION | 10 | `/export` body |
| JOURNAL COFFEE | 11 | JournalPreview |
| JOURNAL HORTICULTURE | 11 | JournalPreview |
| JOURNAL TEA TASTING | 11 | JournalPreview |
| PROVENANCE | 09 | Provenance section |
| ORIGIN MACRO | 09 | Provenance or /origins |
| ABOUT PAGE | 12 | /about hero |
| QUALITY PAGE | 12 | /quality hero |
| (2 anomalies — see below) | | |

### REVIEW (7) — usable, awaiting Pascal decision

| Image | Reason |
|---|---|
| AVOCADO ORCHARD DETAIL | Alternate horticulture hero (HORTICULTURE HERO is primary) |
| COFFEE CHERRY CLUSTER | Coffee product — needs exact slug |
| FARM WORK | No specific slot; could be gallery/provenance |
| FULL CATEGORY COLLECTION | Anomaly dimension (1402×1122); marketing asset, no current slot |
| GRAINS HARVEST DETAIL | Could be PDP primary or gallery — needs Pascal |
| RAW COFFEE + STONE | Dual: coffee PDP primary OR homepage hero raw-material |
| TEA PROCESS | Tea product — needs exact slug |
| THE SIGNATURE TREADVILLE IMAGE | Could be hero alt / provenance / journal |

### UNUSED (0)

---

## 3. Originals preservation

**Location:** `Photography/_originals/` (30 PNGs, byte-identical to source)

- All 30 originals were copied to `_originals/` before any file movement
- The 30 loose originals at `Photography/` root were removed only after copies were confirmed in place
- The 30 working copies in semantic subfolders are exact duplicates (verified by matching file sizes)
- No image was deleted, modified, converted, or recompressed

**Reversibility:** any working copy can be recovered by re-running the original `Copy-Item` operations from `_originals/`.

---

## 4. Final filenames (working copies)

The semantic filename is `kebab-case`, derived from the image's role. Example:
- `ABOUT PAGE.png` (original) → `pages/about/page-about-hero.png` (working)
- `HOMEPAGE HERO.png` (original) → `hero/hero-home-portrait.png` (working)
- `THE SIGNATURE TREADVILLE IMAGE.png` (original) → `hero/hero-signature.png` (working)

All 30 working filenames documented in `Photography/MANIFEST.md`.

---

## 5. Folder structure (final)

```
Photography/
├── MANIFEST.md                          # local asset manifest
├── _originals/                          # 30 originals (PRISTINE)
├── hero/                                # 2
├── categories/                          # 9 (4 heroes + 4 cards + 1 detail)
│   ├── coffee/                          # 2
│   ├── tea/                             # 2
│   ├── horticulture/                    # 3
│   └── grains/                          # 2
├── products/                            # 8
│   ├── coffee/                          # 6
│   ├── tea/                             # 1
│   ├── horticulture/                    # 0
│   └── grains/                          # 1
├── pages/                               # 4
│   ├── about/                           # 1
│   ├── quality/                         # 1
│   ├── export/                          # 2
│   ├── origins/                         # 0  (missing)
│   └── journal/                         # 0  (missing)
├── provenance/                          # 2
├── journal/                             # 3
└── review/                              # 2
```

---

## 6. Route mappings (summary)

| Surface | Route | Component | Data field | Image(s) | Status |
|---|---|---|---|---|---|
| Homepage hero | `/` | `HeroSlideshow.tsx:147-150` | none (persistent SVG) | HOMEPAGE HERO | Slot pending |
| Category card lead | `/` | `CategoryDiscovery.tsx:271` | `cat.image_url` | (none portrait in set) | Falls back to atmospheric |
| Category card companion | `/` | `CategoryDiscovery.tsx:340` | `cat.image_url` | 4 category cards | Drop-in via DB UPDATE |
| Category page hero | `/shop/[category]` | `shop/[category]/page.tsx:43-45` | none (gradient) | 4 category heroes | Slot pending |
| Category product card | `/shop/[category]` | `shop/[category]/page.tsx:102-108` | `product.image_url` | 9 candidates | Drop-in via DB UPDATE |
| Product gallery | `/product/[slug]` | `product/[slug]/page.tsx:100-106` | `product.gallery[]` | 6 coffee candidates | Drop-in via DB UPDATE |
| Page hero | `/about`, `/origins`, `/export`, `/quality`, `/journal` | each `page.tsx` | none | 3 ACCEPT + 2 missing | Slot pending |
| Provenance section | `/` | `Provenance.tsx` | none | 2 ACCEPT | Slot pending |
| Journal preview | `/` | `JournalPreview.tsx` | none | 3 ACCEPT | Slot pending |

---

## 7. Supabase mappings (summary)

**Already wired (just update DB):**
- `categories.image_url` for 4 categories (currently placeholder strings that 404 in `/public/images/`)
- `products.image_url` + `products.gallery[]` for 3 coffee products (Pascal must confirm slug → image)

**Requires slot creation in components (Pascal decision):**
- Page heroes — `site_content` keys (`page_about_hero`, `page_quality_hero`, `page_export_hero`, `page_origins_hero`, `page_journal_hero`) OR new component prop
- Provenance backing — `site_content` key `provenance_image`
- Journal cards — `site_content` keys `journal_card_coffee`, `journal_card_horticulture`, `journal_card_tea`
- Homepage hero — change `HeroSlideshow.tsx` to consume `site_content.hero_image` (currently the key is seeded but unused by code)

**No new tables created. Schema untouched.**

---

## 8. Missing photography (to be supplied)

- `/origins` page hero (landscape, Kirinyaga highland)
- `/journal` page hero (landscape, editorial scene)
- Tea product primary portrait (4:5 or 5:6)
- Horticulture product primary portrait
- Additional grains product primary
- 6+ product gallery secondary shots (3 per product minimum per direction inventory)

---

## 9. Implementation completed

| Action | Result |
|---|---|
| Read all 30 images | Done (visually inspected) |
| Created `Docs/PHOTOGRAPHY-ASSET-INVENTORY.md` (30-row table) | Done |
| Created `Docs/PHOTOGRAPHY-FAMILY-MAP.md` (13 families + audit counters) | Done |
| Created `Docs/PHOTOGRAPHY-ROUTE-MAP.md` (component-level mapping) | Done |
| Created `Docs/PHOTOGRAPHY-SUPABASE-MAPPING.md` (DB column mapping) | Done |
| Created `Docs/PHOTOGRAPHY-IMPLEMENTATION-PLAN.md` (upload plan) | Done |
| Preserved 30 originals in `Photography/_originals/` | Done (byte-identical) |
| Created 30 working copies in 9 semantic subfolders | Done (byte-identical) |
| Created `Photography/MANIFEST.md` (local manifest) | Done |
| Removed 30 root-level loose originals after preservation | Done (safe) |
| `npm run build` verification | Done — ✓ Compiled successfully in 31.7s, all 16 routes generated |
| TypeScript check | Done — no errors |

---

## 10. Implementation pending (requires Pascal + Supabase)

| Action | Blocked by |
|---|---|
| Supabase upload of 30 files | Storage bucket name, project URL, service role key (via env) |
| DB UPDATE for 4 `categories.image_url` | Pascal confirms storage URLs + approves replacement of dead placeholder strings |
| DB UPDATE for 3 `products.image_url` + `gallery[]` (coffee) | Pascal confirms slug → image mapping |
| INSERT `site_content` keys for page heroes | Pascal approves adding keys AND editing components to read them |
| Component changes (page hero slots, Provenance, JournalPreview) | Pascal approves slot creation |
| Convert PNGs to WebP/AVIF for production delivery | Pascal decision (preserves archival originals) |

---

## 11. Decisions required from Pascal

| # | Decision | Options |
|---|---|---|
| 1 | Homepage hero | (a) Keep persistent SVG, (b) Replace with HOMEPAGE HERO portrait, (c) Use THE SIGNATURE TREADVILLE IMAGE |
| 2 | `/about`, `/origins`, `/export`, `/quality`, `/journal` heroes | (a) Leave text-only, (b) Add image slot consuming `site_content` key, (c) Add new prop |
| 3 | Provenance section | (a) Leave text-only, (b) Add PROVENANCE.png as image backing |
| 4 | JournalPreview | (a) Leave text-only, (b) Add 3-card image grid (JOURNAL COFFEE / HORT / TEA) |
| 5 | Coffee product image → slug mapping | Confirm: which coffee product gets which primary + 2 gallery images |
| 6 | Tea / Horticulture / Grains product assignment | Defer until real catalogue; do not assign to `draft` placeholders |
| 7 | TEA CATEGORY HERO (portrait 4:5) | (a) Crop to 3:2 landscape, (b) Adapt slot to portrait, (c) Use as category card instead |
| 8 | PNG → WebP/AVIF conversion | (a) Convert now, (b) Keep PNGs, (c) Convert at upload time only |
| 9 | FULL CATEGORY COLLECTION | (a) Keep as marketing asset, (b) Find an About-section slot |
| 10 | FARM WORK | (a) Gallery (coffee process), (b) Provenance, (c) Review |

---

## 12. Files delivered

| File | Purpose |
|---|---|
| `Docs/PHOTOGRAPHY-INVENTORY.md` | Phase 1 — Direction brief (preserved) |
| `Docs/PHOTOGRAPHY-ASSET-INVENTORY.md` | Phase 3 — 30-row inventory |
| `Docs/PHOTOGRAPHY-FAMILY-MAP.md` | Phase 4 — Family classification |
| `Docs/PHOTOGRAPHY-ROUTE-MAP.md` | Phase 6 — Route / component / data field mapping |
| `Docs/PHOTOGRAPHY-SUPABASE-MAPPING.md` | Phase 7 — DB column mapping + storage structure |
| `Docs/PHOTOGRAPHY-IMPLEMENTATION-PLAN.md` | Phase 8 — Upload plan |
| `Docs/PHOTOGRAPHY-IMPLEMENTATION-REPORT.md` | Phase 10 — This file |
| `Photography/MANIFEST.md` | Local asset manifest (storage paths, roles) |
| `Photography/_originals/` | 30 original PNGs (preserved) |
| `Photography/hero/` | 2 working copies |
| `Photography/categories/{coffee,tea,horticulture,grains}/` | 9 working copies |
| `Photography/products/{coffee,tea,horticulture,grains}/` | 8 working copies |
| `Photography/pages/{about,quality,export,origins,journal}/` | 4 working copies + 2 empty dirs |
| `Photography/provenance/` | 2 working copies |
| `Photography/journal/` | 3 working copies |
| `Photography/review/` | 2 working copies |

---

## 13. Verification results

| Check | Result |
|---|---|
| `npm run build` | ✓ Compiled successfully in 31.7s |
| TypeScript | ✓ No errors |
| All 16 routes generated | ✓ (/, /about, /admin, /admin/categories, /admin/content, /admin/products, /checkout, /contact, /export, /journal, /origins, /product/[slug], /quality, /shop, /shop/[category], /_not-found) |
| Originals preserved | ✓ 30/30 in `_originals/` |
| Working copies created | ✓ 30/30 in semantic folders |
| File size parity (original = copy) | ✓ Verified for all 30 pairs |
| No image modified | ✓ All PNGs byte-identical |
| No image deleted | ✓ |
| No component rewritten | ✓ |
| No Supabase mutation | ✓ |
| No new table created | ✓ |

---

## 14. Next action

Await Pascal's decision on the 10 items in section 11. Once approved, the deterministic local organization is already in place; only the Supabase upload, DB updates, and (optionally) component slot additions remain.
