# PHASE 26 — PRODUCTION QA MATRIX

This matrix documents the functional test plan for the Treadville production deployment. Tests marked MANUAL require a browser or HTTP tool. Tests marked CODE indicate verifiable through source code inspection.

---

## VIEWPORT BREAKPOINTS

| Code | Width | Device |
|---|---|---|
| VS320 | 320px | Mobile S (iPhone SE) |
| VS360 | 360px | Mobile (Samsung Galaxy) |
| VS390 | 390px | Mobile (iPhone 14) |
| VS430 | 430px | Large mobile (iPhone Pro Max) |
| VS768 | 768px | Tablet (iPad) |
| VS1024 | 1024px | Laptop |
| VS1440 | 1440px | Desktop |

---

## PAGES

| Route | Page |
|---|---|
| `/` | Homepage |
| `/about` | About |
| `/contact` | Contact / Enquiry |
| `/export` | Export |
| `/origins` | Origins |
| `/quality` | Quality |
| `/shop` | Shop / Category Discovery |
| `/shop/coffee` | Coffee Category |
| `/shop/tea` | Tea Category |
| `/shop/horticulture` | Horticulture Category |
| `/shop/grains` | Grains Category |
| `/product/[slug]` | Product Detail |
| `/journal` | Journal Listing |
| `/journal/[slug]` | Journal Article |
| `/sitemap.xml` | Sitemap |
| `/robots.txt` | Robots |
| `/admin/login` | Admin Login |
| `/admin` | Admin Dashboard |

---

## RESPONSIVE / LAYOUT TESTING

### Homepage (`/`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 | Notes |
|---|---|---|---|---|---|---|---|---|
| No horizontal overflow | | | | | | | | |
| Hero renders | | | | | | | | |
| Hero text readable | | | | | | | | |
| Navigation hamburger < 768px | | | | | | | | |
| Desktop nav visible ≥ 768px | | | | | | | | |
| Category cards visible | | | | | | | | |
| Footer renders | | | | | | | | |
| No clipped typography | | | | | | | | |
| CTAs usable | | | | | | | | |

### Shop (`/shop`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| No horizontal overflow | | | | | | | |
| Category cards grid | | | | | | | |
| Category images render | | | | | | | |
| Text readable | | | | | | | |
| Nav works | | | | | | | |
| Footer renders | | | | | | | |

### Category Page (`/shop/[category]`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| Hero image renders | | | | | | | |
| Hero text readable | | | | | | | |
| Category image hero (if present) | | | | | | | |
| Product grid responsive | | | | | | | |
| Product cards readable | | | | | | | |
| No horizontal overflow | | | | | | | |

### Product Detail (`/product/[slug]`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| Product image renders | | | | | | | |
| Gallery navigation | | | | | | | |
| Metadata readable | | | | | | | |
| Enquire CTA visible | | | | | | | |
| Related products | | | | | | | |
| Breadcrumb renders | | | | | | | |

### Journal (`/journal`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| Article cards grid | | | | | | | |
| Cover images render | | | | | | | |
| Text readable | | | | | | | |
| Empty state (if no articles) | | | | | | | |

### Journal Article (`/journal/[slug]`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| Cover image renders | | | | | | | |
| Article body readable | | | | | | | |
| No horizontal overflow on prose | | | | | | | |
| CTA to contact | | | | | | | |

### Contact (`/contact`)

| Test | VS320 | VS360 | VS390 | VS430 | VS768 | VS1024 | VS1440 |
|---|---|---|---|---|---|---|---|
| Form renders | | | | | | | |
| All 5 fields visible | | | | | | | |
| Form stacks on mobile | | | | | | | |
| Submit button usable | | | | | | | |
| Success state | | | | | | | |
| Error state | | | | | | | |

---

## FUNCTIONAL TESTING

### Navigation
| Test | Status | Manual? |
|---|---|---|
| Desktop nav links work | | ✓ |
| Mobile hamburger opens | | ✓ |
| Mobile nav closes on link click | | ✓ |
| Active nav state correct | | ✓ |
| Logo links to homepage | | ✓ |

### Contact / Enquiry Form

| Test | Path | Manual? | Expected result |
|---|---|---|---|
| Empty submit | `/contact` | ✓ | Validation errors shown |
| Valid submission | `/contact` | ✓ | Success state, DB record created |
| With product context | `/contact?product=coffee-slug` | ✓ | Banner shown, context in message |
| With type pre-select | `/contact?type=sample` | ✓ | Type dropdown pre-selected |
| Combined type + product | `/contact?type=export&product=slug` | ✓ | Both pre-filled |
| Invalid product slug | `/contact?product=nonexistent` | ✓ | No banner, form works |
| Invalid type | `/contact?type=invalid` | ✓ | Falls back to default |
| DB error (simulate) | CODE | — | Error message shown, no crash |
| Email sent (if configured) | `/contact` + check email | ✓ | Notification email received |

### Analytics Events

| Event | Trigger | Verify |
|---|---|---|
| `product_enquiry_started` | Visit `/contact?product=slug` | Vercel Analytics dashboard |
| `product_enquiry_loaded` | Product context fetched | Vercel Analytics dashboard |
| `enquiry_submitted` | Form submitted successfully | Vercel Analytics dashboard |

**Note:** No PII (email, name, message) is sent to analytics. Events contain only: `product_slug`, `type`, `has_product` (all non-identifying).

### Product Enquiry Flow

| Test | Path | Expected |
|---|---|---|
| Product exists + published | `/product/real-published-slug` | Page loads |
| Product not found | `/product/nonexistent` | 404 page |
| Product unpublished (direct URL) | `/product/unpublished-slug` | 404 page |
| Enquire CTA → contact | Product page CTA | `/contact?product=[slug]` |
| Contact pre-fills product name | `/contact?product=real-slug` | Banner shows product name |

### Cart

| Test | Manual? |
|---|---|
| Add product to cart | ✓ |
| Cart drawer opens | ✓ |
| Cart persists across pages | ✓ |
| Remove item | ✓ |
| Checkout navigates | ✓ |

### Admin

| Test | Manual? | Expected |
|---|---|---|
| Unauthenticated → /admin | ✓ | Redirect to /admin/login |
| Login with valid credentials | ✓ | Redirect to /admin dashboard |
| Login with invalid credentials | ✓ | Error shown |
| View products | ✓ | Product list loads |
| Edit product | ✓ | Edit form works |
| View enquiries | ✓ | Enquiry list loads |
| Create/edit article | ✓ | Tiptap editor works |
| Password change | ✓ | Works |
| Logout | ✓ | Session cleared |

### JSON-LD / Structured Data

| Page | Schema | Verify |
|---|---|---|
| All | OrganizationJsonLd | View source, `<script type="application/ld+json">` present |
| All | WebSiteJsonLd | View source |
| Product page | ProductJsonLd | View source, correct product data |
| Journal article | ArticleJsonLd | View source |
| Product/article/category | BreadcrumbList | View source |
| Organization logo | `https://treadville.co.ke/icon.png` | URL resolves to image |

### SEO

| Test | Manual? | Expected |
|---|---|---|
| Sitemap contains all public routes | ✓ | `/sitemap.xml` returns XML |
| Sitemap excludes admin | ✓ | No `/admin/` in sitemap |
| Robots allows public | ✓ | `/robots.txt` allows `/` |
| Robots disallows admin | ✓ | `/robots.txt` disallows `/admin/` |
| Canonical on homepage | ✓ | `<link rel="canonical" href="...">` |
| OG image | ✓ | Social share shows OG image |
| Twitter card | ✓ | Twitter preview works |
| Title template | ✓ | Pages show `Page · Treadville` |

### Error States

| Test | Trigger | Expected |
|---|---|---|
| 404 page | `/nonexistent-route` | Custom 404 renders |
| Product 404 | `/product/nonexistent` | `notFound()` renders |
| Category 404 | `/shop/nonexistent` | `notFound()` renders |
| Article 404 | `/journal/nonexistent` | `notFound()` renders |
| DB error (simulate) | — | Graceful error, no raw trace |

### Image Loading

| Test | Manual? | Expected |
|---|---|---|
| Hero images load | ✓ | No broken image icon |
| Category images load | ✓ | Correct image shown |
| Product images load | ✓ | Product photo shown |
| Article covers load | ✓ | Cover image shown |
| Missing image | ✓ | Graceful placeholder |
| OG image | ✓ | `/og-default.png` renders |

### Performance

| Test | Tool | Expected |
|---|---|---|
| Homepage LCP | Lighthouse / WebPageTest | < 2.5s |
| No layout shift (CLS) | Lighthouse | < 0.1 |
| JS bundle size | Vercel Analytics | Acceptable |
| Font loading | Browser devtools | No FOUT |

---

## BROWSER TESTING

| Browser | Version | Homepage | Shop | Contact | Admin |
|---|---|---|---|---|---|
| Chrome | Latest | | | | |
| Firefox | Latest | | | | |
| Safari | Latest | | | | |
| Edge | Latest | | | | |
| iOS Safari | Latest | | | | |
| Chrome Android | Latest | | | | |

---

## MANUAL TESTING NOTES

- All MANUAL tests require a browser or HTTP tool (Postman, curl)
- Code-verified tests are marked — they can be confirmed by inspecting the source
- After initial deployment, run the full MANUAL test suite
- Re-run after any significant code change

---

## SIGN-OFF

| Check | Who | Date |
|---|---|---|
| Visual QA | | |
| Functional QA | | |
| Security QA | | |
| SEO QA | | |
| Performance QA | | |
