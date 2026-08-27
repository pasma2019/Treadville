# Treadville Premium Redesign — Status Report

> This is the living engineering/design status document for the Premium Visual
> Redesign phase. It is the single source of truth for what is done, what is
> incomplete, what is broken, and what is planned next.

---

## 1. Current Project State

- **Framework:** Next.js `16.3.3` (from `package.json`), React `19.2.8`, Tailwind CSS v4, TypeScript `^5`.
- **Data:** Supabase via `@supabase/supabase-js` `^2.112.4` (client library, anon key).
- **Layout:** `src/app/layout.tsx` is a **Server Component** currently rendering the header without categories — **this is a known gap** (see §5). The header is expected to receive categories data-driven.
- **Git status (working tree):** The foundation files are **unverified**. `npx tsc --noEmit` and `npm run lint` were **NOT run to a clean pass** for the new code.
- **Git state:** Working tree has uncommitted changes (see §4). The last clean commit is `c93917d` (see §2).
- **Supabase status:** `.env.local` exists and is gitignored (verifiable — the file is present on disk). Supabase env vars are read at runtime; schema lives in `supabase/schema.sql` (`categories`, `products`, `site_content`). No schema changes made.
- **Storefront functional?** The original prototype is functional, but the **current working tree is not verified** as compiling after Phase 1 foundation edits. Treat the working copy as **in-progress, not confirmed green**.

---

## 2. Baseline

### What was already working before the redesign

A working, simple storefront prototype:

- Home (`/`), Shop (`/shop`), Category (`/shop/[category]`), Product (`/product/[slug]`), Checkout (`/checkout`).
- Admin (`/admin`): Dashboard, Categories, Products, Content — **data-driven** (categories/products editable in admin reflect on the storefront).
- Centralized data layer: `src/lib/queries.ts`, `src/lib/types.ts`, `src/lib/supabase.ts`.
- Consistent dark theme, multiple fonts, a working cart (add/remove, drawer), checkout concept (no live payment).

### Which Git commit is the clean baseline?

The last commit introducing the prototype baseline is **`d17681f`** ("chore: establish working Treadville prototype baseline"). The most recent commit is **`c93917d`** ("docs: establish Treadville design and engineering constitution"). These represent the pre-redesign working reference point from which the redesign work diverges.

---

## 3. Audit Findings

The full audit is documented in **`AUDIT.md`**. Highlights:

### Visual weaknesses

- Uniform section layouts: nearly every section is `max-w-6xl px-6 py-*` + eyebrow + heading + grid. No editorial rhythm or asymmetry.
- Border-heavy cards on almost everything → reads as a "template" rather than premium (AGENTS.md §08/§13).
- Homepage hero is a single flat full-bleed image + heading + button — no depth, layering, or motion.
- Typography under-used; `font-mono` used uniformly for all labels so it stops feeling like an accent.
- No glass material anywhere despite AGENTS.md §06 encouraging it.

### UX / commerce weaknesses

- Cart drawer is an opaque, generic panel; micro-interactions and glass treatment absent.
- Product detail is a plain two-column box; product lacks a "story" (gallery, metadata, overlays).

### Architecture weaknesses

- Hard-coded category nav in `SiteHeader` (Coffee/Tea/Horticulture/Grains) — data-driven header not yet wired (see §5).
- Category accent logic was previously local to `CategoryTabs`; now centralized (done in §4a).

### Responsive / mobile weaknesses

- **No mobile navigation menu** — `SiteHeader`'s `<nav>` is `hidden md:flex`, so on mobile the only nav is the cart button.
- Product/category grids use `grid-cols-2` mobile → acceptable, but no touch-sized refinements tested.

### Imagery problems

- `public/images/` is **empty**. Hero/category/product imagery comes from external URLs and the seed points to nonexistent local paths (`/images/hero-coffee.jpg`, etc.). No fallback guards exist yet.

### Motion / interaction gaps

- No motion system existed before Phase 1. No reveal, no stagger, no parallax, no sophisticated hover (cards only had image `scale-105`).

---

## 4. Work Already Completed

### Files created

| File | What changed |
|---|---|
| `src/lib/accents.ts` | Centralized category accent map + `categoryAccent()`/`DEFAULT_ACCENT` helpers with graceful fallback for future categories |
| `src/components/Button.tsx` | Reusable `<Button>` / `<ButtonLink>` primitive with `primary` / `ghost` / `light` variants; uses `.btn` CSS classes |
| `src/components/GlassPanel.tsx` | Reusable glass surface (`default` / `light` / `strong` variants) using `.glass` classes |
| `src/components/Reveal.tsx` | Motion reveal (IntersectionObserver) animating transform+opacity, with stagger delay; reduced-motion aware |

### Files modified

| File | What changed |
|---|---|
| `src/app/globals.css` | Expanded design-token system; added glass utilities, motion utilities, button styles, focus/surface helpers |
| `src/components/CategoryTabs.tsx` | Refactored to consume centralized `categoryAccent()` instead of local hardcoded map |
| `src/components/SiteHeader.tsx` | Refactored nav to render from a `categories` prop, centralizing accent usage (data-driven contract) |

### Also created (non-code)

- `AUDIT.md` — full pre-redesign audit.

**Note:** This is the state as captured. The files are the working tree contents, not re-verified by a build.

---

## 5. Current Errors / Unresolved Issues

### 5.1 · `SiteHeader` needs a `categories` prop, but `layout.tsx` does not pass it

- **File:** `src/components/SiteHeader.tsx` (refactored), `src/app/layout.tsx` (not updated).
- **Error / gap:** `SiteHeader` now requires `categories: Category[]`, but `layout.tsx` still renders `<SiteHeader />` without the prop.
- **Likely cause:** The data-driven refactor landed without updating the consumer.
- **Recommended fix:** have the Server-component `layout.tsx` call `getCategories()` and pass `<SiteHeader categories={categories} />`. This is the top item to fix before checks pass.
- **Status:** unverified — the refactor expects callers to supply categories.

### 5.2 · `npx tsc --noEmit` — not run to a clean pass

- **Status:** NOT confirmed passing. The foundation files (Button/GlassPanel/Reveal/accents) plus header wiring have not been type-checked together.
- **Action:** run `npx tsc --noEmit` and fix all issues.

### 5.3 · `npm run lint` — not run to a clean pass

- **Status:** NOT confirmed passing for this phase.

### 5.4 · `Button.tsx` type risk

- **File:** `src/components/Button.tsx`
- **Issue:** the internal `classes()` helper and prop spreading may not type-cleanly; needs a `tsc` pass to confirm. Not verified.

### 5.5 · No production build verification

- **Status:** `npm run build` NOT run since the foundation edits.

### 5.6 · Mobile navigation still missing

- The header nav is `hidden md:flex` and there is no mobile menu. This predates Phase 1 but is unresolved.

### 5.7 · Hero / category image fallback not guarded

- `page.tsx` references a nonexistent local image fallback (`/images/hero-coffee.jpg`); `public/images/` is empty. Not yet addressed in the foundation.

### 5.8 · Supabase queries run on the server for layout/pages

- This is fine architecturally (centralized `src/lib/queries.ts`). Runtime needs `.env.local` present, which it is. No schema issue.

---

## 6. Completed vs Incomplete

| Feature | Status | Notes |
|---|---|---|
| Data-driven categories | ⏳ In progress | Accent centralization done (`accents.ts`); header now consumes accents; **header prop wiring not done** |
| SiteHeader | ⏳ Refactor landed | Now data-driven contract; not yet verified; no mobile menu |
| Button | ⏳ Primitive created | `Button`/`ButtonLink`; needs `tsc` confirmation |
| ProductCard | ⏳ Not touched | Unchanged in Phase 1 |
| CartDrawer | 🟡 Unchanged | Still opaque; glass material not yet applied |
| CategoryTabs | ✅ Refactored | Accent map centralized |
| ProductDetail | 🟡 Unchanged | Not part of Phase 1 |
| Homepage | 🟡 Unchanged (scope) | Explicitly deferred to Phase 2 |
| Glassmorphism | ✅ Foundation | `.glass*` + `GlassPanel`; not yet applied to real UI |
| Motion system | ✅ Foundation | `.reveal` + `Reveal` component; not yet applied to real UI |
| Design tokens | ✅ Created | `globals.css` token set |
| Mobile navigation | ❌ Missing | No mobile menu exists |
| Image fallbacks | ❌ Missing | No broken-image guards |
| Admin | 🟡 Unchanged | Working prototype; deferred |
| Supabase | ✅ Intact | Schema/data layer untouched |
| TypeScript | ⚠️ Unverified | Need `npx tsc --noEmit` |
| ESLint | ⚠️ Unverified | Need `npm run lint` |
| Production build | ⚠️ Unverified | Need `npm run build` |

Legend: ✅ done · ⏳ in progress / partial · 🟡 unchanged (deferred) · ❌ missing/unverified · ⚠️ needs verification

---

## 7. Architecture Assessment

### Solid (keep)

- Centralized data layer (`src/lib/*`) and shared component primitives.
- Data-driven categories/products flowing from Supabase through `queries.ts`.
- Admin-driven catalogue → storefront in one source of truth.

### Must-fix before the visual redesign continues

1. **Wire `SiteHeader` to receive categories data-driven** (5.1) — closes the architecture loop (§16/§17).
2. **Get `tsc`, `lint`, `build` green** (§35) on the foundation code.
3. **Centralize accent logic** (done — `accents.ts`) and make sure it is consumed everywhere a category color is needed.
4. **Guard broken images** (hero/category) with a neutral/graceful fallback (§09/§47/§50) before relying on imagery in a redesigned hero.
5. **Decide/plan a mobile navigation strategy** before desktop nav is redesigned, so the pattern lands once.

---

## 8. Premium Design Direction (from AGENTS.md)

- **Visual language:** premium, editorial, elegant, tactile, confident, modern, earthed; Kenyan in origin, global in execution. Avoid generic SaaS / AI-template / excessive glass-cards / purple-blue gradients.
- **Colors / materials:** deep charcoal, volcanic brown, espresso, warm black; bone/ivory light surfaces (dark + light moments alternating); restrained bronze/copper accents; controlled category accents (coffee copper, tea green, horticulture fresh green, grains wheat-gold). Not brown everywhere — contrast is essential.
- **Typography:** editorial hierarchy — Fraunces display serif (normal/italic), Archivo body sans, Space Mono for metadata/labels. Deliberate weights and tight letterspacing.
- **Glassmorphism:** encourage, restrained — floating nav, cart drawer, hero overlays, product metadata, contextual controls. Glass is a material, not the whole design system.
- **Motion:** `transform` + `opacity` only; premium easing; staggered reveals; slow enough to be premium, fast enough to be usable; `prefers-reduced-motion` support; no bouncing/cartoon animation.
- **Hover interactions:** designed — image scale + crop shift, secondary info reveal, accent appearance, CTA prominence, subtle nav underline/indicator, button elevation. No exaggerated effects.
- **Imagery:** cinematic, natural, tactile, premium, authentic, editorial — farms, landscapes, crops, harvesting, processing, product closeups. Never falsely imply stock imagery is a real Treadville asset. For demo categories, imagery is replaceable. Always guard against broken images.
- **Responsive principles:** designed mobile-intentionally, not compressed desktop — 320px through large desktop, no horizontal overflow, no hover-dependent functionality, accessible touch targets, sticky/cart/admin/mobile nav checked.

---

## 9. Recommended Next Steps (suggested safest sequence)

1. **Wire `layout.tsx`** to fetch categories and pass them to `SiteHeader` (fix 5.1).
2. **Run `npx tsc --noEmit`** and fix all type errors (verify Button/GlassPanel/Reveal/prop types).
3. **Run `npm run lint`** and fix all lint errors.
4. **Run `npm run build`** until it succeeds.
5. Apply glass + motion + refined hover to **existing** components that are already in use (e.g., `CartDrawer`, `SiteHeader` nav, `ProductCard`) using the new primitives, verifying no regressions — this grounds the design system in real UI before the homepage rewrite.
6. Add a **broken-image fallback** utility/guard for the hero and any category images.
7. **Then** begin the homepage hero/section redesign (Phase 2) per the audit priorities (§7 of AUDIT.md).
8. Keep a clean commit at each green milestone (AGENTS.md §36).

---

## 10. Definition of Ready for Phase 2 (homepage redesign)

All of the following MUST be true before any homepage visual/info re-composition begins:

- [ ] `npx tsc --noEmit` passes with **zero errors**.
- [ ] `npm run lint` passes with **zero errors**.
- [ ] `npm run build` completes successfully.
- [ ] `SiteHeader` renders categories **data-driven** from the data layer (no hardcoded Coffee/Tea/Horticulture/Grains in nav).
- [ ] Category accent logic is confirmed centralized in `src/lib/accents.ts` and consumed where category color is used.
- [ ] The storefront still functions end-to-end: browse → shop → product → add to cart → cart drawer → checkout concept.
- [ ] Supabase env vars are present (`.env.local`) and data loads without schema changes.
- [ ] Broken-image handling is in place so a failed image never breaks the redesigned hero composition.
- [ ] Glass + motion primitives have been applied and visually validated on existing surfaces, with no degradation.
- [ ] A confirmed gold baseline is committed (commit at green state) so Phase 2 starts from a known-good revision.

---

*Generated end of Phase 1 architecture + design foundation work.*

*Next session should: fix the `SiteHeader` prop wiring, run all checks to green, and only then apply the foundation visually and proceed to the homepage.*
