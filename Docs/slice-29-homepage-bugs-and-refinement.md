# Slice 29 — Homepage Bug Fixes & Editorial Visual Refinement

## Objective

Fix visible defects on the homepage (PART 1), then push the editorial system closer to world-class through contrast, rhythm, atmospheric color, typography, and responsive polish (PART 2). Extend the cinematic foundation established in Slice 28 with precision refinements.

## PART 1 — Bug Fixes

### 1A: Category Tile Label Contrast

**Problem**: Secondary category tiles (Tea, Horticulture, Grains) had labels that were difficult to read against lighter images. The existing gradient scrim (`rgba(26,20,16,0) 35% → rgba(26,20,16,0.50) 100%`) was too subtle for images with bright or light-toned areas.

**Fix**: Strengthened the bottom scrim gradient to a three-stop progression:

```
Before: linear-gradient(180deg, rgba(26,20,16,0) 35%, rgba(26,20,16,0.50) 100%)
After:  linear-gradient(180deg, rgba(14,11,8,0) 25%, rgba(14,11,8,0.30) 60%, rgba(14,11,8,0.68) 100%)
```

- Scrim starts earlier (25% vs 35%) for more gradual transition
- Midpoint added at 60% (0.30 opacity) for smoother gradient
- Bottom opacity increased from 0.50 to 0.68 for guaranteed legibility
- Primary tile gradient (0.55 at bottom) was already adequate — left unchanged

**File**: `src/components/home/HomepageProductWorlds.tsx:209`

### 1B: Footer Email Overflow

**Problem**: `info@treadville.co.ke` overflowed its container at narrow viewport widths. The `<li>` and `<a>` elements had no overflow protection, causing horizontal scrolling on mobile.

**Fix**: Added `min-w-0` to all contact `<li>` elements and `min-w-0` + `overflow-wrap: break-word` + `word-break: break-word` to the email `<a>` element. Applied `min-w-0` to phone and WhatsApp list items for consistency.

**File**: `src/components/SiteFooter.tsx:158,171,186`

## PART 2 — Editorial Refinements

### 2C: Section Rhythm Tightening

**Problem**: The hero is full-viewport, but the Intro section below had `py-24 md:py-36` — creating an excessive visual gap between the cinematic hero and the brand introduction.

**Fix**:
- **HomepageIntro**: Reduced top padding from `py-24` → `pt-12` (mobile) and `py-36` → `pt-16` (desktop). Bottom padding preserved. The hero-to-intro transition now flows tightly.
- **HomepageQuality**: Reduced bottom padding from `py-24` → `pb-16` (mobile) and `py-32` → `pb-20` (desktop). The dark Quality panel → light Export section transition is now more seamless.

**Files**: `src/components/home/HomepageIntro.tsx:18`, `src/components/home/HomepageQuality.tsx:25`

### 2D: Journal Empty State Redesign

**Problem**: The journal empty state was a flat bordered box with "Coming soon" — functional but visually weak for what should be an editorial teaser.

**Fix**: Replaced with a premium editorial teaser:
- Rounded container (`rounded-[12px]`) with atmospheric `radial-gradient` gold glow
- Decorative center vertical line (gold, 2.5% opacity) for editorial structure
- Typographic hierarchy: small gold label → serif "Stories from origin, coming soon." → body copy → branded closing with gold gradient lines
- Background: `var(--bg-warm)` with radial gold hint

**File**: `src/components/home/HomepageJournal.tsx:55-73`

### 2E: Botanical Green Token

**Problem**: Tea and horticulture category accents used the same jade/emerald tokens without a distinct botanical accent for detail moments.

**Fix**: Added `--botanical: #6b8c56` — a warm muted green that sits between jade and sage. Updated category world classes:
- `.category-world-tea` accent now references `var(--botanical)` instead of `var(--accent-tea)`
- `.category-world-horticulture` gradient updated with botanical-tinted midpoint

**File**: `src/app/globals.css:27,2855-2865`

### 2H: Hero Stat Pill Gold-Glass Treatment

**Problem**: The hero stat pill used a flat `rgba(0,0,0,0.28)` background — functional but visually flat against the cinematic hero.

**Fix**: Replaced with a gold-glass treatment:
- Background: `linear-gradient(135deg, rgba(184,134,11,0.12) 0%, rgba(14,11,8,0.35) 100%)` — warm gold-to-dark gradient
- Added `backdrop-filter: blur(8px)` for glass translucency
- Border updated from `rgba(184,134,11,0.15)` to `rgba(184,134,11,0.18)` for slightly more visible gold edge

**File**: `src/app/globals.css:2314`

### 2J: Footer Atmosphere + Gold Hairline

**Problem**: The footer surface was a simple three-stop dark gradient. The gold hairline separator from content above was subtle (0.20 opacity).

**Fix**:
- Enriched footer background with radial botanical + gold hints: `radial-gradient(40% 30% at 80% 20%, rgba(184,134,11,0.03))` + `radial-gradient(50% 40% at 20% 80%, rgba(107,140,86,0.02))` over deeper charcoal base (`#1a1610 → #12100c → #0a0806`)
- Enhanced gold hairline opacity from `rgba(184,134,11,0.2)` to `rgba(184,134,11,0.30)`

**Files**: `src/app/globals.css:1477`, `src/components/SiteFooter.tsx:15`

## PART 3 — Hover Interaction Fixes

### Image Scale Hover Triggers

**Problem**: Multiple components declared `transition-transform` on images but had no corresponding `group-hover:scale-*` class — making the hover animation a no-op.

**Fix**: Added `group-hover:scale-105` to:
- ProductWorlds supporting tile images (`HomepageProductWorlds.tsx:193`)
- ProductEdit lead product image (`HomepageProductEdit.tsx:97`)
- ProductEdit supporting product thumbnails (`HomepageProductEdit.tsx:190`)

All parent containers already had the `group` class, so the scale trigger now fires correctly on desktop hover.

### ProductEdit Lead Product Accent Line

**Problem**: The "View product" accent line was static (`w-8`) with no transition — inconsistent with all other components where accent lines extend on hover.

**Fix**: Added `origin-left transition-all duration-500 group-hover:w-12` to the lead product accent line, matching the pattern used in ProductWorlds and other sections.

**File**: `src/components/home/HomepageProductEdit.tsx:158`

### ProductEdit Glass Panel Hover

**Problem**: The lead product's glassmorphism info panel had no hover feedback — the most prominent interactive card on the Featured section felt inert on hover.

**Fix**: Added `pe-lead-card` class to the link and `pe-glass-panel` class to the glass div. CSS rule:
```css
@media (hover: hover) and (pointer: fine) {
  .pe-lead-card:hover .pe-glass-panel {
    background: rgba(255, 255, 255, 0.72);
    border-color: rgba(184, 134, 11, 0.22);
  }
}
```
Panel transitions from 60% to 72% white opacity and gains a visible gold border on hover.

**Files**: `src/app/globals.css:2904-2915`, `src/components/home/HomepageProductEdit.tsx:86,120`

### ProductEdit Hardcoded Color

**Problem**: `#f8f4ec` was hardcoded in the section gradient instead of using a design token.

**Fix**: Replaced with `var(--bg-soft)` (`#f5f0e6`) — a visually equivalent warm surface token already in the design system.

**File**: `src/components/home/HomepageProductEdit.tsx:36`

## Design Token Additions

| Token | Value | Purpose |
|---|---|---|
| `--botanical` | `#6b8c56` | Warm muted botanical green — tea/horticulture accent detail |

## Files Modified

| File | Changes |
|---|---|
| `src/components/home/HomepageProductWorlds.tsx` | Secondary tile scrim strengthened; supporting tile image `group-hover:scale-105` added |
| `src/components/SiteFooter.tsx` | Contact `<li>`/`<a>` overflow fix; gold hairline opacity increased |
| `src/components/home/HomepageIntro.tsx` | Top padding reduced for tighter hero→intro transition |
| `src/components/home/HomepageQuality.tsx` | Bottom padding reduced for tighter Quality→Export transition |
| `src/components/home/HomepageJournal.tsx` | Empty state redesigned as premium editorial teaser |
| `src/components/home/HomepageProductEdit.tsx` | Hardcoded color replaced; lead accent line hover added; image scale hover added; glass panel hover classes added |
| `src/app/globals.css` | `--botanical` token; tea/horticulture category world accents; hero stat pill gold-glass; footer surface atmosphere; ProductEdit glass panel hover rule |

## Protected-File Audit

| Protected File | Status |
|---|---|
| `src/components/HeroSlideshow.tsx` | NOT MODIFIED |
| `src/proxy.ts` | NOT MODIFIED |
| `src/lib/supabase.ts` | NOT MODIFIED |
| `src/lib/supabase/server.ts` | NOT MODIFIED |
| `src/lib/auth.ts` | NOT MODIFIED |
| `src/lib/order-actions.ts` | NOT MODIFIED |
| `src/lib/enquiry-actions.ts` | NOT MODIFIED |
| `src/lib/admin-actions.ts` | NOT MODIFIED |
| `src/lib/cms-fields.ts` | NOT MODIFIED |
| Payment files | NOT MODIFIED |

## Validation Results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS (0 errors) |
| `npm run build` | PASS (compiled successfully) |
| `npm run lint` | FAIL (pre-existing dependency issue: `es-abstract/2024/AddEntriesFromIterable` — not caused by this slice) |
| No protected files modified | PASS |
| No payment files modified | PASS |
| No new dependencies | PASS |

## Visual QA Notes

The following should be verified visually in a browser:
- Secondary category tiles (Tea, Horticulture, Grains) — labels readable at all viewport widths
- Footer email `info@treadville.co.ke` wraps cleanly at 320px–430px
- Hero→Intro transition feels tight and intentional (no dead gap)
- Quality→Export dark-to-light transition is seamless
- Journal empty state reads as premium editorial, not a placeholder box
- Hero stat pills have visible gold-glass translucency
- ProductEdit lead product: glass panel brightens on hover, accent line extends, image scales
- ProductEdit supporting products: thumbnail images scale on hover
- ProductWorlds supporting tiles: images scale on hover
- All hover effects only fire on desktop (`@media (hover: hover) and (pointer: fine)`)
- All `prefers-reduced-motion` preferences respected

## Remaining Limitations

1. Hero image cropping for specific product compositions requires actual photography
2. Category tint glows on Product Worlds cards are subtle — may need tuning based on actual category imagery
3. ESLint has a pre-existing dependency issue unrelated to this slice
4. The journal section empty state design is ready but requires actual journal content to fully evaluate
5. Origins image has `transition-transform` declared but no hover trigger — intentional since the image is decorative (not interactive)

## Recommended Next Slice

**Slice 30 — Mobile-First Visual Polish**: With the editorial foundation and bug fixes in place, the next priority should be:
1. Browser-based visual QA across all breakpoints with real content
2. Mobile-specific layout adjustments (hero typography scaling, product card proportions)
3. Touch interaction refinement (cart drawer, navigation)
4. Performance profiling of CSS animations on low-end devices
5. Admin storefront integration testing (category/product CRUD → storefront reflection)
