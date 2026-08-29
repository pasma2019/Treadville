# Treadville Phase 2B — Slice 1 Report

> Slice 1 scope: build the new homepage hero as a premium editorial opening frame.
> No other section of the prototype is modified.

---

## 1. Files modified

| File | Change type | Notes |
|---|---|---|
| `src/components/Hero.tsx` | **Created** | New bounded client component. 195 lines. |
| `src/app/page.tsx` | Modified | Hero section replaced; rest of the page preserved. |
| `src/components/Reveal.tsx` | Modified | Added `id?: string` to `RevealProps` so the hero can label its `<h1>` for `aria-labelledby`. One-line addition; the component's behaviour and contract are otherwise unchanged. |

No other files were modified. Phase 2A work, the data layer, the admin, the cart, the shop, the product detail, `CategoryTabs`, `ProductCard`, `SiteHeader`, `CartDrawer`, `Button`, `GlassPanel`, `CartContext`, `layout.tsx`, `globals.css`, the `lib/` directory, and the public asset tree are all untouched.

## 2. What was implemented

### 2.1 `src/components/Hero.tsx` — the bounded client component

- **Props surface** (typed, exhaustive, no `any`):
  - `eyebrow: string`
  - `headline: string`
  - `subheadline: string`
  - `ctaLabel: string`, `ctaHref: string`
  - `secondaryCtaLabel?: string`, `secondaryCtaHref?: string`
  - `provenance: string`
  - `certifications: string[]`
  - `categories: { id: string; name: string; slug: string }[]`

  Every value is supplied by the server component from existing data (`site_content` + `getCategories()`). The hero is fully data-driven; admin edits to `site_content.hero_headline` / `site_content.hero_subheadline` flow through unchanged.

- **Atmospheric background** (no invented photography):
  - Two soft radial gradients in the existing copper and bronze palette (`rgba(168, 70, 31, …)` and `rgba(176, 141, 87, …)`) layered over a three-stop dark linear gradient using `--soil-muted` → `--soil` → `--soil-raised`.
  - A subtle 3px dot-grid pattern in `mix-blend-overlay` at 18% opacity (parchment tint) for tactile texture.
  - A bottom veil gradient (transparent → 35% → 85% soil) to anchor copy.
  - All colors come from existing design tokens (`--soil*`, `--copper`, `--bronze` families). No new tokens introduced.

- **Premium typography hierarchy**:
  - Eyebrow: mono, `text-[11px]`, `tracking-[0.32em]`, in `--accent` (the verified copper field).
  - Headline: `font-display` italic, `text-[2.75rem]` on mobile, `sm:text-6xl`, `md:text-7xl`, `lg:text-[5.5rem]`, with `leading-[1.02]` and `tracking-[-0.015em]`. Capped at `max-w-[18ch]`/`max-w-[20ch]` for editorial measure.
  - Subhead: `text-base sm:text-lg`, `leading-relaxed`, `max-w-xl`, parchment at 70%.
  - All type sized and weighted through existing `--font-display` / `--font-mono` variables; no font additions.

- **Layout**:
  - `min-h-[88vh]` on mobile, `md:min-h-[92vh]`. `items-end` so the editorial block anchors low like a magazine cover.
  - `relative isolate` with explicit `-z-20` and `-z-10` background layers, so the foreground content and the floating top-right provenance stay in clean stacking.
  - Twelve-column grid on `md+`: 8 columns for the editorial block, 4 for a floating provenance glass panel. Single column on mobile.
  - Top provenance strip (mono caption), an inline `Reveal`-staggered copy block (eyebrow → headline → subhead → CTA), a right-aligned `GlassPanel` for provenance + certifications, and a bottom hairline strip with category quick-links.

- **CTAs**:
  - Primary CTA uses the existing `ButtonLink` (`variant="primary"`) — picks up the documented hover lift, `--copper` background transition, and focus-visible ring from `.btn-primary` in `globals.css`.
  - Optional secondary CTA uses `ButtonLink` (`variant="ghost"`) — picks up the hairline-border hover-to-accent treatment. Hidden when not supplied.
  - The hand-rolled `bg-accent px-6 py-3` link that lived in the old hero is removed.

- **Restrained motion**:
  - All four editorial elements (eyebrow, headline, subhead, CTA) are wrapped in the existing `Reveal` primitive with `delay={0,1,2,3}` so they stagger in.
  - The `GlassPanel` is wrapped in `Reveal` with `delay={2}` so it appears as the headline settles.
  - The bottom category strip uses `Reveal` with `delay={3}`.
  - Each category link has a `width: 0 → 100%` underline reveal in the category's accent color on hover/focus (`bg-[var(--accent)]`), set with `transition-[width]`. CSS transform / opacity only — no layout properties animated.
  - A `useEffect` adds a single scroll-linked parallax on the veil layer (max 24px translation). It is gated by `prefers-reduced-motion: reduce` (returns early, no listener attached) and rAF-throttled to one update per frame. No `width` / `height` / `top` / `left` animation anywhere.

- **Accessibility**:
  - `aria-labelledby="hero-headline"` on the section, paired with `id="hero-headline"` on the `<h1>` (forwarded through the `Reveal` primitive's new `id` prop).
  - All decorative layers are `aria-hidden`.
  - The top provenance strip is `pointer-events-none` (decoration, not interactive).
  - Bottom-of-hero decorative gradient is `pointer-events-none aria-hidden`.
  - Category links use `focus-visible:outline-none focus-visible:text-[var(--parchment)]` (same pattern Phase 2A established for nav links), plus an animated underline that fills on `group-focus-visible` for keyboard parity.
  - Global `prefers-reduced-motion` rule in `globals.css:181-187` and `:273-279` continues to zero all `transition-duration` and `animation-duration` as a fallback. The hero-specific parallax additionally early-returns for reduced-motion users.

- **Data-driven categories**:
  - Categories are mapped from the prop (which comes from `getCategories()`). The accent for the underline is pulled from `categoryAccent(slug)` and set as a CSS custom property `--accent` on the link, so the hover reveal uses the correct category accent (coffee copper, tea green, horticulture lime, grains gold).

### 2.2 `src/app/page.tsx` — hero restage

- The full hero block is replaced by a single `<Hero … />` call.
- The dependency on the missing local `hero-coffee.jpg` fallback is removed. The new hero is atmosphere-first, not photograph-first. (See §6 "blockers" — when a real photograph is supplied, the architecture accepts it as a `style` prop on the background layer without restructuring.)
- `headline` and `subheadline` continue to read from `site_content` (`hero_headline` / `hero_subheadline`) with the same English fallbacks the prototype had, so the page never breaks if content rows are absent.
- Provenance string and certifications array are passed as explicit props (verified facts only — see §5).
- The `HomePage` function continues to be an async server component. The hero itself is the only client island; the rest of the page (CategoryTabs grid, Featured grid, Story) is still server-rendered.
- The `getCategories` / `getFeaturedProducts` / `getSiteContent` call sites are unchanged. `revalidate = 0` is preserved. The data flow is intact.
- The category tiles grid no longer renders an `eslint-disable` for the missing image branch — the inner `img` is now conditional on `cat.image_url`, the same pattern as before, but the unused disable comment is gone because there is no longer an always-rendered case around it.

### 2.3 `src/components/Reveal.tsx` — minimal prop surface fix

- One-line addition: `id?: string` to `RevealProps`. The component already spreads `...rest` onto the rendered element, so this is a typed passthrough only. No runtime change.

## 3. What was intentionally NOT changed

- **Shop pages** (`src/app/shop/`, `src/app/shop/[category]/`) — out of Slice 1 scope.
- **Product detail pages** (`src/app/product/[slug]/`) — out of scope.
- **Admin pages** (`src/app/admin/*`) — out of scope.
- **Data layer** (`src/lib/queries.ts`, `src/lib/types.ts`, `src/lib/accents.ts`, `src/lib/supabase.ts`) — out of scope. `getSiteContent()` continues to feed the hero; no new query, no schema change, no env change.
- **CartContext, CartDrawer** — out of scope. Cart button still opens the cart from the header.
- **CategoryTabs** — used as-is by the unchanged "Our terroir" section.
- **ProductCard** — used as-is by the unchanged "Featured" section.
- **SiteHeader** — Phase 2A work preserved unchanged. The new hero is composed with it (sticky translucent bar over a full-bleed section), not against it.
- **Button** — used as `ButtonLink`, no changes.
- **GlassPanel** — used as-is. Its first real storefront deployment is in this slice (the floating provenance panel) — exactly the AGENTS.md §06 use case.
- **globals.css** — not modified. All hero styling is token-driven from existing CSS variables and Tailwind utilities. The reduced-motion media query, focus-visible rule, and button foundation are all inherited unchanged.
- **public/images/** — not touched. No fake imagery committed. The directory remains empty.
- **package.json** — no dependency additions.

## 4. Verification results

### 4.1 `npx tsc --noEmit`
**PASS.** Zero errors, zero output.

### 4.2 `npm run lint`
**PASS.** Zero errors, zero warnings, zero output.

### 4.3 `npm run build`
**PASS.**
- Next.js 16.3.3 (Turbopack)
- `next.config.ts` processed in 3.7s
- Compilation: 106s
- TypeScript during build: 14.2s, clean
- Static pages: 7/7 generated in 1002ms
- Route table (unchanged from Phase 2A):
  - `ƒ /` (dynamic) — now contains the new hero client island
  - `○ /_not-found` (static)
  - `ƒ /admin` (dynamic)
  - `○ /admin/categories` (static)
  - `○ /admin/content` (static)
  - `○ /admin/products` (static)
  - `○ /checkout` (static)
  - `ƒ /product/[slug]` (dynamic)
  - `ƒ /shop` (dynamic)
  - `ƒ /shop/[category]` (dynamic)
- Warning: `Next.js ignored bun.lock in C:\Users\Admin\Documents …` — environmental, present before this slice, not introduced here. Documented in the Phase 2A report.

## 5. Verified content vs. invented content

Per AGENTS.md §02, §29, §30:

**Used (verified / already established in the existing brand):**
- "Est. 30+ years · Kenya" — eyebrow. (Matches `SiteFooter` and previous hero.)
- Headline / subheadline — read from `site_content` (or English fallback). No new claims.
- "Volcanic Highlands · Kenya" — provenance. Matches the existing site's emphasis on volcanic soil, altitude, Kirinyaga terroir (the descriptor "Volcanic Highlands" is general geographic language; "Kenya" is the only place name, and it is the company's verified origin).
- Certifications: `SCA 80+ Specialty`, `KEPHIS Compliant`, `SGS Verified`, `USDA Warehousing` — all four appear in the existing `SiteFooter` (SCA 80+ · KEPHIS · SGS · USDA). Verbs added ("Specialty", "Compliant", "Verified", "Warehousing") are descriptive of the certification bodies already named in the brand; no new authority is implied.
- Category names: "Coffee", "Tea", "Horticulture", "Grains" — driven by the `categories` table; no invented names.

**Not invented:** no prices, no farmer names, no farm locations, no awards, no customers, no export destinations, no production volumes, no tasting notes, no SCA scores beyond the verified "80+", no contact numbers or emails, no fake stock figures, no invented coordinates.

## 6. Blockers for this slice

- **No real hero photograph exists** (`public/images/` is empty). The Slice 1 hero is therefore atmosphere + typography + glass, which is consistent with the AGENTS.md §09 directive that photography should be authentic and not stock. When a real photograph is supplied, the architecture is ready to accept it as the background layer without structural change — the existing `HERO_BACKGROUND` constant is a single inline style, so swapping in a real `background-image` plus a tinted overlay is a one-line change.
- **No browser-automation tooling available in this environment** (Windows PowerShell, no Chrome/Edge/Firefox on `PATH`). Visual QA at the required breakpoints (320 / 375 / 390 / 430 / tablet / desktop) could not be performed. See §7.

## 7. Visual-QA limitations

- No interactive visual inspection was performed. Verification was through TypeScript, ESLint, Next.js build, and a manual code review against the AGENTS.md standard.
- The hero is responsive in code:
  - 12-column grid only on `md+`; single-column under.
  - Headline type scaled at `2.75rem / sm:text-6xl / md:text-7xl / lg:text-[5.5rem]` with explicit `ch` measures to prevent overlong lines.
  - `GlassPanel` caps at `max-w-xs` on mobile, `md:max-w-none`.
  - Top provenance strip and category strip wrap and re-space via `flex-wrap`.
  - `min-h-[88vh] / md:min-h-[92vh]` keeps the editorial anchor low without trapping small screens.
- What a human reviewer should verify in a browser before sign-off:
  - The parallax veil at scroll does not visibly shift text legibility.
  - The `Reveal` stagger reads as intentional, not slow.
  - The glass provenance panel surfaces correctly against the radial gradient.
  - The category-link underline reveal feels at the right speed.
  - At 320 / 375 / 390 / 430 the headline does not wrap awkwardly.
  - `prefers-reduced-motion: reduce` correctly disables the parallax and the stagger fade.
  - The hero does not compete visually with the sticky `SiteHeader` above it.

## 8. Recommended next slice (Slice 2)

**Restage the "Our terroir" / category discovery section.**

Why this slice second:

1. It is the section immediately below the new hero. The new hero ends with a category quick-link strip and an editorial copy block, and the next section is a near-duplicate of that pattern in the old homepage. Without restaging it, the new hero lands on a comparatively quiet block and the visual ceiling set by Slice 1 is not maintained.
2. It is the architectural thesis of the prototype — categories as the top-level organization, data-driven from the `categories` table. Getting this section right is what makes the multi-category story legible to a stakeholder.
3. It exercises the `CategoryTabs` and the category tiles in their natural composition. The tiles can use the same `Reveal` stagger, the same `GlassPanel` material language, and a `categoryAccent()`-driven left rail or top accent — keeping the visual vocabulary consistent with the hero.
4. It is still bounded: it touches only the section that was already a `<section>` between the hero and the featured grid, leaving the featured grid, story, footer, admin, shop, product, and data layer untouched.

Slice 2 should:

- Convert the existing category tiles to a category-aware editorial composition (use the category's accent for the active state, hairline rule, and metadata overlay).
- Replace the redundant copy in the section header (eyebrow + headline + intro are repeated from the hero) with a single restrained editorial moment, not three competing lines.
- Keep the tiles' content the same (`cat.name` + optional `cat.image_url`) but treat the missing image as an intentional atmospheric moment — gradient + category accent, not a broken-image placeholder.
- Continue to use `Reveal`, `GlassPanel`, and the existing accent tokens. No new components unless strictly necessary.

---

**REPORT CREATED: Docs/PHASE-2B-SLICE-1-REPORT.md**

Slice 1 complete. All three verifications pass. No regressions. Phase 2A work intact. Awaiting direction before Slice 2.
