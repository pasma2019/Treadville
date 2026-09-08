# PHASE 19 — COMMERCE FOUNDATION

**Date:** Phase 19, Step 16
**Scope:** Future M-Pesa / Daraja and payment data model documentation.
**Status:** Documented only. No payment processing implemented.

---

## 1. Why This Document Exists

Treadville intends to accept M-PESA payments via Safaricom's Daraja API. This document:

- Documents the future payment data model.
- Establishes architectural boundaries now so the implementation is safe.
- Records what is **not** being shipped in Phase 19.

**No payment code exists in the prototype today.** No live Daraja call has been made. No M-PESA secret is stored anywhere in the repository. No transaction has been fabricated.

---

## 2. Future Data Model (Documented, Not Built)

### 2.1 `orders`
Records a customer's intent to purchase.

| Field | Type | Notes |
|---|---|---|
| id | uuid pk | gen_random_uuid() |
| user_id | uuid fk → auth.users | nullable for guest checkout |
| status | text | `pending` / `awaiting_payment` / `paid` / `failed` / `cancelled` / `fulfilled` / `refunded` |
| total | numeric(12,2) | sum of line items |
| currency | text | ISO 4217, default "KES" |
| customer_email | text | snapshot at time of order |
| customer_name | text | snapshot at time of order |
| customer_phone | text | E.164-ish, e.g. +2547XXXXXXXX |
| shipping_address | jsonb | nullable for digital/sample orders |
| notes | text | customer-supplied |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### 2.2 `order_items`
Line items on an order.

| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| order_id | uuid fk → orders(id) | cascade delete |
| product_id | uuid fk → products(id) | restrict on delete |
| quantity | integer | > 0 |
| unit_price | numeric(12,2) | snapshot |
| line_total | numeric(12,2) | qty * unit |

### 2.3 `payments`
Records a payment attempt against an order.

| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| order_id | uuid fk → orders(id) | |
| provider | text | `mpesa_daraja`, `stripe`, `manual` |
| provider_payment_id | text | Daraja CheckoutRequestID, Stripe pi_..., etc. |
| method | text | `stk_push`, `c2b`, `card`, etc. |
| amount | numeric(12,2) | |
| currency | text | |
| status | text | `initiated` / `pending` / `succeeded` / `failed` / `refunded` |
| initiated_at | timestamptz | |
| completed_at | timestamptz | nullable |
| raw_response | jsonb | last provider response for debugging |

### 2.4 `payment_events`
Immutable log of webhook/notification events from the payment provider.

| Field | Type | Notes |
|---|---|---|
| id | uuid pk | |
| payment_id | uuid fk → payments(id) | nullable (event may arrive before link) |
| provider | text | |
| event_type | text | Daraja: `stk_push.success`, `c2b.confirmation`, `b2c.result`, `timeout` |
| raw_payload | jsonb | entire body for replay/debugging |
| received_at | timestamptz | default now() |
| processed | boolean | default false |
| process_error | text | nullable |

### 2.5 RLS for future tables (when built)
- `orders`, `order_items`, `payments`, `payment_events` — read self for authenticated users, write self; admin read/write all.
- No public read of any payment row.
- `payment_events.raw_payload` is admin-only (read). This may contain PII and should not leak.

### 2.6 Indexes (when built)
- `orders(user_id, created_at desc)` — customer's order history.
- `orders(status)` where `status in ('awaiting_payment', 'paid')` — admin queue.
- `payments(provider, provider_payment_id)` unique — idempotency.
- `payments(order_id)` — fetch by order.
- `payment_events(received_at desc)` — admin log scroll.

---

## 3. Daraja Architecture

### 3.1 Trust boundary

```
   ┌──────────────┐      HTTPS       ┌──────────────────────────┐
   │  Browser /   │ ───────────────▶ │  Treadville server (Next)│
   │  Admin       │                  │  /api/payments/daraja/...│
   └──────────────┘                  └──────────┬───────────────┘
                                                │
                                       (service role, server-only)
                                                │
                                                ▼
                                     ┌──────────────────────┐
                                     │  Safaricom Daraja API│
                                     └──────────────────────┘
```

The browser **never** speaks to Daraja. The browser speaks to Treadville's server. Treadville's server (with service-role credentials and Daraja secrets in environment variables) speaks to Daraja.

### 3.2 Required environment variables (not yet in `.env.local.example`)

```
DARAJA_CONSUMER_KEY=...
DARAJA_CONSUMER_SECRET=...
DARAJA_SHORTCODE=...
DARAJA_PASSKEY=...
DARAJA_ENVIRONMENT=sandbox   # sandbox | live
DARAJA_CALLBACK_URL=https://treadville.co.ke/api/payments/daraja/callback
```

These are **never** prefixed with `NEXT_PUBLIC_*`. They live only in:
- `.env.local` (not committed)
- Hosting environment (e.g. Vercel project settings)

They are read **only** in server-side code (Server Actions, Route Handlers, or scheduled tasks).

### 3.3 Future STK Push flow

```
1. Customer clicks "Pay with M-PESA" on /checkout
2. Browser POSTs to Treadville server (Server Action or Route Handler)
3. Server validates the order, inserts `payments` row (status=initiated)
4. Server calls Daraja /mpesa/stkpush/v1/processrequest
5. Daraja returns CheckoutRequestID
6. Server updates payments.status = pending
7. Server returns CheckoutRequestID to browser
8. Customer sees M-PESA prompt on their phone
9. Customer enters PIN
10. Safaricom calls back DARAJA_CALLBACK_URL with result
11. Server verifies the callback (HMAC or IP whitelist, TBD)
12. Server inserts payment_events row
13. Server updates payments.status = succeeded/failed
14. Server updates orders.status
15. Server triggers order fulfilment
```

### 3.4 Future C2B flow (for retail paybill)

```
1. Customer pays to Treadville paybill
2. Daraja sends validation request to /api/payments/daraja/validate
3. Server responds with allowed/denied
4. Daraja sends confirmation to /api/payments/daraja/confirmation
5. Server records the payment and reconciles with open orders
```

### 3.5 What the prototype does NOT do

- The prototype does **not** call Daraja.
- The prototype does **not** store M-PESA secrets anywhere.
- The prototype does **not** accept live payments of any kind.
- The prototype does **not** fabricate fake payment confirmations.
- The `/checkout` page exists but does not process payment.

---

## 4. Admin Integrations Page

The admin has a `/admin/integrations` page (Phase 19 Step 15) that:

- Shows the required Daraja env-var names.
- Reports `Configured` / `Not configured` per integration.
- **Never** displays the actual secret values. The page only ever shows `••••••••••••••••` for configured secrets.
- Has a clear "Security notice" section explaining the trust boundary.

This surface is intentionally read-only in Phase 19. Configuration happens in the environment, not in the admin UI. Future phases may add an admin write surface for sandbox/live switching, but that requires:

- Encrypted storage of secrets (e.g. Supabase Vault).
- Audit-logging every secret read/write.
- Multi-party approval (System Admin + Owner) for live mode.

---

## 5. Architectural Boundaries Established Now

| Boundary | Implementation |
|---|---|
| Browser cannot see Daraja secrets | All `DARAJA_*` env vars are not `NEXT_PUBLIC_*` |
| Server-only files are isolated | `lib/supabase/server.ts` is not importable from client |
| Service-role key never reaches the browser | `createServiceRoleClient()` returns `null` if env var is missing |
| Audit log writes are service-role only | `audit_log` has no INSERT policy for the anon/authenticated role; only the server-side service-role client can write |
| Admin pages require server-side session | `app/admin/layout.tsx` calls `requireAdmin()` server-side; proxy.ts refreshes cookies |
| Server Actions re-check auth | Every Server Action calls `requireAdmin()` or `requireRole()` before any mutation |

---

## 6. Future Phases (Not Phase 19)

- `orders` table and Server Actions for checkout
- `payments` table and Daraja STK Push integration
- C2B validation/confirmation endpoints
- Order admin UI in `/admin/commerce/orders`
- Receipts / invoices
- Refund flow
- Webhook replay protection
- Customer accounts on the storefront
- Stripe integration (card payments, optional)

Each will be its own design phase with its own audit and review.
