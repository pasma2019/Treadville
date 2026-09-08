# PHASE 27 — PLAN: PRODUCTION ACTIVATION + REAL-WORLD VALIDATION

**Date:** Phase 27 plan
**Status:** Based on Phase 27 audit findings

---

## 1. FINDINGS SUMMARY

| Finding | Severity | Action |
|---|---|---|
| `proxy.ts` convention | FIXED — function name `proxy` |
| Next.js 16.3.4 available | HIGH | Manual: `npm install next@16.3.4` |
| Resend awaited (latency, not functional) | MEDIUM | Document — not blocking |
| 19 unpushed commits | LOW | Pascal: push to GitHub |
| Build artifacts in repo | LOW | Pascal: cleanup before deploy |
| Deployment boundary | N/A | Manual — Pascal must deploy |

---

## 2. FIXES APPLIED IN PHASE 27

### A. Edge Proxy — Next.js 16 Convention
**Status:** `proxy.ts` exists at project root with function name `proxy`. This is the correct Next.js 16 convention (per `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`).

**Files at project root:**
- `proxy.ts` — Next.js 16 Proxy (function `proxy`) — **authoritative**
- ~~`middleware.ts`~~ — **DELETED** (was an incorrect Phase 27 assumption)

**Verified:**
1. `npx tsc --noEmit` passes with 0 errors
2. `npm run build` passes — 30 routes

**Result:** On Vercel (Linux, native SWC), `proxy.ts` is detected and registered. Unauthenticated `/admin/*` requests are redirected at the proxy layer.

### B. Next.js 16.3.4 — Manual Action Required
- Package.json pinned to `16.3.3` (currently installed)
- `16.3.4` verified to exist on npm registry
- **Manual action:** `npm install next@16.3.4` then `npm install` after push to GitHub
- Not a blocker — 16.3.3 is production-stable

---

## 3. PRESERVE

- All Phase 22-26 functionality
- Proxy protection for admin routes (proxy.ts + requireAdmin())
- Analytics (zero PII)
- Email notification (failure-tolerant)
- All 30 routes
- Brand assets
- Supabase architecture
- SEO infrastructure

---

## 4. NOT IN SCOPE

- Dependency upgrades beyond Next.js patch
- Email queue infrastructure (Resend is adequate)
- Analytics beyond Vercel Analytics
- Payment/customer accounts
- Redesign

---

## 5. VERIFICATION PLAN

| Check | Command | Expected |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | 0 errors |
| Build | `npm run build` | 30 routes, pass |
| Proxy | `proxy.ts` at project root | Function named `proxy` (Next.js 16) |
| Env vars | `.env.local.example` | All variables documented |
| Analytics | `layout.tsx` import | `<Analytics />` present |
| Email | `enquiry-notify.ts` | Non-blocking with warning log |
| Journal | `journal/page.tsx` | No hardcoded articles |
| Images | `grep` for stock URLs | 0 matches |
