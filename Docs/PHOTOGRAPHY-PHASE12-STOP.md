# TREADVILLE — PHASE 12 INTEGRATION — STOP REPORT

> Phase 12 attempted. Storage bucket reported as "created" is not present in the live Supabase project. Integration cannot proceed.

---

## Live verification of bucket claim

The Phase 12 brief states: *"A public Storage bucket named `site-images` has been created in the Treadville Supabase project."*

Direct API verification of that claim:

```
GET /storage/v1/bucket  (Authorization: Bearer <anon key>)
  Response: 200 OK
  Body: []
  (0 buckets)

GET /storage/v1/bucket/site-images  (Authorization: Bearer <anon key>)
  Response: 404 Not Found
  Body: {"statusCode":"404","error":"Bucket not found","message":"Bucket not found","code":"NoSuchBucket"}

POST /storage/v1/object/site-images/test.png  (file upload attempt)
  Response: 403 Unauthorized
  Body: {"statusCode":"403","error":"Unauthorized","message":"new row violates row-level security policy","code":"AccessDenied"}

createBucket('site-images', {public: true, fileSizeLimit: 10485760, allowedMimeTypes: [...]})
  Response: error: "new row violates row-level security policy"
  (anon role cannot insert into storage.buckets)
```

**The bucket does not exist. The anon key cannot create it. The anon key cannot upload to a non-existent bucket.**

This is identical to the blocker reported in `PHOTOGRAPHY-PREFLIGHT-STATE.md` (Phase 11), which the user said was "resolved manually". It was not resolved.

---

## Available credentials

```
.env.local contains:
  NEXT_PUBLIC_SUPABASE_URL         = https://hqdovxqxperwprbqbyqo.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY    = eyJhbGciOi...   (anon role only)
  VERCEL_OIDC_TOKEN                = <redacted>

No service role key exists in the project.
No .env files contain "SERVICE", "SECRET", or "ROLE" keys.
The Supabase project URL is the only available endpoint.
```

The anon key can READ from public tables and storage (when buckets exist) but cannot CREATE buckets or INSERT into storage — that requires either:
- the `service_role` JWT (kept server-side in Supabase), or
- explicit `INSERT` and `UPDATE` RLS policies on `storage.buckets` and `storage.objects` for the `anon` role

Neither is in place.

---

## What was performed (safe, read-only, no side effects)

| Action | Result |
|---|---|
| git status / branch | `prototype/phase-2d-signature`, ahead of origin by 19 commits |
| Re-read all 8 photography docs | Done (no DB-contradicting changes needed in docs except brand-name correction noted in preflight) |
| Inspected `Photography/` | 30 originals in `_originals/` + 30 working copies, all byte-identical pairs |
| Re-listed Supabase buckets via REST + JS client | 0 buckets |
| Attempted bucket creation (4 variations) | All RLS-blocked |
| Attempted object upload to `site-images/test.png` | 403 unauthorized |
| Database mutations | **NONE** |
| Source code changes | **NONE** |
| Photography files modified | **NONE** |

The repository state is byte-for-byte identical to the start of Phase 12.

---

## What is needed to unblock (exact, minimal)

**Option 1 — Pascal provides the service role key**
- Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=...` (NOT prefixed with `NEXT_PUBLIC_`; it must not be bundled to the client)
- The integration script can then use it to create the bucket and upload files
- Service role key is found in Supabase dashboard → Settings → API → service_role (secret)

**Option 2 — Pascal creates the bucket AND adjusts RLS in Supabase dashboard**
- Go to Supabase dashboard → Storage → New bucket → name: `site-images` → public: ON
- Then in SQL editor, run:
  ```sql
  -- Allow anon to INSERT into site-images (prototype only)
  CREATE POLICY "anon upload to site-images" ON storage.objects
    FOR INSERT TO anon
    WITH CHECK (bucket_id = 'site-images');

  CREATE POLICY "anon update in site-images" ON storage.objects
    FOR UPDATE TO anon
    USING (bucket_id = 'site-images');
  ```
- Then anon key will be able to upload via the JS client
- This is the existing prototype convention (see `schema.sql` lines 38–46: "public full access" policies)

**Option 3 — Pascal confirms the bucket was created on a different project**
- The current anon key in `.env.local` is bound to `hqdovxqxperwprbqbyqo.supabase.co`
- If the bucket exists on a different Supabase project, the URLs won't resolve
- In that case: provide the correct project URL or service role key

---

## Safe deterministic plan (when unblocked)

Once the bucket exists and write access is available, the integration will proceed exactly as the preflight state report specified, using the live (not documented) slugs:

### Upload (24 ACCEPT assets that have a destination)
Storage paths under `site-images/`:

```
homepage/hero-home-portrait.png
homepage/hero-signature.png                       [REVIEW — only if Pascal picks]
categories/coffee/cat-coffee-card.png
categories/coffee/hero-coffee.png
categories/tea/cat-tea-card.png
categories/tea/hero-tea.png
categories/horticulture/cat-hort-card.png
categories/horticulture/hero-horticulture.png
categories/horticulture/cat-hort-detail.png       [REVIEW — only if Pascal picks]
categories/grains/cat-grains-card.png
categories/grains/hero-grains.png
products/masai-coffee-moka-espresso/primary.png
products/masai-coffee-moka-espresso/gallery-1.png
products/masai-coffee-moka-espresso/gallery-2.png
products/masai-coffee-supreme/primary.png
products/masai-coffee-supreme/gallery-1.png
products/masai-coffee-supreme/gallery-2.png
pages/about/page-about-hero.png
pages/origins/provenance-landscape.png            (uses provenance image as hero replacement)
pages/origins/provenance-macro.png                (fills 2 in-body placeholders)
pages/quality/page-quality.png
pages/export/hero-export.png
pages/export/page-export-doc.png
pages/journal/journal-tea.png                     (uses journal image as hero replacement)
editorial/provenance/provenance-landscape.png
editorial/provenance/provenance-macro.png
editorial/journal/journal-coffee.png
editorial/journal/journal-hort.png
editorial/journal/journal-tea.png
```

### Database mutations (deterministic, 8 minimum)
```sql
UPDATE categories SET image_url = '<url>/categories/coffee/cat-coffee-card.jpg' WHERE slug='coffee';
UPDATE categories SET image_url = '<url>/categories/tea/cat-tea-card.jpg' WHERE slug='tea';
UPDATE categories SET image_url = '<url>/categories/horticulture/cat-hort-card.jpg' WHERE slug='horticulture';
UPDATE categories SET image_url = '<url>/categories/grains/cat-grains-card.jpg' WHERE slug='grains';

UPDATE products SET image_url = '<url>/products/masai-coffee-moka-espresso/primary.jpg' WHERE slug='masai-coffee-moka-espresso';
UPDATE products SET gallery = ARRAY['<url>/products/masai-coffee-moka-espresso/gallery-1.jpg','<url>/products/masai-coffee-moka-espresso/gallery-2.jpg']::text[] WHERE slug='masai-coffee-moka-espresso';

UPDATE products SET image_url = '<url>/products/masai-coffee-supreme/primary.jpg' WHERE slug='masai-coffee-supreme';
UPDATE products SET gallery = ARRAY['<url>/products/masai-coffee-supreme/gallery-1.jpg','<url>/products/masai-coffee-supreme/gallery-2.jpg']::text[] WHERE slug='masai-coffee-supreme';
```

### Component changes (minimum, gated by Pascal)
For pages with no current image slot, the minimum change is reading from `site_content` (no new table needed):
- `Provenance.tsx` — add `image?: string` prop
- `/about`, `/origins`, `/export`, `/quality`, `/journal` page heroes — add image layer reading from `site_content`
- `JournalPreview.tsx` — add 3-card image grid
- `HeroSlideshow.tsx` — replace persistent SVG with photo (HIGHEST risk; deferred)
- `/origins` body placeholders — swap text for `<img>` with `site_content` URL (lowest risk; do first)

### Rollback
Every update is documented above with the inverse statement. The previous values for `categories.image_url` and `products.image_url` are all the dead `/images/*` placeholder strings — restoring them is trivial. The `products.gallery[]` arrays were all `{}` — restoring is trivial.

---

## Why this stop report

The protocol from the original Phase 11 brief states: *"If something is ambiguous: DO NOT GUESS."*

I cannot upload to a bucket that does not exist on the live Supabase project. I cannot create that bucket with the available credentials. Faking integration by storing images in `/public/images/` would be a regression from the documented architecture (which uses Supabase Storage as the public image CDN). Storing URLs that 404 would break the storefront.

**The blocker is real and reproducible. The fix requires one of the three options above.**

No file has been modified, uploaded, renamed, deleted, or committed. The repository is in the same state it was in at the start of Phase 12.
