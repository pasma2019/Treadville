# TREADVILLE — PREMIUM VISUAL REDESIGN AUDIT

> Full technical and design audit of the Treadville prototype as discovered
> during the Premium Visual Redesign phase — current session.
>
> This file is the authoritative record of findings. Nothing in this document
> implies a fix has been applied.
>
> **IMPORTANT:** This audit covers Phase 1 (architecture + design foundation)
> and the pre-redesign baseline. It does NOT claim any redesign is complete.

---

## Executive Summary

The Treadville prototype is a functional, data-driven storefront (Next.js 16.3.3,
Supabase, Tailwind v4) with a solid architectural core: centralized data layer,
server-rendered pages, admin that drives the storefront. The pre-redesign
findings (AUDIT.md) identified that the site is **visually generic** — uniform
section layouts, border-heavy cards, a flat hero, no motion, no glass, and no
sophisticated hover behavior. A design foundation (tokens, glass, motion,
Button, accents) was started in Phase 1 and **landed in the working tree
uncommitted and unverified**. The working tree also contains a **critical wiring
gap**: `SiteHeader` now expects a `categories` prop, but `layout.tsx` was not
updated to supply it, so the app has type errors and the data-driven nav loop is
incomplete.

**The current working tree does NOT pass `npx tsc --noEmit` or `npm run build`.**
Root cause is identified below. No redesign has happened yet. Phase 1 was
interrupted before checks were run to green.

---

## Current State

| Aspect | Status |
|---|---|
| Framework | Next.js **16.3.3**, React **19.2.8**, Tailwind CSS **v4**, TypeScript `^5` |
| Data layer | `src/lib/queries.ts`, `src/lib/types.ts`, `src/lib/supabase.ts` — centralized, untouched |
| Supabase | `.env.local` exists and is gitignored; anon key via `NEXT_PUBLIC_SUPABASE_*` |
| Schema | `categories`, `products`, `site_content` — no schema changes made or planned |
| Storefront | Original prototype functional; **current working tree not verified to compile** |
| Admin | Data-driven dashboard/categories/products/content — functional prototype |
| Git branch | `master` |
| Last commits | `c93917d` (docs: constitution), `d17681f` (baseline) |
| Working tree | Uncommitted: 3 modified files + 5 new files + `AUDIT.md` + `PREMIUM_REDESIGN_STATUS.md` |
| TypeScript | **FAILS** — errors in `layout.tsx` and `Button.tsx` (details in §TypeScript / Build Errors) |
| ESLint | **NOT run to clean pass** for this phase |
| Production build | **NOT verified** |

### Key fact — the wiring gap

`src/components/SiteHeader.tsx` now requires `categories: Category[]`. The only
consumer, `src/app/layout.tsx`, still renders `<SiteHeader />` **without** the
prop. This is the primary blocker.

---

## Visual Problems

1. **Uniform section layouts.** Every page uses the pattern
   `max-w-6xl px-6 py-16` + mono eyebrow + display heading + a grid. Shop,
   category, homepage, and product sections all read the same. Linear template.

2. **Border-heavy cards.** Nearly every element has `border-[var(--line)]`,
   including category tiles, product cards, admin cards. Reads "template", not
   "premium" (AGENTS.md §08, §40).

3. **Identical category discovery.** Homepage renders categories as four identical
   `aspect-square` tiles with a name label. No category identity, no hierarchy
   (Coffee is the brand origin; it looks identical to Grains). No accent colors
   used for the tiles.

4. **Flat hero.** Homepage hero is a single full-bleed background image + left
   column text + one CTA link. No depth, no layered imagery, no foreground/background
   staging, no motion, no glass. The "opening frame of a premium brand film"
   standard (AGENTS.md §11) is unmet.

5. **No glass material used anywhere** in real UI. AGENTS.md §06 explicitly
   encourages glass for floating nav, cart drawer, hero overlays, product metadata.
   All absent pre-foundation.

6. **Typography under-used.** Fraunces italic display is used, but almost always at
   similar scale; no overlapping type, no large-field editorial moments. `font-mono`
   is used for nearly every label/eyebrow/button, so it stops being an accent and
   becomes default.

7. **No motion.** Zero reveal/stagger/parallax/scroll-linkage before Phase 1's
   foundation. Motion standard (§12/§26) unmet.

8. **Hover is minimal.** Nav = color change; buttons = none; cards = `scale-105`
   on image only. §13's intended behaviors (crop shift, secondary info reveal,
   accent appearance, CTA prominence) absent.

9. **Footer is plain.** Three-column static grid; no editorial presence, no depth,
   no provenance treatment.

---

## UX Problems

1. **No mobile navigation menu.** `SiteHeader`'s `<nav>` is `hidden md:flex`.
   On mobile, the only nav affordances are the logo and the cart button. Categories
   are unreachable from the header on small screens (site relies on homepage tiles).

2. **Cart drawer is generic.** Opaque `bg-[var(--soil-raised)]` panel, simple
   border list, no item imagery, no quantity controls, no micro-interaction feedback,
   no glass.

3. **Checkout is a concept placeholder.** Disabled button, no validation, no
   M-Pesa/card (correctly labeled prototype). Fine for a prototype (§15), but the
   form styling is flat.

4. **Product detail is a plain box.** Two-column split; no gallery, no metadata
   treatment (grade/altitude/SCA for coffee §14), no floating price/status,
   no related affordances beyond the same grid pattern.

5. **Hard-coded claim on product page.** The label "Single origin" renders for
   **every** product (AGENTS.md §29 forbids overclaiming — Tea/Horticulture/Grains
   are demo content). Not conditional on category.

6. **No loading/empty/error states designed.** "Image pending" is bare text on a
   background; "No published products yet" is a plain paragraph. None feel
   intentional (§47–§49).

7. **Image fallback is broken.** Homepage hero references `/images/hero-coffee.jpg`
   which **does not exist** (`public/images/` is empty). The seed also points to
   nonexistent local paths (`/images/category-coffee.jpg`, `/images/product-*.jpg`).

---

## Architecture Problems

1. **Data-driven header wiring incomplete (BLOCKER).** `SiteHeader` refactored to
   accept `categories` but `layout.tsx` not updated. Causes TS error (see §TypeScript / Build Errors).
   Fix: server component fetches `getCategories()` and passes the prop.

2. **Accent logic — now centralized but not wired everywhere.** Created
   `src/lib/accents.ts` with `categoryAccent()`/`DEFAULT_ACCENT`. Only
   `CategoryTabs` consumes it. Homepage category tiles, nav hover, product metadata,
   and admin still use raw strings / no accent. Future categories will fall back
   silently to `DEFAULT_ACCENT` (copper) — acceptable but should be explicit
   in UI states.

3. **Seeded image URLs are broken by design.** Seed points to `/images/*.jpg`
   under `public/images/` which is **empty**. The storefront therefore displays
   broken/missing imagery unless Supabase `image_url` values are real external URLs.
   Must be guarded (fallback surface with no broken-image output) (§09/§47/§50).

4. **Layout does not prefetch categories once.** `layout.tsx` renders header +
   children + footer on every route. Ideal: fetch categories once at layout/server
   level and pass down, so header/footer share data. Currently multiple pages
   fetch/duplicate queries.

5. **Checkout is fully client-rendered.** It reads cart context; fine for the
   prototype, but payment/order infra is intentionally absent (§32). No change
   needed now.

6. **No dedicated `Button`/`GlassPanel`/`Reveal` primitives were used by any
   real page yet** — they exist as components but nothing consumes them until Phase 1
   applying/wiring.

7. **No mobile menu architecture.** When nav is redesigned, a mobile menu pattern
   (drawer/sheet) must be added — no current component exists.

8. **Category accent helpers are string-based CSS values** (`"var(--accent-coffee)"`).
   Works, but any consumer must use inline `style` or Tailwind arbitrary values.
   Cleaner: expose both a CSS-var string and a hex/`--accent-<slug>` for
   class-based usage.

---

## TypeScript / Build Errors

### Error 1 — `SiteHeader` prop missing (BLOCKER)

```
src/app/layout.tsx(39,12): error TS2741:
  Property 'categories' is missing in type '{}' but required in type '{ categories: Category[]; }'.
```

- **File:** `src/app/layout.tsx:39`
- **Cause:** `SiteHeader` now requires `categories`, but layout still renders `<SiteHeader />`.
- **Fix:** in `RootLayout`, call `getCategories()` and pass
  `<SiteHeader categories={c} />`. Then re-check types.

### Error 2 — `Button.tsx` internal helper typing

```
src/components/Button.tsx(31,32): error TS2345:
  Argument of type '{ variant: Variant; className: string | undefined; }' is not assignable
    to parameter of type 'ButtonStyleProps'.
    Property 'children' is missing in type ... but required in type 'ButtonStyleProps'.

src/components/Button.tsx(41,42): error TS2345: same for ButtonLink.
```

- **File:** `src/components/Button.tsx`
- **Cause:** the internal `classes()` helper's parameter type (`ButtonStyleProps`)
  incorrectly requires `children`.
- **Fix:** change the helper signature to accept only
  `Pick<BaseProps, "variant" | "className">`, i.e. drop `children`.

### Expected next blockers (once errors above are fixed)

- `getCategories()` needs to be imported in `layout.tsx`.
- `GlassPanel`/`Reveal` are components — they need to be type-safe when consumed.
- Any existing `<Button>` call sites (there are currently none) must pass props correctly.

**No build has been run to success in the current working tree.**

---

## Lint Results

- **`npm run lint` was NOT run to a clean pass** for the Phase 1 code.
- A prior lint run **timed out** at the shell's 120s limit during the audit session
  with no output produced — treated as **unresolved/inconclusive**, not FAILED.
- Expected once code compiles: `eslint` (Next.js config) may flag:
  - usage of `<img>` (currently `eslint-disable-next-line @next/next/no-img-element`
    in `page.tsx`, `ProductCard.tsx`, `ProductDetail`).
  - any `any` casts in new components (`Button.tsx` spreads rest props as
    `unknown` — may trigger `@typescript-eslint` issues).
- **`npm run lint` must be run and pass before Phase 2.**

---

## Baseline Issues (pre-redesign findings)

These existed in the `d17681f`/`c93917d` baseline and remain:

1. **Empty `public/images/`** — every local seed image path 404s.
2. **No mobile nav** — header nav hidden below `md`.
3. **No glass material** — every surface opaque.
4. **No motion** — no reveal/stagger/parallax.
5. **No hover sophistication** — image scale only on cards.
6. **Uniform layouts** — every public page same structure.
7. **Hard-coded category claims** — "Single origin" on all product pages;
   local seed URLs for images assume files that don't exist.
8. **No graceful image fallback** — broken images render as raw `<img>` or
   background-image gaps.
9. **Checkout is concept-only** — intentionally no payment, per §32.
10. **No error/empty/loading states designed beyond plain text.**
11. **Category accent awareness** — only `CategoryTabs` used a slug map;
    redesigned nav/cards/tiles should use the centralized helper.
12. **No mobile drawer / sheet for cart beyond the existing fixed panel** (it exists
    but is not glass, is not image-aware).

---

## Components to Redesign

| Component | Current | Target |
|---|---|---|
| **Homepage hero** | flat full-bleed image + heading + button | layered cinematic: atmospheric gradient, image, glass foreground panel, floating category entry cluster, slow scale/parallax, staggered text entrance (AGENTS.md §11) |
| **SiteHeader** | opaque bar, no mobile menu, hardcoded nav | glass floating nav, data-driven categories, underline/indicator hover, mobile menu (§06/§13/§23) |
| **CartDrawer** | opaque panel, simple list | glass panel, item imagery, quantity controls, micro-interactions, keyboard focus (§06/§15) |
| **ProductCard** | aspect-4/5 box + name + price | editorial product story: image crop shift, glass metadata badge (price/SCA/status), accent line, CTA reveal, subtle lift (§13/§14) |
| **Category tiles (homepage)** | four identical flat tiles | per-category accent identity, considered composition, terroir imagery, hover zoom+wash (§10/§28) |
| **ProductDetail** | two-column box | product story: gallery, metadata table (grade/altitude/process/SCA where real), floating price/status, glass overlay (§14) |
| **SiteFooter** | plain 3-column | editorial full-bleed presence, provenance story, responsive layout (§08/§27) |
| **Buttons everywhere** | raw `<Link>`/`<button>` with duplicated classes | single `Button` primitive (created, unused) + `.btn` CSS (§21/§13) |
| **Checkout form** | flat concept | intentional prototype-state styling — clearly labeled, no fake payment (§15) |
| **Admin** | functional plain | light visual polish only if time allows (not Phase-1 scope) |

---

## Components to Keep

| Component | Why keep |
|---|---|
| **CartContext** | Clean cart state (lines, count, total). Works. |
| **`src/lib/queries.ts`** | Centralized data access. Correct architecture (§18). |
| **`src/lib/types.ts`** | Minimal, correct types. |
| **`src/lib/supabase.ts`** | Thin client. Correct. |
| **`src/components/Reveal.tsx`** | New motion primitive (transform+opacity, reduced-motion). |
| **`src/components/GlassPanel.tsx`** | New glass material component. |
| **`src/components/Button.tsx`** | New button primitive (after fixing typing). |
| **`src/lib/accents.ts`** | Centralized category accents with fallback. |
| **Server pages** (/shop, /shop/[category]) | Keep server-rendered, data-driven (§25). |
| **Cart drawer structure** | Keep logic; restyle with glass. |

---

## Glassmorphism Opportunities

- **SiteHeader** (floating, translucent, blurred) — appears on every page.
- **CartDrawer** — glass panel, backdrop blur.
- **Homepage hero foreground panel** (headline/subheadline glass).
- **Floating category entry cluster** over the hero.
- **Product metadata badges** (price/SCA/status) on cards, revealed on hover.
- **Product detail** — floating price/status overlay; metadata table on glass.
- **Contextual controls** — quantity steppers, "add to order" floating CTA.
- **Admin** — selected surface / contextual CTA (light polish).
- **Rule (AGENTS.md §06):** glass is a material, not a design system — never
  put glass on every card.

---

## Motion and Hover Opportunities

- **Reveal/Stagger** — section entrances via `[data-reveal]` + `Reveal`
  component (transform/opacity only, `prefers-reduced-motion`).
- **Hero** — slow image scale-in / parallax, layered foreground entrance stagger,
  restrained gradient drift.
- **ProductCard** — image scale + crop shift, glass metadata reveal, accent underline,
  CTA prominence, subtle lift. All transform/opacity.
- **Nav** — underline/indicator reveal, subtle accent transition; no aggressive move.
- **Buttons** — background transition, `translateY(-1px)`, shadow lift (already in `.btn`).
- **Cart** — smooth slide, item add/remove feedback, count pulse.
- **Category tiles** — image zoom + accent wash on hover, distinct identity.
- **Rule (§12):** motion communicates hierarchy, continuity, or feedback — nothing else.
- **Rule (§26):** animate `transform`/`opacity` only; respect reduced motion.

---

## Homepage Recomposition

**Target structure** (per §7 of AUDIT.md, §11 of AGENTS.md):

1. **Cinematic hero** — layered: atmospheric gradient over highland landscape,
   floating glass nav, glass foreground panel with `Est. 30+ years · Kenya`,
   headline, subheadline, CTA; floating category entry cluster (Coffee/Tea/
   Horticulture/Grains); slow scale/parallax; staggered text entrance.

2. **Category discovery as a strong editorial band** — not four identical squares;
   per-category accent identities, overlapping editorial composition, using category
   imagery (terroir) and source descriptions.

3. **Featured products** — restaged inside the enhanced `ProductCard` with
   full-bleed or asymmetric treatment (not just a 3-col grid).

4. **Provenance / terroir moment** — full-bleed atmospheric image + overlay copy
   about Mt. Kenya / Kirinyaga volcanic soil (uses real brand content §02).

5. **Story band** — refine to a calmer editorial statement.

**Overall objective:** move from "four stacked uniform sections" to *moments of
dark and light* (§05), rhythm through asymmetry, typography + imagery breathing (§40).

**Scope guard:** homepage redesign is **Phase 2**. Phase 1 ends with the design
foundation wired + checks green.

---

## Recommended Fixes Before Redesign

1. **Wire `layout.tsx`** to fetch `categories` and pass to `<SiteHeader>`.
2. **Fix `Button.tsx` `classes()` helper typing** (drop `children` from param type).
3. **Run `npx tsc --noEmit`** until zero errors.
4. **Run `npm run lint`** until zero errors.
5. **Run `npm run build`** until success.
6. **Decide image sourcing** (Supabase storage URLs vs `public/`) and implement a
   broken-image fallback (neutral surface + alt) before relying on imagery in the
   redesigned hero.
7. **Plan mobile navigation** before redesigning the nav (drawer/sheet).
8. **Apply the foundation tastefully to existing surfaces** (nav glass, cart glass,
   product card hover) as a smoke test before homepage work — this verifies the
   primitives in real UI.
9. **Make "Single origin" conditional** on category slug (coffee) or remove it for
   demo tea/horticulture/grains content (§29).
10. **Standardize accent consumption** — ensure all category-facing components consume
    `categoryAccent()` (homepage tiles, card badges, nav hover) rather than raw strings.

---

## Phase 2 Readiness

### Definition of Ready (must ALL be true before homepage work)

- [ ] `npx tsc --noEmit` passes zero errors.
- [ ] `npm run lint` passes zero errors.
- [ ] `npm run build` succeeds.
- [ ] `SiteHeader` is fully data-driven (categories from the data layer).
- [ ] Accent logic confirmed centralized and consumed where needed.
- [ ] Storefront still works end-to-end (browse → shop → product → cart → checkout concept).
- [ ] Supabase env vars present; data loads; no schema changes.
- [ ] Broken-image handling exists so a failed image never breaks the hero.
- [ ] Glass + motion primitives applied + visually validated on existing surfaces.
- [ ] A gold baseline commit exists at green state to start Phase 2 from.

### Explicitly NOT done / deferred

- ❌ Homepage hero recomposition (Phase 2).
- ❌ Category editorial band (Phase 2).
- ❌ Product detail story (Phase 2–3).
- ❌ Admin polish (optional, later).
- ❌ Mobile menu (needs design before nav redesign).
- ❌ Checkout/payment (intentionally absent §32).

---

## Exact Next Steps (recommended sequence)

1. **Fix the layout wiring** — `layout.tsx` fetches categories, passes to header.
2. **Fix `Button.tsx` helper typing.**
3. **Run `npx tsc --noEmit`** — fix remaining errors until clean.
4. **Run `npm run lint`** — fix remaining issues until clean.
5. **Run `npm run build`** — fix any build issues.
6. **Apply the foundation to existing surfaces as a smoke test** (header glass,
   cart glass, product-card hover, accent hover states).
7. **Add broken-image fallback** (guard for hero + category + product images).
8. **Plan + implement a mobile nav** before header redesign.
9. **Then begin Phase 2** — homepage hero + section recomposition per "Homepage Recomposition".

---

*End of TREADVILLE — PREMIUM VISUAL REDESIGN AUDIT.*

*This document records findings only. No application files were modified in producing it.*
