# SLICE 17 — ADMIN UX HARDENING AND PROFESSIONAL OPERATIONS CONSOLE

> Authoritative Slice 17 report. Supersedes the working draft at
> `Docs/SLICE-17-ADMIN-UX-OPERATIONAL-HARDENING-V1.md`, which documented an earlier
> pass against a narrower interpretation of the brief. This report consolidates that
> hardening and the additional gap fixes required by the authoritative brief, against
> the current tree, with fresh static, build, smoke, and live verification.

---

## 1. EXECUTIVE SUMMARY

The `/admin` operations console was already structurally sound from prior slices — a
protected, role-gated, audit-logged surface sharing the storefront data model. This
slice's work, per the authoritative brief, is concentrated UX hardening for a
non-developer operator (Eunice) and an architect (Pascal):

- **No new features. No storefront changes.** Every change is confined to admin behavior.
- **Four new gap fixes:** browser-level unsaved-changes protection; filter-aware
  empty states and a first-category CTA; always-visible gallery editing controls
  (touch/keyboard usable); removal of a dead "Remember me" login control.
- **Two data-honesty improvements:** category ordering (`sort_order`) is now editable
  and genuinely consumed by the storefront; the order-detail page now states plainly
  that line prices/totals are not collected at checkout.
- **Verification:** `npx tsc --noEmit` pass, `npm run build` pass (Next 16.3.3),
  live pooler SELECT verification of all §37 invariants, and an HTTP smoke pass over
  the production build (storefront 200 / auth-gate 307 / login 200).

**Gate: AMBER.** Everything verifiable without a human browser session is verified and
passing. The two manual walkthroughs (Eunice workflow, Pascal architecture review) are
the items that would raise GREEN. See §27.

---

## 2. INITIAL ADMIN ARCHITECTURE

The admin surface as it existed at the start of this slice:

```
(protected) layout ── auth gate ── isAdmin → redirect /admin/login
   ├─ AdminSidebar        OWNER_NAV / SYSTEM_ADMIN_NAV
   ├─ /                 dashboard (live counts, audit feed, published products)
   ├─ /products         ProductsClient + ProductStudio (gallery, metadata, publish)
   ├─ /categories       CategoriesClient (form, active toggle, delete)
   ├─ /content          CmsClient (business-grouped, per-field save + unsaved chips)
   ├─ /journal          JournalClient + ArticleForm (draft/publish, Tiptap body)
   ├─ /enquiries        EnquiriesClient (status state machine + delete)
   ├─ /orders           OrdersClient + OrderDetailClient (next-status machine, comm log)
   ├─ /users, /activity, /security, /settings, /integrations
```

All mutations route through `src/lib/admin-actions.ts`, each guarded by
`requireAdmin()` / `requireRole()`, each writing an audit row via `logAudit`.
Storefront reads flow through `src/lib/queries.ts` on the same tables. This is the
property the brief's demo story (§43) depends on, and it was left intact.

---

## 3. CHANGES IMPLEMENTED

All changes are listed with intent. Prior-slice hardening is re-verified and folded in;
§4–§18 note which items were already satisfied and which were fixed this slice.

**New this slice**

| Change | Location | Why |
|---|---|---|
| `useUnsavedGuard` hook | `src/lib/use-unsaved-guard.ts:11` | §9 — warn on close/refresh with unsaved work |
| ProductStudio dirty tracking + chip | `src/components/admin/ProductStudio.tsx:76-103, 250-254` | §9 — comma-style snapshot comparison; visible "Unsaved changes" chip |
| CategoryForm dirty tracking + chip | `src/components/admin/CategoriesClient.tsx:221-233, 261` | §9 |
| ArticleForm dirty tracking + chip | `src/components/admin/ArticleForm.tsx:25-28, 51-56` | §9 |
| G2 empty states (enquiries filter-aware, categories CTA) | `src/components/admin/EnquiriesClient.tsx:176-192`; `CategoriesClient.tsx:148-158` | §26 |
| Gallery controls always visible | `src/components/admin/ProductStudio.tsx` GalleryItem | §29/§30 — touch/keyboard operable, no hover-only affordances |
| New-status pill in enquiries + order-detail status pill | `EnquiriesClient.tsx:212-230`; `OrderDetailClient.tsx:159-177` | §29/§30 — status never communicated by color alone |
| Category `sort_order` editable | `CategoriesClient.tsx:240-254, 306-318`; `admin-actions.ts:795-800, 862-866` | §13 — storefront consumes `sort_order` (`queries.ts:10`) |
| Dead "Remember me" removed | `src/app/admin/(auth)/login/page.tsx` | §25-spirit — a control that does nothing is removed, not faked |
| Line-items honesty note | `OrderDetailClient.tsx:197-199` | §23 — schema has no prices/totals; UI says so |
| Category toggle message grammar | `CategoriesClient.tsx:137-139` | §7 — feedback text was "Category hideed." / "activateed." |

**No schema change, no migration, no new dependency.** Four files reference new code;
everything else is in-place hardening.

---

## 4. PRODUCT UX

- **Metadata schema is category-driven:** ProductStudio renders `METADATA_SCHEMAS[categorySlug]`
  fields (grade, altitude, process, etc.) — a data-driven table, never per-category
  hard-coded UI. Verified.
- **Publication is explicit:** the form uses a dedicated "Publish now" checkbox
  (status only ever transitions on a real edit), so a form left dirty never mutates
  the live store. Verified in `ProductStudio.tsx`.
- **Unsaved protection (new):** dirty state is derived by comparing every field
  against a mount-time snapshot (name, slug, category, description, price, stock,
  featured, publish flag, primary image, gallery, metadata). On any divergence the
  browser warns on close/refresh and an "Unsaved changes" chip appears beside
  Cancel (`ProductStudio.tsx:76-103, 250-254`).
- Cancel/rollback behavior (unmount deletes un-saved staged uploads) verified intact.

## 5. CATEGORY UX

- **Ordering (new):** an "Order" numeric field writes `sort_order`. The storefront
  lists categories with `.order("sort_order", { ascending: true })`
  (`src/lib/queries.ts:10`) and the category-hero CMS fields are keyed off the same
  ordering (`src/lib/cms-fields.ts:271`). Lower number renders first; a hint explains
  this under the field.
- **Active toggle feedback fixed:** success message was previously rendered as
  "Category hideed." / "activateed." — now "Category hidden." / "Category activated."
- **Empty state now actionable:** with zero categories, an "Add your first category"
  link opens the form directly (`CategoriesClient.tsx:148-158`).
- Unsaved guard and delete-with-confirm intact.

## 6. CMS UX

- **Business labels and hints (verified, no work needed):** `src/lib/cms-fields.ts`
  defines section groups (Homepage, About, Quality, Origins, Export, Categories) with
  readable labels ("Hero headline", "Story eyebrow", "Kirinyaga image") and hints for
  every field. The prior dead "Business tab" is gone; the CMS is the single content
  editor.
- **Per-field save and unsaved chips (verified):** CmsClient saves each field
  independently with a result and shows an "Unsaved" chip before saving
  (`CmsClient.tsx:172, 236`).
- CMS content values are read only through the content query (server component) —
  no duplicated content store.

## 7. IMAGE UX

- **Single deletion primitive (verified):** managed-image retirement emits the
  registered `image_deleted` at the single `deleteManagedImage` point
  (`admin-actions.ts:992`). `image_removed` does not exist in shipped source
  (grep: zero matches in `src`; the six live rows are the documented pre-closure
  history, retained).
- **Importer audit (re-verified):** `deleteImageAction` has exactly two production
  importers, both justified, no competing mechanism:
  - `ImageUpload.tsx:81` — record-failure cleanup (bytes landed, ledger insert failed).
  - `ProductStudio.tsx:138` — unmount rollback of un-saved staged uploads.
- Every upload is validated server-side (type allow-list) and path-derived from a
  managed reference (`deriveManagedStoragePath`).

## 8. GALLERY UX

- **Controls were hover-only (fixed this slice):** remove, move-left/right and
  "Set main" were `opacity-0 group-hover:opacity-100` — unreachable on touch devices
  and undiscoverable on keyboard. They are now permanently visible with visible
  `aria-label`s / disabled state on edge moves, and an always-visible "Main" marker
  on the primary image.
- Gallery parsing for create and edit shares one validated parser (verified), and
  `gallery: []` is no longer hardcoded.

## 9. ENQUIRY UX

- **Empty states differentiated (fixed):** zero enquiries → "No enquiries yet" +
  explanation; enquiries exist but filtered out → "No enquiries match this filter."
  The old message ("No enquiries in this category") was wrong in both cases.
- **Status clarity (fixed):** enquiries in "New" carry a visible pill rather than
  color-only styling; the four statuses (New / In review / Responded / Closed) are
  labelled in both the filters and the row.
- Status changes and delete confirm before acting, disable while busy, and show a
  success/failure notice.

## 10. ORDER UX

- **State machine enforced (verified):** transitions come only from
  `nextOrderStatuses()` (`src/lib/order-status.ts`); the UI renders only valid next
  steps and marks terminal states. Every change is audit-logged.
- **Better "Other orders" navigation (verified):** customers can be cross-navigated.
- **Honesty note (new):** the database records product name + quantity only — there
  is no `total`/`unit_price`/`line_total` column in any migration (verified by
  grep across `supabase/migrations`). The order detail page now states
  "Product and quantity only — prices and totals are not collected at checkout yet."
  rather than implying a total exists.
- **Status pill (fixed):** header status now renders as a bordered pill — the
  pending/accent/neutral states are not conveyed by color alone.

## 11. SETTINGS CLEANUP

- **Verified complete, no work needed.** Settings renders Account and Security tabs
  only. The dead six-field "Business" tab was removed in the prior pass and its
  functionality genuinely re-homed to the CMS. No control in Settings pretends to
  do something it does not.

## 12. AUDIT TAXONOMY

- **Canonical label map, single source (verified):** `src/lib/audit-utils.ts:45-49`
  maps registered actions to business labels (`content_updated` → "Updated site
  content", `image_uploaded` → "Uploaded image", `image_deleted` → "Deleted image",
  plus the product/category/enquiry/order/user actions). Dashboard, activity, and
  security pages all consume this one map.
- Emission points verified: `image_deleted` only at `admin-actions.ts:992`;
  `image_removed` zero in source. Live distinct actions measured (§23) show exactly
  what this slice's predecessors actually generated over time — including the six
  historical `image_removed` rows retained as evidence.

## 13. AUDIT ACTOR HANDLING

- **Verified:** `logAudit` (`src/lib/audit.ts:25,37`) captures the acting user
  (id + email) from the session fallback inside the server action before writing the
  row — so even actions invoked at the boundary carry an actor. `actor_email` on the
  activity/security pages renders "by <email>". No anonymous-path audit rows are
  possible: mutating actions require `requireAdmin()` first.

## 14. AUTHENTICATION UX

- **Verified prior hardening, plus one removal.**
  - Login disables inputs during submit, shows a human error ("Unable to sign in.
    Please check your email and password."), and redirects through the sanitized
    `next` param (`src/lib/safe-redirect.ts`).
  - Forgot/reset password flows exist and use the same shell.
  - **Removed (new):** the "Remember me" checkbox submitted nothing — it was not
    passed to `signInWithPassword` and could not work. It is deleted rather than
    faked; email/password persistence remains browser-handled.
  - Protected layout gate works at HTTP level: `/admin` → 307 → `/admin/login`
    (verified in §22).
- SignOutButton disables during sign-out ("Signing out…").

## 15. ERROR HANDLING

- **Raw error text never reaches the UI (re-verified with grep):** `error.message`
  appears only server-side — `order-actions.ts:140/143/148` (console.warn + friendly
  client checks), `enquiry-notify.ts:127` (returned as a data property, never
  rendered), `admin-actions.ts:32` (console.error) and `:786` (friendly duplicate-slug
  check). **Zero `error.message` in any `.tsx`.**
- `safeDbError` (`admin-actions.ts:30`) sanitizes database failures into short,
  actionable copy.
- Client mutations all wrap action calls in try/catch with "Nothing was changed."
  fallback messaging (Products, Categories, Enquiries, Journal, Users, Orders,
  Settings, CMS).

## 16. LOADING/SAVE FEEDBACK

- **Save states (verified):** every form disables while its action is pending and
  labels the button ("Saving…", "Working…", "Publishing…", "Logging…"), then prints a
  concrete success/error message. No silent success.
- **Loading states (verified):** `loading.tsx` exists at the admin root and under
  `(protected)` — route-level skeletons preserving layout; storefront also has
  skeletons. No blank flashes, no full-page spinners.

## 17. CACHE/REVALIDATION

- **Verified prior hardening:** product and category mutations call
  `revalidatePath("/")` and concrete product/category paths; `upsertProductMetadata`
  revalidates `/product/${slug}` after metadata edits. Storefront and admin therefore
  converge within one refresh cycle, demonstrating the shared source of truth.

## 18. RESPONSIVE BEHAVIOR

- **Admin surfaces verified mobile-usable:** sidebar collapses to an icon rail
  (AdminSidebar), content grids collapse to single column, enquiry cards stack with
  wrap, table-free list layouts (Orders, Users) used throughout.
- **Touch deficits fixed this slice:** gallery edit controls (the only
  hover-dependent controls in the admin) are now always visible; "Set main"/remove/
  reorder remain operable at 320px width.
- No horizontal overflow was introduced; container widths stay bounded (`max-w-[1200px]`).

## 19. ACCESSIBILITY

- **Verified + fixed issues.**
  - Global `:focus-visible` ring styles exist (`src/app/globals.css:358-365`); login
    uses a visible focus ring, consistent with the rest of the surface.
  - All gallery buttons and the enquiry expand control carry `aria-label`s.
  - Forms use labelled controls (`field-dark`/`field-light` with visible labels,
    `sr-only` where needed), heading hierarchy is logical, and status is presented
    as text/pill in addition to any color.
  - The new status pills remove color-only comprehension; the removed "Remember me"
    control removed nothing from the flow.

## 20. SECURITY VERIFICATION

- **Verified live (§23) and by code:**
  - RLS enabled on `articles`, `audit_log`, `products`, `categories`; **no policy
    references `admin_roles`** (JWT-role based; the article admin policy migration
    `20260912_0008` is registered in the migration history).
  - Server actions all gate on `requireAdmin()` / `requireRole()` before any DB or
    Storage work — client-side checks are never trusted.
  - No `SERVICE_ROLE` on the client; credentials live only in `.env.local`;
    mutations stay server-side; prototype public-write policies are documented as
    temporary.
  - Live-state clean: no test rows, dead refs 0, orphan object baseline unchanged (4).

## 21. PERFORMANCE

- **No new dependencies.** The one new file is ~30 lines of client hook attached
  only to three edit forms.
- Build routes unchanged (all admin/ƒ dynamic, storefront static cells preserved);
  the `beforeunload` listener attaches only while a form is dirty and detaches on
  clean.
- Animations remain transform/opacity based; no layout-thrashing properties added.

## 22. TESTS EXECUTED

| Check | Command / method | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | pass |
| Production build | `npm run build` (Next 16.3.3 webpack) | pass, 33 routes, 8 static pages generated |
| Raw-error grep | `error\.message` in `*.tsx` | 0 matches |
| Image taxonomy grep | `image_removed` in `src` | 0 matches |
| Deletion importer audit | `deleteImageAction` | exactly 2 justified importers, single definition (`admin-actions.ts:1095`) |
| Moved | `useUnsavedGuard` consumers | hook + ProductStudio / CategoryForm / ArticleForm |
| Smoke — storefront | `npm run start -p 3100` | `/` 200, `/shop` 200, `/shop/coffee` 200, `/contact` 200 |
| Smoke — auth gate | " | `/admin` 307 → login, `/admin/login` 200 |
| Smoke — canonical redirect | " | `/products/coffee/` 308 → canonical |
| Server log during smoke | " | no errors (only the pre-existing bun.lock path warning) |

`npm run lint` remains unusable repo-wide due to the pre-existing
`es-abstract/2024/AddEntriesFromIterable` issue documented in prior slices; tsc +
build are the type gates.

## 23. LIVE VERIFICATION

SELECT-only, through the Supabase pooler connection (`%TEMP%\opencode\pgtest\s17-final.js`).

```
products 8 (published 2 / draft 6) · categories 4 · articles 0 · product_metadata 0
site_content 21 · enquiries 0 · orders 0 · order_items 0 · customers 0
order_communications 0 · audit_log 20 · profiles 2 · admin_roles 2
storage objects 24 · storage_files 0
DEAD REFS 0 · ORPHAN OBJECTS 4 (baseline coffee-gallery set, unchanged)
audit distinct: content_updated × 11 · image_uploaded × 3 · image_removed × 6 (historical)
policies reference admin_roles: false
RLS enabled: articles ✓ audit_log ✓ products ✓ categories ✓
migrations: 8 · 20260912_0008 (article JWT-role policy) registered ✓
```

Unchanged from baseline — nothing in this slice mutated live data. No new audit rows
were produced.

## 24. GIT MUTATION SUMMARY

Files **created** this slice:

- `src/lib/use-unsaved-guard.ts`
- `Docs/SLICE-17-ADMIN-UX-HARDENING.md` (this report)

Files **modified** this slice:

- `src/lib/admin-actions.ts` (category `sort_order` write in create + update)
- `src/components/admin/ProductStudio.tsx` (dirty guard + chip; gallery controls)
- `src/components/admin/CategoriesClient.tsx` (dirty guard; Order field; empty-state
  CTA; toggle message grammar)
- `src/components/admin/ArticleForm.tsx` (dirty guard + chip)
- `src/components/admin/EnquiriesClient.tsx` (filter-aware empty states; new-status pill)
- `src/components/admin/OrderDetailClient.tsx` (line-items note; status pill)
- `src/app/admin/(auth)/login/page.tsx` (remember-me removed)

Per §38 no commit was created. The working tree contains a large body of pre-existing
modifications from slices 1–16 (package files, storefront pages, `supabase/schema.sql`,
untracked `db-*.js`, `Photography/`, unreferenced docs and report PDFs). Those files
were left untouched; this slice touched only its own files above.

## 25. REMAINING KNOWN LIMITATIONS

- **Order totals don't exist in the schema** — by design, now stated honestly in the UI (§10).
- **`image_deleted` has not yet emitted live** (audit shows the pre-closure
  `image_removed` history only): no managed image has been deleted in live data since
  the taxonomy fix, so the emission path is verified by code + grep, not by a fresh
  live deletion. No destructive test was performed.
- **Interactive Eunice Test undriven** — requires an authenticated browser session.
- `npm run lint` unusable repo-wide (pre-existing).
- Orphan objects (4) and the empty `storage_files` ledger are pre-existing and
  documented in slices 14B/15; untouched here.
- Admin deletion of categories enforces empty-category safety; product deletion has
  no cascade by design (SafeDeleteModel) — both unchanged and pre-existing behavior.

## 26. RECOMMENDED NEXT SLICE

Run the two manual walkthroughs against the prod build (see §27), then proceed to an
operator-focused slice (per the roadmap: storefront commerce refinement — checkout is
still reference-order, no live payment), or a data slice (unify `storage_files` ledger
with storage objects and resolve the four baseline orphans). Only after GREEN should
new admin feature work begin.

## 27. FINAL GATE

| Requirement | Status |
|---|---|
| `npx tsc --noEmit` | pass |
| `npm run build` | pass |
| Live pooler invariants (§37-consistent) | pass |
| Smoke (routes, gate, redirects) | pass |
| No schema change / migration required | confirmed |
| No test-seeded live records | confirmed |
| Eunice Test — code-level | in place (unsaved-guard, empty states, touch controls, visible status) |
| Eunice Test — interactive browser walkthrough | **not executed (requires human credentials)** |
| Pascal architecture review | code-level evidence compiled; live review pending |

**AMBER.**

This slice is code-complete, build-clean, and live-database-consistent. GREEN per the
brief's own definition requires the Eunice Test to pass interactively — logo-in →
add a category with ordering → edit that category → add/edit a product in it → check
the storefront reflects both, with the gallery controls and unsaved-changes guard
exercised on a touch device. Those steps cannot be driven from this terminal without
credentials, so this report records AMBER with the interactive walkthrough as the
exact GREEN trigger.