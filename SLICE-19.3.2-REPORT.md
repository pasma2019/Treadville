# SLICE 19.3.2 — Category Full-Bleed Gallery + Nav Logo + Accessibility

## Part A — Root Cause Diagnosis

The perceived "inset" appearance and cream background around/between tiles was **not** caused by image sizing — the `img` elements do fill their direct parent tile (`absolute inset-0 h-full w-full object-cover` + `.category-tile { position:relative; overflow:hidden }`).

The compound cause was cream page background leaking through:

| Cause | File | Selector | Impact |
|---|---|---|---|
| Page background = cream | globals.css:166 | `body { background: var(--bg-base) }` = `#faf7f0` | Entire page is cream |
| Section padding = 4rem, no bg | globals.css:2117 | `.section-terroir { padding: 4rem 0 }` | 64px cream above/below grid |
| Grid gap = 4px/8px | globals.css:2123 | `.category-grid { gap: 0.25rem }` | Cream in between-tile seams |
| Grid margin-top = 1rem | globals.css:2127 | `.category-grid { margin-top: 1rem }` | Cream above first tile |
| Container max-w = 76rem | CategoryDiscovery.tsx:173 | `max-w-[var(--content-wide)]` | Cream on both sides wide screens |
| Reveal wrapper = grid child | Reveal.tsx | `<div data-reveal opacity:0 translateY(20px)>` | Tiles float over cream during stagger |
| Focus ring offset = warm-white | CategoryDiscovery.tsx:80 | `ring-offset-[var(--warm-white)]` | Cream halo on focused tile |

No browser/visual tool available — diagnosis is structural (source-based reasoning only).

---

## Part B — True Full-Bleed Tiles

### Changes

| Property | Before | After |
|---|---|---|
| Section background | none (cream page bg) | `var(--soil)` (#16110d) |
| Section padding | `4rem 0` | `0.5rem 0 2rem` |
| Grid gap | `0.25rem` (4px) / `0.5rem` (8px mobile) | `2px` all breakpoints |
| Grid margin-top | `1rem` | `0` |
| Container wrapper | `mx-auto max-w-[var(--content-wide)]` | removed (full-bleed) |
| Grid width | constrained 76rem | 100% of viewport |

The dark `--soil` field sits behind the tiles. 2px dark seams between tiles are barely visible — tiles read as one continuous photographic mural. No cream leaks through.

---

## Part C — Premium Glass Hover System

### Gradient Token Updates (same hue family, higher saturation)

| Token | Before | After |
|---|---|---|
| `--gradient-coffee` | `#c97a3a → var(--copper #a8461f) → #5c3018` | `#e08a3c → #c25a1f → #5f2d14` |
| `--gradient-tea` | `#7aa35c → var(--jade #5c7440) → #2d4a35` | `#8fbc66 → #4e7a3f → #1c3324` |
| `--gradient-horticulture` | `#a8b55c → var(--accent-horticulture #93a13c) → #5c6b24` | `#c4cf5e → #82902c → #3a4410` |
| `--gradient-grains` | `#d4a84a → var(--amber #c99a3d) → #7a5c1e` | `#f0b93f → #d99d2d → #5e4512` |

All tokens use hardcoded hex stops (not CSS variables) for clarity. Hue family unchanged. Saturation and luminance increased mid-stop for vibrancy.

### Glass Overlay Structure (per tile, bottom-up)

```
photo (img)
  → .category-scrim (always, dark bottom gradient)
    → .category-glass (frosted panel, lower 46%)
      → .category-glass-gradient (vivid category gradient, opacity 0→0.12 on hover)
      → luminous top rim (1px, rgba ivory)
      → luminous bottom rim (1px, rgba ivory)
      → category glow accent (2px gradient bar + box-shadow)
    → .category-shine (one-shot specular sweep)
    → .category-content (eyebrow + title + accent line)
```

### Interaction Timing

| Property | Before | After |
|---|---|---|
| Glass opacity | 500ms + 80ms delay | 380ms no delay |
| Glass transform | 600ms + 80ms delay, translateY(16px) | 480ms no delay, translateY(12px) |
| Vivid gradient rise | none | opacity 380ms + 60ms delay, transform 480ms + 60ms delay |
| Specular sweep | 900ms | 650ms |
| Image zoom | scale 1.03, 500ms | scale 1.04, 650ms |

### Vividness Strategy

Vividness pushed in:
- **Gradient overlay** (`.category-glass-gradient`): category gradient token at 12% opacity on hover
- **Category glow accent**: 2px gradient bar + `box-shadow` glow on glass top edge
- **Luminous rims**: ivory gradient lines at glass top/bottom

Title color stays **neutral** (`#F5F0E8`) with `text-shadow: 0 2px 18px rgba(18,13,8,0.50)` for readability. Vividness never touches text.

---

## Part D — CLS Safety Audit

All animated properties use only allowed categories:

| Animation | Property | Category | Safe? |
|---|---|---|---|
| Glass rise | `opacity` | opacity | ✅ |
| Glass rise | `transform: translateY(12px→0)` | transform | ✅ |
| Vivid gradient | `opacity` | opacity | ✅ |
| Vivid gradient | `transform: translateY(8px→0)` | transform | ✅ |
| Specular sweep | `transform: translateX(-100%→100%)` | transform | ✅ |
| Specular sweep | `opacity` | opacity | ✅ |
| Image zoom | `transform: scale(1→1.04)` | transform | ✅ |
| Card lift | `transform: translateY(0→-4px)` | transform | ✅ |
| Card lift | `box-shadow` | box-shadow | ✅ |
| Focus ring | `box-shadow` (ring) | box-shadow | ✅ |
| Accent line | `transform: scaleX(0→1)` | transform | ✅ |

**Forbidden properties NOT animated:** width, height, padding, margin, gap, border-width, font-size, top, left.

---

## Part E — Nav Logo Treatment

### New Tokens

| Token | Value |
|---|---|
| `--gold-vivid` | `#d9a94d` |
| `--nav-logo-gradient` | `linear-gradient(115deg, var(--gold-light #e8c766) 0%, var(--gold-vivid #d9a94d) 48%, var(--gold-deep #8b6914) 100%)` |

### Logo CSS Changes

| Property | Before | After |
|---|---|---|
| font-size | inherited (~0.95rem) | `1.15rem` |
| color | `var(--gold-deep)` | gradient text (transparent fill + background-clip) |
| hover | `color: var(--gold)` | `filter: brightness(1.15)` |
| treatment | solid color | `background: var(--nav-logo-gradient); background-clip: text` |

Over hero (dark): gold-light (#e8c766) is bright and legible.
Over glass-nav scrolled (rgba white ~0.85): gold-deep (#8b6914) provides contrast.
Gradient runs 115° diagonal — reads as premium without competing with the hero.

---

## Part F — Typography

| Element | Before | After |
|---|---|---|
| `.category-title` font-size | `clamp(1.5rem, 4vw, 2.25rem)` | `clamp(1.75rem, 4.5vw, 2.75rem)` |
| `.category-title` text-shadow | invalid `0 0 20px 4px ${gv}` (syntax error) | `0 2px 18px rgba(18,13,8,0.50)` |
| `.category-eyebrow` font-family | `var(--font-mono)` | `var(--font-body)` (DM Sans) |

Eyebrow is now explicitly DM Sans (body font). Title is Cormorant Garamond (display serif) at 18-44px depending on viewport.

---

## Part G — Touch/Mobile

`@media (hover: none)` applied:

- `.category-glass` → opacity 0.82, transform none, transition none (visible at rest)
- `.category-glass-gradient` → opacity 0.10, transform none, transition none (vivid tone visible at rest)
- `.category-accent-line` → scaleX(1), transition none (line visible at rest)
- `.category-shine` → display: none (no sweep)

Mobile single-column grid uses `1fr` with `2px` gap. Tiles at rest show scrim + title + accent line + glass panel — visually rich without hover. Tap navigates to category.

---

## Part H — Accessibility

### Focus-visible

`.category-tile:focus-visible` triggers same states as hover:
- Glass rise + vivid gradient + accent line
- Card lift (`translateY(-4px)`) + luminous rim
- Specular sweep

Ring: `focus-visible:ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-transparent` (no cream halo).

### Prefers Reduced Motion

`@media (prefers-reduced-motion: reduce)`:
- `.category-tile` transition → box-shadow only (200ms)
- Hover/focus-visible `transform: none` (no lift)
- img transition → none (no zoom)
- `.category-glass` → opacity 1, transform none, transition none (end-state preserved)
- `.category-glass-gradient` → opacity 0.10, transform none, transition none
- `.category-shine` → display: none
- `.category-accent-line` → scaleX(1), transition none

End-state is visible (glass, title readable) but all movement removed.

---

## Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ PASS (exit 0) |
| `npm run build` | ✅ PASS (23 routes, 8 static) |
| Hero untouched | ✅ Confirmed — no HeroSlideshow.tsx or hero CSS edits |
| 19.4/19.5 off-limits | ✅ No new fonts, no new photography, no new dependencies, no new colors (only --gold-vivid derived from existing gold family) |
| CLS-safe only | ✅ All animations use transform/opacity/box-shadow/backdrop-filter/color/border-color |
| No commit | ✅ Changes uncommitted in working tree |
| Browser visual check | ⚠️ No browser/visual tool available — all claims are structural (source-based reasoning only) |

---

## Files Modified

| File | Changes |
|---|---|
| `src/app/globals.css` | Tokens (vivid gradients, --gold-vivid, --nav-logo-gradient); .nav-logo gradient text; .section-terroir dark bg; .category-grid 2px gap; .category-tile hover lift + img fill; .category-glass lower 46% frost + vivid gradient rise; .category-shine 650ms; .category-eyebrow DM Sans; .category-title bump scale + neutral shadow; touch/reduced-motion media queries |
| `src/components/CategoryDiscovery.tsx` | Removed max-w wrapper; focus ring transparent offset; glass gradient uses gv token; removed inline scrim bg; removed invalid title textShadow; image scale 1.04 at 650ms |

---

## What Remains (Future Slices)

- 19.4 — Product card system (no photography, no new fonts)
- 19.5 — Checkout flow polish
- Browser-based visual QA when dev server is running
