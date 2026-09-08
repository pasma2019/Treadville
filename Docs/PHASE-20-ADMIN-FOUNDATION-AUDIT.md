# PHASE 20 — ADMIN FOUNDATION AUDIT

**Date:** Phase 20, Step 1
**Scope:** Full inspection of the Phase 19 implementation to determine what exists and what Phase 20 must add.

---

## 1. What Phase 19 Delivered

### 1.1 Authentication
| Feature | Status | Implementation |
|---|---|---|
| Supabase SSR sessions | ✓ Working | `@supabase/ssr` + cookie-based |
| proxy.ts (Next.js 16) | ✓ Working | Session refresh on every request |
| `/admin/login` | ✓ Working | Email + password sign-in |
| `/admin/forgot-password` | ✓ Working | Sends reset email via Supabase Auth |
| `/admin/reset-password` | ✓ Working | Post-link password update |
| Sign-out | ✓ Working | `SignOutButton` component |
| Auth redirect | ✓ Working | proxy.ts redirects unauthenticated users |

**SMTP note:** Password reset emails require SMTP to be configured in Supabase project settings. This is a Supabase dashboard task, not code.

### 1.2 Authorization
| Feature | Status | Implementation |
|---|---|---|
| `OWNER` role | ✓ Working | Business management |
| `SYSTEM_ADMIN` role | ✓ Working | Full system access |
| `requireAdmin()` | ✓ Working | Server-side auth check |
| `requireRole()` | ✓ Working | Server-side role check |
| `ForbiddenError` | ✓ Working | Non-SYSTEM_ADMIN → 403 |

### 1.3 RLS
All tables have policies. Public access is correctly scoped to `published` products, `active` categories, and `site_content` reads. No admin data is publicly accessible.

### 1.4 Server Actions
All admin mutations go through `lib/admin-actions.ts` with auth re-checks. Actions are: product CRUD + publish, category CRUD, site content updates, enquiry status changes, user invitations, role management.

### 1.5 Existing Admin Pages
| Route | Status | Notes |
|---|---|---|
| `/admin` | ✓ Working | Dashboard with real counts |
| `/admin/products` | ✓ Working | Table + add/edit |
| `/admin/categories` | ✓ Working | Table + add/delete |
| `/admin/content` | ✓ Working | Homepage fields only |
| `/admin/enquiries` | ✓ Working | Status workflow |
| `/admin/users` | ✓ Working | Invite + roles |
| `/admin/integrations` | ✓ Working | Daraja display (read-only) |
| `/admin/activity` | ✓ Working | Audit log |

### 1.6 Database Schema
Phase 19 added: `profiles`, `admin_roles`, `enquiries`, `audit_log`. Existing tables: `categories`, `products`, `site_content`. Schema is clean. No articles/journal table.

### 1.7 Contact Form
Now persists to `enquiries` table via `submitEnquiryAction` Server Action. Visitors' messages are actually stored.

---

## 2. What's Missing — Phase 20 Requirements

### 2.1 Journal CMS
**Status:** NOT BUILT — no `/admin/journal` page, no articles table.

The public storefront has a `/journal` page that displays articles. The Phase 18 audit referenced the journal. But there is:
- No `articles` table in the schema
- No `/admin/journal` admin page
- No Server Actions for article CRUD
- No article types in `types.ts`

**Impact:** Eunice cannot manage journal content without going to the database directly.

### 2.2 Settings / Account
**Status:** NOT BUILT — no `/admin/settings` page.

Users have no way to:
- Update their own display name (it stays null from initial sign-up)
- Change their own password
- View their own account info

**Impact:** No self-service account management.

### 2.3 Security Page
**Status:** NOT BUILT — no `/admin/security` page.

Phase 20 wants a dedicated security status page (SYSTEM_ADMIN only) showing:
- Authentication status
- RLS status
- Storage status
- Environment status
- Recent security events
- Active admin users

Currently this information is not consolidated anywhere.

### 2.4 Image Upload with Storage
**Status:** PARTIAL — no Supabase Storage integration.

Current state:
- Product `image_url` is a text field (paste URL)
- Category `image_url` is a text field (paste URL)
- No drag-and-drop
- No preview
- No upload progress
- No file validation
- No storage bucket management
- No cleanup on delete

**Impact:** Eunice must manually upload images somewhere else (e.g. Supabase Storage dashboard, external service) and paste the URL. This is not acceptable for a production system.

### 2.5 Product Gallery
**Status:** DATA MODEL EXISTS, UI MISSING.

The `products` table already has a `gallery text[]` column. But:
- No UI to manage gallery images
- No gallery management in the product editor
- No image ordering
- No alt text support

### 2.6 Product Metadata
**Status:** NOT BUILT.

No support for category-specific metadata (origin, altitude, SCA score for coffee, etc.). The `products` table has only the base fields. Future metadata would need either:
- A `product_metadata` table with a `key/value` or JSONB approach
- Column extension (requires migration for each new field)

Current products are limited to name, slug, description, price, image_url, gallery, featured, stock, status.

### 2.7 Mobile Navigation
**Status:** NOT BUILT.

The admin layout uses a fixed sidebar (`w-64 shrink-0`). On mobile:
- The sidebar takes full width
- The main content is squeezed
- No hamburger menu
- No collapsible overlay

**Impact:** The admin is unusable on mobile/tablet.

### 2.8 Role-Aware Navigation
**Status:** PARTIAL.

The current `NAV_SECTIONS` array in `admin/layout.tsx` shows the same navigation to all users. Phase 20 requires:
- OWNER: Overview, Products, Categories, Content, Journal, Enquiries, Settings
- SYSTEM_ADMIN: All of the above + Users, Integrations, Activity, Security

Currently, OWNER sees System links they cannot use (which redirect to 403).

### 2.9 Dashboard Improvements
**Status:** BASIC.

Current dashboard shows counts + recent items. Phase 20 wants:
- Recent activity from audit_log (if SYSTEM_ADMIN or OWNER with scoped view)
- Quick actions panel
- Business health indicators

### 2.10 Site Content Scope
**Status:** LIMITED.

Current `/admin/content` only manages 4 homepage fields (hero headline, subheadline, image URL, about blurb). Phase 20 wants a broader CMS for:
- Homepage sections
- Footer content (company info, contact)
- Brand story / About

---

## 3. Architecture Gaps

### 3.1 Image Storage Architecture
No Supabase Storage integration. Images are stored as URLs. There is no `storage_file` tracking table to record:
- Original filename
- Storage path
- Mime type
- File size
- Uploaded by (user_id)
- Upload timestamp
- Alt text

### 3.2 Articles / Journal Architecture
No `articles` table. The public `/journal` page must be currently using static content or the old seed data.

### 3.3 Profile Self-Management
The `profiles` table has `display_name` but no Server Action for a user to update their own profile. The current `admin-actions.ts` has no `updateProfileAction`.

### 3.4 Environment Status Check
The `/admin/integrations` page can't actually read server-side environment variables. It shows placeholders. A proper status page would need to read env vars server-side (which is possible in Next.js Server Components) and display configuration state.

---

## 4. Syntax Issues Found in Current Code

### 4.1 `admin/layout.tsx` — duplicate closing bracket

Lines 46, 50, 54, 62, 76, 80, 83, 90 have `)]` instead of `]` in className strings. Example:
```
className="border-r border-[var(--line-on-light)] bg-[var(--ivory)]"
```
Should be:
```
className="border-r border-[var(--line-on-light)] bg-[var(--ivory)]"
```

This is a CSS className parsing issue — the extra `]` may cause Tailwind to mis-parse the bracket expression.

### 4.2 `integrations/page.tsx` — unused `user` variable
The page declares `let user` but never uses it after the role check. Minor TypeScript warning.

---

## 5. Supabase Storage Readiness

To implement image upload, Supabase Storage must be configured with:
- A `product-images` bucket (public or admin-accessible)
- A `category-images` bucket
- A `article-images` bucket
- Appropriate RLS policies

**Current storage state:** Unknown. The seed data references `/images/...` paths but the `public/images/` directory is empty. Images may be in Supabase Storage already, or they may be URLs pointing to external services.

Before implementing Storage upload, Pascal must confirm:
1. What storage bucket exists
2. Whether existing product images are in Storage or external URLs
3. What the bucket policy is
4. Whether the service-role can write to storage

**Migration risk:** If existing product images are URLs pointing to an external service, switching to Supabase Storage upload will require re-uploading all images. This is a data migration task.

---

## 6. Key Design Decisions for Phase 20

### 6.1 Image Upload Strategy
Given the storage uncertainty, Phase 20 will implement:
1. **Server Action for pre-signed upload URL** — the browser uploads directly to Supabase Storage (avoids proxying large files through Next.js)
2. **Graceful fallback** — if no Storage bucket is configured, the existing URL text field continues to work
3. **storage_file tracking table** — records metadata about uploaded files for cleanup and audit

### 6.2 Articles Table Design
```
articles
  id uuid pk
  title text not null
  slug text unique
  excerpt text
  body text
  author_name text
  cover_image_url text
  status text default 'draft' check (status in ('draft', 'published'))
  published_at timestamptz
  created_at timestamptz
  updated_at timestamptz
```
RLS: public can SELECT published articles. Admins can do all.

### 6.3 Journal Admin UX
Simple article management:
- List view with title, status, date
- Status filter (All / Draft / Published)
- Create / Edit / Delete / Publish / Unpublish actions
- WYSIWYG not required — plain textarea with formatting hints is sufficient for Phase 20

### 6.4 Settings Page Architecture
Two sections under `/admin/settings`:
1. **Account** (`/admin/settings`) — update display name, view email, change password (via Supabase Auth)
2. **Business** (`/admin/settings/business`) — company name, tagline, contact info, social links (stored in `site_content`)

### 6.5 Security Page Architecture
`/admin/security` — SYSTEM_ADMIN only:
- Authentication: session timeout, last login
- Database: RLS enabled status, table policy summary
- Storage: bucket list, public access status
- Environment: configured/unconfigured flags per integration
- Recent activity: last 20 audit log entries

### 6.6 Navigation UX
Role-aware navigation with mobile overlay:
- Sidebar collapses to hamburger on mobile
- Overlay nav with all sections
- Role filtering done in the layout (server component) — SYSTEM_ADMIN gets extra sections
- Clear active state on current page

---

## 7. What's NOT Being Built in Phase 20

The following Phase 20 requirements are documented for future phases:
- Full product metadata (origin, altitude, SCA score) — requires `product_metadata` table + schema design
- Bulk image upload
- Product variant management (sizes, grades, weights)
- Full-text search in admin
- Pagination in admin tables (loads all records)
- Email notifications when new enquiries arrive
- Advanced notification preferences
- Multi-language support in CMS
- Scheduled publishing for articles
- Article category/tag taxonomy
- Analytics integration
- Audit log for OWNER (OWNER should see their own actions, not all system activity)

---

## 8. Risk Assessment

| Item | Risk | Mitigation |
|---|---|---|
| Storage bucket not configured | Image upload will fail silently | Fall back to URL text field |
| Existing images are external URLs | Migration complexity | Preserve URL field; Storage is additive |
| SMTP not configured | Password reset emails don't send | Document in setup guide |
| Mobile nav accessibility | Overlay traps focus | Use proper focus management + ARIA |
| Article body length | Plain textarea insufficient | Use `<textarea>` with character count; WYSIWYG deferred |

---

## 9. Next Step

Proceed to Phase 20 Plan — create `Docs/PHASE-20-ADMIN-FOUNDATION-PLAN.md`, then implement in priority order.
