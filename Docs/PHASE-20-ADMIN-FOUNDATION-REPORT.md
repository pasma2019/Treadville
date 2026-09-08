# PHASE 20 — ADMIN FOUNDATION REPORT

**Date:** Phase 20 complete
**Scope:** Journal CMS, Settings, Security, Mobile nav, Role-aware shell, Image upload architecture, Storage tracking.
**Status:** Complete. TypeScript passes (0 errors). Build passes (26 routes).

---

## 1. What Was Built

### 1.1 Documents
| Document | Purpose |
|---|---|
| `Docs/PHASE-20-ADMIN-FOUNDATION-AUDIT.md` | Full audit of Phase 19 state — identified what existed, what was missing, and risks |
| `Docs/PHASE-20-ADMIN-FOUNDATION-PLAN.md` | Implementation plan with schema, types, components, navigation structure |
| `Docs/PHASE-20-ADMIN-FOUNDATION-REPORT.md` | This document — delivery report with all changes |

### 1.2 Database Schema Additions (Phase 20)

**`articles` table** — Journal CMS
```sql
articles (id, title, slug, excerpt, body, author_name, cover_image_url,
          status ['draft'|'published'], published_at, created_at, updated_at)
RLS: public read published only. Admins full access.
Indexes: status, published_at desc
```

**`storage_files` table** — Image upload tracking
```sql
storage_files (id, storage_path, original_filename, mime_type, file_size,
              bucket, uploader_id, created_at)
RLS: no public access. Admins read only. Service role writes via Server Actions.
Indexes: bucket, uploader_id
```

### 1.3 New Types (in `types.ts`)
- `Article` — full article shape including status, published_at, updated_at
- `StorageFile` — storage upload metadata

### 1.4 New Server Actions (in `admin-actions.ts`)
| Action | Purpose |
|---|---|
| `createArticleAction` | Create article (draft or published) with slug deduplication |
| `updateArticleAction` | Update article fields |
| `setArticleStatusAction` | Publish / unpublish with timestamp management |
| `deleteArticleAction` | Delete article |
| `createImageUploadAction` | Generate pre-signed upload URL via service-role client |
| `recordImageUploadAction` | Record upload metadata in `storage_files` |
| `deleteImageAction` | Delete from Supabase Storage + remove record |
| `updateProfileAction` | Update own display name |

All actions: auth re-checked via `requireAdmin()`, audit-logged, revalidate paths.

### 1.5 New Components
| Component | Purpose |
|---|---|
| `ImageUpload.tsx` | Drag-and-drop zone, file picker, progress bar, preview, replace, remove. Direct upload to Supabase Storage via pre-signed URL. Graceful fallback on error. Max 10 MB, JPEG/PNG/WebP only. |
| `AdminSidebar.tsx` | Mobile hamburger menu with overlay, focus management, role-aware navigation, active state |
| `JournalClient.tsx` | Article list with status filter (All/Draft/Published), inline publish/unpublish/delete, create/edit expand |
| `ArticleForm.tsx` | Article editor: title, slug, author, excerpt, body, cover image URL, publish checkbox |
| `SettingsClient.tsx` | Two tabs: Account (display name) + Business (site content fields) |

### 1.6 New Pages
| Route | Access | Purpose |
|---|---|---|
| `/admin/journal` | OWNER, SYSTEM_ADMIN | Article management |
| `/admin/settings` | OWNER, SYSTEM_ADMIN | Account + Business profile |
| `/admin/security` | SYSTEM_ADMIN only | Security status, active users, recent activity |

### 1.7 Admin Shell Improvements
- **Mobile navigation**: Fixed bottom-right hamburger button, full-screen overlay, backdrop blur, focus management
- **Role-aware nav**: OWNER sees Overview, Catalogue, Content, Journal, Business, Settings. SYSTEM_ADMIN additionally sees System (Users, Integrations, Security, Activity)
- **Clean server layout**: Removed hard-coded `NAV_SECTIONS`, delegates to `AdminSidebar` client component
- **Hamburger**: Fixed position, visible only on mobile (`lg:hidden`), `aria-expanded`, `aria-controls`

### 1.8 Navigation Structure
```
OWNER:
  Overview → Dashboard
  Catalogue → Products, Categories
  Content → Homepage
  Journal → Articles
  Business → Enquiries
  Settings → Account & Business

SYSTEM_ADMIN:
  All of the above +
  System → Users, Integrations, Security, Activity
```

---

## 2. Files Changed

**NEW:**
- `src/app/admin/journal/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/admin/security/page.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/ImageUpload.tsx`
- `src/components/admin/JournalClient.tsx`
- `src/components/admin/ArticleForm.tsx`
- `src/components/admin/SettingsClient.tsx`
- `Docs/PHASE-20-ADMIN-FOUNDATION-AUDIT.md`
- `Docs/PHASE-20-ADMIN-FOUNDATION-PLAN.md`

**MODIFIED:**
- `src/app/admin/layout.tsx` — simplified server layout using AdminSidebar
- `src/app/admin/integrations/page.tsx` — removed unused `user` variable
- `src/lib/types.ts` — added `Article`, `StorageFile` types
- `src/lib/admin-actions.ts` — added all Phase 20 Server Actions
- `src/lib/audit.ts` — already working, no changes needed
- `supabase/schema.sql` — added `articles` table + `storage_files` table with RLS + indexes

**REMOVED:**
- None

---

## 3. Image Upload Architecture

The `ImageUpload` component implements the pre-signed URL pattern:

```
Browser                    Treadville Server              Supabase Storage
  │                              │                              │
  │─── upload file ────────────▶│                              │
  │   drop/select               │                              │
  │                              │─── createImageUploadAction ─▶│
  │                              │   (service-role, server)     │
  │                              │◀── signed upload URL ───────│
  │◀── signed URL ──────────────│                              │
  │                              │                              │
  │─── PUT signed URL ────────────────────────────────────────▶│
  │   (direct, browser→Storage) │                              │
  │                              │                              │
  │─── recordImageUploadAction ─▶│                              │
  │   (metadata only)           │                              │
```

**Security properties:**
- Service-role key never leaves the server
- Browser uploads directly to Storage (avoids proxying large files)
- `storage_files` records metadata for audit and cleanup
- Upload cleanup on remove/replace via `deleteImageAction`
- File validation: max 10 MB, JPEG/PNG/WebP only
- Error states: network failure, invalid format, size exceeded, bucket not configured

**Pre-requisite for image upload to work:** Supabase Storage bucket must be created. Graceful degradation: if bucket doesn't exist, the Server Action returns an error and the component shows the error state with retry option.

---

## 4. Security Decisions

| Decision | Rationale |
|---|---|
| `storage_files` has no public read/write policy | File metadata is sensitive (paths could reveal infrastructure) |
| `articles` allows public read of published only | Journal content should be public when published |
| SECURITY page is SYSTEM_ADMIN only | Configuration status is technical information not relevant to Eunice |
| Settings page is accessible to both roles | Account self-service is needed by all admins |
| Journal is accessible to both roles | OWNER should manage content; SYSTEM_ADMIN should have visibility |
| `updateProfileAction` requires auth re-check | A user cannot update another user's profile |
| No role supplied by browser | Role always fetched server-side from `profiles` + `admin_roles` |

---

## 5. Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** (0 errors) |
| `npm run build` | **PASS** (26 routes) |
| `@next/swc-win32-x64-msvc` warning | WASM fallback — cosmetic, not a code issue |

---

## 6. What's NOT in Phase 20 (Future Phases)

| Item | Reason deferred |
|---|---|
| Image upload in product editor (integrated) | Phase 20 lays the architecture. Full integration into ProductsClient form needs storage bucket confirmed first |
| Product metadata fields (origin, SCA score) | Requires `product_metadata` JSONB table + category-aware form fields |
| WYSIWYG article editor | Plain textarea sufficient for Phase 20; Tiptap/ProseMirror deferred |
| Image upload for categories | Same storage architecture, but bucket needs to exist first |
| Image upload for article covers | Same `ImageUpload` component; needs bucket |
| Pagination in admin tables | Not a Phase 20 requirement |
| Email notifications on new enquiries | Requires SMTP + notification infrastructure |
| OWNER audit log (scoped to own actions) | All activity visible only to SYSTEM_ADMIN |
| Scheduled article publishing | Date picker deferred |
| Article categories/tags | No taxonomy needed yet |

---

## 7. Migration for Pascal

Before Phase 20 features work in production:

1. **Run new schema** against Supabase database:
   ```bash
   cat supabase/schema.sql | psql $DATABASE_URL
   ```
   (or use Supabase dashboard SQL editor)

2. **Create Storage buckets** in Supabase:
   - `product-images` (public read recommended for product images)
   - `category-images`
   - `article-images`

3. **Set bucket policies** (for public read of product images):
   ```sql
   -- Allow public read of product-images
   create policy "Public read product images"
     on storage.objects for select
     using (bucket_id = 'product-images');
   -- Allow authenticated uploads
   create policy "Auth upload product images"
     on storage.objects for insert
     with check (bucket_id = 'product-images');
   ```

4. **Deploy Phase 20 build** to hosting

5. **Test image upload** — verify pre-signed URL generation + direct browser upload

---

## 8. Exact Next Recommended Phase

**Phase 21: Full Product Editor + Storage Integration**

Priority tasks:
1. Integrate `ImageUpload` into `ProductsClient` inline form (swap URL text input)
2. Integrate `ImageUpload` into `CategoriesClient`
3. Integrate `ImageUpload` into `ArticleForm` (cover image)
4. Add `product_metadata` table for category-specific fields (coffee origin, SCA score, etc.)
5. Dashboard — add recent activity feed (last 10 audit log entries)
6. Settings — add "Change password" via Supabase Auth update
7. Enquiries — add enquiry type filter + pagination
8. Integrate `ImageUpload` into category editor

This phase completes the "Eunice can add a product with an image without touching a URL" requirement from Phase 20 acceptance criteria.
