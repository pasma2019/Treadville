# SLICE 19.3.4 — Category Tile Hover: Dome Shape + Real Glass Tint

## What Was Wrong (19.3.3)

The previous implementation had correct CSS *definitions* for the dome shape, gradient overlay, and glow — but the architecture had structural issues that caused it to render as a flat rectangle:

1. **`.category-glass` used `left: 50%; transform: translateX(-50%)`** — this positioning technique can fail when the element has no explicit `height` and `overflow: hidden` clips children. The element may collapse or misposition.

2. **Dome glow was a separate `<div class="category-dome-glow">`** — with no explicit `width`/`height`, the element may have zero rendered dimensions.

3. **Gradient overlay opacity was only `0.38`** — combined with the dark scrim background `rgba(26,20,16,0.55)`, the category gradient was still too faint to read as category-colored.

4. **The `backdrop-filter` was on the glass container** — but the container's positioning issues meant the frost effect wasn't visible.

---

## Gradient Token Values (verified in `:root`)

| Token | Value |
|---|---|
| `--gradient-coffee` | `linear-gradient(135deg, #e08a3c 0%, #c25a1f 50%, #5f2d14 100%)` |
| `--gradient-tea` | `linear-gradient(135deg, #8fbc66 0%, #4e7a3f 50%, #1c3324 100%)` |
| `--gradient-horticulture` | `linear-gradient(135deg, #c4cf5e 0%, #82902c 50%, #3a4410 100%)` |
| `--gradient-grains` | `linear-gradient(135deg, #f0b93f 0%, #d99d2d 50%, #5e4512 100%)` |

All four tokens exist and are accessible via `var(--gradient-coffee)` etc.

---

## Fix: What Changed

### Architecture Simplification

**Before (19.3.3):**
- Glass: `left: 50%; transform: translateX(-50%)` — unreliable centering
- Glow: separate `<div class="category-dome-glow">` — no explicit dimensions
- Gradient: `opacity: 0.38` — too faint

**After (19.3.4):**
- Glass: `left: 0; right: 0; width: 82%; margin: 0 auto` — reliable centering via auto margin
- Glow: `::before` pseudo-element on `.category-glass` — uses parent dimensions as reference
- Gradient: `opacity: 0.55` — clearly category-colored

### CSS Changes (`globals.css`)

```css
.category-glass {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 82%;
  margin: 0 auto;
  height: 52%;
  border-radius: 40px 40px 0 0;  /* strong dome top */
  background: rgba(26,20,16,0.55);
  backdrop-filter: blur(14px) saturate(140%);
  overflow: hidden;
}

.category-glass::before {
  /* Glow: radial gradient using category color */
  background: radial-gradient(ellipse, var(--glow-color, rgba(184,134,11,0.4)), transparent 70%);
  top: -20px;
  width: 65%;
  height: 60px;
  border-radius: 50%;
}

.category-glass-gradient {
  /* Gradient fills the dome, visible through frost */
  opacity: 0.55 on hover (was 0.38)
}
```

### TSX Changes (`CategoryDiscovery.tsx`)

- Removed separate `<div class="category-dome-glow">` element
- Added `style={{ "--glow-color": gv }}` to `.category-glass` div (passes category gradient color to `::before`)
- Glow is now rendered by CSS `::before` pseudo-element — no extra DOM node

### Hover State (on `.category-tile:hover`)

| Layer | Opacity | Effect |
|---|---|---|
| `.category-glass` | 1 | Dome visible, backdrop-filter frost active |
| `.category-glass::before` | 1 | Category-colored glow at dome top edge |
| `.category-glass-gradient` | 0.55 | Category gradient visible through frost |
| `.category-shine` | animation | Specular sweep across full tile |

### Text Safety

Content has `p-4 md-p-6` (16px/24px padding). Dome height is `52%`. On a 3:4 tile (e.g. 400px tall), dome is ~208px. Text sits at `bottom-0` with 16-24px padding. Title is in the bottom ~60px of the tile. Dome top edge is at ~192px from bottom. Title top is at ~80px from bottom. Gap between title top and dome top edge: ~112px. Well above the 20px minimum.

### CLS Safety

All animations use only: `transform`, `opacity`, `backdrop-filter`. No layout properties animated.

---

## Validation

| Check | Result |
|---|---|
| `npm run build` | ✅ Compiled successfully (TypeScript + static generation) |
| Hero untouched | ✅ No HeroSlideshow.tsx or hero CSS edits |
| Tile height untouched | ✅ `aspect-ratio: 3/4` unchanged |
| Eyebrow labels untouched | ✅ `::before` scrim unchanged |
| Nav logo untouched | ✅ No nav CSS edits |
| 19.4/19.5 off-limits | ✅ |
| Browser visual check | ⚠️ No browser/visual tool available — all claims are structural (source-based reasoning only) |
| No commit | ✅ |

---

## Files Changed

| File | Changes |
|---|---|
| `src/app/globals.css` | Rewrote `.category-glass` (centering via margin:auto, explicit height 52%, border-radius 40px); replaced `.category-dome-glow` div with `::before` pseudo (radial-gradient glow); gradient opacity 0.38→0.55; cleaned touch/reduced-motion queries |
| `src/components/CategoryDiscovery.tsx` | Removed dome-glow div; added `--glow-color` CSS variable to glass element |

---

## Honest Note

I cannot visually confirm the dome + glow render correctly. The CSS structure is sound (reliable centering, explicit dimensions, pseudo-element glow with category color), but without a browser preview, I cannot guarantee the visual result matches the intended design. The previous 19.3.3 attempt also looked correct in source but rendered as a flat rectangle — so please verify in a browser.
