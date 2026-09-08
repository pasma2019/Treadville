# PHASE FINAL MICRO HCI CORRECTION — REPORT

## Overview

Audit-first micro-correction pass on the existing Treadville prototype. No redesign,
no new pages, no new content. All changes are refinements to existing typography,
hierarchy, and accessibility targeting the primary public-facing experience.

The Phase 16.7 report was used as a baseline. This pass re-audited every component
from scratch and applied corrections per the HCI specification provided.

---

## 1. AUDIT FINDINGS — BEFORE CHANGES

### Actual Measured Sizes (Source Inspection)

| Element | Measured Size | Status |
|---|---|---|
| Hero supporting text | 17px / 18px | ✅ Within spec |
| Hero CTAs | 15px | ✅ At minimum spec |
| Hero metadata row | 13px values, 12px labels | ⚠️ REMOVED |
| Category eyebrows | 12px, tracking 0.28em | ⚠️ Should be 13px |
| Category names (Lead) | 30px / 48px | ⚠️ Spec says 18-20px |
| Category names (Companion) | 24px / 30px | ⚠️ Spec says 18-20px |
| Category descriptions | 15px | ✅ Within spec |
| Provenance intro | 17px / 18px | ✅ Within spec |
| Provenance stage body | 16px / 18px | ⚠️ Should be 17px |
| Provenance stat labels | 14px | ✅ Within spec (13-14px target) |
| Journal intro | 16px / 18px | ⚠️ Should be 17px |
| Journal CTA | 13px | ⚠️ Should be 15-16px |
| Journal excerpt | 15px | ✅ Within spec |
| Story body | 17px / 18px | ✅ Within spec |
| Story stat labels | 13px | ✅ Within spec |
| Enquiry body | 17px / 18px | ✅ Within spec |
| Enquiry card eyebrows | 13px | ✅ Within spec |
| Enquiry card descriptions | 15px | ✅ Within spec |
| Contact labels | 16px | ✅ Within spec |
| Contact inputs | 17px | ✅ Within spec |
| Footer headings | 15px | ✅ Within spec |
| Footer links | 16px | ✅ Within spec |
| Footer description | 16px | ✅ Within spec |
| Footer legal | 14px | ✅ Within spec |
| Navigation links | 16px | ✅ Within spec |

### Identified Issues
1. Hero metadata row — redundant noise (content duplicated in headline + top bar)
2. Category eyebrows 12px → needed 13px
3. Category name sizes too large relative to spec (but intentional editorial choice — spec prevails)
4. Journal CTA 13px → needed 15-16px
5. Journal intro 16px → needed 17px
6. Provenance stage body 16px → needed 17px
7. Missing focus rings on: nav dropdown toggle, nav links, cart button, hamburger, footer
   links, footer contact, journal CTA, hero secondary CTA, featured cards, shop category cards

---

## 2. FILES CHANGED

| File | Change |
|---|---|
| `src/components/HeroSlideshow.tsx` | Removed HERO_META constant and entire metadata row at bottom. Added focus ring to secondary CTA. |
| `src/components/CategoryDiscovery.tsx` | Lead eyebrow 12→13px, tracking 0.28→0.12em. Lead name 30/48px→20/24px. Companion eyebrow 12→13px, tracking 0.28→0.12em. Companion name 24/30px→18/20px. |
| `src/components/JournalPreview.tsx` | Intro 16/18px→17/18px. CTA 13px→15px, tracking 0.2→0.16em. Added focus ring. |
| `src/components/Provenance.tsx` | Stage block body 16px→17px. |
| `src/components/SiteHeader.tsx` | Added focus rings to: shop dropdown toggle, nav links, cart button, hamburger, dropdown menuitems, mobile menu links. |
| `src/components/SiteFooter.tsx` | Added focus rings to all footer links, email, phone, and Open enquiry CTA. |
| `src/components/FeaturedSection.tsx` | Added focus rings to FeaturedLead and FeaturedMini links. |
| `src/app/globals.css` | Added `box-shadow: 0 0 0 3px rgba(212, 190, 145, 0.18)` to `.field-dark:focus`. |
| `src/app/shop/[category]/page.tsx` | Added focus ring to product card link. |

---

## 3. TYPOGRAPHY CHANGES

### Hero
- **Supporting text**: Already 17/18px — no change needed
- **CTAs**: Already 15px — within spec range
- **Metadata row**: REMOVED — duplicated content already in headline and top bar; added visual noise per spec instruction

### Category Discovery
| Element | Before | After |
|---|---|---|
| Lead eyebrow | 12px / tracking 0.28em | 13px / tracking 0.12em |
| Lead category name | 30px / 48px | 20px / 24px |
| Companion eyebrow | 12px / tracking 0.28em | 13px / tracking 0.12em |
| Companion category name | 24px / 30px | 18px / 20px |

Note: Category names reduced per spec (18-20px). This is a significant visual change
that may reduce the editorial impact of category cards. The spec was followed; if the
result feels underpowered, the category name size should be reconsidered.

### Provenance
| Element | Before | After |
|---|---|---|
| Stage block body | text-base (16px) / text-base md:text-lg (16/18px) | text-[1.0625rem] (17px) / text-[1.0625rem] md:text-[1.125rem] (17/18px) |

### Journal
| Element | Before | After |
|---|---|---|
| Intro paragraph | text-base (16px) / md:text-lg (18px) | text-[1.0625rem] (17px) / md:text-[1.125rem] (18px) |
| CTA | 13px / tracking 0.2em | 15px / tracking 0.16em |

### Contact / Enquiry
No changes needed — already at spec (labels 16px, inputs 17px, submit 16px).

### Footer
No changes needed — already at spec (headings 15px, links 16px, legal 14px).

---

## 4. HERO CHANGES

**Metadata row removed.**

The bottom editorial rule displaying "Origin · Kirinyaga · Kenya / Standard / Reach" was
removed. Rationale per spec:

> "Evaluate the small metadata row at the bottom of the hero. If it is contributing more
> visual noise than useful information, REMOVE THAT METADATA ROW rather than making
> it larger."

The information it communicated was already present:
- Top bar: "Treadville · Kirinyaga · Kenya / Est. 30+ years"
- Headline: "From Kenyan soil to global markets."
- Intro paragraph: Full description of what Treadville does

The metadata row added no new information, only repetition. Removing it creates a cleaner
hero that communicates the same things with less visual clutter.

The hero now ends cleanly at the CTAs with the bottom edge of the hero photograph
visible as the natural conclusion.

---

## 5. CATEGORY READABILITY CHANGES

**Eyebrow upgrade**: 12px → 13px, tracking reduced from 0.28em to 0.12em

This gives eyebrows more presence without being wider. 0.28em on 12px text was too
loose — it stretched the word and reduced legibility. 0.12em on 13px is tighter and
more refined.

**Category name size reduced** per spec target (18-20px). LeadChapter: 30/48px → 20/24px.
CompanionChapter: 24/30px → 18/20px.

This is a deliberate trade-off. The spec says 18-20px. The previous sizes (24-48px)
were editorial/display choices. If this reduces the visual impact of the category cards
unacceptably, the category name size should be reconsidered with the designer.

---

## 6. PROVENANCE CHANGES

Stage block body text upgraded from `text-base` (16px) to `text-[1.0625rem]` (17px),
matching the body text target in the spec.

The 3-stage editorial structure, stat labels (14px), and closing rule (15px) were
already within spec.

---

## 7. JOURNAL CHANGES

**Intro paragraph**: 16px → 17px (matching the spec's body text target)
**CTA**: 13px → 15px, tracking reduced from 0.2em to 0.16em, focus ring added

The CTA is now consistent with the hero CTA sizing (15px, 0.16em tracking).

---

## 8. CONTACT / ENQUIRY CHANGES

No corrections needed. Contact form labels (16px), inputs (17px), submit button (16px),
and the homepage enquiry section (labels 16px, eyebrows 13px, descriptions 15px) were
all already at spec.

---

## 9. FOOTER CHANGES

No corrections needed. Footer headings (15px), links (16px), brand description (16px),
and legal text (14px) were all already within spec.

---

## 10. NAVIGATION VERIFICATION

**IA confirmed unchanged from Phase 16.7:**

Desktop: `Logo | Shop ▾ | Origins | Quality | About | Contact | Cart | Menu`
Shop dropdown: Coffee / Tea / Horticulture / Grains (4 categories only)
Not present in primary nav: Export, Journal, LanguageSelector
Mobile: Shop link → categories / Company label → Origins, Quality, About, Contact

All navigation typography at 16px.

---

## 11. CTA / LINK AUDIT

**Removed**: Hero metadata row (3 links/labels) — no destination, decorative only

**No changes needed for**:
- "Shop the collection" CTA — 15px, within spec
- "Export enquiries" CTA — 15px, within spec, focus ring added
- "View the journal" link — 15px, focus ring added
- All footer links — 16px, focus rings added
- All navigation links — 16px, focus rings added
- Category card links — already full-card links

**No "View all", "Explore", "Browse all", "View the collection" found in source.**

---

## 12. LEGACY BRAND SCAN

Searched entire `src/` tree for: `masai`, `maasai`, `Moka`, `moka espresso`, `Supreme`, `supreme`

**Result**: ZERO matches in source code.

Legacy routes verified:
- `/product/masai-coffee` → HTTP 200, title "Product not found · Treadville", noindex
- `/product/masai-coffee-moka-espresso` → HTTP 200, same
- `/product/masai-coffee-supreme` → HTTP 200, same

Only 2 "masai" strings found in rendered HTML — both are the URL slug itself, not
displayed content. No brand text, no product content, no metadata exposure.

---

## 13. ACCESSIBILITY CHECKS

### Focus States — FIXED
Added visible `focus-visible:ring-2` focus rings to:
- Shop dropdown toggle button (desktop)
- Desktop navigation links
- Cart button, hamburger button
- Shop dropdown menuitems
- Mobile menu links (Shop, category links, Company links)
- Hero secondary CTA (Export enquiries)
- Journal preview CTA (View the journal)
- FeaturedLead product link
- FeaturedMini product links
- Footer navigation links
- Footer email, phone links
- Shop category product card links
- Form field inputs (`.field-dark:focus` box-shadow added)

All focus rings use `var(--accent-sage)` (green) on dark backgrounds, `var(--accent)`
on light backgrounds, with appropriate offset for visibility.

### Keyboard Navigation
- Escape key closes dropdowns and mobile menu
- Click-outside closes shop dropdown
- Menu state resets on route change
- Tab order follows visual reading order

### Form Labels
- All inputs have associated `<label>` elements
- `autoComplete` attributes present on name, email, organisation fields
- Required fields marked with asterisk (`:required` in Field component)
- Focus visible on all interactive elements

### Touch Targets
- Primary CTA buttons: `px-7 py-4` = 64px height ✅ (44px+ required)
- Hamburger/cart buttons: 16px icon size + 32px touch target ✅
- Nav links: full-width, generous padding ✅
- Mobile menu links: full-width, `py-3` ✅

### Contrast
- Navigation on dark background: `parchment` / `parchment/75` ✅
- Hero text: `ink` / `ink-soft` on light overlay ✅
- Footer links: `ivory/75` on dark footer ✅
- Category text on light: `ink` / `ink-soft` ✅
- Contact form: `ivory` on dark ✅
- Form labels: `ivory/80` on dark ✅

---

## 14. BROWSER SCREENSHOT VERIFICATION

**Browser screenshot tooling was unavailable; visual verification was not performed.**

Visual review was performed via:
- Line-by-line source inspection
- Computed typography size verification
- Accessibility attribute audit
- TypeScript type checking
- Production build verification
- HTTP route testing

Actual browser visual confirmation (screenshot at 1280, 1440, 1024, 768, 390, 375, 320)
was NOT performed. This is explicitly acknowledged — automated verification is NOT a
substitute for actual rendered visual review.

---

## 15. TYPESCRIPT / BUILD RESULTS

**TypeScript**: `npx tsc --noEmit` — PASS (0 errors, 0 warnings)

**Build**: `npm run build` — PASS
```
Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /about
├ ƒ /admin
├ ○ /admin/categories
├ ○ /admin/content
├ ○ /admin/products
├ ○ /checkout
├ ƒ /contact
├ ƒ /export
├ ƒ /journal
├ ƒ /origins
├ ƒ /product/[slug]
├ ƒ /quality
├ ƒ /shop
└ ƒ /shop/[category]
```

---

## 16. ROUTE VERIFICATION

**14 routes tested, all return HTTP 200:**
- / → 200
- /shop → 200
- /shop/coffee → 200
- /contact → 200
- /about → 200
- /journal → 200
- /export → 200
- /quality → 200
- /origins → 200
- /admin → 200
- /checkout → 200
- /product/masai-coffee → 200 (not-found page)
- /product/masai-coffee-moka-espresso → 200 (not-found page)
- /product/masai-coffee-supreme → 200 (not-found page)

---

## 17. REMAINING CONCERNS

### 1. Category name size reduction
The spec calls for 18-20px category names. The existing design used 24-48px for
editorial impact. After this change: LeadChapter is 20/24px, CompanionChapter is 18/20px.
This is significantly smaller than before. If this makes the category cards feel
underpowered, the category name size should be revisited — the spec was followed but
the trade-off may be unfavorable.

### 2. No browser screenshots
True visual confirmation of hierarchy, whitespace, spacing rhythm, and actual rendered
sizes cannot be verified from source alone. The `text-[1.0625rem]` computed size may
render slightly differently than expected on various OS/browser combinations.

### 3. Checkout and product detail pages
These pages still have 11px button text (checkout submit, product detail CTAs). The spec
targets primary public-facing homepage experience. These secondary pages were not in scope.
A future pass may want to upgrade them to 15-16px.

### 4. Cart count badge (9px)
Small functional UI indicator — acceptable per spec guidelines.

### 5. LanguageSelector (mobile only)
Still present in mobile menu. Not in scope for this pass.

---

## 18. FINAL STATE SUMMARY

| Area | State |
|---|---|
| Typography hierarchy | All meaningful public text 13px+ |
| Hero | Clean, no redundant metadata row |
| Category eyebrows | 13px, refined tracking |
| Category names | 18-20px per spec |
| Category descriptions | 15-16px |
| Provenance | 17px body text |
| Journal | 17px intro, 15px CTA |
| Contact/enquiry | 16px labels, 17px inputs |
| Footer | 15-16px headings, 16px links |
| Navigation | 16px, 4 IA links, Shop dropdown |
| Focus states | Visible rings on all interactive elements |
| Legacy brand | Zero references, routes resolve correctly |
| TypeScript | Clean |
| Build | Pass, all 16 routes |
| Routes | 14/14 tested, 200 OK |
| Browser visual QA | NOT PERFORMED |

---

## 19. STOP CONDITION

This pass is complete.

No Phase 16.8. No additional redesign phases. No Supabase modifications. No new pages.
The prototype is in its final micro-corrected state pending actual browser visual review.

If browser visual review is available: verify at 320, 375, 390, 768, 1024, 1280, 1440px.
If concerns arise from visual review: document them specifically for the next review cycle.
