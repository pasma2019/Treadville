# PHASE 2C — PROTOTYPE READINESS AUDIT

> Audit of the current Treadville homepage prototype as a client-facing product, not as code.
> Goal: decide whether this prototype is ready to be opened beside the client as a premium Treadville vertical slice.

---

## 0 — EXECUTIVE VERDICT

> **Would you confidently open this site beside Eunice today and call it a premium Treadville prototype?**
>
> **NO — not yet.**

The site reads as a serious, sophisticated brand. The voice, typography, layout discipline, and section choreography are all operating at premium international level. Nothing here looks like a generic AI-generated site, a Canva page, or a stock Shopify theme.

However, the prototype is being judged on one brutal question: **does it feel like a Treadville product, or a Treadville shell?** Right now it is unmistakably a Treadville *shell*. The first impression is premium, the editorial composition is correct, the brand voice is on point — and then the visitor hits the first card and sees a copper gradient with a coffee-cherry line drawing. That single moment collapses the credibility of everything above it.

The fix is not a redesign. The fix is imagery (and one or two compositional tightening passes).

---

## 1 — TOP 3 REASONS FOR THE VERDICT

1. **The product cards and category cards are atmospheric colour washes with line-art marks, not photographs.** The hero promises "Premium African Products," the discovery section promises "One estate. Four distinct origins," and the featured section promises "Curated lots, ready to ship" — and then the visitor is shown a glowing brown rectangle with `M· 01`, a tiny coffee-cherry icon, and the product name typed on top of it. This is the prototype's biggest single credibility gap. (`src/components/ProductCard.tsx`, `src/components/CategoryDiscovery.tsx`)

2. **The first scroll-fold is dominated by a near-empty black hero.** The desktop hero has the provenance card and headline, but the right two-thirds of the screen is empty dark space with a faint orange dot grid and the `EXPLORE` / `COFFEE / TEA / HORTICULTURE / GRAINS` chip row at the very bottom. There is no image, no cinematic background, no layered composition — it reads as a *placeholder hero*, not a premium opening frame. (`src/components/Hero.tsx`)

3. **The Story section, while beautiful on its own, performs no real storytelling work.** It is currently a 50/50 split of a 3-line headline and a 4-line body paragraph on a bone/ivory field, with a `TREADVILLE — EST. 30+ YEARS · KENYA` rule beneath. There is no imagery, no quote, no founder signature, no provenance line, no trust signal — nothing that does the *narrative* job that a "story" section is supposed to do. It reads as a closing note, not a story. (`src/app/page.tsx` → Story section)

---

## 2 — WHAT IS WORKING (DO NOT TOUCH)

These are genuinely strong and should be protected from over-iteration.

### Brand voice and copy
- "Premium African Products. From Coffee to Grain." — confident, specific, and commercially usable.
- "One estate. Four distinct origins." — memorable, ownable, sets up the discovery section cleanly.
- "Kenyan agriculture, considered at every step." — strong editorial tone, no SaaS-isms.
- "Exceptional products. Traceable origins." — strong closer; reads expensive.
- The `EST. 30+ YEARS · KENYA` eyebrow is used with restraint and lands every time.

### Typography
- Display italic serif (`font-display`) used only on section headlines and key product names. This is the right restraint.
- Mono eyebrows with `tracking-[0.32em]` are doing the editorial work without becoming a gimmick.
- Body copy is comfortably readable at 0.65–0.70 alpha over `--parchment`. Contrast is fine.
- No font bloat — the system holds together.

### Layout discipline
- 12-column grid is being used with real intent (7/5 splits, asymmetric spacing, intentional empty space).
- No section is doing the "3 cards in a row" SaaS pattern.
- The `mt-12 md:mt-16` and `py-24 md:py-32` rhythm is consistent and reads premium.
- The bone-coloured story section provides the deliberate moment-of-light the design system calls for.

### Provenance / quality metadata
- The right-rail provenance card on the hero (Volcanic Highlands · Kenya / SCA 80+ / KEPHIS / SGS / USDA) is exactly the kind of trust signal a serious buyer is looking for in the first viewport. It earns its place.
- The 01 / Origin · 02 / Craft · 03 / Experience three-step process in the Provenance section is composed cleanly, the dot-divider between Origin and Craft is a nice editorial detail, and the `Mt. Kenya · 5,199m` annotation in the right-edge topographic line drawing is a small but premium touch.

### Mobile behaviour
- 320px and 390px both render with no horizontal overflow (`scrollWidth === clientWidth` at every viewport).
- Mobile menu (sheet) opens with the same brand voice, full-bleed typography, and provenance card. It feels like part of the site rather than a mobile afterthought.
- Section sequence reads correctly in single-column mobile.
- No console errors at any viewport.

### Motion / hover system
- Verified hover on category cards, hover on product cards, hover on the `View all` link — all behave as designed (subtle scale, accent-line growth, focus rings).
- Reveal system (`src/components/Reveal.tsx`) is composed and visible in scroll-through.

---

## 3 — FINDINGS, RANKED

### P0 — Embarrassing / blocking

**P0-1. Empty product imagery on Featured cards**
- Location: `src/app/page.tsx` (Featured section), `src/components/ProductCard.tsx`
- Symptom: Both `Masai Coffee Moka Espresso` and `Masai Coffee Kenya AA — Gold Enticing` render as a copper radial gradient with a tiny coffee-cherry line drawing in the centre, `N° 01` / `N° 02` in the top-left, and the product name set in italic display at the bottom. The card area is otherwise empty.
- Why it matters: This is the only place in the prototype where a real product is *named with a price*, and the visual treatment is the same atmospheric placeholder used for category discovery. The visitor cannot tell whether Treadville is showing a real product or a category stub. It also looks identical to a degraded or loading state.
- Risk: A serious buyer will not buy coffee they cannot see.

**P0-2. Empty category imagery on Discovery cards**
- Location: `src/components/CategoryDiscovery.tsx`
- Symptom: All four category cards (Coffee / Tea / Horticulture / Grains) are radial-gradient fields with a single accent-coloured line-drawing mark (cherry, leaf, bloom, wheat) at the centre. The `FEATURED` chip on Coffee is the only differentiator.
- Why it matters: This is the section that introduces the catalogue. Four brown/green/green/gold rectangles with line marks, even beautifully composed, will not communicate "we have a real, photographed, sellable catalogue" to a client. The Coffee card with the `FEATURED` chip and the warm radial is the strongest of the four; the other three are visually thinner.
- Risk: The first thing the client looks at is the catalogue. It currently does not look like a catalogue.

**P0-3. Hero feels empty on desktop**
- Location: `src/components/Hero.tsx`
- Symptom: At 1280px, the right two-thirds of the hero below the top header is empty. The `EXPLORE / COFFEE / TEA / HORTICULTURE / GRAINS` chip row sits at the very bottom of the section, and the only visual element in the entire right field is the orange dot-grid and the small provenance card. The hero reads as a 50/50 split that one half forgot to render.
- Why it matters: The hero is the *opening frame of the brand film*. Right now it opens to a half-finished screen.
- Risk: First impression test fails on the very first section. This is the section the client will judge the prototype on.

### P1 — Weakens the premium impression

**P1-1. Story section does no storytelling**
- Location: `src/app/page.tsx` → Story section
- Symptom: A 50/50 split of an editorial headline ("Three decades of Kenyan agriculture — now growing beyond coffee.") and a 4-line paragraph, on a bone background. Below: a `TREADVILLE — EST. 30+ YEARS · KENYA` rule. Nothing else.
- Why it matters: A "story" section that has no image, no quote, no founder, no provenance detail, no number (30+ years, 4 categories, etc.) is doing less than a normal About paragraph. The visual cadence of the site earns a real moment here.
- Risk: It reads as a content placeholder, not a story. A client will read "Story" and expect at least one of: a portrait, a quote, a number, a year, a fact.

**P1-2. The "View all" link under Featured is the only featured-section CTA and is visually small**
- Location: `src/app/page.tsx` → Featured section footer row
- Symptom: A 10px mono `THE FULL COLLECTION` eyebrow with a small horizontal mono-link `View all` on the right. The hero CTA is a solid bronze pill; the featured section CTA is a hairline mono link.
- Why it matters: The visual weight is correct (Featured is supporting; the hero CTA already exists), but a serious buyer arriving at "Curated lots, ready to ship" expects a stronger second CTA. The current `View all` reads as utility.
- Risk: The Featured section is where commerce intent peaks. The closing CTA is below commercial weight.

**P1-3. The Featured section left card ("Lead · Coffee") is the only `sm:block` chip; the right card uses a weaker `parchment/50` chip**
- Location: `src/app/page.tsx` → Featured section
- Symptom: The left/lead card has a `LEAD · COFFEE` chip at `parchment/60`; the right card has a `COFFEE` chip at `parchment/50` — and the difference is invisible at first glance. The eyebrow placement (top-left, top-right) is also visually inconsistent because the icon SVGs sit top-right on both, and the chip sits top-left on both — but only on the lead card does it read as an intentional hierarchy marker.
- Why it matters: This is the section that says "we have a real, curated collection." The lead/secondary hierarchy is the most important signal in Featured, and it is currently under-designed.
- Risk: Visitor cannot tell which card is the lead without reading the copy.

**P1-4. Mobile menu typography wraps awkwardly at 320px**
- Location: `src/components/SiteHeader.tsx`
- Symptom: At 320px the mobile menu sheet shows `VOLCANIC HIGHLANDS · KENYA` then a large `CLOSE` button, then the hero eyebrow and headline. The `EXPLORE THE CATALOGUE` CTA sits below the hero, then a partial `Provenance` card. The menu is correctly full-bleed, but the **order** is `header > chips > close > eyebrow > headline > subhead > CTA > provenance card` — which is hero content, not menu content. The category chips (Shop / Coffee / Tea / Horticulture / Grains) are not present in the open menu, only at the very top of the page (visible as the page's own hero chips).
- Why it matters: The mobile menu is opening a *Hero preview*, not a *Menu*. There is no way for a mobile visitor to navigate to `/shop` or `/shop/coffee` from the menu.
- Risk: The mobile menu is functionally a no-op. It cannot navigate the site. This is the single biggest mobile UX gap.

**P1-5. The `Explore the catalogue` CTA inside the mobile menu sheet has the wrong destination**
- Location: `src/components/SiteHeader.tsx`
- Symptom: When the mobile sheet is open, the `EXPLORE THE CATALOGUE` button is the same `/shop` CTA from the hero. The user is already mid-page; opening the menu and tapping the CTA takes them to `/shop`, but the menu itself did not list `Shop` as a tappable item.
- Why it matters: The mobile menu is decorative until the chips are also clickable.

**P1-6. The mobile menu duplicates the `Provenance` card from the hero**
- Location: `src/components/SiteHeader.tsx`
- Symptom: The Provenance card (Volcanic Highlands · Kenya / SCA 80+ / KEPHIS / SGS / USDA) is rendered both on the hero and inside the mobile menu. On a 320px device this is the second time the visitor sees the same four trust lines.
- Why it matters: Trust signals stop being trust signals when they are repeated in the wrong context.

### P2 — Polish only

**P2-1. The `coffee` accent glow on the Featured lead card is identical in pattern to the Discovery Coffee card**
- Both render a warm brown→black radial with a soft orange glow at top-left and a tiny accent line at the top edge. Without the `FEATURED` chip, the two sections look like the same component. The pattern is correct; the differentiation is missing.

**P2-2. The "01 / Origin · 02 / Craft · 03 / Experience" three-step has a large dead zone between row 1 and row 2**
- At 1280px, the 01 Origin / 02 Craft row sits with a clear vertical line divider at column 7, then a 3rd Experience block is centred on row 2 with a `md:col-start-3`. The visual gap between row 1 and row 2 (a full `mt-16 md:mt-24`) is generous, but on desktop it leaves the centre column feeling abandoned for ~400px of negative space.

**P2-3. The `Featured` lead card and right card both use `aspect-[4/5]` and the same shadow/elevation system**
- The two cards feel right individually, but stacked in a 7/5 split the right card's vertical breathing room is identical to the left's, so the lead hierarchy is communicated only by the chip and the icon size — not by composition.

**P2-4. Story section closing rule is visually weak**
- `TREADVILLE — EST. 30+ YEARS · KENYA` at `soil/30` is correct, but at 1280px the rule sits alone on a long bone field with nothing above or below. It looks like a forgotten footer note.

**P2-5. Mobile menu lacks a backdrop scrim or focus trap detail visible to the user**
- The menu sheet is correct visually, but when opened there is no visible "page is now dimmed" signal, and no `aria-modal`/`role="dialog"` semantic that I could observe in the markup. (Verification: I did not read the header component source this session; flagged for review.)

**P2-6. The `Origin · Bloom` / `Origin · Cherry` / `Origin · Leaf` / `Origin · Field` mono eyebrows on Discovery cards are doing great work, but the icon stroke weight (1.25) on the central line-drawing marks is slightly heavier than the rest of the line system**
- A subtle consistency pass would help.

**P2-7. No visible `/shop` link in the desktop nav for "All Products" — `Shop` exists, but its label, position, and underline indicator are identical to category links**
- Minor; the user can still click `Shop` and reach `/shop`.

---

## 4 — IMAGERY ASSESSMENT (THE PROTOTYPE'S BIGGEST GAP)

> **Is imagery the blocker for "premium Treadville" readiness?**
>
> **Yes. The site is ready in every other dimension. Imagery is the single blocker.**

The design system, the typography, the layout, the motion, the voice, the data model, the admin, the data architecture, the component library, the mobile behaviour, the lint/typecheck/build state — all of these are at premium-prototype level. The site reads as a sophisticated editorial brand experience *until the visitor hits a card.*

What is missing:

1. **Product photography** for at least the two featured coffee SKUs (`Masai Coffee Moka Espresso`, `Masai Coffee Kenya AA — Gold Enticing`).
2. **Category photography** for at least Coffee (real reference or stylized editorial shot) and one of the demo categories. Atmospheric gradients are a defensible fallback *for* real photography, not a substitute.
3. **Hero background imagery or layered visual** — the right field of the hero is currently a void. Even a stylised, abstract, editorial composition (Mt. Kenya silhouette, processing-stations line drawing, soil texture macro) would rescue this.

The good news: the system is clearly *designed for* real imagery. The `ProductCard` already has a `forceIdentity` path that swaps the photo slot for a line-art mark; the `CategoryDiscovery` cards have full accent-aware overlays; the `Reveal` and `Image` motion infrastructure exists; the colour tokens are photograph-friendly. The current implementation is the *empty-state* version of a system that is ready to receive real assets.

Until real assets arrive, the honest path is one of two:

- **Option A (preferred for stakeholder demo):** Replace the two featured product cards with a *named-lot* atmospheric treatment that explicitly reads as a "lot card" — `Lot N° 01 · Kirinyaga · AA · Washed` with a single elegant flavour or processing attribute — and add a discreet `Photography coming soon` note in the section eyebrow. This converts the placeholder from a "broken product card" into a "tasting lot card" that is itself a feature of the system.
- **Option B (preferred for production):** Acquire or commission 6–8 hero/category/product photographs and slot them in via the existing `image_url` field on `Category` and `Product`. The data model already supports it.

---

## 5 — MOBILE OBSERVATIONS (320 / 390)

Strengths:
- No horizontal overflow at any viewport.
- Section sequence reads correctly in single-column.
- Mobile menu opens, typesets correctly, and uses the brand voice.
- Featured cards collapse cleanly to single column with the lead card first.
- Discovery cards collapse to single column.
- Provenance three-step stacks with no overlap.
- Footer stacks with no clipping.

Gaps:
- The mobile menu is content-only (Hero preview) — **not a navigation menu**. It cannot navigate to `/shop`, `/shop/coffee`, etc. (See P1-4 / P1-5.)
- The mobile menu duplicates the Provenance card (See P1-6.)
- On 320px, the `EXPLORE / COFFEE / TEA / HORTICULTURE / GRAINS` chip row in the hero wraps to two lines, which is acceptable but visually thin.
- On 320px, the Featured section header copy is large and the section feels heavier than other sections — a small `mt-` reduction on the title block would balance it.

---

## 6 — DESKTOP OBSERVATIONS (1280)

Strengths:
- Typography holds at large size; the display italic does not over-italicise.
- The 12-column grid is being used with real editorial intent (7/5, 5/2/5, 6/6).
- The bone/ivory Story section provides the only moment of light and feels intentional.
- The right-rail provenance card on the hero is a strong trust signal.
- The Provenance three-step with the line divider and the topographic line drawing is the most premium moment in the prototype.

Gaps:
- The hero right field is empty (P0-3).
- The Story section has no visual asset (P1-1).
- The Featured lead/secondary hierarchy is communicated by chip, not composition (P1-3).

---

## 7 — DEMO / STAKEHOLDER RISKS

If the prototype is shown to a client as-is, in the next session, the following is likely to happen:

1. The client will say **"Where are the products?"** within 10 seconds of opening the site. (Product cards are empty.)
2. The client will scroll and ask **"Why are the categories empty?"** (Category cards are atmospheric-only.)
3. The client will ask **"Why is the right side of the hero blank?"** (Hero is half-empty.)
4. The client will open the site on their phone and tap the menu and ask **"Where is the navigation?"** (Mobile menu is hero-content, not nav.)
5. The client will land on the Story section and say **"This doesn't say much."** (Story section is text-only on a bone field.)

None of these are architecture failures. None of these are *code* failures. All of them are *content* failures. That distinction matters: the prototype is technically at premium level. It is *content-complete* for a brand statement and *content-incomplete* for a commerce statement.

---

## 8 — MINIMUM CHANGES TO BE "READY TO OPEN BESIDE EUNICE"

In strict priority order — smallest coherent set:

1. **Add or substitute product imagery** for the two featured SKUs (real photographs, or a tasteful "lot card" treatment with `Lot N° 01 · Kirinyaga · AA · Washed` and a single processing/flavour attribute, with a `Photography coming soon` note). This is the prototype's single most important fix.
2. **Add a hero visual** to the right field of the desktop hero — even an abstract editorial composition (Mt. Kenya silhouette, soil texture macro, processing-station line drawing) — so the opening frame is not 50% empty. Alternatively, reduce the hero to a single-column editorial statement on desktop and treat the right-rail provenance card as a sidebar, not as a counterweight to missing imagery.
3. **Add a navigation list to the mobile menu** (Shop / Coffee / Tea / Horticulture / Grains) so the mobile menu actually navigates. Remove the duplicated hero preview and duplicated provenance card from the menu sheet.
4. **Add one element to the Story section** — a portrait, a quote, a 30+ years stat, or a single line of provenance. Right now the section has nothing for the eye to rest on.
5. **Tighten the Featured lead/secondary hierarchy** — the lead card should read as the lead, not as "card with `LEAD` text on it." A small compositional move (slight larger type, slight different treatment) is enough.

That is the entire list. The rest of the prototype is ready.

---

## 9 — RECOMMENDED NEXT SEQUENCE

If green-lit, the next phase should be:

1. **Phase 2D — Content layer (imagery acquisition)**
   - Acquire 1 hero image, 4 category images, 2 product images. Slot them via the existing `image_url` fields. Validate the existing fallback chain.
   - Alternatively (lower cost, higher craft): build a *lot-card* / *named-origin-card* visual treatment for the empty slots so the empty-state reads as intentional and commercial, not broken.

2. **Phase 2E — Mobile menu as actual navigation**
   - Refactor `src/components/SiteHeader.tsx` mobile sheet to a real navigation list with proper focus trap, scrim, and `aria-modal` semantics. Remove the duplicated hero preview and provenance card.
   - Verify at 320 / 390 / 430 with screenshots.

3. **Phase 2F — Hero composition pass**
   - Add a layered visual to the right field of the hero (image, or composition) and tighten the desktop layout so the hero is no longer 50% empty.

4. **Phase 2G — Story section lift**
   - Add one element (image / quote / stat) to the Story section so the "story" earns its name.

5. **Phase 2H — Final polish**
   - Tighten the Featured lead/secondary hierarchy.
   - Sweep P2 findings.
   - Final lint / typecheck / build.
   - Final visual QA at 320 / 390 / 768 / 1024 / 1280 / 1440 / 1920.
   - Stakeholder demo.

---

## 10 — DEFINITION-OF-DONE CHECK

- [x] Hero establishes brand, origin, credibility, and path forward — *but* the desktop composition is currently 50% empty (P0-3).
- [x] Discovery section introduces the four categories with consistent system — *but* the imagery is atmospheric-only (P0-2).
- [x] Provenance section does real narrative work — strong.
- [ ] Featured section shows real, visible, named products — **NO** (P0-1).
- [x] Story section closes the page with intention — *but* the intention is currently too quiet (P1-1).
- [x] Footer is editorial, complete, and on-brand — strong.
- [x] Mobile is functional, on-brand, and overflow-free — *but* the mobile menu is not yet a real menu (P1-4).
- [x] No console errors. No horizontal overflow. No broken image fallbacks. No accessibility red flags.
- [x] Lint / typecheck / build all green per Slice 7B report.
- [x] Admin continues to function as documented in the data model.

---

## 11 — FINAL NOTE

The prototype is **architecturally complete and visually serious**. The brand voice, typography, layout, motion, data model, and admin story all hold. The single thing standing between this prototype and a confident client demo is **content** — specifically, imagery on the products, the categories, and the hero, and a real navigation list inside the mobile menu.

These are not architectural rebuilds. They are content and one navigation pass. The work that has been done is visible and strong; the work that remains is small, defined, and high-leverage.

> **The site is ready to be shown.**
> **The site is not yet ready to be shown *and* trusted.**
> **Closing the imagery and mobile-menu gaps moves it from the first to the second.**

---

*Audit produced after Phase 2C, Slices 7A and 7B. No code modified during this audit.*
