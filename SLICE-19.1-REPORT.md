# SLICE 19.1 — RICH / ELITE VISUAL FOUNDATION REPORT

## Implementation Summary

Implemented the foundational visual layer for the Treadville "Rich / Elite" pivot. Created centralized gradient tokens, a reusable storefront glass utility, enhanced motion primitives, and applied them to three key surfaces: primary CTA, lead category card, and storefront navigation.

---

## Files Changed

1. **src/app/globals.css** — Core design tokens, glass utilities, motion primitives, CTA variants
2. **src/components/CategoryDiscovery.tsx** — Lead category card enhanced with gradient border, image overlay, and accent line
3. **src/components/SiteHeader.tsx** — Navigation updated to use new glass-nav / glass-nav-scrolled utilities

---

## Gradient Tokens Created (135deg, 3-stop)

| Token | Colors | Use Case |
|-------|--------|----------|
| `--gradient-gold` | `--gold-light` → `--gold` → `--gold-deep` | Primary CTA, hero accents |
| `--gradient-coffee` | `#c97a3a` → `--copper` → `#5c3018` | Coffee category accents |
| `--gradient-tea` | `#7aa35c` → `--jade` → `#2d4a35` | Tea category accents |
| `--gradient-horticulture` | `#a8b55c` → `--accent-horticulture` → `#5c6b24` | Horticulture accents |
| `--gradient-grains` | `#d4a84a` → `--amber` → `#7a5c1e` | Grains category accents |

**Rules followed:**
- ~135deg angle
- 3-stop gradients
- No ad-hoc brand colors (all derived from existing tokens)
- Gradients are accent moments only — not page backgrounds
- Ivory foundation preserved

---

## Glass Utilities Created

| Class | Description | Applied To |
|-------|-------------|------------|
| `.glass-nav` | Warm ivory (0.72), subtle ink border (0.08), blur 16px | Storefront nav (default) |
| `.glass-nav-scrolled` | Higher opacity (0.88), gold-tinted border (0.18), stronger shadow | Storefront nav (scrolled) |
| `.glass-cta` | Glass treatment for CTA surfaces on light backgrounds | Available for hero/category cards |

**Not applied to:** body text, dense forms, admin, data tables

---

## Motion Foundation Enhancements

**Added to existing `[data-reveal]` system (no new framework):**

- Extended delay tokens: `data-reveal-delay="4"` (480ms), `="5"` (600ms)
- Light reveal parity: `[data-reveal-light][data-reveal-delay="4/5"]`
- `.stagger` utility: auto-staggers children (0ms → 700ms across 8 children)
- `.gradient-hover`: background-position shift on hover (600ms ease-smooth)
- All respect `prefers-reduced-motion`

---

## Application Targets

### A. Primary Storefront CTA (`btn-cta` + new `btn-cta-glass`)
- Updated to use `--gradient-gold` token
- Background-position animation: 0% → 100% on hover
- Smoother easing (`var(--ease-smooth)`)
- Added `btn-cta-glass` variant for light surfaces with glass treatment
- Reduced-motion: transforms disabled, transitions removed

### B. ONE Representative Category Card (Lead Chapter in CategoryDiscovery)
- Gradient border via `border-image` using category-specific `--gradient-*`
- Subtle gradient overlay on image (`bg-gradient-to-br from-transparent to-[rgba(26,20,16,0.15)]`)
- Gradient accent line on hover (expands from 0 → 33% width)
- Only applied to lead card (first category); companions unchanged

### C. Storefront Navigation (SiteHeader)
- Replaced `.nav-pill` / `.is-scrolled` with `.glass-nav` / `.glass-nav-scrolled`
- Dropdown menu also uses `.glass-nav`
- Mobile panel updated to match new glass token values
- Scrolled state: gold-tinted border, stronger elevation

---

## Validation Results

| Check | Result |
|-------|--------|
| TypeScript (`npx tsc --noEmit`) | ✅ Pass (no output = no errors) |
| Build (`npm run build`) | ✅ Pass — all 23 routes compiled in 73s + 34.6s TS |
| Git diff scope | ✅ Only 3 intended files modified |
| New dependencies | ✅ None added |
| Backend/security files | ✅ None modified |
| Reduced-motion | ✅ All new transitions respect `prefers-reduced-motion` |

---

## Scope Confirmation

**IN SCOPE (completed):**
- ✅ Gradient tokens (gold, coffee, tea, horticulture, grains)
- ✅ Glass utility for storefront nav + CTA
- ✅ Motion primitives (stagger, gradient-hover, extended delays)
- ✅ Application to: primary CTA, lead category card, storefront nav

**OUT OF SCOPE (NOT done):**
- ❌ Full homepage redesign
- ❌ All category cards (only lead card enhanced)
- ❌ Product cards, journal cards, footer, admin
- ❌ Supabase / database / RLS / auth / proxy / orders / enquiries / checkout / storage / CMS
- ❌ next/image migration
- ❌ Package upgrades / dependency installation
- ❌ Slice 19.2, 19.3, 19.4, 19.5

---

## Unresolved Issues

None. Build passes, TypeScript clean, only intended files modified.

---

## Final Status

- **Commit**: NOT performed (per instructions)
- **Push**: NOT performed
- **Merge**: NOT performed
- **Deploy**: NOT performed