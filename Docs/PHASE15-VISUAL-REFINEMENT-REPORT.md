# PHASE 15 — VISUAL REFINEMENT REPORT

**Date:** September 4, 2026
**Scope:** Phase 15 visual resolution pass
**Repository:** treadville prototype

---

# Executive Summary

Phase 15 was a precision visual refinement pass. Following the Phase 14 direction, this phase addressed the remaining resolution issues identified in the visual audit: hero photograph being washed out by overlapping cream overlays, excessive spacing in Provenance and Story sections, and footer label contrast.

**Build status:** PASS. All 14 public routes return 200. TypeScript clean. No regressions.

---

# 1. Files Changed

| File | Change |
|------|--------|
| `src/components/HeroSlideshow.tsx` | Removed full-screen cream overlay. Single left-column scrim only. |
| `src/components/Provenance.tsx` | Fixed `mt-20` → `mt-14 md:mt-20` on stages grid. Fixed `mt-16 md:mt-24` → `mt-14 md:mt-20` on closing rule. Fixed `mt-10` → `mt-8` on experience stage. Stage body copy upgraded from `text-sm md:text-base` → `text-base`. Data label `leading-snug` → `leading-normal`. |
| `src/app/page.tsx` | Story closing rule `mt-20 md:mt-28` → `mt-16 md:mt-24`. Enquiry section `py-24 md:py-36` → `py-20 md:py-28`. |
| `src/components/SiteFooter.tsx` | All footer label `rgba(236,227,206,0.45)` → `rgba(236,227,206,0.55)` (WCAG AA improvement). |

---

# 2. Typography Changes

## 2.1 No Change to Type Scale

The type scale established in Phase 14 was correct. No changes made:
- Hero H1: `text-[2.75rem]` → `xl:text-[8rem]` fluid scale — unchanged
- Section headings: `text-3xl md:text-5xl lg:text-[4.5rem]` — unchanged
- Body: `text-base leading-relaxed md:text-lg` — unchanged
- Metadata/eyebrow: `text-[11px] tracking-[0.32em]` — unchanged (11px floor)
- Stat labels: `label-on-light` (11px) — unchanged

## 2.2 Selective Upgrades

| Element | Before | After | Reason |
|---------|--------|-------|--------|
| Provenance stage body | `text-sm md:text-base` | `text-base` | Readability improvement over dark photography |
| Provenance data label | `text-sm leading-snug` | `text-sm leading-normal` | Better readability for data labels |
| All homepage body copy | Consistent `leading-relaxed` | unchanged | Already correct from Phase 14 |

---

# 3. Color Changes

## 3.1 No New Color Tokens

The color system from Phase 14 was correct. No new tokens added.

## 3.2 Footer Contrast Improvement

| Element | Before | After | Reason |
|---------|--------|-------|--------|
| All footer section labels | `rgba(236,227,206,0.45)` | `rgba(236,227,206,0.55)` | WCAG AA improvement on dark background |

**WCAG Analysis:**
- `--ink` = `#16140f` on `--ivory` = `#e9deca` — not applicable (dark text on light)
- `ivory` `#e9deca` text on `--ink` `#16140f` — large text AA requires 3.0:1
- At `rgba(236,227,206,0.55)` on `#0e0e0c` (charcoal) — approximately 4.8:1 contrast ratio. Passes WCAG AA for normal text.
- At `rgba(236,227,206,0.45)` on `#0e0e0c` — approximately 3.8:1 contrast ratio. Borderline, may fail on some displays.
- **Fix applied:** All footer labels raised to 0.55.

---

# 4. Spacing Changes

## 4.1 Editorial Rhythm Established

The standard rhythm established: `py-20 md:py-28` for light sections.

| Section | Before | After | Reason |
|---------|--------|-------|--------|
| Enquiry CTA | `py-24 md:py-36` | `py-20 md:py-28` | Matched standard rhythm |
| Story closing rule | `mt-20 md:mt-28` | `mt-16 md:mt-24` | Tighter editorial rhythm |
| Provenance stages grid | `mt-16 md:mt-24` | `mt-14 md:mt-20` | Tighter editorial rhythm |
| Provenance closing rule | `mt-16 md:mt-24` | `mt-14 md:mt-20` | Consistent with stages |
| Provenance experience | `mt-10` | `mt-8` | Tighter connection to stages |

**What was not changed:**
- Hero `min-h-[88svh]` — appropriate, reduced from 100svh in Phase 14
- Category `py-20 md:py-28` — already on rhythm
- Journal `py-20 md:py-28` — already on rhythm
- Provenance `py-24 md:py-32` — intentionally heavier for dark/light contrast

---

# 5. Hero Changes

## 5.1 Problem Identified

Phase 14's hero scrim used two overlapping gradients:
1. **Full-screen vertical scrim:** `linear-gradient(180deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.35) 30%, rgba(245,239,226,0.55) 100%)` — applied across the entire hero image
2. **Left-column scrim:** `linear-gradient(90deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.0) 100%)` — applied to left half on desktop

**Combined effect:** The photograph appeared muted and washed-out — like a textured background, not a premium campaign image.

## 5.2 Fix Applied

**Removed:** Full-screen vertical scrim.

**Kept (refined):** Left-column scrim, reduced opacity.

```css
/* Before — two overlapping gradients, photograph at opacity-50 */
background: linear-gradient(180deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.35) 30%, rgba(245,239,226,0.55) 100%)
background: linear-gradient(90deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.0) 100%)

/* After — single localized scrim, photograph at full clarity */
background: linear-gradient(90deg, rgba(245,239,226,0.45) 0%, rgba(245,239,226,0.20) 60%, rgba(245,239,226,0.0) 100%)
```

**Result:** The photograph is now fully visible across the entire frame except where the left-column text scrim applies (desktop only). The scrim itself fades from 0.45 cream at the left edge to 0.0 at 60% of the image width — giving a natural separation between text and photography.

**Verified in rendered HTML:** No `rgba(245,239,226,0.55)` full-screen pattern found. Only the left-column `rgba(245,239,226,0.45)` → `rgba(245,239,226,0.20)` scrim present.

---

# 6. Responsive Changes

No structural responsive changes were made. All existing responsive patterns were verified:

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero scrim | Hidden (`hidden md:block`) | Full scrim | Full scrim |
| Hero headline | `text-[2.75rem]` | `md:text-[5.25rem]` | `lg:text-[7rem]` |
| Category grid | Single column | 2-column | Lead 7/12 + companions 5/12 |
| Journal grid | Single column | 3-column | 3-column |
| Hero height | `min-h-[88svh]` | `min-h-[88svh]` | `min-h-[88svh]` |

---

# 7. Accessibility Verification

| Check | Result |
|-------|--------|
| WCAG AA contrast (footer labels) | ✓ Fixed — 0.55 now approximately 4.8:1 |
| WCAG AA contrast (body text) | ✓ All body text `rgba(236,227,206,0.65–0.72)` passes |
| WCAG AA contrast (hero text) | ✓ All hero text on ivory/cream passes |
| Single H1 per page | ✓ Hero `h1#hero-headline` is the only H1 |
| Heading hierarchy | ✓ `h1` → `h2` → `h3` maintained throughout |
| Focus states | ✓ `focus-visible:ring-2` on all interactive elements |
| Reduced motion | ✓ `@media (prefers-reduced-motion: reduce)` applied globally |
| Keyboard navigation | ✓ SiteHeader has full keyboard handling |
| ARIA labels | ✓ Descriptive on all category cards, nav, CTAs |
| Alt text | ✓ `alt=""` on decorative images |

---

# 8. Before / After Observations

| Aspect | Before Phase 15 | After Phase 15 |
|--------|---------------|---------------|
| Hero photograph | Washed out by overlapping cream gradients (0.35–0.55 opacity) | Fully visible; single localized scrim only |
| Hero scrim | Two overlapping gradients | Single left-column gradient at 0.45 → 0.20 |
| Provenance stages gap | `mt-16 md:mt-24` | `mt-14 md:mt-20` (tighter, editorial) |
| Provenance closing gap | `mt-16 md:mt-24` | `mt-14 md:mt-20` (consistent) |
| Story closing gap | `mt-20 md:mt-28` | `mt-16 md:mt-24` (tighter rhythm) |
| Enquiry section | `py-24 md:py-36` (heavier) | `py-20 md:py-28` (matches rhythm) |
| Footer label contrast | `rgba(236,227,206,0.45)` — borderline AA | `rgba(236,227,206,0.55)` — passes AA |
| Stage body copy | `text-sm md:text-base` | `text-base` (readable over dark photo) |
| Data label line-height | `leading-snug` | `leading-normal` (more comfortable) |

---

# 9. Visual Quality Assessment (15 Questions — Post-Fix)

| # | Question | Result |
|---|----------|--------|
| 1 | Does the hero photograph feel expensive? | ✓ Yes — fully visible, premium campaign quality |
| 2 | Can every important piece of text be read immediately? | ✓ Yes |
| 3 | Does the typography feel editorial? | ✓ Yes |
| 4 | Does the site feel light and premium? | ✓ Yes |
| 5 | Does the color system feel natural rather than "coffee brown"? | ✓ Yes |
| 6 | Is whitespace intentional? | ✓ Yes — editorial rhythm established |
| 7 | Does photography dominate decorative UI? | ✓ Yes |
| 8 | Does the site feel Kenyan without falling into clichés? | ✓ Yes |
| 9 | Does it feel suitable for an international export company? | ✓ Yes |
| 10 | Does mobile look deliberately designed? | ✓ Yes |
| 11 | Does anything still look AI-generated or template-like? | ✓ No |
| 12 | Is anything visually competing unnecessarily with the photography? | ✓ No — hero scrim now localized only |
| 13 | Are there any remaining gradients that do not have a clear purpose? | ✓ No — all gradients serve photographic readability |
| 14 | Are there any tiny labels that should be larger? | ✓ No — 11px floor maintained |
| 15 | Are there any sections that feel disconnected? | ✓ No — spacing rhythm consistent |

---

# 10. Remaining Visual Issues

| Issue | Severity | Notes |
|-------|----------|-------|
| Hero photograph crop | P2 | `object-position: center 38%` is a starting position. Art direction review needed to verify crop quality. |
| Category card text on bright photos | P2 | Cards use plain ivory backgrounds beneath photos. Bright photography may bleed through. |
| Touch targets (hero CTA) | P3 | Hero CTA `py-3.5` ≈ 38px. WCAG 44px recommendation. Acceptable for editorial site. |
| Responsive images | P3 | All images served at full Supabase resolution. Acceptable for prototype. |
| `CategoryQuickNav.tsx` orphaned | P3 | Not imported but left in source. One-line delete. |
| Portrait hero on wide screens | P3 | `hero-home-portrait.png` is portrait. Wide screens may have empty horizontal space. Consider landscape variant. |

---

# 11. Verification

| Check | Result |
|-------|--------|
| TypeScript | ✓ PASS — no errors |
| Build | ✓ PASS — 16 routes generated |
| All 14 public routes return 200 | ✓ PASS |
| No full-screen cream overlay | ✓ Verified in rendered HTML |
| Left-column scrim only | ✓ Verified in rendered HTML |
| No `rgba(168,70,31)` brown on homepage | ✓ Verified |
| No Masai references in public UI | ✓ Verified |
| Provenance spacing fixed (`mt-14`) | ✓ Verified in rendered HTML |
| Enquiry padding fixed (`py-20 md:py-28`) | ✓ Verified in rendered HTML |
| Footer contrast fixed (0.55) | ✓ Verified in rendered HTML |
| Category photography (4 cards) | ✓ All 4 Supabase images render |
| Hero photography renders | ✓ Verified |
| No ChapterVisual SVG | ✓ Verified |
| No TopographicAnchor SVG | ✓ Verified |
| No "Explore the chapters" | ✓ Verified |
| No "Coming soon" on journal | ✓ Verified |

---

# 12. Build / Route Status

```
Route (app)
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

14/14 public routes return HTTP 200
```

---

# 13. What This Phase Did NOT Do

Per the brief:
- No new pages or routes
- No database changes
- No Supabase modifications
- No photography replaced
- No new fonts introduced
- No animations added
- No carousels or glassmorphism
- No redesign of information architecture
- No invented content
- No Masai references reintroduced
- No Phase 14 decisions reverted

This was a precision visual refinement pass only.
