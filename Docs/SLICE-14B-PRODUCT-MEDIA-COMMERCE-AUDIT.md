# SLICE 14B — PRODUCT, MEDIA & COMMERCE OPERATIONS AUDIT

> Read-only audit. Zero file mutations. Independent live verification via pooler connection.
> Builds directly on Slice 14A findings (`Docs\SLICE-14A-CONTENT-DATA-ARCHITECTURE-AUDIT.md`).
> Date: 2026-09-12 · Git baseline: unchanged (58 entries, 21 modified / 37 untracked).

---

## 1. EXECUTIVE SUMMARY

This slice answers one question: **can Treadville's Product, Image/Media, Commerce and Admin UX architecture be trusted to become the operator-owned CMS platform, without a developer between every content change?**

**Verdict: The architecture is directionally right, but NOT yet operable by a non-developer.** A small number of high-impact defects and gaps would make a business owner destroy marketing data or feel the tool is broken. None are architectural failures; all are fixable during the CMS build.

**The three most dangerous findings for the operator:**

1. **"Remove image" does not remove anything.** The admin's Remove button clears the local field only; the file stays in the public `site-images` bucket forever (`ImageUpload.tsx:142-153`; `deleteImageAction` at `admin-actions.ts:881-908` is **dead code — zero importers**). Today 4 of 24 storage objects (the `products/coffee-gallery/*` set) are already orphans.
2. **Product gallery is silently dropped on Create.** `createProductAction` never reads the gallery FormData field and inserts `gallery: []` (`admin-actions.ts:52`); the edit path reads it (`admin-actions.ts:104-109`). An operator who adds gallery images to a new product loses them from the record (the files remain as orphans).
3. **The Content editor edits 3 keys that do nothing (`hero_headline`, `hero_subheadline`, `hero_image`)** and **every key the homepage actually renders is not editable** (`content/page.tsx:15-40` vs `app/(storefront)/page.tsx:35-194`). The Settings "Business" tab writes 6 fields the storefront never reads (`SettingsClient.tsx:14-21` vs hardcoded `SiteFooter.tsx:162-191`).

**Secondary systemic issues:** admin lists show stale rows after mutations (no refetch), destructive confirmations hide consequences, `upsertProductMetadata` and login/logout produce **zero audit rows**, product edits are mis-attributed as `product_published`/`product_unpublished`, `delivery_location` is collected nowhere in checkout despite the RPC supporting it, and there is **no order→customer email path** (Resend is enquiry-only).

**Knows hard limits (this slice establishes, not fixes):** the original `/images/product-placeholder-*.jpg` references still exist on 4 draft products; storage bucket is publicly readable by design; order state transitions are enforced in the application layer only (DB has a value CHECK but no transition trigger).

**Live-verified facts for 14B (pooler, 2026-09-12 15:30Z):** 8 products (2 published / 6 draft), 4 active categories, `product_metadata` = 0 rows, `site_content` = 19 rows, `articles` = 0, all commerce tables = 0 rows, `profiles` = 2, `admin_roles` = 2, storage bucket `site-images` (public), 24 objects.

---

## 2. CURRENT LIVE STATE

Verified independently (see temp script `slice14b-live.js`):

```
products            8   (published 2 / draft 6)
categories active   4
product_metadata    0
site_content        19
articles            0
orders              0
order_items         0
customers           0
order_communications 0
enquiries           0
audit_log           0
profiles            2
admin_roles         2
storage.objects     24 (bucket "site-images", public=true, no file size/mime limits)
```

Session / roles: `profiles` populated, but **all authorization derives from JWT `app_metadata.role`** (`src/lib/auth.ts`), not the `admin_roles` table (2 rows). The live DB state copy recorded in `db-state.json` (repo root) is **stale** — do not use as authority.

---

## 3. PRODUCT MANAGEMENT

### What exists (verified end-to-end)

| Stage | UI | Server action | Audited |
|---|---|---|---|
| Create | `ProductsClient.tsx:144-149` → `ProductStudio.tsx` | `createProductAction` `admin-actions.ts:27-73` | yes (`product_created`) |
| Save as draft | `ProductStudio.tsx:447-488` | same action, `status:"draft"` | yes (by status) |
| Edit | `ProductsClient.tsx:231-236` → `loadProductWithMetadata` `admin-actions.ts:947-972` | `updateProductAction` `admin-actions.ts:75-129` | yes but mis-attributed (§16) |
| Publish/Unpublish | `ProductsClient.tsx:237-246` | `setProductStatusAction` `admin-actions.ts:131-147` | yes |
| Metadata | `ProductStudio.tsx:407-425` | `upsertProductMetadata` `admin-actions.ts:974-1012` | **NO** |
| Image | `ImageUpload.tsx` | upload chain `admin-actions.ts:799-879` | yes (`image_uploaded`) |
| Gallery | `ProductStudio.tsx:321-325` | create **drops it**, update keeps it | partial |
| Delete | `ProductsClient.tsx:247-252` | `deleteProductAction` `admin-actions.ts:149-164` | yes |

### Defects found

- **BUG — gallery dropped on create:** `admin-actions.ts:52` hardcodes `gallery: []`. Form sends `gallery` JSON (`ProductStudio.tsx:140`). Files uploaded for new products become orphans in storage. **Fix: read the field exactly like the update path (`admin-actions.ts:103-109`).**
- **BUG — list never refreshes:** after any mutation the `products` array is a stale prop; deleted rows remain on screen after success toast (`ProductsClient.tsx:50-162`). Second delete on a phantom row "succeeds" on zero affected rows (`admin-actions.ts:152`).
- **Raw DB text leak:** duplicate-slug create/update appends Postgres `error.message` to the UI (`admin-actions.ts:57`, `:113`). Articles handle this gracefully (`admin-actions.ts:674-676`).
- **Number parsing without NaN guard:** `Number(priceRaw)` / `Number(stockRaw)` with no `isNaN` check (`admin-actions.ts:46-47`, `:91, :95`) — malformed input silently becomes 0.
- **No duplicate/copy product, no mobile/tablet preview** (preview pane `hidden lg:block`, `ProductStudio.tsx:493`), **"Drag to reorder" labelled but unimplemented** (only arrow buttons, `ProductStudio.tsx:287-299, 596-616`).
- **Stock is ornamental:** persisted (`admin-actions.ts:47, 95`) but read nowhere in the storefront (commerce is enquiry/cart on price only — `ProductDetailClient.tsx:11-15`).
- **Metadata partial-write hazard:** if create succeeds and metadata fails, retry creates a **second product** (`ProductStudio.tsx:152-170`); delete only target-rows in `upsertProductMetadata` (`admin-actions.ts:997-1007`) so stale keys survive a category change and still render (`product/[slug]/page.tsx:97-99`).

---

## 4. EUNICE TEST — PRODUCTS

Scenario: *"Open the site, add a product with a photo and product details, save it as a draft, then publish it."*

| Step | Outcome | Evidence |
|---|---|---|
| Find "Add product" | ✅ explained label | `ProductsClient.tsx:144` |
| Choose category | ✅ sensible dropdown | `ProductStudio.tsx:234-249` |
| Enter name | ✅ required, clear error | `ProductStudio.tsx:125-126, 211` |
| Upload photo | ✅ live preview + Replace/Remove | `ImageUpload.tsx:119-165` |
| **Remove the photo** | ❌ **storage object stays, may re-appear** | `ImageUpload.tsx:142-153`; dead `deleteImageAction` |
| Add gallery images | ❌ **silently lost on create** | `admin-actions.ts:52` |
| Enter price | ✅ numeric field | `ProductStudio.tsx:341-362` |
| See technical jargon | ⚠️ "slug" unlabelled, raw "draft/published" badges, raw DB error on dup slug | `ProductStudio.tsx:217-230`; `ProductsClient.tsx:209-217`; `admin-actions.ts:57` |
| Save as draft | ✅ works | `ProductStudio.tsx:447-488` |
| Publish from list | ✅ with confirm | `ProductsClient.tsx:237-246` |
| See result on storefront | ⚠️ toasts exist but **list stays stale** until reload | `ProductsClient.tsx:50-162` |

**Result: 8 of 10 intended steps work; the two silent failures (Remove, gallery-on-create) are exactly the ones that corrupt catalogue data.**

---

## 5. IMAGE & MEDIA MANAGEMENT

### Upload pipeline (works — light abuse surface)

`ImageUpload.tsx` → `createImageUploadAction` (signed PUT, `admin-actions.ts:799-846`) → `recordImageUploadAction` (`admin-actions.ts:848-879`, audit `image_uploaded`) → `storage_files` row + audit. Client enforces type/size only via accept attribute + server-side `admin-actions.ts:806-811`.

### Defects

- **Dead delete action:** `deleteImageAction` (`admin-actions.ts:881-908`) is imported **nowhere** in the repo. The audit literal `image_deleted` can never fire.
- **"Remove" ≠ delete:** `ImageUpload.tsx:142-153` → parent `onRemove` only nulls the field (`ProductStudio.tsx:110-112`, `CategoriesClient.tsx:278`, `ArticleForm.tsx:97`). File stays in the **public** bucket; `storage_files` rows accumulate; old public URLs remain active forever.
- **No image replacement accounting:** swapping a product/category primary image is logged only as `product_updated`-style status actions or `category_updated`, never as image lifecycle. Older object is orphaned.
- **No broken-image fallback anywhere in admin:** all `<img>` lack `onError` (`ImageUpload.tsx:128-132, 222-228`; `ProductStudio.tsx:502-522, 579`; `ProductsClient.tsx:189-193`; `CategoriesClient.tsx:142`; `JournalClient.tsx:115-120`).
- **Upload leaks object URLs on success** (`URL.createObjectURL`, `ImageUpload.tsx:44`; revoked only on error `:54, :93`).
- Products referencing storage use their own paths; the two published tea demos **share** `categories/tea/cat-tea-card.png` as their primary image (valid today, fragile because category edits then change product visuals).

### Orphan risk proven live

`products/coffee-gallery/{lifestyle,macro,pdp-alt,process}.png` (4 of 24 objects) are referenced by **no product, no site_content key, no category** — the only proof-needed that uploaded-then-abandoned files permanently accumulate in a public bucket. Unreferenced reference point for §6 matrix.

---

## 6. SITE-WIDE MEDIA MATRIX (24 storage objects, live 2026-09-12)

| Object | Reference | Status |
|---|---|---|
| categories/coffee/cat-coffee-card.png | categories.image_url (Coffee) | ✅ used |
| categories/tea/cat-tea-card.png | category + **2 published tea products** | ✅ shared |
| categories/horticulture/cat-hort-card.png | categories | ✅ used |
| categories/grains/cat-grains-card.png | categories | ✅ used |
| categories/*/hero-*.png (4) | category_hero_{slug} site_content | ✅ used |
| homepage/hero-home-portrait.png | `homepage_hero` | ✅ used (HeroSlideshow) |
| editorial/provenance/provenance-landscape.png | `provenance_image` + `origins_body_kirinyaga` | ✅ used |
| editorial/provenance/provenance-macro.png | `origins_body_terroir` | ✅ used |
| editorial/journal/journal-{coffee,tea,horticulture}.png | `journal_card_*` | ✅ used |
| pages/about/page-about-hero.png | `about_hero` | ✅ used |
| pages/quality/page-quality.png | `quality_hero` | ✅ used |
| pages/export/hero-export.png | `export_hero` | ✅ used |
| pages/export/page-export-doc.png | `export_doc` | ✅ used |
| products/masai-coffee-*/primary.png (2) | products.image_url (2 drafts) | ✅ used (draft) |
| products/coffee-gallery/*.png (4) | **nothing** | ❌ **orphans** |

Local non-storage images still referenced: `/images/product-placeholder-hort.jpg`, `product-placeholder-grain.jpg` on 4 draft products (Export Horticulture, Fresh Produce, Maize, Rice) — local repo files that must ship with the app or these drafts break.

---

## 7. EUNICE TEST — CONTENT CMS

Scenario: *"Change the homepage headline and hero image."*

Result (same as 14A — restated as the deciding test for §22):

1. Open Admin → Content ✅ (`content/page.tsx:15-40`)
2. Editable keys shown are `hero_headline`, `hero_subheadline`, `hero_image`, `about_blurb`
3. `hero_headline` / `hero_subheadline` / `hero_image` → **no storefront reader; homepage hero text is hardcoded** (`HeroSlideshow.tsx:6-7, 69-78`); homepage image key is **`homepage_hero`**, a *different* key (`page.tsx:35`)
4. `about_blurb` → updates ✅ (`page.tsx:143`)
5. The homepage fields she actually sees (`homepage_hero`, `featured_*`, `story_*`, `provenance_*`, `journal_card_*`) → **not editable in admin at all**

**Eunice Test result: FAIL.** 3 of 4 editable fields do nothing; the fields that matter can't be edited. Compare Storefront reader inventory (§17).

---

## 8. PRODUCT METADATA

- Table alive (`supabase/schema.sql:150-157`), read by storefront (`product/[slug]/page.tsx:85, 97-99`), `product_metadata` = **0 rows** live.
- Written only via `upsertProductMetadata` (`admin-actions.ts:974-1012`), surfaced by category in `ProductStudio.tsx:407-425`.
- **Findings:**
  - **Not audited** — the only CMS mutation with zero `audit_log` rows possible (§16.3).
  - **Stale-key leak:** prune deletes only keys present in the submitted object (`admin-actions.ts:997-1007`); switching a Coffee product to Tea leaves `sca_score` etc. in place and still rendering (`product/[slug]/page.tsx:97-99`).
  - **Category-driven field sets are client-only** (`ProductStudio.tsx:65-81`): the server trusts arbitrary key/value pairs; server has no schema of allowed keys per category.

---

## 9. CATEGORY MANAGEMENT

- CRUD fine: `CategoriesClient.tsx` ↔ `createCategoryAction` / `updateCategoryAction` / `toggleCategoryActiveAction` / `deleteCategoryAction` (`admin-actions.ts:174-271`).
- **Storefront scope is server-enforced, not query-enforced:** published-products and active-categories RLS policies gate `queries.ts:6-13, 30`; app queries don't filter `active` themselves (`queries.ts:6-13`) — safe today, brittle if RLS ever changes.
- **Destructive cascade is the headline risk:** categories → products `ON DELETE CASCADE` (`schema.sql:84`) plus product_metadata cascade (`schema.sql:154`). One confirm in the UI destroys a category + every product + metadata; confirmation text warns generically ("will also delete all products", `CategoriesClient.tsx:37`) but shows **no product count** and no storage-image consequence. No undo, no recycle bin.
- Raw DB error text on duplicate slug (`admin-actions.ts:191`).
- Category image replace/removal inherits the Remove-doesn't-delete defect (§5).

---

## 10. COMMERCE OPERATIONS

### Public paths (verified clean)

- Enquiry: `submitEnquiryAction` (rate-limited, server validation, Resend email via `enquiry-notify.ts`, audit `enquiry_submitted`) → `enquiries` table; anon/authenticated INSERT revoked (`20260911_0006_close_enquiries_anon_write.sql`).
- Checkout: `submitOrderAction` (`order-actions.ts:30-178`) — rate-limit (5/60s/IP), server field validation, published-only product pre-check via anon client, sentinel-mapped RPC errors; **no raw DB text reaches the customer**. `create_order` RPC executes in one implicit transaction with `invalid_input/invalid_items/invalid_quantity/product_not_available` raise → full rollback; grants deliberately carved to `service_role` only (`0002:346-349`, `0003:196-199`).

### Gaps (all evidence-based)

| Gap | Evidence |
|---|---|
| **`delivery_location` never collected in checkout** — server reads the form field (`order-actions.ts:48` → `p_delivery_location` RPC `0003:27,66,89-90,145`) but the form has only `full_name`, `email`, `phone`, `customer_notes` (`checkout/page.tsx:171-200`). Always NULL for storefront orders. | DATA |
| **No order→customer email path** — the only Resend usage is enquiries (`enquiry-notify.ts:102`, called `enquiry-actions.ts:96`). Order create/confirm/fulfil is silent to the customer beyond the on-screen reference (`checkout/page.tsx:42-46`). | BUSINESS/must |
| **No enquiry→order conversion** — must be re-typed; no action exists. | UX |
| **No structured quotes, shipment, tracking** — `fulfilled`/`completed` are strings only (`0001:89-103`); quotes only exist as free text in notes/summary. | BUSINESS |
| **Communications are manual-only** (explicit UI copy, `OrderDetailClient.tsx:223-226`; channel `whatsapp`/`other`, `0004:56-65`). Deliberate for prototype — fine. | DEFERRED |
| **Order/notes/communication writes all guarded `requireAdmin`** (`admin-actions.ts:351,413,459,311,328`); orders RPC service-role only. No non-admin path exists. | SECURITY ✅ |
| **Order snapshots** decouple from mutable `customers` record (`0001:95-98`; UI notes it `OrderDetailClient.tsx:397-399`) — good for audit, means customer-profile edits don't retroactively change orders. | ARCHITECTURE ✅ |

---

## 11. ORDER STATE MODEL

- Enum (code + DB CHECK): `pending → contacted → quoted → confirmed → fulfilled → completed`, plus `cancelled` from pending/quoted/confirmed/fulfilled. Code table `order-status.ts:8-16`; DB CHECK `0001:93-94`.
- **Application-enforced, DB value-only:**
  - `setOrderStatusAction` validates membership + transition table (`admin-actions.ts:356-385`); UI renders only valid next steps (`OrderDetailClient.tsx:118, 405-419`).
  - DB enforces **value legality only** via CHECK; **no trigger enforces transitions**. A future code path or role-lifted SQL client (RLS grants admins full DML on commerce tables, `0001:228-240`) could write `pending → completed`.
- Audit `order_status_changed` with from/to (`admin-actions.ts:395-400`).
- Enquiries intentionally have no state machine (free `new/in_review/responded/closed`, `schema.sql:48`).

**Recommendation:** acceptable to ship CMS with the app-layer machine; add a DB trigger when commerce moves toward production (must-fix-during-CMS, not before).

---

## 12. ADMIN UX

### Solids
- Every list has a friendly empty state (`ProductsClient.tsx:164-178`, `CategoriesClient.tsx:126-132`, `JournalClient.tsx:96-104`, `EnquiriesClient.tsx:122-127`, `OrdersClient.tsx:71-78`; dashboard variants).
- Product/Category/Article/Category form errors are surfaced clearly; "Saved"/"Saving…" feedback exists in Products, Categories, Content, Settings, Orders, OrderDetail.
- Sidebar is well-built, mobile drawer included (`AdminSidebar.tsx:100-129`).
- Articles UI is the *reference* for draft/publish clarity (tabs + labelled badges, `JournalClient.tsx:15-18, 51-67`) vs products' raw badges (`ProductsClient.tsx:209-217`).

### Defects (operator-impact, file:line)
- **Stale lists everywhere after mutation** — server actions `revalidatePath` (e.g. `admin-actions.ts:67-72,122-126,161-164,200-203,267-270`) but client components never refetch props (`ProductsClient.tsx`, `CategoriesClient.tsx`, `JournalClient.tsx`, `EnquiriesClient.tsx`, `OrdersClient.tsx`). Deleted rows remain visible.
- **Silent failures in Journal & Enquiries** — no try/catch, unhandled rejections (`JournalClient.tsx:35-46`, `EnquiriesClient.tsx:215-240`).
- **No loading skeletons under `/admin`** (no `loading.tsx` anywhere; pages `force-dynamic` → blank flash).
- **Destructive confirms lack consequences** — Delete product/category/enquiry hides counts + storage/orphan consequences; no undo/recycle anywhere.
- **Raw DB text** surfaces on products/categories dup-slug and FK-restrict delete of a product referenced by order_items (`admin-actions.ts:152-153`).
- **Content save is per-field** — typing in one field then saving another silently discards the first (`ContentClient.tsx:58-71`); Settings saves on blur with no failure rollback (`SettingsClient.tsx:139-153`).
- **Terminology leaks:** raw slugs (unlabelled), raw `draft/published` badges, raw `enquiry.type` on cards (`EnquiriesClient.tsx:141-143`), keys shown in Content list (`ContentClient.tsx:54-56`).
- **Order status change gives no success feedback and the badge remains stale** from the `order.status` prop (`OrderDetailClient.tsx:100`).
- Mobile: dashboard stat cards fixed 2-col down to 320px (`admin/(protected)/page.tsx:135`).

---

## 13. CMS SECURITY

- **RBAC lives in JWT `app_metadata.role`** (`auth.ts:24-46`); OWNER|SYSTEM_ADMIN → `requireAdmin`; SYSTEM_ADMIN-only for user ops (`admin-actions.ts:533,581,607`). `profiles` and `admin_roles` are informational — role read from JWT, not DB. **Operational risk:** changing a role requires updating auth users (no UI writes JWT); document and keep for CMS.
- Server actions are the only mutation paths; all guarded. Anon/authenticated commerce INSERT revoked (`0006`, `0002/0003` grants).
- Commerce tables: RLS enabled, no public policies (`0001:217-240`, `0004:91-98`).
- Prototype vestiges documented in 14A: anonymous/authenticated retain broad DML grants on `articles` (`schema.sql` grants); RLS is the only gate — acceptable only while RLS policies hold. **Deferred to production hardening.**
- `rate-limit.ts` is in-process only (`rate-limit.ts:3-9`); absent on every admin action, login, and upload. Acceptable for prototype; note to production.
- Raw error-message pass-through on several admin actions (duplicate names/slugs, FK restrict) is an information-leak smell (not a secret leak) — map messages in CMS build.

---

## 14. STORAGE SECURITY

- Bucket `site-images`: `public=true`, no file-size limit, no allowed-MIME-list (live query, 2026-09-12). Public-read by design so storefront URLs work without signed URLs (`admin-actions.ts:795-797`).
- **Implications:** any uploaded file is world-readable forever; combined with dead `deleteImageAction`, "remove" is cosmetic. Uploads are service-role signed PUTs from server actions, limited to `image/jpeg|png|webp` server-side (`admin-actions.ts:806-811`), so the write surface is admin-only — the exposure is orphan retention and lack of WAF-grade content checks, not privilege elevation.
- Doctrine for CMS: add size/mime bucket limits, introduce a real "replace/remove deletes object + reference" flow, and authors' guides for what must never be uploaded (nothing sensitive goes in a public bucket).

---

## 15. SCHEMA & MIGRATION CONVERGENCE (summarised from 14A, re-verified live)

- `supabase/schema.sql` is **10 tables, stale**: missing `customers`/`orders`/`order_items`/`order_communications`, the `create_order`/`canonical_ke_phone`/`consistent_customer_name` functions, `order_reference_seq`, and the `assign_order_reference` trigger (all exist only in `migrations/2026090{9,11}_*`). `products` has **no `updated_at` column** (only `created_at`).
- Articles policy conflict is resolved live (JWT-role, `20260912_0008`), but repo `schema.sql:313-318` still shows the admin_roles variant — regenerate `schema.sql` during CMS build.
- Missing indexes (14A, unchanged): `products.category_id`, `products.status`, `products.featured`, `categories.active`, `enquiries.status/created_at`, `audit_log.created_at`.
- FK plan: `categories→products` CASCADE (operator-losing), `products→order_items` RESTRICT (raw FK error on delete) — both need product counts + message mapping.

---

## 16. AUDIT LOGGING

### 16.1 Written actions (grep-verified)
`product_created` · `product_published`/`product_unpublished` (update + status action) · `product_deleted` · `category_created`/`category_updated`/`category_deleted` · `content_updated` · `enquiry_status_changed`/`enquiry_deleted` · `order_status_changed`/`order_notes_updated`/`order_communication_logged` · `user_invited`/`role_changed`/`role_removed` · `article_created`/`article_updated`/`article_published`/`article_deleted` · `image_uploaded`/`image_deleted` · `profile_updated`/`password_changed` · `enquiry_submitted` · `order_created`.

### 16.2 Gaps (all verified)
1. **`upsertProductMetadata` writes zero audit** (`admin-actions.ts:974-1012`) — the only CMS mutation invisible to `audit_log`.
2. **Login/logout unaudited** — `session_created`/`session_destroyed` labels exist (`activity/page.tsx:22-23`) but no action writes them (`login/page.tsx:31`, `SignOutButton.tsx:15`).
3. **Product edits mis-attributed** — `updateProductAction` logs `product_published`/`product_unpublished` based on final status alone (`admin-actions.ts:97-98, 115-120`); `product_updated` is defined in `audit-utils.ts:5,30` but **never written**.
4. **Image replace untracked** — upload (`image_uploaded`) and storage delete (`image_deleted`) are auditable, but swapping `image_url` through update actions is invisible (logged instead as publish/unpublish or `category_updated`).
5. **Password reset via email flows unaudited** (`forgot-password/page.tsx:21`, `reset-password/page.tsx:43` attribution skipped separately).

### 16.3 Naming drift (three divergent maps)
- `audit-utils.ts` is **imported nowhere** (dead code). `BUSINESS_ACTIONS` misses 9 real actions (`category_deleted`, `enquiry_status_changed`, `enquiry_deleted`, `user_invited`, `role_changed`, `role_removed`, `image_uploaded`, `image_deleted`, `password_changed`) and includes the never-written `product_updated`.
- `activity/page.tsx` label map misspells coverage (has `session_created`/`session_destroyed` — never written; misses `article_*`, `image_*`, `order_*`, `enquiry_*`, `profile_updated`, `password_changed`).
- `role_invited` defined vs `user_invited` written.
**Action:** in the CMS build, replace the three maps with a single exported `AUDIT_ACTIONS` registry and a label renderer.

---

## 17. HARDCODED & DEAD CONTENT (14A carry-forward, re-verified)

- Content editor editable keys: only `about_blurb` is live. `hero_headline`, `hero_subheadline`, `hero_image` are dead; the storefront-read keys (`homepage_hero`, `featured_*`, `story_*`, `provenance_*`, `journal_card_*`, `category_hero_*`, `about_hero`, `quality_hero`, `export_hero`, `origins_body_*`) are **not editable** (`content/page.tsx:15-40` vs `page.tsx:35-194`, `shop/[category]/page.tsx:38-47`, `about/page.tsx:37-38`, `quality/page.tsx:41-42`, `export/page.tsx:25-26`, `origins/page.tsx:18-20`).
- `SettingsClient.tsx:14-21` `company_*` **all six dead** — footer hardcodes contact data (`SiteFooter.tsx:162-191`), and the UI claims the opposite (`SettingsClient.tsx:126`).
- Homepage hero copy hardcoded in `HeroSlideshow.tsx:6-7, 69-78`; editorial body copy hardcoded in about/quality/export/origins TSX; contact details duplicated in ≥4 files (14A).
- Contact form `?type=sample|quote` mismatch with visible options (`Sample request`/`Export / wholesale`) — 14A finding, still live.

---

## 18. FINDINGS BY CLASSIFICATION

**BUG**
1. Gallery dropped on product create — `admin-actions.ts:52`.
2. `deleteImageAction` dead code; "Remove image" never deletes files — `admin-actions.ts:881-908`, `ImageUpload.tsx:142-153`.
3. Content editor edits 3 dead keys; live keys not editable — `content/page.tsx:15-40`.
4. `company_*` settings write-only — `SettingsClient.tsx:14-21`.
5. `delivery_location` read by server, emitted by no form — `order-actions.ts:48` vs `checkout/page.tsx:171-200`.
6. Admin lists never refetch → stale/deleted rows persist — all admin clients.
7. Journal & Enquiries silent failures — `JournalClient.tsx:35-46`, `EnquiriesClient.tsx:215-240`.
8. `Number()` without NaN guard — `admin-actions.ts:46-47, 91, 95`.

**SECURITY**
9. Raw Postgres error text surfaced in UI (duplicate slug, FK restrict) — `admin-actions.ts:57,113,191,152-153`.
10. No rate limiting on admin/login/upload paths — `rate-limit.ts:3-9`.
11. Order transitions app-only, DB value-only CHECK — `0001:93-94`.

**ARCHITECTURE**
12. Metadata prune leaves stale keys (category change) — `admin-actions.ts:997-1007` + `product/[slug]/page.tsx:97-99`.
13. Metadata writes unaudited — `admin-actions.ts:974-1012`.
14. Audit naming triplicated + audit-utils dead — §16.3.
15. `schema.sql` stale vs migrations; `products` lacks `updated_at`; articles policy divergence — §15.
16. Missing DB indexes — §15.
17. Category→product CASCADE + product→order_item RESTRICT ergonomics — `schema.sql:84`, `0001:92,117`.
18. `products/coffee-gallery/*` orphans already present (4/24 objects).

**UX**
19. No loading skeletons in admin; no preview below `lg`; "Drag to reorder" unimplemented — `ProductStudio.tsx:493, 287-299`.
20. Delete confirms lack consequence detail; no undo — Products/Categories/Journal/Enquiries clients.
21. Terminology leaks (slugs, raw statuses, raw enquiry type, raw keys) — §12.
22. Product status badges vs Articles' labelled reference UI — `ProductsClient.tsx:209-217` vs `JournalClient.tsx:15-18`.
23. Order status save lacks success feedback/badge refresh — `OrderDetailClient.tsx:100`.
24. Dashboard stat cards fixed 2-col at 320px — `admin/(protected)/page.tsx:135`.

**DATA**
25. `stock` persisted, never read by storefront — §3.
26. `product_placeholder-*.jpg` local paths alive on 4 drafts — §6.
27. Shared category/product image coupling for tea demos — §6.

**CONTENT**
28. All §17 hardcoded copy + dead keys.

**BUSINESS DECISION**
29. No structured quotes/shipment/tracking; enquiry→order conversion missing — §10.
30. No order→customer email path (Resend enquiry-only) — §10.
31. Badge/role model lives in JWT app_metadata, not the `admin_roles` table — §13.

**DEFERRED (deliberate prototype limits)**
32. In-process rate limiting; manual-communication logging (`OrderDetailClient.tsx:223-226`); public-bucket design (`admin-actions.ts:795-797`); anon/authenticated broad grants on `articles` behind RLS.

---

## 19. FIX PRIORITY

**MUST FIX BEFORE CMS (data-corrupting or experience-breaking for owner)**
1. Gallery-on-create drop — BUG #1.
2. Remove-image delete wiring via live `deleteImageAction` — BUG #2 (fix #2a dead import + #2b parent onRemove deletes object + #2c broke-image fallback).
3. Content editor: expose the storefront-read keys; repoint `hero_*`; delete dead keys — BUG #3.
4. Settings Business tab: wire footer to `company_*` or remove the tab — BUG #4.
5. Admin list refresh (refetch or optimistic) + Journal/Enquiries error handling — BUG #6/7.
6. Consequence-aware destructive confirms (+ product counts) and delete FK error mapping — SECURITY #9.

**SHOULD FIX DURING CMS**
7. `delivery_location` field in checkout — DATA/BUG #5 (one input + label).
8. Metadata audits + `product_updated` correct attribution + image-replace audit — §16.
9. Single audit registry; wire `session_created`/`session_destroyed` (login/logout).
10. Stale metadata pruning + validated per-category key schemas — ARCH #12/13.
11. Regenerate `schema.sql`; add missing indexes; add `updated_at` — §15.
12. Replace three-tab label drift; article-style Pettern for products.

**CAN FIX AFTER (CMS v1 holds)**
13. DB transition trigger for orders — SECURITY #11.
14. Rate limiting surface expansion — SECURITY #10.
15. Duplicate/copy product; mobile preview; drag reorder; dashboard responsive tweak.
16. Stock display/discipline decision (show or drop).

**CLIENT INPUT REQUIRED (business, not code)**
17. Order→customer emails (when quote/confirm/fulfil) — anyway requires sender account + copy approval.
18. Structured quotes, shipment/tracking scope, enquiry→order conversion UX.
19. Whether badges/roles move to DB-driven (multi-operator) in CMS or stay JWT-simple.

**DEFERRED**
20. Storage size/MIME limits; media WAF; RLS regeneration; production auth hardening (14A list).

---

## 20. RECOMMENDED ADMIN ARCHITECTURE (single coherent build)

1. **One admin stack**: current server-action+BindClient pattern stays; close the known holes without a framework rewrite.
2. **Media layer**: a single `mediaStore` module — `upload`, `replace`, `remove(path)`, `resolvePublicUrl`, `deleteOrphaned` — so ImageUpload blurs into product/category/article; add size/MIME bucket limits; broken-image fallback primitive.
3. **Lists**: a `useAdminQuery`/refetch helper; optimistic UI + error rollback; loaded state + skeleton; consequence dialogs that count children.
4. **Content module rebuild**: keys now map to visible sections; wipe dead keys; storefront switches to `getSiteContent` everywhere (footer, hero, contact); Settings tab either wired to footer or dropped.
5. **Audit**: single `AUDIT_ACTIONS` registry + label renderer; add metadata/login/logout/image/replace events; activity page consumes the registry.
6. **Products**: array-form metadata keyed by category schema (server-validated), prune on change, no orphan gallery on create.
7. **Commerce v1 scope**: keep checkout as-is (+ delivery_location); add order→customer notification hooks behind a flag; keep communications manual.

Same source-of-truth constraint as 14A: admin writes → `site_content`/`products`/`categories`/`product_metadata` → storefront reads the same tables. New category = data, not code.

---

## 21. PROPOSED SLICES

- **Slice 15 — Media & Image Lifecycle Repair** (must-fix #1/#2): gallery-on-create, live remove/replace delete, orphan cleanup, broken-image fallback, object URL revocation. Zero design risk; unblocks everything.
- **Slice 16 — Content CMS V1** (must-fix #3/#4): repoint content keys, expose real homepage/hero/quality/export/origins fields, wire footer/settings, delete dead keys. Small, high cooperation value.
- **Slice 17 — Admin UX Hardening** (must-fix #5/#6 + should #9/#12): refetch/optimistic lists, error surfacing everywhere, consequence dialogs, audit registry + login/logout + metadata audits, article-style draft/publish pets across products.
- **Slice 18 — Commerce Ops Polish** (should #7/#8 + client-input #17): delivery_location, enquiry→order conversion, notification hooks, schema regeneration + indexes.
- **Slice 19 — (later, client-gated)** quotes/shipment/tracking; DB transition trigger.

---

## 22. READINESS SCORE

Dimension 0–10 (10 = owner-operable):
- Product lifecycle fidelity: **5** (works, but create corrupts gallery; orphan media)
- Image/media management: **2** (remove is a lie; delete dead; orphans proven)
- Content CMS fidelity: **2** (3 dead fields; live fields uneditable)
- Commerce ops integrity: **6** (secure paths, honest errors; missing location/emails/order-enquiry bridge)
- Admin UX ergonomics: **4** (stale lists, silent failures, no loading, jargon)
- Audit completeness: **3** (metadata, login/logout, image-replace all invisible)
- Architecture extensibility: **7** (the model is right; holes are fixable, no rewrite needed)

**Readiness composite: ~4.1 / 10 → NOT owner-operable yet.**

The architecture is trustworthy as a demo; it is not safe to hand to a non-developer until the MUST-FIX block (§19 items 1–6) and the SHOULD-FIX audit block (7–9) land. None of that requires a redesign.

---

## 23. GATE

## **AMBER — NOT YET SAFE TO OPERATE, NO REWRITE REQUIRED**

Verified live: 8 products (2 published / 6 draft), 4 categories, 24 storage objects (4 orphans), zero commerce rows, zero audit rows, 19 site_content keys.

Compliance with slice constraints:
- ✅ Read-only audit; zero file modifications
- ✅ Independent live verification via pooler (baseline + storage + media matrix)
- ✅ All behavioral claims carry `file:line` evidence
- ✅ No migrations, no grants, no data writes, no storage mutations
- ✅ Temp scripts staged under `%TEMP%` and removed; Git status unchanged (58 entries / 21 modified / 37 untracked)

Recommended: proceed to **Slice 15 (Media & Image Lifecycle Repair)** first — it removes the two data-corrupting bugs, then **Slice 16 (Content CMS V1)** to make the editor honest, then **Slice 17 (Admin UX Hardening)** before owner handover.