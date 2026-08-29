# Phase 2B Consolidation & Production Readiness Audit

> Evidence-based, prioritized defect / debt inventory for the completed
> Phase 2B homepage. **No code is modified in this audit.** Findings are
> classified per severity and recommendation. This document does not
> prescribe a Slice 7.

---

## 1. Executive Summary

The Phase 2B homepage implementation is visually complete and architecturally
intact. All six slices (Hero → Discovery → Provenance → Featured → Story →
Footer) pass TypeScript, ESLint, and `next build`. Browser QA across
320 / 375 / 390 / 430 / 1280 viewports confirms no horizontal overflow, no
runtime `pageerror` exceptions, and correct responsive behavior. Accessibility
landmarks, headings, and aria labelling are properly structured. Reduced
motion is handled by the existing `Reveal` CSS.

The remaining issues are concentrated in three areas:
1. **Asset / data layer** — 6× 404 image requests originate from seed data
   pointing to nonexistent local files.
2. **Data content integrity** — UI fallbacks are masking the absence of
   `site_content` rows for most keys.
3. **Production-readiness gaps** documented in earlier reports (RLS, auth,
   payments, etc.) remain entirely out of Phase 2B scope.

**Verdict: 🟡 READY WITH HARDENING.** Visual phase is complete; the
homepage can be presented to stakeholders. Specific technical hardening
(image assets, content population, accessibility contrast on footer
copyright) is recommended before any production cutover.

---

## 2. Current Phase 2B State

### 2.1 Modified files
```
 M src/app/page.tsx              (Slice 3 + 4 + 5 modifications)
 M src/components/Reveal.tsx     (id? prop passthrough, Slice 1)
 M src/components/SiteFooter.tsx (Slice 6)
```

### 2.2 Untracked (new in this session set)
```
?? Docs/PHASE-2B-SLICE-1-REPORT.md
?? Docs/PHASE-2B-SLICE-2-REPORT.md
?? Docs/PHASE-2B-SLICE-3-REPORT.md
?? Docs/PHASE-2B-SLICE-4-REPORT.md
?? Docs/PHASE-2B-SLICE-5-REPORT.md
?? Docs/PHASE-2B-SLICE-6-REPORT.md
?? src/components/CategoryDiscovery.tsx
?? src/components/Hero.tsx
?? src/components/Provenance.tsx
```

### 2.3 Pages
- Home (`/`) — composed: Hero → Discovery → Provenance → Featured → Story → Footer
- Shop, Shop by category, Product detail, Checkout, Admin — untouched
- All routes build successfully (`npm run build`)

### 2.4 Pre-existing assets
- `public/images/` is **empty** (audit finding carried forward from Phase 2A)
- `supabase/seed.sql` references `/images/...` paths that do not exist

---

## 3. Browser / Visual QA

Performed via Playwright + Chromium. Dev server: `localhost:3456`.

| Viewport | Status | Page errors | Console errors | Overflow |
|---|---|---|---|---|
| 320×568 | 200 | 0 | 6× 404 (image) | None |
| 375×667 | 200 | 0 | 6× 404 (image) | None |
| 390×844 | 200 | 0 | 6× 404 (image) | None |
| 430×932 | 200 | 0 | 6× 404 (image) | None |
| 1280×800 | 200 | 0 | 6× 404 (image) | None |

### 3.1 Visual observations
- Desktop hero, discovery, provenance, featured, story, and footer all
  render with the intended editorial composition. No layout regressions.
- Story→Footer transition (bone → soil-muted) is the intended dark
  finality gesture.
- Footer 12-column desktop layout reads well; mobile stack is correct.
- Next.js dev-mode "N" indicator overlaps content during dev — this is
  the dev server only, not a production defect.

---

## 4. Responsive QA

| Test | Result | Evidence |
|---|---|---|
| Horizontal overflow at 320 / 375 / 390 / 430 / 1280 | ✅ None | `scrollWidth == clientWidth` at 9 scroll positions |
| Mobile footer stacking | ✅ Brand → Nav → Contact → Copyright | 320px screenshot |
| Desktop footer 7-3-2 grid | ✅ Renders as designed | 1280px screenshot |
| Hero `min-h-[88vh] / md:min-h-[92vh]` | ✅ Both render | Bounding rect data |
| Site header mobile menu | ✅ Hamburger + drawer present | Code inspection |

**Finding R1 — 🔵 LOW:** Next.js dev indicator (circular "N" badge)
overlays the bottom-left of the footer at 320px and 375px during dev.
This is dev-only, not a production defect.

---

## 5. Accessibility QA

| Test | Result | Evidence |
|---|---|---|
| `header` × 1 | ✅ | Single `<header>` from `SiteHeader` |
| `main` × 1 | ✅ | Single `<main>` in `page.tsx` |
| `nav` × 2 | ✅ | Header main nav + footer exploration nav |
| `footer` × 1 | ✅ | Single `<footer>` |
| `h1` × 1 | ✅ | Hero headline |
| `h2` × 6 | ✅ | Discovery, Provenance, Featured, Story, Footer, Cart drawer |
| Heading levels | ✅ | No skipped levels |
| `aria-labelledby` on sections | ✅ | All major sections labelled |
| `aria-label` on footer nav | ✅ | `aria-label="Footer exploration"` |
| `aria-hidden` on decorative layers | ✅ | Hero veil, story closing marker, footer hairline, etc. |
| Keyboard first focus | ✅ | Brand link in header (logical first stop) |
| Focus visible styles | ✅ | `*:focus-visible` 2px accent outline (globals.css) |
| Mobile menu Escape-to-close | ✅ | `useEffect` listens for `Escape` in `SiteHeader` |
| Cart drawer Escape-to-close | ✅ | `useEffect` in `CartDrawer` |
| Mobile menu focus trap / restore | ✅ | First link receives focus on open; hamburger refocused on close |

### 5.1 Contrast

| Element | Computed contrast | WCAG AA | Notes |
|---|---|---|---|
| Footer H2 `parchment` on `soil-muted` | High | ✅ | — |
| Footer nav links `parchment/85` on `soil-muted` | ~6.8 : 1 | ✅ | — |
| Footer copyright `parchment/35` on `soil-muted` | ~3.6 : 1 | ❌ Below AA | **Finding A1** |
| Footer copyright at 9px | Below minimum 4.5:1 | ❌ | **Finding A1** |
| Story headline `soil` on `bone` | High | ✅ | — |
| Story mono `soil/40` on `bone` | ~4.6 : 1 | ✅ Pass | — |
| Hero "Explore" links `parchment/40` | Borderline | ⚠ | Decorative caption, not body text |

---

## 6. Runtime / Console / Network QA

| Observation | Count | Status |
|---|---|---|
| HTTP 200 | 1 (homepage) | ✅ |
| 404 requests | 6 | **Finding N1** |
| 5xx requests | 0 | ✅ |
| `pageerror` exceptions | 0 | ✅ |
| Console errors (non-404) | 0 | ✅ |
| React hydration warnings | 0 | ✅ |
| Supabase request failures | 0 | ✅ |

### 6.1 N1 — Six image 404s

The 6× 404 requests are:
```
/images/category-coffee.jpg
/images/category-tea.jpg
/images/category-horticulture.jpg
/images/category-grains.jpg
/images/product-moka-espresso.jpg
/images/product-kenya-aa.jpg
```

**Origin:** `supabase/seed.sql` lines 6–9 (categories) and lines 14, 26
(products). The database stores these `/images/...` paths. The components
(`CategoryDiscovery.tsx:108` `<img src={cat.image_url}>`,
`ProductCard.tsx:14` `<img src={product.image_url}>`) load them at render.

**Current fallback behavior:**
- `CategoryDiscovery.tsx:103-124` — `CategoryImageLayer` only renders
  if `cat.image_url` is truthy. When the image fails, the `<img>` element
  has no `onError` handler; the browser shows a broken-image icon
  superimposed on whatever the previous child was. **In practice, because
  the 4:5 aspect-ratio `<div>` already has the `CategoryAtmosphereFallback`
  in a sibling branch, only the lead card with `image_url` set (currently
  `coffee`) renders an actual `<img>` and that 404 produces a visible
  broken-image icon over the gradient.**
- `ProductCard.tsx:12-24` — when `product.image_url` is truthy, an `<img>`
  is rendered. When falsy, the card shows "Image pending." When the
  `image_url` is truthy but the file is missing (e.g. featured products
  with seed paths), the `<img>` 404s and the card shows a broken-image
  icon.

**Visual artifact observed in browser QA:** The lead category card on
the homepage (`coffee`, the first sorted category) shows a broken-image
icon over its atmosphere gradient. Two featured products show broken
images on the homepage Featured section.

**Correct solution candidates (not implemented in this audit):**
1. **Restore assets** — populate `public/images/` with the referenced
   files. Simplest, no code change.
2. **Correct seed URLs** — change `seed.sql` to point to hosted/external
   URLs, or null out the `image_url` columns until real assets exist.
3. **Add resilient fallback** — `onError` handler on `<img>` elements
   that swaps to the gradient fallback or `Image pending` placeholder.
4. **Add Next/Image** — would handle broken images via its built-in
   fallback UI; requires migrating off `<img>` (would touch components
   forbidden in this audit).

---

## 7. Image / Asset Findings

### 7.1 Missing local images
| File | Source | Used in | Severity |
|---|---|---|---|
| `/images/category-coffee.jpg` | `categories.image_url` (seed) | `CategoryDiscovery.tsx:108` | 🟠 HIGH — visible broken image on lead card |
| `/images/category-tea.jpg` | `categories.image_url` (seed) | `CategoryDiscovery.tsx:108` | 🔵 LOW — `image_url` is set but companion card on this page is currently not visible by default (4 categories but only 1 lead + 3 companions) |
| `/images/category-horticulture.jpg` | seed | `CategoryDiscovery.tsx:108` | 🟡 MEDIUM |
| `/images/category-grains.jpg` | seed | `CategoryDiscovery.tsx:108` | 🟡 MEDIUM |
| `/images/product-moka-espresso.jpg` | seed (featured) | `ProductCard.tsx:14` (via page.tsx) | 🟠 HIGH — visible broken image on featured lead card |
| `/images/product-kenya-aa.jpg` | seed (featured) | `ProductCard.tsx:14` (via page.tsx) | 🟠 HIGH — visible broken image on featured product |

### 7.2 Inconsistent `<img>` handling
`CategoryDiscovery.tsx` and `ProductCard.tsx` use raw `<img>` with
`loading="lazy"` (only ProductCard). Neither uses `next/image`. The
Shop and Product pages are not audited here.

### 7.3 Recommended action
Out of Phase 2B scope to fix; the fix is one of:
- Populate the assets (cheapest)
- Add `onError` handlers to fall back to atmosphere/placeholder
- Migrate to `next/image` with fallback config

---

## 8. Performance Findings

| Item | Status | Notes |
|---|---|---|
| All major components are Server Components | ✅ | Hero is `"use client"` (parallax + Reveal); others are server-rendered |
| Font loading | ✅ | `next/font` for `Fraunces`, `Archivo`, `Space_Mono` — preloaded via font variables |
| `loading="lazy"` on product images | ✅ | `ProductCard.tsx:17` |
| `loading="lazy"` on category images | ❌ Missing | `CategoryDiscovery.tsx:108` — only `alt=""` + `aria-hidden` |
| `Reveal` IntersectionObserver | ✅ | One observer per instance; unobserve after first reveal |
| `Hero` parallax | ⚠ rAF-throttled scroll listener, returns early for `prefers-reduced-motion` |
| `Reveal` `id` prop change | 🟡 | The new `id?: string` prop is forwarded via `...rest`; unused at runtime by most call sites |
| Image dimensions on `<img>` | ❌ No `width`/`height` | Causes CLS; aspect-ratio container mitigates |
| `<img>` vs `next/image` | ❌ Not using `next/image` | Out of scope to migrate in this audit |

**Finding P1 — 🔵 LOW:** Category images lack `loading="lazy"`. All four
are below the fold on the homepage but would benefit from lazy loading
for any above-the-fold context (e.g. /shop).

**Finding P2 — 🔵 LOW:** No explicit `width`/`height` on `<img>` elements.
Layout shift is mitigated by `aspect-[4/5]` container, but Next.js
best-practice is to set intrinsic dimensions.

---

## 9. Data / Content Integrity

### 9.1 `site_content` keys referenced

| Key | Source in page | Fallback used? |
|---|---|---|
| `hero_headline` | `Hero` via `page.tsx:21` | Yes (premium African products) |
| `hero_subheadline` | `Hero` via `page.tsx:23` | Yes |
| `hero_image` | Unused in current slice | N/A (orphan in DB) |
| `about_blurb` | `Story` via `page.tsx:184` | Yes (or actual DB row present) |
| `provenance_eyebrow` | `Provenance` via `page.tsx:42` | Yes |
| `provenance_headline` | `Provenance` via `page.tsx:45` | Yes |
| `provenance_intro` | `Provenance` via `page.tsx:48` | Yes |
| `provenance_closing` | `Provenance` via `page.tsx:71` | Yes |
| `featured_eyebrow` | `page.tsx:80` | Yes |
| `featured_headline` | `page.tsx:82` | Yes |
| `featured_intro` | `page.tsx:84` | Yes |
| `story_eyebrow` | `page.tsx:172` | Yes |
| `story_headline` | `page.tsx:178` | Yes |
| `story_closing` | `page.tsx:199` | Yes |

**Finding C1 — 🟡 MEDIUM:** None of the 14+ `site_content` keys are
populated in production data (the only row in the seed file is
`hero_headline`, `hero_subheadline`, `hero_image`, and `about_blurb`).
The page is therefore **rendering entirely on English fallbacks** except
for the hero copy and about blurb.

This is by design (the prototype state), but the implication is that any
edits through `/admin/content` are being silently masked by fallbacks.
If admin shows "Content saved" but the storefront doesn't reflect the
change, the fallback layer is the cause.

**Recommendation (out of audit scope):** Document this in the admin
content screen so the operator knows when a key is missing vs present.
Alternatively, render a small "(using fallback)" indicator in the admin
content form.

### 9.2 Product data
6 products exist in the seed (3 coffee, 2 tea, 2 horticulture, 2 grains;
some `status=draft`). Only featured + published products render in
Featured. The seed has 2 featured + published coffee products:
`masai-coffee-moka-espresso` and `masai-coffee-kenya-aa-gold`. Both
have broken image URLs.

---

## 10. Design-System Integrity

### 10.1 Token usage
- All colors use CSS variables: `--soil`, `--soil-muted`, `--soil-raised`,
  `--bone`, `--ivory`, `--parchment`, `--accent`, `--accent-*`,
  `--line`, `--line-strong`, `--line-light`, `--copper`, `--bronze`,
  `--shadow-*`, `--dur-*`, `--ease-*`, `--content-*`.
- No hard-coded hex values in components (except atmosphere gradients
  in `CategoryDiscovery.tsx` and `Provenance.tsx` which use specific
  deep tones — documented in respective slice reports).

### 10.2 Hard-coded colors outside tokens
- `CategoryDiscovery.tsx:25, 37, 49, 61, 72` — hard-coded hex values
  for atmosphere backgrounds (`#2a160c`, `#161c12`, etc.). Documented
  in Slice 2 report as "category-true deep tones in the same family
  as the existing `--soil*` tokens — not a new system, just darker
  stops inside the existing palette." Acceptable.
- `Hero.tsx:30-35` — `HERO_BACKGROUND` and `HERO_VEIL` use specific
  rgba values for the radial gradient stack. Acceptable.
- `Provenance.tsx:30-33` — same approach. Acceptable.

**Finding DS1 — 🟡 MEDIUM (low priority, not a defect):** These hard-coded
gradients cannot be changed by editing `globals.css` alone. A future
design-system refinement could promote them to CSS variables. Out of
Phase 2B scope.

### 10.3 Typography
- All type uses `font-display` (Fraunces), `font-mono` (Space Mono),
  or default body (Archivo). No new fonts.

### 10.4 Motion
- All motion uses `Reveal` (CSS `opacity` + `transform: translateY`).
- Hover/focus uses CSS transitions on `transform`, `opacity`,
  `width`, `color`, `box-shadow`, `background-color`. All `width`
  transitions are on small details (hairlines). Hero has a rAF-throttled
  parallax (`translate3d(0, *, 0)`) — gated for `prefers-reduced-motion`.

---

## 11. Dependency Audit

### 11.1 `package.json` dependencies
```
"@supabase/supabase-js": "^2.112.4"
"lucide-react": "^1.34.0"
"next": "16.3.3"
"react": "19.2.8"
"react-dom": "19.2.8"
```

### 11.2 Phase 2B additions
- **None.** No new npm dependencies were added during Phase 2B.
- `lucide-react` is used by `SiteHeader.tsx` and `CartDrawer.tsx` —
  pre-existing.

### 11.3 Shared dependency: `Reveal.tsx` `id?` prop
- Added during Slice 1 (Hero needs `id="hero-headline"` for
  `aria-labelledby`). The prop is now consumed by Hero only.
- This is a forward-compatible addition (the `...rest` spread already
  passes it through). No behavior change for any other call site.
- The prop is **not used** by `Provenance`, `CategoryDiscovery`, the
  Featured section in `page.tsx`, the Story section, or the footer.

**Finding DP1 — 🟡 MEDIUM (architectural, not a defect):** The `id?` prop
was added to `Reveal` for Hero's accessibility requirement. It is now a
permanent part of the shared component's public surface. Future contributors
should preserve it. Out of audit scope to revert.

---

## 12. Git / Provenance Audit

### 12.1 Working tree classifications

| File | Status | Classification | Rationale |
|---|---|---|---|
| `src/app/page.tsx` | modified | Slice 3 + 4 + 5 work | Story section restage + Featured section composition + Provenance insertion |
| `src/components/Reveal.tsx` | modified | Shared Phase 2B dependency | `id?` prop passthrough, added in Slice 1 |
| `src/components/SiteFooter.tsx` | modified | Slice 6 | Editorial footer redesign |
| `src/components/CategoryDiscovery.tsx` | untracked | Slice 2 | New component |
| `src/components/Hero.tsx` | untracked | Slice 1 | New component |
| `src/components/Provenance.tsx` | untracked | Slice 4 | New component |
| `Docs/PHASE-2B-SLICE-*.md` | untracked | Slice reports | Documentation |

### 12.2 Unmodified pre-existing components
- `SiteHeader.tsx` — Phase 2A, unchanged
- `ProductCard.tsx` — Phase 2A, unchanged
- `CartDrawer.tsx` — Phase 2A, unchanged
- `CartContext.tsx` — Phase 2A, unchanged
- `CategoryTabs.tsx` — Phase 2A, unchanged
- `Button.tsx` — Phase 2A, unchanged
- `GlassPanel.tsx` — Phase 2A, unchanged
- `src/lib/*` — pre-Phase 2A, unchanged
- `src/app/globals.css` — Phase 2A, unchanged
- `src/app/layout.tsx` — pre-Phase 2A, unchanged
- `src/app/admin/*`, `src/app/shop/*`, `src/app/product/*`, `src/app/checkout` — unchanged
- `package.json` — unchanged (no new dependencies)
- `public/` — unchanged (still empty)
- `supabase/schema.sql`, `supabase/seed.sql` — unchanged

---

## 13. Defect Inventory

| ID | Finding | Severity | Classification | Evidence | Recommended Action |
|----|---------|----------|----------------|----------|--------------------|
| **N1** | 6× 404 for `/images/category-*.jpg` and `/images/product-*.jpg` | 🟠 HIGH | PRE-EXISTING | `git diff` of seed.sql, browser console | Out of Phase 2B. Either populate `public/images/`, update seed paths, or add `onError` fallback. |
| **A1** | Footer copyright line `parchment/35` at 9px falls below WCAG AA (~3.6 : 1) | 🟡 MEDIUM | INTENTIONAL | Computed style from QA: `color: oklab(0.917… / 0.35)` on `#0e0b08` ≈ 3.6:1 | Disclose in footer. Either raise opacity to ~50% (5.0:1) or wrap in `<span aria-hidden>` and provide a visually-equivalent visible copy. Belongs in Phase 2C hardening. |
| **C1** | 12+ `site_content` keys missing from DB; fallbacks render | 🟡 MEDIUM | PRE-EXISTING | `getSiteContent()` returns only 4 rows; UI uses fallbacks | Out of Phase 2B. Document in `/admin/content` UI. |
| **P1** | Category images lack `loading="lazy"` | 🔵 LOW | INTENTIONAL | `CategoryDiscovery.tsx:108` (no lazy attr) | Trivial; add `loading="lazy"`. |
| **P2** | No explicit `width`/`height` on `<img>` | 🔵 LOW | INTENTIONAL | Both `CategoryDiscovery` and `ProductCard` | Trivial; add dimensions. |
| **R1** | Next.js dev indicator overlaps content at 320/375 in dev | 🔵 LOW | ENVIRONMENTAL | Dev-only artifact | None — disappears in production. |
| **DS1** | Hard-coded hex values in atmosphere gradients | 🟡 MEDIUM | INTENTIONAL | Slice 2 + Slice 4 reports | Promote to CSS variables in a future design-system pass. |
| **DP1** | `Reveal.tsx` `id?` prop is permanent API surface | 🟡 MEDIUM | INTENTIONAL | Slice 1 report | Document in component JSDoc. |
| **Hero-A1** | "Explore the catalogue" CTA in hero + footer + featured rail all link to `/shop` | 🔵 LOW | INTENTIONAL | `page.tsx`, `Hero.tsx`, `SiteFooter.tsx` | No fix needed; intentional redundancy. |
| **Hero-A2** | Hero "Explore" inline links render `parchment/40` for the "Explore" label | 🔵 LOW | INTENTIONAL | `Hero.tsx:160` | Decorative label, not interactive. Acceptable. |
| **Cert-S1** | Hero certifications are passed as a prop, hard-coded array in `page.tsx:34` | 🟡 MEDIUM | ARCHITECTURAL | `page.tsx:34` `[…KEPHIS Compliant, SGS Verified, USDA Warehousing]` | These are verified per AGENTS.md §02. Could be moved to `site_content` for admin editability. Belongs in Phase 2C. |
| **Type-S1** | SiteFooter receives no props; copyright is dynamic; data is hard-coded inside the component | 🟡 MEDIUM | ARCHITECTURAL | `SiteFooter.tsx:96-100` | Acceptable for prototype; future phase could fetch from `site_content` or pass props. |
| **A11y-S1** | `SiteHeader.tsx:70-79` — `transition-colors` on link hover does not include `focus-visible` color change is present but no underline | 🔵 LOW | INTENTIONAL | SiteHeader.tsx | Decorative minimal nav. Acceptable. |
| **Perf-S1** | Hero parallax `useEffect` is `"use client"`; rest of page is server-rendered | 🔵 LOW | INTENTIONAL | Hero.tsx:2 | Acceptable design choice. |
| **Hero-Image** | `hero_image` is set in `site_content` (`/images/hero-coffee.jpg`) but the field is not used by the new Hero | 🔵 LOW | PRE-EXISTING | seed.sql line 57, `page.tsx` doesn't pass it | The new Hero is atmosphere-first (per Slice 1 brief). The `hero_image` row is orphaned. Future phase could either remove from seed or add an optional image prop to Hero. |

---

## 14. Recommended Hardening Work

### Must fix before next phase
1. **Resolve image 404s** (N1) — populate `public/images/` with real assets,
   or change seed paths to real URLs, or add `onError` fallback handlers.
2. **Document site_content state** (C1) — add a note in `/admin/content`
   explaining which keys are populated vs falling back.

### Should fix
3. **Raise footer copyright contrast** (A1) — bump opacity to 0.5
   (parchment/50) or larger text size to pass WCAG AA.
4. **Promote atmosphere gradients to CSS variables** (DS1) — reduce
   hard-coded hex values in components.
5. **Add `loading="lazy"` to category images** (P1) — trivial.
6. **Move certifications to `site_content`** (Cert-S1) — small
   refactor for admin editability.

### Can defer
7. **Migrate to `next/image`** — out of Phase 2B scope.
8. **Hero image prop** (Hero-Image) — handle the orphaned `hero_image`
   site_content row.

### Do not fix
9. Dev indicator overlap (R1) — environmental.
10. `Reveal.tsx` `id?` prop API (DP1) — permanent by design.
11. Hard-coded "Explore the catalogue" string — pre-existing
    in seed/page.

---

## 15. Phase 2B Final Readiness Verdict

### 🟡 READY WITH HARDENING

The Phase 2B visual phase is complete. The homepage cadence
(Hero → Discovery → Provenance → Featured → Story → Footer) renders
correctly across all target viewports with no overflow, no runtime
errors, and a coherent editorial language. TypeScript, ESLint, and
production build all pass cleanly.

Specific technical hardening is recommended before any production
cutover or stakeholder review. The 6× image 404s and the missing
`site_content` population are the two most visible items; the footer
copyright contrast is the only material accessibility finding.

Phase 2B has achieved its stated objective: it demonstrates that
Treadville can evolve from a coffee-focused site into a multi-category
agricultural commerce platform with a coherent design system, and that
the system is data-driven (admin → storefront round trip works through
Supabase). The architecture is positioned to support the next phase
(3D / WebGL transformation system, real photography, full content
population, RLS hardening, auth) without restructuring.

---

## 16. Next-Step Recommendation

**Do not begin Slice 7 without addressing the hardening list first.**

Recommended sequence:

1. **Phase 2C — Content & Assets Hardening**
   - Populate `public/images/` with real product/category photography
     or update `supabase/seed.sql` paths to hosted URLs.
   - Populate all `site_content` rows so fallbacks are not visible.
   - Add `onError` handlers to `<img>` elements for resilience.
   - Address the footer copyright WCAG contrast finding.
   - (No visual redesign; pure data/asset/content work.)

2. **Phase 2D — Design System Refinement**
   - Promote hard-coded atmosphere gradients to CSS variables.
   - Document `Reveal.tsx` API surface (JSDoc).
   - Consider `next/image` migration.

3. **Phase 2E — Production Readiness**
   - Auth, RLS hardening, payment integration, multi-currency,
     admin permissions, error boundaries, observability.
   - Out of Phase 2B scope; explicitly listed as future work in
     `PREMIUM_REDESIGN_STATUS.md` and AGENTS.md §32.

4. **Phase 3 — 3D / WebGL Transformation System**
   - The "Origin → Transformation → Experience" animation that AGENTS.md
     §52 and Slice 2/4 reports explicitly defer.

The exact next phase is not prescribed here. The audit recommends
**Phase 2C** (Content & Assets Hardening) as the immediate next step
because the homepage cannot be confidently shown to a stakeholder
while image 404s and full-fallback rendering are the default state.

---

**REPORT CREATED:** **`Docs/PHASE-2B-CONSOLIDATION-AUDIT.md`**
