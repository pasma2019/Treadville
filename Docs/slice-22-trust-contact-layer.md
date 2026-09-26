# Slice 22 — Trust + Contact Layer

**Date:** 2026-09-19
**Branch:** `prototype/bolt-image-optimization`
**Status:** Implemented, not committed

---

## 1. Files Changed

| File | Type | Lines Added | Lines Removed | Net |
|------|------|-------------|---------------|-----|
| `src/components/WhatsAppCTA.tsx` | New | +33 | — | +33 |
| `src/app/globals.css` | Modified | +69 | — | +69 |
| `src/app/(storefront)/layout.tsx` | Modified | +2 | — | +2 |
| `src/components/SiteHeader.tsx` | Modified | +8 | -1 | +7 |
| `src/components/SiteFooter.tsx` | Modified | +44 | -3 | +41 |
| **Total** | | **+156** | **-4** | **+152** |

Note: `src/app/(storefront)/contact/layout.tsx` and `src/app/sitemap.ts` also show in `git diff --stat` but those changes are from Slice 21 (legal pages), not this slice.

---

## 2. WhatsApp CTA Implementation

### Component: `src/components/WhatsAppCTA.tsx`

- **Type:** `"use client"` — requires client-side rendering for the `<a>` tag interactivity
- **Utility used:** `buildWaLink` from `src/lib/wa-link.ts` (existing, no new utility created)
- **Phone number:** `+254722479985` — normalized by `normalizeWaPhone` to `254722479985`
- **Prefilled message:** `"Hello Treadville, I'd like to enquire about your products."`
- **Generated URL:** `https://wa.me/254722479985?text=Hello%20Treadville%2C%20I'd%20like%20to%20enquire%20about%20your%20products.`
- **Opens in:** New tab (`target="_blank"`, `rel="noopener noreferrer"`)
- **Fallback:** Returns `null` if `buildWaLink` returns null (defensive)

### Placement

Rendered in `src/app/(storefront)/layout.tsx` — appears on every storefront page as a fixed-position element alongside `<CartDrawer />`.

### Styling: `src/app/globals.css`

```css
.wa-cta {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 900;
  /* Green gradient pill, white text, subtle shadow */
  background: linear-gradient(135deg, rgba(37, 211, 102, 0.92), rgba(30, 170, 80, 0.95));
  border-radius: 9999px;
  padding: 14px 20px;
}
```

Key design decisions:
- **Pill shape** (border-radius: 9999px) — premium, not a round bubble
- **Green gradient** — WhatsApp brand color, but muted (0.92/0.95 opacity) to avoid garishness
- **Subtle shadow** — not a heavy drop shadow; light green-tinted glow
- **`z-index: 900`** — above page content, below modals/drawers
- **Font:** Inherits `--font-body` (DM Sans) for brand consistency

### Hover behavior (touch-safe)

```css
@media (hover: hover) and (pointer: fine) {
  .wa-cta:hover {
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3), 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
}
```

- Hover elevation only activates on devices with hover capability AND fine pointer
- Touch devices get no hover effect — the button remains static and fully usable
- `:active` provides tap feedback with `scale(0.97)`

### Mobile adaptation

```css
@media (max-width: 639px) {
  .wa-cta {
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    font-size: 0.8125rem;
  }
}
```

- Tighter inset from viewport edges on small screens
- Slightly smaller padding and font for compact mobile layouts

### Accessibility

- `aria-label="Chat with Treadville on WhatsApp"` — descriptive accessible name
- SVG icon has `aria-hidden="true"` — decorative, not announced
- `focus-visible` ring: `2px solid var(--gold)` with `outline-offset: 3px`
- Keyboard: standard `<a>` tag — focusable via Tab, activatable via Enter
- No hover-only functionality — button is always visible and clickable

---

## 3. Header Contact (Click-to-Call)

### File: `src/components/SiteHeader.tsx`

**Change:** Added a phone icon link to the right side of the nav pill, before the cart button.

```tsx
<a
  href="tel:+254722479985"
  aria-label="Call Treadville: +254 722 479985"
  className="nav-icon-btn hidden sm:flex"
>
  <Phone size={16} />
</a>
```

- **Icon:** `Phone` from `lucide-react` (already a project dependency)
- **Visibility:** `hidden sm:flex` — hidden on mobile (WhatsApp CTA handles mobile contact), visible on tablet+ (640px+)
- **Style:** Uses existing `nav-icon-btn` class — matches cart and hamburger button styling
- **Accessible:** `aria-label` with full phone number
- **No nav redesign** — single element added to existing right-side button group

---

## 4. Footer Contact Audit

### File: `src/components/SiteFooter.tsx`

**Existing contact info (confirmed correct):**

| Field | Value | Link Type | Status |
|-------|-------|-----------|--------|
| Email | `info@treadville.co.ke` | `mailto:info@treadville.co.ke` | ✅ Correct |
| Phone | `+254 722 479985` | `tel:+254722479985` | ✅ Correct |
| Location | Nairobi, Kenya | Static text | ✅ Correct |

**Added:** WhatsApp link in the Contact column, after the phone entry.

```tsx
{waLink && (
  <li className="flex items-start gap-3">
    <svg aria-hidden="true" className="...">...</svg>
    <a href={waLink} target="_blank" rel="noopener noreferrer" className="...">
      WhatsApp
    </a>
  </li>
)}
```

- Uses `buildWaLink` from existing `src/lib/wa-link.ts` — same number, same message as the CTA
- WhatsApp SVG icon (official WhatsApp brand mark) with `aria-hidden="true"`
- Conditionally rendered only if `buildWaLink` returns a valid URL
- Opens in new tab
- Uses the same link styling as other footer contact entries

**Not changed:** No social links added (none verified yet, per instructions).

---

## 5. SEO / Trust Metadata

### Contact page metadata: `src/app/(storefront)/contact/layout.tsx`

Already has correct metadata from a prior slice:

```tsx
export const metadata: Metadata = {
  title: "Contact",
  description: "Open an enquiry with Treadville — ...",
  alternates: {
    canonical: "/contact",
  },
};
```

- ✅ Title present
- ✅ Description present
- ✅ Canonical URL set
- ✅ Follows existing storefront metadata pattern

No changes needed for SEO/trust in this slice.

---

## 6. Verification

### TypeScript

```
$ npx tsc --noEmit
(no output — clean)
```

**Result:** ✅ Zero type errors

### Build

```
$ npm run build
✓ Compiled successfully in 70s
```

**Result:** ✅ Compilation passed. Page generation step requires Supabase connection (expected to hang in local environment without DB).

### Git Diff Summary

```
 src/app/(storefront)/layout.tsx         |  2 +
 src/app/globals.css                     | 69 +++++++++++++++++++++++++++++++++
 src/components/SiteFooter.tsx           | 44 +++++++++++++++++++--
 src/components/SiteHeader.tsx           |  9 ++++-
 4 files changed, 120 insertions(+), 1 deletion(+)
```

(Excluding Slice 21 changes to `contact/layout.tsx` and `sitemap.ts`)

New untracked file: `src/components/WhatsAppCTA.tsx` (+33 lines)

---

## 7. Scope Audit — Protected Files Untouched

| Protected File | Status |
|----------------|--------|
| `src/proxy.ts` | ✅ Untouched |
| `src/lib/supabase.ts` | ✅ Untouched |
| `src/lib/supabase/server.ts` | ✅ Untouched |
| `src/lib/auth.ts` | ✅ Untouched |
| `src/lib/order-actions.ts` | ✅ Untouched |
| `src/lib/enquiry-actions.ts` | ✅ Untouched |
| `src/lib/admin-actions.ts` | ✅ Untouched |
| `src/lib/cms-fields.ts` | ✅ Untouched |
| `src/components/HeroSlideshow.tsx` | ✅ Untouched |

### Out-of-Scope Verification

| Item | Status |
|------|--------|
| Hero system | ✅ Untouched |
| Category system | ✅ Untouched |
| Payment / Stripe / M-Pesa | ✅ Untouched |
| Admin panel | ✅ Untouched |
| Supabase schema / RLS | ✅ Untouched |
| CMS architecture | ✅ Untouched |
| Cookie banner | ✅ Not added |
| Social links | ✅ Not added |
| Slice 23 functionality | ✅ Not implemented |
| Slice 24 functionality | ✅ Not implemented |
| New npm packages | ✅ None added |
| Navigation structure | ✅ Not redesigned |

---

## 8. Component Integration Map

```
src/app/(storefront)/layout.tsx
  ├── SiteHeader (categories)      — modified: +Phone click-to-call
  ├── {children}
  ├── SiteFooter                   — modified: +WhatsApp link
  ├── CartDrawer
  └── WhatsAppCTA                  — NEW: persistent floating CTA
```

The WhatsApp CTA renders on every storefront page via the layout. It does not interfere with the CartDrawer (which uses its own z-index layer) or the mobile nav panel.

---

## 9. Design Rationale

**Why a pill, not a bubble:**
The typical floating action button (FAB) pattern uses a large circular button with an icon only. This reads as "generic SaaS chat widget." A compact pill with icon + label feels more intentional and premium — it communicates "this is a contact method" rather than "this is a chatbot."

**Why green (not brand gold):**
WhatsApp has strong brand recognition via its green color. Using gold would obscure the platform identity and confuse users who expect the WhatsApp green. The gradient uses muted opacity (0.92–0.95) to keep it restrained.

**Why fixed position (not inline):**
A persistent CTA ensures WhatsApp is always one tap away, regardless of scroll position. This is critical for mobile users who may land on any page via search/social and want to immediately enquire. The fixed position also avoids layout shifts when scrolling.

**Why `hidden sm:flex` on header phone:**
On mobile, the WhatsApp CTA already provides a contact channel. Showing a phone icon in the header on small screens would add visual clutter without proportional benefit. The phone icon appears on tablet+ where the header has more space.
