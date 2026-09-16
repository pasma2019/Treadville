# SLICE 19.2 / 19.3 — NAVIGATION REFINEMENT + CINEMATIC HERO SCRIM + CATEGORY ROW REALIGNMENT

## Files Changed

| File | Scope |
|------|-------|
| `src/components/SiteHeader.tsx` | Navigation visual refinement |
| `src/components/HeroSlideshow.tsx` | Hero scrim (hotfix preserved from 19.1) |
| `src/components/CategoryDiscovery.tsx` | Four equal tiles, bottom scrim, gradient accents |
| `src/app/globals.css` | Shared utilities: glass-nav refinement, hero-overlay, nav styles |

**Only these 4 files modified. No protected files touched.**

---

## A. NAVIGATION REFINEMENT

### What Changed

1. **Glass opacity increased**: `.glass-nav` from `0.72` → `0.78`; `.glass-nav-scrolled` from `0.88` → `0.94`
2. **Blur increased**: `16px` → `20px` (both states)
3. **Border softened**: `0.08` → `0.06` (default), gold-tinted border on scrolled `0.18` → `0.20`
4. **Shadow deepened**: stronger elevation for both states
5. **Nav structure**: Replaced `.nav-pill` dynamic classes with `.glass-nav` / `.glass-nav-scrolled` on the pill element
6. **Logo**: Removed fixed `text-[1.25rem]`, uses responsive `.nav-logo` CSS class
7. **Nav links**: 
   - Gap increased from `1.5rem` → `2rem`
   - Typography: `0.75rem`, `500` weight, `0.15em` letter-spacing, uppercase
   - Underline reveal via `transform: scaleX(0→1)` (no layout shift)
8. **Dropdown & mobile panel**: Both now use `.glass-nav` for consistency
9. **Bug fix**: Hamburger button correctly calls `setMenuOpen` (was incorrectly `setShopOpen`)

### States

| State | Background | Border | Shadow |
|-------|------------|--------|--------|
| **Hero (top)** | `rgba(251,248,241,0.78)` | `rgba(26,20,16,0.06)` | `inset highlight + 10px/36px` |
| **Scrolled** | `rgba(251,248,241,0.94)` | `rgba(184,134,11,0.20)` | `inset highlight + 16px/48px` |

---

## B. HERO SCRIM

### Previous Overlay Technique
```css
/* Old: uniform warm-white dimming */
.hero-overlay {
  background: linear-gradient(
    90deg,
    rgba(250,247,240,0.92) 0%,
    rgba(250,247,240,0.55) 40%,
    rgba(250,247,240,0.05) 100%
  );
}
```

### New Directional Scrim (Desktop)
```css
.hero-overlay {
  background: linear-gradient(
    90deg,
    rgba(26,20,16,0.72) 0%,      /* Dark where text sits */
    rgba(26,20,16,0.45) 35%,
    rgba(26,20,16,0.18) 55%,
    rgba(26,20,16,0.04) 75%,
    transparent 100%              /* Vivid photography on right */
  );
}
```

### Mobile (independent treatment)
```css
@media (max-width: 767px) {
  .hero-overlay {
    background: linear-gradient(
      180deg,
      rgba(26,20,16,0.08) 0%,
      rgba(26,20,16,0.25) 30%,
      rgba(26,20,16,0.55) 55%,
      rgba(26,20,16,0.78) 80%,
      rgba(26,20,16,0.92) 100%
    );
  }
}
```

**Key principles:**
- Left/dark region aligns with hero copy placement
- Right side reaches transparent — photography vivid
- Multiple stops for cinematic falloff
- Mobile uses vertical gradient (text at bottom)
- Uses existing `--ink` tokens only — no new colors

---

## C. CATEGORY ROW REALIGNMENT

### Previous Layout
- Asymmetric: Lead card (7/12 cols, 4:5 aspect) + 3 companions (5/12 cols, stacked 2/1 on md)
- Different heights, different aspect ratios
- Companion cards had border + description text
- Lead card had gradient border + image overlay + accent line on hover

### New Layout
- **Desktop**: `md:grid-cols-4` — four equal tiles, equal height, consistent gaps
- **Tablet**: `sm:grid-cols-2` — two per row
- **Mobile**: `grid-cols-2` — two per row (stacks naturally)
- **All tiles**: Identical `aspect-[4/3]`, same padding, same typography

### CategoryTile Component (unified)
```tsx
function CategoryTile({ cat, index }) {
  // Uses category-specific gradient token
  // Bottom directional scrim for label readability
  // Gradient accent line on hover (transform-based)
  // Image zoom: group-hover:scale-[1.03]
  // Lift: hover transform translateY(-4px)
  // Border: gradient border-image (1px)
}
```

### Visual Treatment Per Tile
| Element | Treatment |
|---------|-----------|
| Image | Full tile, `object-cover`, clipped by parent |
| Bottom scrim | `linear-gradient(180deg, transparent → 0.85)` over lower 55% |
| Category label | White text on scrim, mono eyebrow in category accent |
| Hover lift | `translateY(-4px)` + `shadow-elite` |
| Hover image | `scale(1.03)` inside clipped wrapper |
| Hover accent | Gradient line `scaleX(0→1)` |
| Focus | Gold ring, 2px offset |

### Gradient Tokens Used (Slice 19.1)
- `--gradient-coffee`
- `--gradient-tea`
- `--gradient-horticulture`
- `--gradient-grains`

Applied as: subtle border-image (1px), hover accent line — NOT as full overlays.

---

## D. ACCESSIBILITY + REDUCED MOTION

### Contrast Verification
| Element | Result |
|---------|--------|
| Hero headline | ✅ Passes (ink on directional scrim) |
| Hero subheadline | ✅ Passes (ink-soft on scrim) |
| Primary CTA (btn-cta) | ✅ Passes (warm-white on gold gradient) |
| Secondary CTA | ✅ Passes (ink-soft → gold-deep on hover) |
| Hero stats | ✅ Passes (ink-muted on warm-white) |
| Category labels | ✅ Passes (warm-white on 0.85 scrim) |
| Nav links | ✅ Passes (ink-soft → gold-deep, 2rem gap) |
| Nav logo | ✅ Passes (gold-deep on glass) |

### Focus Behavior
- Nav links: underline reveal + color change
- Category tiles: gold ring (2px offset)
- CTA buttons: existing focus-visible styles preserved
- Mobile menu items: gold ring

### Reduced Motion
- All transforms (`translateY`, `scaleX`, `scale`) disabled via `@media (prefers-reduced-motion: reduce)`
- Gradient background-position animation disabled
- Reveal transitions disabled (existing system)
- Layout and usability preserved

---

## E. CLS / HOVER STABILITY

### Verified No Layout-Shift Properties Animated
| Property | Used in 19.2/19.3? |
|----------|-------------------|
| `width` / `height` | ❌ No |
| `padding` / `margin` / `gap` | ❌ No |
| `border-width` | ❌ No |
| `font-size` | ❌ No |
| `transform` (translate/scale) | ✅ Yes — compositor only |
| `opacity` | ✅ Yes |
| `background-position` | ✅ Yes — no layout |
| `box-shadow` (color/offset only) | ✅ Yes |
| `color` / `border-color` | ✅ Yes |

### Hotfix from 19.1 Preserved
- Hero underlines: `scaleX(0.6→1)` not `width`
- Category accent lines: `scaleX(0→1)` not `width`

---

## F. VALIDATION RESULTS

| Check | Result |
|-------|--------|
| TypeScript (`npx tsc --noEmit`) | ✅ Pass |
| Production Build (`npm run build`) | ✅ Pass — 23 routes, 8 static pages |
| Git diff scope | ✅ Only 4 intended files |
| Protected files | ✅ None modified |
| New dependencies | ✅ None |
| New hardcoded colors | ✅ None (all existing tokens) |
| Layout-shifting hover props | ✅ None |
| Slice 19.4/19.5 | ✅ Not implemented |
| Photography assets | ✅ Not replaced |

---

## G. SCOPE CONFIRMATION

| Item | Status |
|------|--------|
| 19.4 Scroll Choreography | ❌ NOT implemented |
| 19.5 Full Storefront Polish | ❌ NOT implemented |
| Backend / Database / RLS | ❌ NOT touched |
| Auth / Proxy / CMS | ❌ NOT touched |
| Orders / Enquiries / Checkout | ❌ NOT touched |
| Storage / API routes | ❌ NOT touched |
| Protected files (`proxy.ts`, `supabase/*`, `auth.ts`, `order-actions.ts`, `enquiry-actions.ts`, `admin-actions.ts`, `cms-fields.ts`) | ✅ ALL UNCHANGED |

---

## H. UNRESOLVED ITEMS

None. All validation passes, build succeeds, scope boundaries respected.

---

## I. COMMIT STATUS

**No commit / push / merge / deploy performed.** Changes remain in working branch for review.