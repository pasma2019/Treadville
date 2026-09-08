# PHASE 20 — ADMIN FOUNDATION PLAN

## 1. Plan Overview

Phase 20 adds the missing management capabilities to the Treadville admin: Journal CMS, Settings, Security status, image upload, mobile navigation, and role-aware layout.

### Priority Order
1. Fix syntax bug in admin layout (`)]` → `]`)
2. Database schema: add `articles` table + `storage_files` table
3. Types: add `Article`, `StorageFile`
4. Server Actions: journal CRUD, storage file management
5. ImageUpload component (drag/drop, preview, progress, replace, remove)
6. Admin shell: mobile nav + role-aware navigation
7. Journal CMS (`/admin/journal`)
8. Settings (`/admin/settings`) + Account profile update
9. Security page (`/admin/security`)
10. Dashboard refresh (recent activity, quick actions)
11. TypeScript + build verification

---

## 2. Database Schema

### 2.1 `articles` table
```sql
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  author_name text,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table articles enable row level security;

-- Public: read published articles only
create policy "Public read published articles"
  on articles for select using (status = 'published');

-- Admins: full access
create policy "Admins manage articles"
  on articles for all using (
    exists (
      select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('OWNER', 'SYSTEM_ADMIN')
    )
  );
```

### 2.2 `storage_files` table
```sql
create table if not exists storage_files (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  original_filename text,
  mime_type text,
  file_size integer,
  bucket text not null,
  uploader_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table storage_files enable row level security;

-- Public: no access
create policy "No public access"
  on storage_files for all using (false);

-- Admins: full access
create policy "Admins manage storage_files"
  on storage_files for all using (
    exists (
      select 1 from admin_roles
      where admin_roles.user_id = auth.uid()
      and admin_roles.role in ('OWNER', 'SYSTEM_ADMIN')
    )
  );
```

---

## 3. Type Changes

Add to `types.ts`:
```typescript
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  author_name: string | null;
  cover_image_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type StorageFile = {
  id: string;
  storage_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size: number | null;
  bucket: string;
  uploader_id: string | null;
  created_at: string;
};
```

---

## 4. Server Actions (to add to `admin-actions.ts`)

### 4.1 Article Actions
- `createArticleAction` — create draft article
- `updateArticleAction` — update article fields
- `publishArticleAction` — set status = published, published_at = now
- `unpublishArticleAction` — set status = draft, published_at = null
- `deleteArticleAction` — delete article

### 4.2 Storage Actions
- `getUploadUrl` — generate a pre-signed upload URL (service-role client)
- `confirmUpload` — record the upload in `storage_files` table
- `deleteStorageFile` — delete from storage + remove record

---

## 5. Component Changes

### 5.1 ImageUpload Component
A reusable `<ImageUpload>` component with:
- Drag-and-drop zone
- File picker button
- Upload progress indicator
- Image preview (after upload)
- Replace button
- Remove button
- Error state with human-readable messages
- Max file size: 10 MB
- Accepted formats: JPEG, PNG, WebP
- Returns the public storage URL after successful upload

Behavior:
1. User drops/selects a file
2. Component calls a Server Action for a pre-signed URL
3. Browser uploads directly to Supabase Storage
4. On success, `onUpload(url: string)` callback fires
5. Parent component receives the URL and can save it

Graceful degradation: if no Storage is configured, show a URL input field instead.

### 5.2 Admin Shell Changes
- Extract sidebar into `<AdminSidebar>` client component
- Add hamburger menu for mobile
- Overlay nav on mobile with full section list
- `aria-expanded`, `aria-controls` for accessibility
- Role-aware nav links (OWNER gets Journal + Settings; SYSTEM_ADMIN additionally gets Users + Integrations + Activity + Security)
- Fix the `)]` syntax bug throughout the layout

---

## 6. New Pages

### 6.1 `/admin/journal` — OWNER + SYSTEM_ADMIN
- Article list with status filter (All / Draft / Published)
- Quick publish/unpublish buttons
- Create article button
- Article editor (inline expand or separate page)
- Fields: title, slug, excerpt, body, author, cover image
- Delete with confirmation

### 6.2 `/admin/settings` — OWNER + SYSTEM_ADMIN
Two tabs:
- **Account** — display name, email (read-only), change password
- **Business** — company name, tagline, contact info (stored in site_content keys)

### 6.3 `/admin/security` — SYSTEM_ADMIN only
- Authentication: session status, auth method
- RLS: summary of which tables have RLS enabled
- Storage: bucket list with public/private status
- Environment: integration configuration status
- Active sessions: recent admin sign-ins (from audit log)
- Active users: currently signed-in admin users

---

## 7. Navigation Structure

### OWNER Navigation
```
Overview
  Dashboard
Catalogue
  Products
  Categories
Content
  Homepage
Journal
  Articles
Business
  Enquiries
Settings
  Account
  Business
```

### SYSTEM_ADMIN Navigation
```
Overview
  Dashboard
Catalogue
  Products
  Categories
Content
  Homepage
Journal
  Articles
Business
  Enquiries
Settings
  Account
  Business
System
  Users
  Integrations
  Security
  Activity
```

---

## 8. Not in Phase 20
- Product metadata fields (origin, altitude, SCA score) — deferred
- Pagination in admin tables — deferred
- WYSIWYG editor for articles — deferred
- Email notifications on new enquiries — deferred
- Audit log for OWNER — deferred (only SYSTEM_ADMIN sees full log)
- Bulk image operations — deferred
- Scheduled publishing — deferred

---

## 9. Migration Steps (for Pascal)

1. Run new `supabase/schema.sql` (Phase 20 additions) against the database
2. Create Supabase Storage buckets:
   - `product-images` (private, admin-only or public depending on content strategy)
   - `category-images` 
   - `article-images`
3. Configure RLS on storage buckets
4. Upload existing product images to Storage (if migrating from external URLs)
5. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in hosting environment
6. Deploy Phase 20 build
