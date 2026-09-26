// ============================================================
// Payment domain types — Slice 24
//
// These types define the payment domain model independent of any
// specific provider. They are used by the payment abstraction,
// checkout, admin, and database layers.
//
// IMPORTANT: metadata MUST NOT contain API keys, consumer secrets,
// Stripe secret keys, access tokens, webhook secrets, passwords,
// or authorization headers. Only non-sensitive provider metadata
// may be stored.
// ============================================================

export type PaymentProvider = "mpesa" | "stripe";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded";

export type Payment = {
  id: string;
  order_id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference_number: string;
  provider_reference: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

// --- Provider-specific metadata types ---
// These describe the shape of safe, non-sensitive metadata that may
// be stored in the payments.metadata JSONB column.

export type MpesaMetadata = {
  /** M-Pesa checkout request ID (from STK Push response) */
  checkout_request_id?: string;
  /** M-Pesa merchant request ID */
  merchant_request_id?: string;
  /** M-Pesa result code (0 = success) */
  result_code?: number;
  /** M-Pesa result description */
  result_description?: string;
  /** Phone number used for the transaction (masked in logs) */
  phone_number?: string;
  /** M-Pesa transaction date (format: YYYYMMDDHHmmss) */
  transaction_date?: string;
};

export type StripeMetadata = {
  /** Stripe PaymentIntent ID */
  payment_intent_id?: string;
  /** Stripe PaymentIntent status */
  payment_intent_status?: string;
  /** Stripe charge ID */
  charge_id?: string;
  /** Stripe receipt URL */
  receipt_url?: string;
  /** Stripe payment method type */
  payment_method_type?: string;
};

// --- Payment initiation request (used by checkout) ---

export type InitiatePaymentRequest = {
  order_id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  /** Provider-specific extra data (e.g. phone number for M-Pesa) */
  provider_data?: Record<string, unknown>;
};

// --- Payment status update (used by webhooks/admin) ---

export type PaymentStatusUpdate = {
  payment_id: string;
  status: PaymentStatus;
  provider_reference?: string;
  metadata?: Record<string, unknown>;
};

// --- Webhook event types ---

export type MpesaWebhookEvent = {
  type: "initiated" | "completed" | "failed" | "cancelled";
  checkout_request_id: string;
  merchant_request_id?: string;
  result_code?: number;
  result_description?: string;
  amount?: number;
  phone_number?: string;
  transaction_date?: string;
};

export type StripeWebhookEvent = {
  type:
    | "payment_intent.created"
    | "payment_intent.succeeded"
    | "payment_intent.payment_failed"
    | "payment_intent.canceled"
    | "charge.refunded";
  payment_intent_id: string;
  amount?: number;
  currency?: string;
  status?: string;
  charge_id?: string;
  receipt_url?: string;
};

export type WebhookEvent = MpesaWebhookEvent | StripeWebhookEvent;
