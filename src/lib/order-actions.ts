"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { checkSubmissionRateLimit } from "@/lib/rate-limit";

export type OrderFormState = {
  error?: string;
  success?: boolean;
  referenceNumber?: string;
};

// Max distinct lines in a single submission — bounds request size and the
// product IN-list. CartContext machines real carts are well below this.
const MAX_LINES = 100;
// Per-line quantity cap. This is an anti-abuse / anti-mis-entry safety bound,
// NOT a commercial limit: it sits orders of magnitude above realistic
// single-line enquiry quantities and blocks absurd/spam payloads. Large
// genuine volumes belong in customer_notes for direct negotiation, consistent
// with the quote-first model. This bound is mirrored in the create_order RPC
// (supabase/migrations/20260909_0002_create_order_rpc.sql), which enforces it
// at the database layer as well. Keep the two in sync.
const MAX_QUANTITY_PER_LINE = 1000;

type CheckoutLineInput = {
  product_id: string;
  quantity: number;
};

export async function submitOrderAction(
  _prev: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  // 1. Rate limit before any work so abuse is throttled with a clear error.
  const rateLimit = await checkSubmissionRateLimit();
  if (!rateLimit.allowed) {
    return {
      error: `Too many attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
    };
  }

  // 2. Validate identity fields. Phone is required in this Server Action even
  //    though the Slice 1 schema allows null — an order we cannot call back on
  //    is not actionable.
  const full_name = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const delivery_location = String(formData.get("delivery_location") ?? "").trim() || null;
  const customer_notes = String(formData.get("customer_notes") ?? "").trim() || null;

  if (!full_name) return { error: "Please enter your full name." };
  if (!email || !email.includes("@")) return { error: "Please enter a valid email address." };
  if (!phone) return { error: "Please enter a phone number so we can reach you." };

  // 3. Parse and bound the cart payload (the memory-only CartContext cart at
  //    submit time). product_id and quantity are the ONLY client-supplied
  //    line item fields we accept.
  const itemsRaw = String(formData.get("items") ?? "").trim();
  const parsed: unknown = (() => {
    try {
      return JSON.parse(itemsRaw);
    } catch {
      return null;
    }
  })();

  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { error: "Your enquiry is empty. Please add products before submitting." };
  }
  if (parsed.length > MAX_LINES) {
    return { error: `Please limit your enquiry to ${MAX_LINES} products.` };
  }

  const items = parsed as CheckoutLineInput[];
  const normalizedItems = items.map((item) => ({
    product_id: typeof item.product_id === "string" ? item.product_id.trim() : "",
    quantity:
      typeof item.quantity === "number" ? item.quantity : Number(item.quantity),
  }));

  for (const line of normalizedItems) {
    if (!line.product_id) {
      return { error: "One of the selected products is invalid. Please remove it and try again." };
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY_PER_LINE) {
      return {
        error: `Quantities must be between 1 and ${MAX_QUANTITY_PER_LINE} per product. Please adjust your selection or add a note for larger volumes.`,
      };
    }
  }

  // 4. Validate products server-side as a fast user-facing check. RLS on
  //    products only exposes status='published' rows to the public client, so
  //    an id that is missing, drafted, or deleted simply won't return — reject
  //    the whole submission. (The create_order RPC repeats this lookup
  //    authoritatively inside its transaction; not redundant, defense-in-depth.)
  const supabase = await createClient();
  const productIds = normalizedItems.map((l) => l.product_id);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name")
    .in("id", productIds);

  if (productsError || !products) {
    console.warn("[order] product validation failed:", productsError?.message ?? "no rows");
    return { error: "We could not verify your product selection. Please try again." };
  }

  const productNameById = new Map(products.map((p) => [p.id, p.name]));
  for (const line of normalizedItems) {
    if (!productNameById.has(line.product_id)) {
      return {
        error: "One or more products in your enquiry are no longer available. Please review your selection and try again.",
      };
    }
  }

  // 5. All persistence — customer reuse/create decision, order insert, and
  //    every line item — runs as ONE call to the atomic create_order RPC
  //    (supabase/migrations/20260909_0002_create_order_rpc.sql). The function
  //    is SECURITY DEFINER, EXECUTE-granted only to service_role, and commits
  //    or rolls back the entire submission in a single transaction, returning
  //    the trigger-generated reference number.
  const serviceSupabase = await createServiceRoleClient();
  if (!serviceSupabase) {
    console.warn("[order] service role not configured");
    return { error: "We could not process your request right now. Please try again later." };
  }

  const { data, error } = await serviceSupabase.rpc("create_order", {
    p_full_name: full_name,
    p_email: email,
    p_phone: phone,
    p_delivery_location: delivery_location,
    p_customer_notes: customer_notes,
    p_items: normalizedItems,
  });

  if (error) {
    console.warn("[order] create_order rpc failed:", error.message);
    // PostgREST surfaces the RAISE EXCEPTION message; match on the known
    // sentinels rather than trying to build a full message taxonomy here.
    if (error.message && error.message.includes("product_not_available")) {
      return {
        error: "One or more products in your enquiry are no longer available. Please review your selection and try again.",
      };
    }
    if (error.message && error.message.includes("invalid_quantity")) {
      return {
        error: `Quantities must be between 1 and ${MAX_QUANTITY_PER_LINE} per product. Please adjust your selection or add a note for larger volumes.`,
      };
    }
    return { error: "We could not process your request. Please try again." };
  }

  const result = data?.[0];
  if (!result) {
    console.warn("[order] create_order rpc returned no row");
    return { error: "We could not process your request. Please try again." };
  }

  // 6. Audit. logAudit is best-effort by design and never throws here.
  //    identity_conflict flags a same-email, materially-different-identity
  //    submission (new customer row created) for manual review.
  await logAudit({
    action: "order_created",
    entity: "orders",
    entity_id: result.order_id,
    details: {
      reference_number: result.reference_number,
      item_count: normalizedItems.length,
      customer_id: result.customer_id,
      ...(result.identity_conflict ? { identity_conflict: true } : {}),
    },
  });

  // 7. Return the real trigger-generated reference number.
  return { success: true, referenceNumber: result.reference_number };
}