# PHASE 2D.4 — Signature Visual Alignment

Reference: `public/design-reference/treadville-signature-reference.png`
Scope: visual art direction only. Architecture, routing, data, slideshow
behaviour, responsive system, Supabase, and unrelated sections were **not**
changed. No business data, claims, or certifications were touched.

## The five largest gaps (before)

1. **Framed illustration** — the hero scene lived in a right-side 52%
   letterboxed box; the reference world fills the entire hero as a brand-film
   frame. The scene read as "illustration inside a website."
2. **Mono-fragmented typography** — `Fraunces` / `Archivo` / `Space_Mono`
   everywhere labelled the interface like a developer system, not a luxury
   brand. Reference is monumental all-caps serif display + clean sentence-case
   sans nav.
3. **Glass overload** — glass pills, panels and floating information card all
   competed with the cinematic world; the reference uses none of it.
4. **Warm-brown foundation** — the hero base was espresso/copper-brown; the
   reference is near-black charcoal with champagne/metallic-gold accents.
5. **Soft, centred lighting** — gentle radial key lights and faint beams; the
   reference uses a hard diagonal gold shaft, hot rim light, deep fall-off,
   reflections and macro foreground depth.

## What changed

### Typography system (site-wide)
- **Display → Cormorant Garamond** (`--font-display`, 400/500/600/700, normal +
  italic). Headlines and `.display-*` now render in a world-class serif.
- **Interface/body → DM Sans** (`--font-body`, 400/500/600).
- `--font-mono` remapped to DM Sans so every letterspaced label keeps the
  label system without the monospace developer feel. No new dependencies —
  both fonts are Google fonts already required by the project.
- Hero headline: monumental Cormorant, **all caps**, `uppercase`, enlarged
  (`2.5rem → 6xl → 4.25rem`), weight 600, tight leading, subtle gold shadow.
  Eyebrow → gold DM Sans. Nav links → sentence-case DM Sans. Wordmark →
  uppercase Cormorant `text-[1.4rem] tracking-[0.14em]`.
- Readability preserved: no ultra-thin weights, no tiny body text (hero body
  `text-base/1.0625rem`), strong ivory-on-black contrast, gold is an accent only.

### Hero — full-bleed cinematic frame
- `HeroSlideshow` chapter layer now `absolute inset-0` (full-bleed on desktop,
  a 34svh band on mobile) with the scene at `preserveAspectRatio="xMidYMax
  slice"`. The visual world **is** the hero background; typography overlays it.
- The old CSS backdrop veil was a dead layer on desktop (the scene covered it)
  and is now replaced by a **film scrim** drawn *above* the scene: a left
  fall-off + bottom fall-off gradient, data-driven per chapter, so text stays
  legible without any glass.
- Chapter `atmosphere`/`veil` strings retuned to black + gold bases with baked-in
  scrims. `spotlight` overlays kept.

### Four cinematic worlds (black + gold)
Each chapter's scene got: gold light streaks (two sharp diagonals per scene),
key lights moved off the text column to the product side, larger hero ensembles
anchored to the floor, and a black/espresso base:
- **Coffee (01)** — key from upper-right, two gold streaks behind the pouch,
  pouch scaled 1.12× about its base.
- **The Cup (02)** — champagne world, two descending streaks, cup scaled 1.1×,
  table reflection confirmed below the floor line.
- **Tea (03)** — obsidian/emerald, key from upper-right, pale green streaks,
  pot scaled 1.08×.
- **Grains (04)** — charcoal/gold, descending gold streaks, bowl scaled 1.08×.

### Glass reduction
- **Removed** the floating glass information panel entirely (duplicate of the
  meta data already in the copy). Replaced by a quiet hairline + italic
  eyebrow on the right — thin, transparent, no blur.
- Bottom controls: the two glass pills are gone; replaced with hairline dashes
  (active = gold), a serif numeral counter `01 / 04`, and three circular-outline
  ghost buttons (prev / play-pause / next). All preserve existing behaviour
  (auto, pause, dots, keyboard arrows).
- Header glass on scroll **kept** (usability), everything else reduced.

## Verification

- `npx tsc --noEmit` — pass
- `npm run lint` — pass
- `npm run build` — pass (Next.js 16.3.3 / Turbopack, 7 routes)
- Playwright QA at **390 / 430 / 768 / 1280**:
  - overflow X: **0 at every viewport** (the previous 768px 18px Provenance
    residual is gone — full-bleed fixed it)
  - hero scene now fills the whole section: 1280×835 at 1280, 390×287 at 390
  - headlines render as monumental all-caps Cormorant ("THE VOLCANIC
    HIGHLANDS, IN A SINGLE CUP.", etc.) — copy unchanged, only casing applied
  - header transparent at top → `rgba(14,11,8,0.66)` + `blur(18px)` on scroll
  - all 4 chapters switch; dot navigation, prev/next, pause all functional
  - **no console/page errors** on `/`
- Pixel measurements at 1280 (scene box = full hero, products grounded):
  - ch1 11.4% mass / 37% span · ch2 30% mass / 55% span (reflection confirmed:
    2260 cream px below the floor line) · ch3 18% mass / 66% span (airs by
    design) · ch4 31% mass / 60% span
  - every chapter reaches the floor band (`bottomTouch: true`); nothing floats

## Artifacts

QA: `qa-2d4.js` / `sig2d4-qa.json`; screenshots: `sig2d4-{390,430,768,1280}-ch1..4.png`
under `C:\Users\Admin\AppData\Local\Temp\opencode\`.

## Remainder

- The reference's horticulture tile is a purple dragon fruit; our horticulture
  nod is a single olive leaf. Deliberate divergence from AGENTS.md's
  "natural green / fresh earth" accent — flagged for decision.
- Scenes are still generated SVGs until client photography arrives; the
  `ChapterVisual` swap point is preserved for that.
- No commit made (not requested). No unrelated files touched.