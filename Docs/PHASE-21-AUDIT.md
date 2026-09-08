# PHASE 21 — PRODUCT STUDIO AUDIT

**Date:** Phase 21, Step 1–3
**Scope:** Audit of existing product schema, UI, storage, and image architecture before building the Product Studio.

---

## A. Product Schema

**Table: `products`**
```sql
products (
  id uuid pk default gen_random_uuid(),
  category_id uuid FK → categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(10, 2),
  image_url text,           -- primary image URL
  gallery text[] DEFAULT '{}', -- gallery image URLs (text array)
  featured boolean NOT NULL DEFAULT false,
  stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status in ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now()
)
```

**No indexes** on the products table currently.

**RLS:** `public read published only`. Admins (OWNER + SYSTEM_ADMIN) have full access.

**Key findings:**
- `image_url` is a nullable text field — stores any URL string
- `gallery` is a PostgreSQL `text[]` array — stores an array of URL strings
- **No product metadata table** — all product attributes are flat columns
- **No `updated_at` column** on products
- `slug` uniqueness is enforced at DB level
- `stock` is integer, no variant/stock tracking beyond a single integer
- `price` is nullable — enquiry-based model (no mandatory prices)

---

## B. Current Product UI

**Location:** `src/components/admin/ProductsClient.tsx` (396 lines)

### Structure
1. **Product list** — HTML `<table>` with columns: Name, Category, Price, Status, Featured, Actions
2. **Inline ProductForm** — expands below the table header for add; below the table for edit
3. **No full-page editor** — everything is inline in the same view

### ProductForm Fields (current)
| Field | Type | Notes |
|---|---|---|
| `name` | text input (required) | Product name |
| `slug` | text input | Auto-generated from name if blank |
| `category_id` | select (required) | Category picker |
| `price` | number input | Nullable, KSh |
| `description` | textarea | Optional |
| `image_url` | text input (URL) | Paste URL only |
| `stock` | number input | Integer |
| `featured` | checkbox | |
| `status` | checkbox | Publish immediately |

### Validation
- Name required, category required
- Price/stock coerce to numbers or null/0
- Slug uniqueness handled server-side with error message

### Save flow
- `createProductAction` or `updateProductAction`
- Server returns `{ error?: string; success?: string }`
- Table is refreshed via `revalidatePath`

### Status toggle
- Inline toggle button in the table row
- Calls `setProductStatusAction(id, "draft"|"published")`
- Not a publish/unpublish with confirmation — instant toggle

### Delete
- `window.confirm()` dialog
- `deleteProductAction(id)` — destructive delete (no soft-delete/archive)

### Loading states
- `useTransition` for all mutations
- Buttons show "Saving…" when pending
- No specific upload loading for images (URL input has no upload)

### Image workflow
- User pastes a URL into `image_url` text field
- No upload, no preview, no validation, no storage tracking
- Same for gallery (not currently editable in the form)

### Gap: Gallery
- `gallery` column exists in DB but `ProductForm` does NOT manage it
- `createProductAction` inserts `gallery: []` (empty array)
- `updateProductAction` does NOT update gallery at all
- Gallery images are stored but never written by the admin UI

---

## C. Storage

**Phase 20 architecture already built:**
- `storage_files` table: `id, storage_path, original_filename, mime_type, file_size, bucket, uploader_id, created_at`
- `createImageUploadAction`: generates signed upload URL via service-role client
- `recordImageUploadAction`: records upload metadata
- `deleteImageAction`: removes from storage + deletes record

**Current ImageUpload component** (`src/components/admin/ImageUpload.tsx`):
- Drag-and-drop zone + file picker
- Calls `createImageUploadAction` to get signed URL
- Browser uploads directly to Supabase Storage via XHR PUT
- Shows upload progress (0–100%)
- Preview after upload
- Replace / Remove buttons
- Error state with retry
- Max 10 MB, JPEG/PNG/WebP only
- Accepts `bucket` prop, `initialUrl`, `onUpload(url)`, `onRemove` callback
- Graceful: if Storage is unavailable, component shows error but doesn't crash

**Bucket status:** UNKNOWN. The Phase 20 report identified that buckets (`product-images`, `category-images`, `article-images`) need to be created by Pascal in the Supabase dashboard. The code is ready; the buckets may not exist yet.

**Storage path design** (from Phase 20): `products/{ts}-{random}.{ext}` — collision-resistant, no user-controlled path traversal.

---

## D. ImageUpload Component Assessment

The Phase 20 component is well-built. It already supports:
- ✓ Signed upload (browser → Storage directly)
- ✓ Validation (10 MB max, JPEG/PNG/WebP)
- ✓ Progress indicator
- ✓ Preview after upload
- ✓ Replace / Remove
- ✓ Error handling with retry
- ✓ Metadata recording via `recordImageUploadAction`
- ✓ `onUpload(url)` callback for parent to receive the public URL

**Gap:** The component doesn't track its own state for "removing an existing image." The `onRemove` callback is there but the parent must handle cleanup of the old Storage object.

**Reuse strategy:** Keep `ImageUpload` as-is. Integrate it into ProductForm by:
1. Swapping the URL text input for `<ImageUpload bucket="product-images">`
2. Storing the returned URL in a `useState` hook
3. Passing the stored URL to the Server Action via a hidden input or direct state

---

## E. Category Schema

**Table: `categories`**
```sql
categories (
  id uuid pk,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,          -- category hero image
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
)
```

- `image_url` is a nullable text field (paste URL)
- `active` toggle exists
- `sort_order` for display ordering
- **No RLS index** on `active` — public policy uses `active = true`

---

## F. Articles Schema (Phase 20)

```sql
articles (
  id uuid pk,
  title text NOT NULL,
  slug text UNIQUE,
  excerpt text,
  body text,
  author_name text,
  cover_image_url text,   -- paste URL
  status text DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

- `cover_image_url` is a nullable text field (paste URL)
- `body` is plain text — no WYSIWYG

---

## G. Existing Admin Actions

From `lib/admin-actions.ts`:

| Action | Works for gallery? |
|---|---|
| `createProductAction` | Inserts `gallery: []` — empty |
| `updateProductAction` | **Does NOT update gallery** — gap |
| `deleteProductAction` | Destructive delete |
| `setProductStatusAction` | Works |
| `createImageUploadAction` | ✓ Works (signed URL) |
| `recordImageUploadAction` | ✓ Works (metadata) |
| `deleteImageAction` | ✓ Works (cleanup) |

**Gap:** `updateProductAction` must be extended to handle `gallery` as an array of URLs.

---

## H. Security / RBAC

Current state is from Phase 19/20:
- OWNER: Products, Categories, Content, Journal, Enquiries, Settings
- SYSTEM_ADMIN: All of above + Users, Integrations, Security, Activity
- All Server Actions re-check `requireAdmin()` or `requireRole()`
- Service-role key never reaches browser
- Storage: direct browser → Supabase Storage upload (no proxy)

**No changes needed** to the security model for Phase 21.

---

## I. Stop Conditions

The following issues were investigated and resolved:

| Issue | Decision |
|---|---|
| Storage buckets don't exist yet | **Proceed** — ImageUpload handles missing bucket gracefully; code is ready for when Pascal creates buckets |
| Gallery column exists but UI doesn't manage it | **Proceed** — adding gallery management is additive, no existing data destroyed |
| `updateProductAction` doesn't update gallery | **Proceed** — extend the action to accept gallery array |
| No product metadata table | **Deferred** — Phase 21 does not add metadata fields; the architecture supports future addition |
| No existing images to migrate | **N/A** — existing `image_url` values are external URLs; Storage integration is additive for new uploads |
| `products` table has no index on `status` | **Add** — simple index on `status` for dashboard queries |

---

## J. Dashboard State

Current dashboard (`/admin/page.tsx`) shows:
- Published/draft product counts
- Active category count
- New enquiry count
- Recent products (last 5)
- Recent enquiries (last 5)

Phase 21 improvements:
- Add article count
- Add draft vs published article counts
- Quick action buttons
- (Scoped audit activity for OWNER — deferred)

---

## K. Change Password

Supabase Auth supports `updateUser({ password })` via the authenticated client. No Supabase Edge Function needed. The `updateUser` method on the auth client accepts `{ data: { password } }`.

Current `admin-actions.ts` has `updateProfileAction` for display name. Add `changePasswordAction` for password change.

---

## Next Step

Proceed to `Docs/PHASE-21-PLAN.md` and then implementation.
