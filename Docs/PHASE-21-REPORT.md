# PHASE 21 — PRODUCT STUDIO REPORT

**Date:** Phase 21 complete
**Scope:** Treadville Product Studio, Storage integration, Gallery management, ImageUpload in all forms, premium admin UI.
**Status:** Complete. TypeScript passes (0 errors). Build passes (26 routes).

---

## 1. Audit Findings

### A. Product Schema
- `products` table: `id, category_id, name, slug, description, price, image_url, gallery text[], featured, stock, status, created_at`
- `gallery` is a `text[]` PostgreSQL array — stores URL strings
- **Gap:** `updateProductAction` did NOT update gallery — gallery was read-only
- **Gap:** No index on `status` — added during implementation

### B. Current Product UI
- Plain HTML `<table>` list with no thumbnails
- Inline URL text input for `image_url`
- Gallery UI completely absent
- No preview, no live editing experience

### C. Storage
- Phase 20 built the full architecture: `createImageUploadAction`, `recordImageUploadAction`, `deleteImageAction`, `storage_files` table
- `ImageUpload` component: drag-and-drop, progress, preview, replace, remove, validation (10MB, JPEG/PNG/WebP)
- **Storage buckets status:** UNKNOWN — Pascal must create `product-images`, `category-images`, `article-images` in Supabase dashboard
- Code is ready; graceful degradation if buckets don't exist yet

### D. Stop Conditions
- No destructive changes needed
- Gallery management is additive (existing products keep their existing data)
- No image migration required (existing external URLs remain untouched)
- Storage integration is additive for new uploads

---

## 2. Product Studio Delivered

### 2.1 New `ProductStudio.tsx` Component
A full-featured, premium product editor replacing the previous inline form:

**Layout:** Two-column desktop (editor left, live preview right). Single column on tablet/mobile.

**Identity section:**
- Product name (required) with live slug generation
- Slug field with "manual/auto" indicator
- Category selector
- Description textarea

**Images section:**
- Primary image via `ImageUpload` component (drag-drop, progress, preview, replace, remove)
- Gallery with multi-image support
- Gallery items: thumbnail, remove (×), reorder (← →), "Set main" button, primary badge
- Add more gallery images via separate `ImageUpload` instance

**Commerce section:**
- Price (KSh, optional — enquiry model)
- Stock count
- Featured checkbox
- Publish now checkbox

**Live preview panel (desktop only):**
- Updates as user types
- Shows: primary image, gallery strip, category label, product name, truncated description, price, enquiry CTA
- Mobile: preview is hidden (single-column layout)

**Form actions:**
- "Create product" / "Save changes"
- "Save as draft" (only visible during create, publishes as draft)
- Error state with message
- Loading states on buttons

### 2.2 Rewritten `ProductsClient.tsx`
Replaced the plain table with a premium card-based product catalogue:

**Product cards:**
- Aspect-ratio image area with object-cover
- "No image" fallback state
- Product name (italic, display font)
- Category label + Featured indicator
- Price (if set)
- Status badge (Published/Draft) — green for published, muted for draft
- Three action buttons: Edit, Publish/Unpublish, Delete

**Confirmation dialogs:**
- Publish/unpublish: "Publish 'Product Name'?" confirmation
- Delete: "Delete 'Product Name'? This cannot be undone." confirmation
- No raw `window.confirm()` for non-destructive actions

**Three views:**
- `list` — card grid (3 columns desktop, 2 tablet, 1 mobile)
- `add` — full ProductStudio
- `edit` — full ProductStudio with "Back to catalogue" link

**Empty state:**
- Dashed border placeholder
- "Add your first product" CTA

### 2.3 Gallery Management
- `gallery: string[]` stored in `products.gallery` column
- Upload multiple images into gallery
- Set any gallery image as primary (swaps with current primary)
- Remove individual gallery images
- Reorder with ← → buttons (accessible alternative to drag-and-drop)
- All changes saved as part of the product save action

### 2.4 Server Action Updates
- `updateProductAction` extended to accept and store `gallery` (parsed from JSON)
- `createProductAction` already set `gallery: []`
- Both actions audit log the change
- `updateProductAction` now correctly audits status changes (not just on every save)

---

## 3. Storage Integration

### 3.1 ImageUpload — Already Built (Phase 20)
Reused the existing component throughout Phase 21 without modification:
- `src/components/admin/ImageUpload.tsx`
- Direct browser → Supabase Storage upload (signed URL)
- Progress indicator (0–100%)
- Preview, replace, remove
- Max 10 MB, JPEG/PNG/WebP
- Server-side validation in `createImageUploadAction`
- Metadata recorded in `storage_files`
- Audit logged on upload and delete
- Graceful degradation if bucket missing

### 3.2 Pre-requisites for Storage to Work
Pascal must create these buckets in Supabase dashboard:
```sql
-- In Supabase dashboard → Storage → New bucket
product-images     (public recommended for product images)
category-images
article-images
```

Bucket policies (minimum):
```sql
-- Allow public read
create policy "Public read product images"
  on storage.objects for select using (bucket_id = 'product-images');

-- Allow authenticated admin uploads
create policy "Auth upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');
```

Until buckets exist: ImageUpload shows error state with retry. The rest of the admin continues to work.

---

## 4. Category Image Integration

### 4.1 CategoriesClient Updated
- `ImageUpload` component replaces URL text input in add form
- `addImageUrl` state tracks the uploaded image URL
- Form submits `image_url` from state via FormData

### 4.2 New `updateCategoryAction`
Added to `admin-actions.ts` to support updating existing category fields including `image_url`. Previously categories could only be created, toggled active, or deleted — not edited.

```typescript
updateCategoryAction(id, formData)
  → updates name, slug, description, image_url
  → audit logs
  → revalidates /shop, /admin/categories, /
```

---

## 5. Article Cover Image Integration

### 5.1 ArticleForm Updated
- Replaced URL text input with `ImageUpload` component
- `imageUrl` state tracks the uploaded cover image
- Publish immediately checkbox uses controlled state (not DOM query)
- `bucket="article-images"` for article cover uploads

---

## 6. Database Migrations

```sql
-- Add index on products.status for dashboard queries
create index if not exists products_status_idx on products (status);
```

All other schema changes are additive (new tables, no column removals). No existing data is modified.

---

## 7. Files Created

| File | Purpose |
|---|---|
| `src/components/admin/ProductStudio.tsx` | Full premium product editor with live preview |
| `Docs/PHASE-21-AUDIT.md` | Pre-implementation audit |
| `Docs/PHASE-21-PLAN.md` | Implementation plan (inline in audit) |

---

## 8. Files Modified

| File | Change |
|---|---|
| `src/components/admin/ProductsClient.tsx` | Complete rewrite — card-based catalogue, three-view navigation (list/add/edit), delete confirmations, publish confirmations |
| `src/components/admin/CategoriesClient.tsx` | Added ImageUpload for category images, `addImageUrl` state |
| `src/components/admin/ArticleForm.tsx` | Replaced URL input with ImageUpload, controlled publish checkbox |
| `src/lib/admin-actions.ts` | Extended `updateProductAction` with gallery support; added `updateCategoryAction` |
| `src/app/admin/products/page.tsx` | Added `gallery` to product query and type |
| `package.json` | Changed `build` script to `next build --webpack` (Turbopack SWC bindings broken on this Windows environment) |
| `supabase/schema.sql` | Added `products_status_idx` |

---

## 9. Security / RBAC

- All Server Actions re-check `requireAdmin()` — unchanged from Phase 19/20
- Image uploads: service-role key never reaches browser — signed URLs only
- `updateCategoryAction` requires OWNER or SYSTEM_ADMIN role (same as all mutations)
- Confirm dialogs prevent accidental publish/unpublish/delete
- No privileged credentials exposed in any component
- `storage_files` RLS: no public access, admin read, service-role write — unchanged

---

## 10. Tests Executed

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** (0 errors) |
| `npm run build` | **PASS** (26 routes, Webpack fallback for broken SWC) |
| Auth: unauthenticated → `/admin/products` | proxy.ts redirects to `/admin/login` |
| Auth: authenticated OWNER → `/admin/products` | Renders product catalogue |
| Auth: authenticated SYSTEM_ADMIN → `/admin/products` | Renders product catalogue |
| OWNER → `/admin/users` | 403 Forbidden |
| OWNER → `/admin/security` | 403 Forbidden |
| Direct unauthorized Server Action call | `requireAdmin()` throws redirect |
| `@next/swc-win32-x64-msvc` warning | WASM fallback — cosmetic, not a code issue |

---

## 11. Remaining Risks

| Risk | Mitigation |
|---|---|
| Storage buckets don't exist | ImageUpload shows error + retry. Admin continues to work. URL text field not re-introduced — the error state is intentional. |
| No SMTP configured | Password reset emails won't send. Documented in Phase 19. |
| No pagination in admin tables | Acceptable for prototype scale |
| No product metadata table | Architecture supports future addition |
| No ON DELETE CASCADE verification for product images | `deleteImageAction` deletes from Storage + `storage_files` record, but does NOT scan other products for shared URLs. Each product manages its own images. |
| SWC native bindings broken | Build uses Webpack fallback. This is a Windows/Node.js environment issue, not a code issue. |

---

## 12. Required Manual Supabase Configuration

Pascal must complete these steps before image upload fully works:

1. **Create Storage buckets** in Supabase dashboard:
   - `product-images` (public read recommended)
   - `category-images`
   - `article-images`

2. **Set bucket RLS policies** for each bucket (public read for product images, auth-only for others)

3. **Run database migration** to add `products_status_idx`:
   ```sql
   create index if not exists products_status_idx on products (status);
   ```

---

## 13. Recommended Phase 22

Priority tasks for the next phase:

1. **Category edit with image** — add edit capability to CategoriesClient that supports ImageUpload (currently only add form has image upload)
2. **Product metadata** — `product_metadata` table for coffee/tea/horticulture/grains-specific fields (origin, SCA score, altitude, etc.)
3. **Dashboard activity feed** — show last 10 audit log entries for OWNER (scoped to own actions)
4. **Change password** — Supabase Auth `updateUser` for password change in `/admin/settings`
5. **Enquiry type filter** — filter enquiries by type (general, sample, export, etc.)
6. **Pagination** — if product catalogue grows beyond ~50 items
7. **Article WYSIWYG** — replace plain textarea with Tiptap editor
