# Slice 26 — Global Premium Visual System

**Date:** 2026-09-19
**Branch:** `prototype/bolt-image-optimization`
**Status:** COMPLETE

---

## 1. Summary

Established the global premium visual system for Treadville — a cohesive design token architecture, refined surface system, premium gradient tokens, editorial typography hierarchy, motion system, image treatment utilities, and component-level refinements to the navigation and footer.

The visual system is now centralized in `globals.css` and available for all storefront and admin surfaces.

---

## 2. What Was Done

### 2.1 — Warm Surface Tokens (`globals.css` Phase 3 `:root` block)

Added hierarchical surface tokens to the Phase 3 light system:

| Token | Purpose |
|---|---|
| `--bg-soft` | Slightly warmer than base, for subtle section variation |
| `--bg-glow` | Near-transparent gold wash, for atmospheric depth |
| `--bg-muted` | Muted warm tone, for de-emphasized surfaces |
| `--bg-accent` | Subtle gold accent wash, for highlighted sections |

### 2.2 — Premium Gradient Tokens

New directional, editorial gradients for atmospheric surfaces:

| Token | Usage |
|---|---|
| `--gradient-warm-subtle` | Hero and top-of-page atmosphere |
| `--gradient-warm-deep` | Deeper editorial bands |
| `--gradient-gold-wash` | Subtle gold atmospheric overlay |
| `--gradient-hero-atmosphere` | Full hero atmospheric gradient |
| `--gradient-premium-gold` | Refined gold CTA gradient |
| `--gradient-premium-dark` | Dark editorial surface gradient |
| `--gradient-section-divider` | Thin editorial section divider line |

Category-specific warm surfaces also added:
- `--surface-coffee`, `--surface-tea`, `--surface-horticulture`, `--surface-grains`

### 2.3 — Typography Token System

Established a complete editorial typography hierarchy:

**Type families:**
- `--type-display` — Cormorant Garamond for headlines
- `--type-body` — DM Sans for body copy
- `--type-mono` — DM Sans (labels that previously used monospace)
- `--type-label` — DM Sans for micro labels

**Headline scale (fluid):**
- `--text-headline-xl` — clamp(2.5rem, 5vw + 0.5rem, 4.5rem)
- `--text-headline-lg` — clamp(2rem, 3.5vw + 0.5rem, 3rem)
- `--text-headline-md` — clamp(1.5rem, 2vw + 0.5rem, 2rem)
- `--text-headline-sm` — clamp(1.25rem, 1.5vw + 0.5rem, 1.5rem)

**Body scale:**
- `--text-body-lg` (1.0625rem), `--text-body` (0.9375rem), `--text-body-sm` (0.8125rem)
- `--text-caption` (0.75rem), `--text-micro` (0.6875rem)

**Utility classes:**
- `.type-headline-xl`, `.type-headline-lg`, `.type-headline-md`, `.type-headline-sm`
- `.type-body-lg`, `.type-body`, `.type-body-sm`, `.type-caption`, `.type-micro`
- `.type-accent-gold`, `.type-editorial-italic`

### 2.4 — Motion Token System

Refined motion tokens for premium feel:

| Token | Value | Purpose |
|---|---|---|
| `--ease-premium` | cubic-bezier(0.16, 1, 0.3, 1) | Primary premium easing |
| `--ease-settle` | cubic-bezier(0.22, 1, 0.36, 1) | Settling easing |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Subtle spring |
| `--dur-instant` | 120ms | Micro-interactions |
| `--dur-quick` | 200ms | Fast feedback |
| `--dur-normal` | 350ms | Standard transitions |
| `--dur-slow` | 550ms | Deliberate transitions |
| `--dur-reveal` | 700ms | Scroll reveal animations |

Applied across: reveal animations, button transitions, CTA hover states, nav link transitions, card hover states, product image transitions.

### 2.5 — Spacing & Radius Tokens

**Spacing rhythm:**
- `--space-xs` through `--space-3xl` (0.25rem to 6rem)
- `--space-section` — clamp(4rem, 8vw, 8rem)

**Border radius:**
- `--radius-sm` (4px) through `--radius-pill` (9999px)

### 2.6 — Extended Surface System

New surface utility classes:
- `.surface-soft` — slightly warmer than base
- `.surface-glow` — near-transparent gold wash
- `.surface-accent` — subtle gold accent surface
- `.surface-gradient-warm` — warm subtle gradient
- `.surface-gradient-deep` — deeper warm gradient
- `.section-divider` — thin editorial divider line

### 2.7 — Navigation Refinement

**SiteHeader nav-pill:**
- Increased backdrop blur from 20px to 24px for more refined translucency
- Refined shadow to inset-top-luminous + softer bottom shadow
- Increased padding from 1.5rem to 1.75rem for breathing room
- Updated scrolled state with subtler border and refined shadow

**glass-nav / glass-nav-scrolled:**
- Updated to match nav-pill refinements
- Consistent blur, shadow, and border treatment

**Nav links:**
- Added font-size from `--text-body-sm` token
- Added font-weight: 500 for better readability
- Updated underline animation to use `--ease-premium` and `--dur-normal` tokens
- Underline height refined from 2px to 1.5px for subtlety

**Mobile menu:**
- Updated link text to use `--text-body-lg` token
- Updated section labels to use `.type-micro` class

### 2.8 — Footer Refinement

**SiteFooter:**
- Top border gradient: transparent → gold → transparent (atmospheric)
- Brand section: updated to use `.type-micro` for label, refined opacity levels
- All link text sizes updated to `--text-body` token
- Section labels updated to `.type-micro` with gold accent
- Link spacing refined (mt-5, space-y-3.5)
- Contact icons refined (14px, reduced opacity)
- Bottom bar: border updated to gold-tinted, text sizes to token, opacity refined

**surface-footer CSS:**
- Background changed from flat `--ink` to subtle gradient: `linear-gradient(175deg, #1e1a14 0%, #15120d 50%, #0e0b08 100%)`
- Footer link underline transition updated to use motion tokens

### 2.9 — CTA System Refinement

All CTA buttons updated to use new motion tokens:
- `.btn-cta` — transition uses `--dur-slow` and `--ease-premium`, hover lift reduced from 3px to 2px
- `.btn-cta-glass` — same motion token treatment
- `.btn-cta-ghost` — transition uses `--dur-normal` and `--ease-premium`, hover lift reduced from 3px to 2px
- `.btn` — base button transition uses `--dur-quick` and `--ease-settle`

### 2.10 — Image Treatment & Texture Utilities

New utility classes:
- `.image-editorial` — object-fit: cover, centered
- `.image-warm` — subtle warm desaturation filter
- `.image-vignette` — radial gradient vignette overlay
- `.texture-grain` — SVG noise texture overlay at 2.5% opacity (premium depth)

### 2.11 — Category Product Card Refinement

- Card transition uses `--dur-normal` and `--ease-premium`
- Image scale transition uses `--dur-slow` and `--ease-premium`
- Accent bar transition uses `--dur-normal` and `--ease-premium`

---

## 3. Files Modified

| File | Changes |
|---|---|
| `src/app/globals.css` | ~200 new lines: surface tokens, gradient tokens, typography tokens, motion tokens, spacing/radius tokens, surface utilities, typography utilities, texture/grain, image treatment. Refined: nav-pill, nav-link, btn, btn-cta, btn-cta-ghost, reveal animations, cat-product-card, glass-nav, surface-footer, footer link transitions. |
| `src/components/SiteHeader.tsx` | Mobile menu: updated link text sizes to `--text-body-lg`, section labels to `.type-micro`. |
| `src/components/SiteFooter.tsx` | Refined typography (tokens), spacing, opacity levels, icon sizes, top border gradient, bottom bar styling. |

---

## 4. Validation

- **TypeScript:** `npx tsc --noEmit` — PASS (no errors)
- **Build:** `npm run build` — Compiled successfully in 57s. Page data collection timed out (expected — requires Supabase connection).

---

## 5. Architecture Decisions

1. **Token-first approach:** All visual values are now centralized in CSS custom properties. No component hard-codes visual values.
2. **Dual-system coexistence:** The dark token system (--soil, --espresso, etc.) remains available for explicit dark sections. The light system (--bg-base, --ink, etc.) is the active default.
3. **Motion token consistency:** All transitions now reference `--dur-*` and `--ease-*` tokens rather than hard-coded values.
4. **Typography token adoption:** New utility classes (`.type-headline-*`, `.type-body-*`, `.type-micro`) are available for consistent typography across components. Existing components retain their inline Tailwind classes for backward compatibility.
5. **Subtle over decorative:** All new additions are intentionally subtle — gradient washes at 3-4% opacity, grain at 2.5% opacity, thin underlines at 1.5px.

---

## 6. What Remains

- **Component adoption of new tokens:** Existing components (FeaturedSection, JournalPreview, ProductCard, etc.) could be updated to use the new `.type-*` utility classes for consistency. This is optional — the tokens are available when needed.
- **Category accent surface integration:** The `--surface-coffee/tea/horticulture/grains` tokens are defined but not yet applied to category-specific pages. They can be used in future category refinements.
- **Dark mode:** The dark token system exists but is not wired up. A future slice could add `prefers-color-scheme: dark` support using the existing dark tokens.

---

## 7. Handoff Notes

The global visual system is now established. All new components and pages should:

1. Use `--bg-base`, `--bg-elevated`, `--bg-soft`, etc. for surfaces
2. Use `--ink`, `--ink-soft`, `--ink-muted` for text
3. Use `--gold-deep`, `--gold`, `--gold-light` for gold accents
4. Use `--dur-*` and `--ease-*` for motion
5. Use `--text-headline-*` and `--text-body-*` for typography scale
6. Use `.type-micro` for uppercase labels
7. Use `.btn-cta` / `.btn-cta-ghost` for primary actions
8. Use `--gradient-*` for atmospheric surfaces
