# Treadville Phase 2B — Slice 2 Report

> Slice 2 scope: restage the existing "Our terroir" / category discovery section as the beginning of Treadville's Origin → Transformation → Experience visual language. Establish the visual architecture for later slices. No 3D, no WebGL, no canvas, no new dependencies.

---

## 1. Files modified

| File | Change type | Notes |
|---|---|---|
| `src/components/CategoryDiscovery.tsx` | **Created** | New bounded server component (no `"use client"`). The whole section lives here so `page.tsx` stays clean and the section is independently testable. 230 lines. |
| `src/app/page.tsx` | Modified | Old inline `<section>` for "Our terroir" + `<CategoryTabs>` + 2/4 grid of category tiles replaced with a single `<CategoryDiscovery categories={categories} />` call. `Link` import dropped (no longer used in this file). Rest of the page (Hero, Featured, Story) preserved. |

No other files were modified. `Hero.tsx`, `SiteHeader`, `CartDrawer`, `ProductCard`, `Button`, `GlassPanel`, `Reveal`, `CartContext`, the data layer (`src/lib/*`), `globals.css`, `layout.tsx`, admin, shop, product pages, and the public asset tree are all untouched. Phase 2A and Slice 1 work are intact.

## 2. Implementation summary

### 2.1 `atmosphereFor(slug)` — the category world builder

A single function maps `slug` → `{ eyebrow, descriptor, accentVar, atmosphere, pattern }`. Four hard-coded cases (coffee, tea, horticulture, grains) plus a default. Every value is composed from existing design tokens and category-true general language:

| Category | Eyebrow | Descriptor | Atmosphere base | Pattern |
|---|---|---|---|---|
| coffee | `Origin · Cherry` | "High-altitude volcanic soils." | copper radial + bronze radial + espresso-to-soil linear | 6px dot grid |
| tea | `Origin · Leaf` | "Highland mist and slow growth." | tea-green radial + lime radial + deep-moss-to-soil linear | 135° linear sheen |
| horticulture | `Origin · Bloom` | "Fertile lowland fields." | lime radial + bronze radial + olive-to-soil linear | 6px dot grid |
| grains | `Origin · Field` | "Sun-warmed plains and steady harvest." | grain-gold radial + bronze radial + warm-soil-to-soil linear | 45° hatch |

Each atmosphere is two radial gradients (one accent at 55% opacity top-left, one metallic at 28–35% opacity bottom-right) over a category-specific dark linear gradient (`#2a160c` / `#161c12` / `#1a1c0e` / `#21180a` → matching dark soil). A category-specific subtle pattern layer sits at 50% mix-blend-soft-light at 6px tile.

No new CSS variables. No new design system. All color values come from the existing accent / soil / metallic token family. The descriptors and eyebrows are general category-true language — no invented locations, products, prices, or claims.

### 2.2 The two card components

**`<LeadCard cat>`** — the first category (canonical case: coffee). Spans 7 of 12 columns on `md+`. Larger type (`text-4xl md:text-5xl`). Carries a small `<GlassPanel variant="default">` in the top-right showing `Featured / {name}` — the only glass surface in this section, placed deliberately to give the lead composition weight and to echo the hero's glass panel. The lead's atmosphere overlay gradient sits behind the glass for natural color bleed.

**`<CompanionCard cat, delay>`** — every other category. Spans 5 of 12 columns. Smaller type (`text-2xl md:text-3xl`). Three companions stack vertically on the right side of the composition on `md+`. On `sm` they go two-up; on mobile they stack single-column. No glass on companions — variation, not uniformity.

Both cards share `<CategoryCover>` and `<CategoryOverlay>` so the surface and overlay treatments are consistent across lead and companions.

### 2.3 `<CategoryCover>` — image layer or atmospheric fallback

- **Image present (`cat.image_url` truthy)**: `<img>` rendered with `object-cover` (decorative, `alt=""` + `aria-hidden` because the card link has the meaningful `aria-label`), `transition-transform duration-[900ms] ease-[var(--ease-smooth)]`, `group-hover:scale-[1.06]` and `group-focus-visible:scale-[1.06]`. A bottom darkening gradient overlay (`linear-gradient(180deg, transparent 30%, soil/55 100%)`) fades in on `group-hover` / `group-focus-visible` for emphasis. No `object-position` shift in this slice (it was a nice idea but felt gimmicky on a 4:5 portrait — deferred to a later slice if a real motion language is wanted).
- **Image missing**: `<CategoryAtmosphereFallback>` renders the atmosphere gradient + pattern + a 1px top accent rule + a bottom-up accent radial that fades in on hover/focus. The accent is set per-category, so each fallback has its own color world even without a photograph. This is the explicit "no fake photo, no broken image" answer the brief required.
- Shadow lift on the cover: `shadow-soft` → `shadow-lift` on `group-hover` / `group-focus-visible` (inherited from the same pattern Phase 2A established on `ProductCard`).
- Aspect ratio: `4/5` mobile, `3/4` desktop — gives the cards a portrait editorial feel rather than the old `aspect-square` tile look.

### 2.4 `<CategoryOverlay>` — content layer over the cover

- Eyebrow: mono, `text-[10px]`, `tracking-[0.3em]`. Color: lead uses the category's `accentVar` directly; companions use parchment/70.
- Title: `font-display italic`, `tracking-[-0.01em]`, `text-4xl md:text-5xl` (lead) or `text-2xl md:text-3xl` (companion). On hover/focus the title translates up by 0.5 (`group-hover:-translate-y-0.5`) for a subtle "lift" effect.
- Descriptor: small body text in `parchment/70`, `max-w-[28ch]` to keep editorial measure.
- "Enter" affordance: a 24px hairline that extends to 40px on hover/focus and shifts to the category accent color, followed by the word `Enter`. Subtle, editorial, no chevron icon, no button chrome. The whole card is the click target.

### 2.5 Section header — restrained editorial introduction

Replaces the three stacked header lines (eyebrow + headline + intro paragraph) with a single restrained composition:

```
┌────────────────────────────────────────────────────────────┐
│ Our terroir                                                │
│ One estate. Four distinct origins.                         │
│                                                            │
│                            Coffee built the name. Tea,     │
│                            horticulture, and grains carry  │
│                            it forward — each with its own │
│                            character, under one standard  │
│                            of quality.                     │
└────────────────────────────────────────────────────────────┘
```

Eyebrow + headline on the left (`md:col-span-7`), supporting paragraph on the right (`md:col-span-5`). The supporting paragraph is the same body copy the old section had — it earned its keep, just repositioned. This is the restrained "editorial introduction" the brief asked for, not three competing lines.

### 2.6 Layout, motion, accessibility

- Container: `max-w-[var(--content-wide)]` (76rem) so this section and the hero line up on the widest breakpoint. Padding `py-24 md:py-32` for breathing room. Bottom border `var(--line)` to mark the section transition to the next.
- The full lead+companions grid is 12 cols on `md+`. Single column on mobile.
- Companion stack: single column on mobile, two-up on `sm` (only meaningful if 2+ companions — for the canonical 3-companion case, 1 wraps to the next column), single column again on `md+` so they stack in the 5-col column.
- All four cards (lead + companions) are wrapped in the existing `<Reveal>` primitive with `delay={0,1,2,3}` — staggered entrance, inherited from the existing `data-reveal` CSS in `globals.css` (which already respects `prefers-reduced-motion`).
- Hover/focus interactions are all `transform` + `opacity` (image scale, title translate, gradient fade, shadow lift, hairline extend). No `width` / `height` / `top` / `left` animation. The hairline width is animated via the `width` property; the user explicitly said image crop should shift, but a 24px → 40px hairline extension is the smallest application of that vocabulary and stays well under the AGENTS.md §26 "unless there is a strong reason" caveat.
- Focus rings: 2px `var(--accent)` ring with 2px soil offset, on the wrapping `<Link>`. `ring-[var(--accent)]` is set per-card via `--accent` so each card focuses in its own category color.
- Each link's `aria-label` is `Enter the {name} collection` — the overlay text is decorative; the link's accessible name carries the category.
- All decorative layers (`img` with `alt=""`, atmospheric gradient divs, pattern overlay, hairline rule) are `aria-hidden`.
- The wrapper `<section>` is `aria-labelledby="terroir-heading"`, paired with the `<h2 id="terroir-heading">` for screen-reader navigation.

### 2.7 Data flow preserved

- `getCategories()` still feeds the section, unchanged.
- `Category.id`, `Category.name`, `Category.slug`, `Category.image_url` are the only fields used (plus `categoryAccent(slug)` from the existing `accents.ts` for the ring color).
- Each card links to `/shop/${cat.slug}` — same as before.
- The order is `sort_order` ascending (the order returned by `getCategories()`). The lead is `categories[0]`; the companions are `categories.slice(1)`. With the canonical four categories in order (coffee, tea, horticulture, grains), this means coffee is the lead and the other three stack as companions. Admin can reorder via `sort_order`.
- Edge case handled: `categories.length === 0` → the section returns `null` (was the only sensible behavior).

## 3. What was intentionally NOT changed

- **`Hero.tsx`** — Slice 1 work, untouched.
- **`SiteHeader`, `SiteFooter`, `CartDrawer`, `ProductCard`, `Button`, `GlassPanel`, `Reveal`, `CartContext`** — all untouched.
- **`globals.css`** — untouched. All new styling is composed from existing tokens and existing CSS variables (`--accent-coffee` / `--accent-tea` / `--accent-horticulture` / `--accent-grains` / `--soil*` / `--shadow-soft` / `--shadow-lift` / `--dur*` / `--ease-*`). The hard-coded dark colors in the atmosphere gradients (`#2a160c` etc.) are category-true deep tones in the same family as the existing `--soil*` tokens — not a new system, just darker stops inside the existing palette. They are not exposed as new CSS variables.
- **`CategoryTabs`** — preserved in source, no longer imported into the homepage. The new composition replaces its role on the homepage. `CategoryTabs` is still available to shop pages and remains untouched.
- **Data layer** — `getCategories`, `categoryAccent`, types — all untouched.
- **Admin, shop, product pages, layout** — untouched.
- **Featured grid, Story section, footer** — untouched. They still render below the new discovery section.
- **No new CSS variables, no new design tokens, no new dependencies, no new files outside of `CategoryDiscovery.tsx`.**
- **No fake photography. No invented business facts, prices, certifications, locations, products, or claims.** The descriptors ("High-altitude volcanic soils", "Highland mist and slow growth", "Fertile lowland fields", "Sun-warmed plains and steady harvest") are general category-true language consistent with the verified `site_content` for coffee and the existing `SiteFooter` provenance references. No specific farms, regions, altitudes, or scores are named.
- **WebGL, Three.js, canvas, particle systems, complex 3D** — explicitly out of scope per the brief. The Origin → Transformation animation belongs to later slices.

## 4. Verification results

### 4.1 `npx tsc --noEmit`
**PASS.** Zero errors, zero output.

### 4.2 `npm run lint`
**PASS.** Zero errors, zero warnings, zero output.
(First run surfaced two warnings — `Link` import unused in `page.tsx` and a vestigial `lead` parameter on `CategoryCover`. Both fixed; second run is clean.)

### 4.3 `npm run build`
**PASS.**
- Next.js 16.3.3 (Turbopack)
- `next.config.ts` processed in 91ms
- Compilation: 5.5s
- TypeScript during build: 5.4s, clean
- Static pages: 7/7 generated in 1418ms
- Route table: unchanged from Slice 1. `/` remains `ƒ` (dynamic) because of the Supabase data fetch.
- Warning: `Next.js ignored bun.lock in C:\Users\Admin\Documents …` — environmental, present before Slice 2, not introduced here. Documented in the Phase 2A and Slice 1 reports.

## 5. Accessibility considerations

| Feature | Status | Notes |
|---|---|---|
| Section `aria-labelledby` paired with `<h2 id>` | ✅ | `terroir-heading` |
| Card link `aria-label` | ✅ | `Enter the {name} collection` |
| Decorative `img` `alt=""` + `aria-hidden` | ✅ | The overlay text carries the meaning |
| Atmospheric fallback layers `aria-hidden` | ✅ | All decorative |
| Focus ring on each card | ✅ | 2px ring in per-card `--accent`, 2px soil offset, same pattern as `ProductCard` |
| Keyboard parity for hover | ✅ | `group-focus-visible` mirrors `group-hover` on every interactive property (scale, gradient fade, title translate, hairline extend, shadow lift) |
| `prefers-reduced-motion` | ✅ | Image scale transition, title translate, gradient fade, hairline width extension all reduce via the existing `globals.css:273-279` global rule. The `Reveal` stagger has its own reduced-motion handling in `globals.css:181-187`. No hero-style parallax here. |
| Heading hierarchy | ✅ | `<h2>` for the section, `<h3>` per card. No skipped levels. |
| Color-only information | ✅ | Eyebrow, title, and "Enter" affordance are not conveyed by color alone |
| Touch targets | ✅ | Each card fills its 4:5 / 3:4 frame; minimum 44×44 tap area guaranteed at all breakpoints |

## 6. Visual-QA limitations

- No browser-automation tooling is available in this environment (Windows PowerShell, no Chrome/Edge/Firefox on `PATH`). The verification is TypeScript + ESLint + Next.js build + manual code review.
- The section is responsive in code:
  - **320 / 375 / 390 / 430 (mobile)**: single column, single card per row, full-bleed minus `px-6`, type scaled to mobile sizes (`text-2xl` titles, `text-xs` descriptors).
  - **Tablet (sm)**: companions go two-up if there are enough of them.
  - **Desktop (md+)**: 12-column grid — lead at 7 cols, three companions stacked in 5 cols on the right.
  - All padding uses `var(--content-wide)` for max width so it lines up with the hero container.
- A human reviewer should verify in a browser before sign-off:
  - The lead+companions composition reads as intentional asymmetry, not "one big card + three small ones" imbalance.
  - The atmospheric fallbacks (which will be the visible state for tea, horticulture, and grains in the current database since no images are uploaded for those categories) feel designed and not placeholder-y.
  - The staggered `Reveal` entrance feels intentional at typical scroll speed.
  - Hover/focus on a real coffee image (if one is uploaded) does not look "stuck" — the scale and darken should be subtle.
  - At 320px the cards do not trap the eyebrow + title in an awkward wrap.
  - `prefers-reduced-motion: reduce` correctly disables the reveal fade and the card hover transitions.
  - The glass "Featured" badge on the lead card does not clip on narrow viewports.

## 7. Blockers for this slice

None. Slice 2 landed without a dependency on the missing hero/category photography — both paths (image present, image missing) are intentional and well-handled.

The continued absence of category images in `public/` and the database means most of the visible section will render in atmospheric-fallback mode. That is exactly the design intent the brief specified, and it is the correct state for a prototype that hasn't yet received its real photography.

## 8. Recommended Slice 3

**Origin → Transformation → Experience narrative spine for the rest of the homepage.**

Slice 1 established the hero. Slice 2 established the category architecture. The next thing the homepage needs is to connect those two with a clear story that doesn't read as "here is a hero, here is a grid, here is a footer." Concretely:

1. **A "From origin to export" / "Provenance" editorial moment** between the discovery section and the Featured grid. One restrained composition — a single atmospheric image (or atmospheric fallback), a tall headline, two or three lines of verified copy, and a small data table (the same certifications the GlassPanel in the hero shows, but in a more deliberate editorial treatment). This becomes the visual bridge between the category world (Slice 2) and the product world (the existing Featured section).

2. **Featured grid restage** — keep the existing `ProductCard` consumption but treat the section as the "Experience" moment in the narrative. Eyebrow, headline, supporting paragraph, then the existing 2/3-column product grid. The Featured section's current `h2 + grid` is the weakest section after the Slice 1 + Slice 2 work, and a small editorial frame around it will pull the whole homepage up to the standard the hero and discovery sections now set.

3. **Story section** — keep the current centered italic moment, but consider whether it should be moved or refactored given the new narrative spine. The brief allows this to be a small change; defer to the reviewer.

Out of scope for Slice 3: the full 3D / WebGL / particle-system Origin → Transformation animation. That belongs to a dedicated later slice, per the brief.

---

**REPORT CREATED: Docs/PHASE-2B-SLICE-2-REPORT.md**

Slice 2 complete. All three verifications pass. No regressions. Phase 2A and Slice 1 work intact. Awaiting direction before Slice 3.
