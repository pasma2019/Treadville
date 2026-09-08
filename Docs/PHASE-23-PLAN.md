# PHASE 23 — PLAN

## Objective
Turn the Phase 22 metadata architecture into a fully functional product management experience — category-aware metadata editing in ProductStudio, dynamic journal storefront, and refined metadata presentation.

---

## Implementation Order

### 1. ProductStudio Metadata Integration (CORE)

**File:** `src/components/admin/ProductStudio.tsx`

#### Changes:
- Add `metadata` state: `Record<string, string>` initialized from `initial?.metadata ?? {}`
- Add `initial` prop type: extend to include `metadata: Record<string, string>`
- Add `Props` extension to include `initial?.metadata`
- Add new form section: "Category details" (after Commerce & Stock)
- Render metadata fields based on selected category via `METADATA_SCHEMAS`
- When category changes, filter metadata state to only show compatible fields
- Add `useEffect` to watch category changes and prune incompatible metadata keys
- Add `upsertProductMetadata` call in `handleSubmit` after product save succeeds

#### Data flow:
1. User fills product fields + metadata fields
2. `handleSubmit` calls `createProductAction` / `updateProductAction` with product FormData
3. If product saves successfully, call `upsertProductMetadata(productId, metadataState)`
4. If metadata save fails, show error but don't pretend product save failed
5. `revalidatePath` called for affected routes

#### Metadata section UI:
```
Category details
────────────────
[Category selector already above]

Origin:    [text input_______________]
Altitude:  [text input_______________]
Variety:   [text input_______________]
Processing:[text input_______________]
Grade:     [text input_______________]
SCA Score: [text input_______________]
Tasting:   [text input_______________]
Harvest:   [text input_______________]
```
(Fields vary by category — uses `METADATA_SCHEMAS[categorySlug]`)

#### Edge cases:
- **Category change on edit:** Keep existing metadata, prune keys not in new category schema. Show brief note: "Some fields may no longer apply."
- **No category selected:** Show hint "Select a category to see relevant fields"
- **Empty metadata:** No rows inserted — `upsertProductMetadata` filters out empty strings

#### Admin products page (server component):
- Load existing metadata for all products when editing. `getProductMetadata(product.id)` per product is too many queries — load all at once or load lazily on edit.
- **Preferred approach:** Load metadata lazily when ProductStudio opens in edit mode. Add a server-side `load` function in `admin/products/page.tsx` that fetches product metadata, or pass empty `{}` and let ProductStudio load it via a new client-side fetch.
- **Alternative (simpler):** Pass `metadata: Record<string, string>` in the `initial` prop from the page. Requires product page to call `getProductMetadata` for the specific product being edited. Already have `product.id` — add `metadata = await getProductMetadata(product.id)` and convert to `Record<string, string>`.

#### Save strategy:
```typescript
// In handleSubmit, after product action succeeds:
const productResult = productId
  ? await updateProductAction(productId, {}, fd)
  : await createProductAction({}, fd);

if (productResult.error) {
  setFormState({ error: productResult.error });
  setPending(false);
  return;
}

// Save metadata
const metaResult = await upsertProductMetadata(
  productId ?? productResult.productId!, // Need to return productId from create
  metadata
);

if (metaResult.error) {
  setFormState({ error: "Product saved but metadata failed: " + metaResult.error });
} else {
  onSuccess();
}
```

**Note:** `createProductAction` currently returns `{ success: string }`, not the product ID. We need to either:
- Return the product ID in the success response
- Or call a combined action for create + metadata in one go

**Decision:** Modify `createProductAction` to return `{ success: string; productId?: string }` so ProductStudio knows the new product's ID for metadata saving.

---

### 2. Metadata Label Refinement (STOREFRONT)

**File:** `src/app/product/[slug]/page.tsx`

Add `METADATA_DISPLAY_LABELS` map:
```typescript
const METADATA_DISPLAY_LABELS: Record<string, string> = {
  sca_score: "SCA Score",
  tasting_notes: "Tasting notes",
  pack_sizes: "Pack sizes",
  leaf_style: "Leaf style",
  harvest: "Harvest",
  moisture: "Moisture content",
  // generic: let title-case handle it
};
```

Use label from map if available, else fall back to title-case.

---

### 3. Journal Listing — Dynamic

**File:** `src/app/journal/page.tsx`

- Remove hardcoded `ESSAYS` array
- Add `getArticles()` query function (fetch published articles from `articles` table)
- Map articles to journal card data
- Keep editorial layout and typography — only data changes

**New query function** in `queries.ts`:
```typescript
export async function getArticles(publishedOnly = true): Promise<Article[]> {
  let query = supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw error;
  return (data as Article[]) ?? [];
}
```

**Update types.ts** if `Article` type doesn't exist or needs expansion.

---

### 4. Journal Article Detail Page (NEW)

**File:** `src/app/journal/[slug]/page.tsx`

Components:
- Cover image (full-bleed or contained hero)
- Article metadata: title, author, date, excerpt
- Article body (rendered as HTML or plain text)
- Back to journal link
- Related articles (optional)
- SEO: title, description, Open Graph

Route: `/journal/[slug]`
- Load article by slug
- Return 404 if not found or not published
- `generateMetadata` for SEO
- No auth required (public)

---

### 5. Article Type — Ensure Definition

**File:** `src/lib/types.ts`

Check if `Article` type exists. Expected fields:
```typescript
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};
```

Add if missing.

---

### 6. Article Body — Evaluate Tiptap

**File:** `src/components/admin/ArticleForm.tsx`

**Decision tree:**
1. Run `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit`
2. Run `npm run build`
3. If build passes → integrate Tiptap in ArticleForm
4. If build fails or has warnings → defer Tiptap, keep textarea with improved placeholder

**Tiptap integration (if added):**
- Toolbar: Bold, Italic, Heading 2, Heading 3, Bullet list, Ordered list, Blockquote, Link
- Serialize to HTML string on save (Tiptap default output)
- Render with `dangerouslySetInnerHTML` on storefront (admin-authored content is trusted)
- Placeholder text appropriate to Treadville editorial voice

---

## Files to Create

| File | Purpose |
|---|---|
| `src/app/journal/[slug]/page.tsx` | Article detail page |
| `src/app/journal/[slug]/ArticleBody.tsx` | Safe HTML renderer |
| `src/lib/article-queries.ts` | `getArticleBySlug`, `getArticles` |

## Files to Modify

| File | Change |
|---|---|
| `src/components/admin/ProductStudio.tsx` | Add metadata section, load/save metadata |
| `src/app/admin/products/page.tsx` | Load existing metadata for product being edited |
| `src/lib/queries.ts` | Add `getArticles`, `getArticleBySlug` |
| `src/lib/types.ts` | Add/verify `Article` type |
| `src/lib/admin-actions.ts` | Return productId from `createProductAction` |
| `src/app/journal/page.tsx` | Use `getArticles()` instead of static array |
| `src/app/product/[slug]/page.tsx` | Category-aware metadata label map |
| `src/app/journal/[slug]/page.tsx` | New article detail page |
| `package.json` | Add Tiptap if evaluation passes |

## Database / Schema

No schema changes required.

## Testing

1. Create a new product → add metadata → save → verify in Supabase `product_metadata` table
2. Edit an existing product → verify metadata loads → change category → verify fields update
3. Visit product detail page → verify metadata renders with correct labels
4. Publish an article in admin → visit `/journal` → verify article appears
5. Click article on journal listing → verify `/journal/[slug]` renders
6. `npx tsc --noEmit`
7. `npm run build`

## Estimated Scope

- ProductStudio metadata: ~150 lines added/changed
- Metadata loading on edit: ~30 lines
- Journal listing refactor: ~30 lines
- Journal detail page: ~100 lines
- Tiptap evaluation: conditional, ~100 lines if added
- Label refinement: ~10 lines
- Total: ~300-400 lines of meaningful change

---

## What to NOT Touch

- ProductCard component (works fine)
- Category editing (works fine)
- Security architecture (intact)
- Existing product actions (only augment their return type)
- Gallery management (works fine)
- Photography wiring (works fine)
- Checkout/contact/enquiry flow (works fine)
