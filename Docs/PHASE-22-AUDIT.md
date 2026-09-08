# PHASE 22 — ADMIN MATURITY AUDIT

**Date:** Phase 22, Step 1
**Scope:** Full audit before implementation — storefront integrity, category editing, metadata architecture, activity feed, password change, enquiry filtering, storage lifecycle, security regression.

---

## 1. Phase 21 Documentation Verification

| Document | Status |
|---|---|
| `Docs/PHASE-21-AUDIT.md` | Accurate — gaps correctly identified |
| `Docs/PHASE-21-REPORT.md` | Accurate — all features delivered as documented |
| Storage buckets | NOT YET CREATED by Pascal — ImageUpload graceful error state applies |
| `updateCategoryAction` | EXISTS in `admin-actions.ts` — added in Phase 21 per report |

---

## 2. Storefront Integrity Audit (22A)

### 2.1 Source of Truth Verification

The public storefront correctly uses database queries:
- `src/app/shop/page.tsx`: `getProducts()` from `lib/queries` — loads from `products` table
- `src/app/shop/[category]/page.tsx`: `getProducts({ categorySlug, publishedOnly })` — database-driven
- `src/app/product/[slug]/page.tsx`: `getProductBySlug()` — database-driven
- `lib/queries.ts`: Clean — only database queries, no hardcoded product arrays

**Conclusion:** Products on the storefront are loaded from the database. The single source of truth is the `products` table. No duplicated hardcoded product arrays exist in storefront pages.

### 2.2 Hardcoded Placeholder Content Found

**CRITICAL ISSUE** — `src/app/product/[slug]/page.tsx` lines 14–19:

```typescript
const COFFEE_SOURCING_STANDARD = [
  { label: "Origin", value: "Kirinyaga, Kenya" },
  { label: "Altitude", value: "1,600–1,850m" },
  { label: "Process", value: "Washed / Anaerobic" },
  { label: "Quality", value: "80+ SCA" },
];
```

This array is displayed for ALL coffee products (lines 129–142), regardless of what data is in the database. Every coffee product will show: Kirinyaga, 1,600–1,850m, Washed/Anaerobic, 80+ SCA. This is placeholder content that must be replaced with actual product-specific metadata once the `product_metadata` table exists.

**Fix:** Replace with dynamic metadata from `product_metadata` table (Phase 22C/22D). Until then, conditionally show the block only when real metadata exists.

### 2.3 `EYEBROW_MAP` — Acceptable

```typescript
const EYEBROW_MAP: Record<string, string> = {
  coffee: "Single origin",
  tea: "Highland tea",
  horticulture: "Horticultural product",
  grains: "Grain & nut",
};
```

This is reasonable display logic, not invented content. Category slugs are data-driven. Acceptable.

### 2.4 Masai/Maasai/Moka/Supreme Search

All matches found are in documentation files (`.md`), not in live code. No references found in `.tsx`, `.ts`, or `.sql` source files. The product slugs `masai-coffee-moka-espresso` and `masai-coffee-supreme` exist in the Supabase database — these are database records that Pascal must rename. They do not appear in source code.

### 2.5 Database Product Slugs

Per documentation (`PHOTOGRAPHY-SUPABASE-PROJECT-AUDIT.md`), the Supabase database contains:
- `masai-coffee-moka-espresso` (published)
- `masai-coffee-supreme` (published)

These slugs are database records, not code. They need renaming via Supabase Studio or SQL. This is a manual data migration for Pascal.

### 2.6 Stop Condition for 22A

The `COFFEE_SOURCING_STANDARD` hardcoded block must be fixed. It cannot remain showing identical values on every coffee product.

---

## 3. Category Editing (22B)

### 3.1 Current State

Phase 21 added `updateCategoryAction` to `admin-actions.ts`. The `CategoriesClient` add form supports ImageUpload for category images. However:

- **No edit capability** in CategoriesClient — categories can be toggled active/inactive and deleted, but not edited
- The add form has ImageUpload; the edit flow does not exist
- No category edit page or inline edit form

### 3.2 Required

An inline or expandable edit form for categories that supports:
- Edit name
- Edit slug
- Edit description
- Upload/replace/remove image
- Toggle active/inactive
- Save / cancel
- Loading state
- Validation (name required, slug uniqueness)
- Confirmation for destructive changes

---

## 4. Product Metadata Architecture (22C)

### 4.1 Current State

No `product_metadata` table. `products` table has only flat columns: `name, slug, description, price, image_url, gallery, featured, stock, status`.

### 4.2 Recommended Architecture

**`product_metadata` table** — JSONB for flexible category-specific attributes:

```sql
CREATE TABLE product_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key text NOT NULL,       -- e.g. "origin", "altitude", "grade"
  value text,              -- plain text value
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, key)
);

CREATE INDEX product_metadata_product_id_idx ON product_metadata(product_id);

ALTER TABLE product_metadata ENABLE ROW LEVEL SECURITY;

-- Admins can manage
CREATE POLICY "Admins manage product_metadata"
  ON product_metadata FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role IN ('OWNER', 'SYSTEM_ADMIN')
    )
  );

-- Public can read metadata for published products
CREATE POLICY "Public read product metadata"
  ON product_metadata FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_metadata.product_id
      AND products.status = 'published'
    )
  );
```

**Rationale:**
- Normalized `key/value` approach allows arbitrary product attributes without schema changes
- `UNIQUE(product_id, key)` prevents duplicate attributes
- JSONB is overkill for simple text values; plain text is sufficient for Phase 22
- Easy to query: `SELECT * FROM product_metadata WHERE product_id = ?`
- Easy to upsert: `ON CONFLICT (product_id, key) DO UPDATE SET value = ?, updated_at = now()`
- Application-level typed schema for known categories (not DB-enforced)
- RLS: public can read metadata for published products (metadata is not sensitive)
- Admin-only write

### 4.3 Application-Level Category Schemas

```typescript
// lib/product-metadata.ts

export const METADATA_SCHEMAS: Record<string, MetadataField[]> = {
  coffee: [
    { key: "origin", label: "Origin", placeholder: "e.g. Kirinyaga, Kenya" },
    { key: "region", label: "Region", placeholder: "e.g. Central Province" },
    { key: "altitude", label: "Altitude", placeholder: "e.g. 1,600–1,850m" },
    { key: "variety", label: "Variety", placeholder: "e.g. SL28, SL34, Ruiru 11" },
    { key: "processing", label: "Processing", placeholder: "e.g. Washed, Natural, Anaerobic" },
    { key: "grade", label: "Grade", placeholder: "e.g. AA, AB, PB" },
    { key: "sca_score", label: "SCA Score", placeholder: "e.g. 84+" },
    { key: "harvest", label: "Harvest", placeholder: "e.g. October 2025" },
    { key: "tasting_notes", label: "Tasting notes", placeholder: "e.g. Blackcurrant, caramel, citrus" },
  ],
  tea: [
    { key: "origin", label: "Origin", placeholder: "e.g. Kericho, Kenya" },
    { key: "elevation", label: "Elevation", placeholder: "e.g. 1,500–2,100m" },
    { key: "grade", label: "Grade", placeholder: "e.g. FBOP, BOP, OP" },
    { key: "leaf_style", label: "Leaf style", placeholder: "e.g. Orthodox, CTC" },
    { key: "harvest", label: "Harvest", placeholder: "e.g. First flush, 2025" },
    { key: "tasting_notes", label: "Tasting notes", placeholder: "e.g. Malty, brisk, golden liquor" },
  ],
  horticulture: [
    { key: "origin", label: "Origin", placeholder: "e.g. Nakuru, Kenya" },
    { key: "variety", label: "Variety", placeholder: "e.g. Hass, Fuerte" },
    { key: "seasonality", label: "Seasonality", placeholder: "e.g. Year-round" },
    { key: "grade", label: "Grade", placeholder: "e.g. Class 1, Export" },
    { key: "pack_sizes", label: "Pack sizes", placeholder: "e.g. 4kg, 10kg" },
  ],
  grains: [
    { key: "origin", label: "Origin", placeholder: "e.g. Uasin Gishu, Kenya" },
    { key: "variety", label: "Variety", placeholder: "e.g. Hybrid 513, KTB 9" },
    { key: "grade", label: "Grade", placeholder: "e.g. Grade 1" },
    { key: "moisture", label: "Moisture content", placeholder: "e.g. ≤13%" },
    { key: "packaging", label: "Packaging", placeholder: "e.g. 50kg bags" },
  ],
};

export type MetadataField = {
  key: string;
  label: string;
  placeholder: string;
};
```

---

## 5. Category-Aware ProductStudio (22D)

### 5.1 Current State

`ProductStudio.tsx` does not have metadata fields. It has: name, slug, category, description, images, price, stock, featured, publish.

### 5.2 Required

After `product_metadata` table exists:
1. Add "Product details" section to ProductStudio
2. Detect selected category slug
3. Show category-appropriate metadata fields
4. Load existing metadata when editing
5. Save metadata via upsert (Server Action)
6. Show metadata in product detail page dynamically

### 5.3 Data Flow

```
ProductStudio
  → category selected
  → METADATA_SCHEMAS[categorySlug] renders fields
  → user fills fields
  → on save: upsert to product_metadata table
  → product detail page: SELECT * FROM product_metadata WHERE product_id = ?
  → render as dl/dd pairs
```

---

## 6. Dashboard Activity Feed (22E)

### 6.1 Current State

Dashboard shows counts + recent products + recent enquiries. No audit log activity feed.

### 6.2 Required

A "Recent activity" section showing the last ~8 most relevant audit log entries. Filtered to business-relevant actions (not system-level):
- `product_created`, `product_published`, `product_unpublished`, `product_deleted`
- `category_created`, `category_updated`
- `article_created`, `article_published`, `article_unpublished`
- `enquiry_received` (if applicable)
- `content_updated`

NOT shown on dashboard (SYSTEM_ADMIN only in Activity):
- `role_invited`, `role_changed`, `role_removed`
- `image_uploaded`, `image_deleted` (unless specifically requested)
- `security_changed`
- `integration_updated`

Display: actor email (abbreviated), action label, entity, relative time.

---

## 7. Change Password (22F)

### 7.1 Current State

No password change capability. `SettingsClient.tsx` only has display name and business content.

### 7.2 Supabase Auth Method

Supabase Auth supports password update via `supabase.auth.updateUser({ password: newPassword })`. This requires the authenticated session. The authenticated Supabase client (via cookie session) can call this.

**Architecture:**
```
SettingsClient
  → "Change password" section
  → form: new password + confirm password
  → Server Action: changePasswordAction
    → requireAdmin() [auth re-check]
    → createClient() [authenticated Supabase client]
    → supabase.auth.updateUser({ password: newPassword })
    → return success/error
```

### 7.3 Validation
- New password minimum: 8 characters
- Confirm password matches
- Current password not required (authenticated session is sufficient)
- Clear error: "Password update failed. Please try again."
- Clear success: "Password updated."

---

## 8. Enquiry Management (22G)

### 8.1 Current State

`EnquiriesClient` filters by status (`new`, `in_review`, `responded`, `closed`). No type filter.

### 8.2 Enquiry Types

The `enquiries` table has a `type text` column. Current enquiry form submissions (from `contact/page.tsx`) likely send `type` values. The `EnquiryFormState` from Phase 19 should indicate what types are used.

The existing `EnquiriesClient` has `const STATUS_OPTIONS` but no `TYPE_OPTIONS`. Add a type filter alongside the status filter.

### 8.3 Enquiry Status

`enquiries.status` values: `new`, `in_review`, `responded`, `closed`. These are already in the client.

---

## 9. Product Catalogue Scalability (22H)

**Deferred** — current product counts are low (prototype scale). No pagination needed until catalogue exceeds ~50 products. Document this decision.

---

## 10. Article Editor (22I)

**Deferred** — plain textarea is acceptable for Phase 22. WYSIWYG adds bundle size, security surface (XSS), and maintenance burden. Eunice can write articles in plain text. Future phase can add Tiptap.

---

## 11. Storage Lifecycle (22J)

### 11.1 Current `deleteImageAction`

```typescript
// 1. Delete from Storage
supabase.storage.from(bucket).remove([storagePath])
// 2. Delete from storage_files
supabase.from("storage_files").delete().eq("storage_path", storagePath)
```

### 11.2 Risk

If the same `storagePath` is referenced by multiple records (e.g., copied gallery images), deleting it will break those records. This is unlikely with UUID-based paths, but the `storage_files` table prevents duplicate paths (`UNIQUE` constraint should be added).

### 11.3 Fix

1. Add `UNIQUE(storage_path)` constraint to `storage_files` table
2. `deleteImageAction`: before deleting from Storage, verify no other product/category/article references this path in the `image_url` or `gallery` columns
3. Alternatively: soft-delete storage_files and only remove from Storage after a grace period (deferred)

### 11.4 `storage_files` UNIQUE Constraint

```sql
-- Add to storage_files table
alter table storage_files add constraint storage_files_storage_path_key unique (storage_path);
```

---

## 12. Security Regression Audit (22K)

### 12.1 Authorization Summary

| Route | Unauthenticated | OWNER | SYSTEM_ADMIN |
|---|---|---|---|
| `/admin/*` | 302 → login | 200 | 200 |
| `/admin/users` | 302 | 403 | 200 |
| `/admin/integrations` | 302 | 403 | 200 |
| `/admin/security` | 302 | 403 | 200 |
| `/admin/activity` | 302 | 403 | 200 |
| `/admin/settings` | 302 | 200 | 200 |
| `/admin/journal` | 302 | 200 | 200 |
| `/admin/enquiries` | 302 | 200 | 200 |
| `/admin/products` | 302 | 200 | 200 |
| `/admin/categories` | 302 | 200 | 200 |
| `/admin/content` | 302 | 200 | 200 |

### 12.2 Server Actions Authorization

All Server Actions call `requireAdmin()` or `requireRole()` at the top. Confirmed:
- `createProductAction`, `updateProductAction`, `deleteProductAction`
- `createCategoryAction`, `updateCategoryAction`, `toggleCategoryActiveAction`, `deleteCategoryAction`
- `createArticleAction`, `updateArticleAction`, `setArticleStatusAction`, `deleteArticleAction`
- `setSiteContentAction`, `updateProfileAction`
- `createImageUploadAction`, `recordImageUploadAction`, `deleteImageAction`

### 12.3 No Changes Needed

Phase 19/20/21 security model is intact. Phase 22 additions must not weaken it.

---

## 13. Daraja / M-Pesa Boundary (22L)

No M-Pesa code exists. Phase 19 architecture is preserved. No changes to the auth, storage, or admin architecture will conflict with the future Daraja integration.

---

## 14. Summary of Issues Found

| # | Severity | Area | Issue |
|---|---|---|---|
| 1 | **HIGH** | Storefront | `COFFEE_SOURCING_STANDARD` hardcoded in `product/[slug]/page.tsx` — shows identical values on all coffee products |
| 2 | **MEDIUM** | Category | No category edit capability in `CategoriesClient` |
| 3 | **HIGH** | Product | No `product_metadata` table — cannot enter real coffee/tea/horticulture/grains attributes |
| 4 | **MEDIUM** | Dashboard | No activity feed from audit_log |
| 5 | **MEDIUM** | Settings | No change password capability |
| 6 | **LOW** | Enquiries | No type filter in `EnquiriesClient` |
| 7 | **LOW** | Storage | `storage_files.storage_path` lacks UNIQUE constraint |

---

## 15. Stop Conditions

1. **Destructive DB changes:** None required. All migrations are additive (`product_metadata` table, `storage_files` unique constraint).
2. **Masai content:** Already clean in source code. Database slugs are a manual Pascal task.
3. **Authentication architecture:** No changes to auth model.
4. **Service-role exposure:** No changes that expose service-role to browser.
5. **Existing data destruction:** None — `product_metadata` is new table.

---

## Next Step

Proceed to `Docs/PHASE-22-PLAN.md`, then implement in priority order.
