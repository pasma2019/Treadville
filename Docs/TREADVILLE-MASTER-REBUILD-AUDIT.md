# 1. Executive Summary

The Treadville prototype is a functional, data-driven storefront built on Next.js 16.3.3, React 19.2.8, Tailwind CSS v4, and Supabase. Its core architecture (centralized data layer in queries.ts, server-rendered pages, admin that drives the storefront) is sound.

**Current working tree status**: Per Docs/TREADVILLE-CURRENT-STATE-REPORT.md, the baseline passes npx tsc --noEmit, npm run lint, and npm run build with zero errors. The repository is on a clean master branch.

**The single most important finding**: The codebase is architecturally ready but visually and content-wise incomplete for the target premium agricultural brand. The largest gaps are:

1. **Brand identity conflict**: Seed data and product catalogue contain "Maasai Coffee" product names that must be removed and replaced with "Treadville Specialty Coffee" (AGENTS.md section 28, 29, 30).
2. **Public pricing exposure**: Seed data and ProductCard component display KSh {price} publicly. This must be removed -- public experience should be catalogue/enquiry oriented (AGENTS.md section 15, 51; Master Brief section 22).
3. **Visual direction conflict**: Eunice latest explicit direction is "LIGHT PREMIUM" with brighter backgrounds so product images become eye-catching. Current globals.css establishes DARK-dominant system. This is wrong per the Master Brief section 4.
4. **Missing product architecture**: Categories for Tea, Grains, and Horticulture exist as seed rows but have only ONE product each (a duplicate demo placeholder with null price). No data-driven mechanism for category accents to flow into product pages, and no Request quote CTA system.
5. **Missing IA pages**: Required IA (Origins, Services/Export, Private Label, Quality/Expertise, Sustainability, Journal, Contact/enquiry) is almost entirely absent. Only Shop, Product, Cart, Checkout, and Admin exist.
6. **Content model limitations**: site_content is a key-value store with no structure. No articles or journal table. Product metadata for coffee (origin, altitude, processing, SCA score, tasting notes, harvest) is not in the schema.

The system is technically green and strategically red -- the foundation is intact but the direction requires significant content, schema, architecture, and visual changes.
# 2. Existing Website Content Inventory

Based on audit of the existing treadville.co.ke site and seed data:

**Preserved Core Content (Must Keep):**
- Treadville brand identity (name, Kenyan origin)
- Specialty coffee narrative (Kirinyaga terroir, volcanic soils, glacial water)
- 30+ years combined industry expertise
- Specialty coffees scoring 80+ SCA with selected lots higher
- Traceability story from farm to cup
- KEPHIS certification/compliance references
- SGS quality references  
- USDA registered warehousing references
- Coffee export capability
- Local Nairobi delivery / pay-on-delivery offering
- Agricultural value creation and market development mission

**Existing Treadville Content in Seed/Database:**
Categories:
1. Coffee (specialty Arabica from Mt. Kenya volcanic highlands)
2. Tea (demo placeholder)
3. Horticulture (demo placeholder) 
4. Grains (demo placeholder)

Products:
- Coffee: Masai Coffee Moka Espresso, Masai Coffee Supreme, Masai Coffee Kenya AA — Gold Enticing (ALL Maasai Coffee names must change)
- Tea: Black Tea (Demo), Specialty Tea (Demo)
- Horticulture: Fresh Produce (Demo), Export Horticulture (Demo)
- Grains: Maize (Demo), Rice (Demo)

Site Content (basic homepage values):
- hero_headline: Premium African Products. From Coffee to Grain.
- hero_subheadline: Sourced across Kenya''s volcanic highlands and fertile plains
- hero_image: /images/hero-coffee.jpg (missing in public/images/)
- about_blurb: Over 30 years of expertise in Kenyan agriculture...

**Missing Critical IA Content (Not in Repo):**
- Origin/Kirinyaga terroir deep dive
- Processing methods (washed, natural, honey, etc.)
- Export/Bulk coffee workflow
- Private label packaging service
- Quality assessment/Q-grading details
- Sustainability practices
- Farmer relationships/stories
- Company history/timeline
- Mission/Vision/Values statement
- Corporate responsibility initiatives
- Journal/editorial/blog section
- Contact/enquiry forms with multiple purposes
- Buyer/export inquiry workflows
- Certification displays (KEPHIS, SGS, USDA)
- Awards/recognition (if any)

**Content That Must Change:**
- ALL Maasai Coffee product names → Treadville Specialty Coffee
- ALL product descriptions containing Maasai references → neutral/Treadville focus
- Remove price display from public product cards and listings
- Update hero_image and category images to use real supplied imagery vs placeholders
- Replace demo/null prices with null values and enable "Request for quote" CTA
- Replace placeholder demo content in Tea/Horticulture/Grains with real data when supplied
- Update site_content keys to support expanded IA pages

# 3. Current Repository Architecture

## 3.1 Project Structure
```
treadville/
├── src/
│   ├── app/
│   │   ├── layout.tsx              (Root layout with providers)
│   │   ├── page.tsx                (Homepage)
│   │   ├── globals.css             (Global styles + design tokens)
│   │   ├── admin/
│   │   │   ├── layout.tsx          (Admin sidebar layout)
│   │   │   ├── page.tsx            (Admin dashboard)
│   │   │   ├── categories/page.tsx (Category management)
│   │   │   ├── products/page.tsx   (Product management)
│   │   │   └── content/page.tsx    (Content management - stub)
│   │   ├── shop/
│   │   │   ├── page.tsx            (Shop all products)
│   │   │   └── [category]/page.tsx (Category product listing)
│   │   ├── product/
│   │   │   └── [slug]/page.tsx + ProductDetailClient.tsx
│   │   └── checkout/page.tsx       (Checkout concept)
│   ├── components/
│   │   ├── Button.tsx              (3 variants: primary/ghost/light)
│   │   ├── CartContext.tsx         (Cart state management)
│   │   ├── CartDrawer.tsx          (Mobile cart slide-out)
│   │   ├── CategoryDiscovery.tsx   (Homepage category hero tiles)
│   │   ├── CategoryMark.tsx        (Category-specific SVG icons)
│   │   ├── CategoryTabs.tsx        (Tabs navigation)
│   │   ├── GlassPanel.tsx          (Glass masonry component)
│   │   ├── HeroSlideshow.tsx       (Cinematic hero section)
│   │   ├── ProductCard.tsx         (Product listing card)
│   │   ├── ProductImage.tsx        (Image component with fallback)
│   │   ├── Provenance.tsx          (Origin story section)
│   │   ├── Reveal.tsx              (IntersectionObserver reveal)
│   │   ├── SiteFooter.tsx          (Footer component)
│   │   └── SiteHeader.tsx          (Header with nav, cart, mobile menu)
│   └── lib/
│       ├── accents.ts              (Category accent mapping)
│       ├── queries.ts              (Supabase data layer)
│       ├── supabase.ts             (Client initialization)
│       └── types.ts                (TypeScript types)
├── supabase/
│   ├── schema.sql                  (3 tables, public RLS)
│   └── seed.sql                    (Demo data)
├── public/
│   └── design-reference/            (Design reference materials)
└── Docs/
    └── Various phase reports
```

## 3.2 Key Observations

**Strengths Preserved:**
- Clean separation between server components (pages) and client components
- Centralized data layer in `queries.ts` -- all data access goes through here
- Type definitions in `types.ts` are minimal but correct
- Supabase client is properly initialized via env vars
- Admin pages are functional with CRUD operations
- Mobile navigation exists ( hamburger menu with overlay)
- Cart context is well-implemented
- ProductImage has broken image fallback pattern
- Reveal animation is reusable and uses performant transform/opacity

**Technical Debt / Known Issues:**
- `public/images/` directory is empty -- all seed image URLs are 404s
- TypeScript `Button.tsx` has typing issues (per earlier audit)
- Homepage hero has no fallback image handling
- "Single origin" label hardcoded on product pages (inappropriate for Tea/Horticulture/Grains)
- Accent system exists but is only consumed by CategoryTabs, ProductCard uses its own CategoryMark
- No server action for mutations in admin (client-side mutations only)
- Admin content page (/admin/content) is completely unimplemented
- No authentication layer (expected for prototype)

**Architecture Decision Points:**
- Current stack: Next.js 16.3.3 with React 19, Tailwind CSS v4, TypeScript 5, Supabase
- All pages use `revalidate = 0` for fresh data (good for admin)
- Layout.tsx correctly passes categories to SiteHeader (wiring is done)
- No `/app/api/` routes exist -- all mutations go directly to Supabase from client

# 4. Current Route Inventory

## Public Routes
| Route | File | Purpose | Status |
|---|---|---|---|
| / | src/app/page.tsx | Homepage (hero, categories, provenance, featured, story) | Needs redesign for light direction |
| /shop | src/app/shop/page.tsx | Shop all products | Functional but generic layout |
| /shop/[category] | src/app/shop/[category]/page.tsx | Category listing | Functional, generic layout |
| /product/[slug] | src/app/product/[slug]/page.tsx | Product detail | Hardcoded "Single origin" label |
| /checkout | src/app/checkout/page.tsx | Checkout concept | Intentional no-payment state |

## Admin Routes
| Route | File | Purpose | Status |
|---|---|---|---|
| /admin | src/app/admin/page.tsx | Dashboard overview | Functional, sparse |
| /admin/categories | src/app/admin/categories/page.tsx | Category CRUD | Functional |
| /admin/products | src/app/admin/products/page.tsx | Product CRUD | Functional |
| /admin/content | src/app/admin/content/page.tsx | Content editing | NOT IMPLEMENTED |

## Missing Routes (Required IA)
| Route | Purpose | Priority |
|---|---|---|
| /origins | Kirinyaga terroir deep dive | HIGH |
| /quality | Q-grading, KEPHIS, SGS, USDA | HIGH |
| /export | Bulk/export inquiry workflow | HIGH |
| /private-label | Private label packaging | MEDIUM |
| /sustainability | Sustainability content | MEDIUM |
| /journal | Editorial/blog articles | HIGH |
| /contact | Contact/enquiry forms | HIGH |
| /about | Company history, mission, values | MEDIUM |
| /blog | Journal/blog index | MEDIUM |
| /enquiry | General enquiry form | HIGH |

## 5. Current Component Inventory

### Core Shared Components
- **Button.tsx** -- 3 variants (primary/ghost/light). Has TypeScript typing issue with ButtonStyleProps. Needs refactor.
- **CartContext.tsx** -- Provider + hooks. Solid implementation. State-based only (no persistence).
- **CartDrawer.tsx** -- Slide-out panel on right. Functional but needs glass treatment and better UX.
- **SiteHeader.tsx** -- Sticky header with category nav, cart button, mobile hamburger menu. Fully data-driven.
- **SiteFooter.tsx** -- 3-column footer with links and contact info. Hardcoded links for Tea/Horticulture/Grains.
- **Reveal.tsx** -- IntersectionObserver-based reveal animation. Clean and performant.
- **GlassPanel.tsx** -- 3 glass variants (default/light/strong). Under-utilized in real UI.

### Product Components
- **ProductCard.tsx** -- Grid card for products. Shows image or identity placeholder. Has hardcoded accent logic.
- **ProductImage.tsx** -- Next/image-like img with lazy loading and broken image fallback.
- **CategoryMark.tsx** -- SVG marks for each category (coffee/tea/horticulture/grains). Exports accentFor().
- **CategoryImageLayer.tsx** -- Not fully inspected but referenced by CategoryDiscovery.

### Category Components
- **CategoryDiscovery.tsx** -- Homepage category tiles with rich visual treatment. "Luminous editorial world" approach. Coffee lead + companion chapters.
- **CategoryTabs.tsx** -- Tab navigation with active state accent coloring.
- **HeroSlideshow.tsx** -- Cinematic crossfade hero with chapter system.
- **HeroChapters.tsx** -- Chapter data/configuration (referenced but not fully read).
- **Provenance.tsx** -- 3-stage origin story with data visualization.

### Admin Components
- **Admin Dashboard** -- Simple card grid showing counts.
- **Admin Categories** -- Full CRUD with form and table.
- **Admin Products** -- Full CRUD with form and table.
- **Admin Content** -- Stub, needs implementation.

# 6. Current Design System Audit

## 6.1 Typography System (Per AGENTS.md §07)
- **Display**: Cormorant Garamond (--font-display) -- weight 400/500/600/700, normal/italic
- **Body**: DM Sans (--font-body) -- weight 400/500/600
- **Mono**: var(--font-mono) mapped to DM Sans (intentionally, to avoid developer feel)
- H1/H2/H3 use font-display with serif fallback
- .font-mono resolves to DM Sans with letter-spacing
- Font loading: next/font/google with variable fonts

## 6.2 Color System (Per globals.css)
**Dark Surfaces (soils):**
- --soil: #16110d (volcanic soil base dark)
- --soil-raised: #201812 (espresso)
- --soil-muted: #0e0b08 (deepest dark)
- --espresso: #241a12
- --obsidian: #0a0805
- --charcoal: #1a1410
- --graphite: #221a14

**Light Surfaces (bone):**
- --bone: #f4efe4 (primary light surface)
- --ivory: #efe8d8
- --linen: #e6dfcd
- --parchment: #ece3ce (text light-on-dark)
- --cream: #f7f2e6
- --champagne: #d9c39a

**Metallics/Accents:**
- --bronze: #b08d57
- --gold: #c9a24a
- --copper: #a8461f (accent-coffee)
- --amber: #c99a3d
- --jade: #5c7440 (accent-tea)
- --emerald: #2d4a35

**Category Accent Switches:**
- --accent-coffee: #a8461f
- --accent-tea: #5c7440
- --accent-horticulture: #93a13c
- --accent-grains: #c99a3d
- --accent: var(--accent-coffee) (default)

**Lines/Borders:**
- --line: rgba(236, 227, 206, 0.14) (dark hairline)
- --line-light: rgba(22, 17, 13, 0.16) (light hairline)

**Shadows:**
- --shadow-soft, --shadow-lift, --shadow-float, --shadow-cinema

**Glass:**
- --glass-bg, --glass-bg-light, --glass-border, --glass-blur, --glass-blur-strong
- --glass-cinema-bg, --glass-cinema-border, --glass-cinema-blur

**Motion:**
- --dur-fast: 160ms, --dur: 260ms, --dur-slow: 520ms, --dur-slower: 900ms, --dur-cinema: 1400ms
- --ease-out, --ease-inout, --ease-smooth, --ease-cinema

**Content Widths:**
- --content-narrow: 42rem, --content: 64rem, --content-wide: 76rem, --content-cinema: 92rem
- --content-rail: 7rem, --content-rail-sm: 1.5rem

**Display Scales:**
- --display-1, --display-2, --display-3 (fluid clamp() values)

## 6.3 Surface Helpers
- .surface-light (--bone background, --soil text)
- .surface-dark (--soil background, --parchment text)

## 6.4 Glass Material
- .glass, .glass-light, .glass-strong
- .glass-cinema, .glass-light-cinema
- .site-nav (floating nav glass)

## 6.5 Motion Foundation
- [data-reveal] with opacity/transform, IntersectionObserver
- [data-reveal-delay] stagger classes
- prefers-reduced-motion support
- .chapter crossfade primitive for HeroSlideshow

## 6.6 Typography Classes
- .display-1, .display-2, .display-3 (editorial scale)
- .text-accent, .bg-accent, .border-accent (dynamic accent utility)
- .rule-accent (editorial section rule)

## 6.7 Design Token Assessment
The design token system is **well-structured and comprehensive**. However:

1. **The base palette is DARK** (html, body background: var(--soil)). This contradicts Eunice's "lighter backgrounds" direction. The tokens CAN support light mode, but the CSS default and page backgrounds are dark.
2. **No category accent class helpers** -- only inline style / CSS var --accent pattern used.
3. **The design tokens are centralized** which is excellent -- they can be evolved without rewriting the application.
4. **The system supports both light and dark** via --soil/--bone pairing -- but the default application is dark.

## 6.8 What's Missing from Design System
- No class-based color theming utilities for sections (surface-light, surface-dark exist but are sparse)
- No card component primitives (ProductCard is custom-built)
- No standardized section spacing/container pattern across pages
- No standard typography scale beyond display headings
- No form component primitives
- No table component primitives for admin
- No modal/dialog primitive
- No badge/tag component for product status

# 7. Current Supabase/Data Architecture

## 7.1 Schema (supabase/schema.sql)
```sql
-- Three tables only, prototype-level
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2),                  -- NOTE: Price exposed publicly
  image_url text,
  gallery text[] default '{}',
  featured boolean not null default false,
  stock integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  updated_at timestamptz not null default now()
);

-- Prototype-only RLS: public full access (NOT for production)
alter table categories enable row level security;
alter table products enable row level security;
alter table site_content enable row level security;

create policy "public full access" on categories for all using (true) with check (true);
create policy "public full access" on products for all using (true) with check (true);
create policy "public full access" on site_content for all using (true) with check (true);
```

## 7.2 Current Data Model (TypeScript Types from types.ts)
```typescript
export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;                   -- Can be null for quote
  image_url: string | null;
  gallery: string[];
  featured: boolean;
  stock: number;
  status: "draft" | "published";
  created_at: string;
};

export type SiteContent = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
};
```

## 7.3 Seed Data Analysis (supabase/seed.sql)
- **Categories**: Coffee, Tea, Horticulture, Grains with descriptions and image_urls pointing to /images/*.jpg (all missing)
- **Products**:
  - Coffee: 3 real products pulled from treadville.co.ke (but with Maasai Coffee names that must change)
  - Tea: 2 demo products with null prices and placeholder images
  - Horticulture: 2 demo products with null prices
  - Grains: 2 demo products with null prices
  - **CRITICAL**: The 3 coffee products have hardcoded "Maasai Coffee" names that violate AGENTS.md §28-30
- **site_content**: Basic homepage hero/about values only

## 7.4 Data Access Layer (queries.ts)
Strong points:
- Centralized all Supabase queries
- Consistent error handling (throw on error)
- Uses Supabase client from supabase.ts
- getCategories, getCategoryBySlug
- getProducts with filters (categorySlug, publishedOnly)
- getProductBySlug
- getFeaturedProducts
- CRUD operations for admin pages
- getSiteContent / setSiteContent

Missing/Needed:
- No pagination or limit/offset controls in getProducts
- No search/filter capabilities
- No relations loading optimization (current uses implicit joins)
- No transaction support for complex operations
- No real-time subscriptions (not needed for prototype)
- No content model for journal/articles/etc.

## 7.5 Data Flow & Architecture Assessment

**Strengths**:
- Clean separation: components → queries.ts → supabase.ts → Supabase
- No direct database calls in components (good)
- Type safety maintained through the chain
- Admin and storefront share same data model
- Minimal, focused queries layer

**Weaknesses for Target Architecture**:
1. **Price exposure**: products.price is numeric and exposed via getProducts -- must not be shown publicly per AGENTS.md §22
2. **No content hierarchy**: site_content is flat key-value. Cannot support nested IA like /origins/kirinyaga
3. **No rich content model**: No blog/article table with author, date, category, excerpt, body
4. **No enquiry/form storage**: Contact submissions have no destination
5. **No analytics tracking**: No page view or interaction logging
6. **Missing image optimization**: image_url is just a string -- no mention of Supabase Storage or CDN
7. **RSL too permissive**: public full access is prototype-only -- will need proper auth/RLS for production

**Opportunities**:
- The current schema can EXTEND to support new requirements without breaking changes:
  - Add `journal` table with id, title, slug, excerpt, body, author, published_at, featured, image
  - Add `site_sections` or `pages` table for IA hierarchy instead of flat site_content
  - Add `enquiries` table to store contact form submissions
  - Keep products.price but add application-layer logic to hide it in public views
  - Add `product_attributes` table for key-value metadata (origin, altitude, etc.)
  - Add Supabase Storage buckets for organized image management

**Verdict**: The data architecture is **sound and extensible**. The core pattern (components → queries → supabase) is correct. Changes needed are additive (new tables) or behavioral (hide prices in public views), not destructive.

# 8. Admin Dashboard Assessment

## 8.1 Current State
The admin is **functional but minimal**. It demonstrates the core data-driven architecture:

| Page | Functionality | Assessment |
|---|---|---|
| /admin | Dashboard counts (categories, products, published, draft) | Works, basic |
| /admin/categories | Full CRUD (create, read, update active, delete) | Works, immediate storefront sync |
| /admin/products | Full CRUD (create with category select, toggle status, toggle featured, delete) | Works, immediate storefront sync |
| /admin/content | **NOT IMPLEMENTED** | Critical gap |

## 8.2 Architecture Validation
The admin correctly proves the data-driven claim:
- Adding a category in /admin/categories → immediately appears in SiteHeader nav, CategoryTabs, Shop pages
- Adding a product in /admin/products → immediately appears in Shop pages, Product pages
- No code changes required for new categories/products
- This is the **strongest architectural proof point** in the prototype

## 8.3 Gaps vs. Requirements (Master Brief §09)
Required admin areas per Master Brief:
- [ ] Dashboard overview (exists, basic)
- [x] Categories (exists, complete)
- [x] Products (exists, complete)
- [ ] Product imagery (partial - URL input only, no upload/crop)
- [ ] Product descriptions (exists in product form)
- [ ] Product metadata (minimal - only name, slug, category, price, image, description)
- [ ] Featured products (exists via toggle)
- [ ] Site content (NOT IMPLEMENTED)
- [ ] Journal/articles (NOT IMPLEMENTED)
- [ ] Enquiries (NOT IMPLEMENTED)
- [ ] Contact submissions (NOT IMPLEMENTED)
- [ ] Homepage content (NOT IMPLEMENTED)
- [ ] Navigation (NOT IMPLEMENTED)
- [ ] Settings (NOT IMPLEMENTED)

## 8.4 Admin UI/UX Quality
- **Positive**: Clean, responsive tables; keyboard-accessible; consistent styling with public brand
- **Negative**: 
  - No image upload/management (URL input only)
  - No rich text editor for descriptions
  - No drag-drop sort ordering (sort_order field exists but unused)
  - No validation beyond required fields
  - No confirmation modals (uses native confirm())
  - No optimistic UI / loading states during mutations
  - Client-side mutations directly to Supabase (no server actions)
  - No authentication layer (expected for prototype)

## 8.5 Required Admin Improvements (Priority Order)
1. **Implement /admin/content** -- for site_content editing (hero, provenance, featured, story, footer, etc.)
2. **Image upload integration** -- Supabase Storage for product/category images
3. **Rich product metadata fields** -- origin, altitude, processing, SCA score, tasting notes, harvest (coffee)
4. **Journal/articles management** -- new table + admin UI
5. **Enquiry/submission dashboard** -- view contact form submissions
6. **Drag-drop category/product sorting** -- use sort_order field
7. **Rich text editor** for descriptions and content blocks
8. **Preview links** from admin to storefront
9. **Authentication** (production requirement)
10. **Server actions** for mutations (Next.js 15+ pattern)

# 9. Content Preservation Matrix

A. Content that MUST be preserved:
- Treadville brand identity and name
- Specialty coffee narrative (Kirinyaga, Mt. Kenya, volcanic soils, glacial water)
- 30+ years combined expertise
- SCA 80+ specialty score
- Traceability story
- KEPHIS, SGS, USDA references (if referenced in content)
- Coffee export capability
- Local Nairobi delivery / pay-on-delivery
- Agricultural value creation mission
- Provenance/terroir content in /provenance section
- 3 verified coffee products (content only, not names)
- Category architecture (4 categories)

B. Content that MUST be updated:
- "Maasai Coffee" product names → "Treadville Specialty Coffee"
- All product descriptions containing "Maasai" → neutral/Treadville focus
- Public prices → hidden (CTAs only)
- Demo categories → clearly marked as demo
- Hero text → update for expanded product universe
- "Single origin" label on product pages → conditional for coffee only
- Footer hardcoded category links → data-driven from categories

C. Maasai Coffee content that MUST be removed:
- Product name: "Masai Coffee Moka Espresso" → "Treadville Specialty Coffee -- Moka Espresso"
- Product name: "Masai Coffee Supreme" → "Treadville Specialty Coffee Supreme"
- Product name: "Masai Coffee Kenya AA — Gold Enticing" → "Treadville Kenya AA Gold Enticing"
- Description: "Packaging inspired by Maasai heritage" → remove or replace with Treadville branding
- Description referencing "Maasai heritage" → remove
- Any other Maasai references in content
- Seed data must not contain "Maasai" in names or descriptions

D. New Tea content requirements:
- Placeholder content is acceptable for prototype (AGENTS.md §30)
- Must use "Treadville Tea" not "Maasai Tea" or any other brand
- Clearly marked as placeholder/demo
- Architecture must support branded products being introduced later
- Product fields: name, slug, description, image_url, gallery, status, featured
- No price display -- use "Request Sample" CTA
- Metadata for future: origin, harvest season, processing method, tasting notes

E. New Grains requirements:
- Placeholder content acceptable for prototype
- Initial visual examples: beans, green grams, rice, nuts
- No hard-coded architecture around specific examples
- Use "Request Quote" CTAs
- Metadata fields needed for future: origin, variety, grade, harvest

F. New Horticulture requirements:
- Avocado is initial visual/example product
- Architecture must allow additional horticultural products
- "Request Sample" or "Request Quote" CTAs
- Metadata fields: origin, variety, season, growing altitude

G. Content currently missing:
- Origins page (Kirinyaga terroir deep dive)
- Processing methods details
- Export/bulk coffee workflow
- Private label packaging info
- Quality assessment/Q-grading explanation
- Sustainability practices and metrics
- Farmer relationships and stories
- Company history/timeline
- Mission/Vision/Values
- Corporate responsibility
- Journal/editorial section with actual articles
- Contact/enquiry forms (multiple types)
- Buyer/export contact workflows
- Certification displays (KEPHIS, SGS, USDA)
- FAQ section

H. Content currently duplicated:
- ProductCard and ProductIdentity both contain accent/gradient logic
- CategoryDiscovery and CategoryTabs both render category data
- Category tabs rendered in multiple places (footer, admin, shop)
- Category accent definitions duplicated in accents.ts, CategoryMark.tsx, and CategoryDiscovery.tsx

I. Content currently hardcoded but should become admin/CMS editable:
- Homepage hero text (hero_headline, hero_subheadline) -- site_content exists but needs expansion
- Provenance section labels (eyebrow, headline, intro, stages, closing) -- partially via site_content
- Featured section labels -- partially via site_content
- Story section labels -- partially via site_content
- Footer copy (footer heading, explore links, contact info) -- hardcoded in SiteFooter
- Navigation links (/shop, /shop/{slug}) -- data-driven from categories (good)
- Hero chapter meta (verified Treadville metrics) -- partially hardcoded in HeroChapters
- Provenance data points (Highland/Volcanic, 80+/SCA, 30+/yrs, 100%/Arabica) -- hardcoded

# 10. Maasai Coffee Removal Matrix

Based on AGENTS.md §28-30 and Master Brief §2, ALL Maasai Coffee references must be removed and replaced with Treadville Specialty Coffee.

## 10.1 Locations to Audit and Fix

### Seed Data (supabase/seed.sql) -- CRITICAL
| Line | Current | Required Change |
|---|---|---|
| 12 | Masai Coffee Moka Espresso | Treadville Specialty Coffee -- Moka Espresso |
| 13 | Description mentions Maasai heritage | Remove Maasai reference |
| 18 | Masai Coffee Supreme | Treadville Specialty Coffee Supreme |
| 19 | "Packaging inspired by Maasai heritage" | Remove or replace with Treadville branding |
| 24 | Masai Coffee Kenya AA — Gold Enticing | Treadville Kenya AA Gold Enticing |

### Product Detail Page (src/app/product/[slug]/page.tsx)
- Line 32: `font-mono text-xs uppercase tracking-widest text-accent > Single origin`
- This label must be **conditional**: only show for coffee category products

### ProductCard Component (src/components/ProductCard.tsx)
- Lines 47-55: Price display logic (`KSh {price}` vs "Request quote")
- Remove price display entirely per Master Brief §22

### SiteFooter (src/components/SiteFooter.tsx)
- Lines 58-86: Hardcoded category links (Coffee, Tea, Horticulture, Grains)
- Should be data-driven but acceptable for now since categories match

### CategoryDiscovery (src/components/CategoryDiscovery.tsx)
- Atmosphere descriptors reference coffee/tea/horticulture/grains but no Maasai references found
- Lead chapter for coffee uses "Chapter 01 · Lead" -- acceptable

### HeroChapters (referenced in HeroSlideshow)
- Need to audit HeroChapters.tsx for any Maasai references

## 10.2 Replacement Strategy
1. **Seed data**: Update supabase/seed.sql with corrected names
2. **Database**: Run updated seed or use admin to edit existing products
3. **ProductCard**: Remove price display, add "Enquire" / "Request Sample" CTA
4. **ProductDetailClient**: Replace "Add to order" with "Add to Enquiry" or similar
5. **Product page**: Make "Single origin" conditional on coffee category
6. **Admin**: Ensure admin forms don't suggest Maasai naming

## 10.3 Verification Checklist
- [ ] Search entire codebase for "Maasai" or "Masai" (case-insensitive)
- [ ] Search for "Moka Espresso", "Supreme", "Kenya AA" with Maasai prefix
- [ ] Verify no Maasai references in any .tsx, .ts, .sql, .md files
- [ ] Confirm all 3 coffee products renamed in seed and database
- [ ] Confirm "Single origin" only shows for coffee category

# 11. New Product Architecture

## 11.1 Core Data Model Enhancements
The existing schema (3 tables) needs additive fields, not destructive changes:

### Categories Table Additions:
- `sort_order` already exists
- `image_url` already exists
- Consider adding `accent_color` or keeping the current variable approach per slug

### Products Table Additions (for metadata):
- `origin` text (e.g., "Kirinyaga", "Nairobi", "Highland")
- `altitude` text or numeric (e.g., "1,700m")
- `processing_method` text ("washed", "natural", "honey")
- `tasting_notes` text (free-form or structured)
- `sca_score` numeric (80-100 range)
- `harvest_year` integer
- `variety` text ("Arabica", "Robusta", specific varietals)
- `stock_alert` boolean (low stock indicator)
- `min_order_qty` integer (for bulk/export)
- `export_eligible` boolean

### Content/Journal Table (NEW):
- id, title, slug, excerpt, body, author, published_at, featured, image_url, category, tags

### Enquiry Table (NEW - for contact forms):
- id, name, email, phone, company, enquiry_type, message, product_id (optional), status, created_at

## 11.2 Product Architecture Per Categories

### Coffee Products
- Retain existing 3 seed products (rename from Maasai → Treadville)
- Add metadata fields: origin, altitude, processing, SCA score, tasting notes, harvest
- CTAs: "Request Sample", "Request Quote", "Add to order" (for prototype)
- Display optional metadata on product detail page
- Keep `price` in DB but hide from public view (use null/CQTA in UI)

### Tea Products
- Placeholder/demo products with null prices
- CTAs: "Request Sample"
- Add metadata fields for when real data arrives: origin, variety, harvest, processing
- Should NOT have "Single origin" label (different from coffee)

### Grains Products
- Initial examples: beans, green grams, rice, nuts
- Placeholder prices → null, CTA: "Request Quote"
- Add metadata: origin, variety, grade
- No "Single origin" label

### Horticulture Products
- Initial example: avocado
- Placeholder prices → null, CTA: "Request Sample"
- Add metadata: origin, variety, season, growing altitude
- No "Single origin" label

## 11.3 Category-to-Visual Accent Flow
```
Category (slug) → categoryAccent(slug) → CSS var (--accent-coffee/tea/horticulture/grains)
                                   ↓
                                   CategoryTabs styling
                                   ↓
                                   ProductCard gradient/ProductIdentity accent
                                   ↓
                                   Metadata accent text
                                   ↓
                                   CTA button styling
```

## 11.4 Data-Driven vs Hardcoded
- **Currently**: CategoryTabs consumes categoryAccent(), ProductCard has its own CategoryMark logic
- **Needed**: Unified accent system where all category-facing components read from the same source
- **Benefit**: Adding a new category automatically gets colors, icons, hover states without code changes

## 11.5 Image Strategy (Section 12)
See full section below (Section 12).
# 12. Product Image Strategy

## 12.1 Current State
- `public/images/` directory is **empty** 
- Seed SQL references `/images/category-*.jpg` and `/images/product-*.jpg` and `/images/hero-coffee.jpg` -- all 404
- `ProductImage` component has broken image fallback (shows "Image pending" on neutral background)
- `HeroSlideshow` uses `CHAPTERS` data with hardcoded atmosphere/veil/spotlight strings (not image-based)
- `CategoryDiscovery` uses `category.image_url` for atmosphere background (when present)
- `ProductCard` and `Product page` show actual product images when `image_url` exists

## 12.2 Client-Supplied Imagery (Per Master Brief §05)
- Client has supplied product imagery/reference material
- These images are **NOT** assets to drop into generic cards
- Treat them as art-direction inputs requiring:
  - Intelligent cropping
  - Controlled aspect ratios
  - Object positioning
  - Clean backgrounds
  - Bright presentation
  - Consistent visual treatment
  - Premium composition
  - Responsive image behaviour
  - Graceful fallbacks

## 12.3 Implementation Requirements
1. **Image Storage**: 
   - Option A: Continue using Supabase Storage bucket (recommended)
   - Option B: Use `/public/images/` with build-time optimization
   - Must NOT hardcode paths in seed -- use configurable base URL

2. **Image Processing Pipeline**:
   - Upload original → generate multiple sizes (thumbnail, medium, large)
   - Use Next/Image or equivalent for:
     - Automatic format selection (WebP/AVIF)
     - Size optimization based on viewport
     - Lazy loading
     - Priority loading for hero
     - Placeholder blur-up (optional)

3. **Art Direction Controls** (for premium feel):
   - Define aspect ratios per usage:
     - Hero: 16:9 or cinematic 2.39:1
     - Product grid: 4:5 or 3:4 (portrait)
     - Product detail: 1:1 or 4:5
     - Category tiles: aspect-[4/5] or custom
   - Allow focal point positioning (object-position)
   - Support clean background removal/replacement
   - Enable consistent color grading/filters (not CSS filters - use pre-processed images)

4. **Fallback Strategy**:
   - Every important image must have sensible fallback (Master Brief §50)
   - ProductImage component already has broken → "Image pending" fallback
   - Need to extend to:
     - Hero image fallback (solid color + gradient + typography)
     - Category image fallback (solid accent color + mark)
     - Gallery image fallback (same as product)

5. **Performance Requirements**:
   - Never allow broken image to destroy composition (Master Brief §50)
   - Optimized image dimensions (serve correct size)
   - Lazy loading where appropriate
   - Avoid layout shift (reserve dimensions)

## 12.4 Recommended Implementation
1. Create Supabase Storage bucket: `treadville-images`
2. Organize folders: `/products/`, `/categories/`, `/hero/`, `/journal/`
3. Update seed to use Supabase Storage URLs (or relative paths processed by next/image)
4. Enhance `ProductImage` component to:
   - Accept `priority` prop for hero
   - Support `objectFit` and `objectPosition`
   - Generate blur-up placeholder (optional)
   - Maintain broken image fallback
5. Create `next.config.js` image domains if using external storage
6. For MVP: continue using `image_url` string but validate it returns 200
7. Long-term: use Supabase Storage signed URLs or public URLs

## 12.5 Category-Specific Image Treatment
Per Master Brief §10 (Category Experience), each category may have distinct visual accent that influences imagery treatment:

**Coffee**: Warm highlights, deep shadows, roasted tones
**Tea**: Cool highlights, misty effects, leaf textures  
**Horticulture**: Fresh dewy look, earth tones, vibrant greens
**Grains**: Warm golden, sunlight, field textures

This can be achieved via:
- Pre-processed images with consistent grading
- CSS mix-blend-mode or filters (used sparingly)
- Overlay gradients in components
- Not via different image crops alone

# 13. New Light Premium Visual Direction

## 13.1 Eunice Latest Direction Summary (Per Master Brief §04)
- "The backgrounds should be BRIGHTER so product images become eye-catching"
- This is a **critical requirement** -- overrides previous dark-dominant direction
- New visual system should move toward: **LIGHT PREMIUM + EDITORIAL + AGRICULTURAL + BOLD + SOPHISTICATED + HIGH-END**
- Use dark sections **selectively for contrast** rather than making the entire site dark

## 13.2 Current State vs Target Direction

**Current (Dark-Dominant):**
- html, body { background: var(--soil); color: var(--parchment); }
- Section backgrounds heavily use var(--soil), var(--soil-muted)
- Light sections are exceptions (CategoryDiscovery, Featured, Story)
- Most text is light-on-dark

**Target (Light-Dominant with Selective Dark):**
- html, body { background: var(--bone) or var(--cream); color: var(--soil); }
- Default sections on light surfaces
- Dark sections used for **contrast** (e.g., hero, dark product cards, premium moments)
- Most text is dark-on-light
- Product images on bright/clean backgrounds

## 13.3 Revised Visual Vocabulary (Per Master Brief §04)
- warm ivory -- primary background
- bone -- secondary surfaces
- parchment -- card/section backgrounds
- warm white -- content areas
- restrained botanical greens -- tea/horticulture accents
- muted agricultural tones -- grain/warm tones
- deep coffee brown -- coffee accent
- charcoal -- typography/headers on light
- natural earth tones -- borders, metadata

## 13.4 Design Token Changes Required

### Surface Priority Shift
```
PRIMARY (was darkest): --bone / --ivory / --cream / --warm-white
SECONDARY (was dark): --soil (now used for headers, dark sections only)
TEXT (flip): --soil on light surfaces, --parchment on dark surfaces
```

### Section Background Strategy
```css
/* Default page: light */
body { background: var(--bone); color: var(--soil); }

/* Premium dark moments: selective */
.hero { background: var(--obsidian) or gradient; }
.featured { background: var(--soil) or --espresso; }
.story { background: var(--bone) or --ivory; }
.provenance { background: var(--soil-muted) or --charcoal; }
.product-grid { background: var(--bone); }
.shop { background: var(--bone); }
```

### Typography Readability on Light
- Current: --parchment on --soil (light text on dark) 
- New default: --soil on --bone (dark text on light)
- Keep --parchment for dark sections only
- Ensure contrast ratios meet WCAG AA (4.5:1 minimum)

### Component Adjustments
- Cards: background var(--bone) or var(--cream) with subtle shadow
- Borders: use --line-light instead of --line for light sections
- Hover states: subtle elevation change on light backgrounds
- Glass: use lighter glass variants (--glass-bg-light with light backgrounds)
- Buttons: primary uses category accent, but consider light variants on light backgrounds

## 13.5 Category Accent System on Light Background
- Accents become MORE visible on light backgrounds
- Coffee: --accent-coffee (#a8461f) -- warm copper, visible on ivory
- Tea: --accent-tea (#5c7440) -- botanical green, visible on cream
- Horticulture: --accent-horticulture (#93a13c) -- fresh green, visible on bone
- Grains: --accent-grains (#c99a3d) -- warm gold, visible on parchment
- These accents work beautifully on light backgrounds (the bright direction makes them POP)

## 13.6 Glassmorphism on Light Backgrounds
- Current glass: --glass-bg (dark, rgba(20, 15, 11, 0.55))
- Need light glass: rgba(244, 239, 228, 0.7) with backdrop-blur
- Glass should feel translucent, expensive, subtle on light backgrounds
- Use glass for: floating nav, cart drawer, filter panels, product metadata overlays
- Rule from AGENTS.md §06 still applies: glass is a material, not a design system

## 13.7 Shadow System on Light Backgrounds
- Current shadows are designed for dark backgrounds (white-tinted shadows)
- Need to create or adjust shadow system for light backgrounds:
  - Subtle shadow-soft for cards (dark shadow on light bg)
  - shadow-lift for hover elevation
  - shadow-float for floating elements
  - Reduce shadow opacity since dark shadows show more on light backgrounds

## 13.8 Typography on Light Backgrounds
- Headers: charcoal (not parchment) -- keep var(--soil) for headings
- Body: --soil on --bone
- Links: category accent colors remain strong on light backgrounds
- Metadata text: slightly more muted but still readable
- Display fonts: same Cormorant Garamond/DM Sans hierarchy

## 13.9 Image Presentation on Light Backgrounds
- Product images on clean, bright backgrounds (bone/cream/white)
- Category images with bright atmospheres
- Hero images that read as brand-film frames
- No dark scrims over product photography (except hero/editorial moments)
- Product images are the STAR (per Eunice direction)

## 13.10 Implementation Approach
1. **Phase 1**: Add light surface tokens to globals.css (keep existing dark tokens)
2. **Phase 2**: Add surface toggle classes (.surface-light, .surface-dark)
3. **Phase 3**: Update layout.tsx to set default light surface
4. **Phase 4**: Move light pages to use bone/cream by default
5. **Phase 5**: Convert dark sections to use soil selectively (hero, featured, provenance)
6. **Phase 6**: Update component styling to work on both light and dark
7. **Phase 7**: Test contrast ratios on all surfaces

## 13.11 Risk Assessment
- Risk: Existing components coded for dark backgrounds need systematic review
- Risk: Text color assumptions in components may need to flip
- Risk: Shadow colors need adjustment for light backgrounds
- Risk: Glass variants need light versions
- Mitigation: Create dual-surface tokens and explicit light/dark classes
- Benefit: Bright product photography will be dramatically more eye-catching

# 14. Homepage Architecture

## 14.1 Current State
The homepage (src/app/page.tsx) has a strong composition:
1. **HeroSlideshow** -- cinematic crossfade with chapter system, brand narrative
2. **CategoryDiscovery** -- "luminous editorial world" with lead + companion chapters
3. **Provenance** -- 3-stage origin story (Origin, Craft, Experience) + data points
4. **Featured Products** -- editorial grid with lead + supporting cards on dark background
5. **Story Section** -- editorial stats (30+ years, 04 categories, 80+ SCA) on light background

## 14.2 Visual Assessment vs Premium Direction
**What works (PRESERVE):**
- HeroSlideshow cinematic chapter system -- excellent brand film approach
- CategoryDiscovery atmospheric category tiles -- strong editorial feel
- Provenance 3-stage origin story -- communicates Kenyan terroir well
- Story section editorial stats -- confident, verified data
- Motion system (Reveal animations) -- sophisticated and performant

**What needs redesign (CHANGE):**
- Background palette: currently dark-dominant; needs light-dominant per §13
- CategoryDiscovery section: works but could be more editorial
- Featured section: dark background; should be light to make products pop
- Typography scale: could be more editorial and bold
- Whitespace: generous but could be more intentional

## 14.3 Recommended Homepage Architecture (Light Premium)

### Structure:
```
[HEADER - floating glass on light, not over every section]
    ↓
[HERO - cinematic full-bleed, dark or gradient, brand film feel]
    ↓
[CATEGORY WORLD - light editorial band, category tiles with bright imagery]
    ↓
[FEATURED PRODUCTS - light surface, products on bright backgrounds, products pop]
    ↓
[ORIGIN STORY - dark section for contrast, Provenance narrative]
    ↓
[PRODUCT SHOWCASE - light, editorial product grid]
    ↓
[EDITORIAL CONTENT - Journal preview or sustainability moment]
    ↓
[CONTACT CTA - light or dark accent section]
    ↓
[FOOTER - editorial, anchored, data-driven category links]
```

### Section-by-Section Direction:

**1. Hero (Dark/Cinematic)**
- Keep HeroSlideshow crossfade chapter system
- Dark backgrounds work here (brand film feel)
- Gold/copper accents on dark
- Category chapter navigation
- Strong typography hierarchy

**2. Category World (Light)**
- Light background (bone/cream)
- Category tiles with bright, clean product photography
- Each category gets its visual accent (copper/green/gold)
- Products look premium and appetizing on light

**3. Featured Products (Light)**
- Products on bright backgrounds
- Product cards with premium hover states
- Category accent coloring
- No dark scrims over product photos

**4. Origin Story (Dark for Contrast)**
- Provenance section on dark background
- Creates visual rhythm: light → dark → light → dark
- Communicates Kenyan terroir and quality

**5. Story/Stats (Light)**
- Editorial stats on light background
- 30+ years, 04 categories, 80+ SCA
- Bold typography, confident messaging

**6. Contact CTA (Light or Accent)**
- "Discuss Your Requirements" messaging
- Clear next steps for buyers

## 14.4 Homepage Content Flow
```
What is Treadville? (Hero narrative)
    ↓
What do we produce? (Category tiles)
    ↓
What are our best products? (Featured)
    ↓
Where do products come from? (Origin/Provenance)
    ↓
Why trust us? (Stats, certifications)
    ↓
What else can we offer? (Other categories teaser)
    ↓
How to engage? (Contact CTA)
```

## 14.5 Homepage CTAs
Per Master Brief §22:
- Do NOT use "Buy Now", "Add to Cart" as primary CTAs on homepage
- Use: "Explore Product", "Request Sample", "Enquire", "Request a Quote", "Discuss Your Requirements"
- Keep "Add to Order" in cart context only
- Coffee-focused but not exclusively -- teas, grains, horticulture should have equal CTA presence

## 14.6 Mobile Considerations
- Hero: full-bleed on mobile, stacked typography
- Category tiles: single column, full-width on mobile
- Featured products: 2-column grid on mobile
- Stats: 2-column on mobile, 3-column on desktop
- Contact CTA: full-width on mobile

# 15. Final Information Architecture

## 15.1 Current IA (Limited)
- / (Homepage)
- /shop (Shop all)
- /shop/[category] (Category listing)
- /product/[slug] (Product detail)
- /checkout (Checkout concept)
- /admin (Admin dashboard)
- /admin/categories (Category management)
- /admin/products (Product management)
- /admin/content (Stub, not implemented)

## 15.2 Target IA (Per Master Brief §07)

### Public Website IA:

```
HOME
  ↓
SHOP
  ├── Shop All (/shop)
  ├── Coffee (/shop/coffee)
  ├── Tea (/shop/tea)
  ├── Grains (/shop/grains)
  ├── Horticulture (/shop/horticulture)
  └── Product Detail (/product/[slug])
        ↓
        REQUEST QUOTE / SAMPLE
        ↓
        CART (/cart)
        ↓
        CHECKOUT/ENQUIRY (/checkout)
        ↓
        CONFIRMATION (/confirmation)
        ↓
ORIGINS
  ├── Kirinyaga Terroir (/origins/kirinyaga)
  ├── Mt. Kenya Highlands (/origins/mt-kenya)
  └── Volcanic Soils (/origins/volcanic-soils)
        ↓
SPECIALTY COFFEE
  ├── Coffee Processing (/coffee/processing)
  ├── Coffee Grades (/coffee/grades)
  ├── Q-Grading (/coffee/q-grading)
  └── Private Label (/coffee/private-label)
        ↓
SERVICES / EXPORT
  ├── Bulk Coffee Export (/export/bulk)
  ├── Wholesale (/export/wholesale)
  ├── Distribution (/export/distribution)
  └── Logistics (/export/logistics)
        ↓
PRIVATE LABEL
  ├── Packaging (/private-label/packaging)
  ├── Branding (/private-label/branding)
  └── Lead Time (/private-label/lead-time)
        ↓
QUALITY / EXPERTISE
  ├── Quality Assessment (/quality/assessment)
  ├── Certifications (/quality/certifications)
  ├── KEPHIS (/quality/kephis)
  ├── SGS (/quality/sgs)
  ├── USDA (/quality/usda)
  └── Lab Testing (/quality/lab)
        ↓
ABOUT
  ├── Company History (/about/history)
  ├── Mission/Vision/Values (/about/mission)
  ├── Leadership (/about/leadership)
  └── Team (/about/team)
        ↓
SUSTAINABILITY
  ├── Practices (/sustainability/practices)
  ├── Farmer Relationships (/sustainability/farmers)
  ├── Environmental Impact (/sustainability/environment)
  └── Community (/sustainability/community)
        ↓
JOURNAL / INSIGHTS
  ├── All Articles (/journal)
  ├── Categories (e.g., Coffee, Sustainability, Recipes)
  └── Article Detail (/journal/[slug])
        ↓
CONTACT / ENQUIRY
  ├── General Contact (/contact)
  ├── Product Enquiry (/contact/enquire)
  ├── Export Enquiry (/contact/export)
  ├── Sample Request (/contact/sample)
  ├── Visit Us (/contact/visit)
  └── Support (/contact/support)
```

## 15.3 Admin IA (Master Brief §09)
```
ADMIN DASHBOARD (/admin)
  ├── Overview (/admin)
  ├── Categories (/admin/categories)
  ├── Products (/admin/products)
  ├── Product Images (/admin/products/images)
  ├── Site Content (/admin/content)
  │   ├── Hero (/admin/content/hero)
  │   ├── Homepage Sections (/admin/content/homepage)
  │   ├── Footer (/admin/content/footer)
  │   └── Navigation (/admin/content/navigation)
  ├── Journal/Articles (/admin/journal)
  ├── Enquiries (/admin/enquiries)
  │   ├── Contact Form Submissions
  │   ├── Export Enquiries
  │   └── Sample Requests
  ├── Homepage Content (/admin/homepage)
  ├── Navigation (/admin/navigation)
  └── Settings (/admin/settings)
```

## 15.4 Navigation Structure

### Public Header Nav
- Shop (dropdown: All, Coffee, Tea, Grains, Horticulture)
- Origins
- Quality
- Sustainability
- Journal
- About
- Contact (CTA button)

### Public Footer
- Shop categories
- Company
- Resources
- Contact
- Newsletter signup

### Mobile Menu
- All categories
- All major pages
- Contact CTA

## 15.5 URL Strategy
- Clean slugs: /origins, /quality, /export, /sustainability, /journal, /about, /contact
- Nested pages: /coffee/processing, /journal/[slug]
- Avoid query params where possible
- Use trailing slash consistently (Next.js default)

# 16. Public Website Architecture

## 16.1 Page Structure Overview

### Homepage (/)
- HeroSlideshow (cinematic, dark)
- CategoryDiscovery (light)
- Provenance (dark)
- Featured Products (light)
- Story/Stats (light)
- Contact CTA (light/accent)
- Footer

### Shop (/shop, /shop/[category])
- Category header with description
- CategoryTabs for navigation
- Product grid
- Filters (future)
- Sort options (future)
- Pagination (future)

### Product Detail (/product/[slug])
- Product gallery (main image + gallery)
- Product info (name, description)
- Product metadata (origin, altitude, processing, SCA score, etc.)
- Enquiry/Add to cart CTA
- Related products
- Category navigation

### Checkout (/checkout)
- Cart summary
- Customer details form
- Delivery details
- Payment options (M-Pesa, card, cash on delivery for prototype)
- Order confirmation

### Origin Pages (/origins/*)
- Editorial hero with landscape imagery
- Prose content (CMS-editable)
- Data points and stats
- Related products
- Navigation to other origin pages

### Quality Pages (/quality/*)
- Certification displays (KEPHIS, SGS, USDA)
- Process explanation
- Lab testing details
- Quality metrics
- Trust signals

### Sustainability (/sustainability/*)
- Sustainability practices
- Farmer relationships
- Environmental impact
- Community initiatives
- Progress metrics

### Journal (/journal, /journal/[slug])
- Article listing with featured articles
- Category filters
- Article detail with rich content
- Related articles
- Newsletter CTA

### Contact (/contact/*)
- General contact form
- Product enquiry form
- Export enquiry form
- Sample request form
- Map/location
- Contact details

## 16.2 Global Elements

### SiteHeader
- Floating glass on light backgrounds
- Logo + brand name
- Navigation with dropdowns
- Search (future)
- Cart button with count
- Mobile hamburger menu

### SiteFooter
- Editorial presence (not just links)
- Category links (data-driven)
- Company links
- Contact information
- Newsletter signup
- Copyright

### CartDrawer
- Slide-out panel on right
- Product lines with quantity
- Subtotal
- Proceed to checkout CTA
- Empty state messaging

## 16.3 Commerce Flow
```
Browse Products
  → Category Page (/shop/[category])
  → Product Detail (/product/[slug])
  → Add to Cart
  → Cart Drawer
  → Checkout (/checkout)
  → Enquiry/Order Confirmation
```

## 16.4 Enquiry Flow (Export/Bulk)
```
Export Enquiry Form (/contact/export)
  → Company details
  → Product interests
  → Volume/requirements
  → Timeline
  → Submission
  → Admin notification
  → Enquiry management in admin
```

## 16.5 Component Architecture

### Shared Components
- SiteHeader, SiteFooter, CartDrawer, Button, Reveal, GlassPanel
- ProductCard, ProductImage, CategoryMark, CategoryTabs
- SectionHeading, SectionWrapper
- FormInput, FormSelect, FormTextarea

### Page-Specific Components
- HeroSlideshow, HeroChapters (homepage)
- CategoryDiscovery (homepage)
- Provenance (homepage)
- ProductGallery (product page)
- ProductMetadata (product page)
- ArticleCard (journal)
- EnquiryForm (contact)

## 16.6 Layout Patterns

### Editorial Layout
- Large hero imagery
- Asymmetric content grids
- Generous whitespace
- Bold typography moments
- Full-bleed sections

### Commerce Layout
- Product grid (2-4 columns responsive)
- Product detail (2-column desktop)
- Cart sidebar (drawer)
- Checkout form (centered, narrow)

### Documentation Layout
- Long-form prose
- Sidebar navigation
- Data tables
- Callout boxes

## 16.7 SEO Architecture

### Metadata Structure
- Title: {Page Name} | Treadville Kenya
- Description: Unique per page, 155 chars max
- Open Graph: Image, title, description, type
- Canonical: Self-referencing URL

### Structured Data
- Organization (homepage)
- Product (product pages)
- BreadcrumbList (all pages)
- FAQPage (FAQ section)
- Article (journal posts)

### Technical SEO
- sitemap.xml (dynamic generation)
- robots.txt
- Next.js metadata API
- Image alt text (required)
- Heading hierarchy (single H1 per page)

## 17. Admin Dashboard Architecture

## 17.1 Current vs Required

**Currently Implemented:**
- Dashboard (basic counts)
- Categories (full CRUD)
- Products (full CRUD)
- Content (NOT IMPLEMENTED)

**Required for Production:**
- Dashboard (enhanced with charts/insights)
- Categories (full CRUD + image upload + sort order)
- Products (full CRUD + rich metadata + image gallery + upload)
- Content (CMS for all site content)
- Journal (article management)
- Enquiries (form submissions management)
- Navigation (menu management)
- Settings (site-wide settings)
- Users (authentication + roles)

## 17.2 Recommended Admin Structure

### Dashboard
- Overview cards (categories, products, published, draft)
- Recent enquiries
- Quick actions
- Site health indicators

### Categories Admin
- List with drag-drop sort
- Add/edit form:
  - Name
  - Slug (auto-generate, editable)
  - Description (rich text)
  - Image upload + crop
  - Accent color (auto or manual)
  - Sort order
  - Active/inactive toggle
- Delete with confirmation

### Products Admin
- List with filters (category, status, featured)
- Add/edit form:
  - Name, slug
  - Category selection
  - Description (rich text)
  - Price (optional, hidden from public)
  - Images (multi-upload with crop)
  - Gallery (multi-upload)
  - Metadata fields:
    - Origin
    - Altitude
    - Processing method
    - SCA score
    - Tasting notes
    - Harvest
    - Variety
    - Stock quantity
    - Min order qty
    - Export eligible
  - Featured toggle
  - Status (draft/published)
- Delete with confirmation

### Content Admin
- Site content management
- Homepage sections:
  - Hero content
  - Provenance content
  - Featured section
  - Story section
  - Footer content
- Page-specific content blocks
- SEO metadata per page

### Journal Admin
- Article list
- Add/edit article:
  - Title, slug
  - Excerpt
  - Body (rich text / MDX)
  - Author
  - Category
  - Tags
  - Featured image
  - Published date
  - Status

### Enquiries Admin
- Enquiry list with filters
- Enquiry types: general, export, sample, wholesale
- View enquiry details
- Mark as read/responded/archived
- Export to CSV

### Navigation Admin
- Header navigation items
- Footer navigation items
- Dropdown management
- Link ordering

## 17.3 Admin UI Requirements
- Responsive design (work on tablet/desktop)
- Dark theme matching public brand
- Data tables with sort/filter
- Form validation
- Image upload with preview
- Rich text editor (Tiptap or similar)
- Optimistic UI updates
- Loading states
- Error handling with recovery
- Confirmation dialogs for destructive actions

## 17.4 Security Requirements (Production)
- Authentication (email/password, magic link)
- Role-based access (admin, editor, viewer)
- Rate limiting on forms
- Input sanitization
- Audit logging
- Session management
- Secure password hashing

# 18. Data Model Recommendations

## 18.1 Recommended Schema Changes

### ADD: product_attributes Table
```sql
CREATE TABLE product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Index for fast lookups
CREATE INDEX idx_product_attributes_product_id ON product_attributes(product_id);
CREATE INDEX idx_product_attributes_key ON product_attributes(key);
```

### ADD: articles Table (for Journal)
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT,
  author TEXT,
  image_url TEXT,
  category TEXT,
  tags TEXT[],
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### ADD: enquiries Table
```sql
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  enquiry_type TEXT NOT NULL, -- general, export, sample, wholesale
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id),
  status TEXT NOT NULL DEFAULT pending CHECK (status IN (pending, reviewed, responded, archived)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### ADD: site_navigation Table
```sql
CREATE TABLE site_navigation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN (header, footer_primary, footer_secondary)),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES site_navigation(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### MODIFY: products Table
Add columns (non-breaking, optional):
```sql
ALTER TABLE products ADD COLUMN IF NOT EXISTS origin TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS altitude TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS processing_method TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sca_score NUMERIC(5,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS tasting_notes TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS harvest_year INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variety TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty INTEGER DEFAULT 1;
ALTER TABLE products ADD COLUMN IF NOT EXISTS export_eligible BOOLEAN DEFAULT false;
```

### MODIFY: categories Table
```sql
ALTER TABLE categories ADD COLUMN IF NOT EXISTS accent_color TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
```

## 18.2 TypeScript Types Additions
```typescript
// Product attributes
export type ProductAttribute = {
  id: string;
  product_id: string;
  key: string;
  value: string | null;
  created_at: string;
};

// Articles
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  author: string | null;
  image_url: string | null;
  category: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
};

// Enquiries
export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  enquiry_type: EnquiryType;
  message: string;
  product_id: string | null;
  status: EnquiryStatus;
  created_at: string;
};
export type EnquiryType = general | export | sample | wholesale;
export type EnquiryStatus = pending | reviewed | responded | archived;

// Navigation
export type NavigationItem = {
  id: string;
  location: header | footer_primary | footer_secondary;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
};
```

## 18.3 Query Layer Additions
```typescript
// Articles
export async function getArticles(opts?: { publishedOnly?: boolean; limit?: number })
export async function getArticleBySlug(slug: string)
export async function createArticle(input: Partial<Article>)
export async function updateArticle(id: string, input: Partial<Article>)
export async function deleteArticle(id: string)

// Enquiries
export async function getEnquiries(opts?: { type?: EnquiryType; status?: EnquiryStatus })
export async function createEnquiry(input: Omit<Enquiry, id | created_at>)
export async function updateEnquiryStatus(id: string, status: EnquiryStatus)

// Navigation
export async function getNavigation(location: NavigationLocation)
export async function updateNavigation(id: string, input: Partial<NavigationItem>)

// Product attributes
export async function getProductAttributes(productId: string)
export async function upsertProductAttribute(productId: string, key: string, value: string)
```

## 18.4 Price Visibility Strategy
Products table has `price` field. Public views should:
1. Never display `price` on product cards or listings
2. Never display `price` on product detail pages
3. Use CTAs: "Request Sample", "Request Quote", "Enquire"
4. Price only visible in:
   - Cart (prototype context)
   - Admin (authorized users)
   - Future wholesale tier (after auth implementation)

Implementation:
```typescript
// In ProductCard, ProductPage:
// Never render: product.price

// In CartDrawer:
// Only render in cart context, clearly labeled as prototype
// Or remove entirely and use "Enquiry cart" pattern
```

## 18.5 Image/Storage Strategy
- Create Supabase Storage bucket: `treadville-assets`
- Folders: `/products/`, `/categories/`, `/hero/`, `/journal/`, `/general/`
- Use public URLs stored in `image_url` fields
- Add `alt` text field to articles table
- Use Next/Image with loader for optimized delivery

# 19. SEO Plan

## 19.1 Current State
- Basic metadata in layout.tsx: title, description
- No dynamic metadata per page
- No Open Graph tags
- No sitemap.xml
- No robots.txt
- No structured data
- No canonical URLs

## 19.2 Required SEO Implementation

### Metadata API (Next.js)
```typescript
// Each page exports metadata:
export const metadata: Metadata = {
  title: { page name } | Treadville Kenya,
  description: unique page description,
  openGraph: {
    title: page name,
    description: page description,
    images: [{ url: og-image, width: 1200, height: 630 }],
    type: website | product | article,
  },
  alternates: {
    canonical: https://treadville.co.ke/current-page,
  },
};
```

### Page-Specific Metadata

**Homepage:**
- Title: Treadville Kenya | Specialty Coffee, Tea, Grains & Horticulture
- Description: Premium Kenyan agricultural products sourced from volcanic highlands and fertile plains. Specialty coffee, tea, horticulture, and grains with full traceability.

**Category Pages (/shop/[category]):**
- Title: {Category Name} | Treadville Kenya
- Description: {Category description} from Kenya. [Category-specific value prop]

**Product Pages (/product/[slug]):**
- Title: {Product Name} | Treadville Kenya
- Description: {Product description}
- Type: product
- Structured data: Product schema with name, description, image, brand

**Journal Articles:**
- Title: {Article Title} | Treadville Journal
- Type: article
- Structured data: Article schema with headline, datePublished, author, image

**Contact/About:**
- Title: {Page Name} | Treadville Kenya
- Type: website (secondary pages)

### Structured Data

**Organization (homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Treadville Company Limited",
  "url": "https://treadville.co.ke",
  "logo": "https://treadville.co.ke/logo.png",
  "description": "Premium Kenyan agricultural products...",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nairobi",
    "addressCountry": "KE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+254-722-479985",
    "contactType": "customer service"
  }
}
```

**Product:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "brand": { "@type": "Brand", "name": "Treadville" },
  "image": "image-url",
  "url": "product-url"
}
```

**BreadcrumbList (all inner pages):**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://treadville.co.ke" },
    { "@type": "ListItem", "position": 2, "name": "Category", "item": "..." },
    { "@type": "ListItem", "position": 3, "name": "Product" }
  ]
}
```

### Technical SEO

**sitemap.xml:**
- Generate dynamically using Next.js sitemap.ts
- Include all public pages: /, /shop, /shop/*, /product/*, /origins, /quality, /sustainability, /journal, /journal/*, /about, /contact
- Update frequency: daily (with ISR)
- Priority: homepage 1.0, category 0.8, products 0.7, articles 0.6

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /checkout
Sitemap: https://treadville.co.ke/sitemap.xml
```

**URL Strategy:**
- Use kebab-case slugs: /origins/kirinyaga-terroir
- Avoid special characters
- Use canonical URLs consistently
- Redirect old URLs if any

**Image SEO:**
- Alt text required on all images
- Use descriptive filenames: kenya-coffee-beans.jpg vs img_001.jpg
- Lazy load below-fold images
- Priority load hero images

**Performance + SEO:**
- Core Web Vitals affect ranking
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Mobile-first indexing
- HTTPS (required)

# 20. Accessibility Plan

## 20.1 Current State
- Basic semantic HTML structure
- Cart context properly labeled
- Image alt text in ProductImage component
- Keyboard navigation for cart drawer and mobile menu
- Escape key handling
- Focus management

## 20.2 Accessibility Issues to Fix

### Critical (WCAG AA Violations)
1. **Color contrast**: Dark text on dark backgrounds may not meet 4.5:1 ratio
2. **Focus indicators**: Some interactive elements lack visible focus states
3. **Image alt text**: All product images must have descriptive alt text
4. **Form labels**: Checkout form inputs lack visible labels

### Important (WCAG AA Best Practice)
1. **ARIA landmarks**: Ensure proper role=main, role=navigation, role=contentinfo
2. **Skip links**: Add skip-to-content link
3. **Heading hierarchy**: Ensure single H1 per page, logical H2-H6 nesting
4. **Keyboard traps**: Ensure no keyboard traps in modal/drawer interactions
5. **Screen reader announcements**: Cart actions announced

### Enhancement (Premium Experience)
1. **Reduced motion**: prefers-reduced-motion already partially supported
2. **High contrast mode**: Support Windows high contrast
3. **Focus visible**: Ensure focus is always visible, not just outline:none
4. **Touch targets**: Minimum 44x44px for mobile
5. **Error identification**: Form errors clearly identified and associated with fields

## 20.3 Accessibility Implementation

### Keyboard Navigation
```tsx
// CartDrawer: Already has escape key, focus management
// Mobile menu: Already has escape key, focus on open, return on close
// Need to add: skip-to-content link at top of page
```

### Focus Management
```tsx
// When drawer opens: trap focus inside drawer
// When drawer closes: return focus to trigger
// When modal opens: trap focus, restore on close
```

### Form Accessibility
```tsx
// All inputs need:
<label htmlFor={id}>Label text</label>
<input id={id} aria-describedby={errorId} />
{error && <span id={errorId} role=alert>{error}</span>}

// Error state:
<input aria-invalid=true aria-describedby=error-msg />
```

### Color Contrast
- Test all text/background combinations
- Minimum ratio 4.5:1 for normal text
- Minimum ratio 3:1 for large text (18pt+ or 14pt bold+)
- Maintain both on light and dark surfaces

### Screen Reader Testing
- Test with NVDA (Windows), VoiceOver (Mac), TalkBack (Android)
- Verify all interactive elements are announced
- Verify dynamic content changes are announced
- Verify form errors are announced

# 21. Performance Plan

## 21.1 Current Performance State
- Uses Next/Image for optimization (good)
- ProductImage uses regular img with lazy loading
- No image optimization pipeline
- No font subsetting issues
- Minimal JavaScript (mostly server components)
- Design tokens in CSS (no JS)

## 21.2 Performance Targets
- Lighthouse Performance: 90+
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- TTFB (Time to First Byte): < 200ms
- INP (Interaction to Next Paint): < 200ms

## 21.3 Performance Strategies

### Images
1. Use Next/Image instead of regular img
2. Define explicit width/height to prevent CLS
3. Use priority=true for hero/above-fold images
4. Use WebP/AVIF formats (automatic with Next/Image)
5. Implement blur-up placeholders (optional)
6. Lazy load below-fold images
7. Use srcset for responsive images

### Fonts
1. Use next/font for automatic optimization
2. Subset fonts (Latin only for DM Sans, Cormorant Garamond)
3. Use font-display: swap
4. Preload critical fonts

### JavaScript
1. Minimize client components
2. Use server components by default
3. Dynamic import for heavy components (if needed)
4. Code splitting per route (automatic with Next.js)

### CSS
1. Design tokens in CSS variables (already done)
2. Minimize runtime CSS
3. Use Tailwind purge (already configured)

### Data Fetching
1. Use ISR for product/category pages (revalidate: 60)
2. Prefetch linked pages
3. Cache Supabase responses where appropriate

### Network
1. CDN for static assets
2. Compression (gzip/brotli)
3. HTTP/2 or HTTP/3
4. Preconnect to Supabase, Google Fonts

## 21.4 Performance Monitoring
- Lighthouse CI in build pipeline
- Core Web Vitals in production
- Real user monitoring (RUM) for production
- Supabase query performance monitoring

# 22. Responsive Strategy

## 22.1 Breakpoints (Per AGENTS.md §23)

### Primary Breakpoints (Tailwind)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Target Viewports
| Viewport | Width | Priority |
|---|---|---|
| Mobile Small | 320px | HIGH |
| Mobile Standard | 375px | HIGH |
| Mobile Large | 390px | HIGH |
| Mobile Extra Large | 430px | HIGH |
| Tablet Portrait | 768px | HIGH |
| Tablet Landscape | 1024px | MEDIUM |
| Desktop | 1280px+ | HIGH |
| Large Desktop | 1440px+ | MEDIUM |

## 22.2 Responsive Design Principles

### Mobile-First Approach
1. Design for 320px first
2. Expand to larger screens
3. Use mobile-specific layouts, not compressed desktop

### Typography Scaling
- Use fluid type with clamp()
- Mobile: smaller scale (2rem heading → 3rem)
- Desktop: larger scale (3rem heading → 6rem)
- Line heights adjust per breakpoint

### Grid Systems
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Large: 4-5 columns

### Image Handling
- Crop to fit viewport
- Use object-fit: cover
- Define aspect ratios per context
- Serve smaller images to mobile

### Navigation
- Desktop: horizontal nav with dropdowns
- Mobile: hamburger menu with full-screen overlay
- Touch targets: minimum 44x44px

### Component Responsive Behavior

**SiteHeader:**
- Mobile: hamburger + drawer menu
- Tablet: horizontal nav, hamburger optional
- Desktop: full horizontal nav

**ProductCard:**
- Mobile: 2-column grid, square aspect
- Tablet: 2-3 column grid
- Desktop: 3-4 column grid

**Product Detail:**
- Mobile: single column (image top, info below)
- Tablet: 2-column
- Desktop: 2-column with gallery on left

**CartDrawer:**
- Mobile: full-width slide-out
- Desktop: max-w-sm (fixed width)

**Hero:**
- Mobile: full-bleed, stacked text
- Desktop: editorial typography placement

**CategoryDiscovery:**
- Mobile: single column, full-width cards
- Tablet: 2-column grid
- Desktop: lead + companion grid (7+5 columns)

**Footer:**
- Mobile: single column
- Tablet: 2-column
- Desktop: 3-4 column

## 22.3 Responsive Testing Plan
1. Chrome DevTools device emulation
2. Physical device testing (if available)
3. BrowserStack for cross-browser
4. Test all breakpoints for each page
5. Test touch interactions on mobile
6. Test keyboard navigation on desktop

## 22.4 No-Hover-Dependency Rule (Per AGENTS.md §23)
- All functionality must work without hover
- Hover states are enhancements only
- Touch devices cannot hover
- Keyboard navigation cannot hover

# 23. Technical Risks

## 23.1 High Risk Items

### Risk 1: Visual Direction Pivot
- **Risk**: Light premium direction contradicts existing dark CSS
- **Impact**: Significant component rewrites needed
- **Mitigation**: Create dual-surface token system, incremental changes
- **Timeline**: 1-2 weeks for complete transition

### Risk 2: Maasai Coffee Removal Incomplete
- **Risk**: Some references remain in codebase
- **Impact**: Brand confusion, violates brief
- **Mitigation**: Systematic search + replace, database cleanup
- **Timeline**: 1-2 days

### Risk 3: Price Exposure
- **Risk**: Products table exposes prices publicly
- **Impact**: Business requirement violation
- **Mitigation**: Remove price from all public views, keep in DB
- **Timeline**: 1 day

### Risk 4: Content Model Gap
- **Risk**: Current schema cannot support required IA
- **Impact**: Missing pages cannot be implemented
- **Mitigation**: Add new tables (articles, enquiries, navigation)
- **Timeline**: 2-3 weeks

### Risk 5: Supabase RLS Too Permissive
- **Risk**: Public write access is prototype-only
- **Impact**: Security vulnerability in production
- **Mitigation**: Add authentication, proper RLS policies
- **Timeline**: 3-4 weeks for auth + RLS

## 23.2 Medium Risk Items

### Risk 6: Missing Imagery
- **Risk**: Client imagery not yet integrated
- **Impact**: Visual quality below premium standard
- **Mitigation**: Placeholder system, art direction guidelines
- **Timeline**: Ongoing

### Risk 7: Admin Content Not Implemented
- **Risk**: Cannot manage site content without code changes
- **Impact**: Flexibility gap
- **Mitigation**: Implement /admin/content
- **Timeline**: 1-2 weeks

### Risk 8: No Journal/Enquiry System
- **Risk**: Required IA pages missing
- **Impact**: Incomplete product demonstration
- **Mitigation**: Add tables + admin + pages
- **Timeline**: 2-3 weeks

### Risk 9: Image Storage Not Integrated
- **Risk**: No upload management in admin
- **Impact**: Manual URL entry required
- **Mitigation**: Supabase Storage integration
- **Timeline**: 1-2 weeks

### Risk 10: Accessibility Debt
- **Risk**: Accessibility issues in existing components
- **Impact**: WCAG AA violations
- **Mitigation**: Systematic accessibility audit and fix
- **Timeline**: 1-2 weeks

## 23.3 Low Risk Items

### Risk 11: Performance Regression
- **Risk**: Visual enhancements impact performance
- **Impact**: Lighthouse score below 90
- **Mitigation**: Monitor metrics, optimize animations
- **Timeline**: Ongoing

### Risk 12: TypeScript Errors
- **Risk**: New code introduces TS errors
- **Impact**: Build failures
- **Mitigation**: Strict type checking, CI pipeline
- **Timeline**: Ongoing

### Risk 13: Mobile Menu Complexity
- **Risk**: Mobile nav edge cases (long lists, nested)
- **Impact**: UX issues on mobile
- **Mitigation**: Design for edge cases, test thoroughly
- **Timeline**: 3-5 days

# 24. UX Risks

## 24.1 High Risk UX Issues

### Risk 1: Light/Dark Surface Confusion
- **Risk**: Users confused by mixed light/dark sections
- **Impact**: Poor user experience, brand inconsistency
- **Mitigation**: Clear visual hierarchy, intentional transitions
- **Acceptance Criteria**: Clear visual rhythm, no jarring transitions

### Risk 2: CTA Ambiguity
- **Risk**: Users unsure what action to take without prices
- **Impact**: Lower engagement with products
- **Mitigation**: Clear CTA copy, value proposition near CTAs
- **Acceptance Criteria**: Every product has clear next step

### Risk 3: Navigation Complexity
- **Risk**: Deep IA (origins, quality, export, etc.) is hard to navigate
- **Impact**: Users get lost or give up
- **Mitigation**: Clear breadcrumbs, mega-menu, search
- **Acceptance Criteria**: User can find any page in 3 clicks

### Risk 4: Mobile Category Discovery
- **Risk**: Users cannot easily browse all categories on mobile
- **Impact**: Lost engagement
- **Mitigation**: Category-first mobile navigation
- **Acceptance Criteria**: Mobile menu shows all categories

## 24.2 Medium Risk UX Issues

### Risk 5: Admin Usability
- **Risk**: Admin is functional but not intuitive
- **Impact**: Staff productivity reduced
- **Mitigation**: Improve admin UX, add guidance
- **Acceptance Criteria**: Non-technical staff can manage content

### Risk 6: Cart/Checkout Flow
- **Risk**: Prototype checkout may confuse users
- **Impact**: Perceived as broken
- **Mitigation**: Clear prototype messaging, contact fallback
- **Acceptance Criteria**: Users understand this is prototype

### Risk 7: Product Image Quality Variance
- **Risk**: Placeholder vs real images create inconsistent feel
- **Impact**: Premium brand perception damaged
- **Mitigation**: Consistent image treatment, clear placeholders
- **Acceptance Criteria**: All visible images look intentional

# 25. Content Gaps

## 25.1 Critical Content Gaps

1. **All IA Pages Content**: Origins, Quality, Sustainability, About, Contact pages have no content
2. **Tea Products**: No real Treadville tea products
3. **Horticulture Products**: No real products (avocado or otherwise)
4. **Grains Products**: No real products
5. **Journal Articles**: No articles at all
6. **Farmer Stories**: No farmer relationship content
7. **Company History**: No timeline or history content
8. **Private Label Details**: No packaging/branding specifics
9. **Export Process**: No step-by-step export workflow
10. **Certifications Proof**: KEPHIS, SGS, USDA need documentation

## 25.2 Content Placeholder Strategy

### For Missing IA Pages
- Create template pages with "Content coming soon" or "Information to be supplied"
- Use real page structure, just empty content
- Signal what content is needed
- Allow Eunice to fill in via CMS later

### For Missing Products
- Keep current demo placeholders clearly marked
- Update seed to use "Treadville [Category] [Number]" naming
- Add notes in admin forms indicating "Real product data to be supplied"

### For Journal
- Create 1-2 sample articles to demonstrate architecture
- Use placeholder content that can be replaced
- Build admin UI for full CRUD

## 25.3 Content Delivery Timeline
| Content | Source | Timeline |
|---|---|---|
| Coffee product names fix | Internal edit | Week 1 |
| Tea products | Client | When available |
| Horticulture products | Client | When available |
| Grains products | Client | When available |
| Origins content | Client | Week 2-4 |
| Quality content | Client | Week 2-4 |
| Sustainability content | Client | Week 3-5 |
| About content | Client | Week 4-6 |
| Journal articles | Client | Week 6+ |
| Private label details | Client | Week 4-6 |
| Certification docs | Client | Week 2-3 |

# 26. Recommended Implementation Phases

## Phase 1: Content + Architecture Reconciliation (Week 1)
**Goal**: Fix brand conflicts, establish clean baseline

Tasks:
1. Fix Maasai Coffee → Treadville Specialty Coffee in seed data
2. Remove price display from public views
3. Add product metadata columns to schema
4. Add articles, enquiries, navigation tables
5. Fix Button.tsx TypeScript error
6. Verify all pages compile cleanly
7. Update AGENTS.md if needed

Deliverables:
- Clean seed data
- No public price exposure
- Extended schema
- Verified build

## Phase 2: Design System + Visual Foundation (Week 2-3)
**Goal**: Implement light premium direction

Tasks:
1. Add light surface tokens to globals.css
2. Create dual-surface token system
3. Update body/html default to light
4. Update all components for light/dark dual support
5. Update shadows for light backgrounds
6. Update glass variants for light
7. Create light section templates
8. Test all pages on light direction

Deliverables:
- Complete light premium design system
- All existing pages work on light surfaces
- Shadow/glass system works on both surfaces

## Phase 3: Public Website Core (Week 3-5)
**Goal**: Build missing IA pages

Tasks:
1. Implement /origins page (Kirinyaga terroir)
2. Implement /quality page (certifications)
3. Implement /export page (export services)
4. Implement /sustainability page
5. Implement /about page
6. Implement /contact page
7. Update footer with data-driven navigation
8. Update header with full navigation
9. Build contact/enquiry forms

Deliverables:
- All major IA pages exist
- Contact forms functional
- Navigation complete

## Phase 4: Product Catalogue (Week 5-7)
**Goal**: Enhance product experience

Tasks:
1. Update ProductCard for light premium
2. Update ProductPage for light premium
3. Add product metadata display (origin, altitude, SCA, etc.)
4. Update ProductDetailClient CTA
5. Remove "Single origin" for non-coffee
6. Implement product gallery
7. Update Shop pages for light premium
8. Add product filtering (future)

Deliverables:
- Premium product experience
- All product metadata visible
- Clean CTAs

## Phase 5: Coffee/Origin/Export Experiences (Week 7-8)
**Goal**: Deep coffee narrative

Tasks:
1. Coffee processing page
2. Coffee grades page
3. Q-grading explanation page
4. Private label page
5. Export workflow page
6. Coffee-specific product metadata
7. Enhanced coffee imagery

Deliverables:
- Complete coffee narrative
- Export buyer journey
- Private label information

## Phase 6: Tea/Grains/Horticulture (Week 8-10)
**Goal**: Expand beyond coffee

Tasks:
1. Replace demo tea products with real Treadville tea
2. Replace demo horticulture with real products (avocado)
3. Replace demo grains with real products
4. Category-specific page treatments
5. Category-specific product metadata
6. Photography integration per category

Deliverables:
- All categories populated with real products
- Category-specific experiences

## Phase 7: Admin Dashboard (Week 10-12)
**Goal**: Full admin functionality

Tasks:
1. Implement /admin/content
2. Add image upload to admin
3. Implement /admin/journal
4. Implement /admin/enquiries
5. Add navigation management
6. Add rich text editor
7. Add drag-drop sorting
8. Improve admin UX

Deliverables:
- Full CMS functionality
- Non-technical staff can manage all content

## Phase 8: Journal/Content (Week 12-14)
**Goal**: Editorial content system

Tasks:
1. Implement /journal page
2. Implement /journal/[slug]
3. Add article schema structured data
4. Create sample articles
5. Newsletter signup integration (future)

Deliverables:
- Complete journal system
- SEO-optimized articles

## Phase 9: Image/Art Direction (Week 14-16)
**Goal**: Premium visual treatment

Tasks:
1. Supabase Storage integration
2. Image upload + crop in admin
3. Image optimization pipeline
4. Art direction for all product photography
5. Hero image replacement
6. Category image replacement

Deliverables:
- Complete image management
- Premium visual presentation

## Phase 10: QA/Accessibility/Performance (Week 16-18)
**Goal**: Polish and production-readiness

Tasks:
1. Full responsive testing
2. Accessibility audit + fixes
3. Performance optimization
4. Cross-browser testing
5. Mobile device testing
6. Lighthouse score verification

Deliverables:
- WCAG AA compliant
- 90+ Lighthouse score
- Cross-browser compatible

## Phase 11: Production Hardening (Week 18-20)
**Goal**: Production-ready

Tasks:
1. Authentication implementation
2. Proper RLS policies
3. Rate limiting
4. Error monitoring
5. Analytics integration
6. DNS/domain setup
7. SSL certificates
8. CDN configuration

Deliverables:
- Production-ready platform
- Secure and monitored

# 27. Definition of Done

## Phase 1 Definition of Done

For Phase 1 to be complete, ALL of the following must be true:

### Code Quality
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] All components import correctly

### Brand Integrity
- [ ] Search confirms no "Maasai" or "Masai" references remain in codebase
- [ ] All 3 coffee products renamed from "Masai Coffee" to "Treadville Specialty Coffee"
- [ ] Product descriptions do not contain Maasai references
- [ ] Button.tsx TypeScript error fixed

### Price Visibility
- [ ] ProductCard does not display price
- [ ] Product detail page does not display price (except in cart context)
- [ ] Shop pages do not display price
- [ ] "Request Quote" / "Request Sample" CTAs visible instead of prices

### Schema Extensions
- [ ] New tables created (articles, enquiries, navigation)
- [ ] Product metadata columns added (origin, altitude, processing_method, sca_score, tasting_notes)
- [ ] Seed data updated to reflect new schema
- [ ] TypeScript types updated for new tables

### Architecture
- [ ] queries.ts updated with new query functions
- [ ] New types imported where needed
- [ ] No breaking changes to existing functionality

## Phase 2 Definition of Done

For Phase 2 (Design System) to be complete, ALL of the following must be true:

### Visual Direction
- [ ] html, body default to light background (bone/cream/warm-white)
- [ ] Light surface tokens created and documented
- [ ] Dual-surface token system working
- [ ] Category accents visible and prominent on light backgrounds

### Component Compatibility
- [ ] All existing components work on light backgrounds
- [ ] Shadows render correctly on light surfaces
- [ ] Glass material works on light backgrounds
- [ ] Typography legible on all surfaces

### Visual Quality
- [ ] Products images pop on bright backgrounds
- [ ] Section transitions are intentional
- [ ] Dark sections used for contrast only
- [ ] Premium editorial feel maintained

## Phase 3 Definition of Done

For Phase 3 (Public Website Core) to be complete, ALL of the following must be true:

### Page Coverage
- [ ] /origins page exists with content
- [ ] /quality page exists with content
- [ ] /export page exists with content
- [ ] /sustainability page exists with content
- [ ] /about page exists with content
- [ ] /contact page exists with functional form

### Navigation
- [ ] Header nav includes all major sections
- [ ] Mobile menu includes all sections
- [ ] Footer includes all sections
- [ ] Breadcrumbs on inner pages

### Forms
- [ ] Contact form submits successfully
- [ ] Form validation works
- [ ] Error states handled
- [ ] Success confirmation shown

## Phase 4 Definition of Done

For Phase 4 (Product Catalogue) to be complete, ALL of the following must be true:

### Product Experience
- [ ] ProductCard works on light surfaces
- [ ] ProductPage shows metadata (origin, altitude, SCA score)
- [ ] "Single origin" only on coffee products
- [ ] CTAs: "Request Sample", "Request Quote", "Enquire"
- [ ] Product gallery functional

### Commerce Flow
- [ ] Add to cart works
- [ ] Cart drawer functional
- [ ] Checkout page accessible
- [ ] Prototype messaging visible

## Overall Project Definition of Done

For the entire rebuild to be complete, ALL of the following must be true:

### Functional Requirements
- [ ] All IA pages implemented
- [ ] All forms functional
- [ ] Cart and checkout working
- [ ] Admin fully functional
- [ ] Content management working
- [ ] Image management working

### Visual Requirements
- [ ] Light premium direction implemented
- [ ] Dark sections for contrast only
- [ ] Products images prominent and eye-catching
- [ ] Premium editorial feel throughout
- [ ] Consistent brand identity

### Technical Requirements
- [ ] Lighthouse Performance 90+
- [ ] WCAG AA compliant
- [ ] Responsive on all target viewports
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Production build succeeds

### Security Requirements
- [ ] Authentication implemented
- [ ] Proper RLS policies
- [ ] No exposed secrets
- [ ] Form rate limiting
- [ ] Input sanitization

---

# 28. Phase 1 Files to Touch

## Phase 1 Files (Content + Architecture Reconciliation)

### CRITICAL: Fix Maasai Coffee References

**supabase/seed.sql**
- Line 12: Change "Masai Coffee Moka Espresso" to "Treadville Specialty Coffee -- Moka Espresso"
- Line 13: Remove "Maasai heritage" reference from description
- Line 18: Change "Masai Coffee Supreme" to "Treadville Specialty Coffee Supreme"
- Line 19: Remove "Maasai heritage" from description
- Line 24: Change "Masai Coffee Kenya AA" to "Treadville Kenya AA Gold Enticing"
- Run updated seed against database OR use admin to edit existing products

**src/app/product/[slug]/page.tsx**
- Line 32: Make "Single origin" label conditional on coffee category
```tsx
// Current:
<p className="font-mono text-xs uppercase tracking-widest text-accent">Single origin</p>

// Fix:
const isCoffee = categorySlug === coffee;
{isCoffee && <p className="...">Single origin</p>}
```

### CRITICAL: Remove Public Price Display

**src/components/ProductCard.tsx**
- Lines 47-55: Remove price display logic entirely
```tsx
// Current:
{product.price ? (
  <p className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--parchment)]/60">
    KSh {product.price.toLocaleString()}
  </p>
) : (
  <p className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--accent)]">
    Request quote
  </p>
)}
```
Replace with:
```tsx
<p className="shrink-0 whitespace-nowrap font-mono text-xs text-[var(--accent)]">
  Enquire
</p>
```

**src/app/product/[slug]/page.tsx**
- Lines 37-42: Remove price display
- Update CTA text from "Add to order" to "Add to enquiry" or "Request sample"

**src/app/checkout/page.tsx**
- Keep prices in cart context (prototype)
- Ensure "Prototype only" messaging is visible

### CRITICAL: Fix Button.tsx TypeScript Error

**src/components/Button.tsx**
- Line 12: Change `ButtonStyleProps = Pick<BaseProps, "variant" | "children" | "className">`
- To: `ButtonStyleProps = Pick<BaseProps, "variant" | "className">`

### IMPORTANT: Schema Extensions

**supabase/schema.sql**
- Add product_attributes table
- Add articles table
- Add enquiries table
- Add site_navigation table
- Add product metadata columns (origin, altitude, processing_method, sca_score, tasting_notes)

**src/lib/types.ts**
- Add ProductAttribute type
- Add Article type
- Add Enquiry type
- Add NavigationItem type

**src/lib/queries.ts**
- Add getArticles, createArticle, updateArticle, deleteArticle
- Add getEnquiries, createEnquiry, updateEnquiryStatus
- Add getNavigation
- Add getProductAttributes, upsertProductAttribute

### IMPORTANT: Seed Data Updates

**supabase/seed.sql**
- Rename coffee products (Maasai → Treadville)
- Add sample article(s)
- Add site_navigation seed data
- Update category images to real URLs when available

### VERIFY: Build Clean

After changes:
1. `npx tsc --noEmit` → zero errors
2. `npm run lint` → zero errors
3. `npm run build` → success
4. Manual smoke test:
   - Homepage loads
   - Shop page loads
   - Product page loads (no price shown)
   - Cart works
   - Admin works
   - No console errors

---

## Summary: What Must Be Preserved

1. **Architecture**: Centralized queries.ts, TypeScript types, Supabase client
2. **Components**: SiteHeader, SiteFooter, CartContext, CartDrawer, Reveal, GlassPanel, HeroSlideshow, Provenance, CategoryDiscovery, ProductCard, ProductImage, CategoryMark, CategoryTabs
3. **Pages**: Homepage structure, Shop pages, Product pages, Admin pages
4. **Design Tokens**: Complete token system (colors, spacing, typography, motion)
5. **Motion System**: Reveal animations, chapter crossfade
6. **Accessibility**: Keyboard navigation, ARIA, focus management
7. **Data Model**: Core categories/products/site_content structure
8. **Admin Architecture**: CRUD pattern, immediate storefront sync

## Summary: What Must Change

1. **Brand**: "Maasai Coffee" → "Treadville Specialty Coffee"
2. **Pricing**: Remove from all public views
3. **Visual Direction**: Light premium (gradual transition)
4. **Content Model**: Add articles, enquiries, navigation tables
5. **Product Metadata**: Add origin, altitude, SCA score, etc.
6. **IA Pages**: Build missing origin/quality/export/about/contact pages
7. **Admin Content**: Implement /admin/content
8. **Journal**: Implement article system

## Summary: What Is Missing

1. **All IA Pages**: /origins, /quality, /export, /sustainability, /about, /contact, /journal
2. **Real Products**: Tea, Horticulture, Grains real products
3. **Journal Articles**: No articles at all
4. **Contact Forms**: Functional enquiry forms
5. **Navigation Management**: Admin UI for navigation
6. **Image Upload**: Supabase Storage integration
7. **Rich Content**: Private label details, farmer stories, company history
8. **Enquiry Management**: Admin view for submissions

## Summary: Highest Priority Implementation Phase

**Phase 1: Content + Architecture Reconciliation**

Rationale:
1. Brand conflict (Maasai) must be fixed immediately
2. Price exposure is a business requirement violation
3. Schema extensions enable everything else
4. Clean baseline required before visual changes
5. Quick win (1 week) that removes critical issues

## Summary: Files to Touch First (Phase 1)

Priority order:
1. **supabase/seed.sql** -- Fix Maasai names
2. **supabase/schema.sql** -- Add new tables
3. **src/lib/types.ts** -- Add new types
4. **src/lib/queries.ts** -- Add new query functions
5. **src/components/Button.tsx** -- Fix TypeScript error
6. **src/components/ProductCard.tsx** -- Remove price display
7. **src/app/product/[slug]/page.tsx** -- Remove price, fix "Single origin"
8. **src/app/product/[slug]/ProductDetailClient.tsx** -- Update CTA text

---

*Audit completed: 2026-09-01*
*Auditors: Senior Product Architect, Senior Next.js Architect, Frontend Architect, UI/UX Director, Visual Design Director, Design Systems Engineer, Full-Stack Engineer, Supabase Architect, Admin Dashboard Architect, Accessibility Engineer, Performance Engineer, SEO Engineer, QA Lead, Technical Documentation Lead*
*Status: READY FOR IMPLEMENTATION (pending authorization)*
