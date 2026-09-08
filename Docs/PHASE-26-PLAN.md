# PHASE 26 — PLAN: PRODUCTION ACTIVATION + CONVERSION SYSTEM

**Date:** Phase 26 plan
**Status:** Based on Phase 26 audit

---

## 1. AUDIT FINDINGS SUMMARY

### CRITICAL Gaps Found
1. **`NEXT_PUBLIC_SITE_URL`** — used server-side in `admin-actions.ts` for Supabase invite redirect. Not set. Causes broken admin invite emails.
2. **No email notification** — enquiries save to DB but no email to business.
3. **No analytics** — no way to measure traffic or conversion.

### What needs to change

| Priority | Item | Approach |
|---|---|---|
| CRITICAL | `NEXT_PUBLIC_SITE_URL` gap | Add to `.env.example`, document Vercel requirement |
| HIGH | Email notification | Resend — clean server-side send after DB insert |
| HIGH | Analytics | `@vercel/analytics` — minimal, privacy-preserving |
| DOCUMENT | Supabase checklist | Manual steps for Pascal |
| DOCUMENT | Production QA matrix | Test plan |

---

## 2. EMAIL NOTIFICATION — IMPLEMENTATION

### Approach
- Use `resend` package (minimal, well-maintained, Node 20 compatible)
- Server-only send in `submitEnquiryAction` — never in browser
- Email failure is non-blocking: DB insert succeeds → success response → background notification attempt → log warning if fails
- No email dependency in UI — form always succeeds if DB insert succeeds

### Flow
```
FormData
  ↓
submitEnquiryAction (Server Action)
  ↓
Validate fields
  ↓
DB insert (enquiries table)
  ↓ [on success]
sendEnquiryNotification(payload)
  ↓ [non-blocking]
return { success: true }  ← user sees this regardless of email result
```

### Email design
- Branded HTML email matching Treadville aesthetic (dark volcanic, bone, bronze)
- Plain text fallback
- Includes: name, email, company, phone, type, product context, message, timestamp
- CTA buttons: Reply to customer + View website
- No sensitive data in email logs

### Environment variables
```env
RESEND_API_KEY=              # From resend.com
ENQUIRY_NOTIFICATION_EMAIL=  # info@treadville.co.ke
ENQUIRY_FROM_EMAIL=          # noreply@treadville.co.ke (verified domain)
```

---

## 3. ANALYTICS — IMPLEMENTATION

### Approach
- `@vercel/analytics` — zero-config, privacy-preserving, minimal bundle
- Page views tracked automatically
- Custom events: `enquiry_submitted`, `product_enquiry_started`, `product_enquiry_loaded`
- No PII sent to analytics

### Events
| Event | Properties | PII? |
|---|---|---|
| Page views | Auto | No |
| `product_enquiry_started` | `product_slug` | No |
| `product_enquiry_loaded` | `product_slug` | No |
| `enquiry_submitted` | `type`, `has_product` | No |

### Privacy
- No email addresses
- No names
- No phone numbers
- No message content
- No enquiry data

---

## 4. `NEXT_PUBLIC_SITE_URL` FIX

- Already added to `.env.local.example` in Phase 26
- Document requirement: must be set in Vercel dashboard
- Value: `https://treadville.co.ke`

---

## 5. VERIFICATION PLAN

### TypeScript
`npx tsc --noEmit` → 0 errors

### Build
`npm run build` → passes, all routes intact

### Functional
- Enquiry submission → DB record + (if Resend configured) email sent
- Email failure → DB success + warning log + user sees success
- Analytics page view → visible in Vercel dashboard
- Analytics custom events → visible in Vercel dashboard
- Admin invite email → correct redirect URL

---

## 6. PRESERVE

- All 31 existing routes
- All Phase 22-25 functionality
- RLS + auth architecture
- Supabase client separation
- Product metadata system
- Tiptap journal CMS
- SEO infrastructure
- Brand assets

---

## 7. NOT IN SCOPE

- Payment integration
- Customer accounts
- Advanced search
- Multi-vendor
- Complex analytics (GA4 event customization beyond basic)
- Email templates beyond enquiry notification
- WhatsApp/CRM integration
