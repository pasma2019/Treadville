// ============================================================
// Payment provider abstraction — Slice 24
//
// Defines a common interface that checkout and order business
// logic depend on, preventing direct coupling to M-Pesa or
// Stripe. Future providers can be added by implementing this
// interface without rewriting storefront checkout code.
//
// DO NOT implement live provider calls in this slice.
// All methods return typed "not implemented" results until
// Eunice provides actual credentials and live integration
// is explicitly authorized.
// ============================================================

import type {
  PaymentProvider,
  PaymentStatus,
  InitiatePaymentRequest,
  Payment,
} from "@/lib/types/payment";

// --- Provider capability description ---

export type ProviderCapabilities = {
  provider: PaymentProvider;
  label: string;
  supportedCurrencies: string[];
  supportedStatuses: PaymentStatus[];
  /** Whether the provider is fully configured and ready for live use */
  available: boolean;
  /** Human-readable reason if not available */
  unavailableReason?: string;
};

// --- Payment initiation result ---

export type PaymentInitiationResult =
  | {
      success: true;
      payment: Payment;
      /** Provider-specific data needed to complete the flow (e.g. STK Push prompt) */
      providerFlow?: Record<string, unknown>;
    }
  | {
      success: false;
      error: string;
    };

// --- Provider interface ---

export interface PaymentProviderHandler {
  /** Provider identifier */
  readonly provider: PaymentProvider;

  /** Human-readable label */
  readonly label: string;

  /** Check if this provider is fully configured and available */
  getCapabilities(): ProviderCapabilities;

  /**
   * Initiate a payment. Returns a result indicating whether the
   * initiation was successful and what the next step should be.
   *
   * In this slice, this always returns a "not implemented" result.
   */
  initiatePayment(request: InitiatePaymentRequest): Promise<PaymentInitiationResult>;

  /**
   * Get the current status of a payment by its ID.
   *
   * In this slice, this always returns a "not configured" result.
   */
  getPaymentStatus(paymentId: string): Promise<Payment | null>;
}

// --- Provider registry ---

const registry = new Map<PaymentProvider, PaymentProviderHandler>();

export function registerPaymentProvider(handler: PaymentProviderHandler): void {
  registry.set(handler.provider, handler);
}

export function getPaymentProvider(provider: PaymentProvider): PaymentProviderHandler | undefined {
  return registry.get(provider);
}

export function getAllPaymentProviders(): PaymentProviderHandler[] {
  return Array.from(registry.values());
}

export function getAvailableProviders(): PaymentProviderHandler[] {
  return getAllPaymentProviders().filter(
    (h) => h.getCapabilities().available
  );
}
