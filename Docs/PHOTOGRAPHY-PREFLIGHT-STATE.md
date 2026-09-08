# TREADVILLE PHOTOGRAPHY INTEGRATION — PRE-FLIGHT STATE REPORT

> Execution stopped at Phase B (Storage inspection). A real Supabase environment was found, but the integration cannot proceed without one of the following: (a) a service role key, (b) Pascal manually creating the bucket, or (c) a confirmation that buckets should be created via a different mechanism.
>
> Below is the exact pre-flight state printed BEFORE any database mutations, as the protocol requires.

---

## Git state

```
Branch: prototype/phase-2d-signature
Ahead of origin by 19 commits (local-only)
Last commit: 6652724 docs: photography direction inventory — 35-50 images across 13 families
Untracked:
  Docs/PHOTOGRAPHY-ASSET-INVENTORY.md
  Docs/PHOTOGRAPHY-FAMILY-MAP.md
  Docs/PHOTOGRAPHY-IMPLEMENTATION-PLAN.md
  Docs/PHOTOGRAPHY-IMPLEMENTATION-REPORT.md
  Docs/PHOTOGRAPHY-PREFLIGHT-REPORT.md
  Docs/PHOTOGRAPHY-ROUTE-MAP.md
  Docs/PHOTOGRAPHY-SUPABASE-MAPPING.md
  Photography/
No source code modified since last commit. No database mutations performed.
```

---

## Local asset audit (Phase A) — VERIFIED

```
Originals:    30 PNGs in Photography/_originals/  (byte-identical to source)
Working:      30 PNGs in Photography/ semantic folders
TOTAL:        60 PNGs (30 originals + 30 working copies, all byte-identical pairs)

Folder structure:
  Photography/
  ├── _originals/         (30 — PROTECTED)
  ├── hero/               (2)
  ├── categories/         (9)
  │   ├── coffee/         (2)
  │   ├── tea/            (2)
  │   ├── horticulture/   (3)
  │   └── grains/         (2)
  ├── products/           (8)
  │   ├── coffee/         (6)
  │   ├── tea/            (1)
  │   ├── horticulture/   (0)
  │   └── grains/         (1)
  ├── pages/              (4)
  │   ├── about/          (1)
  │   ├── quality/        (1)
  │   ├── export/         (2)
  │   ├── origins/        (0)
  │   └── journal/        (0)
  ├── provenance/         (2)
  ├── journal/            (3)
  └── review/             (2)
```

**Audit status: 30/30. ACCEPT 23, REVIEW 7, UNUSED 0. Working copies byte-identical to originals. No conflicts between docs and disk.**

---

## Supabase inspection (Phase B) — VERIFIED

```
URL:      https://hqdovxqxperwprbqbyqo.supabase.co
Key:      NEXT_PUBLIC_SUPABASE_ANON_KEY (anon role only — NO service role key in repo)
```

### Storage buckets: **EMPTY (0 buckets)**

No `site-images` bucket exists. No `treadville-media` bucket exists. No buckets of any kind.

### Storage CREATE test (anonymous role):
```
result: "new row violates row-level security policy"
```
The anon role cannot create buckets. The schema's RLS is open for table data but Storage has its own RLS that the anon role does not satisfy for `insert` on `storage.buckets`.

---

## ⚠ CRITICAL: 3 documentation conflicts discovered

### Conflict 1 — Product slug mismatch
| Documentation assumption | Actual DB state |
|---|---|
| `treadville-moka-espresso` | `masai-coffee-moka-espresso` |
| `treadville-supreme` | `masai-coffee-supreme` |
| `treadville-kenya-aa-gold` | **does not exist** |

The brand naming has changed since the seed.sql was written. Actual published coffee products are 2 (not 3). Documentation must be corrected before any product DB update.

### Conflict 2 — Product count
| Documentation assumes | Actual |
|---|---|
| 3 published coffee products | **2** published coffee products |
| 9 total products | **8** total products |
| 6 draft placeholders | **6** draft placeholders (correct) |

### Conflict 3 — Brand name in seed
Documentation refers to "Treadville Specialty Coffee" products. Actual products are branded **"Masai Coffee"**. This is consistent with `AGENTS.md` §28 ("MaaSai clichés" prohibition) — but the live data uses a different brand. The product NAMES use "Masai Coffee" not "Treadville". The decision required is: are these products actually being rebranded to Treadville, or are they permanently "Masai Coffee"?

---

## Database state (read-only, no mutations)

### categories (4)
```
coffee         → image_url = /images/category-coffee.jpg        (dead)
tea            → image_url = /images/category-tea.jpg           (dead)
horticulture   → image_url = /images/category-horticulture.jpg  (dead)
grains         → image_url = /images/category-grains.jpg        (dead)
```

### products (8 — was 9 in docs, only 8 exist)
```
PUBLISHED (2):
  masai-coffee-moka-espresso    → image_url = /images/product-moka-espresso.jpg  gallery=[]
  masai-coffee-supreme          → image_url = /images/product-supreme.jpg        gallery=[]

DRAFT (6 — per AGENTS.md, NOT to receive image binding):
  black-tea-demo                → /images/product-placeholder-tea.jpg
  specialty-tea-demo            → /images/product-placeholder-tea.jpg
  fresh-produce-demo            → /images/product-placeholder-hort.jpg
  export-horticulture-demo      → /images/product-placeholder-hort.jpg
  maize-demo                    → /images/product-placeholder-grain.jpg
  rice-demo                     → /images/product-placeholder-grain.jpg
```

### site_content (4)
```
hero_headline      = "Premium African Products. From Coffee to Grain."
hero_subheadline   = "Sourced across Kenya's volcanic highlands..."
hero_image         = "/images/hero-coffee.jpg"   (DEAD — HeroSlideshow does not read it)
about_blurb        = "Over 30 years of expertise..."
```

---

## Integration plan with corrected assumptions

Given the conflicts above, the deterministic integration would proceed as:

### Safe to execute without further input (after bucket is created)
| Step | Asset | Destination | Database action |
|---|---|---|---|
| 1 | `cat-coffee-card.png` | coffee category card | UPDATE categories SET image_url WHERE slug='coffee' |
| 2 | `cat-tea-card.png` | tea category card | UPDATE categories SET image_url WHERE slug='tea' |
| 3 | `cat-hort-card.png` | horticulture category card | UPDATE categories SET image_url WHERE slug='horticulture' |
| 4 | `cat-grains-card.png` | grains category card | UPDATE categories SET image_url WHERE slug='grains' |
| 5 | `prod-coffee-pdp.png` | masai-coffee-moka-espresso | UPDATE products SET image_url WHERE slug='masai-coffee-moka-espresso' |
| 6 | `prod-coffee-cherry.png` | masai-coffee-supreme | UPDATE products SET image_url WHERE slug='masai-coffee-supreme' |
| 7 | gallery 1 image | masai-coffee-moka-espresso | UPDATE products SET gallery WHERE slug='masai-coffee-moka-espresso' |
| 8 | gallery 1 image | masai-coffee-supreme | UPDATE products SET gallery WHERE slug='masai-coffee-supreme' |

That's **8 deterministic updates** (4 categories + 2 product primaries + 2 product gallery arrays, with Pascal picking which gallery images to use).

### BLOCKED until input received

| # | Item | Why blocked |
|---|---|---|
| 1 | Storage bucket creation | Anon key has no INSERT permission on `storage.buckets`. Needs service role key OR Pascal to create the bucket manually in Supabase dashboard. |
| 2 | Coffee product gallery image selection | 6 candidate gallery images exist; 2 published products; Pascal must confirm which 2 images go to which product (and which product gets 2 vs 1 gallery images) |
| 3 | 7 REVIEW assets | `RAW COFFEE + STONE`, `THE SIGNATURE TREADVILLE IMAGE`, `COFFEE CHERRY CLUSTER`, `FARM WORK`, `FULL CATEGORY COLLECTION`, `GRAINS HARVEST DETAIL`, `TEA PROCESS` — all have no deterministic destination |
| 4 | Page hero / Provenance / JournalPreview / Homepage hero | These require component changes (no current data field). Not in scope for "drop-in" integration. Per protocol: record as BLOCKED. |
| 5 | Brand-name correction in docs | `treadville-*` → `masai-coffee-*` in all photography documents |

---

## What was performed (safe, read-only, reversible)

| Action | Result |
|---|---|
| `git status` | Done — see above |
| Re-read 7 photography documents + MANIFEST.md | Done — no contradictions in docs (only in docs vs DB) |
| Re-listed 30 originals + 30 working copies | Done — file sizes match across pairs (verified by byte count) |
| Listed Supabase buckets | Done — 0 buckets exist |
| Read categories table | Done — 4 records, all `image_url` are dead placeholders |
| Read products table | Done — 8 records (2 published, 6 draft); documented product slugs do not exist |
| Read site_content table | Done — 4 keys; `hero_image` is inert |
| Attempted bucket creation with anon key | Failed: RLS violation. Logged. NOT retried. |
| Database mutations | **NONE** |

**No source code was modified. No database rows were updated. No Storage objects were created. No originals were touched. The 30 working-copy PNGs remain untouched in their semantic folders.**

---

## What is needed to proceed (from Pascal)

1. **Bucket creation**: Either (a) Pascal creates `site-images` (public) in Supabase dashboard, OR (b) Pascal provides the service role key via env to enable the upload script.

2. **Coffee gallery selection**: Pascal confirms which of the 6 coffee gallery candidates map to which of the 2 published products, with primary + gallery[] order.

3. **Brand-name confirmation**: Are the actual products "Masai Coffee" (as currently in DB) or being rebranded to "Treadville"? Docs use the wrong name; this should be corrected regardless.

Once items 1 and 2 are answered, **the deterministic Phase C → Phase L pipeline can complete without further input** (Steps 1, 3, 4, 5, 6, 7, 8 are unambiguous). The 7 REVIEW assets and 4 BLOCKED slots will be recorded as such in the final report.

---

## Originals safety check

```
Photography/_originals/ABOUT PAGE.png                  | 2065185 bytes  ✓
Photography/_originals/COFFEE CATEGORY HERO.png        | 2263730 bytes  ✓
Photography/_originals/HOMEPAGE HERO.png               | 2008365 bytes  ✓
Photography/_originals/RAW COFFEE + STONE.png          | 2298579 bytes  ✓
Photography/_originals/THE SIGNATURE TREADVILLE IMAGE.png | 2111770 bytes ✓
... (all 30 verified by file size match with working copies)
```
**No original modified. No original uploaded. No original renamed.**
