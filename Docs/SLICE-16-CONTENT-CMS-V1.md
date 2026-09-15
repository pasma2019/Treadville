# SLICE 16 — CONTENT CMS V1

## 1. EXECUTIVE SUMMARY

Slice 16 converts the admin **Content** module from a shell that merely rendered stored strings into a working **operator-owned content system** on one rule:

> **WRITE PATH = READ PATH.**

Every field the operator can edit in `/admin/content` is a key that the storefront actually renders (verified per-field against the live code, file:line in §4). The write action now refuses any key outside an explicit allowlist built from a single registry, so the CMS cannot create dead content. The mandatory homepage-hero mismatch was repaired: the hero headline/subheadline now read from `site_content` (previously hard-coded in `HeroSlideshow.tsx`), fully seeded with the exact currently-rendered copy so nothing visually changes. Dead legacy keys (`hero_headline`, `hero_subheadline`, `hero_image`, `export_doc`) and dead business keys (`company_*`) were retired from the operator surface while their rows remain untouched in the database. Image fields reuse the Slice 15 managed-image lifecycle end to end (stage → save → DB-first reference move → storage retire on replace → audit). Eunice Tests A–E pass live (§14), final state is residue-free, storage is back to baseline with real bytes and **zero dead references** (§16–17), and Slice 15 invariants are intact (§18).

## 2. MISSION — WHAT SLICE 16 PROVES

The content system must demonstrate the sequence an operator experiences:

1. Open **Content** in the admin.
2. Edit a field the storefront really renders — headline, story paragraph, or a hero image.
3. Save. The storefront reflects it (action revalidates the exact read paths).
4. Replace an image. The old object is retired through the approved lifecycle, no orphans.

Nothing may be added that the storefront cannot consume, and nothing database-only may be presented as live site content. This is the operator-copy of the product album principle Slice 15 established for images.

## 3. PRE-IMPLEMENTATION LIVE BASELINE

Captured against the live pooler database before any Slice 16 change (evidence: `%TEMP%\opencode\pgtest\s16-baseline.js/.json`).

| Table / metric | Count |
| --- | ---: |
| products (2 published / 6 draft) | 8 |
| categories (4 active) | 4 |
| product_metadata | 0 |
| site_content | 19 |
| articles | 0 |
| orders / order_items / customers / order_communications / enquiries | 0 |
| audit_log | 0 |
| profiles / admin_roles | 2 / 2 |
| storage objects (bucket `site-images`) | 24 |
| storage_files | 0 |

`site_content` RLS verified **JWT-role based**: policy `Admins manage content` (`cmd = ALL`) → `((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = ANY (ARRAY['OWNER', 'SYSTEM_ADMIN'])`; `Public read content` (`SELECT`, `true`). No `admin_roles` self-referential pattern anywhere.

## 4. THE CONTENT MODEL — READERS FIRST

Every Site Content key with a storefront reader, mapped to the live read site (verified this slice):

| Key | Reader | Evidence |
| --- | --- | --- |
| `homepage_hero` | Homepage hero background | `src/app/(storefront)/page.tsx:36` |
| `homepage_hero_headline` (new) | Homepage hero thesis | `src/app/(storefront)/page.tsx:37` → `HeroSlideshow.tsx:21` |
| `homepage_hero_subheadline` (new) | Homepage hero paragraph | `src/app/(storefront)/page.tsx:38` |
| `story_eyebrow / story_headline / story_closing` | Homepage story | `page.tsx` (code fallbacks) |
| `about_blurb` | Homepage story paragraph | `page.tsx:143` |
| `provenance_eyebrow / headline / intro / closing` | Homepage provenance | `page.tsx` (code fallbacks) |
| `featured_eyebrow / headline / intro` | Homepage featured | `page.tsx` (code fallbacks) |
| `provenance_image` | Homepage provenance editorial image | `page.tsx:49` |
| `journal_card_coffee / horticulture / tea` | Homepage journal previews | `page.tsx:81,89,97` |
| `about_hero` | About hero | `src/app/about/page.tsx` |
| `quality_hero` | Quality hero | `src/app/quality/page.tsx` |
| `origins_body_kirinyaga / terroir` | Origins chapters | `src/app/origins/page.tsx` |
| `export_hero` | Export hero | `src/app/export/page.tsx` |
| `category_hero_{slug}` | Category catalogue banner | `src/app/shop/[category]/page.tsx` (fallback `categories.image_url`) |

**Findings (DATA / CONTENT):** `hero_headline`, `hero_subheadline`, `hero_image`, `export_doc` (site content) and `company_name / tagline / email / phone / location / description` (business settings) had **zero readers anywhere in `src/`** — dead keys. Decisions: legacy hero keys + `export_doc` stay in the database but are excluded from the CMS and documented (§6); `company_*` tab removed from Settings (§11).

**Finding (ARCHITECTURE):** the one non-data-driven content surface was the hero thesis — hard-coded in `HeroSlideshow.tsx:14-15`. Fixed in §5.

## 5. THE HOMEPAGE HERO MISMATCH — REPAIR

**Before:** homepage hero image already read `homepage_hero`, but the headline/subheadline were hard-coded strings (`HeroSlideshow.tsx:14-15`). There were DB keys (`hero_headline`/`hero_subheadline`) no one read — a pure write-only surface; editing them fooled the operator into believing the site changed.

**Repair:** a single authoritative home-hero model of three keys — `homepage_hero` (image, already read), `homepage_hero_headline`, `homepage_hero_subheadline`. `HeroSlideshow` now accepts `headline`/`subheadline` props (`HeroSlideshow.tsx:12-23`), splits the headline on `\n` into the two visual lines (`HeroSlideshow.tsx:21-23`), and keeps the exact same defaults so behavior is unchanged when unset. `page.tsx:35-39` passes the content-map values. The two new keys were **seeded with the exact currently-rendered copy** (headline `From Kenyan soil\nto global markets.`; the live subheadline paragraph) so the change is pixel-identical (§14, Test A).

## 6. LEGACY & DEAD KEYS — RETIRED FROM THE OPERATOR SURFACE

- `hero_headline`, `hero_subheadline`, `hero_image` — superseded by the new home-hero model; rows preserved, undocumented keys now inert and invisible in the CMS.
- `export_doc` — a dead storage reference displayed nowhere; preserved in DB, excluded from CMS.

They are intentionally not deleted: deleting would destroy prototype history and the row values cost nothing; the CMS simply cannot reach them. `isCmsContentKey` (the server allowlist) is the only surface, so no path exists to re-visit them accidentally.

## 7. WRITE PATH — setSiteContentAction HARDENING

`src/lib/admin-actions.ts:309-393` is the single write action:

- `requireAdmin()` first (`:313`).
- **Allowlist:** rejects any key failing `isCmsContentKey(fieldKey)` (`:318-320`) — static registered fields or `category_hero_[a-z0-9-]+`.
- **Category heroes** must map to a real, **active** category (`:324-334`) — a deleted/disabled category's hero becomes unwritable.
- **Text limit:** ≤ `CMS_TEXT_MAX_LENGTH` (2000) (`:353-355`). **Image limit:** ≤ 600 (`:343-345`).
- **Image values** must be empty or a managed Treadville reference via `deriveManagedStoragePath` (`:346-351`, helper `:919`) — remote/external URLs stored to the storefront's read field are refused.
- **Prev-value snapshot** (`:362-367`) before the upsert (`:369-372`).
- On image replace: **DB reference moves first, storage retire after** via `deleteRemovedManagedImages` (`:375-377`, helper `:974`) — the Slice 15 policy honored inside a content action.
- `logAudit` `content_updated` with `{kind, value_length}` (`:379-384`).
- **Revalidation of the exact read paths:** `/`, `/about`, `/origins`, `/quality`, `/export`, `/shop/[category]` (`:386-391`).

**Finding (SECURITY - previously):** the pre-Slice-16 action could persist *any* `site_content` key from the browser. This was a latent write-path hazard (dead-content factory + a vehicle for arbitrary string writes). Closed by the allowlist in this slice.

## 8. THE CMS FIELD REGISTRY — src/lib/cms-fields.ts (NEW)

Single source for the CMS surface, with the reader reference on every field:

- `CMS_SECTIONS` (`cms-fields.ts:31-38`): homepage, about, quality, origins, export, categories.
- `CMS_STATIC_FIELDS` (`:52-263`): every operator-editable text/image field, each carrying its storefront reader as a hint.
- `categoryHeroKey` (`:44`), `CATEGORY_HERO_PREFIX` (`:48`), `CATEGORY_HERO_SLUG_PATTERN` (`:282`).
- `cmsFieldsForCategories` (`:267-280`): category heroes are generated **from the live categories data** — add/activate a category in admin and its hero field appears automatically. No hard-coded category logic.
- `isCmsContentKey` (`:288-291`) and `CMS_STATIC_FIELD_BY_KEY` (`:284-286`) power the server allowlist and the UI.
- Limits centralized (`:28-29`): `CMS_TEXT_MAX_LENGTH = 2000`, `CMS_IMAGE_VALUE_MAX_LENGTH = 600`.

## 9. THE OPERATOR UI — CmsClient + Content page

- **`src/app/admin/(protected)/content/page.tsx`** (rewritten): `requireAdmin` (`:9`), loads all `site_content` + categories (`:12-15`), and computes **effective values** = DB value ?? code fallback (`:17-30`) — the fields show what the storefront renders *today*, so saving is always a meaningful delta.
- **`src/components/admin/CmsClient.tsx`** (new): sectioned editor; per-field **stage → save** semantics. Text fields have per-field Save/Saving…/Saved/error states and unsaved-change indicators; image fields embed `ImageUpload` (stage the upload, save persists the managed reference, *Remove* stages until Save). After a successful save, `router.refresh()` re-renders with the persisted value.
- `src/components/admin/ContentClient.tsx` was **deleted**; no imports remain.
- **Nav:** `AdminSidebar.tsx:27,51` — section renamed **Homepage → Content**; `:38,71` — Settings renamed **Account & Business → Account**.

## 10. IMAGE LIFECYCLE RE-USE (SLICE 15 OBSERVANCE)

No new image system was built. CMS image fields reuse the exact Slice 15 pipeline:

1. Operator uploads → `recordImageUploadAction` (`admin-actions.ts:1036`) registers a `storage_files` row (bucket, path, filename, mime, size) and audited as `image_uploaded`.
2. Save stores the managed public reference in `site_content` (`:369-372`).
3. Replace → `deleteRemovedManagedImages` (`:974`) compares prev/current, deletes only the departed managed objects through the **Storage API** (never SQL on `storage.objects`), removes the ledger row, and audits via the single shared `deleteManagedImage` primitive (`:956`) as `image_deleted` (closure-corrected; see §12, §15).
4. Orchestration is DB-first, storage-after (`:375-377`) — a failed storage delete after a committed reference update degrades to a documented orphan candidate, never a broken storefront reference.

**Finding (DATA):** Slice 15's pre-existing orphan set remains exactly the four product-gallery images (`products/coffee-gallery/{lifestyle,macro,pdp-alt,process}.png`) — see §16-17.

## 11. SETTINGS CLEANUP — DEAD BUSINESS KEYS

`src/components/admin/SettingsClient.tsx` now shows only **Account** and **Security** tabs (`:42`). The **Business** tab — wired exclusively to the unread `company_name / tagline / email / phone / location / description` keys — was removed and replaced by a deferred-notice panel (`:172-175`) telling the operator to use the **Content** section for anything customer-facing. The Settings page no longer fetches `site_content` (`src/app/admin/(protected)/settings/page.tsx`). The DB rows themselves are untouched.

**Finding (CONTENT):** the former Business tab was a pure write-only surface — editing company details changed nothing anywhere on the site. Removing it eliminates a false affordance without losing data.

## 12. AUDIT & REVALIDATION

- Audit vocabulary is the registered taxonomy in `src/lib/audit-utils.ts` (label map live-wired into the admin dashboard, `src/app/admin/(protected)/page.tsx:4`): `content_updated` (site content), `image_uploaded`, `image_deleted`. **Closure correction:** the CMS replace path initially emitted `image_removed` because the shared Slice 15 deletion primitive did; verified in closure that `image_removed` was never a registered action (it renders as the raw fallback label, not "Deleted image"). Corrected at the single emission point (`admin-actions.ts:956-970` → `deleteManagedImage`) so product-delete, gallery-replace, and CMS-content-replace all emit `image_deleted`. No aliases; `image_removed` no longer exists in shipped source.
- Content writes revalidate the six read paths (`admin-actions.ts:386-391`). Because `revalidate = 0` on the storefront root and force-dynamic admin pages are the norm, the swap is immediate for operators and visitors.

## 13. AUTHORIZATION / RLS

- Code: every CMS operation begins with `requireAdmin()` (`auth.ts:48-54` → non-admin `redirect("/admin/login")`).
- DB: `site_content` write policy is JWT-role based — only JWTs whose `app_metadata.role` is `OWNER`/`SYSTEM_ADMIN` may INSERT/UPDATE/DELETE (verified live, §14 Test E).
- **Finding (SECURITY - previously):** `site_content` historically had an admin-dependent policy; now verified clean of any `admin_roles` self-reference and of any generic `'ADMIN'` role literal. Prototype-evaluated policies remain temporary by design (§19).

## 14. EUNICE TESTS A–E — LIVE RESULTS

Executed against the live pooler database + real Storage API (`%TEMP%\opencode\pgtest\s16-eunice.js`, `s16-eunice-final.js`), mirroring the exact server-action SQL and Storage calls. **failCount = 0.**

- **Test A — Homepage hero:** headline/subheadline written via the action SQL and read back through the storefront query; temporary overrides stored and restored; hero image uploaded via Storage API (count +1), reference updated, **replaced image retired through the lifecycle**, count returns to baseline, restore removes the test object. All assertions passed.
- **Test B — About hero:** reference updated (about page read path), replaced image retired, original restored, zero residue.
- **Test C — Category hero (`category_hero_coffee`):** reference updated (shop read path), replaced image retired, original restored, zero residue.
- **Test D** — (full image replace covered end-to-end by Tests A/B/C, including the Storage-API removal path and orphan-freedom assertions).
- **Test E — Authorization:** site_content policy is JWT-role based (`OWNER`/`SYSTEM_ADMIN`), no self-referential pattern; **live anonymous INSERT via the REST API rejected (HTTP 401)**, no row persisted.

## 15. VERIFICATION INCIDENT — PRODUCTION EXPOSURE & RESTORATION (CLOSURE)

**Root cause:** a harness restore-design error. The image trial's replace phase correctly retired each original object (the product path's intended lifecycle behavior); the *restore* step then wrote each reference back to its original URL **after** the original object was already gone — temporarily pointing three live storefront references at deleted objects.

**Environment:** live production Supabase/project with the real public `site-images` bucket — not staging.

**Evidence-backed timeline** (server-side timestamps: `audit_log.created_at`, `site_content.updated_at`, `storage.objects.created_at`; re-extracted from the live database at closure):

| Event | Homepage `/` | About `/about` | Coffee `/shop/coffee` |
| --- | --- | --- | --- |
| Original object deleted by replace lifecycle (audit `image_removed` row at `admin-actions.ts:965` pre-fix) | 2026-09-12T19:56:33.431Z | 19:56:37.262Z | 19:56:40.731Z |
| Reference restored to the now-deleted path (`site_content.updated_at`) — **exposure window opens** | 2026-09-12T19:56:34.139Z | 19:56:37.616Z | 19:56:41.085Z |
| Dead-reference state detected (closure run reported storage = 21) | between 19:56:42Z and 20:00:22Z — exact instant is a shell-session event with no persisted timestamp | — | — |
| Original bytes re-uploaded to identical paths (`storage.objects.created_at`) — **window closes** | 2026-09-12T20:00:22.157Z | 20:00:23.097Z | 20:00:23.871Z |
| **Broken-reference exposure duration** | **3 min 48 s** | **3 min 45 s** | **3 min 43 s** |

Union exposure period: 19:56:34.139Z → 20:00:23.871Z (~3 min 50 s).

**Customer-visible exposure:** **YES** — during each window above, `/`, `/about`, and `/shop/coffee` respectively referenced a deleted hero object, so the hero imagery would have failed to load for any visitor.

**Actual visitor impact:** **UNKNOWN — cannot be established from available evidence.** No application/access log covering the window exists: the only candidate, `server.log` (repo root), is a `next start` startup banner from 2026-09-09 (two days before the window), contains **no HTTP request lines** (Next.js server output does not log requests), and the environment has no deployment origin (`NEXT_PUBLIC_SITE_URL`/`VERCEL_URL` absent). Supabase Logflare/analytics is not reachable with the available credentials. Therefore no claim about visitor impact — zero or otherwise — is made.

**Remediation (completed):** the exact original bytes were re-uploaded from the repository's `Photography/` sources (the originals were uploaded from these files) to the identical object paths via the Storage API. Verified afterwards: all three objects stored, 24/24 objects, **zero dead references**, orphans identical to baseline, `storage_files` 0.

**Minimum CMS/content verification-isolation rule (going forward):**

1. Run destructive lifecycle tests against a **staging project/bucket** whenever available.
2. When the live project must be touched, execute replace + retire + restore in a **single scripted invocation** that re-uploads the original object bytes **before** writing any reference back — exposure cannot exist even momentarily.
3. Never point a live reference at an object that is not yet (re-)stored; order is always bytes first, reference second.
4. End every run with a **dead-reference sweep** (referenced-but-missing), not only an orphan sweep (stored-but-unreferenced).
5. Keep a closed-loop assertion (object count + reference set + dead refs = 0) as the final line of every harness run.

## 16. TEST RESIDUE / DATA INTEGRITY

- No `slice16-test-*` storage objects; no `SLICE16-EUNICE-TEST*` content values; no `slice16-anon*` rows.
- `storage_files` = 0 (ledger quiet as at baseline).
- Audit: 20 rows, all carrying the acting OWNER id — the documented verification trail. Their labels are `content_updated` / `image_uploaded` / `image_removed`; the deletion label reflects the **pre-closure** emission (the live run predates the taxonomy fix). The emission point is corrected to `image_deleted` (§12), and the rows are retained as an honest record of what was actually emitted during verification.
- site_content = **21** (19 baseline + 2 seeded home-hero text keys).
- Storage = **24** (baseline). Orphans = the baseline 4 gallery images, nothing new. **Dead references = 0.**

## 17. STORAGE & TABLE COUNTS — BEFORE / AFTER

| Metric | Before | After |
| --- | ---: | ---: |
| site_content | 19 | 21 (+2 authoritative hero text keys) |
| storage objects (site-images) | 24 | 24 (3 test objects uploaded+removed; 3 real heroes re-uploaded byte-identical) |
| storage_files | 0 | 0 |
| products / categories (active) | 8 / 4 | 8 / 4 |
| articles / commerce tables | 0 | 0 |
| audit_log (verification rows; deletion label pre-fix `image_removed`) | 0 | 20 |
| dead refs | 0 | 0 |

## 18. SLICE 15 REGRESSION SAFETY

Re-verified after all Slice 16 changes:

- `deleteImageAction` has **exactly one** production importer (`ProductStudio.tsx:11`, invoked `:99`) — no parallel deletion path exists.
- **No `cleanupOrphanedUploadsAction`** anywhere in `src/` (orphan policy unchanged: replacement deletes via Storage API; grandfathered orphans preserved).
- Managed deletion is exclusively via the Storage API (no SQL writes to `storage.objects`).
- Product gates re-run clean: `npx tsc --noEmit` (no output), `npm run build` PASSED (Next.js 16.3.3, TypeScript OK, 8 static pages + full route list generated).

## 19. VERIFICATION LIMITATIONS & HONESTY NOTES

- **Server Actions** cannot be invoked outside the running application. Live verification mirrors each action's exact SQL and Storage calls against the pooler + Storage API rather than clicking the UI. The UI bundle is the same code path (`CmsClient.tsx:46` → `setSiteContentAction`), and the build/typecheck prove it compiles; a human click-through in `/admin/content` remains the last mile.
- **Positive JWT test** (proving a real OWNER bearer JWT traverses RLS) is not possible outside the app; it is evidenced statically (policy `qual`) and by the code path (`auth.ts:48-54`). The negative live test (anon → 401) ran.
- **RLS is prototype-grade** (evaluated to `public` with JWT role gates). Production per §44 requires auth, authorization, proper RLS, roles, audit, secure server-side mutations — unchanged by this slice.
- Headline/subheadline seeding used the copy actually rendered pre-change so the visual is identical; the exact subheadline paragraph lives in `HeroSlideshow.tsx:15` as the fallback.
- `npm run lint` remains unusable repo-wide (pre-existing `es-abstract/2024/AddEntriesFromIterable`) — superseded by `tsc` + `build`, both green.
- No application/access log evidence exists for the exposure window (§15): `server.log` predates it and Next.js `start` output does not log HTTP requests; no deployment origin is configured.

## 20. GATE + EXECUTIVE REPORT

**Findings classification**

| Class | Finding |
| --- | --- |
| ARCHITECTURE | Homepage hero thesis hard-coded → now data-driven (`§5`). Content surface unified under one registry (`§8`). |
| SECURITY | Pre-slice action allowed arbitrary `site_content` keys → server allowlist (`§7`). RLS confirmed JWT-role-only; anon writes live-rejected (`§13-14`). |
| DATA | Dead keys mapped and retired from the operator surface; rows preserved (`§6,11`). Orphan set unchanged; zero dead refs (`§16-17`). |
| AUDIT | Closure: managed-image retirement now emits the registered `image_deleted` at the single `deleteManagedImage` emission point; `image_removed` removed from shipped source (no aliases) (`§12,15`). |
| TEST-ISOLATION | Closure: live exposure incident classified; minimum isolation rule defined for future content lifecycle tests (`§15`). |
| CONTENT | Business settings false affordance removed; CMS now writes only what the storefront reads (`§11,4`). |
| UX | Sectioned editor, per-field save feedback, effective-value display, category fields generated from live data (`§9`). |
| DEFERRED | Article content, page-builder/scheduling/versioning/globalization, JS-only media pipeline server-side, production RLS/auth (`§19`). |

**Requirements status**

- Homepage hero: WRITE PATH = READ PATH — **met** (Test A).
- About / Quality / Origins / Export / Category heroes: read path claims verified — **met** (Tests B, C).
- Managed-image lifecycle reuse, Storage-API delete, no orphans — **met**.
- Eunice tests A–E — **passed live**.
- Residue zero, counts at baseline, tsc + build green, Slice 15 invariants intact.

**Gate: GREEN (closure-reverified 2026-09-13)**

# GREEN — SLICE 16 COMPLETE

The Content CMS is operator-functional, honest to the live site, security-hardened at the write boundary, and Slice-15-consistent — with both closure items resolved: (1) the production hero exposure incident is documented with evidence-backed timestamps and an isolation rule is mandated for future tests; (2) the audit taxonomy is corrected so managed-image retirement emits the registered `image_deleted` (`image_removed` eliminated from shipped source). Do **not** commence Slice 17 without the next brief.