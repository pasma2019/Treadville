# PHASE 25 — PLAN: PRODUCTION LAUNCH + BRAND ASSET COMPLETION

**Date:** Phase 25 plan
**Status:** Aligned with audit findings

---

## 1. WHAT NEEDS TO CHANGE

### CRITICAL
1. `/public/og-default.png` — missing (referenced in layout.tsx)
2. `/public/icon.png` — missing (referenced in structured-data.tsx)

### HIGH
3. `.env.local.example` — incomplete (missing `SUPABASE_SERVICE_ROLE_KEY`)

### MEDIUM
4. `/public/apple-touch-icon.png` — bonus (not referenced but useful)

---

## 2. OG IMAGE DESIGN

Dimensions: **1200×630** (Open Graph standard)

Brand language: premium, editorial, restrained, dark volcanic soil + bone + bronze
- Dark earth background (#1a1410 → #0a0805 gradient)
- Subtle warm radial in upper right (volumetric depth)
- Fine horizontal elevation lines (suggesting terroir/landscape, opacity 6%)
- Top rule: `TREADVILLE · KENYA` in bronze, letterspaced
- Large serif wordmark: `Treadville` in bone/ivory (#f5f0e6), Cormorant-style
- Italic subtitle: `From Kenyan soil to global markets.`
- Full-width bronze rule as divider
- Category tags + domain in footer
- No photography — typography-driven editorial composition
- No generic stock imagery

Approach: SVG → sharp → PNG (high quality, 95% JPEG-equivalent)

---

## 3. FAVICON / ICON DESIGN

Dimensions: **192×192** (icon.png) + **180×180** (apple-touch-icon.png)

Design: T monogram
- Dark volcanic background
- `T` in Cormorant-style serif, bone color
- Bronze rule above, subtle bronze bar below
- Premium, minimal, unmistakable

Approach: SVG → sharp → PNG

---

## 4. ENVIRONMENT EXAMPLE

Update `.env.local.example` to include all required variables:
- `NEXT_PUBLIC_SUPABASE_URL` (already present)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already present)
- `SUPABASE_SERVICE_ROLE_KEY` (add — server-only, never NEXT_PUBLIC_)
- `VERCEL_OIDC_TOKEN` (add as optional comment — Vercel auto-populates)

No real values. No secrets.

---

## 5. VERIFICATION PLAN

### TypeScript
`npx tsc --noEmit` → 0 errors

### Build
`npm run build` → passes

### Asset verification
- `/public/og-default.png` exists → dimensions 1200×630 → `<img>` renders
- `/public/icon.png` exists → 192×192 → browser tab shows it
- OG metadata: `url: "/og-default.png"` resolves to asset
- Structured data: `logo: /icon.png` resolves to asset

### Domain sweep
- `metadataBase: https://treadville.co.ke` → confirmed
- No localhost, no IP, no preview URLs in any production path

---

## 6. PRESERVE

- All 29 existing routes
- All Phase 22-24 functionality
- Supabase configuration
- Sitemap, robots, structured data
- Authentication, RLS, admin protection
- Tiptap, journal, metadata architecture

---

## 7. NOT IN SCOPE

- Email notification for enquiries
- `next/image` migration
- HTML sanitization library
- New features
- Redesign
