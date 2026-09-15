# SLICE 17 — ADMIN UX & OPERATIONAL HARDENING V1

## 1. EXECUTIVE SUMMARY

Slice 17 hardens the existing admin/CMS for a non-developer operator (Eunice/Pascal) on the rule:

> **Every mutation must succeed honestly, fail visibly, and never fire twice.**

No new catalog content, no storefront redesign, no new business features, and no new deletion implementation were introduced. The slice closes the highest-value operational defects found in the admin inventory:

- **Double-submit control** — publish/unpublish, deletes, enquiry status, order status/notes/communication, user role changes and password changes now disable their controls while an operation is in flight, preventing duplicate writes and duplicate audit rows.
- **Failure feedback** — the operations that previously awaited a throwing action with **no try/catch** (Journal publish/delete, Enquiry status/delete, User role change/remove) now catch, say "*Nothing was changed*", and refresh.
- **No raw database errors** — 17 sites in `admin-actions.ts` that returned `error.message` verbatim (PostgREST strings) now return a stable operator-safe message; the raw message is logged server-side. Zero `error.message` remains in any rendered `.tsx`.
- **Refresh/invalidation** — product deletion and category create/toggle/update/delete now revalidate `/` (the homepage renders live category discovery and featured sets); `upsertProductMetadata` revalidates the **concrete** product URL (it previously revalidated the unresolved `/product/[slug]` pattern, so metadata edits could go stale on the product page).
- **Audit taxonomy centralized** — one canonical label map in `audit-utils.ts` now covers **every emitted action** (it was missing `category_deleted`, `enquiry_status_changed`, `enquiry_deleted`, `user_invited`, and had a never-emitted `role_invited`); the Activity log and Security page both consume it, so the operator sees "Changed enquiry status" instead of raw `enquiry_status_changed`.
- **Honest uploads** — ImageUpload previously ignored the ledger-record result; an un-recordable upload was reported as success while leaving an un-managed object. It now removes the un-managed object and reports the failure.
- **Admin loading boundary** — added `loading.tsx` to the protected admin group (there were zero before).

Live baseline verified again post-slice: counts and storage identical to Slice 16 closure, **0 dead references**, orphan set unchanged (the 4 grandfathered gallery images), audit rows intact as historical evidence.

**Gate: AMBER — pending interactive Eunice walkthrough.** All server-side changes compile (`tsc`), build (`next build`), boot and guard correctly (smoke server: storefront 200s, unauthenticated admin 307s), and live DB/storage invariants hold. The interactive admin behaviors (disabled-during-flight buttons, success/error banners, `router.refresh`) follow established app patterns and compile, but they were not browser-clicked — the interactive Eunice Test in §23 is the remaining mile to GREEN.

## 2. MISSION — WHAT SLICE 17 PROVES

The admin must be something an operator can run without a developer:

1. Open any admin section and act — publish, delete, change status, log a communication, change a role, upload an image.
2. The action either reports **success immediately** or an **understandable failure** — never a silent promise.
3. Clicking twice cannot create two orders, two audit rows, or two communications.
4. The Activity log reads like English, not `snake_case` internals.
5. Nothing the operator sees is a raw database error.

Slice 17 does not change what actions exist; it changes how they communicate and how safely they run.

## 3. PRE-IMPLEMENTATION LIVE BASELINE

Captured against the live pooler database + Storage API (`%TEMP%\opencode\pgtest\s17-verify.js` → `s17-verify.json`):

| Table / metric | Count |
| --- | ---: |
| products (2 published / 6 draft) | 8 |
| categories (4 active) | 4 |
| articles / enquiries / orders / order_communications | 0 |
| product_metadata | 0 |
| site_content | 21 |
| audit_log | 20 |
| profiles / admin_roles | 2 / 2 |
| storage objects (bucket `site-images`) | 24 |
| storage_files | 0 |
| dead references | 0 |
| orphan objects | 4 (baseline `products/coffee-gallery/*`) |
| audit rows with `image_removed` | 6 (historical Slice 16 evidence, retained) |

Identical to the Slice 16 closure state. No Slice 17 change touched the database or storage schema — only code.

## 4. ADMIN UX INVENTORY (SOURCE OF THE DEFECT LIST)

Reviewed all admin pages (`src/app/admin/**`, 22 files) and admin components (`src/components/admin/**`, 18 files). Findings classified by severity from an operator's perspective:

| # | Finding | Class | Evidence |
| --- | --- | --- | --- |
| F1 | Journal publish/unpublish/delete awaited throwing actions with **no try/catch** — a failed action is an unhandled rejection; operator gets no success or failure signal | UX / correctness | `JournalClient.tsx` (pre-slice) |
| F2 | Enquiry status/delete — same unhandled pattern | UX / correctness | `EnquiriesClient.tsx` |
| F3 | User role change/remove — same unhandled pattern | UX / correctness | `UsersClient.tsx` |
| F4 | Order communication logging had no in-flight guard → **double-submit duplicates rows + duplicate audit**; status panel stayed stale after change (recomputed from the old prop) | UX / correctness | `OrderDetailClient.tsx` (pre-slice) |
| F5 | Products/Categories status & delete had feedback but **no in-flight disable** → double-click can toggle-then-toggle back / delete twice | UX | `ProductsClient.tsx`, `CategoriesClient.tsx` |
| F6 | Password change submitted the action without `startTransition`/guard → double-submit possible; button never disabled | UX | `SettingsClient.tsx` (Security tab) |
| F7 | 17 return paths concatenated raw `error.message` into operator-visible strings (PostgREST/us-psql internals) | Security/Ux | `admin-actions.ts` (pre-slice) |
| F8 | **Real stale-path bug:** `upsertProductMetadata` revalidated the unresolved pattern `/product/[slug]` — metadata edits may never reflect on the product page | Correctness | `admin-actions.ts:1177` (pre-slice) |
| F9 | Category create/toggle/update/delete and product delete did **not** revalidate `/` even though the homepage renders `CategoryDiscovery` and featured sets from the same live data | Correctness | `(storefront)/page.tsx:41,118` |
| F10 | Activity log had its own label map that did **not** match `audit-utils` (missing 4 emitted actions) and rendered details as raw `JSON.stringify` | Audit UX | `activity/page.tsx` (pre-slice) |
| F11 | Security page rendered actions as raw `replace(/_/g," ")` (label drift) and threw an unhandled `ForbiddenError` for non-SYSTEM_ADMIN (error boundary instead of 403) | Audit UX / consistency | `security/page.tsx` (pre-slice) |
| F12 | ImageUpload ignored the `recordImageUploadAction` result → a failed ledger record was **reported as success** and left an un-managed object | Correctness | `ImageUpload.tsx` (pre-slice) |
| F13 | Zero `loading.tsx` in the admin → blank render while force-dynamic pages stream | UX | — |
| F14 | `audit-utils` label map was missing `category_deleted`, `enquiry_status_changed`, `enquiry_deleted`, `user_invited`, and contained a never-emitted `role_invited` | Audit taxonomy | `audit-utils.ts` (pre-slice) |

Not in scope (already correct): product/category forms run `requireAdmin`, validate server-side and disable while saving; CMS fields have per-field save/saved/error and unsaved indicators; deletes confirm before running.

## 5. SUCCESS / FAILURE STATES — EVERY ADMIN MUTATION

Rule applied: **an operation either visibly succeeds or visibly fails; a failed operation never reports success.**

- **Journal** (`JournalClient.tsx`): publish/unpublish/delete now run inside try/catch; success shows "*Article published/unpublished/deleted.*", failure shows "*Could not … Nothing was changed.*" and `router.refresh()` re-syncs the list on success (ArticleForm already gates its own `onSuccess` on `result.error`).
- **Enquiries** (`EnquiriesClient.tsx`): status changes and delete now have try/catch + visible banner + `router.refresh()`.
- **Users** (`UsersClient.tsx`): role change and remove now have try/catch + message + `router.refresh()`; invite path was already guarded.
- **Orders** (`OrderDetailClient.tsx`): notes save, status change, and communication log already showed results; now they also disable during flight and update local status.
- **Products / Categories**: failure wording made explicit ("*Nothing was changed*") and `router.refresh()` added after successful status/delete to guarantee the list and dashboard reflect the new state in-session.

## 6. DOUBLE-SUBMIT CONTROL

Every mutating control is disabled while its operation is in flight:

| Surface | Guard |
| --- | --- |
| Product publish/unpublish/delete | `busyId` per card; buttons disabled + "Working…" |
| Category hide/activate/delete | `busyId` per card; disabled + "Working…" |
| Journal publish/unpublish/delete | `busyId` per row; disabled + "Working…" |
| Enquiry status / delete | `busyId` per row; disabled + "Working…" |
| Order notes / status / communication | shared `pending` transition; buttons disabled + "Saving…/Logging…" |
| User role change / remove | `busyId` per row; select + Remove disabled |
| Password change | form action moved into `startTransition`; button disabled + "Updating…" (was fire-and-forget `result.then`) |
| Image upload | existing `uploading` state already blocks re-trigger |

The order-status and communication actions were the highest-risk duplicates: a double-click could insert two `order_communications` rows and two audit rows. The `pending` guard blocks the second click at the UI; the server state-machine and channel validation remain as the second and third lines of defense.

## 7. REFRESH / INVALIDATION

| Path | Fix |
| --- | --- |
| `deleteProductAction` | + `revalidatePath("/")` (homepage featured sets) |
| `createCategoryAction` | + `revalidatePath("/")` (homepage `CategoryDiscovery`, `page.tsx:41`) |
| `toggleCategoryActiveAction` | + `revalidatePath("/")` |
| `updateCategoryAction` | + `revalidatePath("/")` |
| `deleteCategoryAction` | + `revalidatePath("/")` |
| `upsertProductMetadata` | **bug fixed:** now reads the product's slug and revalidates `/product/<slug>` (concrete), replacing the unresolved `/product/[slug]` that never flushed the product page |
| All list clients | `router.refresh()` after successful mutations (defense-in-depth: revalidation + client refresh) |

Existing revalidation already covered `/`, `/about`, `/origins`, `/quality`, `/export`, `/shop/[category]` for content writes (`setSiteContentAction`) and the product/category admin paths.

## 8. IMAGE REPLACEMENT UX — SAFE CANCEL & LIFECYCLE

No new image system was built; the Slice 15 lifecycle is reused unchanged:

- Stage → save → **DB reference moves first, storage retire after** (`deleteRemovedManagedImages`, `admin-actions.ts:996`) → audit `image_deleted`.
- **Cancel is already safe**: the staged value only persists on Save; Cancel/Remove resets the local preview (`ImageUpload.tsx` reset), and a cancelled form never commits a reference, so no lifecycle fires.
- **Honesty fix (F12):** `ImageUpload.tsx` now checks the `recordImageUploadAction` result. If the ledger insert fails after the bytes landed, it **best-effort deletes the un-managed object** (`deleteImageAction`) and reports "The image was uploaded but could not be recorded. Please try again." — no more silent success with an untrackable object.

## 9. PRODUCT ADMIN

Unchanged surface; hardened behavior. `ProductStudio` still owns create/edit (validates name + category client-side, returns `{error}` states, saves metadata via `upsertProductMetadata`). The list wrapper now disables per-card actions during flight and refreshes. No product-facing UI change.

## 10. CMS ADMIN

Unchanged surface; still per-field stage→save with unsaved indicators (`CmsClient.tsx`). Because Slice 16 already hardened the write path (allowlist, category-hero validation, limits, managed-image enforcement), Slice 17 makes no CMS edits beyond consistency with the new error phrasing (its error strings now render the safe message from `setSiteContentAction`).

## 11. DIRTY / UNSAVED STATE

**Intentionally deferred.** Slice 16 already delivers per-field unsaved indicators in the CMS (`CmsClient.tsx` "Unsaved" chips). A full unsaved-leave guard for `ProductStudio` was weighed and deferred: (a) App Router does not expose a supported route-change-interception API, so only a `beforeunload` guard would work and it would not cover internal sidebar navigation; (b) the trade-off of browser prompts on every close/refresh without covering the main navigation path is not operator value. Documented as an accepted limitation; the Cancel buttons in Product/Category/Article forms remain the intentional exit.

## 12. VALIDATION

No new validation was required — every mutation already validates server-side (categories/products/articles require `requireAdmin()` + field checks; order status runs the state machine and channel CHECK; CMS runs the allowlist; image upload validates MIME/size/bucket server-side). Slice 17 adds client-side **in-flight guarding**, which is orthogonal. The one new server-side read (`upsertProductMetadata` slug lookup) is a SELECT on `products` performed only to choose the correct revalidate target.

## 13. ROLE / ACCESS HARDENING

- **Security page (F11):** `requireRole(["SYSTEM_ADMIN"])` now wrapped so a non-SYSTEM_ADMIN sees a designed **403 panel** (consistent with `/admin/users` and `/admin/activity`) instead of the error boundary; unknown errors redirect to `/admin`.
- Membership/role changes still run through `requireRole(["SYSTEM_ADMIN"])` + service-role client; JWT `app_metadata.role` claims remain the source of truth (no `admin_roles` DB queries gate access). No policy/schema changes.

## 14. AUDIT UX

- **Activity log** (`activity/page.tsx`): now uses the canonical `formatAuditAction` from `audit-utils` (the local duplicate map was deleted — the source that was missing 4 labels and would have been forgotten again). Details render as a humanized `label: value` line instead of `JSON.stringify` — evidence preserved, readability gained.
- **Security page** Recent Activity uses the same canonical formatter (was raw `replace(/_/g," ")`).
- Dashboard already used `formatAuditAction` + `isBusinessAction`; unchanged.

## 15. AUDIT TAXONOMY — CANONICAL LABELS

`src/lib/audit-utils.ts` is now the single source for every emitted action. The emitted set (grep-verified across `src/**/*.ts`) — `product_created/published/unpublished/updated/deleted`, `category_created/updated/deleted`, `article_created/published/unpublished/updated/deleted`, `enquiry_submitted/status_changed/deleted`, `content_updated`, `order_created/status_changed/notes_updated/communication_logged`, `image_uploaded`, `image_deleted`, `user_invited`, `role_changed`, `role_removed`, `profile_updated`, `password_changed` — is fully covered by labels.

Changes: added `category_deleted`, `enquiry_status_changed`, `enquiry_deleted`, `user_invited`; corrected the never-emitted `role_invited` to the actually-emitted `user_invited`. `image_deleted` remains the sole managed-image retirement label (Slice 16 closure, single emission point `admin-actions.ts:986`); **no `image_removed` anywhere in shipped source** (re-grep this slice: zero matches). The 6 historical `image_removed` rows in the live audit log are the documented pre-closure evidence and are retained.

## 16. ERROR HANDLING — NO RAW DATABASE ERRORS

- Helper `safeDbError(context, error)` (`admin-actions.ts:31-40`): logs the raw message to the server console, returns the stable operator-safe string *"The change could not be completed. Nothing was saved — please try again."*
- Applied at **17 sites**: product create/update, category create/update, site content, order status/notes, order communication, invite, article create/update, metadata, profile, password, image upload prepare/record/delete, image deletion from storage.
- The article-slug conflict keeps its specific friendly message (real operator value, not a raw leak).
- **Source sweep:** zero `error.message` in any `.tsx` (nothing rendered). The remaining `.ts` uses are server-side diagnostics or the slug check. Storefront paths were reviewed too — `enquiry-notify`'s `error.message` stays server-side (`console.warn` only; confirmed the visitor never receives it).

## 17. ADMIN NAVIGATION

No structural changes. `AdminSidebar` (renamed Homepage → **Content** and Settings → **Account** in Slice 16) is unchanged. The loading boundary (§F13 fix) renders a calm skeleton under the sidebar while force-dynamic admin pages stream, preserving hierarchy and preventing blank flashes.

## 18. DASHBOARD SIGNALS

Verified the dashboard is fully live: counts are exact-count server queries (`(protected)/page.tsx:23-77`), recent lists and the business-activity feed flow from the live DB, and revalidated by every admin mutation (§7). No change required; the new `router.refresh()` calls on list pages also keep the dashboard fresh on return.

## 19. CONCURRENCY

- UI level: per-row `busyId` / shared `pending` guards prevent the same record being acted on twice in one session.
- Server level: unchanged and correct — order status runs a read-then-check state machine; communication/notes create rows idempotently on the server but now cannot be double-fired by the UI; role mutations touch `admin_roles` + `app_metadata` and each writes audit once.
- Documented residual risk: two **different** admin sessions acting on the same order concurrently is not serialized at the DB (prototype). Out of scope for this slice; noted for production.

## 20. PUBLIC STOREFRONT VERIFICATION

Production build `npm run build` PASSED (Next.js 16.3.3, webpack; TypeScript OK; 31 routes generated). Smoke server (`npm run start -p 3100`) returned:

- `/`, `/shop`, `/about`, `/contact`, `/product/mzuri-single-origin` → **200** (storefront + a real product page render from live data).
- `/admin/login` → **200**; `/admin/products`, `/admin/categories`, `/admin/security`, `/admin/users` → **307** (unauthenticated visitors are redirected to login by the protected layout + `requireRole`).

No storefront code was changed this slice, so no storefront regression is expected; the render checks above confirm boot health.

## 21. LIVE DB & STORAGE VERIFICATION (NON-DESTRUCTIVE)

Ran `%TEMP%\opencode\pgtest\s17-verify.js` against the pooler immediately before closure:

- Counts identical to baseline (§3): products 8, categories 4, site_content 21, articles/enquiries/orders 0, audit_log 20, profiles/admin_roles 2/2, storage objects 24, storage_files 0.
- **Dead references = 0** across products (image_url+gallery), categories, articles, and site_content image values.
- **Orphan objects = 4**, exactly the pre-existing `products/coffee-gallery/{lifestyle,macro,pdp-alt,process}.png` baseline — nothing new orphaned by this slice.
- Audit integrity: 20 rows, distinct actions `content_updated` (11), `image_uploaded` (3), `image_removed` (6, historical). Emission taxonomy re-verified in code (§15).

Slice 17 performed **no writes and no destructive lifecycle tests** — the isolation rule from Slice 16 §15 is honored.

## 22. MIGRATION DISCIPLINE

**No migration was required or created.** Slice 17 is code-only (client components + server actions + label map + loading boundary). `supabase/schema.sql` and all existing migrations are untouched; migration history (`20260909_0001` … `20260912_0008`) is unchanged. If future hardening adds schema-level constraints (e.g., advisory locks for cross-session order concurrency, §19), it will follow the established single-narrow-migration discipline.

## 23. EUNICE TEST — ACCEPTANCE WALKTHROUGH (INTERACTIVE)

The interactive half of this slice cannot be driven from a shell (it requires a real authenticated browser session). The following walkthrough is the remaining verification; every step has a static/build-verified implementation above.

- **Scenario A — Text edit (CMS).** Content → edit a hero headline → Save → banner "Saved." and the value persists after reload (`setSiteContentAction` → revalidate `/`; CmsClient already verified in Slice 16).
- **Scenario B — Image replace (product/category/CMS).** Replace an image → Save → new preview, old object retired via lifecycle, **zero dead refs** shown by the §21 sweep after the session.
- **Scenario C — Cancel safety.** Stage a new image / edit a value, then Cancel → the previously saved image/value is intact; no new storage objects exist (`s17-verify.js` re-run shows the same object count).
- **Scenario D — Failure.** Unpublish while a second session holds the row / trigger a bad order transition → the indicator (banner or inline error) shows a failure and no row changes; the previous content is intact; the operation is retryable; nothing reports success.
- **Scenario E — Duplicate-submit control.** Rapidly double-click Publish, Log communication, Change role, Update password → exactly one mutation row + one audit row (verify `audit_log` for a single new event per action).
- **Scenario F — Authorization.** An OWNER opens `/admin/security`, `/admin/activity`, `/admin/users` → sees the designed 403; a non-admin direct `POST /` to an action is refused server-side (pre-existing `requireAdmin`/`requireRole`).

## 24. VERIFICATION LIMITATIONS & HONESTY NOTES

- **Interactive UX is unverified in a browser.** Pending-state disabling, banners, and `router.refresh()` compile, typecheck, and follow in-app patterns but were not clicked end-to-end — that is the AMBER cause and the §23 walkthrough is the exact GREEN trigger.
- **Server Actions** cannot be invoked outside the running app; the smoke server confirms boot/guards, and code-level verification (source sweeps, `tsc`, `build`) confirms the rest.
- `npm run lint` remains unusable repo-wide (pre-existing `es-abstract/2024/AddEntriesFromIterable`) — superseded by `tsc` + `build`, both green.
- RLS/auth remains prototype-grade by design (§19/44 of the AGENTS baseline); Slice 17 adds no production-credential surface.
- The 6 `image_removed` audit rows are retained historical evidence and predate the Slice 16 taxonomy fix.
- Known observation (out of scope): cross-session concurrent edits on the same order are not DB-serialized; and `enquiry-notify` carries `error.message` internally (server-logged only, never rendered).

## 25. GATE + EXECUTIVE REPORT

**Findings classification**

| Class | Finding |
| --- | --- |
| CORRECTNESS | Metadata revalidation targeted the unresolved `/product/[slug]` → now the concrete URL (§7 F8). Category/product mutations missed `/` → now revalidate the homepage (§7 F9). ImageUpload could report success with an un-recorded object → now fails honestly and cleans up (§8 F12). |
| UX | Unhandled throwing actions in Journal/Enquiries/Users silently failed → try/catch + visible feedback (§5 F1–F3). Order status panel stayed stale → local status state (§6 F4). No admin loading boundary → added (§4 F13). |
| SECURITY | 17 raw DB-error render paths → operator-safe messages, raw detail logged server-side (§16 F7). |
| AUDIT | Label taxonomy centralized; 4 emitted actions were unlabeled; activity/security now share the canonical formatter and readable details (§14–15 F10/F11/F14). |
| DEFERRED | Dirty/unsaved leave guard (§11); cross-session order serialization (§19); production RLS/auth (unchanged baseline). |

**Requirements status**

- Every admin mutation: clear success or failure — **implemented, static+build verified** (§5).
- Duplicate submissions controlled — **implemented** across all 7 surfaces (§6).
- Relevant stale UI paths fixed — **implemented** (§7).
- Cancel safe + lifecycle honored — **implemented/unchanged**, invariant re-verified live (§8, §21).
- No raw DB errors in operator strings — **verified** (`.tsx` sweep = 0) (§16).
- Audit taxonomy canonical (no `image_removed` in source) — **re-verified** (§15).
- No duplicate image-deletion implementation; no destructive live lifecycle test — **honored** (§8, §21).
- Live DB/storage invariants (0 dead refs, 4 baseline orphans, counts unchanged) — **verified live** (§21).
- tsc + build — **green**; storefront + admin guards — **smoke verified** (§20).
- Eunice Test A–F (interactive) — **pending human walkthrough** (§23).

**Gate: AMBER — interactive Eunice walkthrough pending (GREEN trigger: §23 Scenarios A–F pass)**

# AMBER — SLICE 17 IMPLEMENTED; INTERACTIVE VERIFICATION PENDING

The operational hardening is implemented, compiles, builds, boots, and leaves the live database/storage byte-identical with zero dead references. The honest remainder is a human click-through of the §23 walkthrough. Once Eunice runs Scenarios A–F and they pass, the gate moves to GREEN. Do not commence Slice 18 without the next brief.