# Treadville Photography Direction Inventory

> **Status:** Inventory only. No images generated yet.
> **Purpose:** Describe exactly what photography each major public surface requires so the images can be produced deliberately as a single, consistent art-directed campaign.
> **Target:** When these images arrive, they should be dropped in via `image_url` / `gallery` fields in Supabase. No component rewrites required.

---

## Global photography standard

| | |
|---|---|
| Style | Premium commercial photography, editorial food / agricultural |
| Lighting | Natural light, directional key from upper-left or upper-right, soft fill, controlled highlights, deep but not crushed shadows |
| Color grading | Slightly desaturated, warm white balance, editorial film feel; lift the blacks, never crush to black |
| Texture | Tactile, real materials — no CGI / no plastic / no floating objects |
| Composition | Generous negative space; subject occupying ~25–35% of frame; subject grounded with realistic contact shadow |
| Grain | Subtle film grain, never heavy |
| Resolution | 2400×3000 minimum (4×5 portrait), 2400×1600 (3×2 landscape). Allow 2x for retina. AVIF or WebP for delivery |
| Art direction | "One campaign" — every image uses the same lighting model, colour treatment, and contrast grade |
| What to avoid | MaaSai clichés, safari imagery, generic stock, AI faces, fake farms, plastic-looking food, oversaturated greens, impossible shadows, floating products, watermarks, logos on packaging |

---

## Image family 01 — Hero (right column of homepage hero)

**Component placement:** `src/components/HeroSlideshow.tsx:146-173` (right-column visual area, hidden on mobile).
**Current state:** SVG `CoffeeProductVisual` (1181-line hand-drawn scene from `HeroChapters.tsx`). Acceptable as prototype, must be replaced.
**Slot size:** ~480px tall × content-cinema width × 25% = roughly 320×480 visible at desktop. Mobile hidden.

| Aspect | Specification |
|---|---|
| Subject | A single dominant, premium still life. NOT a coffee bag. Treadville's first impression should not be packaging — it should be the *raw material*. The product as it leaves the soil. |
| Options | (a) A studio-lit hero shot of an open coffee bag tipping green beans onto a dark stone slab. (b) A hand-picked macro of a coffee cherry, still on the branch, morning dew visible. (c) A vertical hero of stacked burlap sacks with volcanic soil scattered in foreground. |
| Environment | Dark studio. Matte volcanic stone tabletop. One directional key light from upper-left. Soft warm spill on the right. Subtle haze in the air. |
| Camera | 50mm-equivalent, slight overhead, eye-level with subject, shallow DOF f/4, subject razor-sharp, foreground/background gently blurred |
| Color | Deep coffee browns + copper highlights + forest green accent + restrained amber spill |
| Negative space | 40% of frame intentionally dark for editorial typography overlap on the left |
| Intended emotion | Craft. Provenance. Weight. Origin. |

**Crop requirements:**
- Desktop: full frame visible, 3:2 landscape or 2:3 portrait
- Mobile: N/A (hidden)

---

## Image family 02 — Coffee category hero (`/shop/coffee`)

**Component placement:** `src/app/shop/[category]/page.tsx` (h1 sits on a soft atmospheric wash — the page currently shows only the wash, no real image)
**Current state:** Atmospheric gradient only (`categoryAtmosphere` in same file). No image.
**Slot size:** 420–480px tall, full content-wide width

| Aspect | Specification |
|---|---|
| Subject | A wide editorial landscape: Kirinyaga highland coffee farm in soft morning light, with one or two pickers visible in the mid-ground (not portraits — silhouettes or back-view only). Altitude visible in the layered ridges behind. |
| Environment | Volcanic highland Kenya. Real topography. Soft morning mist lifting off the ridges. |
| Camera | 85mm-equivalent landscape, eye-level, deep DOF f/8, no people facing camera, three-layer depth (foreground bushes, midground pickers, background ridges) |
| Color | Ivory + soft sage + restrained copper in the soil, deep forest in the ridges. Match `--atmosphere-coffee-page` token. |
| Negative space | 30% sky / haze at top for editorial typography overlay |
| Intended emotion | Provenance. Volcanic origin. Kenyan altitude. |

**Crop requirements:**
- Desktop: full bleed across the category page
- Mobile: 3:2 landscape, focus on the central ridge line

---

## Image family 03 — Tea category hero (`/shop/tea`)

**Component placement:** `src/app/shop/[category]/page.tsx` (same template as coffee, different slug)
**Current state:** Atmospheric wash only
**Slot size:** 420–480px tall

| Aspect | Specification |
|---|---|
| Subject | Tea highland plantation, rows of Camellia sinensis stretching into mist, single plucker's hand visible (no face) in foreground holding fresh leaves. |
| Environment | Highland Kenya / Nandi Hills. Cool, misty, fresh. Eucalyptus or grevillea shade trees in background. |
| Camera | 85mm landscape, eye-level, deep DOF |
| Color | Mist / sage / eucalyptus / mineral white. Match `--atmosphere-tea-page` token. No green that reads as "golf course." |
| Negative space | 40% mist at top |
| Intended emotion | Cool. Fresh. Breathable. Disciplined agriculture. |

**Crop requirements:**
- Desktop: 3:2 landscape
- Mobile: 3:2, focus on the hand-in-foreground element

---

## Image family 04 — Horticulture category hero (`/shop/horticulture`)

**Component placement:** `src/app/shop/[category]/page.tsx`
**Current state:** Atmospheric wash only
**Slot size:** 420–480px tall

| Aspect | Specification |
|---|---|
| Subject | Avocado orchard in lowland Kenya, fruit-laden branch in foreground, rows extending into the distance, soft citrus / mineral sky. |
| Environment | Fertile lowland. Volcanic soil visible. Real farm scale, not a backyard. |
| Camera | 50mm landscape, slight tilt up, deep DOF, subject (a single fruit) in foreground in soft focus, the orchard in sharp focus behind |
| Color | Fresh jade / leaf green / mineral white / soft citrus. Match `--atmosphere-horticulture-page`. |
| Negative space | 30% soft sky at top |
| Intended emotion | Abundance. Clean. Premium. |

**Crop requirements:**
- Desktop: 3:2 landscape
- Mobile: 3:2, foreground fruit more prominent

---

## Image family 05 — Grains category hero (`/shop/grains`)

**Component placement:** `src/app/shop/[category]/page.tsx`
**Current state:** Atmospheric wash only
**Slot size:** 420–480px tall

| Aspect | Specification |
|---|---|
| Subject | A field of mature wheat in the warm late-afternoon, single stalk in foreground (sharper), field extending back, low sun raking across the grain heads. |
| Environment | Sun-warmed Kenyan plain (Rift Valley or similar). Real scale, not a backyard. |
| Camera | 135mm-equivalent, eye-level with the wheat, shallow DOF f/2.8 isolating the foreground stalk, sun flare controlled (not a lens wash) |
| Color | Champagne / wheat / saffron / cream / pale gold. Match `--atmosphere-grains-page`. |
| Negative space | 35% sky at top with warm gradient |
| Intended emotion | Abundance. Wholesome. Sophisticated harvest. |

**Crop requirements:**
- Desktop: 3:2 landscape
- Mobile: 3:2, foreground stalk more prominent

---

## Image family 06 — Category card photography (CategoryDiscovery)

**Component placement:** `src/components/CategoryDiscovery.tsx:177-182` (via `CategoryImageLayerFor`)
**Current state:** If `cat.image_url` is set, image is used; otherwise the `ProductIdentity` fallback is shown
**Slot size:** Lead card 5:6 portrait, companion cards 4:3 landscape. Mobile stacks to single column

| Aspect | Specification |
|---|---|
| Subject (Coffee lead) | Tight editorial still life of green coffee beans in a copper bowl, single bean in foreground, volcanic stone visible. NO packaging. |
| Subject (Tea lead) | Matte jade teapot in soft window light, eucalyptus branch in soft focus behind. |
| Subject (Horticulture lead) | Two halves of a ripe avocado on a linen cloth, the pit in the centre, knife resting, soft citrus in the background. |
| Subject (Grains lead) | A wooden scoop of raw grain, spilling onto stone, single grain head beside it. |
| Camera | 50mm or 85mm, eye-level, shallow DOF, editorial |
| Color | Match each category's atmospheric wash exactly. The card and the hero image should feel like two crops of the same campaign. |
| Negative space | Subject occupies ~40–55% of frame. Generous breathing room. |

**Crop requirements:**
- Lead: 5:6 portrait
- Companions: 4:3 landscape (or 1:1 — TBC when we see the actual aspect performance)

---

## Image family 07 — Product detail hero (PDP primary)

**Component placement:** `src/app/product/[slug]/page.tsx:97-127` (via `ProductGallery`)
**Current state:** Real images when `image_url` is set. Currently the seed has images.
**Slot size:** 5:6 portrait on desktop, 4:5 on mobile

| Aspect | Specification |
|---|---|
| Subject | The actual product in a "premium catalogue" style — packshot, but not sterile. Coffee: bag standing on stone, copper label catching light, beans scattered. Tea: caddie with lid slightly off, leaves visible inside. Avocado: 2 halves on linen. Grain: burlap sack with grain spilling. |
| Environment | Dark or neutral studio with the category's accent colour as ambient spill. |
| Camera | 85mm, eye-level, controlled DOF |
| Color | Match `--cat-{slug}-base` accent exactly |
| Negative space | 30% for editorial cropping |

**Crop requirements:**
- Desktop: 5:6 portrait, full frame
- Mobile: 4:5 portrait, same frame

---

## Image family 08 — Product detail gallery (PDP secondary images)

**Component placement:** `src/components/ProductGallery.tsx` (after primary)
**Current state:** Uses `product.gallery[]`. Currently 0–3 images per product.
**Slot size:** 5:6 portrait, displayed at 56×56 thumbs

**Three required secondary shots per coffee product:**

1. **Texture / detail** — extreme close-up of beans, surface, or a hand holding the product. Macro 100mm, f/4, very shallow DOF.
2. **Process / origin** — the farm, the washing station, the drying bed. Editorial landscape, deep DOF.
3. **Context / lifestyle** — product on a table in a real Kenyan or international setting (café, dining room, export office). No posed people facing camera.

**Three required secondary shots for tea / horticulture / grains:** Same three categories, but with the subject being the actual product.

**Color:** All three secondary images must be graded to match the primary. One campaign.

---

## Image family 09 — Provenance section (`/`)

**Component placement:** `src/components/Provenance.tsx` (the dark cinematic section between CategoryDiscovery and JournalPreview)
**Current state:** Pure dark `--soil-muted` surface with type. Topographic SVG mountain ridge (`TopographicAnchor`). No photography.
**Slot size:** Currently text-only. No image slot. **RECOMMEND ADDING a single wide landscape image behind the data points at the bottom of the section.**

| Aspect | Specification |
|---|---|
| Subject | A single wide editorial image of either Mt. Kenya volcanic ridge (sunrise side, mist rising off the glaciers), or a single hero shot of a Treadville farm at altitude. |
| Environment | Volcanic, high altitude, real scale, real atmosphere. |
| Camera | 35mm landscape, deep DOF, golden hour |
| Color | Ivory + copper + forest. Match the hero image but in landscape format. |
| Overlay | 70% dark wash overlay so the type and data points remain readable. |
| Intended emotion | Where we come from. Permanence. Altitude. |

---

## Image family 10 — Export / story section (`/`)

**Component placement:** Currently text-only (Story section in `src/app/page.tsx:101`)
**Current state:** Text only
**Slot size:** TBD

| Aspect | Specification |
|---|---|
| Subject | Either (a) a port-side editorial image of a Treadville shipping container being loaded at Mombasa port, or (b) an export office interior, or (c) a paper-document close-up showing real documentation (KEPHIS certificate, SGS report, etc.) — placeholder, not real text. |
| Environment | Real, not staged. Afternoon light, real materials. |
| Camera | 50mm, eye-level, editorial |
| Color | Ivory + warm wood + restrained bronze |
| Intended emotion | Verified. Traceable. International reach. |

**Crop requirements:**
- Desktop: 4:3 or 3:2 landscape
- Mobile: stacked below text

---

## Image family 11 — Journal preview (`/`)

**Component placement:** `src/components/JournalPreview.tsx` (between Provenance and FeaturedSection)
**Current state:** Dark cinematic strip with editorial type. No image.
**Slot size:** Currently text-only or 3 image cards (TBD). **If a 3-card image grid is added:**

| Aspect | Specification |
|---|---|
| Subject | Three editorial scenes, one per category. Coffee: a roaster's hand inspecting a roast. Tea: a tea taster with a cupping set. Horticulture: a hand on an avocado branch. |
| Environment | Real, editorial, with the category's accent ambient. |
| Camera | 85mm, eye-level, editorial |
| Color | Each image graded to its category. |
| Intended emotion | Story. People behind the product (hands only — no faces). |

---

## Image family 12 — Origin / quality / export / about / journal page heroes

**Component placement:** `src/app/origins`, `/quality`, `/export`, `/about`, `/journal` (each currently has a dark hero with text only)
**Current state:** Dark hero with type. No photography.
**Slot size:** Full-bleed behind the hero text, with a dark wash overlay for legibility.

| Page | Required image |
|---|---|
| `/origins` | Wide landscape of Kirinyaga highland coffee farm, misty morning, no people facing camera |
| `/quality` | Editorial close-up of coffee cupping bowls on a table, or SGS laboratory scene, real equipment |
| `/export` | Editorial shot of Mombasa port at golden hour, container ship and cranes in mid-ground, no logos |
| `/about` | Editorial shot of a single hand holding volcanic Kenyan soil, or a wide farm landscape at golden hour |
| `/journal` | Editorial shot of three categories of products staged together (a coffee bag, a tea caddie, an avocado) in a single frame |

**Each page hero must:**
- Be 16:9 minimum (1920×1080 source)
- Have at least 50% dark / negative space at the top so the H1 can sit over it
- Be graded to match the page's section surface colour
- Show no logos, no watermarks, no fabricated text

---

## Image family 13 — Footer (currently dark, no image)

**Component placement:** `src/components/SiteFooter.tsx`
**Current state:** Dark surface, type only
**Slot size:** N/A
**Recommendation:** **Keep text-only.** No footer image. The footer should remain pure typography for a luxury editorial finish.

---

## Total image count required for the full campaign

| Family | Count | Critical? |
|---|---|---|
| 01 Hero (right) | 1 | Critical |
| 02 Coffee category hero | 1 | Critical |
| 03 Tea category hero | 1 | Critical |
| 04 Horticulture category hero | 1 | Critical |
| 05 Grains category hero | 1 | Critical |
| 06 Category cards (4 leads) | 4 | Critical |
| 07 PDP primary (per published product) | 4–8 | Critical |
| 08 PDP gallery secondary (3 per product) | 12–24 | High |
| 09 Provenance section | 1 | High |
| 10 Export / story | 1 | Medium |
| 11 Journal preview cards (3) | 3 | Medium |
| 12 Page heroes (5 pages) | 5 | Medium |
| 13 Footer | 0 | — |
| **Total unique images** | **~35–50** | |

**Plus:** every category (`cat.image_url`) and every product (`product.image_url`, `product.gallery[]`) currently stored in Supabase will need to be supplied by the client or replaced.

---

## What this means for production

1. **Art direction is required before generation.** One mood board, one lighting test, one grade LUT. Then everything else follows.
2. **Photography should be shot as a single campaign** with consistent lighting and grading — not as 35 separate commissions.
3. **Realtag images on individual products** can be shot in the same session, but **page hero images should be shot first** as they set the visual standard.
4. **The component code is already image-ready.** No rewrites needed. Drop images into Supabase, the layout will pick them up automatically.
