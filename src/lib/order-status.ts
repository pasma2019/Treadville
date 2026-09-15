import type { OrderStatus } from "@/lib/types";

// Single source of truth for the approved order status lifecycle.
// Mirrors the CHECK constraint in supabase/migrations/20260909_0001_commerce_customers_orders.sql.
// Used by the admin Server Actions (server-side validation) and by the admin
// client components (UI options/labels). Do not add statuses here without a
// matching schema/constraint change and a product decision.
export const ORDER_STATUSES: ReadonlyArray<OrderStatus> = [
  "pending",
  "contacted",
  "quoted",
  "confirmed",
  "fulfilled",
  "completed",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  contacted: "Contacted",
  quoted: "Quoted",
  confirmed: "Confirmed",
  fulfilled: "Fulfilled",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Light state machine (Slice 5). No backward transitions; cancelled is
// reachable from every non-terminal state. completed and cancelled are
// terminal. Enforced server-side in setOrderStatusAction — the UI offers the
// same table so terminals/exits never render as options.
export const ORDER_TRANSITIONS: Record<OrderStatus, ReadonlyArray<OrderStatus>> = {
  pending: ["contacted", "cancelled"],
  contacted: ["quoted", "cancelled"],
  quoted: ["confirmed", "cancelled"],
  confirmed: ["fulfilled", "cancelled"],
  fulfilled: ["completed"],
  completed: [],
  cancelled: [],
};

export function nextOrderStatuses(status: OrderStatus): ReadonlyArray<OrderStatus> {
  return ORDER_TRANSITIONS[status] ?? [];
}

// Channels accepted by order_communications.channel CHECK constraint.
// Mirrors supabase/migrations/20260909_0004_order_communications.sql.
export const ORDER_COMMUNICATION_CHANNELS: ReadonlyArray<"whatsapp" | "other"> = [
  "whatsapp",
  "other",
];

// Bounded message summary length (2000 chars ≈ 500 words).
// Reasonable upper bound for a human-edited WhatsApp outreach note: large
// enough for a real quote/provenance message, small enough to keep one row
// readable in the admin UI and prevent storage/audit bloat. WhatsApp itself
// caps a message payload at ~4096 chars, so a 2000-char summary stays below
// that even before the click-to-chat open. Enforced server-side in
// logOrderCommunicationAction; the textarea maxLength uses the same constant.
export const ORDER_COMMUNICATION_MAX_LENGTH = 2000;