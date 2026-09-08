# PHASE 23 — AUDIT

**Date:** Phase 23 start
**Branch:** `prototype/phase-2d-signature`
**Working tree:** Modified (many Phase 19-22 changes uncommitted)

---

## A. PRODUCT METADATA — DATABASE

**Status:** `product_metadata` table exists and is production-ready.

Schema:
```sql
product_metadata (id, product_id, key, value, created_at, updated_at)
  UNIQUE(product_id, key)
  RLS: public read for published products; admin full access
  Index on product_id
```

- Server action `upsertProductMetadata(productId, Record<string,string>)` exists at `admin-actions.ts:728`
- Query `getProductMetadata(productId)` exists in `queries.ts`
- `ProductMetadata` type defined in `types.ts`
- `METADATA_SCHEMAS` in `product-metadata.ts` defines fields per category

---

## B. METADATA SCHEMAS — EXISTING

| Category | Fields |
|---|---|
| `coffee` | origin, region, altitude, variety, processing, grade, sca_score, harvest, tasting_notes |
| `tea` | origin, elevation, grade, leaf_style, harvest, tasting_notes |
| `horticulture` | origin, variety, seasonality, grade, pack_sizes |
| `grains` | origin, variety, grade, moisture, packaging |

All fields have labels and placeholders. No schema changes needed.

---

## C. PRODUCT STUDIO — WHAT EXISTS

**File:** `src/components/admin/ProductStudio.tsx` (519 lines)

**Currently has:**
- Product name, slug (auto-generated), category selector, description
- Primary image upload via `ImageUpload`
- Gallery management: add, remove, reorder, set-primary
- Commerce: price (KSh), stock, featured, publish/draft
- Form sections: "Product details", "Images", "Commerce & Stock"
- Right-panel live preview (image + name + price)
- Create and save-as-draft variants
- Calls `createProductAction` / `updateProductAction`

**Currently missing:**
- No metadata fields whatsoever — no UI to enter origin, altitude, processing, etc.
- No loading of existing metadata when editing a product
- No save of metadata when creating or updating a product
- No category-aware field switching

**Key observation:** The form is well-structured. Adding a "Category details" section is architecturally clean and non-disruptive.

---

## D. PRODUCT CREATE/EDIT FLOW

- `createProductAction` (line 17) creates the product row, logs audit, revalidates. Does NOT save metadata.
- `updateProductAction` (line 65) updates product row, logs audit. Does NOT save metadata.
- `upsertProductMetadata` (line 728) is a standalone function not called by either product action.

**Gap:** Metadata must be saved separately from product save, OR we add metadata save calls to the existing product actions.

**Recommended approach:** Add metadata FormData to product studio, call `upsertProductMetadata` inside `handleSubmit` after product save succeeds.

---

## E. PRODUCT DETAIL PAGE — STOREFRONT

**File:** `src/app/product/[slug]/page.tsx`

**Currently working:**
- Loads product, category, related products, and metadata in parallel (`Promise.all`)
- Renders dynamic metadata rows from `product_metadata` table (Phase 22 fix confirmed)
- Labels are generated: `"sca_score"` → `"Sca Score"` (sentence-case via regex)
- Eyebrow text mapped per category (coffee → "Single origin", tea → "Highland tea", etc.)
- CTA: "Request this lot"
- Product gallery with category accent
- Related products section

**Issues:**
1. Labels are title-cased via regex, which produces "Sca Score" instead of "SCA Score" for coffee
2. All categories use the same 2-column grid layout — could be more semantically distinct
3. No category-specific label overrides (e.g., "Harvest" vs "Crop" vs "Seasonality")

**Not broken:** The core metadata rendering pipeline works. Only cosmetic label formatting needs improvement.

---

## F. CATEGORY PAGES — STOREFRONT

**File:** `src/app/shop/[category]/page.tsx`

- Category hero with name, description
- CategoryTabs for navigation
- Product grid using `ProductCard`
- `accentFor(categorySlug)` for color theming

**Observations:**
- No category hero image displayed (category.image_url exists in DB but not rendered)
- Product grid works correctly
- Filtering/tabs functional

---

## G. PRODUCT CARD — PUBLIC

**File:** `src/components/ProductCard.tsx`

- Shows product image, name, category mark
- `forceIdentity` prop for explicit identity mode
- Eyebrow: "Lot" or "N° 01" based on index
- Dark/light tone variants
- Proper accessibility: `aria-label`, `focus-visible` ring

**No changes needed.** Works correctly.

---

## H. GALLERY / PHOTOGRAPHY

**ProductGallery component:** Exists, used on product detail page. Merges `image_url` + `gallery` array. No issues identified in current code.

**ImageUpload component:** Handles Supabase Storage upload, tracks upload state, graceful error on bucket absence.

**Category images:** `ImageUpload` used in `CategoriesClient`. Works.

**Observation:** The photography wiring from prior phases may have introduced Supabase asset references. No photography issues in current code.

---

## I. ARTICLE CMS — ADMIN

**Files:**
- `src/app/admin/journal/page.tsx` — server component, loads all articles, passes to client
- `src/components/admin/JournalClient.tsx` — filter by status, list articles, create/edit/delete
- `src/components/admin/ArticleForm.tsx` — form with title, slug, author, excerpt, body, cover image, publish toggle

**ArticleForm issues:**
1. Body is a plain `<textarea>` — no formatting possible
2. Helper text explicitly states: "Plain text for now. Rich text formatting can be added in a future phase."
3. No tags/categories support (acceptable for Phase 23)

**ArticleForm strengths:**
- Clean, functional
- ImageUpload integrated for cover
- Status toggle works
- Server messages work

**Recommendation:** Add a lightweight rich-text editor. Tiptap is the established choice for Next.js. However, if build stability is a concern, defer and keep textarea with a note.

---

## J. JOURNAL — PUBLIC STOREFRONT

**File:** `src/app/journal/page.tsx`

**CRITICAL ISSUE:** The journal listing page uses a hardcoded `ESSAYS` array with fake "Coming soon" content. It does NOT query the `articles` table.

```typescript
const ESSAYS = [
  { no: "01", title: "A note on Kirinyaga", excerpt: "...", meta: "Coming soon" },
  { no: "02", title: "Cupping at origin", excerpt: "...", meta: "Coming soon" },
  ...
];
```

**Also missing:** No `/journal/[slug]` article detail page at all.

**Impact:** Even if Eunice publishes articles in the admin, they won't appear publicly.

---

## K. EXISTING RLS / SECURITY

- All tables have RLS
- `requireAdmin()` in all Server Actions
- `requireRole()` for SYSTEM_ADMIN routes
- Service-role never in browser bundles
- Audit logging active

**No security concerns identified.** Phase 22 regression checks remain valid.

---

## L. CURRENT TYPESCRIPT / BUILD STATE

- `tsc --noEmit`: 0 errors (from Phase 22 verification)
- `npm run build`: passes with 26 routes

**Confirmed clean before Phase 23.**

---

## M. METADATA RENDERING — STOREFRONT

Current approach in `product/[slug]/page.tsx`:

```typescript
const metadataRows = metadata
  .filter((m) => m.value && m.value.trim() !== "")
  .map((m) => ({
    label: m.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: m.value!
  }));
```

**Issues with label formatting:**
- `"sca_score"` → `"Sca Score"` (wrong — should be "SCA Score")
- `"tasting_notes"` → `"Tasting Notes"` (acceptable)
- `"pack_sizes"` → `"Pack Sizes"` (acceptable)
- `"leaf_style"` → `"Leaf Style"` (acceptable)
- `"moisture"` → `"Moisture"` (acceptable — context from grains category)

**Fix needed:** Category-aware label map for display (not just key replacement).

---

## SUMMARY OF FINDINGS

### WORKS
1. `product_metadata` table + RLS + indexes
2. `METADATA_SCHEMAS` for all 4 categories
3. `upsertProductMetadata` Server Action
4. `getProductMetadata` query
5. Dynamic metadata rendering on product detail (Phase 22)
6. ProductStudio form structure (create, edit, gallery, image, commerce)
7. Category editing with ImageUpload
8. Article admin (create/edit/delete/publish)
9. `accentFor` and `CategoryMark` for category theming
10. ProductCard with accessibility
11. Security/RLS/auth intact from Phase 19-22

### BROKEN / INCOMPLETE
1. **No metadata editing UI** in ProductStudio — most critical gap
2. **No metadata loading** when editing a product
3. **No metadata saving** on product create/update
4. **Journal listing** uses hardcoded fake essays — ignores articles table
5. **No article detail page** at `/journal/[slug]`
6. **Article body** is plain textarea only
7. **Metadata labels** use naive title-case — produces "Sca Score" instead of "SCA Score"

### PRESERVE
1. All existing product create/edit infrastructure
2. Gallery management
3. Category editing
4. Security architecture
5. Audit logging
6. RLS policies
7. ProductCard design
8. Category theming (accentFor, CategoryMark)

### REDESIGN
1. ProductStudio: add "Category details" section with category-aware metadata fields
2. Journal listing: query `articles` table, remove hardcoded ESSAYS
3. Add `/journal/[slug]` article detail page
4. Product detail metadata labels: category-aware label map
5. Article body: evaluate Tiptap (only if build stability confirmed)

### SCHEMA CHANGES
**None required.** All infrastructure exists.

### UI CHANGES
1. ProductStudio: +1 new section ("Category details") with dynamic field rendering
2. ProductStudio: load existing metadata on edit, save metadata on create/edit
3. Journal listing: replace static array with DB query
4. New: `src/app/journal/[slug]/page.tsx` — article detail
5. Product detail: category-aware label map for metadata

### STOREFRONT CHANGES
1. Journal listing — dynamic
2. Journal detail — new page
3. Product metadata labels — improved formatting

---

## RECOMMENDED IMPLEMENTATION ORDER

**Priority 1 — Product metadata editing (biggest functional gap)**
- Load existing metadata when ProductStudio opens in edit mode
- Add "Category details" section below "Commerce & Stock"
- Fields change dynamically when category changes
- Save metadata alongside product save
- Handle category-change gracefully (warn + clear incompatible fields)

**Priority 2 — Journal storefront (broken public experience)**
- Replace hardcoded ESSAYS with `getArticles()` query
- Create `/journal/[slug]` page with article detail, cover image, clean typography
- Publish/draft behavior respected (only published shown)
- SEO metadata for articles

**Priority 3 — Article body (nice-to-have)**
- Evaluate Tiptap. If adding it risks build, keep textarea with improved placeholder.
- If adding Tiptap: start with minimal toolbar (bold, italic, headings, lists, links)
- Safe serialization to HTML, rendered with `dangerouslySetInnerHTML` (admin-authored content is trusted)

**Priority 4 — Metadata label refinement (cosmetic)**
- Add `METADATA_DISPLAY_LABELS` map per category
- Override generic title-case for keys like `sca_score`, `sca_score` → "SCA Score"

---

## RISKS

| Risk | Mitigation |
|---|---|
| Adding Tiptap breaks build | Only add if `npm run build` passes post-install; otherwise defer with note |
| Metadata save fails silently | Call `upsertProductMetadata`, show error if it fails; don't pretend full save succeeded |
| Category change destroys metadata | Warn user when changing category that existing metadata may no longer apply |
| `product_metadata` table empty in DB | Empty DB = no metadata rows rendered = product detail page shows no metadata block (correct behavior, not broken) |
| Storage buckets don't exist | `ImageUpload` already handles gracefully |

---

## DEFINITION OF COMPLETE

Phase 23 is complete when:

- [ ] ProductStudio shows category-aware metadata fields
- [ ] Existing metadata loads when editing a product
- [ ] Metadata saves correctly when creating/updating a product
- [ ] Category-aware label map improves metadata display on product detail
- [ ] Journal listing shows real articles from DB
- [ ] `/journal/[slug]` article detail page exists and works
- [ ] Article body is textarea (defer Tiptap to Phase 24 if build risk exists)
- [ ] Only published articles shown publicly
- [ ] No fake "Coming soon" placeholders on journal
- [ ] TypeScript passes
- [ ] Build passes (26+ routes)
- [ ] No Maasai/Masai references
- [ ] No public prices exposed
- [ ] Security intact
- [ ] `Docs/PHASE-23-PLAN.md` written
- [ ] `Docs/PHASE-23-REPORT.md` written
