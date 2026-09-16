# SLICE 19.3.3 — Premium Category Hover Refinement

## What Caused the Rectangular Panel Look

The previous implementation had three compounding issues:

1. **`.category-glass` had `background: rgba(26,20,16,0.55)`** — a 55% opaque dark fill. This is a heavy solid-looking panel, not translucent glass.

2. **`.category-glass-gradient` at `opacity: 0.55`** on top of the dark fill made the combined result near-opaque. The category gradient was visible but the overall effect was a solid colored rectangle.

3. **`width: 82%; margin: 0 auto; border-radius: 40px 40px 0 0`** — created a visible dome/card shape. Combined with the heavy fill, this read as "UI card sliding over image" rather than "atmospheric layer."

4. **`::before` glow pseudo-element** with `radial-gradient` + `filter: blur(12px)` added a neon-ish highlight at the dome edge.

The result: a large, obvious, semi-opaque rectangular panel — the opposite of premium.

---

## Gradient Token Values (verified)

| Token | Value |
|---|---|
| `--gradient-coffee` | `linear-gradient(135deg, #e08a3c 0%, #c25a1f 50%, #5f2d14 100%)` |
| `--gradient-tea` | `linear-gradient(135deg, #8fbc66 0%, #4e7a3f 50%, #1c3324 100%)` |
| `--gradient-horticulture` | `linear-gradient(135deg, #c4cf5e 0%, #82902c 50%, #3a4410 100%)` |
| `--gradient-grains` | `linear-gradient(135deg, #f0b93f 0%, #d99d2d 50%, #5e4512 100%)` |

---

## What Changed

### Glass System (complete rewrite)

| Property | Before (broken) | After (premium) |
|---|---|---|
| `.category-glass` background | `rgba(26,20,16,0.55)` — heavy dark fill | **none** — transparent, backdrop-filter does the work |
| `.category-glass` dimensions | `width:82%; height:52%; border-radius:40px` — visible dome/card | `inset:0` — full-bleed, no visible boundary |
| `.category-glass` backdrop-filter | `blur(14px) saturate(140%)` | `blur(16px) saturate(130%)` |
| `.category-glass-gradient` opacity | `0.55` on hover — heavy color | `0.14` on hover — subtle tint |
| `::before` glow | radial-gradient + blur — neon effect | **removed** |
| `.category-dome-glow` div | separate DOM element | **removed** |

### Glass Architecture

```
Photo (img)
  → .category-scrim (always, dark bottom gradient for text readability)
    → .category-glass (full-bleed, NO background, ONLY backdrop-filter)
      → .category-glass-gradient (category gradient at 14% opacity — subtle tint)
    → .category-shine (specular sweep across full tile)
    → .category-content (eyebrow + title, z-index:10)
```

The glass is now a **transparent atmospheric layer** — `backdrop-filter: blur(16px) saturate(130%)` blurs the photo beneath, and the gradient at 14% adds a whisper of category color. No solid fill. No visible rectangular boundary. No dome shape. The photo remains the hero.

### Specular Sweep

| Property | Before | After |
|---|---|---|
| Gradient stops | `transparent 38%, white(0.10) 46%, white(0.06) 50%, transparent 58%` | `transparent 0-35%, white(0.07) 45%, white(0.04) 50%, transparent 60-100%` |
| Duration | 650ms | 500ms |
| Keyframes | 2-stop (start→end) | 3-stop (start→hold→end) for smoother fade |
| z-index | none | 5 (above glass, below content) |

The sweep is softer (7% peak vs 10%), wider spread, and slightly faster. It reads as "light catching glass" not "animated gradient."

### Tile Lift

| Property | Before | After |
|---|---|---|
| translateY | -4px | -3px |
| box-shadow | `0 18px 48px -12px` | `0 14px 40px -10px` |

Subtler lift, softer shadow. Premium, not SaaS.

### Hover Choreography (all CLS-safe)

| Element | Timing | Property |
|---|---|---|
| Image scale | 650ms, ease-smooth | `transform: scale(1.04)` |
| Tile lift | 500ms, ease-smooth | `transform: translateY(-3px)` |
| Glass rise | 450ms, ease-smooth | `opacity: 0→1; transform: translateY(10px→0)` |
| Gradient tint | 420ms + 40ms delay | `opacity: 0→0.14; transform: translateY(6px→0)` |
| Specular sweep | 500ms, ease-smooth | `translateX(-100%→100%)` |
| Accent line | 400ms, ease-smooth | `scaleX(0→1)` |

### Readability

- Title: `#F5F0E8` with `text-shadow: 0 2px 18px rgba(18,13,8,0.50)` — always readable
- Eyebrow: `#E8E4DC` with `::before` scrim `rgba(18,13,8,0.55)` — always readable
- Scrim: `linear-gradient(180deg, transparent 0-25%, rgba(26,20,16,0.22) 50%, rgba(26,20,16,0.60) 70%, rgba(26,20,16,0.90) 100%)` — strong bottom darkening

The scrim + glass together ensure text is readable at every stage: rest, transition, full hover, mouse-out.

### Touch/Reduced Motion

- Touch (`hover:none`): glass visible at rest, gradient at 12%, no shine
- Reduced motion: end-state preserved (glass + gradient visible), all movement/sweep removed

---

## Validation

| Check | Result |
|---|---|
| `npm run build` | ✅ Compiled successfully |
| Hero untouched | ✅ No HeroSlideshow.tsx or hero CSS edits |
| Nav untouched | ✅ No nav structure/CSS edits |
| Tile height untouched | ✅ `aspect-ratio: 3/4` unchanged |
| Eyebrow labels untouched | ✅ `::before` scrim unchanged |
| 19.4/19.5 off-limits | ✅ |
| New images/fonts/dependencies | ✅ None |
| Protected/backend files | ✅ Untouched |
| CLS safety | ✅ Only transform, opacity, backdrop-filter animated |
| Browser visual check | ⚠️ No browser/visual tool available — all claims structural only |
| No commit | ✅ |

---

## Files Changed

| File | Changes |
|---|---|
| `src/app/globals.css` | Rewrote `.category-glass` (removed heavy fill, full-bleed, backdrop-filter only); rewrote `.category-glass-gradient` (opacity 0.55→0.14); removed `::before` glow; rewrote `.category-shine` (softer sweep, 500ms); softened tile lift (-4px→-3px); updated touch/reduced-motion queries |
| `src/components/CategoryDiscovery.tsx` | Removed `--glow-color` variable from glass div; simplified glass structure (removed dome-glow div) |

---

## Honest Note

I cannot visually confirm the result. The previous 19.3.3 and 19.3.4 attempts also looked correct in source but rendered poorly. The core fix here is architectural: removing the heavy `rgba(26,20,16,0.55)` fill and the 82% dome shape, replacing with a full-bleed transparent backdrop-filter layer. This should eliminate the "rectangular panel" look by design — there is no visible boundary to render as a rectangle. But please verify in a browser.
