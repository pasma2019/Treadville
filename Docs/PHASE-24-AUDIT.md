# PHASE 24 — AUDIT: VISUAL AUTHENTICITY + PRODUCTION FINISHING

**Date:** Phase 24 start
**Branch:** `prototype/phase-2d-signature`

---

## 1. STARTING STATE (PHASE 23 OUTPUT)

**Verified working:**
- 27 routes, TypeScript passes, build passes
- ProductStudio category-aware metadata (load + save)
- Journal listing database-backed with empty state
- `/journal/[slug]` article detail page with SEO
- Tiptap rich text editor in ArticleForm
- `loadProductWithMetadata` server action
- `createProductAction` returns `productId`
- Metadata display labels ("SCA Score" not "Sca Score")
- Dev server runs on Webpack (`npm run dev`)

**No changes planned to Phase 23 functionality.**

---

## 2. PHOTOGRAPHY / IMAGE ASSET AUDIT

### Hero images

| Page | Current Source | Status | Recommendation |
|---|---|---|---|
| Homepage hero | `content.homepage_hero` (DB) → `HeroSlideshow` (client) | Reads from Supabase; falls back to text-only | Leave — already correctly wired |
| About hero | `content.about_hero` (DB) | Reads from Supabase | Leave — already correctly wired |
| Provenance section | `content.provenance_image` (DB) | Reads from Supabase | Leave — already correctly wired |

### Category images

| Location | Source | Status |
|---|---|---|
| Homepage CategoryDiscovery | `cat.image_url` from DB | Wired via `CategoryImageLayer` (graceful fail) |
| Shop category page | NOT USED | **Gap — category image not displayed in `/shop/[category]`** |
| Admin category editor | `ImageUpload` | Working |

### Product images

| Location | Source | Status |
|---|---|---|
| `ProductCard` | `ProductImage` component (client-side graceful fail) | Working |
| Product detail main | `<img>` from `product.image_url` | Working — no fallback if missing |
| Product detail gallery | `ProductGallery` component | Working |
| Admin product image | `ImageUpload` | Working |

### Journal covers

| Location | Source | Status |
|---|---|---|
| `JournalPreview` on homepage | Hardcoded default + DB `content.journal_card_*` | Working — wired to site_content |
| `JournalPreview` (default essays) | `DEFAULT_ESSAYS` array still hardcoded with fake content | **Gap — homepage JournalPreview uses fake essays, not real published articles** |
| Journal listing | Real `getArticles()` from DB | ✓ Phase 23 fixed |
| Journal article detail | `article.cover_image_url` | Working |

### About / Origins / Quality pages

| Page | Current Imagery | Status |
|---|---|---|
| `/about` | `content.about_hero` from DB | Working |
| `/origins` | `<img>` tags with hardcoded paths | **Verify — needs inventory** |
| `/quality` | `<img>` with hardcoded path | **Verify — needs inventory** |
| `/export` | `<img>` with hardcoded path | **Verify — needs inventory** |

### Decorative / fallbacks

| Pattern | Status |
|---|---|
| All `<img>` tags use plain HTML (`<img>`) | **Gap — no use of `next/image` for optimization** |
| Inline SVG icons | Working (Tiptap toolbar) |
| Decorative gradients (CSS-only) | Working — no need to convert |

---

## 3. CATEGORY IMAGE INTEGRATION — GAP

`src/app/shop/[category]/page.tsx` does not display the category image. The category hero section is text-only. Recommendation:
- Add category image to the public category hero when `category.image_url` is set
- Maintain editorial composition (no generic card thumbnails)
- Fallback to text-only when image missing

---

## 4. PRODUCT IMAGE PRESENTATION

- `ProductCard` works — graceful failure via `ProductImage` component
- `ProductGallery` on product detail — works
- Product detail primary image is just `<img>` (no `<Image>`)
- **No use of `next/image` anywhere in the project** — uses plain `<img>` with `loading="lazy"` and `onError` fallback

**Recommendation:** Add `next/image` only where it provides clear value (hero images, large product images). For Supabase Storage URLs, `remotePatterns` must be configured in `next.config.ts`. Note: this is a significant change with potential build implications — recommend DEFER for prototype, leave the working `<img>` pattern unless immediate benefit.

---

## 5. SEO MASTER AUDIT

### What's already present
- Root layout: title template, description, keywords, authors, openGraph, twitter, robots, metadataBase
- Homepage: description (inherits title/OG)
- About: title + description
- Contact: inherits
- Shop/category: dynamic title + description
- Product detail: dynamic title + description
- Journal: title + description
- Journal article: dynamic title + description + OG (with cover image)

### Gaps

| Item | Status |
|---|---|
| Canonical URLs | Not set per-page (inherits from metadataBase only) |
| Twitter card image | Not set (uses summary_large_image without image) |
| Open Graph image | Not set on root or homepage |
| Sitemap | **MISSING — no `sitemap.ts`** |
| Robots | **MISSING — no `robots.ts`** |
| Structured data (JSON-LD) | **MISSING — no organization, product, or article schemas** |
| No `not-found.tsx` for root | Custom exists at `src/app/not-found.tsx` |

---

## 6. STRUCTURED DATA

**No JSON-LD anywhere in the project.**

Recommended schemas:
- `Organization` on root layout (site-wide)
- `WebSite` on homepage
- `Product` on product detail (NO fake reviews/prices)
- `Article` on journal article detail
- `BreadcrumbList` on product detail

---

## 7. SITEMAP + ROBOTS

**Both missing.** Need:
- `src/app/sitemap.ts` — public routes + dynamic products + dynamic articles + categories
- `src/app/robots.ts` — basic allow + sitemap reference
- Must exclude: `/admin/*`, drafts, internal routes

---

## 8. MOBILE NAVIGATION

`SiteHeader` already has a hamburger menu (line 30: `const [menuOpen, setMenuOpen] = useState(false);`). Need to verify:
- Touch targets are >= 44px
- Drawer closes on outside click
- Focus trap (or basic focus management)
- 320px no horizontal overflow
- Esc key closes drawer
- Active state on current route

**Confidence:** Likely OK from Phase 17 HCI work, but should test at 320px.

---

## 9. ENQUIRY EXPERIENCE

`src/app/contact/page.tsx` is a full client component with `useActionState`. Currently:
- 5 enquiry types: General, Sample, Export/wholesale, Press, Partnership
- 6 fields: name, email, company, phone, type, message
- Pre-fills from `?type=` query parameter (e.g., `/contact?type=sample`)
- Has success state, error state, validation

**Gap:** No product pre-fill. If a user clicks "Request info" on a product, the contact form should pre-populate with product reference.

**Recommendation:** Add optional product context. `?product=<slug>` query param. Add an enquiry `product` field. Show product info in form header if context present.

---

## 10. ERROR / EMPTY STATE AUDIT

| State | Where | Status |
|---|---|---|
| Product not found | `/product/[slug]` | `notFound()` — good |
| Category not found | `/shop/[category]` | `notFound()` — good |
| Article not found | `/journal/[slug]` | `notFound()` — good |
| Empty category | `/shop/[category]` | Has empty state "Currently sourcing the next selection" |
| Empty shop | `/shop` | Has empty state "No published lots" |
| Empty journal | `/journal` | "Coming soon" empty state (Phase 23) |
| Contact form success | `/contact` | Has "Thank you" success state |
| Contact form error | `/contact` | Has alert display |
| Product without image | `ProductCard` | "Image pending" fallback |
| Category without image | `CategoryImageLayer` | Returns null (no fallback text) |
| Article without cover | `/journal/[slug]` | No cover section (correct — graceful) |
| 404 | `not-found.tsx` | Exists |
| 500 | Default Next.js | Acceptable for prototype |
| Admin empty products | `ProductsClient` | Has "No products yet" empty state |
| Admin empty articles | `JournalClient` | Has "No articles yet" |
| Admin empty enquiries | `EnquiriesClient` | Filtered list shows empty — needs verification |

**All states appear intentional. No fabrication.** ✓

---

## 11. PERFORMANCE AUDIT

### Current patterns
- Plain `<img>` everywhere (no `next/image`)
- `loading="lazy"` on most images
- `Reveal` component for scroll animations (CSS transforms, transforms/opacity only)
- `Cormorant_Garamond` + `DM_Sans` loaded from Google Fonts in root layout
- Client components for: `HeroSlideshow`, `CategoryImageLayer`, `ProductImage`, `SiteHeader`, `CartDrawer`, `TiptapEditor`, `ProductStudio`, `CategoriesClient`, `ProductsClient`, `JournalClient`, `EnquiriesClient`, `SettingsClient`, `UsersClient`, `ContentClient`, `AdminSidebar`, `SignOutButton`
- Server components: All page.tsx files, `CategoryDiscovery`, `Provenance`, `ProductCard`, `SiteFooter`, `FeaturedSection`, `JournalPreview`

### Issues to address
- `HeroSlideshow` is `"use client"` but only does `Link` rendering — could be server component
- `CategoryImageLayer` is `"use client"` for `useState` (failed flag) — OK
- Tiptap is correctly isolated to `TiptapEditor` client component
- No `<Image>` usage — would be improvement, but breaks build if Supabase patterns not configured

### Recommendation
- DO NOT migrate to `next/image` in Phase 24 — it's a build risk for prototype
- Verify `loading="lazy"` everywhere (it is, with one exception: hero images which are above-the-fold)
- Add `fetchpriority="high"` to hero image (optional)
- Add `decoding="async"` to images

---

## 12. NEXT.JS IMAGE CONFIGURATION

`next.config.ts` is empty. No `images.remotePatterns` defined.

**Decision:** Without `next/image` usage, no configuration needed. Adding it would be invasive without clear benefit for the prototype.

---

## 13. ACCESSIBILITY QUICK AUDIT

| Check | Status |
|---|---|
| Root layout lang="en" | ✓ |
| Headings: h1, h2, h3 hierarchy | ✓ (manual review needed) |
| Buttons: aria-labels on icon buttons | ✓ (most have) |
| Links: descriptive text | ✓ (no "Click here" or "Read more" without context) |
| Form labels: every input has label | ✓ (contact form uses Field component) |
| Alt text: products have product name | ✓ (`alt={product.name}`) |
| Decorative images: aria-hidden or empty alt | ✓ (CategoryImageLayer, decoration gradients) |
| Focus states: visible focus rings | ✓ (focus-visible:ring patterns) |
| Color contrast: light/dark surfaces | ✓ (Treadville design system) |
| Keyboard nav: tab order | Should verify in drawer |
| `prefers-reduced-motion` | ✓ (Reveal component supports it) |
| ARIA: live regions for form errors | ✓ (role="alert") |
| Tiptap toolbar: aria-label, aria-pressed | ✓ (verified in TiptapEditor) |

**No major issues identified. Mobile drawer needs verification.**

---

## 14. VISUAL CONSISTENCY

The design system is cohesive. Strong editorial typography, consistent spacing, restrained palette. No "AI-generated" patterns observed. The hero, about, journal, product, contact all share the same dark-to-light rhythm.

---

## 15. VERCEL PRODUCTION READINESS

- `package.json` scripts: `dev` (now webpack), `build` (webpack), `start` (default), `lint` (eslint) ✓
- No `packageManager` field — could be useful
- Node version not specified in `engines` — should add `"engines": { "node": ">=20.x" }`
- `next.config.ts` is empty — could add `outputFileTracingRoot` warning from dev (line 68 of layout)
- Supabase env vars must be in `.env.local` (not in repo)
- Image config not needed if not using `next/image`

**Gaps:**
- No `packageManager` field
- No `engines` field for Node version

---

## 16. SECURITY REGRESSION

- `requireAdmin()` in all Server Actions ✓
- `requireRole()` for SYSTEM_ADMIN routes ✓
- RLS policies in place ✓
- Service role never in client bundles ✓
- Draft articles never public ✓
- New product metadata queries use public Supabase client (correct)
- Article body uses `dangerouslySetInnerHTML` only for admin-authored content

**HTML Safety:**
- Article body authored via Tiptap in admin panel only
- Not user-generated
- Currently uses raw `dangerouslySetInnerHTML`
- For prototype, acceptable. For production, recommend DOMPurify or sanitization library
- **Decision:** Document recommendation, do NOT add sanitization in Phase 24 (no users yet, admin-only)

---

## 17. HTML CONTENT SAFETY

Current pipeline:
1. Admin enters content via Tiptap (controlled toolbar — no arbitrary HTML paste risk)
2. Content saved to DB as HTML
3. Public page renders via `dangerouslySetInnerHTML`

**For prototype (admin-only authoring):** Acceptable. Tiptap's StarterKit output is predictable.

**For production:** Recommend `isomorphic-dompurify` or `sanitize-html` if user-generated content is ever introduced. Document this in report.

---

## 18. IDENTIFIED GAPS TO FIX

| Priority | Gap | Effort |
|---|---|---|
| HIGH | Add `sitemap.ts` and `robots.ts` | 30 min |
| HIGH | Add JSON-LD structured data (Organization, WebSite, Product, Article) | 45 min |
| HIGH | Add category image to public category page hero | 15 min |
| HIGH | Add `engines` Node field, `packageManager` field | 5 min |
| MEDIUM | Add `?product=<slug>` enquiry pre-fill | 30 min |
| MEDIUM | Add canonical URLs to all page metadata | 20 min |
| MEDIUM | Add OG image to root metadata | 10 min |
| MEDIUM | Add `decoding="async"` and `fetchpriority` to hero images | 5 min |
| LOW | Document HTML sanitization recommendation in Phase 24 report | 5 min |
| LOW | Add `packageManager` field | 2 min |

---

## 19. WHAT TO PRESERVE

- All Phase 23 functionality (ProductStudio metadata, journal dynamic, Tiptap, article detail)
- Phase 22 admin infrastructure (auth, RLS, audit, role, settings, change password)
- Phase 21 Product Studio (image upload, gallery)
- Phase 19 admin foundation
- Design language (Treadville editorial premium)
- Photography wiring as-is
- Cart/checkout architecture
- Enquiry flow

---

## 20. RISKS

| Risk | Mitigation |
|---|---|
| Adding JSON-LD breaks build (Next.js metadata API strict) | Use `dangerouslySetInnerHTML` inside a `<script type="application/ld+json">` element — works in all RSC setups |
| Sitemap queries fail on Supabase | Use existing public queries that already work |
| Canonical URL changes break SEO | Use `metadataBase` + per-page `alternates.canonical` — additive, not breaking |
| Category image in public hero changes composition | Only add if `category.image_url` exists; falls back to current text-only |
| Product pre-fill requires schema change | Use existing enquiry `type` field with extended values; no DB schema change needed |

---

## 21. RECOMMENDED IMPLEMENTATION ORDER

1. **`next.config.ts`** — small config improvements (engines not in next.config; use package.json)
2. **`package.json`** — add `engines` and `packageManager`
3. **`/sitemap.ts`** + **`/robots.ts`** — create
4. **JSON-LD components** — `OrganizationJsonLd`, `WebSiteJsonLd`, `ProductJsonLd`, `ArticleJsonLd`, `BreadcrumbJsonLd`
5. **Root layout** — add Organization + WebSite JSON-LD, OG image
6. **Per-page canonical URLs**
7. **Category page** — add category image in hero (graceful)
8. **Enquiry product pre-fill** — add product context query param
9. **Image performance** — add `decoding="async"`, `fetchpriority="high"` to hero
10. **TypeScript + build validation**
11. **Documentation** — write `Docs/PHASE-24-REPORT.md`

---

## 22. PHASE 24 SCOPE DECISION

Following the directive: "Do not implement prematurely." We will:
- ✓ Add sitemap, robots, structured data
- ✓ Add category image to public category hero
- ✓ Add enquiry product pre-fill
- ✓ Add canonical URLs
- ✓ Add Node engines + packageManager
- ✗ NOT migrate to `next/image` (build risk, no clear benefit)
- ✗ NOT add HTML sanitization (defer until user-generated content)
- ✗ NOT redesign any existing pages
- ✗ NOT add new public features
- ✗ NOT touch admin beyond what's necessary
