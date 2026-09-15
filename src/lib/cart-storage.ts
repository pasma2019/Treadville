// Client-side persistence for the enquiry basket (Slice 4).
//
// localStorage stores ONLY {product_id, qty} pairs — never a cached product
// snapshot (names/images go stale) and never customer PII. Product data is
// re-fetched through the normal published-only public query path on
// rehydration, so the cart always reflects current reality.
//
// This is display-safety only. The server remains authoritative: create_order
// (and the checkout Server Action) independently re-validate every product and
// quantity. Corrupted local data here must never crash the app — every read is
// failure-tolerant and returns a clean empty/dropped result.

export const CART_STORAGE_KEY = "treadville:cart:v1";

// Local mirrors of the server-side bounds in src/lib/order-actions.ts. Those
// constants live inside a "use server" module and cannot be imported by client
// components without restructuring, so this cart-side copy exists for
// display/sanity purposes only. Keep the two in sync when editing bounds.
export const CART_MAX_LINES = 100;
export const CART_MAX_QUANTITY_PER_LINE = 1000;

export type StoredCartLine = { product_id: string; qty: number };

function readRaw(): unknown {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

// Loads and sanitises the stored cart. Malformed content (bad JSON, wrong
// shape, non-numeric quantity, duplicate ids) degrades to an empty cart or
// per-line dropping — never a crash.
export function loadStoredCart(): StoredCartLine[] {
  try {
    const parsed = readRaw();
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    const lines: StoredCartLine[] = [];
    for (const entry of parsed) {
      if (lines.length >= CART_MAX_LINES) break;
      if (!entry || typeof entry !== "object") continue;
      const e = entry as Record<string, unknown>;
      const product_id = typeof e.product_id === "string" ? e.product_id.trim() : "";
      if (!product_id || seen.has(product_id)) continue;

      const qtyRaw = typeof e.qty === "number" ? e.qty : Number(e.qty);
      if (!Number.isFinite(qtyRaw)) continue;
      const qty = Math.floor(qtyRaw);
      if (qty < 1) continue;

      seen.add(product_id);
      lines.push({ product_id, qty: Math.min(qty, CART_MAX_QUANTITY_PER_LINE) });
    }
    return lines;
  } catch {
    // Corrupt JSON or a storage error — treat as an empty cart.
    return [];
  }
}

// Writes on every cart mutation. An empty cart clears the key. Storage
// failures (private/incognito browsing, disabled localStorage) are swallowed:
// the session falls back to the same memory-only behaviour the cart had
// before persistence existed.
export function saveStoredCart(lines: StoredCartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    if (lines.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } else {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    }
  } catch {
    // Ignore — memory-only for this session.
  }
}