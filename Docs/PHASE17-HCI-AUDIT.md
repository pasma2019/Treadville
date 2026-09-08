# PHASE 17 — HCI AUDIT

## Overview

Audit-first approach as required by operating rules. All public-facing routes and components
inspected. Problems classified by severity and implementation sequence identified.

---

## PHASE 17A — HEADER / NAVIGATION

### Current IA
```
Logo | Shop ▾ | Origins | Quality | About | Contact | Cart | Menu
```

### Spec Target IA
```
TREADVILLE | Shop ▾ | Origins | Services | About | Journal | Enquire
```

### Differences

| Item | Current | Spec Target | Action |
|---|---|---|---|
| Link 4 | "Quality" | "Services" | Rename label to "Services" (same /quality page) |
| Link 6 | "Contact" | "Enquire" | Rename label to "Enquire" (same /contact page) |
| Journal | In footer only | Add to primary nav | Add as new nav link |
| Export | In footer only | Should be reachable from nav | Export page is a destination, not nav category |

### Proposed IA
```
Logo | Shop ▾ | Origins | About | Journal | Enquire | Cart | Menu
```

Rationale: Adding both "Services" AND "Journal" to nav creates 7 items before cart. The spec's
target IA lists "Services" between Origins and About. However, "Services" is not a page.
The existing /export page handles export/samples/wholesale. Adding a new "Services" link
without a Services page creates a broken navigation item. Better to follow the spirit:
- "Services" concept is served by: Export page (export logistics) + Contact (samples/quotes)
- Add Journal to primary nav since it is a real page
- Rename "Contact" to "Enquire" in the nav label

Alternative IA (more aligned with spec):
```
Logo | Shop ▾ | Origins | Services ▾ | About | Journal | Enquire | Cart | Menu
```
Where Services ▾ contains: Export, Journal. But this adds complexity.

### Shop Dropdown
Current: only 4 category links
Spec: must include "View all products" + 4 categories

**Action: Add "View all" link to top of Shop dropdown.**

### Files Affected
- `src/components/SiteHeader.tsx` — IA_LINKS update, label renames, dropdown addition
- `src/i18n/` — nav label translations if present

### Risks
- Changing nav labels affects translation files (i18n)
- Adding Journal to nav may conflict with footer journal link (acceptable duplication)

---

## PHASE 17B — TYPOGRAPHY SYSTEM

### Current State (from source inspection)

| Area | Element | Current | Spec Target | Status |
|---|---|---|---|---|
| Navigation | Desktop nav links | 16px | 16px | ✅ OK |
| Navigation | Mobile nav links | 16px | 16px | ✅ OK |
| Navigation | Mobile nav section label | 17px | 16px | ⚠️ Slightly large |
| Hero | Supporting text | 17/18px | 17-20px | ✅ OK |
| Hero | CTAs | 15px | 15-16px | ✅ OK |
| Hero | Top bar text | 12px | 13-14px | ⚠️ At eyebrow level |
| Category | Eyebrow | 13px | 13px | ✅ OK |
| Category | Name (Lead) | 20/24px | 18-20px | ⚠️ 20px/24px |
| Category | Name (Companion) | 18/20px | 18-20px | ✅ OK |
| Category | Description | 15px | 15-16px | ✅ OK |
| Provenance | Intro | 17/18px | 17-18px | ✅ OK |
| Provenance | Stage body | 17px | 17-18px | ✅ OK |
| Provenance | Stat labels | 14px | 13-14px | ✅ OK |
| Journal | Intro | 17/18px | 17-20px | ✅ OK |
| Journal | CTA | 15px | 15-16px | ✅ OK |
| Journal | Excerpt | 15px | 15-16px | ✅ OK |
| Story | Body | 17/18px | 17-18px | ✅ OK |
| Story | Stat labels | 13px | 13-14px | ✅ OK |
| Enquiry | Body | 17/18px | 17-18px | ✅ OK |
| Enquiry | Card eyebrows | 13px | 12-13px | ✅ OK |
| Enquiry | Card descriptions | 15px | 15-16px | ✅ OK |
| Contact | Labels | 16px | 15-16px | ✅ OK |
| Contact | Inputs | 17px | 16-17px | ✅ OK |
| Contact | Submit | 16px | 15-16px | ✅ OK |
| Footer | Headings | 15px | 15-16px | ✅ OK |
| Footer | Links | 16px | 15-16px | ✅ OK |
| Footer | Legal | 14px | 13-14px | ✅ OK |
| Footer | Description | 16px | 15-16px | ✅ OK |
| Export | Eyebrows | 10px | 12-13px | ❌ FAIL |
| Export | Body | 16px | 17px | ⚠️ Slightly low |
| Export | CTA buttons | 11px | 15-16px | ❌ FAIL |
| About | Eyebrows | 10px | 12-13px | ❌ FAIL |
| About | Body | 16px | 17px | ⚠️ Slightly low |
| About | CTA buttons | 11px | 15-16px | ❌ FAIL |
| About | Pillar body | 14px | 15-16px | ⚠️ Slightly low |
| Origins | Eyebrows | 12px | 12-13px | ✅ OK |
| Origins | Body | 16px | 17px | ⚠️ Slightly low |
| Origins | CTAs | 13px | 15-16px | ⚠️ Slightly low |
| Quality | Eyebrows | 12px | 12-13px | ✅ OK |
| Quality | Body | 16px | 17px | ⚠️ Slightly low |
| Quality | CTAs | 13px | 15-16px | ⚠️ Slightly low |
| Journal | Page eyebrows | 12px | 12-13px | ✅ OK |
| Journal | Page body | 16px | 17px | ⚠️ Slightly low |

### Summary
Homepage/public-facing pages already at spec after Phase 16.7 and Micro HCI corrections.
Secondary pages (export, about, origins, quality, journal) have eyebrow text at 10px and CTA
buttons at 11px — below spec. These are secondary pages but still public-facing.

**Action: Upgrade secondary page typography — eyebrows 10→12px, CTAs 11→15px, body 16→17px where needed.**

### Files Affected
- `src/app/export/page.tsx` — eyebrows, CTA buttons, body
- `src/app/about/page.tsx` — eyebrows, CTA buttons, body
- `src/app/origins/page.tsx` — body, CTAs
- `src/app/quality/page.tsx` — body, CTAs
- `src/app/journal/page.tsx` — body

---

## PHASE 17C — CONTACT PAGE

### Current Issues

1. **Labels use uppercase micro-text pattern**: "Name", "Email", "Organisation", "Enquiry type" — spec wants human readable labels
2. **Labels are 16px but uppercase + tracking creates visual noise**: current label is fine in size but looks aggressive
3. **"Organisation" label** could be "Company" per spec
4. **No "Estimated volume" field** — spec suggests this but adding it changes the data model. Keep existing fields.
5. **Select field for enquiry type**: good, but the dropdown could have cleaner styling
6. **No enquiry type option for "Export & wholesale" visible at top** — currently it's in the dropdown
7. **Helper text**: the 3-call-to-action block at top of form (L116-132) is verbose — user sees it before they see the form

### Proposed Redesign

**Labels** (from → to):
- "Name" → "Your name"
- "Email" → "Work email"
- "Organisation" → "Company" (optional note: "(optional)")
- "Enquiry type" → "What can we help you with?"
- Keep existing options: "General enquiry", "Sample request", "Export / wholesale", "Press & media", "Partnership"

**Layout**: keep 2-column for name/email, full-width for rest.

**Helper text block**: reduce to 1-2 lines, not a full bordered box.

**Focus states**: already have `focus-visible:ring` on submit button. Input focus is `box-shadow` ring (added in micro HCI pass).

### Files Affected
- `src/app/contact/page.tsx` — form Field component and form layout

---

## PHASE 17D — FOOTER

### Current Issues

1. **Column headings** (L41, L60, L82): "Shop", "Company", "Contact" — spec wants "EXPLORE / WORK WITH US / COMPANY / CONTACT"
2. **No "Work With Us" group**: export and samples are important for B2B but not grouped
3. **NewsletterForm**: imported but unused — dead import
4. **Spacing between columns**: could be more generous
5. **Brand description** (L33-36): 16px — acceptable but could be tightened
6. **"Open enquiry" link** (L109-114): functional but the arrow line is decorative

### Proposed Footer Structure

**Column 1: EXPLORE**
- Full catalogue (→ /shop)
- Coffee (→ /shop/coffee)
- Tea (→ /shop/tea)
- Horticulture (→ /shop/horticulture)
- Grains (→ /shop/grains)

**Column 2: WORK WITH US**
- Request a sample (→ /contact?type=sample)
- Export enquiry (→ /contact?type=quote)
- Wholesale (→ /contact)

**Column 3: COMPANY**
- Our story (→ /about)
- Quality (→ /quality)
- Origins (→ /origins)
- Journal (→ /journal)

**Column 4: CONTACT**
- info@treadville.co.ke
- +254 722 479985
- Nairobi, Kenya
- Open enquiry (→ /contact)

### Files Affected
- `src/components/SiteFooter.tsx` — column structure, headings, links, remove NewsletterForm import

---

## PHASE 17E — CTA DISCIPLINE

### Homepage
- Hero: "Shop the collection" + "Export enquiries" — 2 actions, both clear ✅
- Category cards: full-card links — clickable without CTA label ✅
- Journal: "View the journal" CTA — 1 action ✅
- Featured: conditional on data — already graceful ✅
- Story: no CTA — intentional editorial ✅
- Enquiry: 3 cards linking to contact — purpose-clear ✅

**No redundant CTAs found on homepage.**

### Shop Pages
- shop/page.tsx: no redundant CTA — just the grid + CategoryTabs ✅
- shop/[category]/page.tsx: no redundant CTA — just the grid ✅

### Contact Page
- Contact: submit button + "Open enquiry" sidebar link — clear ✅

### Secondary Pages
- Export page L229-238: "Open export enquiry" (primary) + "Browse catalogue" (secondary) — 2 actions, clear ✅
- About page L209-220: "Start a conversation" (primary) + "Export enquiry" (secondary) — 2 actions, clear ✅

**No excessive CTA redundancy found.**

### Hero Top Bar
- "Treadville · Kirinyaga · Kenya" + "Est. 30+ years" — decorative labels, not links. Acceptable.

---

## PHASE 17F — HOMEPAGE INFORMATION HIERARCHY

### Current Structure (7 sections)
1. **HeroSlideshow** — What Treadville is + premium positioning ✅
2. **CategoryDiscovery** — What Treadville offers ✅
3. **Provenance** — Where products come from ✅
4. **JournalPreview** — Editorial credibility (why trust) ✅
5. **FeaturedSection** — Conditional on data, graceful if empty ✅
6. **Story** — Three decades, four categories, 80+ SCA (why trust) ✅
7. **Enquiry** — How to engage + contact ✅

### Spec Required:
1. What Treadville is ✅ (Hero)
2. What Treadville offers ✅ (CategoryDiscovery)
3. Why Treadville can be trusted ✅ (Story + Provenance)
4. Where the products come from ✅ (Provenance)
5. How buyers can engage ✅ (Enquiry)
6. Contact ✅ (Enquiry cards + nav)

### Verdict
Homepage structure is clean. No filler sections. No fake featured products (conditional on data).
No changes needed to homepage structure.

---

## PHASE 17G — LIGHT PREMIUM VISUAL SYSTEM

### Issues Found

#### 1. Category Shop Pages — Brown Radial Gradients (shop/[category]/page.tsx)
The `categoryAtmosphere()` function uses brown/amber radial gradients:
- Coffee: `rgba(184, 114, 58, 0.16)` — warm coffee brown
- Tea: `rgba(122, 158, 122, 0.18)` — green (acceptable)
- Horticulture: `rgba(147, 161, 60, 0.16)` — yellow-green (acceptable)
- Grains: `rgba(201, 154, 61, 0.18)` — amber/gold (borderline)

Spec says: "DO NOT introduce: brown gradients, coffee-colored overlays, decorative gradient washes"

**Action: Replace coffee brown radial gradient with neutral warm grey. Keep tea/horticulture/grains as-is (natural category colors).**

#### 2. Export/About/Quality Pages — Dark Warm Brown Backgrounds
These pages use dark warm brown `#1e1508`, `#140f07`, `#0f0b08` backgrounds.
This IS the dark visual language — not "light premium" but deliberately dark for those pages.
Per spec: "Dark sections: use strategically for provenance/origin storytelling and contrast"
These pages are intentionally dark — they are about origin, quality, export.
**Keep as-is.** The dark sections serve storytelling purpose.

#### 3. Hero Photography — Scrim Treatment
HeroSlideshow uses a cream scrim on the left half of the hero photograph.
`linear-gradient(90deg, rgba(245,239,226,0.45) 0%, ..., rgba(0,0,0,0) 100%)`
This is for text readability over photography. Spec says: "Do not place opaque overlays over supplied
photography unless necessary for text readability."
**Keep — this IS necessary for text readability.**

#### 4. FeaturedSection — Cream Background
Uses `linear-gradient(180deg, #f3eadb 0%, #f8f4ec 40%, #faf7f0 100%)` — warm cream.
This is part of the light-premium system. **Keep.**

#### 5. CategoryDiscovery — Bone Background
Uses `bg-[var(--bone)]` — light warm neutral. **Keep.**

### Files Affected
- `src/app/shop/[category]/page.tsx` — neutralize coffee category radial gradient

---

## PHASE 17H — ACCESSIBILITY AUDIT

### Focus States
From Phase Final Micro HCI pass:
- ✅ Shop dropdown toggle: focus ring added
- ✅ Desktop nav links: focus ring added
- ✅ Cart button, hamburger: focus ring added
- ✅ Mobile menu links: focus ring added
- ✅ Hero CTAs: focus ring on secondary
- ✅ Journal CTA: focus ring added
- ✅ Featured section: focus rings added
- ✅ Footer links: focus rings added
- ✅ Form inputs: box-shadow focus added

### Form Accessibility (Contact)
- ✅ All inputs have `<label>` elements
- ✅ `autoComplete` attributes on name, email, organisation
- ✅ Required fields marked with asterisk
- ✅ Focus states visible (box-shadow on focus)
- ⚠️ No `aria-describedby` for helper text

### Contrast
- ✅ Navigation on dark: `parchment` / `parchment/75`
- ✅ Hero text: `ink` / `ink-soft` on cream scrim
- ✅ Category text on light: `ink` / `ink-soft`
- ✅ Footer on dark: `ivory` / `ivory/75`
- ✅ Contact form on dark: `ivory` on `#140f07`
- ⚠️ Some eyebrows at 10px may have reduced contrast — secondary metadata only

### Touch Targets
- ✅ Primary CTAs: `px-7 py-4` = 64px height (well above 44px minimum)
- ✅ Hamburger/cart: 16px icon + generous touch area
- ✅ Mobile menu links: full-width, `py-3`

### Keyboard Navigation
- ✅ Escape closes dropdowns/menu
- ✅ Tab order follows reading order
- ✅ Menu state resets on route change

---

## PHASE 17J — DEAD / ORPHANED UI

### Orphaned Components Found

| Component | Status | Action |
|---|---|---|
| `CategoryQuickNav.tsx` | Not imported anywhere | KEEP (harmless, may be re-used) |
| `GlassPanel.tsx` | Not imported anywhere | KEEP (harmless, may be re-used) |
| `Button.tsx` | Not found in codebase | Investigate |
| `NewsletterForm` import | Imported in SiteFooter, not used | REMOVE import from SiteFooter |
| `LanguageSelector` | Used in mobile menu only | KEEP |

### Verified Removed (from prior phases)
- ✅ "Four origins · One Treadville" — removed
- ✅ "The collection" divider — removed
- ✅ "View all" in Shop dropdown — removed
- ✅ "Explore" CTAs on category cards — removed
- ✅ "View all" in Featured section — removed
- ✅ "From the same lot" eyebrow — removed
- ✅ HeroChapters, ChapterVisual — not found in codebase
- ✅ "Explore the chapters" — not found

### Files Affected
- `src/components/SiteFooter.tsx` — remove `import NewsletterForm`

---

## IMPLEMENTATION SEQUENCE

### Tier 1 — Critical (HCI impact)
1. Contact form — human labels + cleaner layout (Phase 17C)
2. Footer restructure — headings + "Work With Us" group + remove dead import (Phase 17D)
3. Navigation IA — rename Contact→Enquire, add Journal to nav, add "View all" to Shop dropdown (Phase 17A)

### Tier 2 — Important (readability)
4. Secondary page typography — export/about eyebrows 10→12px, CTAs 11→15px (Phase 17B)

### Tier 3 — Refinement (visual quality)
5. Coffee category brown gradient neutralized (Phase 17G)

### Tier 4 — Verification
6. TypeScript, lint, build, route tests (Phase 17K)

---

## SUMMARY: CHANGES BY FILE

| File | Changes |
|---|---|
| `src/components/SiteHeader.tsx` | Rename Contact→Enquire, add Journal link, add "View all" to Shop dropdown |
| `src/components/SiteFooter.tsx` | Restructure columns: EXPLORE / WORK WITH US / COMPANY / CONTACT, remove NewsletterForm import |
| `src/app/contact/page.tsx` | Human labels (Your name, Work email, Company, What can we help you with?), cleaner layout |
| `src/app/shop/[category]/page.tsx` | Neutralize coffee brown radial gradient |
| `src/app/export/page.tsx` | Eyebrows 10→12px, CTAs 11→15px, body 16→17px |
| `src/app/about/page.tsx` | Eyebrows 10→12px, CTAs 11→15px, body 16→17px, pillar body 14→15px |
| `src/app/origins/page.tsx` | Body 16→17px, CTAs 13→15px |
| `src/app/quality/page.tsx` | Body 16→17px, CTAs 13→15px |
| `src/app/journal/page.tsx` | Body 16→17px |

---

## KNOWN RISKS

1. **i18n impact**: Changing nav labels from "Contact" to "Enquire" requires updating translation files.
   Must verify i18n keys exist or are handled gracefully.
2. **Footer link duplication**: "Journal" and "Export" will appear in both footer and nav. This is
   intentional — nav for discovery, footer for completion.
3. **Secondary page typography**: These pages are less critical but still public. The 10px eyebrows
   and 11px CTAs are below spec. Upgrading them risks visual regression if not tested.
4. **Brown gradient removal**: Changing the coffee category atmospheric gradient may reduce the
   "coffee brand" feel. The spec wants neutral. Risk: perceived visual identity shift.
5. **No "Services" page**: The spec target IA includes "Services" but no /services page exists.
   The Export page handles the services concept. Adding a broken link is worse than not adding.
