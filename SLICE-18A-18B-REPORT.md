# Slice 18A + 18B — Verification Report

Baseline branch: `prototype/phase-2d-signature` · Baseline commit: `5045c4e`
Scope: **only** audit Slice 18A (safe frontend consistency) + Slice 18B (real homepage journal).

## Files changed

| File | Slice | Change |
|---|---|---|
| `src/components/ProductImage.tsx` | 18A-1 | Error/fallback state re-tokened from dark tokens to light/gold tokens. |
| `src/components/SiteFooter.tsx` | 18A-2 | Added `relative` to the `<footer>` so its absolute top divider anchors to the footer. |
| `src/components/JournalPreview.tsx` | 18B | Removed hardcoded default essays; cards now link to `/journal/[slug]`; added restrained empty state; excerpt renders conditionally. |
| `src/app/(storefront)/page.tsx` | 18B | Homepage now fetches `getArticles(true)`, takes the latest 3 published articles, and passes them to `JournalPreview`. Removed the hardcoded essay array. |

### 18A-1 — ProductImage light fallback
- Before: `bg-gradient-to-br from-[var(--soil-raised)] to-[var(--soil-muted)]`, text `text-[var(--parchment)]/25`, border `border-[var(--line)]` (all dark-theme tokens).
- After: `bg-gradient-to-br from-[var(--bone)] to-[var(--warm-white)]`, text `text-[var(--ink-muted)]`, border `border-[var(--line-on-light)]` (existing light/gold tokens, no new token family).

### 18A-2 — Footer divider
- `<footer>` className changed from `surface-footer px-6 …` to `surface-footer relative px-6 …`. Visual appearance unchanged; the `absolute inset-x-0 top-0` hairline now positions against the footer itself.

### 18A-3 — Contrast (`--ink-faint`, `--ink-whisper`)
- **No values changed.** Definitions: `--ink-faint: rgba(26,20,16,0.42)`, `--ink-whisper: rgba(26,20,16,0.22)` (light `:root` at globals.css ~558–559); consumed at globals.css lines 1060 (`--ink-whisper`), 1169 & 1195 (`--ink-faint`), plus small uppercase mono labels/numerals in JSX.
- WCAG contrast ratios could not be confidently measured in this environment (no live render — see validation note). Per instruction, values are left unchanged and flagged as an **outstanding verification item** rather than blindly adjusted.

### 18A-4 — Legacy `.btn*` CSS — HARD VERIFICATION GATE
- **Removal NOT permitted. Consumers found. No CSS removed.**
- Repository-wide consumer search (`grep` across `src/**/*.{ts,tsx}`) results:
  - `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-light` → **consumed by `src/components/Button.tsx`** (`VARIANT_CLASS = { primary: "btn btn-primary", ghost: "btn btn-ghost", light: "btn btn-light" }`).
  - `.btn-light-link` → consumed by `src/app/(storefront)/product/[slug]/page.tsx` (lines 200, 209).
  - `.btn-admin` → consumed by `src/app/admin/(auth)/{login,forgot-password,reset-password}/page.tsx`.
  - `.btn-cta` / `.btn-cta-ghost` → active system, in use (out of scope for removal).
- Note: `Button.tsx` currently has no importers, but it is an exported component that directly references the selectors. Per the gate ("do not infer a selector is dead simply because it appears unused locally"), a consumer exists, so the legacy rules were left untouched.

### 18A-5 — CSS/token cleanup
- No broad refactor performed. No tokens removed. `globals.css` was **not modified**.

### 18B — Homepage journal data flow
- Old: `src/app/(storefront)/page.tsx` passed a hardcoded 3-item essay array (titles "A note on Kirinyaga", "Cupping at origin", "From farm to export") with only images sourced from `site_content`.
- New data path (reuses existing query, no new access path):
  - `getArticles(true)` (published only, ordered `updated_at desc`) added to the existing `Promise.all`.
  - `articles.slice(0, 3)` mapped to essays: `title` ← `article.title`, `excerpt` ← `article.excerpt ?? ""`, `meta` ← `article.author_name || "Field notes"`, `image` ← `article.cover_image_url || undefined`, `slug` ← `article.slug`, `no` ← index padded.
- `JournalPreview`:
  - `DEFAULT_ESSAYS` hardcoded fallback removed; default is now `essays = []`.
  - Each card with a `slug` is wrapped in `<Link href={`/journal/${slug}`}>` (with focus-visible ring); visual/hover/responsive markup preserved (same `journal-card group` article, image treatment, `journal-line` hover).
  - Empty state: when there are no published articles, a restrained single-paragraph message renders instead of cards. No fabricated article content.

## `.btn*` consumer-search evidence (raw)
```
src/components/Button.tsx:15:  primary: "btn btn-primary",
src/components/Button.tsx:16:  ghost: "btn btn-ghost",
src/components/Button.tsx:17:  light: "btn btn-light",
src/app/(storefront)/product/[slug]/page.tsx:200: className="btn-light-link"
src/app/(storefront)/product/[slug]/page.tsx:209: className="btn-light-link"
src/app/admin/(auth)/login/page.tsx:104: className="btn-admin w-full"
src/app/admin/(auth)/forgot-password/page.tsx:86: className="btn-admin w-full"
src/app/admin/(auth)/reset-password/page.tsx:106: className="btn-admin w-full"
```

## Validation results
- `npx tsc --noEmit` → **0 errors**.
- `npx eslint` on changed files → 0 errors; 2 warnings, both **pre-existing** in `page.tsx` (`ProductCard` and `Product` unused imports — confirmed present in baseline `HEAD` as import-only; left untouched to avoid scope creep).
- Diff scope: 4 files (`page.tsx`, `JournalPreview.tsx`, `ProductImage.tsx`, `SiteFooter.tsx`). No protected files touched.

## Unresolved / outstanding verification items
1. **Live render blocked in this sandbox.** The dev server's env lacks Supabase runtime credentials (`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` absent from `.env.development.local` and `/vercel/share/.env.project`). Every storefront route returns 500 (via `CartContext`/`proxy.ts`) before rendering, so the homepage journal, ProductImage fallback, and footer divider could **not** be visually verified in-browser here. This is a pre-existing environment gap, unrelated to these edits. Verification should be repeated in an environment with Supabase env populated.
2. **Contrast (18A-3)** — `--ink-faint` / `--ink-whisper` WCAG ratios not measured (blocked by item 1). Values intentionally unchanged pending confirmation.

## Scope confirmation
No database, schema, RLS/policy, storage, path-derivation, auth, `proxy.ts`, order/enquiry/checkout, admin-security, CMS-mechanism, caching/`revalidate`/`force-dynamic`, `next/image`/image-optimization, `next.config`, CSP, or category-architecture work was performed. Protected files (`src/proxy.ts`, `src/lib/supabase.ts`, `src/lib/supabase/server.ts`, `src/lib/auth.ts`, `src/lib/order-actions.ts`, `src/lib/enquiry-actions.ts`, `src/lib/admin-actions.ts`, `src/lib/cms-fields.ts`, Supabase migrations/schema/RLS) were not modified. `globals.css` was not modified. No publish/merge/deploy performed.
