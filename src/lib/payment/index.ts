// ============================================================
// Payment provider registry — Slice 24
//
// Registers all available payment providers on import.
// Import this module to ensure providers are registered before
// any code queries the provider registry.
// ============================================================

import { registerPaymentProvider } from "@/lib/payment-providers";
import { MpesaPaymentHandler } from "@/lib/payment/mpesa";
import { StripePaymentHandler } from "@/lib/payment/stripe";

// Register all known providers.
// Each handler self-determines its availability based on config.
registerPaymentProvider(new MpesaPaymentHandler());
registerPaymentProvider(new StripePaymentHandler());
