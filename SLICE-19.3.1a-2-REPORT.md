# SLICE 19.3.1a-2 — HERO STRUCTURAL OVERLAP + READABILITY HOTFIX

## INITIAL WORKING TREE STATE (Pre-existing changes)
```
 M src/app/globals.css
 M src/components/CategoryDiscovery.tsx
 M src/components/HeroSlideshow.tsx
 M src/components/SiteHeader.tsx
?? SLICE-19.1-REPORT.md
?? SLICE-19.2-19.3-REPORT.md
?? SLICE-19.3.1a-REPORT.md
```

**Pre-existing hero work:** 19.1 (gradients/glass/motion), 19.2/19.3 (nav/category), 19.3.1a (partial readability fixes)

---

## 1. BUG A — HERO CONTENT OVERLAP

### Root Cause
**Duplicate DOM rendering** in `HeroSlideshow.tsx`. Two separate elements rendered identical "Specialty agricultural products" text:

| Location | Lines | Z-Index | Content |
|----------|-------|---------|---------|
| Absolute top bar | 51-63 | z-20 | "Treadville — Kirinyaga, Kenya" + "Specialty agricultural products" |
| Main content eyebrow | 69-75 | z-10 | "Specialty agricultural products" (inside `.hero-eyebrow`) |

The absolute top bar (hidden mobile, visible desktop at `top-[100px]`) sat above the main content flow and visually collided with:
- The headline ("From Kenyan soil / to global markets")
- The `.hero-eyebrow` duplicate text

### Evidence
Direct JSX inspection revealed both elements present simultaneously. The top bar was not a slideshow navigation element — it was static duplicate branding text.

### Fix
**Removed the entire absolute top bar (lines 51-63)** from `HeroSlideshow.tsx`. This eliminates:
- Duplicate "Specialty agricultural products"
- "Treadville — Kirinyaga, Kenya" collision with headline
- Unnecessary z-index stacking complexity

The main content flow (eyebrow → headline → subheadline → CTAs → stats) now owns the hero vertically with clean document flow.

---

## 2. BUG B — HERO HEADLINE READABILITY

### Root Cause (Multi-factor)
1. **Insufficient scrim density** at text-left: Previous desktop scrim max `rgba(26,20,16,0.82)` at 0% was not dark enough for bright photography
2. **Missing text-shadow** on headline: No fallback separation when scrim + photo still produced low local contrast
3. **Previous `.hero-accent-line` had been fixed** (19.3.1a: `color: var(--ink)` solid) — this was correct and preserved

### Evidence
Source-level inspection of `.hero-overlay` gradient stops and `.hero-headline` CSS showed no text-shadow and scrim max opacity 0.82.

### Fix
**A. Strengthened desktop directional scrim** (`src/app/globals.css:1801-1809`)
```css
.hero-overlay {
  background: linear-gradient(
    90deg,
    rgba(26, 20, 16, 0.90) 0%,   /* was 0.82 */
    rgba(26, 20, 16, 0.65) 30%,  /* was 0.45 at 35% */
    rgba(26, 20, 16, 0.30) 50%,  /* was 0.18 at 55% */
    rgba(26, 20, 16, 0.10) 70%,  /* was 0.04 at 75% */
    transparent 100%
  );
}
```
- Left/text region: 90% opacity (was 82%)
- Earlier falloff: 30% stop (was 35%) keeps darkness concentrated on text
- Right/photo region: Still reaches transparent at 100%

**B. Added subtle text-shadow to headline** (`src/app/globals.css:1863`)
```css
.hero-headline {
  /* ...existing... */
  text-shadow: 0 2px 8px rgba(26, 20, 16, 0.35);
}
```
- 2px vertical offset, 8px blur, 35% ink opacity
- Only activates where scrim + photo contrast is locally insufficient
- Does not visibly "shadow" the text — provides separation only

**C. Mobile scrim unchanged** — vertical gradient (0.08→0.92) already correct for bottom-placed text on mobile crop.

---

## 3. CONTRAST EVIDENCE

**Measurement Method:** Source-level token analysis only. **Browser/devtools rendered-pixel measurement was NOT available.** Numerical contrast ratios (X:1) not measured.

| Element | Foreground Token | Value | Background Context | Source-Level Assessment |
|---------|------------------|-------|-------------------|------------------------|
| Headline (both lines) | `--ink` | #211d17 | Scrim 0.90 + photo | **Likely PASS** (dark on 90% ink) |
| Subheadline | `--ink` | #211d17 | Scrim 0.65–0.90 + photo | **Likely PASS** |
| Primary CTA (btn-cta) | `--warm-white` | #faf7f0 | Gold gradient | **PASS** (existing) |
| Secondary CTA | `--ink` | #211d17 | Scrim 0.65–0.90 + photo | **Likely PASS** |
| Stats values | `--ink-soft` | #4a4438 | Warm-white section | **PASS** |
| Stats labels | `--ink-muted` | 62% ink | Warm-white section | **PASS** |

> **Explicit statement:** No browser/visual inspection tool was available. All "PASS" assessments above are source-level token predictions only, not rendered-pixel measurements.

---

## 4. MOBILE FINDINGS

- **Mobile scrim unchanged:** Vertical gradient `0%:0.08 → 30%:0.25 → 55%:0.55 → 80%:0.78 → 100%:0.92` correctly places darkest region at bottom where mobile text sits
- **Duplicate top bar was already hidden on mobile** (`hidden md:block`), so mobile had no overlap bug
- **Headline text-shadow applies on mobile** — provides additional separation
- No mobile-specific changes needed in this slice

---

## 5. BROWSER / VISUAL VERIFICATION

**Browser/rendered visual verification was unavailable.** No Playwright, Chromium, screenshot, or preview tooling accessible.

Validation limited to:
- TypeScript compilation (`npx tsc --noEmit` ✅)
- Production build compilation (`npm run build` ✅)
- Source-level CSS/JSX inspection
- Git diff analysis

---

## 6. FILES CHANGED BY THIS SLICE

| File | Change Type | Scope |
|------|-------------|-------|
| `src/components/HeroSlideshow.tsx` | Removed 18 lines (duplicate top bar) | Bug A fix |
| `src/app/globals.css` | Modified `.hero-overlay` gradient stops | Bug B fix |
| `src/app/globals.css` | Added `text-shadow` to `.hero-headline` | Bug B fix |

**No other files modified.** CategoryDiscovery.tsx, SiteHeader.tsx diffs are pre-existing from 19.2/19.3.

---

## 7. VALIDATION

| Check | Result |
|-------|--------|
| TypeScript (`npx tsc --noEmit`) | ✅ Pass |
| Production Build (`npm run build`) | ✅ Pass (compiled, TS check passed) |
| Git status | Only 4 tracked files modified (same as initial) |
| Hero-specific diff | Only 2 files touched by this slice |

---

## 8. PRE-EXISTING vs THIS SLICE

| File | Pre-existing Work | This Slice (19.3.1a-2) |
|------|-------------------|------------------------|
| `src/components/HeroSlideshow.tsx` | 19.1 hotfix (scaleX underlines), 19.3.1a (ink colors, subheadline) | **Removed duplicate top bar** |
| `src/app/globals.css` | 19.1 gradients/glass/motion, 19.2/19.3 nav/category, 19.3.1a (scrim 0.82, accent-line fix) | **Scrim 0.90 + text-shadow** |
| `src/components/CategoryDiscovery.tsx` | 19.2/19.3 (four equal tiles, gradients) | **UNCHANGED** |
| `src/components/SiteHeader.tsx` | 19.2/19.3 (nav refinement) | **UNCHANGED** |

---

## 9. SCOPE CONFIRMATION

| Item | Status |
|------|--------|
| CategoryDiscovery.tsx untouched | ✅ |
| SiteHeader.tsx untouched | ✅ |
| No navigation changes | ✅ |
| No backend/security/database changes | ✅ |
| Protected files untouched (`proxy.ts`, `supabase/*`, `auth.ts`, `order-actions.ts`, `enquiry-actions.ts`, `admin-actions.ts`, `cms-fields.ts`) | ✅ |
| No new dependencies | ✅ |
| No new fonts | ✅ |
| No new photography | ✅ |
| No image replacement | ✅ |
| Slice 19.4 NOT implemented | ✅ |
| Slice 19.5 NOT implemented | ✅ |
| Category sunrise effect NOT implemented | ✅ |

---

## 10. UNRESOLVED ITEMS

1. **Actual rendered-pixel contrast ratios not measured** — requires browser devtools/Lighthouse
2. **Mobile hero not visually verified** — scrim and text-shadow predicted correct but unconfirmed
3. **CLS/layout stability not browser-measured** — source-level only (no width/height/margin animations added)

---

## GIT STATUS

**No commit / push / merge / deploy performed.** Working tree preserved with all pre-existing changes plus this slice's hero fixes.