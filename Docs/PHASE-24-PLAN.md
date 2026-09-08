# PHASE 24 — PLAN

## Implementation Order

### 1. `package.json` — Production metadata
- Add `engines.node` (>=20.x)
- Add `packageManager` field
- No dependency changes

### 2. `src/app/sitemap.ts` — Public sitemap
- Static routes: `/`, `/about`, `/contact`, `/journal`, `/origins`, `/quality`, `/export`, `/shop`
- Dynamic: `/shop/[slug]` for each active category
- Dynamic: `/product/[slug]` for each published product
- Dynamic: `/journal/[slug]` for each published article
- Excludes: `/admin/*`, `/checkout`, drafts

### 3. `src/app/robots.ts` — Robots
- `allow: /` for public
- `disallow: /admin/`
- Reference sitemap

### 4. JSON-LD Components

Create `src/lib/structured-data.tsx` with:
- `OrganizationJsonLd` — site-wide brand
- `WebSiteJsonLd` — site-wide search
- `ProductJsonLd` — for product detail pages
- `ArticleJsonLd` — for journal articles
- `BreadcrumbJsonLd` — for product detail, article detail

All use inline `<script type="application/ld+json">`.

### 5. Root Layout Updates
- Add `OrganizationJsonLd` and `WebSiteJsonLd`
- Add canonical URL via `metadataBase`
- Add OG image (use a hero URL or null)
- Add `verification` and `formatDetection`

### 6. Page-Level Updates

**Homepage (`/`)**
- Add canonical
- Add `WebSiteJsonLd` (in layout, not page)

**About (`/about`)**
- Add canonical
- Add `OrganizationJsonLd` (duplicate is OK — schema spec allows)

**Shop (`/shop`)**
- Add canonical
- Add `BreadcrumbJsonLd` (Home > Shop)

**Shop category (`/shop/[category]`)**
- Add canonical
- Add `BreadcrumbJsonLd` (Home > Shop > Category)

**Product detail (`/product/[slug]`)**
- Add canonical
- Add `ProductJsonLd` (NO fake reviews, NO fake prices)
- Add `BreadcrumbJsonLd` (Home > Shop > Category > Product)

**Journal (`/journal`)**
- Add canonical

**Journal article (`/journal/[slug]`)**
- Add canonical
- Add `ArticleJsonLd`
- Add `BreadcrumbJsonLd`

**Contact (`/contact`)**
- Add canonical

**Origins, Quality, Export**
- Add canonicals

### 7. Category Page Hero Image
- Add `category.image_url` to public category hero
- Editorial composition: large image with overlay + text
- Fallback: text-only (current behavior)

### 8. Enquiry Product Pre-fill
- Contact form reads `?product=<slug>` from query params
- If product exists, pre-populate type with "Product enquiry" or add product context
- Show product name + link in form header
- Save product reference to enquiry (optional, in message body if no column)

### 9. Performance Enhancements
- Add `decoding="async"` to all `<img>` tags (mostly done)
- Add `fetchpriority="high"` to hero image
- Verify `loading="lazy"` on below-fold images

### 10. Validation
- `npx tsc --noEmit`
- `npm run build`
- Verify sitemap, robots, JSON-LD render

---

## Files to Create

| File | Purpose |
|---|---|
| `src/app/sitemap.ts` | Public sitemap |
| `src/app/robots.ts` | Robots config |
| `src/lib/structured-data.tsx` | JSON-LD components |
| `src/app/sitemap.ts` (excluded via getProducts with status filter) | Public products |

## Files to Modify

| File | Change |
|---|---|
| `package.json` | engines, packageManager |
| `src/app/layout.tsx` | Add OrganizationJsonLd, WebSiteJsonLd |
| `src/app/page.tsx` | canonical |
| `src/app/about/page.tsx` | canonical |
| `src/app/contact/page.tsx` | canonical, product pre-fill |
| `src/app/journal/page.tsx` | canonical |
| `src/app/journal/[slug]/page.tsx` | canonical, ArticleJsonLd, BreadcrumbJsonLd |
| `src/app/shop/page.tsx` | canonical |
| `src/app/shop/[category]/page.tsx` | canonical, category image, BreadcrumbJsonLd |
| `src/app/product/[slug]/page.tsx` | canonical, ProductJsonLd, BreadcrumbJsonLd |
| `src/app/origins/page.tsx` | canonical |
| `src/app/quality/page.tsx` | canonical |
| `src/app/export/page.tsx` | canonical |
| `src/components/HeroSlideshow.tsx` | fetchpriority, decoding |
| `src/lib/enquiry-actions.ts` | accept product context |

## Database / Schema

No schema changes required.

## What NOT to touch

- Admin pages (security architecture)
- Cart/checkout
- Photography images themselves
- Phase 23 functionality
- RLS policies
- Server Actions
- Tiptap
- Article rendering (already safe for admin-authored content)
