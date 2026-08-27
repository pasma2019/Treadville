# Treadville Premium Visual Redesign Audit

> Comprehensive audit of the Treadville prototype — pre-redesign baseline plus
> Phase 1 architecture/design-foundation work as of this session.
>
> This report records **findings only**. It distinguishes problems that existed
> **before** the audit from problems **introduced during** the audit. It does not
> hide failed or incomplete tests. No code changes are implied by this document.

---

## 1. Executive Summary

The Treadville prototype is a functional, data-driven storefront built on
Next.js 16.3.3, React 19.2.8, Tailwind CSS v4, and Supabase. Its core
architecture (centralized data layer, server-rendered pages, admin that drives the
storefront) is sound. Pre-redesign, the site is **visually generic** — uniform
section layouts, border-heavy cards, a flat hero, no motion, no glassmorphism,
minimal hover behavior.

A Phase 1 design foundation (design tokens, glass material, motion primitive,
Button, centralized accents) was started and **landed in the working tree
uncommitted and unverified**. The working tree contains **two known TypeScript
errors** that block the build (see §6). The data-driven header loop is
**incomplete**: `SiteHeader` now requires a `categories` prop, but `layout.tsx`
was never updated to supply it.

**The current working tree does NOT pass `npx tsc --noEmit` and has not had a
successful `npm run build`.** Phase 2 (visual redesign) must NOT begin until the
"Definition of Done" in §15 is met.

---

## 2. Current Implementation Audit

### Files and components inspected

| File | Purpose | Status |
|---|---|---|
| `src/app/layout.tsx` | Root layout, fonts, providers | ⚠️ Has the primary wiring gap |
| `src/app/page.tsx` | Homepage (hero, categories, featured, story) | Original baseline; flat; broken hero fallback |
| `src/app/shop/page.tsx` | Shop all | Uniform layout pattern |
| `src/app/shop/[category]/page.tsx` | Category page | Uniform layout pattern |
| `src/app/product/[slug]/page.tsx` | Product detail (server shell) | Plain two-column; hardcoded "Single origin" |
| `src/app/product/[slug]/ProductDetailClient.tsx` | Qty stepper + add-to-order | Basic; no motion/glass |
| `src/app/checkout/page.tsx` | Checkout concept | Flat; no payment |
| `src/components/SiteHeader.tsx` | Header | Refactored to require `categories` (unwired) |
| `src/components/SiteFooter.tsx` | Footer | Plain 3-column |
| `src/components/CategoryTabs.tsx` | Category nav pills | Refactored to centralized accents |
| `src/components/ProductCard.tsx` | Product card | Generic box; image scale only |
| `src/components/CartDrawer.tsx` | Cart drawer | Opaque; no glass |
| `src/components/CartContext.tsx` | Cart state | Solid; keep |
| `src/lib/queries.ts` | Data layer | Centralized; untouched; keep |
| `src/lib/types.ts` | Types | Minimal; keep |
| `src/lib/supabase.ts` | Supabase client | Thin; keep |
| `src/app/globals.css` | Design tokens + foundation CSS | Expanded (see §5) |
| `src/lib/accents.ts` | Centralized category accents | Created (see §5) |
| `src/components/Button.tsx` | Button primitive | Created; has TS error (see §6) |
| `src/components/GlassPanel.tsx` | Glass surface | Created |
| `src/components/Reveal.tsx` | Motion reveal | Created |
| `src/app/admin/*` | Admin pages | Functional prototype; unchanged |
| `supabase/schema.sql` | Schema (3 tables) | Verified; no changes needed |
| `supabase/seed.sql` | Seed data | Verified; points to nonexistent local images |
| `next.config.ts` | Next config | Default; empty |
| `package.json` | Dependencies | Verified |

### Current state facts

- **Supabase env**: `.env.local` exists and is gitignored; anon key via `NEXT_PUBLIC_SUPABASE_*`.
- **Schema**: `categories`, `products`, `site_content`. No schema changes made.
- **Storefront**: Original prototype functional; **current working tree not verified to compile**.
- **Git**: branch `master`; last commits `c93917d` (docs) and `d17681f` (baseline). Working tree has uncommitted changes.
- **Public imagery**: `public/images/` is **empty**.

---

## 3. Visual Problems

*(These are baseline findings — they existed before this audit's code changes.)*

1. **Uniform section layouts.** Nearly every page uses `max-w-6xl px-6 py-16` + mono eyebrow + display heading + grid. No editorial rhythm or asymmetry (AGENTS.md §08/§40).
2. **Border-heavy cards.** `border-[var(--line)]` on nearly every element (category tiles, cards, admin) reads "template", not "premium".
3. **Identical category discovery.** Homepage renders four identical `aspect-square` tiles with name labels. No category identity, no hierarchy; Coffee (the origin) looks identical to Grains. No accent color on tiles.
4. **Flat hero.** Single full-bleed background image + left text + one CTA. No depth, layering, staging, motion, or glass (§11 unmet).
5. **No glass anywhere** in real UI (§06 unmet).
6. **Typography under-used.** Fraunces used at similar scale everywhere; `font-mono` overused for all labels so it stops being an accent.
7. **No motion.** No reveal/stagger/parallax/scroll-linkage (§12/§26 unmet).
8. **Minimal hover.** Nav color change; buttons none; cards `scale-105` only (§13 unmet).
9. **Plain footer.** Static 3-column grid; no provenance/editorial presence.

---

## 4. Architecture Problems

*(Baseline unless noted otherwise.)*

1. **Data-driven header incomplete (introduced during this work — the refactor landed but the consumer wasn't updated).** `SiteHeader` now requires `categories`, but `layout.tsx` still renders `<SiteHeader />` with no prop. This is the primary blocker (see §6).
2. **Accent logic centralized but partially wired (introduced during this work).** `src/lib/accents.ts` created; only `CategoryTabs` consumes it. Homepage tiles, nav hover, product metadata, and admin still use raw strings.
3. **Seeded image URLs broken by design (baseline).** Seed → `/images/*.jpg` under an empty `public/images/`. Broken/missing imagery unless Supabase `image_url` holds real external URLs.
4. **Layout does not prefetch categories once (baseline).** Ideal: fetch once at layout/server level and pass down so header + footer share data.
5. **Checkout fully client-rendered (baseline).** Intentionally no payment (§32). No change needed now.
6. **No mobile menu (baseline).** Header nav is `hidden md:flex`; categories unreachable on small screens beyond homepage tiles.
7. **Foundations unused so far (introduced during this work).** `Button`/`GlassPanel`/`Reveal` exist but no real page consumes them yet.
8. **Accent helper returns CSS-var strings (introduced during this work).** Fine for inline `style`/arbitrary values; no class-based helper yet.

---

## 5. Changes Already Attempted

All of the following are in the working tree but **uncommitted and unverified**:

| File | Status | Change |
|---|---|---|
| `src/app/globals.css` | Modified | Full design-token system: dark (soil/espresso) + light (bone/ivory/linen) surfaces; copper/bronze; category accents; lines/borders; shadows; glass vars; motion timing/easing; content widths; `.glass*`, `[data-reveal]`, `.btn*`, surface helpers, focus-visible; reduced-motion overrides |
| `src/components/CategoryTabs.tsx` | Modified | Refactored to consume `categoryAccent()`/`categoryAccent` from `@/lib/accents` instead of a local hardcoded record |
| `src/components/SiteHeader.tsx` | Modified | Nav now renders from a `categories: Category[]` prop instead of hardcoded Coffee/Tea/Horticulture/Grains |
| `src/lib/accents.ts` | Created | `CATEGORY_ACCENTS` map + `DEFAULT_ACCENT` + `categoryAccent(slug)` with graceful fallback |
| `src/components/Button.tsx` | Created | `<Button>` / `<ButtonLink>` with `primary` / `ghost` / `light` variants, `.btn` classes |
| `src/components/GlassPanel.tsx` | Created | Reusable glass surface (`default`/`light`/`strong`) |
| `src/components/Reveal.tsx` | Created | IntersectionObserver reveal, transform+opacity, stagger delay, reduced-motion aware |

**Attempted but NOT completed:**
- Wiring `layout.tsx` to pass categories to `SiteHeader` — **never done** (root cause of TS error).

**Not yet attempted (deferred to the correct phase):**
- Homepage recomposition, mobile nav, product-detail story, admin polish.

---

## 6. TypeScript Errors

Verified via `npx tsc --noEmit` during this session. **These are the actual error messages:**

### Error 1 — `SiteHeader` prop missing (BLOCKER)

```
src/app/layout.tsx(39,12): error TS2741:
  Property 'categories' is missing in type '{}' but required in type '{ categories: Category[]; }'.
```

- **Affected file:** `src/app/layout.tsx`
- **Line:** 39 (`<SiteHeader />`)
- **Cause:** `SiteHeader` refactored to require `categories: Category[]`, but `layout.tsx` was never updated to fetch and pass them.
- **Introduced during:** this work (the refactor).

### Error 2 — `Button.tsx` internal helper typing

```
src/components/Button.tsx(31,32): error TS2345:
  Argument of type '{ variant: Variant; className: string | undefined; }' is not assignable
    to parameter of type 'ButtonStyleProps'.
    Property 'children' is missing in type ... but required in type 'ButtonStyleProps'.

src/components/Button.tsx(41,42): error TS2345:
  Argument of type '{ variant: Variant; className: string | undefined; }' is not assignable
    to parameter of type 'ButtonStyleProps'.
    Property 'children' is missing in type ... but required in type 'ButtonStyleProps'.
```

- **Affected file:** `src/components/Button.tsx`
- **Lines:** 31 and 41 (the `classes(...)` call inside `Button` and `ButtonLink`).
- **Cause:** `ButtonStyleProps = Pick<BaseProps, "variant" | "children" | "className">` incorrectly includes `children`. The `classes()` helper only uses `variant` and `className`.
- **Introduced during:** this work (the new component).

---

## 7. Lint/Test Results

- **`npx tsc --noEmit`:** **FAILED** — the two errors in §6 above. It did not reach a clean pass.
- **`npm run lint`:** **NOT run to a clean pass** for the Phase 1 code. A prior lint invocation **timed out** at the shell's 120s limit with no output — treated as **inconclusive**, not a pass.
- **`npm run build`:** **NOT run** — cannot meaningfully build while TypeScript fails.
- **Runtime/manual test:** **Not performed** on the uncommitted working tree.

**I am not claiming any test passed.** The only verified tool result in this session is the `tsc --noEmit` failure output above.

---

## 8. Unresolved Issues

1. **Blocker:** `layout.tsx` must pass `categories` to `SiteHeader` (TS2741).
2. **Blocker:** `Button.tsx` `ButtonStyleProps` must drop `children` (TS2345 ×2).
3. **Open:** `npm run lint` never produced a pass.
4. **Open:** no successful `npm run build`.
5. **Open:** none of the new primitives (Button/GlassPanel/Reveal) are consumed by any page — nothing verifies them in real UI.
6. **Open:** mobile navigation does not exist; needs design before header redesign.
7. **Open:** broken-image handling (hero/category/product) not implemented; `public/images/` empty.
8. **Open:** "Single origin" label remains hardcoded for all products (overclaim for demo tea/horticulture/grains, AGENTS.md §29).
9. **Open:** accent helper not yet used across all category-facing components.
10. **Open:** decision required on image sourcing (Supabase storage URLs vs `public/`).

---

## 9. Baseline Issues

*(These existed before the audit; remain unaddressed.)*

1. `public/images/` empty — every local seed image path 404s.
2. No mobile nav (header nav `hidden md:flex`).
3. No glass material in real UI.
4. No motion.
5. Minimal hover.
6. Uniform layouts across all public pages.
7. Hardcoded "Single origin" on every product page.
8. No graceful image fallback.
9. Checkout concept-only (intentional, §32).
10. No polished error/empty/loading states.
11. Category accent awareness only in `CategoryTabs` (pre-foundation).
12. Hero fallback `/images/hero-coffee.jpg` references a nonexistent file.

---

## 10. Recommended Fixes Before Phase 2

1. **Wire `layout.tsx`:** import `getCategories()`, fetch, pass `<SiteHeader categories={...} />`.
2. **Fix `Button.tsx`:** change `ButtonStyleProps` to `Pick<BaseProps, "variant" | "className">`.
3. **Run `npx tsc --noEmit`** until zero errors.
4. **Run `npm run lint`** until zero errors.
5. **Run `npm run build`** until success.
6. **Decide image sourcing** and implement a broken-image fallback (neutral surface + alt) before the hero relies on imagery.
7. **Plan + implement a mobile nav** before header redesign.
8. **Standardize accent consumption** so all category-facing components use `categoryAccent()`.
9. **Make "Single origin" conditional** (coffee only) or remove for demo content.
10. **Smoke-test the foundation** on existing surfaces (header glass, cart glass, card hover) before homepage work, to validate the primitives against regressions.

---

## 11. Premium Visual Redesign Plan

Per AGENTS.md and the baseline audit, the intended direction:

- **Visual language:** premium, editorial, tactile, Kenyan origin + global execution. Moments of dark and light (§05); sovereignty over glass (§06); generous whitespace/asymmetry (§08).
- **Colors/materials:** deep charcoal/volcanic brown/espresso + bone/ivory/linen light surfaces; restrained bronze/copper; controlled category accents.
- **Typography:** Fraunces display (normal/italic), Archivo body, Space Mono metadata; deliberate hierarchy (§07).
- **Glassmorphism:** floating nav, cart drawer, hero overlays, product metadata, contextual controls — never everywhere (§06).
- **Motion:** transform+opacity only, premium easing, staggered reveals, reduced-motion support (§12/§26).
- **Hover:** designed transitions — image crop shift, glass metadata reveal, accent underline, CTA prominence, button lift, catalog hover (§13).
- **Imagery:** cinematic, natural, farmer/landscape/crop/product closeups; never fake the brand; always guard against broken images (§09/§50).
- **Homepage recomposition:** cinematic hero → category editorial band → featured products → terroir/provenance moment → story band (§11).
- **Commerce:** frictionless browse → discover → product → cart → checkout/inquiry, shown as a serious system (prototype-state, no fake payments §15).
- **Performance/accessibility:** server components, optimized images, semantic HTML, keyboard nav, visible focus, reduced-motion (§24/§25/§26).

---

## 12. Files That Should Be Modified

*(To reach the green foundation + Phase 2. These are recommendations, not changes.)*

| File | Change |
|---|---|
| `src/app/layout.tsx` | Fetch categories; pass to `SiteHeader`; optionally share with footer |
| `src/components/Button.tsx` | Fix `ButtonStyleProps` typing |
| `src/components/SiteHeader.tsx` | (after wiring) apply glass, underline hover, mobile menu |
| `src/components/CartDrawer.tsx` | Apply glass, imagery, micro-interactions |
| `src/components/ProductCard.tsx` | Editorial hover/crop-shift/metadata/accent |
| `src/app/page.tsx` | Fix hero fallback; editorial re-composition (Phase 2); accent tiles |
| `src/app/product/[slug]/page.tsx` | Conditional "Single origin"; product story (Phase 2–3) |
| `src/app/globals.css` | Consume + possibly extend tokens as needed |
| `src/lib/accents.ts` | Optionally add class-based helper |
| `src/components/GlassPanel.tsx` / `Reveal.tsx` | Use in real UI |

---

## 13. Files That Should NOT Be Modified

| File | Why |
|---|---|
| `src/lib/queries.ts` | Centralized data access — keep as source of truth (§18) |
| `src/lib/types.ts` | Minimal, correct types |
| `src/lib/supabase.ts` | Thin client; correct |
| `supabase/schema.sql` | No schema changes (§1 scope) |
| `src/components/CartContext.tsx` | Solid cart state |
| `src/app/admin/*` | Deferred; functional |
| `src/app/globals.css` | Tokens — evolve carefully, avoid regressions |
| `AGENTS.md` | Do not modify the governing standard |

---

## 14. Recommended Implementation Order

1. **Fix `layout.tsx`** — pass categories to `SiteHeader`.
2. **Fix `Button.tsx`** — fix `ButtonStyleProps`.
3. **`npx tsc --noEmit`** — zero errors.
4. **`npm run lint`** — zero errors.
5. **`npm run build`** — success.
6. **Apply foundation to existing surfaces** as a smoke test (header glass, cart glass, card hover, accent hover).
7. **Add broken-image fallback** (hero + category + product).
8. **Design + implement mobile nav**.
9. **Make "Single origin" conditional**.
10. **Then begin Phase 2** — homepage hero + section recomposition per §11.
11. **Commit a green baseline** at each milestone (§36).

---

## 15. Definition of Done

For Phase 1 foundation + readiness for Phase 2, ALL must be true:

- [ ] `npx tsc --noEmit` passes with zero errors.
- [ ] `npm run lint` passes with zero errors.
- [ ] `npm run build` succeeds.
- [ ] `SiteHeader` is fully data-driven (categories from the data layer).
- [ ] Accent logic centralized and consumed wherever category color is used.
- [ ] Broken-image handling in place (hero + category + product).
- [ ] Glass + motion + Button primitives applied and visually validated on real surfaces, no regressions.
- [ ] Storefront works end-to-end (browse → shop → product → cart → checkout concept).
- [ ] Supabase env present; schema unchanged; data loads.
- [ ] A green baseline commit exists at this state.

Only after the above may Phase 2 (homepage recomposition) begin.

---

*End of report. Findings only — no application files were modified to produce this document.*
