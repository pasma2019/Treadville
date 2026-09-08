# PHASE 18 — SHOP HCI AUDIT

## Overview

Audit-first approach per Phase 18 spec. Current state inspected before any changes.
Findings documented by issue, with implementation plan and risks.

---

## 1. CURRENT STRUCTURE

### `/shop` (ShopPage)
```
<main className="surface-warm">
  <div max-w-[var(--content-wide)] px-6 pt-16 pb-24 md:pt-20 md:pb-32>
    <p className="label-on-light">Full catalogue</p>
    <h1 className="font-display text-4xl">The collection</h1>
    <CategoryTabs categories={categories} />
    {products.length > 0 ? <grid /> : <empty>}
  </div>
</main>
```

### `/shop/[category]` (CategoryPage)
```
<main className="surface-warm relative">
  <div absolute top-0 h-[420px] opacity-60 style={categoryAtmosphere(slug)} />
  {heroImage ? <img h-[420px] opacity-40 + scrim> : null}
  <div relative z-10 max-w-[var(--content-wide)] px-6 pt-16 pb-24>
    <p className="label-on-light">Catalogue · {name}</p>
    <h1 className="font-display text-4xl">{name}</h1>
    {description && <body-on-light>{description}</body-on-light>}
    <CategoryTabs activeSlug={slug} />
    {products.length > 0 ? <grid /> : <empty "No published {name} products yet.">}
  </div>
</main>
```

### Components
- `CategoryTabs.tsx` — link buttons, 12px font, wide tracking
- `ProductCard.tsx` — light/dark variant, full product card
- `ProductImage.tsx` — image with onError fallback
- `CategoryMark.tsx` — SVG mark per category

---

## 2. CURRENT VISUAL PROBLEMS

### 1. Washed-Out Category Hero (CRITICAL)
- `categoryAtmosphere(slug)` paints a large radial gradient across top 420-480px
- Hero image overlays at opacity-40 with another gradient wash
- Total effect: photo is barely visible, replaced by atmospheric blur
- Spec: "Do NOT put a large cream/white wash over the entire image"
- Spec: "Do NOT turn the photograph into a background texture"

### 2. Unreadable Category Navigation (CRITICAL)
- CategoryTabs uses `text-xs` (12px), `tracking-widest` (0.1em), uppercase
- Spec: minimum 15-16px for tabs
- Spec: "Do not rely solely on a subtle border to communicate active state"
- Active state: thin border + colored text — too subtle
- Inactive: parchment/60 on light surface — barely visible
- Spec: "If necessary, place the navigation in a dedicated light surface"

### 3. Weak Empty State (CRITICAL)
- "No published {name} products yet." — feels like a broken website
- No commercial pathway
- No Treadville voice
- Spec: "DO NOT leave a huge blank area. Instead create a compact intentional empty state"
- Spec: "The empty state should feel like a deliberate business state, not a broken website"

### 4. Excessive Vertical Spacing (HIGH)
- Shop page: `pt-16 pb-24 md:pt-20 md:pb-32` (huge bottom padding)
- Empty state: `mt-20 py-20` (40px + 80px+80px = massive gap)
- Spec: "Correct the huge dead spaces visible in the current screenshot"
- Spec: "Keep it visually compact. No enormous vertical padding"

### 5. Shop Landing Disconnected from Category Pages (MEDIUM)
- /shop has no hero imagery, no atmosphere
- /shop/[category] has hero imagery
- Inconsistent treatment between related pages
- Spec: "The four categories must feel like one design system"

### 6. Generic "The collection" Heading (LOW)
- H1 = "The collection" feels SaaS
- Could be: "The Treadville catalogue" or category-specific

---

## 3. CURRENT COMPONENT ARCHITECTURE

| File | Role | Issues |
|---|---|---|
| `shop/page.tsx` | Shop landing, all products | Weak empty state, no hero |
| `shop/[category]/page.tsx` | Category page with hero | Washed-out hero, weak empty state |
| `CategoryTabs.tsx` | Category navigation | 12px, low contrast, weak active state |
| `ProductCard.tsx` | Product card | Acceptable — preserved |
| `ProductImage.tsx` | Image with fallback | Acceptable — preserved |
| `CategoryMark.tsx` | SVG category mark | Acceptable — preserved |

---

## 4. CURRENT DATA FLOW

```
ShopPage:
  getCategories() → array
  getProducts({ publishedOnly: true }) → array
  Render CategoryTabs + grid OR empty

CategoryPage:
  getCategoryBySlug(slug) → category
  getCategories() → array
  getProducts({ categorySlug, publishedOnly }) → filtered array
  getSiteContent() → content map (for category_hero_{slug})
  Render hero + tabs + grid OR empty
```

Data flow is correct. No changes to queries needed.

---

## 5. CURRENT PUBLISHED-PRODUCT BEHAVIOUR

Currently: zero published products in the database.

Consequence:
- Both /shop and /shop/[category] show empty state
- The user sees "No published products yet" — looks broken
- This is the primary issue to fix

When products exist (future state):
- /shop shows all products in 2/3/4 column grid
- /shop/[category] shows filtered products in same grid
- ProductCard renders image + name + Enquire label
- Focus rings already in place (from Phase Final Micro HCI)

---

## 6. CURRENT IMAGE BEHAVIOUR

- Hero image from `category_hero_{slug}` content key
- If absent: page falls back to atmospheric gradient only
- If present: image at 40% opacity with cream gradient overlay
- Result: image is barely visible

Spec asks for:
- Strong photography
- Small localized scrim
- Image remains recognizably photographic

---

## 7. CURRENT RESPONSIVE BEHAVIOUR

| Breakpoint | Hero height | Atmospheric wash | Grid |
|---|---|---|---|
| mobile | 420px | opacity-60 | 2-col |
| md (768px) | 480px | opacity-60 | 3-col |
| lg (1024px) | 480px | opacity-60 | 4-col |

Atmospheric wash opacity does NOT reduce on mobile (always 60%), so mobile is actually more washed out than desktop in current implementation.

---

## 8. EXACT FILES TO MODIFY

| File | Change |
|---|---|
| `src/components/CategoryTabs.tsx` | Rewrite: 15-16px text, clear active state with underline, on dedicated light surface |
| `src/app/shop/[category]/page.tsx` | Remove categoryAtmosphere, remove 40% image opacity + cream wash, directional scrim, dedicated tabs surface below hero, premium empty state with CTAs |
| `src/app/shop/page.tsx` | Add same light surface treatment, coherent empty state with commercial pathway, fix spacing |

**No data changes. No product creation. No Supabase queries modified.**

---

## 9. RISKS

1. **Image quality without scrim**: Removing the wash may expose the photograph to text overlap. Mitigated by directional scrim only behind text column.
2. **Tabs visual hierarchy**: Active state must remain obvious. Mitigated by using font-weight + underline + accent color, not just border.
3. **Empty state length**: Must remain compact per spec. Mitigated by single-purpose CTA group.
4. **Shop vs category page coherence**: Both must use the same hero pattern, tabs, empty state.

---

## 10. IMPLEMENTATION PLAN

### Step A: CategoryTabs rewrite
- Font: 15px (`text-[15px]`), no uppercase, no wide tracking
- Active: bold, accent color, bottom underline
- Inactive: `text-[var(--ink-soft)]` 80%, hover darkens
- Focus: visible ring
- Wrapped in a light surface (white/cream background) with subtle border

### Step B: Category page hero rebuild
- Remove `categoryAtmosphere()` entirely
- Show hero image at full opacity, object-cover
- Directional scrim only behind text column (vertical fade or localized gradient)
- Image at top, h-[480px] desktop, h-[400px] mobile
- Text column on top of image, well-positioned

### Step C: Premium empty state (used in both /shop and /shop/[category])
- Centered max-width container
- Eyebrow: "Catalogue · {Category}" or "Catalogue"
- Headline: "Currently in preparation" or category-specific
- Body: clear, business-tone, Treadville voice
- Two CTAs: primary (Request a sample) + secondary (Make an enquiry)
- Compact vertical rhythm

### Step D: Shop page coherence
- Match category page structure: hero treatment (light, no image when not set), tabs, content area
- Remove "The collection" heading in favor of "The Treadville catalogue"
- Tighter vertical rhythm

### Step E: Responsive review
- Tabs: horizontal scroll on mobile if needed, or wrap with `flex-wrap`
- Hero: smaller h on mobile
- Empty state: full-width on mobile, centered on desktop

---

## 11. SUMMARY

Three critical issues:
1. Washed-out hero (replace gradient + image-overlay with directional scrim only)
2. Unreadable category tabs (rewrite for 15-16px, clear active state, dedicated surface)
3. Weak empty state (premium business-tone with commercial CTAs)

Two secondary issues:
4. Excessive vertical spacing (compact rhythm)
5. Shop landing disconnected (match category page treatment)

All implementable with existing components. No new data, no new pages, no new images.
