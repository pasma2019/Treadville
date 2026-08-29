# PHASE 2D.3 — Cinematic Hero Art-Direction Correction

Scope: art direction only. Slideshow mechanics, routing, data, copy, accessibility,
and behaviour were **not** changed. The four `HeroChapters` scenes were rebuilt as
cinematic campaign stills; the header received a restrained typography/spacing pass.

## What changed

### `src/components/HeroChapters.tsx`
The four generated scenes were replaced with larger, grounded, deliberately lit
compositions. `Chapter` type, `CHAPTERS` data, `ChapterVisual`, `Bean`, aria-hidden,
gradient-id prefixes, and `preserveAspectRatio="xMidYMax meet"` are unchanged.

Product ensembles now occupy roughly **25–35% of the scene area** (measured at 1280):

| Chapter        | Art direction                        | Pixel footprint (mass/span)         |
|----------------|--------------------------------------|-------------------------------------|
| 01 Coffee      | Espresso/charcoal/copper/amber       | 24% mass, 60% horizontal span       |
| 02 The Cup     | Champagne/cream/amber, reflective    | 39% mass, 64% span, straw below?    |
| 03 Tea         | Obsidian/emerald/jade, mist          | 18% mass, 78% span (atmospheric)    |
| 04 Grains      | Charcoal/gold/champagne, harvest     | 35% mass, 61% span                  |

- **Coffee (01):** stand-pouch bag scaled up ~2.2× wide / 1.4× tall (world bbox
  438×472), copper label plate + brand seal, crimp, gusset, espresso demitasse and
  beans staged forward-left, grounds mound, layered charcoal floor with warm colour
  spill, key light from the upper left, dual volumetric shafts, dust motes,
  blurred foreground at bottom-left.
- **The Cup (02):** elegant cream cup ~1.7× taller on a 500-wide saucer, clover
  crema with web, slow steam, beans U-stage; **true table reflection** (mirrored
  flipped group clipped to the table + gradient fade — pixel-confirmed below the
  floor line), directional key from the upper right, table sheen glints, DOF
  foreground bottom-right.
- **Tea (03):** large matte-jade teapot (body 680×324 world), lid + knob steam,
  spout, jade caddie with leaves, cup of brewed amber tea, emerald haze band,
  ridge silhouettes, drifting leaves, dramatic green shaft, blurred foreground
  leaf bottom-left.
- **Grains (04):** bronze bowl of wheat on a dark pedestal (~2.5× larger rim),
  taller grain stalks leaning right, copper-lidded glass jar of kernels, spilling
  grain, warm keys from upper right, herbaceous olive leaf nod for horticulture,
  DOF wheat heads bottom-left.

Shared cinema grammar across all four (same brand, four campaigns): consistent
floor line, contact shadows under every object, colour spill on the surface,
localised bounce glow behind each hero, two-tier volumetric beams, atmospheric
haze, controlled vignette, and shallow-focus foreground silhouettes.

### `src/components/SiteHeader.tsx`
Typography/spacing only — transparent-at-top → glass-on-scroll architecture,
slate glass, cart, and mobile menu untouched. Wordmark tracking tightened to
`-0.02em`; nav links refined to 10px / 0.34em tracking with `gap-9`; `KENYA`
micro-label tracking widened to 0.45em.

## Verification (all green)

- `npx tsc --noEmit` — pass
- `npm run lint` — pass
- `npm run build` — pass (Next.js 16.3.3 / Turbopack, 7 routes)
- Playwright QA at **390 / 430 / 768 / 1280**:
  - overflow X: `0` at 390/430/1280; `18px` at 768 (pre-existing Provenance
    section residual, documented and out of scope)
  - all 4 chapters switch; dot navigation intact; copy unchanged
  - header `rgba(0,0,0,0)` at top → `rgba(14,11,8,0.66)` + `blur(18px)` on scroll
  - no console/page errors on `/`
- Pixel measurements at 1280 (heredigest of scene box 666×374):
  - ch2 table reflection present: 1229 cream-coloured pixels below the floor line
  - ch1 copper palette (band/seal/crema): 3029 px at the bag position
  - ch4 brass/gold bowl: 14,620 px
  - every scene grounded — product mass reaches the floor band in all four

The production blur fix from Phase 2D.2 is preserved (blur stays on Tailwind
utilities; no bare `backdrop-filter` reintroduced into custom CSS).

## Artifacts

QA script: `qa-2d3.js`; results: `sig2d3-qa.json`; screenshots:
`sig2d3-1280-ch1..4.png`, `sig2d3-390-ch1..4.png` — all under
`C:\Users\Admin\AppData\Local\Temp\opencode\`.

## Remainder

- Visual bar ("premium international brand campaign") requires human eyes on the
  screenshots; geometry/lighting ready for photography swap via `ChapterVisual`.
- 768px `overflow-x` residual (18px, Provenance) remains a known separate fix.
- No commit made (not requested).