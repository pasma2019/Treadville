# PHASE 15 — VISUAL AUDIT

**Date:** September 4, 2026
**Scope:** Phase 15 pre-modification audit
**Repository:** treadville prototype

---

# Executive Summary

The Phase 14 implementation successfully established the correct direction: SVG chapter visuals removed, hero is static, category cards use real photography, brown gradients removed from homepage, typography hierarchy begun. Phase 15 is a refinement pass — addressing remaining visual resolution issues: hero overlay weight, spacing consistency, typography sizing precision, and selective color refinements.

---

# 1. CURRENT STATE ASSESSMENT

## 1.1 What's Working (Keep)

- **Hero composition:** Static hero, headline + supporting + CTA, no carousel. Correct direction.
- **Category cards:** Real Supabase photography, no decorative SVGs, no atmosphere gradients. Correct.
- **Typography hierarchy:** Four registers established (display / section / body / metadata). Hero fluid scale from 2.75rem to 8rem. Body at 16-18px.
- **Color system:** Charcoal dark surfaces, ivory light surfaces, sage accent. No `rgba(168, 70, 31)` brown on homepage.
- **Spacing rhythm:** `py-20 md:py-28` established as a standard rhythm.
- **Provenance:** Dark charcoal section, photography at `opacity-30`. Correct approach.
- **Journal:** Charcoal background, photography-dominant cards. Correct approach.
- **Masai purge:** Verified clean — zero references in any public route.

## 1.2 Issues to Fix

### P0 — Hero Overlay (Visual Resolution)

The hero photograph is being washed out by two overlapping cream gradients:

1. **Full-screen scrim** (Phase 14): `linear-gradient(180deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.35) 30%, rgba(245,239,226,0.55) 100%)` — applies across the entire image at 35-55% cream opacity.

2. **Left column scrim** (Phase 14): `linear-gradient(90deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.0) 100%)` — despite the class saying `inset-y-0 left-0 right-1/2`, the CSS gradient geometry extends beyond the intended half-width, causing the cream to apply across the full image on all viewports where it's rendered.

**Result:** The photograph appears muted, washed-out, more like a textured background than a premium campaign image.

**Fix needed:** Keep only one localized gradient — the text-column scrim — at reduced opacity (0.30-0.35). Remove the full-screen scrim.

### P1 — Provenance Section Spacing

- `mt-20` → `mt-12` before the data points grid — too much gap between the closing line and the data section.

### P1 — Story Stats Section Spacing

- `mt-20` → `mt-16` before the story closing rule — slightly tightens the editorial rhythm.

### P2 — Button Labels

- "A conversation, not a checkout." — correct and premium.
- "Explore the collection" — good.
- "Export enquiries" — good.
- "Explore coffee / tea / horticulture / grains" — slightly long; "Explore [category]" is cleaner.

### P2 — Typography Sizing

- `text-sm` used 46 times across the homepage — most are appropriate (body copy, descriptions) but some should be `text-base`.
- `text-xs` used 4 times — all in footer/mobile nav. Appropriate.
- No `text-[9px]` in homepage content (verified). Appropriate.
- Labels at `text-[11px]` with `tracking-[0.32em]` — appropriate editorial standard.

### P2 — Hero Text Column Width

- `max-w-[56rem]` for the hero text column — on a `min-h-[88svh]` hero, this might be too wide, pushing the text right and leaving less room for the photograph to breathe on the left.

### P3 — SiteFooter Label Contrast

- Footer labels use `rgba(236,227,206,0.45)` — WCAG AA at 11px. Might fail on dark background. Consider `rgba(236,227,206,0.55)` for safety.

---

# 2. TYPOGRAPHY AUDIT

## 2.1 Current Scale

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Hero H1 | `text-[2.75rem]` → `xl:text-[8rem]` | unchanged | ✓ Good |
| Hero supporting | `text-base md:text-lg` | unchanged | ✓ Good |
| Hero eyebrow | `text-[11px]` | unchanged | ✓ Good (11px floor) |
| Section heading | `text-3xl md:text-5xl lg:text-[4.5rem]` | unchanged | ✓ Good |
| Body | `text-base leading-relaxed` | unchanged | ✓ Good |
| Metadata/eyebrow | `text-[11px] tracking-[0.32em]` | unchanged | ✓ Good |
| Stats | `clamp(3.5rem, 8vw+0.5rem, 8rem)` | unchanged | ✓ Good |
| Stat labels | `label-on-light` = 11px | unchanged | ✓ Good |
| Footnote/legal | `text-[9px]` | unchanged | ✓ Appropriate |

## 2.2 Typography Issues

- **46× `text-sm`:** Most appropriate (category descriptions, journal excerpts, stage descriptions, enquiry notes). Some could upgrade to `text-base md:text-lg` but it's not critical.
- **Provenance data labels:** `text-sm leading-snug` is readable but could use `text-base leading-normal` for data.
- **Category card body:** `text-sm leading-relaxed` on companion cards — appropriate given card width.

---

# 3. COLOR AUDIT

## 3.1 Homepage Color Usage

| Token | Usage | Assessment |
|-------|-------|------------|
| `--soil-muted` `#0e0e0c` | Provenance, Journal, mobile nav background | ✓ Charcoal — correct |
| `--parchment` `#e9deca` | Text on dark surfaces | ✓ Appropriate |
| `--ivory` `#f5efe2` | Text on dark surfaces | ✓ Appropriate |
| `--warm-white` `#fbf8f1` | Light surfaces | ✓ Clean |
| `--bone` `#efe7d4` | Category section background | ✓ Appropriate |
| `--accent-sage` `#7a9e7a` | Accent — hero, Provenance, journal | ✓ Restrained |
| `rgba(168,70,31,...)` | **Not in homepage** | ✓ Clean (Phase 14) |
| `#6b3a1c` | **Not in homepage** | ✓ Clean (Phase 14) |

## 3.2 Remaining Brown References

All in `ProductCard.tsx` `ProductIdentity` — only visible for products without images (not currently used on homepage). These are category-specific atmospheric gradients for placeholder states. Not a homepage issue.

## 3.3 Contrast Issues

- Footer label: `rgba(236,227,206,0.45)` at 11px on `--ink` `#16140f` — borderline AA. Should be `rgba(236,227,206,0.55)`.
- Provenance body: `rgba(236,227,206,0.70)` — comfortable. OK.
- Journal body: `rgba(236,227,206,0.72)` — comfortable. OK.

---

# 4. SPACING AUDIT

## 4.1 Homepage Vertical Rhythm

| Section | Current | Assessment |
|---------|---------|-----------|
| Hero | `min-h-[88svh]` | ✓ Tightened from 100svh |
| Hero → Category | Single editorial rule `py-5` | ✓ Continuous feel |
| Category | `py-20 md:py-28` | ✓ Standard rhythm |
| Category → Provenance | `border-b` (implicit) | ✓ Connected |
| Provenance | `py-24 md:py-32` | ✓ Slightly heavier — intentional contrast |
| Provenance closing → data | `mt-20` | ⚠ Too large — should be `mt-12` |
| Provenance data → footer | `mt-28` | ✓ Appropriate |
| Journal | `py-20 md:py-28` | ✓ Standard rhythm |
| "The collection" rule | `py-5` | ✓ Tight and purposeful |
| Story | `py-20 md:py-28` | ✓ Tightened from 24/36 |
| Story heading → body | `mt-6` | ✓ Appropriate |
| Story stats | `mt-12` | ✓ Appropriate |
| Story stats → closing | `mt-20 md:mt-28` | ⚠ Could be `mt-16 md:mt-24` |
| Enquiry | `py-24 md:py-36` | ⚠ Could be `py-20 md:py-28` to match rhythm |

## 4.2 Spacing Summary

- **Good:** Hero-to-category gap is tight and intentional. Category, Story at standard rhythm. Journal at standard rhythm.
- **Needs refinement:** Provenance closing → data gap. Story stats → closing gap. Enquiry section padding.

---

# 5. COMPONENT AUDIT

## 5.1 HeroSlideshow

**Working:** Static composition, no carousel, no SVG, clear hierarchy.

**Issue:** Hero image has two overlapping cream overlays (full-screen scrim + left-column scrim). Combined weight washes out the photograph.

**Current scrim approach:**
```css
/* Full-width gradient (0.35–0.55 cream) */
background: linear-gradient(180deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.35) 30%, rgba(245,239,226,0.55) 100%)

/* Left-half gradient (0.55 cream) */
background: linear-gradient(90deg, rgba(245,239,226,0.55) 0%, rgba(245,239,226,0.0) 100%)
```

**Fix:** Keep only the text-column scrim at reduced opacity. Remove the full-screen gradient.

## 5.2 CategoryDiscovery

**Working:** Real photography, no SVGs, no atmosphere gradients, clean typography.

**Issue:** Lead card eyebrow "Specialty Kenyan Arabica" is `text-[11px]` with category accent color — appropriate. No issues found.

**Note:** Category photography uses `object-cover` — the image fills the card. This is correct. No changes needed.

## 5.3 Provenance

**Working:** Dark charcoal background, photography at `opacity-30`, sage accent, restrained typography.

**Issues:**
1. `mt-20` before data points — too large.
2. Stage block body copy: `text-sm md:text-base` — could be `text-base` across all breakpoints for better readability.

## 5.4 JournalPreview

**Working:** Charcoal background, photography-dominant, editorial card treatment.

**Issues:** None found. 3-column grid is good for desktop, stacks on mobile.

## 5.5 SiteHeader

**Working:** Sticky navigation with scroll-aware transparency, active state underline.

**Note:** "Kenya" tag at `text-[9px]` in masthead — appropriate for persistent chrome. Not homepage content.

## 5.6 SiteFooter

**Working:** Multi-column editorial footer with brand statement, navigation, contact, newsletter.

**Issue:** Label contrast `rgba(236,227,206,0.45)` at 11px on dark background — borderline WCAG AA. Should be `rgba(236,227,206,0.55)`.

## 5.7 ProductCard

**Working:** Used on shop/product pages (not homepage hero).

**Note:** `ProductIdentity` fallback gradients include category browns — but these are placeholder states only visible when `!product.image_url`. Not currently triggered on homepage.

---

# 6. RESPONSIVE AUDIT

## 6.1 Hero

- `min-h-[88svh]` — scales with viewport. Good.
- Fluid typography from 2.75rem → 8rem. Good.
- `text-balance` applied to headline. Good.
- Left scrim `hidden md:block` — mobile gets vertical scrim only. Good.

## 6.2 Category Section

- `grid-cols-1 md:grid-cols-12` with lead at `md:col-span-7`. Good.
- Companion cards at `sm:grid-cols-2 md:grid-cols-1`. Good.

## 6.3 Journal

- `grid-cols-1 md:grid-cols-3`. Good for editorial layout.

## 6.4 Story/Enquiry

- `md:grid-cols-12` with 5/7 and 7/5 splits. Good.

---

# 7. ACCESSIBILITY AUDIT

- **Contrast:** Footer labels at `rgba(236,227,206,0.45)` — borderline. Fix to 0.55.
- **Headings:** Single H1 (`hero-headline`), semantic heading hierarchy maintained. ✓
- **Focus states:** `focus-visible:ring-2` on all interactive elements. ✓
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` applied to all animations. ✓
- **Keyboard navigation:** SiteHeader has full keyboard handling with Escape, focus trap, focus restoration. ✓
- **ARIA labels:** Descriptive on category cards, nav, CTAs. ✓
- **Alt text:** `alt=""` on decorative images, `alt={product.name}` on product images. ✓

---

# 8. GRADIENT AUDIT

| Gradient | Location | Purpose | Assessment |
|----------|----------|---------|------------|
| `--atmosphere-hero` | Hero background | Atmospheric warmth | ✓ Appropriate |
| `rgba(245,239,226,0.35-0.55)` | Hero image scrim | Text readability | ⚠ Too heavy — fix |
| `rgba(245,239,226,0.55)` | Hero left scrim | Text column readability | ⚠ Too heavy — fix |
| `rgba(14,14,12,0.30-0.55)` | Provenance image scrim | Photo/text separation | ✓ Appropriate |
| `var(--soil-muted)` solid | Provenance background | Charcoal surface | ✓ Correct |
| `var(--soil-muted)` solid | Journal background | Charcoal surface | ✓ Correct |
| None | Category cards | Photo only | ✓ Correct (Phase 14) |

---

# 9. VISUAL QUALITY SELF-ASSESSMENT (15 Questions)

1. **Does the hero photograph feel expensive?** — ⚠ No — too washed out by cream overlays.
2. **Can every important piece of text be read immediately?** — ✓ Yes.
3. **Does the typography feel editorial?** — ✓ Yes — clear hierarchy, restrained labels.
4. **Does the site feel light and premium?** — ✓ Yes — ivory/bone/charcoal palette is working.
5. **Does the color system feel natural rather than "coffee brown"?** — ✓ Yes — charcoal and sage, no brown on homepage.
6. **Is whitespace intentional?** — ⚠ Mostly — Provenance/data gap too large.
7. **Does photography dominate decorative UI?** — ✓ Yes.
8. **Does the site feel Kenyan without falling into clichés?** — ✓ Yes.
9. **Does it feel suitable for an international export company?** — ✓ Yes.
10. **Does mobile look deliberately designed?** — ✓ Yes — responsive grid works.
11. **Does anything still look AI-generated or template-like?** — ⚠ Hero washed-out feel could read as "faded template".
12. **Is anything visually competing unnecessarily with the photography?** — ⚠ Hero cream scrim.
13. **Are there any remaining gradients that do not have a clear purpose?** — ⚠ Hero full-screen scrim.
14. **Are there any tiny labels that should be larger?** — ✓ No — 11px floor established.
15. **Are there any sections that feel disconnected?** — ⚠ Story/Enquiry sections slightly disconnected from editorial rhythm.

---

# 10. FILES REQUIRING MODIFICATION

| File | Change |
|------|--------|
| `src/components/HeroSlideshow.tsx` | Reduce hero scrim opacity; remove full-screen gradient |
| `src/components/Provenance.tsx` | Reduce `mt-20` → `mt-12` before data section |
| `src/components/SiteFooter.tsx` | Increase footer label contrast `0.45` → `0.55` |
| `src/app/page.tsx` | Reduce story closing rule gap; tighten enquiry padding |

---

# 11. PRE-MODIFICATION STATUS

| Check | Status |
|-------|--------|
| All homepage components read | ✓ |
| Production build passing | ✓ |
| Server running (port 3461) | ✓ |
| HTML inspected for typography sizes | ✓ |
| HTML inspected for brown gradients | ✓ |
| HTML inspected for spacing | ✓ |
| Responsive patterns checked | ✓ |
| Accessibility patterns checked | ✓ |
| Visual quality 15-question assessment | ⚠ 5 items need fixing |

**Ready for modification.**
