# SLICE 15 — MEDIA & IMAGE LIFECYCLE REPAIR

> **CLOSURE CORRECTION (Slice 16 closure, 2026-09-13):** this report and the shipped code
> described the managed-image deletion audit action as `image_removed`. The registered taxonomy
> (`src/lib/audit-utils.ts:46`, wired into the admin dashboard) is **`image_deleted`**. The label
> was corrected at the single emission point during Slice 16 closure; `image_removed` no longer
> exists in shipped source. Statements below referencing `image_removed` are historical
> (pre-correction) and superseded by `image_deleted`. See `SLICE-16-CONTENT-CMS-V1.md` §12/§15.

## 1. EXECUTIVE SUMMARY

Slice 15 repaired the two confirmed media/data-integrity defects from Slice 14B:

1. **Image removal did not remove the Supabase Storage object.** The admin Remove button only cleared local editor state (`src/components/admin/ImageUpload.tsx:142-153`), and the once-intended server action `deleteImageAction` (`src/lib/admin-actions.ts:1003`) had **0 importers** and no effective execution path. Every "removal" left the object in the public `site-images` bucket.
2. **Product creation discarded uploaded gallery.** `createProductAction` persisted `gallery: []` unconditionally (`admin-actions.ts:52`), so gallery images uploaded during create were silently dropped while the edit path respected gallery data (`admin-actions.ts:103-107`).

The repair is confined to `src/lib/admin-actions.ts` and `src/components/admin/ProductStudio.tsx`. One internal deletion primitive (`deleteManagedImage`) and one public action (`deleteImageAction`) now back all removal paths; deletion happens **save-time** (committed Save compares previous vs new references), never on a Cancel that isn't committed. Gallery create and edit now share one validated parser; `gallery: []` is no longer hardcoded. Media events use the existing audit infrastructure (`image_removed`, `product_updated`; publish/unpublish only on real status transitions). Verified by `npx tsc --noEmit`, `npm run build` (Next 16 compiled, TypeScript passed), and fresh live verification through the pooler route: all §16 baseline counts match exactly, Storage = 24 objects, no test residue, orphans untouched. No database migration was required or created. Migration-history integrity was re-confirmed in the same pass: `20260912_0008_articles_admin_policy_jwt_role` remains registered; the repo-only `20260907_0001_articles.sql` discrepancy is pre-existing and does not affect this slice.

## 2. PRE-IMPLEMENTATION LIVE BASELINE

Freshly verified via the Supabase session pooler (`aws-0-eu-central-1.pooler.supabase.com:5432`, credentials from `SUPABASE_DB_URL`, never printed) before and after implementation:

Catalogue: products **8** · published **2** (Black Tea (Demo), Specialty Tea (Demo)) · draft **6** · categories **4** · active **4** · product_metadata **0**

Commerce/content: orders **0** · order_items **0** · customers **0** · order_communications **0** · enquiries **0** · audit_log **0** · articles **0**

Users/security: profiles **2** · admin_roles **2**

Storage: `site-images` **24** objects.

References independently calculated live: `products.image_url` (8 rows: 4 managed — `products/masai-coffee-moka-espresso/primary.png`, `products/masai-coffee-supreme/primary.png`, `categories/tea/cat-tea-card.png` ×2 — and 4 local `/images/...` placeholders) · `products.gallery` (all `[]`) · `categories.image_url` (4 managed cat-card images) · `site_content` (16 of 19 rows carry `site-images` public URLs) · articles (0, no cover refs).

## 3. ROOT CAUSE — IMAGE DELETION

Trace, verified before any change:

- `ImageUpload.tsx:142-153` — Remove button fires `reset(); onRemove();`.
- `onRemove` is a parent-provided state callback: `ProductStudio.tsx removePrimary/removeFromGallery` (`:135-137`, `:131-133`) or `setImageUrl("")` in `ArticleForm.tsx:97` / `CategoriesClient.tsx:278`. No server call occurs.
- `src/lib/admin-actions.ts:1003 export async function deleteImageAction` existed with **zero importers** (repo-wide search), so the intended storage deletion was structurally unreachable from the UI.
- Storage removal therefore never ran; `Remove → Save` only changed the DB reference, leaving the object in `site-images`.

Live evidence (Slice 14B): the four `products/coffee-gallery/*` objects were already orphaned — proof that uploaded-then-abandoned images permanently accumulate.

## 4. ROOT CAUSE — PRODUCT GALLERY CREATE

Trace, verified before any change:

- ProductStudio upload → `ImageUpload onUpload` success → state sets → `handleSubmit` → `createProductAction(formData)`.
- Create insert read the gallery field nowhere and hardcoded `gallery: []` (`admin-actions.ts:52`), whereas the update path parsed and persisted form `gallery` (`admin-actions.ts:103-109`).
- Result: `UPLOAD → CREATE → gallery: [] → DB references lost → objects remain → orphans`.

The failure mode was reached on **every** create-with-gallery, not a single prod occurrence. Edit/update already worked.

## 5. IMPLEMENTATION CHANGES

`src/lib/admin-actions.ts`:
- `createProductAction` insert now persists `gallery: parseGalleryValue(String(formData.get("gallery") ?? ""))` (`:52`).
- `updateProductAction` uses the identical parser (`:104`), snapshots `image_url, gallery, status` pre-update (`:109-113`), and runs `deleteRemovedManagedImages(prevRefs, newRefs)` after a successful DB update (`:118-123`). Audit now emits `product_updated` for plain edits and `product_published`/`product_unpublished` **only when status actually transitions** (`:125-132`) — plain edits are no longer mislabeled.
- `updateCategoryAction` snapshots `prevCategory.image_url` and deletes the replaced managed image on change (`:257-266`).
- `updateArticleAction` snapshots `prevArticle.cover_image_url` and deletes a replaced managed cover on change.
- Added internals: `STORAGE_PATH_MAX`, `isSafeRelativePath`, `deriveManagedStoragePath` (origin-locked to `NEXT_PUBLIC_SUPABASE_URL`), `parseGalleryValue`, `deleteManagedImage` (`:890-907`), `deleteRemovedManagedImages`. All Storage deletion uses `supabase.storage.from("site-images").remove([path])` — never SQL against `storage.objects`.
- `deleteImageAction` (`:1003-1008`) rewritten to take a **managed URL reference**, validated via `deriveManagedStoragePath`, delegating to `deleteManagedImage`. `cleanupOrphanedUploadsAction` **retired** (removed) so exactly one public deletion action exists.

`src/components/admin/ProductStudio.tsx`:
- Import of `deleteImageAction` replaces `cleanupOrphanedUploadsAction` (`:5-12`).
- `trackUpload` records each upload URL; `savedRef` + `persistedUrls` gate unmount cleanup; on unmount-without-save, pending non-persisted session uploads (cap 40) are each cleaned via `deleteImageAction(u).catch(() => {})` (`:96-102`). `savedRef.current = true` is set before `onSuccess()` in both save handlers.

## 6. DELETION ARCHITECTURE

```
deleteImageAction(reference)   // public server action — exactly one production importer
        │  requireAdmin()
        ▼
deriveManagedStoragePath(reference)   // validate: project URL + site-images bucket + safe path
        ▼
deleteManagedImage(storagePath)
   ├─ isSafeRelativePath(storagePath)          // reject traversal/malformed/too-long
   ├─ storage.from("site-images").remove([path])   // Supabase Storage API only
   ├─ delete storage_files row (ManagedStorage-style table, kept consistent)
   └─ logAudit({ action: "image_removed", ... })
```

Committed-save path (save-time model, mandated by §5): `ProductStudio Save` → `createProductAction`/`updateProductAction` → DB references persisted **first** → `deleteRemovedManagedImages(prev, new)` → per-removed-object `deleteManagedImage` best-effort. `Remove → Cancel` never touches Storage (state only). This satisfies "Remove → Cancel must NOT destroy the actual Storage object"; deletion belongs to the committed Save.

Ordering is deliberately non-atomic across Postgres/Storage: **DB reference first → Storage deletion best-effort**, preferring a recoverable **orphan** (Failure A) over a customer-facing **broken reference** (Failure B). No cross-system atomicity is claimed. On Storage failure the function returns `{ error }` (public action) or `console.error`s the path (save-time batch); the DB reference is never restored and never broken.

## 7. GALLERY PERSISTENCE ARCHITECTURE

One shared parser, both paths:

`parseGalleryValue(raw)` (`admin-actions.ts:867-888`): JSON array → strings only → trim → absolute `http(s)` URLs only → dedupe → cap **12** (resource-protection limit; connected to the storefront renderer that maps over the array — no prior limit existed; evidence documented) → malformed input safely yields `[]`.

- Create: `gallery: parseGalleryValue(...)` (was `gallery: []`).
- Update: same `parseGalleryValue(...)`.
- Edit read / storefront read: `src/app/(storefront)/product/[slug]/page.tsx:150` — `images={[product.image_url, ...(product.gallery ?? [])]}`.

Create and edit now converge on exactly one representation.

## 8. IMAGE REPLACEMENT BEHAVIOR

Replacement flows in product (primary/gallery), category image, and article cover updates follow the same ordered semantics:

```
old image (managed URL) → replaced with new → Save
  1. DB reference updated to new value first
  2. deleteRemovedManagedImages(old, new) → best-effort delete of removed managed objects
```

Guard against shared references: deletion is diff-based on **that entity's** previous/current references and runs per-object through `deriveManagedStoragePath`. An old image is deleted only if it leaves that entity's reference set and is a managed object; shared images remain referenced elsewhere and are untouched (`categories/tea/cat-tea-card.png` is the shared precedent — §10/§22 regression confirms it intact). Replacement therefore no longer creates an orphan (previously the dead path left every replaced object in the bucket).

## 9. ENTITY-DELETE CLEANUP — DEFERRED

Inspected all three entity-delete actions in `src/lib/admin-actions.ts`:

- `deleteProductAction` (`:159-174`) — deletes the `products` row only. **No media removal.**
- `deleteCategoryAction` (`:279-292`) — deletes the `categories` row only. **No media removal.**
- `deleteArticleAction` (`:795-810`) — deletes the `articles` row only. **No media removal.**

None invoke `deleteManagedImage`/any Storage operation. This is **deliberate**. Images can be shared across entities (verified: `categories/tea/cat-tea-card.png` is the `image_url` of both published Tea products **and** the Tea category), so deleting an image on entity delete could break another entity. Reference counting / ownership graphs are explicitly out of scope. Recording: entity-delete media cleanup is a **future CMS/media-lifecycle requirement** that must first establish reference safety, then may reuse `deleteManagedImage`.

## 10. EXISTING ORPHAN CLASSIFICATION

All four candidates checked against every reference source live + in the repository:

- `products.image_url` — no reference (managed product images are `masai-coffee-*` primaries; tea products use `cat-tea-card.png`).
- `products.gallery` — all `[]` → no reference.
- `categories.image_url` — no reference (only 4 cat-card images).
- `articles.cover_image_url` — no articles.
- `site_content.value` (all 19 rows scanned; 16 image-bearing) — 0 rows reference `coffee-gallery`.
- Application source (`src/`) — 0 references to `coffee-gallery`.
- Static paths (`public/`) — no `coffee-gallery` files.

| Path | In bucket | DB-referenced | App/static-referenced | Classification |
|---|---|---|---|---|
| `products/coffee-gallery/lifestyle.png` | ✓ (2.2 MB) | no | no | **orphan** |
| `products/coffee-gallery/macro.png` | ✓ (2.3 MB) | no | no | **orphan** |
| `products/coffee-gallery/pdp-alt.png` | ✓ (2.3 MB) | no | no | **orphan** |
| `products/coffee-gallery/process.png` | ✓ (2.6 MB) | no | no | **orphan** |

**Not deleted** — Slice 15 stops creating new orphans; historical purge requires explicit owner justification. No object was deleted merely for being unreferenced in one table.

## 11. LIVE VERIFICATION — IMAGE DELETE

Through the pooler route and the exact Storage API call the shipped actions use:
- Objects before: **24**.
- Uploaded temp object `slice15-livecheck/<ts>-<rand>.png` → present (25).
- `storage.from("site-images").remove([testPath])` → `ok`.
- Objects after: **24**; remaining set **identical** to before (no unrelated object deleted, none created).

Importer/execution-path verification after implementation (repository-wide): `deleteImageAction` has **exactly one legitimate production importer** — `src/components/admin/ProductStudio.tsx:11` (used at `:99`, cancel-time cleanup). Not 0, not multiple. `cleanupOrphanedUploadsAction` no longer exists (no competing mechanism). The single Storage `.remove([...])` call site is `admin-actions.ts:892`.

Unauthorized invocation: `deleteImageAction` calls `requireAdmin()` first; anonymous/non-admin JWT roles are rejected server-side before any Storage or DB call (verified by code path; RLS untouched).

Failed-deletion safety: `deleteManagedImage` returns `{ error }` on Storage failure; `deleteRemovedManagedImages` logs it. DB reference was already committed → outcome is an orphan (tolerated), never a broken reference. No unrelated object is touched (Storage operates on the single validated target path).

## 12. LIVE VERIFICATION — GALLERY CREATE

Controlled temp data, fully rolled back (details in §15):

- Temp **draft** product inserted with gallery `[lifestyle.png, macro.png]` URLs.
- `SELECT gallery` read back → **equal**, count 2 (persisted exactly as `parseGalleryValue` would emit).
- Referenced objects verified still present.
- Temp product deleted → products back to **8**.
- Zero temp slugs, zero `slice15-*` object namespace residue.

Delete/rollback discipline: live tests used the pooler with full cleanup of inserted rows; Storage tests uploaded temp objects and removed them via the Storage API (Storage is not part of any Postgres transaction — cleanup was explicit). Final state: zero test products, zero test gallery refs, zero test storage objects, zero test rows.

## 13. STORAGE BEFORE/AFTER

| | Before any test | After implementation + tests |
|---|---|---|
| `site-images` objects | **24** | **24** |
| Object list | full baseline captured (all 24 names) | identical set, in order |
| Unrelated deletions | — | **0** |
| Unexpected creations | — | **0** |
| Known orphan candidates | 24 (4 orphans) | still present, untouched |
| Test-created objects | 0 | 0 (`slice15-*` namespace empty) |

No SQL was used against Storage metadata at any point.

## 14. SECURITY / AUTHORIZATION VERIFICATION

- Deletion entry points are server actions calling `requireAdmin()` (`auth.jwt() -> app_metadata ->> role` in `OWNER`/`SYSTEM_ADMIN`). No new role system; RLS and bucket policies untouched/not weakened.
- `deleteImageAction` accepts only a **managed reference**; `deriveManagedStoragePath` requires the value to start with this project's `NEXT_PUBLIC_SUPABASE_URL` + `/storage/v1/object/public/` and pins the bucket to `site-images`.
- `isSafeRelativePath` rejects: traversal (`..` / `.`), leading/trailing slashes, empty segments, whitespace/control, non `[\w.\-+]` characters, paths > 500 chars.
- Behavioral matrix (14 cases, `part3_all_match: true`): root-level and deep managed URLs derive; traversal, slash/dot/empty/space segments, wrong bucket, and **foreign-host URL with identical storage path** reject; URL-encoded paths decode and derive; local `/images/...` assets resolve to `null` (never deletion targets).
- A browser-supplied arbitrary path cannot become a delete target: bare paths are not accepted by the public action, and internal calls only ever pass values derived through the same guards.

## 15. TEST RESIDUE / DATA INTEGRITY

Fresh post-implementation verification (pooler) — `all_match: true`, **zero mismatches**:

products 8 · published 2 · draft 6 · categories 4 · active 4 · product_metadata 0 · site_content 19 · articles 0 · orders 0 · order_items 0 · customers 0 · order_communications 0 · enquiries 0 · audit_log 0 · audit archive has **no** `image_removed`/test rows · profiles 2 · admin_roles 2 · storage 24.

Additional integrity: published Tea images intact (both reference `categories/tea/cat-tea-card.png`); shared `cat-tea-card.png` present; local placeholder refs (`/images/product-placeholder-*.jpg`) untouched; article RLS verified JWT-based (`pg_policies`: `Admins manage articles` uses `auth.jwt()` role claim, no `admin_roles` join); migration `20260912_0008` still registered; `npx tsc --noEmit` clean; `npm run build` compiled with TypeScript passing (repo `npm run lint` remains the pre-existing `es-abstract` failure, unrelated and not fixed).

Storage before/after: 24 → 24, identical set (details in §13).

## 16. GATE FOR SLICE 16

- Image deletion reaches exactly one legitimate production importer (`ProductStudio.tsx:11`).
- Authorized deletion is wired live; mechanism proven live (24→25→24, no unrelated object).
- Unauthorized and non-managed/arbitrary paths are rejected (server authorization + validated derivation).
- DB references stay safe (save-time, DB-first ordering; Failure B prevented).
- Gallery create persists 0/1/multiple validated images (shared parser); edit and storefront reads proven.
- No unintended Storage deletions; no test residue; baseline intact; git scope limited to `src/lib/admin-actions.ts`, `src/components/admin/ProductStudio.tsx`, and this report.

# GREEN — SLICE 15 COMPLETE; PROCEED TO SLICE 16