"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEnquiryNotification } from "@/lib/enquiry-notify";

export type EnquiryFormState = {
  error?: string;
  success?: boolean;
  warning?: string;
};

export async function submitEnquiryAction(
  _prev: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const company = String(formData.get("organisation") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const type = String(formData.get("type") ?? "").trim();
  const productContext = String(formData.get("product_context") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { error: "Please tell us your name." };
  if (!email || !email.includes("@")) return { error: "Please enter a valid email." };
  if (!type) return { error: "Please choose an enquiry type." };
  if (!message) return { error: "Please add a brief message." };

  const finalMessage = productContext
    ? `${productContext}\n\n${message}`
    : message;

  const supabase = await createClient();
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
