// ============================================================
// M-Pesa Daraja scaffolding — Slice 24
//
// This module defines typed function contracts for the eventual
// M-Pesa Daraja integration. NO HTTP requests are made. NO
// Daraja API endpoints are called.
//
// REQUIRES: Eunice's actual M-Pesa/Daraja production
// configuration, including the approved merchant/till/paybill
// details, consumer key/secret and passkey.
//
// Safaricom's official Daraja platform is the eventual
// integration source. Do not copy undocumented assumptions
// into the implementation.
// ============================================================

import type { Payment, InitiatePaymentRequest } from "@/lib/types/payment";
import type { PaymentProviderHandler, ProviderCapabilities, PaymentInitiationResult } from "@/lib/payment-providers";
import { getMpesaConfig } from "@/lib/payment-config";

// --- STK Push request/response types ---

export type STKPushRequest = {
  /** Phone number in format 254XXXXXXXXX */
  phoneNumber: string;
  /** Amount to charge */
  amount: number;
  /** Order reference for tracking */
  orderReference: string;
  /** Shortcode/Till/Paybill to pay */
  accountReference: string;
};

export type STKPushResponse = {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
};

export type DarajaCallbackResult = {
  /** 0 = success, non-zero = failure */
  ResultCode: number;
  ResultDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  /** Present on success */
  Amount?: number;
  MpesaReceiptNumber?: string;
  TransactionDate?: string;
  PhoneNumber?: string;
};

// --- Typed function contracts ---

/**
 * Initiate an M-Pesa STK Push request.
 *
 * In this slice, this function is a scaffold that throws.
 * It will be implemented when Eunice provides Daraja credentials.
 *
 * REQUIRES: Eunice's actual M-Pesa/Daraja production configuration,
 * including the approved merchant/till/paybill details, consumer
 * key/secret and passkey. Safaricom's official Daraja platform is
 * the eventual integration source.
 */
export async function initiateSTKPush(
  _request: STKPushRequest
): Promise<STKPushResponse> {
  // Not implemented — M-Pesa credentials required
  throw new Error(
    "Not implemented — M-Pesa Daraja credentials required. " +
    "REQUIRES: Eunice's actual M-Pesa/Daraja production configuration."
  );
}

/**
 * Handle a Daraja STK Push callback result.
 *
 * In this slice, this function is a scaffold that returns null.
 * It will be implemented when Eunice provides Daraja credentials.
 *
 * REQUIRES: Eunice's actual M-Pesa/Daraja production configuration.
 */
export async function handleDarajaCallback(
  _merchantRequestId: string,
  _resultCode: number,
  _resultDescription: string
): Promise<Payment | null> {
  // Not implemented — M-Pesa credentials required
  console.warn("[mpesa] handleDarajaCallback called but M-Pesa is not configured");
  return null;
}

/**
 * Verify the status of an M-Pesa transaction by CheckoutRequestID.
 *
 * In this slice, this function is a scaffold that returns null.
 * It will be implemented when Eunice provides Daraja credentials.
 *
 * REQUIRES: Eunice's actual M-Pesa/Daraja production configuration.
 */
export async function verifyPaymentStatus(
  _checkoutRequestId: string
): Promise<Payment | null> {
  // Not implemented — M-Pesa credentials required
  console.warn("[mpesa] verifyPaymentStatus called but M-Pesa is not configured");
  return null;
}

// --- Provider handler implementation ---

export class MpesaPaymentHandler implements PaymentProviderHandler {
  readonly provider = "mpesa" as const;
  readonly label = "M-Pesa";

  getCapabilities(): ProviderCapabilities {
    const config = getMpesaConfig();
    return {
      provider: "mpesa",
      label: "M-Pesa",
      supportedCurrencies: ["KES"],
      supportedStatuses: ["pending", "processing", "completed", "failed", "cancelled"],
      available: config.enabled && !!(
        config.consumerKey &&
        config.consumerSecret &&
        config.passkey &&
        (config.shortcode || config.tillNumber || config.paybillNumber)
      ),
      unavailableReason: !config.enabled
        ? "M-Pesa is disabled. Set PAYMENT_MPESA_ENABLED=true and provide all required credentials."
        : "M-Pesa credentials are incomplete. All of consumer key, consumer secret, passkey, and at least one of shortcode/till/paybill are required.",
    };
  }

  async initiatePayment(
    _request: InitiatePaymentRequest
  ): Promise<PaymentInitiationResult> {
    return {
      success: false,
      error:
        "M-Pesa payment initiation is not yet implemented. " +
        "REQUIRES: Eunice's actual M-Pesa/Daraja production configuration.",
    };
  }

  async getPaymentStatus(_paymentId: string): Promise<Payment | null> {
    console.warn("[mpesa] getPaymentStatus called but M-Pesa is not configured");
    return null;
  }
}
