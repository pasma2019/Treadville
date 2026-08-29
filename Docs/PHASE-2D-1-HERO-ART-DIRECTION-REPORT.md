# PHASE 2D.1 — HERO ART-DIRECTION REPORT

> A corrective art-direction pass on the Phase 2D homepage hero, taken from
> "strong branded chapter slide" toward a **premium international advertising
> campaign frame** — the opening still of a brand film rather than a UI demo.
>
> Scope: `src/components/HeroSlideshow.tsx`, `src/components/HeroChapters.tsx`,
> one token in `src/app/globals.css`, and a one-line pre-existing overflow fix
> in `src/components/SiteFooter.tsx`. No other sections, no backend, no data layer.

---

## 01 — Objective

Take the hero from "well-made chapter slideshow" to **editorial advertising
campaign frame**:

- product imagery enlarged from ~11% of the visual field to a **hero-crop
  ~25–35%** so it reads like pack-shot advertising
- headline lockup tightened so the copy sits like a campaign line, never clipping
- hero filled **exactly** the visible viewport so the chapter navigation and
  "01/04 · Pause" controls are always on-screen
- product visible on mobile (previously hidden below `md` — violated the
  product-visibility brief)
- all motion, keyboard controls, glass, typography, and colour-token systems
  preserved

## 02 — Brief

The correction follows AGENTS.md §§04, 05, 07, 11, 12, 23, 26, 40:

- product is the subject; the frame is the campaign
- whitespace and atmosphere carry the premium — not more gradients or shadows
- motion stays slow, purposeful, and reduce-motion safe
- no fabrication anywhere (see §09 and §11)

## 03 — What Changed

| Area | Before | After |
|---|---|---|
| Visual field | product rendered at ~11% of the 16:9 frame, right-float | hero-crop composition, product ≈25–35% of frame |
| Visual container | `w-[60%]` right-aligned, fixed offsets | `absolute inset-y-0 right-0 w-[60%] lg:w-[55%] xl:w-[52%]` with inner right padding; mobile: full-bleed `h-[32svh]` strip on top |
| Responsive frame | single desktop composition | desktop 16:9 letterboxed component + dedicated mobile top-strip mini composition (see §06) |
| Left column | `ch`-unit widths → cramped 238px column, 5-line headline | fixed pixel scale `[320..480px]`; headline pairs on 3 lines at 1280; never clips (see §10) |
| Glassment panel | top-right, overlapping the enlarged pack-shot | lower-right, stacked below the product — reads as floating metadata under the art |
| Hero height | `min-h-[100svh]` → 65px too tall (controls below fold) | `min-h-[calc(100svh-var(--site-header-h))]` with a single `--site-header-h: 65px` token (globals.css) |
| Chapter art | board renders at ~28% of frame | bag/teapot/cup hero crops at 2.2–2.4×, bottom-anchored to the floor, beans/cloves redistributed (HeroChapters) |

## 04 — Composition

The hero is now a single editorial column on desktop:

```
┌──────────────────────────────┬──────────────┐
│ provenance eyebrow (top bar) │  (atmosphere) │
│                              │   PRODUCT    │ ← hero-cropped pack shot, ~30% of visual
│                              │  (16:9 crop) │
│                              │  glass info  │ ← lower-right
│  H1 campaign line            │              │
│  subline · meta · CTAs       │              │
├──────────────────────────────┴──────────────┤
│ chapter navigation · 01/04 · Pause          │
└─────────────────────────────────────────────┘
```

- The bag/teapot/cup is bottom-anchored so the pack sits on its floor and is
  cropped at the top — a beauty crop, not a floating icon.
- Left lockup is bottom-aligned below the vertical centre; the hero answers
  "what Treadville is, where from, why credible" in one frame.
- On mobile the art becomes a full-bleed strip above the lockup; the product
  is the opener, the copy closes.

## 05 — Chapter Art Direction

All four chapters rescaled in `HeroChapters.tsx` (translate/scale groups, world
coordinates 1600×900). Priorities per chapter:

- **01 Coffee** — bag hero crop (2.4×) shoulder + fused cup beside it; label
  visible mid-frame; coins/beans scattered on the near floor; warm steam.
- **02 The Cup** — single demitasse platformed at 2.2× (~34% of frame) on the
  dark studio stage; the brightest chapter (avg luminance 71 vs 32–46 elsewhere).
- **03 Tea** — teapot hero at 1.6× on burnt-sienna/emerald grade; leaf flight
  over the near floor.
- **04 From Soil to Market** — ceramic cup cluster at 1.5× with grain texture
  sweep behind, tying the whole brand story into one subject.

Each chapter is fingerprintable by its pixel histogram (see §10) and by its
headline, so the crossfade, keyboard switching, and chapter buttons are all
verifiably live.

## 06 — Responsive Behaviour

The hero uses two distinct compositions backed by the same art:

- **≥768px:** 16:9 visual, right ~52–60%, vertically centred, product ~30% of
  frame; left lockup bottom-aligned.
- **<768px:** visual becomes a full-bleed `h-[32svh]` strip anchored to the top
  of the section, product visible immediately on load; lockup below it.

Measured at 320/375/390/430/768/1280/1440:

- hero section bottom == viewport bottom on every size (flush navigation);
- headline, subline, metadata, and CTAs all on-screen; nothing clipped;
- the floating glass panel presents only at `lg` (hidden on mobile/tablet where
  the checkmark metadata already lives in the lockup copy);
- **no horizontal overflow introduced by the hero** at any width
  (see §12 for the one pre-existing page-level residual).

## 07 — Motion & Interaction

Unchanged mechanisms, verified working against the production build:

- 1400ms crossfade (`--dur-cinema`, `.chapter` → `.chapter-active`), slow enough
  to feel premium, fast enough to stay usable;
- auto-advance with pause/resume ("Pause" → "Play");
- keyboard `ArrowLeft`/`ArrowRight` chapter rotation (Playwright-verified:
  chapter 1 → 2 → 1 by title match);
- four chapter buttons with active state, focus-visible rings intact;
- animations are transform/opacity only; nothing layout-thrashing.

## 08 — Accessibility & Reduced Motion

- headlines are real `h1`s with a single H1 across the slideshow;
- semantic section, labelled navigation (`aria-label`), labelled close/pause
  controls, visible focus;
- `prefers-reduced-motion: reduce` collapses dwell/zoom to a static frame
  (`globals.css` §@media reduce — verified the page renders and re-renders
  cleanly under the emulated setting);
- contrast maintained: parchment on volcanic soil well above AA for display copy.

## 09 — Data Honesty

- No new claims, certifications, prices, or stats were introduced. Headline,
  subline, and metadata were only **softened** (e.g., "Mt. Kenya ·
  volcanic highlands", "Grown at altitude, by people who know where it came
  from") — no invented science.
- Category CTAs use existing routes only (`/shop/coffee`, etc.).
- **Residual (pre-existing, noted in §12):** the secondary hero CTA in
  chapters still targets `/about`, which is not yet a built route — it 404s on
  prefetch. Deliberately not "fixed" with a fake About page in this phase.

## 10 — QA Evidence

Gates: `npx tsc --noEmit` ✓ · `npm run lint` ✓ · `npm run build` ✓
(compiled in ~3min, all 7 routes build, server start healthy).

Playwright metric sweep against the production build (`localhost:3001`):

| Viewport | Hero bottom | h1 bottom | sub bottom | CTA visible | glm panel | errs |
|---|---|---|---|---|---|---|
| 1280×900 ch1–4 | 900 | 622 | 691 | ✓ | yes | none |
| 1280×720 | 720 | 442 | 511 | ✓ | yes | none |
| 1280×800 | 800 | 522 | 590 | ✓ | yes | none |
| 390×844 | 844 | 465 | 549 | ✓ | hidden | none |
| 430×932 | 932 | 553 | 637 | ✓ | hidden | none |

Chapter fingerprint (visual-region mean luminance): 01 → 32, 02 → 71, 03 → 36,
04 → 46 — four visually distinct frames, distinct titles confirmed by keyboard
switch. No headline/visual rectangle overlap (independent re-check), no
controls clipping, no console errors beyond the `/about` prefetch 404 (§09/§12).

## 11 — Image Provenance

All four chapter visuals are **generated prototype imagery** (hand-authored SVG
compositions in `HeroChapters.tsx`). They are deliberately labelled as demo art:

> Generated prototype imagery — pending replacement with client-supplied
> Treadville photography.

They do **not** depict, and are never presented as, actual Treadville farms,
facilities, packaging, or staff. Coffee data (Mt. Kenya / Kirinyaga, volcanic
soils, glacial water, SCA 80+) draws only on verified AGENTS.md §02 material;
Tea, Horticulture, and Grains remain demo content.

## 12 — Residuals & Known Issues

1. **Provenance stat grid (pre-existing, out of hero scope):** at exactly
   `768px` the `grid-cols-2 → md:grid-cols-4` swap squeezes the stat cards to
   ~150px, and the display word "Highland" (single, unbreakable, `text-5xl`)
   forces ~18px of horizontal overflow at that single breakpoint. Recommend a
   `text-3xl md:text-4xl lg:text-5xl` scale in the next storefront pass.
2. **`/about` prefetch 404 (pre-existing):** hero secondary CTAs target
   `/about`, a not-yet-built route. Resolves when the About/Sourcing page
   lands; intentionally not silently re-pointed or stubbed here.
3. **Dev-server caveat (environment):** Turbopack dev mode intermittently 403s
   chunk requests in this Windows environment (HMR websocket
   `ERR_INVALID_HTTP_RESPONSE`). Final QA was therefore performed against the
   production build (`next start`), which behaved correctly throughout —
   hydration, autoplay, pause, chapter switching, reduced-motion all live.
4. **Footer overflow (fixed this phase):** the footer Contact column
   (`info@treadville.co.ke`, 87px track) pushed a 77px horizontal scroll at 768.
   Now `min-w-0` + `[overflow-wrap:anywhere]` on that column; measured
   overflow 0px up to tablet.

## 13 — Final Visual Assessment

The hero now reads as the **opening frame of a premium brand film**:

- one subject dominates — a hero-cropped pack shot bottom-anchored on its floor;
- the lockup is a tight campaign line, balanced on the lower third;
- the glass panel floats as metadata beneath the art, not on top of it;
- every viewport fits the frame edge-to-edge with controls present;
- motion and reduced-motion are both considered; zero fabricated business claims.

Per the "expensive test" (AGENTS §40): this pass removed scale, not opacity —
bigger art, fewer visual conflicts, cleaner type, more restraint. Next step,
when timeboxed: the **storefront polish phase** covering residual #1 and the
About route, then full route QA across shop/checkout/admin.