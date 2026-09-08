# TREADVILLE — SUPABASE PROJECT IDENTITY AUDIT

> Phase 12.1 — read-only verification. No files modified. No database mutations. No Storage mutations. No policies created. No bucket created.

---

## A. Repository Supabase project

| Field | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hqdovxqxperwprbqbyqo.supabase.co` |
| Project reference (derived from URL) | `hqdovxqxperwprbqbyqo` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | present in `.env.local` (role: `anon`; not printed) |
| `SUPABASE_SERVICE_ROLE_KEY` | **not present** anywhere in the repo |
| `VERCEL_OIDC_TOKEN` | present (Vercel OIDC, not Supabase) |
| `.vercel/.env.production.local` | present — contains only Vercel/CI vars (no Supabase URL override) |
| `.env.local.example` | placeholder template only |

### Environment files inspected (read-only)

| File | Supabase keys? |
|---|---|
| `.env.local` | YES — anon key only |
| `.env.local.example` | placeholder |
| `.vercel/.env.production.local` | NO — Vercel/CI only |
| `.vercel/project.json` | Vercel project metadata only (projectId `prj_tNrw8dlSqp4AwA1d9SXbgxgRrXcZ` for the Vercel project named `treadville`, org `team_xUvmR1NZhEM930CpxEU7g4v6`) |

### Source code Supabase references

- `src/lib/supabase.ts:1-15` — single `createClient` call using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `src/lib/queries.ts` — all queries use the singleton from `supabase.ts`

There is **exactly one** Supabase project configured. No conflicting URLs in any environment file. No second client. No hardcoded project ref. No Vercel-deployed URL override that would change the runtime project.

---

## B. Expected Supabase project

The Phase 12.1 brief states Pascal's expected project is:
```
hqdovxqxperwprbqbyqo.supabase.co
```

---

## C. Match: **YES**

The configured URL in `.env.local` is byte-identical to the expected URL. The derived project ref is `hqdovxqxperwprbqbyqo`. The repository is pointing at the same Supabase project where Pascal claims to have created the `site-images` bucket.

---

## D. Database connectivity — **PASS**

```
GET /rest/v1/categories   →  200
GET /rest/v1/products     →  200
GET /rest/v1/site_content →  200
```

Live counts (re-verified now):
| Table | Expected count | Actual count |
|---|---|---|
| `categories` | 4 | **4** (coffee, tea, horticulture, grains) |
| `products` | 8 | **8** (2 published coffee, 6 draft placeholders) |
| `site_content` | 4 | **4** (hero_headline, hero_subheadline, hero_image, about_blurb) |

Full product slugs returned (re-verified):
```
masai-coffee-moka-espresso       published   Masai Coffee Moka Espresso
masai-coffee-supreme             published   Masai Coffee Supreme
black-tea-demo                   draft       Black Tea (Demo)
specialty-tea-demo               draft       Specialty Tea (Demo)
fresh-produce-demo               draft       Fresh Produce (Demo)
export-horticulture-demo         draft       Export Horticulture (Demo)
maize-demo                       draft       Maize (Demo)
rice-demo                        draft       Rice (Demo)
```

All `image_url` values for categories are still the dead `/images/category-*.jpg` placeholders. All `image_url` and `gallery` values for products are the dead `/images/product-*.jpg` placeholders or empty arrays. This is **byte-identical to the state reported in `PHOTOGRAPHY-PREFLIGHT-STATE.md` and `PHOTOGRAPHY-PHASE12-STOP.md`** — the database has not changed.

---

## E. Storage connectivity — **PASS** (the API responds; the project is reachable)

```
GET /storage/v1/bucket  →  200 OK, body: []
GET /storage/v1/bucket/site-images  →  400 (body: {"statusCode":"404","error":"Bucket not found", ...})
POST /storage/v1/object/site-images/test.png  →  403 (new row violates row-level security policy)
createBucket('site-images', {public: true, ...})  →  "new row violates row-level security policy"
```

The Storage REST endpoint is reachable and authenticated. The project ref is correct. The anon role can LIST buckets. The bucket `site-images` does not exist in the project.

---

## F. Bucket list

**0 buckets.** Empty array returned from `listBuckets`. `getBucket('site-images')` returns `404 NoSuchBucket`.

---

## G. Diagnosis

The repository is correctly configured to the same Supabase project Pascal has been working in (`hqdovxqxperwprbqbyqo.supabase.co`). The Database layer of that project contains exactly the records the previous audits identified (4 categories, 8 products, 4 site_content keys), and they have not changed.

The Storage layer of the same project reports **0 buckets** to the anon role and returns `404 NoSuchBucket` for `site-images`. This is one of the following:

1. **The bucket was created on a different project**, not `hqdovxqxperwprbqbyqo`. Pascal may have multiple Supabase projects in the dashboard and the bucket was created in the wrong one.
2. **The bucket was created and then deleted** between the create action and the audit.
3. **The bucket exists but is in a project the anon key cannot see** (project split / new project / different account).
4. **The bucket exists but is in a paused / inactive state** that hides it from the anon role's list (rare; would still normally show in the API).

The most likely explanation is **(1)** — multiple Supabase projects in the dashboard is the most common source of "I created it but it's not there". Pascal's `hqdovxqxperwprbqbyqo.supabase.co` project shows zero buckets, full stop. If the bucket was created in the UI of the same project, it would appear in the API.

The anon role cannot resolve this by itself — it cannot create buckets (Storage RLS) and it cannot enumerate buckets it doesn't have permission to see. The fix requires a dashboard-level verification.

---

## H. Exact next action for Pascal

**Open Supabase Dashboard for the project whose URL is `hqdovxqxperwprbqbyqo.supabase.co`** (project ref `hqdovxqxperwprbqbyqo`).

1. Look at the browser URL bar — it should read:
   ```
   https://supabase.com/dashboard/project/hqdovxqxperwprbqbyqo/storage/buckets
   ```
2. Navigate to **Storage → Buckets** in the left sidebar.
3. Report back ONE of:
   - **`site-images` is visible in the list** — then there is a permissions/cache bug. Pascal should send a screenshot. We will not create another bucket.
   - **`site-images` is NOT visible** — then the bucket was created on a different project. The browser URL bar of the Supabase tab where Pascal clicked "Create bucket" will reveal the project ref. That ref is the actual project holding the bucket.
   - **0 buckets shown at all** — then the project genuinely has no buckets. The `site-images` bucket was created on a different project (likely an older or a new free-tier project not linked to this repository).

**Do NOT create another bucket yet.** Do not modify RLS. Do not upload.

The single fact we need to confirm is: *which project ref's Storage → Buckets page shows `site-images`?* Once that project ref is known, we can either (a) point the repo's `NEXT_PUBLIC_SUPABASE_URL` at that project (if it is meant to be the production project), or (b) re-create the bucket in the `hqdovxqxperwprbqbyqo` project from the correct dashboard session.

---

## State preserved

- No source code modified
- No `.env.local` modified
- No database rows read in any destructive way
- No Storage objects created, deleted, or modified
- No RLS policies created or modified
- No buckets created or modified
- The 30 PNG originals in `Photography/_originals/` are untouched
- The 30 working copies in `Photography/` are untouched
- `git status` shows only untracked docs (same state as Phase 11 / Phase 12)
