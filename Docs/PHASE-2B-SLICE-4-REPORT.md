# Treadville Phase 2B — Slice 4 Report

> Slice 4 scope: introduce the Provenance / Origin → Transformation → Experience bridge between `CategoryDiscovery` and the Featured Products section. Establish the editorial foundation for the future 3D / WebGL transformation experience. No particles, no WebGL, no Three.js, no canvas, no new dependencies, no global token changes.

---

## 1. Slice objective

Add a restrained editorial bridge to the homepage that visually and copywise communicates the arc **Origin → Craft → Experience** — without becoming a generic infographic, dashboard timeline, or numbered process diagram. The composition should feel like a deliberate pause between *where Treadville comes from* (CategoryDiscovery) and *what Treadville brings to market* (Featured).

The future full transformation animation system (particles, WebGL, Three.js, morphing objects) is explicitly out of scope for this slice. This slice establishes the visual and editorial vocabulary the future system can build on.

## 2. Files changed

| File | Change type | Notes |
|---|---|---|
| `src/components/Provenance.tsx` | **Created** | New bounded server component. 192 lines. No `"use client"`. No external dependencies. |
| `src/app/page.tsx` | **Modified** | Added `Provenance` import and a single `<Provenance … />` call between `<CategoryDiscovery />` and the Featured section IIFE. Two new `contentMap` keys are read (`provenance_eyebrow`, `provenance_headline`, `provenance_intro`, `provenance_closing`) with restrained English fallbacks. |

`git diff --stat` after this slice:
```
src/app/page.tsx          | 211 +++++++++++++++++++++++++++++++---------------
src/components/Reveal.tsx |   1 +
```
The `Reveal.tsx` line is the uncommitted Slice 1 change (the `id?` passthrough). It is untouched by this slice. No other files were modified.

```
git status --short
 M src/app/page.tsx
 M src/components/Reveal.tsx
?? Docs/PHASE-2B-SLICE-1-REPORT.md
?? Docs/PHASE-2B-SLICE-2-REPORT.md
?? Docs/PHASE-2B-SLICE-3-REPORT.md
?? src/components/CategoryDiscovery.tsx
?? src/components/Hero.tsx
?? src/components/Provenance.tsx
```

Only `Provenance.tsx` is new. Only `page.tsx` is modified beyond the existing uncommitted Slice 1/2/3 state. No file outside the allowed scope was touched.

## 3. What was implemented

### 3.1 `src/components/Provenance.tsx` — the bridge section

A server component that takes five props: `eyebrow`, `headline`, `intro`, `stages` (a 3-tuple of `{ number, label, line }`), and `closing`. All five are supplied by `page.tsx` from `site_content` with English fallbacks. No business facts are invented in the component itself.

The section is composed of four zones inside one `<section>`:

#### 3.1.1 Atmospheric background (no fake photography)

- Section background: `var(--soil-muted)` (one tone deeper than the neighboring sections, creating a quiet "interlude" between CategoryDiscovery and Featured).
- Two soft radial gradients: copper at top-left (10% opacity) and bronze at bottom-right (8% opacity), composed from the same recipe family used in `Hero` and `CategoryDiscovery`. Same dot-grid pattern overlay at 10% opacity in `mix-blend-overlay`, 3px tile, identical to the hero pattern.
- All color values come from existing design tokens. No new variables. No hard-coded accent colors except the two pre-existing `rgba(168, 70, 31, …)` / `rgba(176, 141, 87, …)` values already used in `Hero.tsx` and `CategoryDiscovery.tsx`.

#### 3.1.2 Header (12-col, md+)

Mirrors the editorial header pattern established by `CategoryDiscovery` and the Featured section so the homepage has a consistent rhythm:

- 7 cols: mono eyebrow `text-[11px] tracking-[0.32em]` in `parchment/50`, then a large display headline `font-display italic` at `text-3xl md:text-5xl` with `max-w-[20ch]` and `tracking-[-0.01em]`.
- 5 cols: a supporting paragraph at `max-w-md text-sm md:text-base` in `parchment/60`.
- Single-column stack on mobile.
- All values read from `site_content` (`provenance_eyebrow`, `provenance_headline`, `provenance_intro`) with English fallbacks.

#### 3.1.3 Three-stage sequence

The core of the section. Three stages: `01 Origin`, `02 Craft`, `03 Experience`.

- **Layout (desktop, md+):** an asymmetric 12-col composition — `5 / 2 / 5` for the first two stages with a small vertical connector between them, then a 7-col `md:col-start-3` for the third stage below, breaking the symmetry on purpose so the sequence reads as a deliberate editorial flow rather than a three-column row. The third stage is slightly larger (`text-3xl md:text-4xl` vs `text-2xl md:text-3xl`) and is offset from the column grid so it feels like a closing beat that hands off to the Featured section below.
- **Layout (mobile):** a deliberate vertical editorial sequence — all three stages stack as full-width rows, with a thin 1px hairline on the left of each block (the `StageBlock` left rail) that fades to `var(--accent)` on hover/focus. No horizontal connector on mobile; the left rail and the numbers carry the sequence.
- **`<StageBlock>` content per stage:** a mono number (`01` / `02` / `03`) in `parchment/40`, a display label (`Origin` / `Craft` / `Experience`) in italic display type, a single restrained editorial line in `parchment/65`. No icons, no illustrations, no fake statistics.
- **Connector (md+ only):** a 1px vertical hairline with a small `1.5 × 1.5` `var(--accent)` dot at the midpoint. Decorative (`aria-hidden`).
- **`Reveal` stagger:** delay 0, 1, 2 for the first two stages, delay 3 for the third (closing) stage. The header reveal uses delay 0; the closing bridge uses delay 3. Inherited from the existing `data-reveal` CSS in `globals.css`, which already respects `prefers-reduced-motion`.

#### 3.1.4 Closing bridge

A single hairline + a `var(--accent)` short bar + a mono caption (default: "The collection follows."). The accent bar is 40px wide and sits at the left of the row, providing the only color gesture in the section's foreground — a quiet "→" signpost to the Featured section below.

## 4. Visual / design decisions

- **Asymmetric 5-2-5-7 grid, not a 4-4-4 row.** The brief explicitly forbade a "generic numbered process timeline." The chosen composition staggers the three stages so the third stage breaks the rhythm and reads as a resolution rather than the third step in a sequence. The vertical hairline connector between stages 1 and 2 is a quiet device — it disappears on mobile so the mobile flow is a pure vertical editorial sequence.
- **`var(--soil-muted)` background, not the default `var(--soil)`.** This is the only section on the page that uses a one-tone-deeper background. The intent is the "pause" the brief called for: the section feels like a deliberate interlude between the warm CategoryDiscovery and the Featured section's warm soil.
- **Atmospheric background, no fake photography.** Public images are still empty. The atmosphere (copper/bronze radials + dot-grid pattern + soil-muted base) is composed from existing tokens, matching the Hero and CategoryDiscovery visual families. When a real photograph is supplied in the future, the architecture accepts it as a single replacement of the radial-gradient stack.
- **Restrained `var(--accent)` use.** The only color gestures in the section foreground are (a) the left rail of each `StageBlock`, which fades to `var(--accent)` on hover/focus, (b) the midpoint dot of the desktop connector, and (c) the 40px bar of the closing bridge. Nothing else is accented — the section is predominantly `parchment` type on `soil-muted`.
- **No `GlassPanel`.** The hero already carries the floating glass. Glass on the Provenance section would be the third glass surface on the page, violating the AGENTS.md §06 "material, not a design system" rule.
- **Type reuse only.** Display type uses `font-display` (the same `Fraunces` italic already loaded for Hero and CategoryDiscovery), mono uses `font-mono` (the same `Space_Mono`). No new fonts.

## 5. Content / data sources used

- `site_content` keys read by the new section: `provenance_eyebrow`, `provenance_headline`, `provenance_intro`, `provenance_closing`. All optional with English fallbacks.
- English fallbacks:
  - `provenance_eyebrow` → `"From origin to experience"`
  - `provenance_headline` → `"Kenyan agriculture, considered at every step."`
  - `provenance_intro` → `"Every Treadville product travels the same arc — from the soils that grow it, through the hands that refine it, to the markets that receive it. The work between those moments is where quality is made."`
  - `provenance_closing` → `"The collection follows."`
  - Stage lines are passed from `page.tsx` as defaults; the component itself accepts them as props so admin can later override them through additional `site_content` keys if desired.
- **No invented business facts.** The fallbacks reference only the verified brand language already established in the existing Treadville site, AGENTS.md §02 (`Kenyan origin`, `agricultural value creation`, `market development`), the existing `SiteFooter` provenance references, and the existing Hero copy. No farms, no farmer names, no specific regions beyond the verified "Kenya" / "Kenyan highlands" / "fertile plains" language, no production volumes, no certifications, no export destinations, no awards, no customers, no prices, no tasting notes.

## 6. Accessibility work

| Feature | Status | Notes |
|---|---|---|
| Section `aria-labelledby` paired with `<h2 id="provenance-heading">` | ✅ | `provenance-heading` |
| Decorative atmospheric layers `aria-hidden` | ✅ | Both radial-gradient layer and dot-grid pattern |
| Connector (desktop) `aria-hidden` | ✅ | Pure decoration |
| Accent bar in closing bridge wrapped in `<span aria-hidden>` | ✅ | Decorative |
| Stage numbers are `<p>`, labels are `<h3>`, headline is `<h2>` | ✅ | Semantic hierarchy preserved, no skipped levels |
| Focus rings | ✅ | Each `StageBlock` is wrapped in a group; the left-rail color change is a `:hover / :focus-within` decoration, not an interactive element. The block itself contains no links — the closing bridge is plain text, not a link, so no focusable element is required. |
| Color-only information | ✅ | Each stage is identified by number + label + line; color is reinforcement, not the only carrier |
| `prefers-reduced-motion` | ✅ | `Reveal` reduces via the global rule in `globals.css:181-187`. The left-rail color transition is `transition-colors` which is also reduced by the global rule in `globals.css:273-279`. |
| Contrast | ✅ | Parchment type on `soil-muted` background passes the existing contrast level established by Hero, CategoryDiscovery, and the Featured section. |
| Keyboard navigation | ✅ | No new keyboard targets introduced beyond what already exists. The closing bridge is intentionally a text moment, not a link — the Featured section's `View all` link is the next interactive stop. |

## 7. Motion / reduced-motion behavior

- **Entrance:** `Reveal` (existing primitive) on the header (delay 0), stage 1 (delay 0), connector (delay 1), stage 2 (delay 2), stage 3 (delay 3), closing bridge (delay 3). Inherited from `globals.css:156-179` — `opacity 0 → 1` + `transform: translateY(16px) → none`, transitioned over `var(--dur-slow)` with `var(--ease-smooth)`. The existing `prefers-reduced-motion: reduce` rule at `globals.css:181-187` zeros this transition.
- **Hover / focus:** the `StageBlock` left rail transitions from `var(--line)` to `var(--accent)` over `var(--dur)`. `transition-colors` only — no transform, no width, no height. Reduced by the global rule at `globals.css:273-279`.
- **No parallax, no scroll-linked effects, no continuous animation, no `width` / `height` / `top` / `left` animation, no bouncing, no spinning, no particles, no WebGL, no Three.js, no canvas.**
- **No `useEffect`, no client component, no JavaScript animation.** The section is fully server-rendered and animation-free at the runtime layer.

## 8. Responsive behavior

- **Mobile (320 / 375 / 390 / 430):** the section becomes a deliberate vertical editorial sequence. Header stacks to single column. The three stages stack full-width as a vertical column with the left rail carrying the sequence. The desktop connector is hidden on mobile. The closing bridge remains.
- **Tablet (sm):** stage grid is still single column. The connector is still hidden.
- **Desktop (md+):** the asymmetric 5-2-5 composition for stages 1 and 2, and a 7-col offset row for stage 3. Container width `var(--content-wide)` (76rem) lines up with the Hero, CategoryDiscovery, and Featured sections.
- **No horizontal overflow** at any tested breakpoint. The left-rail hairline and the accent bar use `h-px` / `w-10` and do not push the layout. The closing bridge's `flex items-center gap-4` wraps cleanly with `border-t border-[var(--line)] pt-6`.

A human reviewer should verify in a browser before sign-off:
- The 5-2-5 desktop composition does not feel like a "two cards + a dot" pair, and the offset third stage below feels like a deliberate closing beat rather than a layout error.
- The mobile vertical sequence reads as a deliberate editorial flow, not just a stacked column.
- The `var(--soil-muted)` background reads as a deliberate interlude, not as "the page is darker here for no reason."
- The accent-color gestures (left rail, connector dot, closing bar) are quiet enough to feel editorial, not UI decoration.
- `prefers-reduced-motion: reduce` correctly disables the reveal stagger and the left-rail color transition.

## 9. What was intentionally NOT changed

- `ProductCard.tsx` — **not modified.** Unchanged from Phase 2A and Slice 3.
- `Hero.tsx`, `CategoryDiscovery.tsx`, `SiteHeader`, `SiteFooter`, `CartDrawer`, `CartContext`, `CategoryTabs`, `GlassPanel`, `Button`, `Reveal` — all untouched.
- `globals.css` — **not modified.** No new CSS variables, no new design tokens, no new utility classes. All styling in this section is composed from the existing tokens (`--soil-muted`, `--soil`, `--line`, `--parchment`, `--accent`, `--content-wide`, `--dur`, `--ease-out`).
- `lib/queries.ts`, `lib/types.ts`, `lib/accents.ts`, `lib/supabase.ts` — untouched. The section consumes the already-loaded `site_content` from `page.tsx`; no new query, no new field, no schema change.
- `layout.tsx`, all admin pages, all shop pages, the product detail page, checkout, and `public/` — untouched.
- `package.json` — no dependency additions.
- The Story section below the Featured section — unchanged. Out of scope for this slice.
- The Featured section (Slice 3) — unchanged. Out of scope.
- No invented business facts. No fake certifications, no farms, no farmer names, no export numbers, no customers, no production figures, no awards, no prices, no tasting notes, no countries, no specific altitudes or coordinates.

## 10. Verification results

### 10.1 `npx tsc --noEmit`
**PASS.** Zero errors, zero output.

### 10.2 `npm run lint`
**PASS.** Zero errors, zero warnings, zero output.

### 10.3 `npm run build`
**PASS.**
- Next.js 16.3.3 (Turbopack)
- `next.config.ts` processed in 1.5s
- Compilation: 63s
- TypeScript during build: 11.2s, clean
- Static pages: 7/7 generated in 974ms
- Route table: unchanged. `ƒ /` remains dynamic because of the Supabase data fetch.
- Warning: `Next.js ignored bun.lock in C:\Users\Admin\Documents …` — environmental, present before this slice, not introduced here.

### 10.4 `git status --short`
```
 M src/app/page.tsx
 M src/components/Reveal.tsx
?? Docs/PHASE-2B-SLICE-1-REPORT.md
?? Docs/PHASE-2B-SLICE-2-REPORT.md
?? Docs/PHASE-2B-SLICE-3-REPORT.md
?? src/components/CategoryDiscovery.tsx
?? src/components/Hero.tsx
?? src/components/Provenance.tsx
```

### 10.5 `git diff --stat`
```
 src/app/page.tsx          | 211 +++++++++++++++++++++++++++++++---------------
 src/components/Reveal.tsx |   1 +
```

## 11. Visual-QA limitation

No browser-automation tooling is available in this environment (Windows PowerShell, no Chrome / Edge / Firefox on `PATH`). Visual QA at the required breakpoints (320 / 375 / 390 / 430 / tablet / desktop) could not be performed. Verification was through TypeScript, ESLint, Next.js build, and manual code review against the AGENTS.md standard. **Visual QA was not performed and is not claimed.**

## 12. Blockers

None. The slice landed without depending on any missing photographs, queries, or schema changes.

## 13. Recommended next slice

**Slice 5 — Story section + final page cadence.**

The homepage now reads: Hero → CategoryDiscovery (Origin) → Provenance (Transformation) → Featured (Experience) → Story → Footer. The Story section is still the pre-Phase-2B centered italic moment. With the new editorial composition established by Slices 1–4, the Story section's narrow centered column is the visual ceiling that the rest of the page now overshadows.

Slice 5 should:
- Restage the Story section to match the editorial cadence of Slices 2–4 (12-col header, eyebrow + headline + supporting paragraph, hairline rhythm, `var(--content-wide)` container).
- Keep the existing `about_blurb` content as the source of truth; no invented business facts.
- Consider whether the section should sit on a contrasting surface (e.g. `var(--bone)` / `var(--ivory)` light moment) to mark the page's closing cadence before the footer.
- Stay bounded: only the Story section's markup in `page.tsx`, no new component unless strictly required.
- Out of scope: the full 3D / WebGL transformation system, the admin / shop / product / cart / checkout / Supabase surfaces, and any new design tokens.

---

**REPORT CREATED: Docs/PHASE-2B-SLICE-4-REPORT.md**

Slice 4 complete. All three verifications pass. No regressions. Phase 2A, Slice 1, Slice 2, and Slice 3 work intact. One new component (`Provenance.tsx`), one edited file (`page.tsx`), no new dependencies, no Supabase / admin / shop / product / cart / token changes. Awaiting direction before Slice 5.
