# SLICE 18A + 18B Implementation Report

## Files Changed

1. `src/components/ProductImage.tsx` — Updated fallback to light/ivory design system
2. `src/components/SiteFooter.tsx` — Added `relative` positioning for absolute divider
3. `src/components/JournalPreview.tsx` — Replaced hardcoded essays with real article data flow
4. `src/app/(storefront)/page.tsx` — Added article fetching and pass to JournalPreview

---

## What Was Implemented

### Slice 18A — Frontend Consistency

#### A. ProductImage Fallback
- **Before**: Dark gradient fallback (`bg-gradient-to-br from-[var(--soil-raised)] to-[var(--soil-muted)]`) with parchment text
- **After**: Light/ivory fallback (`bg-[var(--warm-white)]`) with ink-muted text and light border (`border-[var(--line-on-light)]`)
- Preserves: component API, image loading behavior, dimensions, accessibility, product data contracts

#### B. SiteFooter Positioning
- Added `relative` class to footer element to establish positioning context for absolute decorative divider (`absolute inset-x-0 top-0 h-px bg-[rgba(236,227,206,0.14)]`)
- Minimal safe change — no visual appearance changes

#### C. Legacy Button CSS (`.btn`, `.btn-primary`, `.btn-ghost`, `.btn-light`)
- **Search result**: Found in `src/app/globals.css` lines 289–352
- **Consumer check**: `Button.tsx` actively uses these classes via `VARIANT_CLASS` mapping:
  - `primary: "btn btn-primary"`
  - `ghost: "btn btn-ghost"`
  - `light: "btn btn-light"`
- **Decision**: **NOT removed** — active consumer exists (Button.tsx component)
- Other button classes in codebase (`btn-cta`, `btn-cta-ghost`, `btn-admin`, `btn-light-*`) are separate and not in scope

#### D. Contrast
- No contrast changes made — no verified readability problems found in existing storefront

---

### Slice 18B — Homepage Journal Preview

#### JournalPreview Component
- **Before**: Hardcoded `DEFAULT_ESSAYS` array with 2 fake articles
- **After**: Accepts `articles?: Article[]` prop, transforms to internal essay format:
  - Uses `getArticles(true)` flow (published only)
  - Displays latest 3 published articles
  - Each teaser links to real `/journal/[slug]` route using article's actual slug
  - Preserves premium visual structure and styling
  - Handles fewer than 3 articles gracefully
  - **Empty state**: When 0 published articles, shows restrained premium card with "The journal is being prepared" message — does not look broken/unfinished

#### Homepage Integration
- Added `getArticles` import from `@/lib/queries`
- Added `articles` to `Promise.all()` fetch alongside categories, featured, content
- Pass `articles={articles}` to `JournalPreview` (replaces hardcoded `essays` prop)

---

## Journal Data Flow Verification

```
Homepage (page.tsx)
  → Promise.all([getCategories(), getFeaturedProducts(), getSiteContent(), getArticles(true)])
  → getArticles(true) in lib/queries.ts
    → supabase.from("articles").select("*").eq("status", "published").order("updated_at", {ascending: false})
    → Returns Article[] (id, title, slug, excerpt, cover_image_url, published_at, etc.)
  → JournalPreview receives Article[]
    → Maps to internal essay format with slug for linking
    → Renders up to 3 cards with real titles, excerpts, dates, cover images
    → Each card wrapped in Link to `/journal/${article.slug}`
```

**Verified**: 
- ✅ Uses existing `getArticles(true)` flow
- ✅ Displays latest 3 published articles
- ✅ Links use real article slugs
- ✅ Preserves existing visual structure
- ✅ No new CMS/database query layer
- ✅ No schema/RLS/admin modifications
- ✅ Graceful handling of <3 articles
- ✅ Premium empty state for 0 articles
- ✅ No invented content

---

## `.btn*` Consumer Search Result

| Class | In globals.css | Active Consumer |
|-------|----------------|-----------------|
| `.btn` | Line 289 | ✅ Button.tsx (VARIANT_CLASS) |
| `.btn-primary` | Line 318 | ✅ Button.tsx (VARIANT_CLASS) |
| `.btn-ghost` | Line 330 | ✅ Button.tsx (VARIANT_CLASS) |
| `.btn-light` | Line 343 | ✅ Button.tsx (VARIANT_CLASS) |

**Other button classes found in codebase (not in scope for removal):**
- `.btn-cta`, `.btn-cta-ghost` — widely used across storefront/admin
- `.btn-admin` — admin auth pages
- `.btn-light-primary`, `.btn-light-ghost`, `.btn-light-link` — light theme variants

**Conclusion**: Legacy `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-light` have active consumer (Button.tsx) → **NOT removed**

---

## Validation Commands/Results

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ Pass (no output = no errors) |
| Build | `npm run build` | ✅ Pass — all 23 routes compiled successfully |
| Lint | `npm run lint` | ⚠️ ESLint dependency issue (pre-existing, unrelated to changes) |

**Build output summary:**
- ✅ Compiled successfully in 67s
- ✅ TypeScript check passed in 14.8s
- ✅ 8/8 static pages generated
- ✅ All routes (/, /shop, /journal, /product/[slug], /admin/*, etc.) built

---

## Pre-existing/Unrelated Issues

1. **ESLint not working**: Module resolution error for `es-abstract/2024/AddEntriesFromIterable` — pre-existing dependency issue, unrelated to Slice 18A/18B changes
2. **Contact page prerender**: Not investigated/fixed per scope (out of scope for this slice)

---

## Backend/Security/Database Contracts — Confirmation

**NO CHANGES MADE TO:**
- ❌ Supabase schema
- ❌ Migrations
- ❌ RLS policies
- ❌ Auth / proxy / session logic
- ❌ Order system
- ❌ Enquiry system
- ❌ Checkout
- ❌ Storage
- ❌ CMS architecture
- ❌ Admin functionality
- ❌ Product/category schema
- ❌ Image storage paths / URL contracts
- ❌ Server action interfaces
- ❌ Supabase helpers
- ❌ Auth boundaries

All changes are **strictly frontend-only** (React components, CSS, data fetching in page.tsx).

---

## Unresolved Items

None. All Slice 18A and 18B requirements implemented and verified.

---

## Final Confirmation

- ✅ No commit performed
- ✅ No merge performed  
- ✅ No deploy performed
- ✅ Only Slice 18A/18B files modified
- ✅ Build passes
- ✅ TypeScript passes