// ============================================================
// Stripe scaffolding — Slice 24
//
// This module defines typed function contracts for the eventual
// Stripe integration. NO Stripe API calls are made. NO Stripe
// SDK is imported. NO webhook endpoints are created.
//
// REQUIRES: Eunice's Stripe account and production configuration:
//   - secret key
//   - publishable key
//   - webhook signing secret
//
// These must eventually be stored as Vercel environment variables.
// ============================================================

import type { Payment, InitiatePaymentRequest } from "@/lib/types/payment";
import type { PaymentProviderHandler, ProviderCapabilities, PaymentInitiationResult } from "@/lib/payment-providers";
import { getStripeConfig } from "@/lib/payment-config";

// --- Stripe-specific types ---

export type StripePaymentIntent = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  metadata?: Record<string, string>;
};

export type StripeWebhookPayload = {
  type: string;
  data: {
    object: Record<string, unknown>;
  };
};

// --- Typed function contracts ---

/**
 * Create a Stripe PaymentIntent.
 *
 * In this slice, this function is a scaffold that throws.
 * It will be implemented when Eunice provides Stripe credentials
 * and the Stripe SDK is installed.
 *
 * REQUIRES: Eunice's Stripe account and production configuration:
 * secret key, publishable key, webhook signing secret.
 */
export async function createPaymentIntent(
  _amount: number,
  _currency: string,
  _orderId: string
): Promise<StripePaymentIntent> {
  throw new Error(
    "Not implemented — Stripe credentials required. " +
    "REQUIRES: Eunice's Stripe account and production configuration."
  );
}

/**
 * Handle a Stripe webhook event.
 *
 * In this slice, this function is a scaffold that returns null.
 * It will be implemented when Eunice provides Stripe credentials
 * and webhook endpoints are created.
 *
 * REQUIRES: Eunice's Stripe account and production configuration.
 */
export async function handleWebhook(
  _eventType: string,
  _eventData: Record<string, unknown>
): Promise<Payment | null> {
  console.warn("[stripe] handleWebhook called but Stripe is not configured");
  return null;
}

/**
 * Confirm a Stripe PaymentIntent payment.
 *
 * In this slice, this function is a scaffold that returns null.
 * It will be implemented when Eunice provides Stripe credentials.
 *
 * REQUIRES: Eunice's Stripe account and production configuration.
 */
export async function confirmPayment(
  _paymentIntentId: string
): Promise<Payment | null> {
  console.warn("[stripe] confirmPayment called but Stripe is not configured");
  return null;
}

// --- Provider handler implementation ---

export class StripePaymentHandler implements PaymentProviderHandler {
  readonly provider = "stripe" as const;
  readonly label = "Card Payment";

  getCapabilities(): ProviderCapabilities {
    const config = getStripeConfig();
    return {
      provider: "stripe",
      label: "Card Payment",
      supportedCurrencies: ["USD", "EUR", "GBP", "KES", "CAD", "AUD"],
      supportedStatuses: ["pending", "processing", "completed", "failed", "cancelled", "refunded"],
      available: config.enabled && !!(
        config.secretKey &&
        config.publishableKey &&
        config.webhookSecret
      ),
      unavailableReason: !config.enabled
        ? "Stripe is disabled. Set PAYMENT_STRIPE_ENABLED=true and provide all required credentials."
        : "Stripe credentials are incomplete. Secret key, publishable key, and webhook secret are all required.",
    };
  }

  async initiatePayment(
    _request: InitiatePaymentRequest
  ): Promise<PaymentInitiationResult> {
    return {
      success: false,
      error:
        "Stripe payment initiation is not yet implemented. " +
        "REQUIRES: Eunice's Stripe account and production configuration.",
    };
  }

  async getPaymentStatus(_paymentId: string): Promise<Payment | null> {
    console.warn("[stripe] getPaymentStatus called but Stripe is not configured");
    return null;
  }
}
