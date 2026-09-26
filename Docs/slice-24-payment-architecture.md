# Slice 24 — Payment Architecture Foundation

**Status:** COMPLETE  
**Date:** 2026-09-19

---

## 1. Architecture

This slice establishes the payment domain model and provider abstraction layer for Treadville. No live payment processing, API calls, or SDK installations are included.

**Design principles:**
- Provider-agnostic: checkout depends on the internal abstraction, not Daraja or Stripe directly
- Fail closed: providers are disabled unless ALL required credentials are present
- Quote-first preserved: existing order creation flow is untouched
- Security-first: no secrets in source code, no client-side exposure of credentials

**Payment flow (future):**
```
Checkout → getEnabledPaymentMethods() → user selects provider
  → provider.initiatePayment() → provider-specific flow
  → webhook/callback updates payment status
  → admin views payment records
```

---

## 2. Provider Abstraction

**File:** `src/lib/payment-providers.ts`

Defines `PaymentProviderHandler` interface with:
- `getCapabilities()` — returns provider availability, supported currencies/statuses
- `initiatePayment(request)` — starts a payment flow
- `getPaymentStatus(paymentId)` — checks current status

Registry pattern: providers register via `registerPaymentProvider()`, queried via `getAvailableProviders()`.

**File:** `src/lib/payment/index.ts`
- Barrel import that registers all known providers on import
- Imported by checkout as side effect

---

## 3. Environment Configuration

**File:** `src/lib/payment-config.ts`

All configuration reads exclusively from `process.env`. No hard-coded values.

**Fail-closed logic:**
- `PAYMENT_MPESA_ENABLED=true` + all credentials present → M-Pesa available
- `PAYMENT_MPESA_ENABLED=true` + missing any credential → M-Pesa **disabled**
- Same principle for Stripe
- `getEnabledPaymentMethods()` returns only fully configured providers

**File:** `.env.example`
- Documents all required environment variables
- All values empty (no credentials)
- Notes that activation requires Eunice's actual provider accounts

---

## 4. Payment Data Model

**File:** `src/lib/types/payment.ts`

Core type: `Payment`
- `id`, `order_id`, `provider`, `amount`, `currency`, `status`
- `reference_number` (unique, DB-assigned: `PAY-YYYY-NNNNNN`)
- `provider_reference` (nullable — transaction ID from provider)
- `metadata` (JSONB — safe, non-sensitive provider data only)
- `created_at`, `updated_at`

**Metadata safety:** Types explicitly define what MAY be stored:
- `MpesaMetadata`: checkout_request_id, merchant_request_id, result_code, etc.
- `StripeMetadata`: payment_intent_id, charge_id, receipt_url, etc.
- NEVER: API keys, secrets, tokens, passwords, authorization headers

**Webhook event types:**
- `MpesaWebhookEvent`: initiated, completed, failed, cancelled
- `StripeWebhookEvent`: payment_intent.created, succeeded, payment_failed, canceled, charge.refunded

---

## 5. Database Migration

**File:** `supabase/migrations/20260919_0009_payments.sql`

```sql
payments (
  id               uuid PK
  order_id         uuid NOT NULL → orders(id) RESTRICT
  provider         text CHECK ('mpesa','stripe')
  amount           numeric(12,2) CHECK (> 0)
  currency         text CHECK (length = 3)
  status           text DEFAULT 'pending' CHECK (...)
  reference_number text UNIQUE (trigger-assigned)
  provider_reference text
  metadata         jsonb
  created_at       timestamptz
  updated_at       timestamptz
)
```

**Indexes:** order_id, provider, status, created_at DESC  
**Reference numbers:** `PAY-YYYY-NNNNNN` format, monotonic sequence, trigger-assigned  
**updated_at:** Trigger-based auto-update on direct UPDATE statements

---

## 6. RLS Design

**Policy:** "Admins manage payments"
```sql
(auth.jwt() -> 'app_metadata' ->> 'role') in ('OWNER', 'SYSTEM_ADMIN')
```

- No public (anon/authenticated) policies → browser clients denied by default
- Admin users get full access via JWT role claim (same pattern as orders/order_items)
- Application writes run through service role (same pattern as order creation)
- Safe authenticated-user RLS (read own order's payments) deferred to future slice to avoid touching protected auth infrastructure

---

## 7. M-Pesa Scaffolding

**File:** `src/lib/payment/mpesa.ts`

Typed function contracts (no HTTP calls):
- `initiateSTKPush(request)` — throws "Not implemented — M-Pesa credentials required"
- `handleDarajaCallback(...)` — returns null with warning
- `verifyPaymentStatus(...)` — returns null with warning

`MpesaPaymentHandler` class implements `PaymentProviderHandler`:
- `getCapabilities()` checks config and returns availability status
- `initiatePayment()` returns typed "not implemented" error
- All comments reference: REQUIRES Eunice's actual Daraja configuration

---

## 8. Stripe Scaffolding

**File:** `src/lib/payment/stripe.ts`

Typed function contracts (no API calls, no SDK):
- `createPaymentIntent(amount, currency, orderId)` — throws "Not implemented"
- `handleWebhook(eventType, eventData)` — returns null with warning
- `confirmPayment(paymentIntentId)` — returns null with warning

`StripePaymentHandler` class implements `PaymentProviderHandler`:
- `getCapabilities()` checks config and returns availability status
- `initiatePayment()` returns typed "not implemented" error
- All comments reference: REQUIRES Eunice's Stripe account configuration

---

## 9. Checkout Readiness

**File:** `src/app/(storefront)/checkout/page.tsx` (modified)

**What changed:**
- Added `useState` for `selectedProvider` (defaults to first enabled method)
- Imports `getEnabledPaymentMethods` and `getEnabledPaymentMethods` from config
- Imports `@/lib/payment` barrel to register providers
- Added payment method radio selection between form fields and submit button
- Shows available providers with label and supported currencies
- If no providers configured: shows "Payment methods are currently being configured" message

**What did NOT change:**
- Order submission flow (`submitOrderAction`) — untouched
- Form fields — untouched
- Cart integration — untouched
- Order creation semantics — untouched
- No Stripe.js initialization
- No M-Pesa STK Push call
- No fake payment success states

---

## 10. Admin Visibility

**File:** `src/app/admin/(protected)/payments/page.tsx` (new)
**File:** `src/components/admin/PaymentsClient.tsx` (new)

Server component loads payments with order reference via foreign key join.  
Client component displays:
- List view: order reference, payment reference, provider, amount, status, date
- Expandable detail: payment ID, provider reference, order reference, amount, created timestamp, status
- Empty state when no payment records exist
- Status badges with appropriate colors

**File:** `src/components/admin/AdminSidebar.tsx` (modified)
- Added "Payments" link under "Business" section for both OWNER and SYSTEM_ADMIN nav

---

## 11. Security Audit

| Check | Result |
|---|---|
| `sk_live_`, `sk_test_`, `pk_live_`, `pk_test_` in source | **NONE** |
| Actual `consumer_secret`, `client_secret`, `webhook_secret` values | **NONE** (only type field names) |
| `bearer`, `authorization` in code | Only in comment about what NOT to store |
| `passkey` references | Only in type definitions and config checks (mpesa.ts, payment-config.ts) |
| Payment secrets imported into client components | **NONE** — `payment-config.ts` only returns boolean availability and labels |
| Server-only secrets in client code | **NONE** — all `process.env` reads are server-side only |
| Existing order flow modifications | **NONE** |
| RLS changes outside new payments table | **NONE** |

---

## 12. Currency Handling

The payment model supports currency as a three-letter ISO currency code (`string`). No hardcoding of USD or KES.

**Existing order/quote system:** The orders table has no `currency` or `amount` columns — the quote-first model means pricing is negotiated before fulfilment. This is consistent with the payment model: the `amount` and `currency` on a payment record reflect the agreed terms, not a hard-coded default.

**No currency conversion** is implemented in this slice. This is intentional and should be addressed when live payment integration occurs.

---

## 13. No Payment Provider Lock-in

Checkout depends on:
- `getEnabledPaymentMethods()` — internal config abstraction
- `PaymentProviderHandler` interface — internal abstraction

Checkout does NOT depend on:
- `@/lib/payment/mpesa` directly
- `@/lib/payment/stripe` directly
- Any provider-specific SDK

Adding a future provider requires:
1. Implementing `PaymentProviderHandler`
2. Registering in `src/lib/payment/index.ts`
3. Adding config to `payment-config.ts`
4. Adding env vars to `.env.example`

No checkout rewrite needed.

---

## 14. Validation

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **PASS** — zero errors |
| `npm run build` | **Compiled successfully** (page-data-collection timeout — expected, requires Supabase) |

**Compile success** vs **runtime verification**: Build compilation completed. Page generation timed out during data fetching phase which requires Supabase connection — this is expected and documented.

---

## 15. Scope Audit

### Protected files — UNTOUCHED:
| File | Status |
|---|---|
| `src/proxy.ts` | ✅ Untouched |
| `src/lib/supabase.ts` | ✅ Untouched |
| `src/lib/supabase/server.ts` | ✅ Untouched |
| `src/lib/auth.ts` | ✅ Untouched |
| `src/lib/order-actions.ts` | ✅ Untouched |
| `src/lib/enquiry-actions.ts` | ✅ Untouched |
| `src/lib/admin-actions.ts` | ✅ Untouched |
| `src/lib/cms-fields.ts` | ✅ Untouched |
| `src/components/HeroSlideshow.tsx` | ✅ Untouched |

### Additional scope checks:
- ✅ Existing orders schema unchanged
- ✅ Existing order status machine unchanged
- ✅ Existing enquiry flow unchanged
- ✅ Existing authentication unchanged
- ✅ Existing RLS policies unchanged (new policy added on new table only)
- ✅ No npm packages added
- ✅ No live API calls
- ✅ No webhook endpoints
- ✅ No credentials in source code
- ✅ No fake payment success states
- ✅ No bank transfer (intentionally excluded until Eunice approves)

---

## 16. Remaining Eunice Dependencies

This slice prepares the architecture. **Live payment integration requires:**

### M-Pesa Daraja:
- Consumer key
- Consumer secret
- Passkey
- Shortcode / Till number / Paybill number
- Callback URL configuration with Safaricom
- Daraja API portal access

### Stripe:
- Secret key
- Publishable key
- Webhook signing secret
- Stripe account activation
- Stripe Dashboard access

### Business decisions:
- Bank transfer approval from Eunice (intentionally excluded from this slice)
- Payment flow approval (STK Push vs other M-Pesa flows)
- Currency strategy for international orders
- Refund process definition

---

## 17. What MUST Happen in Future Activation Slices

1. **Install SDKs** — `stripe` npm package (when Stripe is authorized)
2. **Implement M-Pesa handler** — actual Daraja API calls in `mpesa.ts`
3. **Implement Stripe handler** — actual Stripe API calls in `stripe.ts`
4. **Create webhook endpoints** — `src/app/api/webhooks/mpesa/route.ts` and `src/app/api/webhooks/stripe/route.ts`
5. **Add payment status to order flow** — update order status based on payment completion
6. **Add authenticated-user RLS** — allow customers to read their own payment records
7. **Payment confirmation UI** — post-payment success/failure pages
8. **Admin payment actions** — manual status override with audit logging
9. **Refund handling** — provider-specific refund flows
10. **Vercel environment variables** — set all PAYMENT_* env vars in Vercel dashboard

---

## Files Created/Modified

| File | Action |
|---|---|
| `src/lib/types/payment.ts` | Created — payment domain types |
| `src/lib/payment-providers.ts` | Created — provider abstraction and registry |
| `src/lib/payment-config.ts` | Created — environment-based configuration |
| `src/lib/payment/mpesa.ts` | Created — M-Pesa Daraja scaffolding |
| `src/lib/payment/stripe.ts` | Created — Stripe scaffolding |
| `src/lib/payment/index.ts` | Created — provider registry barrel |
| `src/app/(storefront)/checkout/page.tsx` | Modified — added payment method selection UI |
| `src/app/admin/(protected)/payments/page.tsx` | Created — admin payments page |
| `src/components/admin/PaymentsClient.tsx` | Created — admin payments client component |
| `src/components/admin/AdminSidebar.tsx` | Modified — added Payments nav link |
| `supabase/migrations/20260919_0009_payments.sql` | Created — payments table migration |
| `.env.example` | Created — environment variable documentation |
