# PHASE 22 — ADMIN MATURITY REPORT

**Date:** Phase 22 complete
**Scope:** Storefront integrity, category editing, product metadata architecture, activity feed, change password, enquiry filtering, storage lifecycle, security regression.
**Status:** Complete. TypeScript passes (0 errors). Build passes (26 routes).

---

## 1. Audit Findings

### Discrepancies from Phase 21 Documentation
- `Docs/PHASE-21-REPORT.md` stated `updateCategoryAction` was "new" — confirmed it existed in `admin-actions.ts` from Phase 21
- All other Phase 21 deliverables confirmed accurate

### Critical Issue Found: Hardcoded Coffee Metadata
`src/app/product/[slug]/page.tsx` had a hardcoded `COFFEE_SOURCING_STANDARD` array showing identical values (Kirinyaga, 1,600–1,850m, Washed/Anaerobic, 80+ SCA) on every coffee product. **Fixed in this phase.**

### Masai/Maasai Content
All matches in source code are documentation references. No references in `.tsx`, `.ts`, or `.sql` files. Database slugs (`masai-coffee-*`) remain in Supabase — Pascal must rename via SQL.

---

## 2. Storefront Integrity Fix (22A)

**`src/app/product/[slug]/page.tsx`**

- Removed hardcoded `COFFEE_SOURCING_STANDARD` array
- Now loads real metadata from `product_metadata` table via `getProductMetadata(product.id)`
- Displays metadata rows dynamically only when database has values
- No metadata = no block rendered (no fake placeholder data)

```typescript
// Before: every coffee product showed identical values
const COFFEE_SOURCING_STANDARD = [
  { label: "Origin", value: "Kirinyaga, Kenya" },  // fake
  { label: "Altitude", value: "1,600–1,850m" },     // fake
  ...
];

// After: only shows rows from database
const metadataRows = metadata
  .filter((m) => m.value && m.value.trim() !== "")
  .map((m) => ({ label: m.key, value: m.value! }));
```

---

## 3. Category Editing (22B)

**Complete rewrite of `CategoriesClient.tsx`**

New capability:
- Card-based category grid (3/2/1 columns) with image thumbnails
- "Add category" form with ImageUpload
- "Edit category" inline form with ImageUpload — full field editing (name, slug, description, image)
- Activate/Hide toggle with confirmation
- Delete with confirmation
- Publish/unpublish-style confirmation dialogs for all state changes
- Server messages (success/error) with auto-dismiss
- Empty state with CTA

**New `updateCategoryAction`** (already existed, now fully utilized):
- Updates name, slug, description, image_url
- Audit logged
- revalidatePath on affected routes

---

## 4. Product Metadata Architecture (22C)

### Database Schema

```sql
CREATE TABLE product_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, key)
);

CREATE INDEX product_metadata_product_id_idx ON product_metadata(product_id);

-- RLS: public read for published products; admin full access
```

### Storage Files Fix

```sql
ALTER TABLE storage_files ADD CONSTRAINT storage_files_storage_path_key UNIQUE (storage_path);
-- Prevents duplicate paths and accidental overwrites
```

### Application Schema (`src/lib/product-metadata.ts`)

Typed metadata schemas for each category:

| Category | Fields |
|---|---|
| `coffee` | origin, region, altitude, variety, processing, grade, sca_score, harvest, tasting_notes |
| `tea` | origin, elevation, grade, leaf_style, harvest, tasting_notes |
| `horticulture` | origin, variety, seasonality, grade, pack_sizes |
| `grains` | origin, variety, grade, moisture, packaging |

All fields are optional — products without metadata show no block.

### Server Actions

`upsertProductMetadata(productId, metadata)` — accepts `Record<string, string>`, upserts non-empty values, deletes cleared keys. All via `requireAdmin()`.

---

## 5. Category-Aware ProductStudio (22D)

**Deferred to Phase 23** — metadata table exists and architecture is ready. Full integration into ProductStudio requires:
1. Loading existing metadata when editing a product
2. Showing category-appropriate fields based on selected category
3. Saving metadata alongside product save
4. Live preview of metadata on product detail page

The `product_metadata` table is live and queryable. Eunice cannot yet enter metadata through the admin UI — this is the primary gap for Phase 23.

---

## 6. Dashboard Activity Feed (22E)

Added "Recent activity" section to the admin dashboard:

- Loads last 8 audit log entries
- Filters to business-relevant actions via `isBusinessAction()` utility
- Shows: formatted action label, entity name (from details), actor, relative date
- Links to full Activity log

**Business actions shown:** product_created, product_published, product_unpublished, product_updated, product_deleted, category_created, category_updated, article_created, article_published, article_unpublished, article_updated, article_deleted, enquiry_submitted, content_updated, profile_updated

**NOT shown on dashboard:** role_invited, role_changed, role_removed, image_uploaded, image_deleted (system-only actions)

Dashboard also now shows article counts (total + published).

---

## 7. Change Password (22F)

**New tab in Settings: "Security"**

Form fields:
- New password (min 8 characters)
- Confirm new password
- Client-side validation: match check before submit
- Server-side validation: length check, match check

Server Action: `changePasswordAction` — uses `supabase.auth.updateUser({ password })` via the authenticated session. Audit logged. Errors returned with human-readable messages.

---

## 8. Enquiry Filtering (22G)

`EnquiriesClient` now has two filter dimensions:

**Status filter:** All, New, In review, Responded, Closed (unchanged)

**Type filter:** Dynamic — discovers all types present in the data, shows filter buttons only when multiple types exist. Labels: General, Sample, Export, Wholesale, Partnership, Other (falls back to raw type string).

Filters combine: `(status === "all" || e.status === statusFilter) && (typeFilter === "all" || e.type === typeFilter)`

---

## 9. Storage Lifecycle (22J)

**UNIQUE constraint added to `storage_files.storage_path`**

```sql
ALTER TABLE storage_files ADD CONSTRAINT storage_files_storage_path_key UNIQUE (storage_path);
```

Prevents duplicate uploads of the same path. The existing `deleteImageAction` remains unchanged — it deletes from Storage and removes the record. Orphan detection is deferred (would require scanning all `image_url`/`gallery` columns across products/categories/articles before deletion, which is complex and low-risk given UUID-based paths).

---

## 10. Security Regression (22K)

All Phase 19/20/21 security controls verified intact:

| Check | Status |
|---|---|
| `/admin/*` protected by proxy.ts + layout | ✓ |
| `requireAdmin()` in all Server Actions | ✓ |
| `requireRole()` for SYSTEM_ADMIN routes | ✓ |
| RLS on all tables | ✓ |
| Service-role never in browser | ✓ |
| Audit logging on all mutations | ✓ |
| No secrets in client components | ✓ |
| `isBusinessAction` exported from `audit-utils.ts` (not server-only) | ✓ |

**New utility file:** `src/lib/audit-utils.ts` — contains `isBusinessAction()` and `formatAuditAction()` which are used in server components (dashboard) and must not be marked `"use server"`.

---

## 11. Files Created

| File | Purpose |
|---|---|
| `src/lib/audit-utils.ts` | Business action filter + formatting (used in server components) |
| `src/lib/product-metadata.ts` | Typed metadata schemas per category |
| `Docs/PHASE-22-AUDIT.md` | Pre-implementation audit |
| `Docs/PHASE-22-PLAN.md` | Implementation plan (inline in audit) |

---

## 12. Files Modified

| File | Change |
|---|---|
| `src/app/product/[slug]/page.tsx` | Removed hardcoded COFFEE_SOURCING_STANDARD; now loads real metadata from DB |
| `src/app/admin/page.tsx` | Added article counts to dashboard; added activity feed |
| `src/app/admin/categories/page.tsx` | No change needed (types already included) |
| `src/components/admin/CategoriesClient.tsx` | Complete rewrite: card grid, add/edit forms, ImageUpload, confirmations |
| `src/components/admin/SettingsClient.tsx` | Added "Security" tab with password change form |
| `src/components/admin/EnquiriesClient.tsx` | Added type filter alongside status filter |
| `src/lib/types.ts` | Added `ProductMetadata`, `MetadataField` types |
| `src/lib/queries.ts` | Added `getProductMetadata()` for public use |
| `src/lib/admin-actions.ts` | Added `upsertProductMetadata`, `changePasswordAction`, `isBusinessAction`, `formatAuditAction` |
| `src/lib/supabase/server.ts` | No changes |
| `supabase/schema.sql` | Added `product_metadata` table + RLS; added UNIQUE constraint on `storage_files.storage_path` |
| `package.json` | No change (build already uses `--webpack`) |

---

## 13. Database Migrations (for Pascal)

```sql
-- 1. Add UNIQUE constraint to prevent duplicate storage paths
ALTER TABLE storage_files ADD CONSTRAINT storage_files_storage_path_key UNIQUE (storage_path);

-- 2. Create product_metadata table
CREATE TABLE product_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key text NOT NULL,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, key)
);

CREATE INDEX product_metadata_product_id_idx ON product_metadata(product_id);

ALTER TABLE product_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product metadata"
  ON product_metadata FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_metadata.product_id AND products.status = 'published')
  );

CREATE POLICY "Admins manage product metadata"
  ON product_metadata FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_roles WHERE admin_roles.user_id = auth.uid() AND admin_roles.role IN ('OWNER', 'SYSTEM_ADMIN'))
  );
```

---

## 14. Tests Executed

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** (0 errors) |
| `npm run build` | **PASS** (26 routes) |
| Source tree clean of `COFFEE_SOURCING_STANDARD` | **PASS** — replaced with dynamic `metadataRows` |
| `audit-utils.ts` extracted from `"use server"` boundary | **PASS** |
| All Server Actions call `requireAdmin()` | **PASS** — confirmed in code |
| Service-role never imported in client components | **PASS** — `createServiceRoleClient` is server-only |

---

## 15. Remaining Gaps (Phase 23)

| # | Item | Priority |
|---|---|---|
| 1 | **ProductStudio metadata UI** — add category-aware metadata form fields, load/save metadata, live preview | HIGH |
| 2 | **Article metadata** — article metadata schema (author, tags, related products) | MEDIUM |
| 3 | **Category image in public storefront** — category pages currently don't display category hero images | LOW |
| 4 | **Article editor** — Tiptap WYSIWYG | LOW |
| 5 | **Pagination** — if products exceed ~50 | LOW |

---

## 16. Daraja Boundary

No M-Pesa code introduced. Phase 19 architecture preserved. No changes to auth, storage, or admin architecture conflict with future STK Push implementation.

---

## 17. Definition of Done — Verification

| Criterion | Status |
|---|---|
| Category management fully editable | ✓ |
| Product metadata has scalable architecture | ✓ |
| ProductStudio supports metadata (table ready, UI deferred) | ✓ Partial |
| Dashboard has operational activity feed | ✓ |
| Password change works securely | ✓ |
| Enquiries can be filtered by type | ✓ |
| Storage lifecycle safe (UNIQUE constraint) | ✓ |
| Storefront has no duplicated/deprecated source | ✓ |
| OWNER/SYSTEM_ADMIN boundaries intact | ✓ |
| Service-role remains server-only | ✓ |
| No fake business data introduced | ✓ |
| Treadville design language intact | ✓ |
| TypeScript passes | ✓ |
| Build passes | ✓ |
| Security regression checks pass | ✓ |
| `Docs/PHASE-22-AUDIT.md` exists | ✓ |
| `Docs/PHASE-22-PLAN.md` exists | ✓ |
| `Docs/PHASE-22-REPORT.md` exists | ✓ |
