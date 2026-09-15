"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { checkSubmissionRateLimit, RATE_LIMIT_SCENES } from "@/lib/rate-limit";
import { sendEnquiryNotification } from "@/lib/enquiry-notify";
import { logAudit } from "@/lib/audit";
import { isValidEmail } from "@/lib/email-validation";

export type EnquiryFormState = {
  error?: string;
  success?: boolean;
  warning?: string;
};

// Enquiry-specific budget, deliberately above the order path's 5/min: the
// enquiry form is a casual single-shot form and someone may legitimately send
// a couple of quick questions in a row. 8 per 60s per IP is still far below
// automated-burst throughput, which was the audit's concern (Finding C3:
// unbounded rows + unbounded Resend emails). Both this value and the order
// path's default are enforced by the same in-process fixed-window limiter.
const ENQUIRY_WINDOW_MS = 60_000;
const ENQUIRY_MAX_ATTEMPTS = 8;

export async function submitEnquiryAction(
  _prev: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  // Rate limit before any work, mirroring the order path: a clear non-crash
  // rejection instead of silently accepting writes/emails under a burst.
  const rateLimit = await checkSubmissionRateLimit({
    scene: RATE_LIMIT_SCENES.enquiry,
    windowMs: ENQUIRY_WINDOW_MS,
    maxAttempts: ENQUIRY_MAX_ATTEMPTS,
  });
  if (!rateLimit.allowed) {
    return {
      error: `Too many messages. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("organisation") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const type = String(formData.get("type") ?? "").trim();
  const productContext = String(formData.get("product_context") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Please tell us your name." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email." };
  if (!type) return { error: "Please choose an enquiry type." };
  if (!message) return { error: "Please add a brief message." };

  const finalMessage = productContext
    ? `${productContext}\n\n${message}`
    : message;

  // M2 (Slice 10) — the insert runs as the trusted server-side role, not anon.
  // The browser can no longer call PostgREST directly on enquiries (anon /
  // authenticated INSERT revoked + permissive policy removed), so the
  // validation, rate limiting and audit above are the ONLY path into the table.
  const supabase = await createServiceRoleClient();
  if (!supabase) {
    return { error: "We could not send your message right now. Please try again or email us directly." };
  }
  const { error } = await supabase.from("enquiries").insert({
    name,
    email,
    company,
    phone,
    type,
    message: finalMessage,
  });

  if (error) {
    return { error: "We could not send your message. Please try again or email us directly." };
  }

  // M3 — audit only a successfully-inserted enquiry, with minimal metadata (no
  // enquiry body, name, email, phone, or other PII). Best-effort: an audit
  // write failure must never surface as a submission error after the row
  // exists, nor block the notification email. The enquiry id cannot be
  // returned to the public insert (no anon SELECT policy on enquiries), so
  // entity_id stays null.
  try {
    await logAudit({
      action: "enquiry_submitted",
      entity: "enquiries",
      entity_id: null,
      details: { type },
    });
  } catch {
    console.warn("[enquiry] audit not recorded");
  }

  const notification = await sendEnquiryNotification({
    name,
    email,
    company,
    phone,
    type,
    productContext,
    message: finalMessage,
    submittedAt: new Date().toISOString(),
  });

  if (!notification.sent) {
    console.warn("[enquiry] notification not sent:", notification.reason, "error" in notification ? notification.error : "");
  }

  return { success: true };
}
