// ============================================================
// Payment configuration — Slice 24
//
// All payment configuration is read exclusively from environment
// variables. No values are hard-coded. No secrets appear in
// source code.
//
// REQUIRES: Eunice's actual payment-provider credentials and
// configuration for both M-Pesa Daraja and Stripe.
// ============================================================

import type { PaymentProvider } from "@/lib/types/payment";

// --- Raw environment variable readers ---

function env(key: string): string | undefined {
  return process.env[key] || undefined;
}

function envEnabled(key: string): boolean {
  return process.env[key] === "true";
}

// --- M-Pesa configuration ---

export type MpesaConfig = {
  enabled: boolean;
  consumerKey: string | undefined;
  consumerSecret: string | undefined;
  passkey: string | undefined;
  shortcode: string | undefined;
  tillNumber: string | undefined;
  paybillNumber: string | undefined;
  callbackUrl: string | undefined;
};

export function getMpesaConfig(): MpesaConfig {
  return {
    enabled: envEnabled("PAYMENT_MPESA_ENABLED"),
    consumerKey: env("PAYMENT_MPESA_CONSUMER_KEY"),
    consumerSecret: env("PAYMENT_MPESA_CONSUMER_SECRET"),
    passkey: env("PAYMENT_MPESA_PASSKEY"),
    shortcode: env("PAYMENT_MPESA_SHORTCODE"),
    tillNumber: env("PAYMENT_MPESA_TILL_NUMBER"),
    paybillNumber: env("PAYMENT_MPESA_PAYBILL_NUMBER"),
    callbackUrl: env("PAYMENT_MPESA_CALLBACK_URL"),
  };
}

function isMpesaConfigured(config: MpesaConfig): boolean {
  if (!config.enabled) return false;
  // All core credentials must be present for M-Pesa to function.
  // Fail closed: if any required field is missing, M-Pesa is disabled.
  return !!(
    config.consumerKey &&
    config.consumerSecret &&
    config.passkey &&
    (config.shortcode || config.tillNumber || config.paybillNumber)
  );
}

// --- Stripe configuration ---

export type StripeConfig = {
  enabled: boolean;
  secretKey: string | undefined;
  publishableKey: string | undefined;
  webhookSecret: string | undefined;
};

export function getStripeConfig(): StripeConfig {
  return {
    enabled: envEnabled("PAYMENT_STRIPE_ENABLED"),
    secretKey: env("PAYMENT_STRIPE_SECRET_KEY"),
    publishableKey: env("PAYMENT_STRIPE_PUBLISHABLE_KEY"),
    webhookSecret: env("PAYMENT_STRIPE_WEBHOOK_SECRET"),
  };
}

function isStripeConfigured(config: StripeConfig): boolean {
  if (!config.enabled) return false;
  // All core credentials must be present for Stripe to function.
  // Fail closed: if any required field is missing, Stripe is disabled.
  return !!(
    config.secretKey &&
    config.publishableKey &&
    config.webhookSecret
  );
}

// --- Enabled payment methods ---

export type EnabledPaymentMethod = {
  provider: PaymentProvider;
  label: string;
  /** ISO currency codes this provider supports for Treadville */
  currencies: string[];
};

const MPESA_CURRENCIES = ["KES"];
const STRIPE_CURRENCIES = ["USD", "EUR", "GBP", "KES", "CAD", "AUD"];

export function getEnabledPaymentMethods(): EnabledPaymentMethod[] {
  const methods: EnabledPaymentMethod[] = [];

  const mpesa = getMpesaConfig();
  if (isMpesaConfigured(mpesa)) {
    methods.push({
      provider: "mpesa",
      label: "M-Pesa",
      currencies: MPESA_CURRENCIES,
    });
  }

  const stripe = getStripeConfig();
  if (isStripeConfigured(stripe)) {
    methods.push({
      provider: "stripe",
      label: "Card Payment",
      currencies: STRIPE_CURRENCIES,
    });
  }

  return methods;
}

/**
 * Returns true if at least one payment provider is fully configured
 * and enabled.
 */
export function hasPaymentProvider(): boolean {
  return getEnabledPaymentMethods().length > 0;
}
