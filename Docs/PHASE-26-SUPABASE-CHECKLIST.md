# PHASE 26 — SUPABASE PRODUCTION CHECKLIST

This document contains manual verification steps that **cannot be performed from the repository code alone**. These must be verified by someone with access to the Supabase project dashboard.

---

## PREREQUISITE: Access the Supabase Project

Project URL: `https://hqdovxqxperwprbqbyqo.supabase.co`
Access via: `https://supabase.com/dashboard/project/hqdovxqxperwprbqbyqo`

---

## DATABASE — TABLES

Verify each table exists and has the expected columns.

### Core commerce tables

| Table | Expected columns | Verify |
|---|---|---|
| `categories` | id, name, slug, description, image_url, active, sort_order, created_at | [ ] Exists |
| `products` | id, category_id, name, slug, description, price, image_url, gallery (jsonb), status, featured, stock, created_at, updated_at, published_at | [ ] Exists |
| `enquiries` | id, name, email, company, phone, type, message, created_at | [ ] Exists |
| `articles` | id, title, slug, description, body, cover_image_url, status, author_name, published_at, created_at, updated_at | [ ] Exists |
| `product_metadata` | id, product_id, key, value, category_id, created_at, updated_at | [ ] Exists |
| `site_content` | id, key, value, updated_at | [ ] Exists |
| `admin_roles` | id, user_id, role, created_at | [ ] Exists |
| `activity_log` | id, user_id, action, target_type, target_id, details (jsonb), ip_address, created_at | [ ] Exists |
| `storage_files` | id, storage_path, original_filename, mime_type, file_size, bucket, uploader_id, created_at | [ ] Exists |

### RLS — Enable on all tables

For each table, navigate to **Table Editor → [table] → Permissions** and verify:
- [ ] **RLS is enabled** (toggle in top-right)
- [ ] Appropriate SELECT policy exists (usually public for product/category/contact data)
- [ ] INSERT/UPDATE/DELETE policies restrict to authenticated/admin as appropriate

Test public access:
```sql
-- Run as "anon" role to verify public reads work
SELECT id, name, slug FROM categories WHERE active = true LIMIT 5;
SELECT id, name, slug FROM products WHERE status = 'published' LIMIT 5;
```

---

## DATABASE — POLICIES

| Table | Policy name | Type | Expected behavior |
|---|---|---|---|
| `categories` | Public read | SELECT | Anyone can read active categories |
| `products` | Public published | SELECT | Anyone can read published products |
| `enquiries` | No public access | ALL | Only authenticated admins can CRUD |
| `articles` | Public published | SELECT | Anyone can read published articles |
| `product_metadata` | No public access | ALL | Only authenticated admins |
| `site_content` | Public read | SELECT | Anyone can read |
| `admin_roles` | Admin check | SELECT | Only admins |
| `activity_log` | Admin write | INSERT | Only authenticated admins |
| `storage_files` | No public access | ALL | Only admins read |

---

## DATABASE — INDEXES

| Table | Index | Purpose |
|---|---|---|
| `products` | `products_category_id_idx` | Fast category lookups |
| `products` | `products_status_idx` | Filter published products |
| `products` | `products_slug_key` | UNIQUE on slug |
| `categories` | `categories_slug_key` | UNIQUE on slug |
| `articles` | `articles_slug_key` | UNIQUE on slug |
| `articles` | `articles_status_idx` | Filter published articles |
| `enquiries` | `enquiries_created_at_idx` | Admin listing order |
| `product_metadata` | `product_metadata_product_id_idx` | Fast product metadata lookups |
| `product_metadata` | `product_metadata_key_idx` | Metadata key lookups |
| `storage_files` | `storage_files_bucket_idx` | Bucket filtering |
| `storage_files` | `storage_files_uploader_idx` | Uploader filtering |

---

## DATABASE — CONSTRAINTS

| Table | Constraint | Type |
|---|---|---|
| `products` | `products_slug_key` | UNIQUE |
| `categories` | `categories_slug_key` | UNIQUE |
| `articles` | `articles_slug_key` | UNIQUE |
| `product_metadata` | `product_metadata_product_id_key_key` | UNIQUE (product_id, key) |
| `storage_files` | `storage_files_storage_path_key` | UNIQUE |

---

## STORAGE BUCKETS

Navigate to **Storage → Buckets**

| Bucket | Public? | Purpose | Verify |
|---|---|---|---|
| `product-images` | YES | Product images | [ ] Exists, [ ] Public |
| `category-images` | YES | Category card images | [ ] Exists, [ ] Public |
| `article-images` | YES | Article cover images | [ ] Exists, [ ] Public |

For each bucket, verify:
1. Bucket exists with correct name
2. **Public** toggle is ON (otherwise images 404 on the public site)
3. Storage policies allow public read:
   ```sql
   -- Verify public-read policy exists for each bucket
   SELECT policyname, cmd FROM pg_policies
   WHERE schemaname = 'public' AND tablename IN (
     'product-images', 'category-images', 'article-images'
   );
   ```

---

## AUTHENTICATION

Navigate to **Authentication → Settings**

### Redirect URLs
- [ ] `https://treadville.co.ke/**` — for production
- [ ] `https://localhost:3000/**` — for local development

### Site URL
- [ ] Site URL set to: `https://treadville.co.ke`

### Email (optional but recommended)
- [ ] Custom SMTP configured (Resend, SendGrid, or Supabase built-in)
- [ ] **OR:** Supabase built-in email template configured
- [ ] Email confirmations: ON or OFF (business decision)

### Password reset
- [ ] Password reset emails work — test by requesting reset to a test email

### Admin user
- [ ] At least one admin user exists in `admin_roles` table
- [ ] Admin user can log in at `/admin/login`
- [ ] Admin user can access `/admin` dashboard

---

## API KEYS

Navigate to **Settings → API**

| Key | Used for | Set in Vercel? |
|---|---|---|
| `Project URL` | `NEXT_PUBLIC_SUPABASE_URL` | [ ] Set |
| `anon` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [ ] Set |
| `service_role` (secret) | `SUPABASE_SERVICE_ROLE_KEY` | [ ] Set (SERVER-only) |

**CRITICAL:** The `service_role` key must:
- Be set in Vercel dashboard as an environment variable
- **NOT** be prefixed with `NEXT_PUBLIC_`
- **NOT** be exposed to the browser

---

## DATA SEEDING — VERIFY CONTENT

### Site Content (site_content table)
At minimum, verify these keys exist and have values:
- [ ] `homepage_hero` — hero image URL
- [ ] `about_hero` — about page hero
- [ ] `quality_hero` — quality page hero
- [ ] `export_hero` — export page hero
- [ ] `category_hero_coffee` — coffee category hero
- [ ] `category_hero_tea` — tea category hero
- [ ] `category_hero_horticulture` — horticulture category hero
- [ ] `category_hero_grains` — grains category hero
- [ ] `origins_body_kirinyaga` — origins body image
- [ ] `origins_body_terroir` — origins body image
- [ ] `provenance_image` — provenance section image
- [ ] `journal_card_coffee` — journal card
- [ ] `journal_card_horticulture` — journal card
- [ ] `journal_card_tea` — journal card
- [ ] `about_story_eyebrow` — optional
- [ ] `about_story_body` — optional

### Categories
Verify at minimum:
- [ ] `coffee` — active, slug unique, has image_url
- [ ] `tea` — active, slug unique, has image_url
- [ ] `horticulture` — active, slug unique, has image_url
- [ ] `grains` — active, slug unique, has image_url

### Products
Verify at minimum (published):
- [ ] At least 1 published coffee product exists with real image_url
- [ ] No unpublished products with duplicate slugs
- [ ] All product images point to valid Supabase Storage URLs

### Articles
- [ ] At least 1 published article exists (or empty journal is intentional)
- [ ] No articles with empty slugs

---

## SECURITY VERIFICATION

### RLS check
Run as anon role:
```sql
-- Should FAIL (403) — enquiries should not be readable
SELECT * FROM enquiries LIMIT 1;

-- Should FAIL (403) — admin_roles should not be readable
SELECT * FROM admin_roles LIMIT 1;
```

### Service role check
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is the `service_role` (secret) key, NOT the `anon` key
- [ ] Service role key is in Vercel environment variables, NOT in the client bundle
- [ ] No RLS bypass for anonymous users on sensitive tables

---

## POST-DEPLOYMENT SMOKE TEST

After deploying to Vercel, verify:

### Public site
- [ ] Homepage loads with hero image
- [ ] `/shop` shows categories
- [ ] `/shop/coffee` shows category with image
- [ ] A published product page loads
- [ ] `/journal` loads (published articles or empty state)
- [ ] `/contact` form renders
- [ ] `/sitemap.xml` returns XML
- [ ] `/robots.txt` returns robots rules

### Admin
- [ ] `/admin/login` loads
- [ ] Can log in with admin credentials
- [ ] `/admin` dashboard loads
- [ ] Can view products
- [ ] Can view enquiries

### Form submission
- [ ] Submit `/contact` form — enquiry saved to DB
- [ ] Check `enquiries` table — new row appears

### Images
- [ ] All hero images render (not broken)
- [ ] Category images render
- [ ] Product images render
- [ ] 404 images show graceful fallback

---

## KNOWN LIMITATIONS

This checklist cannot verify:
- Actual image file existence in Supabase Storage (only URL format)
- Content quality of images
- SEO performance (requires Search Console)
- Core Web Vitals (requires Lighthouse or Vercel Analytics)
- Real-time performance under load

These should be verified separately as part of post-launch monitoring.
