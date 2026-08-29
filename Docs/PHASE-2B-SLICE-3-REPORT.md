# Treadville Phase 2B — Slice 3 Report

> Slice 3 scope: restage the homepage Featured Products section as a premium editorial collection. Reuse the existing `ProductCard` exactly as-is. No new components, no new dependencies, no admin / shop / product / cart / Supabase / token changes.

---

## 1. Files changed

| File | Change type | Notes |
|---|---|---|
| `src/app/page.tsx` | **Modified** | Featured section restaged in-place. No new files. No other files modified. |

`git diff --stat` after this slice:
```
src/app/page.tsx          | 177 ++++++++++++++++++++++++++++------------------
src/components/Reveal.tsx |   1 +
```
The `Reveal.tsx` line is the existing uncommitted change from Slice 1 (the `id?` passthrough). It is untouched by this slice.

The only file changed by Slice 3 is `src/app/page.tsx`.

## 2. What was implemented

The previous Featured section was a `max-w-6xl px-6 pb-20` wrapper with a bare `<h2>Featured</h2>` and a flat `2 → 2/3` column grid of `ProductCard`. It is replaced with a section that has the same cadence as Slice 2's `CategoryDiscovery` so the homepage now reads as a deliberate editorial composition rather than a hero / grid / story stack.

### 2.1 Editorial header (eyebrow + headline + supporting paragraph)

Mirrors the header pattern from `CategoryDiscovery`:
- `max-w-[var(--content-wide)]` (76rem) container, the same width as the hero and the discovery section, so the page's horizontal rail now lines up.
- 12-col grid on `md+`: 7 cols for the eyebrow + headline, 5 cols for the supporting paragraph. Single column on mobile.
- Mono eyebrow: `text-[11px] tracking-[0.32em]` in `parchment/50`.
- Display headline: `font-display italic` at `text-3xl md:text-5xl` with `max-w-[18ch]` and `tracking-[-0.01em]`.
- Supporting paragraph: `max-w-md text-sm md:text-base` in `parchment/60`.
- All three values are read from `site_content` (`featured_eyebrow`, `featured_headline`, `featured_intro`) with English fallbacks. The fallbacks are general category-true language — no invented prices, origins, claims, or products.

### 2.2 Lead + supporting composition

The existing `ProductCard` is reused **with no prop changes**. The asymmetry is achieved by composing the grid in `page.tsx`:

- **Lead** = `featured[0]`, placed in a 7-of-12 column on `lg+` (`lg:col-span-7`). Its visual weight is greater purely by virtue of column span — the lead's `ProductCard` is the existing 4:5 portrait, no new variant, no new sizing. A small mono caption `Lead · {CategoryName}` sits absolutely-positioned at the top-left of the lead card (decoration, `pointer-events-none`, hidden on mobile). The lead's category name is read from the existing `categories` data already loaded by `getCategories()` — no new query, no schema touch.
- **Supporting** = `featured.slice(1)`, placed in a 5-of-12 column on `lg+` (`lg:col-span-5`). Inside that column the supporting products stack vertically on `lg+` (`lg:grid-cols-1`), and on `sm` they go two-up (`sm:grid-cols-2`). On mobile they stack single-column. Each supporting card carries its own small mono caption `{CategoryName}` at the top-left, so the editorial section reads as "Lead · {category}" + a column of `{category} · {category} · {category}" — a quiet editorial device rather than identical cards in a grid.
- The category name overlays are plain text in `parchment/50`, the same opacity the CategoryDiscovery eyebrow uses for companions. They sit on the existing image area of `ProductCard` and do not interfere with the card's link or focus ring. The captions are `pointer-events-none` so the entire card remains the click target and the keyboard focus area.

### 2.3 Closing beat (CTA rail)

Below the lead + supporting grid, a single hairline-bordered row provides the section's closing beat:
- Left: mono caption `The full collection` in `parchment/40`.
- Right: a hand-rolled editorial `Link` to `/shop` (`View all`) with a 24px → 40px hairline that extends on hover/focus and shifts to `var(--accent)`. Same hairline-extend vocabulary used in the hero's category strip and the CategoryDiscovery "Enter" affordance, so the editorial vocabulary stays consistent.
- Border-top `var(--line)`, padded `pt-6`. No `Button` / `ButtonLink` use here — the gesture is editorial link, not button chrome. The ghost variant of `Button` is available for future use if a more button-like affordance is wanted; this slice kept it to the existing hairline vocabulary.

### 2.4 Section container

- `border-b border-[var(--line)]` to mark the transition into the existing Story section.
- `px-6 py-24 md:py-32` so the vertical rhythm matches the CategoryDiscovery section.
- `aria-labelledby="featured-heading"` paired with the `<h2 id="featured-heading">` for screen-reader navigation.

### 2.5 Data flow preserved

- `getCategories()` already runs at the top of the function (unchanged). A `Map<string, Category>` is built from it in the same render pass to look up a product's category by `product.category_id` — the field is already on the `Product` type and already returned by `getFeaturedProducts()`. No new query, no schema change, no Supabase change, no env change.
- The English fallbacks are deliberately general. No invented product names, prices, origins, certifications, or claims.
- If `featured` is empty, the section is not rendered (existing behavior preserved exactly).

### 2.6 Interaction

- No new motion was introduced in this section. The existing `ProductCard` handles its own hover / focus / scale / shadow-lift behavior. The CTA rail's hairline extend uses `transform` / `opacity` / `width` and inherits the existing `globals.css:273-279` global reduced-motion rule that zeros all transition durations.
- The category-name overlays on the cards are `pointer-events-none`, so they do not interfere with hover / focus on the underlying card.
- All focus rings come from the existing `ProductCard` `focus-visible:ring-2 focus-visible:ring-[var(--accent)]` styling.

## 3. What was intentionally NOT changed

- `ProductCard.tsx` — **not modified.** Reused as-is. The brief explicitly forbade a second `ProductCard`, a `ProductCard` variant, or a compatibility change for aesthetic reasons. None was needed.
- `Hero.tsx`, `CategoryDiscovery.tsx`, `SiteHeader`, `SiteFooter`, `CartDrawer`, `CartContext`, `CategoryTabs`, `Reveal`, `GlassPanel`, `Button` — all untouched. Slice 1 and Slice 2 work remains exactly as committed in those files.
- `globals.css` — untouched. No new CSS variables, no new design tokens, no new utility classes. All styling in this section is composed from the existing tokens (`--line`, `--parchment`, `--soil`, `--accent`, `--content-wide`, `--dur-fast`, `--dur`, `--ease-out`).
- `lib/queries.ts`, `lib/types.ts`, `lib/accents.ts`, `lib/supabase.ts` — untouched. The category lookup is a `Map` built in the same render pass from the already-fetched `getCategories()` result. No new query function.
- `layout.tsx`, all admin pages, all shop pages, the product detail page, checkout, and `public/` — untouched.
- `package.json` — no dependency additions.
- The Story section below the Featured section — unchanged. The "Provenance" bridge section recommended in the previous inspection report is out of scope for this slice (the brief explicitly bounded Slice 3 to the Featured section only).
- No invented business facts, prices, origins, certifications, farmer names, tasting notes, awards, stock quantities, export destinations, or production figures. All copy is either from `site_content` with an English fallback drawn from general category-true language, or pulled directly from the existing product / category data already in the database.

## 4. Verification results

### 4.1 `npx tsc --noEmit`
**PASS.** Zero errors, zero output.

### 4.2 `npm run lint`
**PASS.** Zero errors, zero warnings, zero output.
(First invocation timed out at 120s due to environment startup; re-run with a longer timeout completed cleanly.)

### 4.3 `npm run build`
**PASS.**
- Next.js 16.3.3 (Turbopack)
- `next.config.ts` processed in 1.6s
- Compilation: 75s
- TypeScript during build: 6.1s, clean
- Static pages: 7/7 generated in 2.4s
- Route table: unchanged. `ƒ /` remains dynamic because of the Supabase data fetch.
- Warning: `Next.js ignored bun.lock in C:\Users\Admin\Documents …` — environmental, present before this slice, not introduced here. Documented in the Phase 2A and Slice 1 / Slice 2 reports.

### 4.4 `git status --short`
```
 M src/app/page.tsx
 M src/components/Reveal.tsx
?? Docs/PHASE-2B-SLICE-1-REPORT.md
?? Docs/PHASE-2B-SLICE-2-REPORT.md
?? src/components/CategoryDiscovery.tsx
?? src/components/Hero.tsx
```
Only `src/app/page.tsx` is modified by this slice. All other entries are the existing uncommitted state from Slices 1 and 2. No file outside the allowed scope was touched.

## 5. Visual-QA limitation

No browser-automation tooling is available in this environment (Windows PowerShell, no Chrome / Edge / Firefox on `PATH`). Visual QA at the required breakpoints (320 / 375 / 390 / 430 / tablet / desktop) could not be performed. Verification was through TypeScript, ESLint, Next.js build, and manual code review against the AGENTS.md standard.

A human reviewer should verify in a browser before sign-off:
- The lead + supporting composition reads as intentional asymmetry, not "one big card + smaller cards" imbalance, particularly when only one or two featured products are present.
- The `Lead · {CategoryName}` and `{CategoryName}` overlays do not collide visually with the product image or the price / `Request quote` line at the bottom of `ProductCard`.
- At 320 / 375 / 390 / 430 the lead + supporting grid stacks cleanly and the category-name overlays (hidden on mobile) do not flash or shift on resize.
- The CTA rail's `View all` hairline extension reads as a deliberate gesture at the section's closing beat.
- `prefers-reduced-motion: reduce` correctly disables the CTA rail's hairline width extension.

## 6. Blockers

None. The slice landed without depending on missing hero / category / product photography — the existing `ProductCard` already handles the image-present and image-missing cases (it renders `Image pending` for products without `image_url`).

## 7. Recommended next slice

**Slice 4 — the "From origin to export" / Provenance editorial bridge between `<CategoryDiscovery>` and the Featured section.**

The page now reads: Hero → CategoryDiscovery (Origin) → Featured (Experience) → Story → Footer. The transformation middle — the visual bridge that explains how a Treadville product gets from a Kenyan farm to the customer — is still missing. That belongs to Slice 4.

Slice 4 should:
- Introduce a single restrained editorial section between `CategoryDiscovery` and the Featured section. Atmospheric (no fake photography), composed from existing tokens, the same `Reveal` primitive, and a 12-col composition that mirrors the editorial header pattern this slice established.
- Reuse the four verified certifications already shown in the hero's glass panel, in a more deliberate editorial treatment (a small data table or a single hairline-bordered row, not a new glass surface).
- Stay data-driven through `site_content` for headline / subheadline / body, with English fallbacks drawn from already-verified brand language.
- Out of scope for Slice 4: the full 3D / WebGL / particle-system Origin → Transformation animation, and the Story-section refactor. Both belong to later dedicated slices.

---

**REPORT CREATED: Docs/PHASE-2B-SLICE-3-REPORT.md**

Slice 3 complete. All three verifications pass. No regressions. Phase 2A, Slice 1, and Slice 2 work intact. No new files, no new components, no new dependencies, no Supabase / admin / shop / product / cart / token changes. The existing `ProductCard` is reused as-is. Awaiting direction before Slice 4.
