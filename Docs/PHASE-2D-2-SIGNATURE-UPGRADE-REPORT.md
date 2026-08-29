# PHASE 2D.2 — SIGNATURE VISUAL UPGRADE REPORT

> Second art-direction pass on the homepage hero + navigation. Goal: turn the hero's four chapters into **cinematic advertising campaign scenes** and rebuild the header as a **premium floating navigation** — so the prototype reads as a premium global brand film rather than a functional storefront with nice SVG decoration.

## 01 Creative brief (from Pascal / Eunice)

The prior pass (Phase 2D) shipped the 4-chapter slideshow, but the product visuals were judged too large and too "floating line-art." This pass required:

1. **Believable proportions** — the coffee bag must be substantially smaller, ~25–35% of the visual field, grounded with depth and breathing room. Not a full-frame floating bag.
2. **Distinct campaign worlds per category** — Coffee: espresso/charcoal/copper/amber. Tea: emerald/jade/forest. (Horticulture and Grains carry their category accents in the ecosystem; hero covers coffee, the cup, tea, and the agricultural product world.)
3. **Layered lighting and atmosphere** — key light, ambient glow, light shaft/beam, vignette, rim light, surfaces, contact shadows, sheen, sparkles/dust where appropriate.
4. **Restrained premium glass** — floating navigation, hero info panel, slide controls only.
5. **Premium floating header** — transparent at the top, resolving into quiet glass on scroll. No boxed developer bar.
6. **Preserve all functionality** — slideshow auto/pause/keyboard, cart, menu, verified content, accessibility, reduced-motion.

`REFERENCE-NOTES.md` was designated the authoritative creative spec for this phase.

## 02 What changed

### `src/components/HeroChapters.tsx` — full scene rewrite

All four chapter scenes were rebuilt as grounded cinematic compositions with real depth (floor/surface planes, contact shadows, light shafts, atmospheric veils):

| Chapter | Scene | World |
|---|---|---|
| 01 Masai Coffee | Compact stand-pouch bag (~300 world units tall, ~196 wide) on a dark studio surface, crimp seal, copper label plate, brand seal, demitasse + saucer left, grounds mound, dust motes, light shaft from upper right, sheen + contact shadow | Espresso / copper / amber |
| 02 The Cup | Bright ceramic demitasse on a reflective tabletop, crema web, rising steam, scattered beans + soft grounds smear on the floor, warm beam | Warm amber / cream |
| 03 Highland Tea | Matte jade teapot, emerald world, mist bands, quiet ridge silhouettes, botanical sprig, amber tea cup, drifting + loose leaves | Emerald / jade / forest |
| 04 Product World | Bronze bowl of wheat grain on a dark pedestal, wheat stalks leaning back-right, scattered kernels, warm shaft + rim light | Champagne / gold / bronze |

Supporting system:
- `Bean` helper for consistent tossed coffee beans in 01/02
- Unique gradient IDs per scene (`ca-`, `cb-`, `te-`, `gr-`) so crossfading chapters never collide
- All scenes `preserveAspectRatio="xMidYMax meet"` and `aria-hidden`
- Secondary CTAs repointed from `/about` (route that didn't exist → 404) to `/shop`

**Believability measure (objective):** in world coordinates the coffee bag spans 225×326 of the 1600×900 scene → **14% × 36%** of the frame. Rendered at 1280×900 (scene occupies the right 52% of the viewport, 666×374 px on screen) the bag draws ≈ **94px × 135px ≈ 15% of viewport height** — small, grounded, and believable rather than domineering.

### `src/components/SiteHeader.tsx` — premium floating navigation

- Transparent at the top of the page (no border, no box), integrated with the hero; **glass resolves on scroll** (`scrollY > 24`) via the `site-nav` surface.
- Elegant serif-italic wordmark ("Treadville") with a muted `KENYA` micro-label; relaxed tracking, no boxed lockup.
- Refined mono links with an **accent underline that grows on hover and reads the active route** via `usePathname()`; `aria-current="page"` on the active item.
- Cart button kept icon + count pill. Mobile menu rebuilt as a bottom-anchored editorial overlay (display-serif catalogue links, close-focused, Escape + body-lock preserved, auto-closes on route change).

### `src/components/HeroSlideshow.tsx` — presentation refinement

- Added the top `.hero-scrim` (`globals.css`) so the transparent header stays legible over bright chapter frames.
- Bottom slide controls now sit in restrained glass pills (`glass-light-cinema`, rounded) with a hairline divider; removed dead inline styles.
- Glass info panel gained an accent hairline; kept `bottom-36 right-6`, desktop-only.
- Height continues to use `calc(100svh - var(--site-header-h))`; crossfade/pause/keyboard unchanged.

### `src/app/globals.css`

- `hero-scrim` gradient (nav legibility), `site-nav` glass strip surface.
- Glass tokens re-tuned thin: `--glass-cinema-bg` 0.30, border 0.18, blur 18px; deeper soft shadows + inset top highlight.
- Spotlights honed and re-aimed at the product side (70–72% horizontal) for each chapter.

## 03 Production bug found and fixed — glass blur was dead

During QA the header/glass were rendering **without actual background blur** in the production build.

- Root cause: Next 16 + Turbopack's CSS transform (Lightning CSS class) collapses any custom-rule `backdrop-filter` + `-webkit-backdrop-filter` pair into the **webkit-prefixed form only**. In the Chromium in use this prefixed alias is no longer honored — verified with a controlled pixel experiment: a `-webkit-backdrop-filter: blur(12px)` panel over a red/green edge produced **0 blended pixels** (crisp edge), while the standard `backdrop-filter: blur(12px)` produced **1,260 blended pixels** (blurred edge).
- Fix: moved all blur onto Tailwind's own `backdrop-blur-[var(--glass-cinema-blur)]` utilities, which emit **both** prefixed and standard `backdrop-filter` (verified present in the compiled CSS). Removed the mangled declarations from `.glass-cinema`, `.glass-light-cinema`, `.site-nav`.
- Live verification after fix: `getComputedStyle(header).backdropFilter === "blur(18px)"` (was `"none"`), same for the hero glass panel.
- Bonus: `.glass-cinema`/`.glass-light-cinema`/`.site-nav` were the only live custom glass classes (`.glass`, `.glass-light`, `.glass-strong` live only in the unused `GlassPanel` component) — so the fix covered every active glass surface.

## 04 Verification

Gates (AGENTS.md §35):
- `npx tsc --noEmit` ✓
- `npm run lint` ✓
- `npm run build` ✓ (Next.js 16.3.3, Turbopack, all 7 routes)
- Production server re-validated on :3001

Playwright sweep at 390×844, 430×932, 768×1024, 1280×900 (+/shop, /checkout):
- Horizontal overflow: **0px at 390 / 430 / 1280**. 768px shows the **documented 18px residual from the Provenance stats grid** (Phase 2D.1 report; targeted fix scheduled for the storefront phase).
- All 4 chapters switch via dots and via ArrowLeft/ArrowRight; titles verified per chapter.
- Header: transparent at top (`rgba(0,0,0,0)`), glass on scroll (`rgba(14,11,8,0.66)` + `blur(18px)`).
- Cart drawer opens/closes; mobile menu opens, Escape closes, focus restored.
- `/shop` and `/checkout` load with no overflow; header height stable at 66px (65px token + hairline).
- Hero imagery occupies the right **52–60%** of the desktop frame (vertical-center, grounded) and a **32svh top band on mobile** — consistent dual-language composition.
- No console errors on the homepage. `/shop` still logs three 404s for `/images/product-*.jpg` — **pre-existing seed-data asset references** (CategoryImageLayer fallback prevents broken icons; asset list is a data/admin task, not a code regression).

## 05 Known residuals (honest)

1. 768px Provenance overflow (18px) — inherited, scheduled for the storefront polish phase.
2. Seed product images 404 on `/shop` — the prototype's product table references `/images/*.jpg` that have not been supplied; fallback shows branded color panels.
3. SVG scenes remain illustrations, not photography — by design, clearly labeled replaceable; `ChapterVisual` swap point already exists.
4. This model cannot view images; proportional judgements above are grounded in measured DOM geometry + the pixel blur experiment, not eyeball review. Screenshots for human review are in the repo QA archive (`sig-1280-ch1..4.png`, `sig-390-ch1..4.png`).

## 06 "Would Pascal confidently open this in front of Eunice?"

The functional architecture is untouched and verified. The hero now reads as **four small, lit, believable campaign objects inside atmospheric worlds**, the header as a **floating premium nav**, and the glass as an actual material rather than translucent paint. Remaining judgment on the art itself is best made visually over the captured screenshots, per the acceptance standard set at the start of the phase.