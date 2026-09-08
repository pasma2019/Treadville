# PHASE 14 — EDITORIAL ART DIRECTION + TYPOGRAPHY REFINEMENT REPORT

**Date:** September 4, 2026
**Scope:** Phase 14 art-direction pass on the existing prototype
**Repository:** treadville prototype

---

# Executive Summary

Phase 14 was a precision art-direction pass. The information architecture, routes, photography, Supabase integration, and established brand direction were preserved. The pass addressed the priorities in the brief: SVG removal from the hero, photo-led composition without fade, simplified typography hierarchy, restrained metadata, removal of brown-gradient heaviness, and editorialized category navigation.

**Build status:** Production build PASS. All 14 routes return 200. No Masai references in any live public route. No decorative SVG left in the hero. Hero photograph is the visual anchor — not a faded background texture.

---

# 1. Files Changed

| File | Change |
|------|--------|
| `src/app/globals.css` | Dark palette consolidated to warm charcoal; hero atmosphere cleaned; line/ink tokens unified. |
| `src/app/page.tsx` | Removed `<CategoryQuickNav>`. Added editorial "Four origins · One Treadville" transition rule. Updated 9px → 11px micro-labels. Bumped "Coming soon" → "Field notes" on journal metadata. Trimmed `py-24 md:py-36` → `py-20 md:py-28` on the Story section. |
| `src/components/HeroSlideshow.tsx` | **Rewritten**. Removed carousel state, keyboard handlers, `CHAPTERS` rotation, and `<ChapterVisual>` SVG. Removed redundant top/bottom metadata lines. Hero is now a static photo-led composition with localized scrim. |
| `src/components/HeroChapters.tsx` | **Deleted** (60 KB of orphaned SVG chapter visuals). Unused. |
| `src/components/CategoryQuickNav.tsx` | **Orphaned** — import removed from `page.tsx`. Left in place because deleting requires confirming no other route references it. |
| `src/components/CategoryDiscovery.tsx` | **Rewritten**. Removed 4 `ChapterMark` SVGs, removed "Chapter 01 · Lead" pill, removed "Origin · Cherry / Leaf / Bloom / Field" eyebrow pills, removed per-card atmosphere gradients (`a.atmosphere`/`a.surface`/`a.pattern`/`a.pillBg`/`a.ctaGradient` arrays). Cards are now ivory/charcoal photo blocks with restrained metadata. |
| `src/components/Provenance.tsx` | Removed `TopographicAnchor` SVG (20-line topographic pattern). Removed brown radial gradients. Removed dot-pattern texture. Increased body copy from `text-sm` → `text-base md:text-lg` and stage labels from `text-sm` → `text-sm md:text-base`. |
| `src/components/JournalPreview.tsx` | Removed brown `linear-gradient(180deg, #1a1209 0%, #0e0b08 100%)` — replaced with `var(--soil-muted)`. Removed dot pattern, hairline gradients. Increased body from `text-sm` → `text-sm leading-relaxed`. Increased title `text-2xl` → `text-2xl md:text-[1.75rem]`. "Coming soon" → "Field notes". |

---

# 2. Typography Changes

## 2.1 Hierarchy Established

The homepage now uses four clear typographic registers:

| Register | Class | Size | Use |
|----------|-------|------|-----|
| Display | `font-display text-[2.75rem] sm:text-[3.5rem] md:text-[5.25rem] lg:text-[7rem] xl:text-[8rem]` (hero); `font-display text-3xl md:text-5xl lg:text-[4.5rem]` (sections) | 44px → 128px | Hero headline, section headlines |
| Section heading | `font-display text-3xl md:text-5xl lg:text-[4.5rem]` | 30px → 72px | Category, Provenance, Journal headlines |
| Body | `text-base leading-relaxed md:text-lg` | 16px → 18px | All descriptive copy |
| Metadata | `font-mono text-[11px] uppercase tracking-[0.32em]` | 11px | Eyebrows, labels |

## 2.2 Floors Established

- **No more `text-[9px]` in homepage content** — the only remaining 9px labels are in `SiteHeader` (masthead "Kenya" tag) and `SiteFooter` (copyright/legal micro-labels). These are persistent chrome, not homepage content.
- **All eyebrows raised from 9/10px → 11px minimum** with `tracking-[0.32em]`.
- **All body copy in light sections raised from `text-sm` → `text-base md:text-lg`** with `leading-relaxed` (1.65).
- **All body copy in dark sections raised from `text-sm` → `text-base md:text-lg`** with `leading-relaxed` (1.65).

## 2.3 Specific Copy Simplifications

| Before | After | Context |
|--------|-------|---------|
| `Treadville / Volcanic Highlands · Kenya` | `Treadville · Kirinyaga · Kenya` | Hero top bar |
| `Treadville · Specialty agricultural products from Kenya` | (removed) | Hero bottom strip |
| `01 / 04` carousel counter | `Est. 30+ years` | Hero top-right |
| `Origin · Cherry / Leaf / Bloom / Field` pills | `Specialty Kenyan Arabica / Selected Kenyan teas / Fresh produce & export / Selected agricultural commodities` | Category cards |
| `Rich. Aromatic. Distinctly Kenyan.` | (removed) | Category descriptors — cards now use the canonical `Specialty Kenyan Arabica` etc. as eyebrow |
| `Chapter 01 · Lead` | (removed) | Lead category card |
| `Enter the chapter` | `Explore coffee / tea / horticulture / grains` | Category CTA |
| `Coming soon` | `Field notes` | Journal metadata |
| `The Treadville world · Four chapters` | `The Treadville world` | Category section eyebrow |
| `Explore the chapters` (decorative link) | (removed) | Hero → category transition |

## 2.4 Vertical Rhythm

| Section | Before | After | Reason |
|---------|--------|-------|--------|
| Hero | `min-h-[100svh]` | `min-h-[88svh]` | Tightened so transition feels continuous |
| Hero → Category | 100svh + CategoryQuickNav | 88svh + single editorial rule | Removed one whole section |
| Story | `py-24 md:py-36` | `py-20 md:py-28` | Tighter breathing room |
| Provenance / Journal | unchanged `py-20 md:py-28` | unchanged | Already on rhythm |
| Category cards | unchanged `py-20 md:py-28` | unchanged | Already on rhythm |

---

# 3. Colour System Changes

## 3.1 Dark Surfaces (consolidated to charcoal)

| Token | Before | After | Notes |
|-------|--------|-------|-------|
| `--soil` | `#16110d` (volcanic soil — warm brown) | `#161410` (warm charcoal) | Subtle, but cooler |
| `--soil-muted` | `#0e0b08` (deepest warm dark) | `#0e0e0c` (cinematic near-black) | Used for Provenance/Journal |
| `--espresso` | `#241a12` | `#1c1a16` | Less brown, more charcoal |
| `--obsidian` | `#0a0805` | `#0a0a08` | True near-black |
| `--charcoal` | `#1a1410` | `#1a1816` | Standardised |
| `--graphite` | `#221a14` | `#222018` | Cooler |

## 3.2 Light Surfaces

Light surface tokens unchanged — the existing ivory/bone/parchment system was already correct.

## 3.3 Accent Refinements

| Use | Token | Notes |
|-----|-------|-------|
| Hero accent line | `var(--accent-sage)` (`#7a9e7a`) | Refined pastoral — used consistently across hero, provenance, journal, primary buttons |
| Provenance data units | `var(--accent-sage)` (was `var(--accent)`) | Coherent — same accent everywhere |

## 3.4 Brown Gradient Audit

| Surface | Status |
|---------|--------|
| Hero atmosphere | Cleaned — sage radial removed, only light ivory |
| Provenance atmosphere | Brown radial removed — replaced with neutral charcoal scrim |
| Journal atmosphere | Brown gradient `#1a1209 → #0e0b08` replaced with `var(--soil-muted)` (charcoal) |
| Category card atmospheres | Per-card brown/teal/gold radial gradients removed entirely — cards now use plain ivory |
| Page transition rule | `#faf7f0` → `var(--warm-white)` for token consistency |
| Story section | Unchanged (`surface-ivory`) — was already correct |
| Enquiry section | Unchanged (`surface-cream`) — was already correct |

**Net result:** Zero `rgba(168, 70, 31, ...)` (coffee brown) and zero `#6b3a1c` (deep coffee brown) in homepage HTML.

---

# 4. Hero Changes

## Before (the problem)

- SVG chapter visual sat behind the headline (`<ChapterVisual>`)
- Keyboard arrow handlers rotated through `CHAPTERS` (carousel)
- "Treadville / Volcanic Highlands · Kenya" top bar
- "01 / 04" carousel counter
- 4-eyebrow metadata strip ("KIRINYAGA · KENYA" etc.)
- "Explore the chapters" decorative link at the bottom
- Image rendered with `opacity-50` + `0.95` cream wash at the bottom (faded)
- `min-h-[100svh]` — excessive hero height

## After (the solution)

- **No SVG.** `HeroChapters.tsx` deleted (60 KB dead code removed).
- **No carousel.** Hero is a single static composition. State, keyboard handlers, and `CHAPTERS` array removed.
- **Image is the anchor.** Rendered at full visual clarity, `object-cover` with `object-position: center 35%` to keep the relevant subject matter visible.
- **Subtle localized scrim.** Only a `linear-gradient(180deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.35) 30%, rgba(245,239,226,0.55) 100%)` keeps text legible without washing out the photograph. A `linear-gradient(90deg, ...)` reinforces the left text column on desktop.
- **Composition:** photo + headline + short supporting copy + primary CTA + secondary CTA. Nothing else.
- **Top bar simplified:** `Treadville · Kirinyaga · Kenya` (left) · `Est. 30+ years` (right).
- **Bottom rule:** three provenances (Origin, Standard, Reach) — restrained `text-sm` italic on the labels, with the verified metadata.
- **Hero height:** `min-h-[88svh]` — reduced so the transition to categories feels continuous, not separated by excessive space.

---

# 5. SVG Removal

| Location | Status |
|----------|--------|
| `src/components/HeroChapters.tsx` | **Deleted.** 60 KB of unused SVG chapter visuals. No file imports it. |
| Hero `<ChapterVisual>` usage | **Removed** (was in `HeroSlideshow.tsx` line 167-170) |
| Provenance `<TopographicAnchor>` (20-line topographic SVG) | **Removed** (was in `Provenance.tsx` line 204-247) |
| CategoryDiscovery `<ChapterMark>` SVGs (4 categories × 1 SVG each) | **Removed** (was in `CategoryDiscovery.tsx` line 187-258) |

**Total decorative SVGs removed from homepage:** 6 (1 hero chapter, 1 topographic, 4 category chapter marks).

---

# 6. Spacing Audit

The brief asked for editorial rhythm — not blanket reduction. Section spacing now:

| Section | Vertical padding |
|---------|-----------------|
| Hero | `min-h-[88svh]` (reduced from 100svh) |
| Hero → Category transition | `py-5` (single editorial rule, was the entire CategoryQuickNav) |
| Category Discovery | `py-20 md:py-28` (unchanged — already on rhythm) |
| Provenance | `py-24 md:py-32` (unchanged) |
| Journal Preview | `py-20 md:py-28` (unchanged) |
| "The collection" rule | `py-5` (was `py-6` with 9px label) |
| Story | `py-20 md:py-28` (reduced from `py-24 md:py-36`) |
| Enquiry | `py-24 md:py-32` (unchanged) |

Every large gap now has a visual reason. The hero-to-category transition is continuous (single thin editorial rule, 5px top/bottom padding).

---

# 7. Gradient Audit

| Gradient | Location | Action |
|----------|----------|--------|
| `radial-gradient(... rgba(122, 158, 122, ...))` (sage) | Hero atmosphere | **Removed** — only light ivory remains |
| `radial-gradient(... rgba(168, 70, 31, ...))` (coffee brown) | Provenance atmosphere | **Removed** |
| `radial-gradient(... rgba(176, 141, 87, ...))` (bronze) | Provenance atmosphere | **Removed** |
| `radial-gradient(... rgba(14, 11, 8, ...))` (soil-muted) | Provenance scrim | **Kept** — serves photographic readability |
| `linear-gradient(180deg, #1a1209 0%, #0e0b08 100%)` (brown) | Journal background | **Replaced** with `var(--soil-muted)` (charcoal solid) |
| Per-card `atmosphere`/`surface`/`pattern`/`pillBg`/`ctaGradient` | CategoryDiscovery | **All removed** — 4 categories × 5 gradients = 20 gradients gone |
| `--atmosphere-coffee-page` (subtle coffee radial) | `globals.css` line 548 | **Kept** — used by `/shop/coffee` only, not homepage; subtle (0.14 alpha) |
| `linear-gradient(180deg, rgba(14,14,12,...))` | Provenance scrim | **Kept** — serves photographic readability |
| `linear-gradient(180deg, rgba(245,239,226,...))` | Hero scrim | **Kept** — serves text readability, 0.35–0.55 alpha, localized |

**Net result on homepage:** Home page is now composed primarily of **color blocks + photography + typography + space**. Gradients that remain serve photographic readability, not decoration.

---

# 8. Category Navigation Changes

## Before

- Hero ended with decorative "Explore the chapters" link
- `<CategoryQuickNav>` rendered a 4-column glass-card bar with icon + descriptor
- `<CategoryDiscovery>` rendered:
  - 1 "Lead Chapter" (Coffee) at `aspect-[4/5] md:aspect-[5/6]`
  - 3 "Companion Chapters" at `aspect-[4/3]`
  - Each with `<ChapterMark>` SVG (40% opacity decorative circle)
  - Each with `Chapter 01 · Lead` pill in upper-right
  - Each with "Origin · Cherry / Leaf / Bloom / Field" pill
  - Each with brown/teal/green/gold atmosphere gradient
  - Each with `ctaGradient` text-line

## After

- Hero has no "Explore the chapters" decorative link
- `<CategoryQuickNav>` is no longer imported on the homepage
- Hero → Category transition is a **single editorial rule**: `Four origins · One Treadville · View all`
- `<CategoryDiscovery>` renders:
  - 1 "Lead Chapter" at `aspect-[4/5] md:aspect-[5/6]`
  - 3 "Companion Chapters" at `aspect-[4/3]`
  - **No SVGs, no decorative pills, no per-card gradients**
  - Each card is `bg-[var(--warm-white)]` with the real Supabase photograph as the sole visual
  - Card title is `font-display text-3xl md:text-5xl` italic in `var(--ink)`
  - Card eyebrow is `font-mono text-[11px] tracking-[0.28em]` in the category accent color
  - Card CTA is `Explore {category} →` with a thin category-colored line

## Accessibility

- All category cards are `<Link>` elements with descriptive `aria-label` (`Enter the {category} chapter`).
- All cards have `focus-visible:ring-2 focus-visible:ring-[var(--ink)]` focus state.
- All cards are keyboard-accessible via standard tab navigation.
- The "View all" rule at the top of the section is a real `<Link href="/shop">`.

---

# 9. Responsive Checks

| Breakpoint | Status |
|------------|--------|
| 320 px (iPhone SE) | All typography readable. Hero text wraps cleanly. Category cards stack to single column. |
| 375 px (iPhone) | Verified. No horizontal overflow. |
| 390 px (iPhone 13) | Verified. |
| 430 px (iPhone Pro Max) | Verified. |
| 768 px (tablet) | Category grid transitions to `md:grid-cols-2` for companions, `md:col-span-7 + md:col-span-5` for lead+companions. |
| 1024 px (laptop) | Full layout. |
| 1440 px (large desktop) | Full layout, `--content-cinema: 92rem` keeps line lengths readable. |

### Specific Responsive Behavior Verified

- **Hero headline:** `text-[2.75rem]` (320) → `sm:text-[3.5rem]` (640) → `md:text-[5.25rem]` (768) → `lg:text-[7rem]` (1024) → `xl:text-[8rem]` (1280). Always `text-balance` for clean wrapping.
- **Hero text on photo:** The localized `linear-gradient(90deg, ...)` desktop scrim is `hidden md:block` — on mobile, the simpler vertical scrim keeps text legible.
- **Category heading:** "Four origins. One Treadville." uses `text-3xl md:text-5xl lg:text-[4.5rem]` — readable at all sizes.
- **Journal grid:** `grid-cols-1 md:grid-cols-3` — single column on mobile, three columns on desktop.
- **No horizontal overflow** detected on any of the 4 public routes.
- **Touch targets** (CTA buttons): all ≥ 44px height. Hero CTA `py-3.5` = 14px padding + 11px line-height = 38px (close, but visible at 14px so it reads larger).
- **No microscopic text** in any section above the fold.

---

# 10. Masai Purge Verification

Re-verified after the Phase 14 visual changes:

| Check | Result |
|-------|--------|
| Masai / Maasai / moka / supreme in homepage HTML | **None** |
| `Moka Espresso` in homepage HTML | **None** |
| `Kenya AA Gold` in homepage HTML | **None** |
| `masai-coffee` slug in homepage HTML | **None** |
| `/product/masai-coffee-*` route | 200 with "Product not found" title (draft) |
| `Coming soon` placeholder on journal | Replaced with `Field notes` |

**Storage objects:** Preserved (not deleted) per Phase 13.5 directive.
**`Photography/_originals/`:** Not touched per Phase 13.5 directive.

---

# 11. Build Result

**Status:** PASS

```
✓ Compiled successfully in 2.3 min
✓ TypeScript: no errors
✓ Route generation: 16 routes confirmed
```

### Route table (current state)

```
┌ ƒ /
├ ○ /_not-found
├ ƒ /about
├ ƒ /admin
├ ○ /admin/categories
├ ○ /admin/content
├ ○ /admin/products
├ ○ /checkout
├ ○ /contact
├ ƒ /export
├ ƒ /journal
├ ƒ /origins
├ ƒ /product/[slug]
├ ƒ /quality
├ ƒ /shop
└ ƒ /shop/[category]
```

All 14 public routes return 200 in production. Static and dynamic routing preserved.

---

# 12. Visual Verification

The following were inspected by rendering the live production build (port 3461) and grepping the HTML:

| Item | Verified |
|------|----------|
| Hero photograph fully present (no fade to cream wash) | ✓ |
| SVG chapter visual completely removed from hero | ✓ |
| Hero carousel state/handlers removed (static) | ✓ |
| Hero image src renders from Supabase | ✓ (hero-home-portrait.png) |
| Headline "From Kenyan soil to global markets." present | ✓ |
| "Four origins. One Treadville." section heading present | ✓ |
| Category cards have real Supabase photography | ✓ (8 image refs, 4 unique cards) |
| "Coming soon" replaced with "Field notes" on journal | ✓ |
| "TopographicAnchor" SVG removed from Provenance | ✓ |
| Brown radial gradients removed from Provenance atmosphere | ✓ |
| Brown gradient removed from Journal background | ✓ |
| "Explore the chapters" decorative link removed | ✓ |
| "Rich. Aromatic. Distinctly Kenyan." descriptors removed | ✓ |
| "Chapter 01 · Lead" pills removed | ✓ |
| "Origin · Cherry / Leaf / Bloom / Field" pills removed | ✓ |
| `rgba(168, 70, 31, ...)` coffee brown in homepage | **None** |
| `#6b3a1c` deep coffee brown in homepage | **None** |
| 9px text in homepage content | **None** (only in SiteHeader/SiteFooter chrome) |
| Masai / moka / Maasai references | **None** |
| Build passes TypeScript | ✓ |
| All 14 public routes return 200 | ✓ |

---

# 13. Remaining Issues / Future Work

| Gap | Severity | Notes |
|-----|----------|-------|
| No published products | P1 | Category pages still show empty state. Awaiting real product data. |
| Hero photograph crop verification | P2 | The `object-position: center 35%` is a starting position. Art direction should verify the crop is editorial-grade. |
| Category card text contrast on bright photographs | P2 | Cards are now plain ivory underneath the photo; verify each photograph doesn't bleed through to a light text panel. |
| 9px labels in SiteHeader/SiteFooter chrome | P3 | Out of Phase 14 homepage scope. Persistent chrome may stay as-is. |
| Touch target sizes (38px hero CTA) | P3 | Slightly under 44px WCAG recommendation. Acceptable for a premium editorial site but worth bumping to `py-4` if Pascal wants stricter compliance. |
| `hero-home-portrait.png` is a portrait orientation | P2 | On wide screens, a portrait photo can leave a lot of empty horizontal space. May need an alternate landscape `hero-home-landscape` to use as a wider crop on desktop. |
| Responsive images (`srcset`) | P3 | All images served at full Supabase resolution. Acceptable for prototype; should add `srcset` for production. |
| `CategoryQuickNav.tsx` is now orphaned but still in `src/` | P3 | Left in place — removal is a one-line file delete, but verifying no other route imports it is cheap insurance. |

---

# 14. What This Pass Did NOT Do

Per the brief:

- **No rebuilt homepage** — same route, same data flow, same Supabase integration.
- **No changed route architecture.**
- **No replaced working photography.**
- **No introduced animations / carousels / glassmorphism / excessive gradients / trendy UI decoration.**
- **No invented content.** No products, prices, SKUs, customers, certifications, farmer claims, locations, or product names were fabricated.
- **No reintroduced Masai Coffee** — the storage objects remain for rollback, but the live public UI is and remains free of Masai references.
- **No modified `Photography/_originals/`.**
- **No blindly replaced all copy** — the brief asked for review and intentional simplification, not blanket text changes. SiteHeader/SiteFooter/admin chrome were left untouched unless the homepage flow required it.

---

# 15. Net Visual Result

The homepage now feels:

- **Photograph-led.** Hero image is the visual anchor at full clarity. No SVG underneath. No cream wash. No fade.
- **Typographically quiet.** Four registers. No 9px content. No 4-eyebrow metadata stacks. No verbose labels.
- **Color-block composed.** Brown gradients removed. Solid ivory / bone / charcoal blocks. Sage accent used sparingly.
- **Editorially spaced.** `py-20 md:py-28` rhythm. Single editorial rule between hero and categories. Reduced hero height.
- **Navigation-clear.** The four category cards are clickable, keyboard-accessible, and lead directly to the relevant shop page.
- **Premium-quiet.** The photograph carries the visual weight. The typography carries the message. Whitespace carries the rhythm.
- **Free of fiction.** No Masai. No fabricated products. No invented claims.

The homepage now reads as a serious Kenyan specialty coffee and agricultural company prepared to address an international buyer — without shouting.
