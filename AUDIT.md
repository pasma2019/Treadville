# TREADVILLE — PREMIUM VISUAL REDESIGN AUDIT

## 1 · What currently looks generic / AI-generated

- **Uniform section layout.** Every page is the same `max-w-6xl px-6 py-16` box + a `font-mono` eyebrow + `font-display` heading + grid. Shop, category, homepage sections, and product page all collapse into the identical template. There's no editorial rhythm — it reads as one repeated card-grid page.
- **Square-on-square product grids.** `grid-cols-2/3` + `aspect-[4/5]` cards repeated everywhere. No asymmetry, no full-bleed moments, no layered composition.
- **The homepage hero is a single full-bleed background image + centered-left text + one button.** Functional but flat — no depth, layered imagery, foreground/background staging, or motion. This is the site's opening frame and it currently feels like a generic "hero with stock photo" template (AGENTS.md §11, §40).
- **`hero_coffee` fallback points to a nonexistent file** (`/images/hero-coffee.jpg`). `public/images/` is empty. If Supabase content is missing, the hero degrades to a flat brown gradient.
- **Border-heavy cards everywhere** (`border-[var(--line)]`). Per §08/§13, edges on almost everything reads "template," not "premium."
- **Identical CategoryTabs on shop, category, and homepage** — a reusable pill/border tab. Fine as a component, but it's the *only* discovery pattern, so the site feels one-note.
- **No motion system at all.** No reveals, no staggers, no parallax, no scroll-linkage. Static pages feel inert and cheap against the AGENTS.md motion standard.

## 2 · What prevents it from feeling premium

- **No glassmorphism used anywhere** despite §06 encouraging it (nav, cart drawer, overlays). The header is a flat `bg-soil/90` bar; the cart drawer is opaque `soil-raised`.
- **No tasteful imagery treatment.** Images are raw `<img>` in boxes with a simple hover scale. No layered images, no editorial crops, no atmospheric gradients over photos.
- **Typography is under-used.** Fraunces italic display + Archivo body + Space Mono is fine, but headings are all used at similar scale with no overlapping/large-field moments (§07/§40). `font-mono` for nearly every label/eyebrow is used so uniformly it stops feeling like accent and becomes default.
- **No hover sophistication.** Nav = color change only; buttons = none; cards = image scale only. §13's intended behaviors (crop shift, secondary info reveal, accent appearance, CTA prominence) are absent.
- **Footer is a plain 3-column grid** — no editorial presence, no full-bleed treatment, no depth.
- **Zero loading/empty/error treatment beyond plain text** ("Image pending", "No published products yet"). §47–50 want intentional states; they're currently field notes.
- **The category discovery treats categories as 4 identical flat tiles** — no category accent colors, no distinct identities, no hierarchy of importance (Coffee is the brand origin and looks identical to Grains).

## 3 · Components that should be **redesigned**

| Component | Why |
|---|---|
| **Homepage hero** | Flat single-image hero → needs layered/staged cinematic composition, glass overlay, category entry points, motion. |
| **SiteHeader** | Flat opaque bar → true glass floating nav, refined underline/indicator hover, better mobile treatment (currently *no mobile menu at all*). |
| **CartDrawer** | Opaque panic → translucent glass panel, micro-interactions, better typography hierarchy. |
| **ProductCard** | Generic box → editorial product story: image treatment, crop shift, accent, price/status reveal, refined hover. |
| **Category tiles / CategoryTabs** | Four identical flat squares → per-category accent identities, richer discovery surface. |
| **SiteFooter** | Plain 3-col → editorial full-bleed presence, provenance story. |
| **ProductDetail** | Two-column box → a product story: gallery, metadata treatment (coffee grade/altitude/SCA §14), floating overlays. |
| **The `Button` primitive** | Inline `<button>`/`<Link>` every time → one reusable Button with hover elevation/motion. |

## 4 · Components that should **remain** (keep the architecture)

- **CartContext** — clean cart state, works. Keep.
- **ProductCard** — redesign styling, but keep the component/contract.
- **CategoryTabs** — keep as a primitive, refine styling.
- **All `lib/` files (queries.ts, types.ts, supabase.ts)** — do not touch. Solid data layer, correct architecture.
- **Shop/category/product server pages** — keep the data flow; only change presentation within them.
- **Admin** — leave functional, light visual polish only if time allows; it's not the focus of this phase.

## 5 · Where glassmorphism fits tastefully (§06)

- **Floating SiteHeader** over the dark hero — translucent, blurred, subtle border. (Top priority — it appears on every page.)
- **CartDrawer** — translucent glass panel with backdrop blur.
- **Homepage hero foreground panel** — glass for the headline/subheadline or a floating "category" control cluster over the hero image.
- **Product metadata overlay** on cards — glass badge for price/SCA/status that reveals on hover.
- **Floating category navigation / filter control** over hero.
- **Contextual CTAs** on product detail.
- Restraint rule: never put glass on every card. Keep product grids on solid ground.

## 6 · Where sophisticated hover/motion should be introduced (§12/§13/§26)

- **Motion primitives** — a small `Reveal`/stagger util via CSS `IntersectionObserver` (or pure CSS) animating `transform`/`opacity` only. Site-wide entrance reveals keyed to `prefers-reduced-motion`.
- **Hero** — subtle slow image scale-in / parallax on load, layered foreground entrance stagger, restrained atmospheric gradient drift.
- **ProductCard** — image scale + crop shift, price/status/SCA glass badge reveals, accent line appears, CTA prominence on hover. All `transform/opacity`.
- **Nav** — underline/reveal indicator, subtle accent transition, no aggressive movement.
- **Buttons** — background transition, slight elevation, optional directional motion.
- **Cart drawer** — smooth slide, item add/remove micro-feedback, count pulse.
- **Category tiles** — image zoom + accent wash on hover, distinct identity per category.
- **Section transitions** — scroll-linked reveals, staggered entrances. Nothing bouncy, nothing constant.

## 7 · How the homepage should be visually **re-composed**

Current: hero → "One estate. Four categories." → tiles → Featured → Story.

Recommended editorial re-composition (keeps data/content sources, changes staging and hierarchy):

1. **Cinematic hero** — layered: atmospheric gradient over a Kenhighland landscape, floating glass nav, foreground glass panel for `Est. 30+ years · Kenya` + headline + subheadline + CTA, plus a floating category entry cluster (Coffee/Tea/Horticulture/Grains) so the user can go straight to a category from the first frame. Slow scale/parallax, staggered text entrance.
2. **Category discovery as a strong editorial band**, not four identical squares — give each category its accent identity (coffee = copper, tea = botanical green, etc. §10), use overlapping editorial composition and its source imagery (terroir).
3. **Featured products** — keep, but restage inside the new ProductCard with full-bleed or asymmetric treatment rather than a plain 3-col grid.
4. **A provenance/terroir moment** — full-bleed atmospheric image + tasteful overlay copy about Mt. Kenya / Kirinyaga volcanic soil (uses real brand content, §02), adding the "opening frame of a premium brand film" feel §11 asks for.
5. **Story band** — keep, refine to a calmer editorial statement (currently the weakest, most centered-and-forgotten section — the text is good, the presentation is flat).

Overall: go from "four stacked uniform sections" to *moments of dark and light* (§05), rhythm through asymmetry, and let typography + imagery breathe (§40).

## 8 · Architecture problems to fix **before** the visual redesign

1. **`getFeaturedProducts` and homepage queries** — fine. No change needed. Keep `revalidate = 0` (data driven). ✓
2. **Hard-coded category nav in SiteHeader** (`Coffee/Tea/Horticulture/Grains`) — *architectural smell.* §16/§17 say a category added in admin must appear in the storefront. The homepage tiles are data-driven (good), but the secondary nav is hard-coded. **Before redesign, make the header nav render from `getCategories()`** so the redesigned nav is data-driven from day one. This is the single most important pre-work item.
3. **`hero-coffee.jpg` fallback is broken** — `public/images/` is empty. Either remove the unused imag or add a real placeholder. Fix before the hero redesign depends on it.
4. **Category accent mapping lives in `CategoryTabs.tsx` as a hardcoded `Record` keyed by slug** (coffee/tea/horticulture/grains). For data-driven categories (§16), this breaks for new categories. Consider deriving accent from slug with a graceful fallback, or a central accent token map (not per-component). Minor, but worth doing once now so the redesign doesn't cement it further.
5. **`getProductBySlug` fetches full product but the type lacks coffee-specific metadata** (grade/altitude/SCA/notes §14). The Product type only has `stock`. If we want a richer product detail story we'd need that field on the data model — but §29 says don't invent data. So keep this as *placeholder-capable* but don't fabricate values. Flag: product detail "Single origin" label is currently hard-coded for *all* products — an overclaim for non-coffee demo items. Should become conditional.
6. **No local imagery at all** — every image is a remote Supabase URL. The redesign's "premium photography" requirement (§09) depends on real, high-quality imagery. Decide whether imagery comes from Supabase storage/URLs or `public/`. This is a content/infra decision to lock before the visual work.
7. **Minimal client components** — good already. Keep the storefront server-rendered; don't add client noise during redesign.

---

### Recommended sequence

1. Fix architecture items (§8): data-driven header nav, accent token centralization, broken hero fallback, conditional "Single origin" label.
2. Establish design tokens + motion primitives (glass, reveal, category accents) in `globals.css`.
3. Redesign shared primitives: SiteHeader (glass), Button, ProductCard, CategoryTabs, CartDrawer.
4. Re-compose the homepage hero + sections.
5. Polish shop/category/product detail within the new system.
6. Visual QA at §34, run `npm run lint` + `npx tsc --noEmit` (§35).
