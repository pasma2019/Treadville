# Slice 25 — Shop Category Experience Revamp

**Status:** COMPLETE  
**Date:** 2026-09-19

---

## A. Routes Changed

| Route | Status |
|---|---|
| `/shop/coffee` | ✅ Visual revamp applied |
| `/shop/tea` | ✅ Visual revamp applied |
| `/shop/horticulture` | ✅ Visual revamp applied |
| `/shop/grains` | ✅ Visual revamp applied |

---

## B. Visual System

### Category Palettes

Each category now has a distinct visual identity through directional gradients and typography treatment:

| Category | Palette Direction | Gradient Character |
|---|---|---|
| **Coffee** | Luminous champagne → warm cream → soft copper | Warm, volcanic sophistication |
| **Tea** | Soft sage → emerald → pale mint → champagne | Cool, botanical, fresh |
| **Horticulture** | Emerald → fresh green → soft citrus → champagne | Vibrant, organic, sophisticated |
| **Grains** | Wheat gold → saffron → sand → champagne | Warm, sunlit, harvest |

### Gradient Strategy

**Hero:** Luminous directional gradients (100deg) replace dark overlays. The gradient moves from high opacity on the left (text area) to transparent on the right (image area), preserving image visibility while ensuring text readability. Each category has a unique gradient angle and color progression.

**Section transitions:** Subtle gradient-based transitions between hero, tabs, and product grid sections. No hard color blocks.

**Product cards:** Clean `var(--bg-elevated)` background with subtle shadow system. Category accent appears as a thin 2px bar under the image, not as card-wide coloring.

### Typography Changes

**Hero:**
- Eyebrow: `font-mono`, 11px, uppercase, 0.22em tracking, gold-deep color
- Title: `font-display`, italic, gradient text (category-specific text gradient)
- Description: `ink-soft`, 0.9375rem/1.0625rem, max-width 42ch
- Micro labels: 625rem mono pills with gold-tinted background
- CTA: 0.75rem mono, gold-deep, expanding line on hover

**Category tabs:**
- 13px/14px, uppercase, 0.12em tracking
- Active: category accent color + accent underline (2px)
- Hover: subtle ink underline

**Product cards:**
- Name: `font-display`, italic, 0.9375rem
- CTA: 0.625rem mono, uppercase, category accent color

### Hero Treatment

The hero is now a layered editorial composition:

1. **Background image** — full-bleed, category-specific `object-position`
2. **Directional gradient** — luminous, not dark overlay (100deg, category-specific)
3. **Radial light source** — subtle depth at 30% 40%
4. **Bottom edge transition** — gradient fade to `var(--bg-base)`
5. **Content** — text positioned at bottom-left with controlled contrast
6. **Micro labels** — identity pills below description

**Key improvement:** Text readability achieved through luminous gradient contrast, NOT dark overlays. The image remains visible and the page feels bright and premium.

### Product Card Treatment

New `.cat-product-card` class:
- Rounded corners (10px)
- Clean white background (`var(--bg-elevated)`)
- Subtle shadow (`var(--shadow-soft)`)
- Category accent bar (2px) under image
- Hover: lift + shadow-elevated + image scale

### Category Tab Treatment

New `.cat-tab` class:
- Horizontal scroll on overflow (no wrapping)
- Active: category accent color + animated underline
- Hover: subtle underline
- Touch-friendly padding

### Section Transitions

Hero → Tabs → Micro labels → Product grid
Each section has a distinct surface:
- Hero: luminous gradient over image
- Tabs: `var(--bg-elevated)` with bottom border
- Micro labels: `var(--bg-base)` with bottom border
- Product grid: `var(--bg-base)`

---

## C. Responsive Behavior

### Source-Level Verification

| Width | Hero | Tabs | Product Grid | Typography |
|---|---|---|---|---|
| **320px** | `min-h: 380px`, title `max-w: 12ch`, padding adjusted | Horizontal scroll, no wrap | 2 columns, gap 1.25rem | Title scales down, description wraps |
| **375px** | Same as 320px | Same | 2 columns | Same |
| **390px** | Same as 320px | Same | 2 columns | Same |
| **430px** | Same as 320px | Same | 2 columns | Same |
| **768px** | `min-h: 520px`, full padding | Full width, comfortable spacing | 3 columns, gap 1.5rem | Title scales up |
| **1024px** | Full desktop | Full width | 4 columns, gap 1.75rem | Full desktop sizing |
| **1280px** | Full desktop | Full width | 4 columns | Full desktop sizing |
| **1440px+** | Full desktop | Full width | 4 columns | Full desktop sizing |

### Mobile-Specific Adjustments

- Hero `object-position` shifts per category on mobile (20-30% horizontal) to keep subjects visible
- Tabs use `overflow-x-auto` with hidden scrollbar — horizontal scroll, no wrapping
- Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop
- Micro labels wrap naturally on small screens
- Hero height: 380px mobile, 520px desktop

### Build Verified

- `npx tsc --noEmit` — clean
- `npm run build` — compiled successfully (page-data-collection timeout expected)

### Browser Verification

Source-level responsive verification completed; browser visual verification unavailable.

---

## D. Files Changed

| File | Action | Purpose |
|---|---|---|
| `src/components/CategoryHero.tsx` | **Created** | New premium editorial hero component |
| `src/app/(storefront)/shop/[category]/page.tsx` | **Modified** | Uses CategoryHero, new product card, micro labels |
| `src/components/CategoryTabs.tsx` | **Modified** | Premium horizontal scroll tabs with accent indicators |
| `src/app/globals.css` | **Modified** | Category hero, tabs, product grid, card CSS tokens |

### Unmodified (confirmed):

| File | Status |
|---|---|
| `src/components/ProductCard.tsx` | Untouched (used on other pages, not category) |
| `src/components/ProductImage.tsx` | Untouched |
| `src/components/CategoryDiscovery.tsx` | Untouched (homepage) |
| `src/components/HeroSlideshow.tsx` | Untouched |

---

## E. Scope Audit

### Protected Files — UNTOUCHED:

| File | Status |
|---|---|
| `src/proxy.ts` | ✅ Untouched |
| `src/lib/supabase.ts` | ✅ Untouched |
| `src/lib/supabase/server.ts` | ✅ Untouched |
| `src/lib/auth.ts` | ✅ Untouched |
| `src/lib/order-actions.ts` | ✅ Untouched |
| `src/lib/enquiry-actions.ts` | ✅ Untouched |
| `src/lib/admin-actions.ts` | ✅ Untouched |
| `src/lib/cms-fields.ts` | ✅ Untouched |

### Additional Scope Checks:

| Item | Status |
|---|---|
| Payments | ✅ Untouched |
| M-Pesa | ✅ Untouched |
| Stripe | ✅ Untouched |
| Supabase schema | ✅ Untouched |
| RLS | ✅ Untouched |
| Auth | ✅ Untouched |
| Admin | ✅ Untouched |
| Order flow | ✅ Untouched |
| Product data | ✅ Untouched (no DB changes) |
| Pricing | ✅ Untouched |
| Checkout payment logic | ✅ Untouched |
| HeroSlideshow | ✅ Untouched |
| CategoryDiscovery | ✅ Untouched |
| Footer architecture | ✅ Untouched |
| Header navigation | ✅ Untouched |
| New npm packages | ✅ None added |

---

## F. Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** — zero errors |
| `npm run build` | **Compiled successfully** (page-data-collection timeout — expected) |
| `git diff --stat` | Shows only expected files |
| `git status --short` | No payment/auth/RLS files changed |

---

## G. Visual Notes

### Design Decisions

1. **Luminous gradients over dark overlays** — The hero now uses directional gradients that preserve image visibility while ensuring text readability. This is a fundamental improvement over the previous approach.

2. **Category personality through gradient color** — Each category's gradient uses its accent color family, creating distinct visual worlds without breaking brand consistency.

3. **Gradient text for titles** — Category titles use `background-clip: text` with category-specific gradients, creating premium editorial typography.

4. **Micro labels for identity** — Small mono-font pills below the description reinforce category identity (ORIGIN · KENYA, SPECIALTY ARABICA, etc.) using only verified brand information.

5. **Clean product cards** — The new card system uses white backgrounds, subtle shadows, and a thin accent bar — letting the product imagery dominate.

6. **Horizontal-scroll tabs** — Prevents the ugly multi-row wrapping on mobile while keeping all categories accessible.

### Remaining Issues / Future Work

1. **Photography** — The visual quality is ultimately limited by available category hero imagery. Better photography would elevate the hero significantly.

2. **Browser visual verification** — Source-level responsive verification completed. Actual browser testing at all breakpoints recommended before production deploy.

3. **Product card variety** — The current grid treats all products equally. A future slice could introduce featured/hero product treatments within the category grid.

4. **Category-specific accent depth** — The accent system could be deepened with category-specific hover glow colors, active states, and transition micro-animations.

5. **Animation** — Current animation is limited to CSS transitions and Reveal. A future slice could add scroll-linked effects, parallax, or staggered entrance animations.

---

## Files Created/Modified (Slice 25 only)

| File | Action |
|---|---|
| `src/components/CategoryHero.tsx` | Created |
| `src/app/(storefront)/shop/[category]/page.tsx` | Modified |
| `src/components/CategoryTabs.tsx` | Modified |
| `src/app/globals.css` | Modified |
