"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import {
  CART_MAX_LINES,
  CART_MAX_QUANTITY_PER_LINE,
  loadStoredCart,
  saveStoredCart,
} from "@/lib/cart-storage";

type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  notice: string | null;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  dismissNotice: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Always initialise empty: the cart rehydrates from localStorage in a
  // mount effect, never during render, so SSR and the first client paint stay
  // consistent (no hydration mismatch, no localStorage access server-side).
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const linesRef = useRef<CartLine[]>([]);
  const hydratedRef = useRef(false);

  const addToCart = (product: Product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { product, qty }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const clearCart = () => setLines([]);

  const dismissNotice = () => setNotice(null);

  // Rehydrate persisted {product_id, qty} pairs against live product data.
  // Re-fetching through the published-only anon client means:
  //  * the cart reflects current name/image/availability, never a stale copy
  //  * ids that no longer resolve (deleted/unpublished/invalid) are dropped
  //  * quantities are re-clamped to sane bounds after possible tampering
  // If the user has already acted (added a line) before the fetch resolves,
  // their in-session cart wins and the persisted copy is not clobbered.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = loadStoredCart();
      if (stored.length === 0) {
        hydratedRef.current = true;
        return;
      }
      if (linesRef.current.length > 0) {
        hydratedRef.current = true;
        return;
      }

      const ids = stored.map((s) => s.product_id);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (cancelled) return;
      hydratedRef.current = true;

      // Fetch failure: keep an empty cart rather than render stale data.
      // Non-blocking — the user can rebuild from the shop.
      if (error || !data) return;

      const productsById = new Map((data as unknown as Product[]).map((p) => [p.id, p]));
      const resolved: CartLine[] = [];
      let dropped = false;

      for (const line of stored) {
        const product = productsById.get(line.product_id);
        if (!product) {
          dropped = true;
          continue;
        }
        const qty = Math.min(Math.max(1, Math.floor(line.qty) || 1), CART_MAX_QUANTITY_PER_LINE);
        resolved.push({ product, qty });
      }
      if (resolved.length > CART_MAX_LINES) {
        resolved.length = CART_MAX_LINES;
        dropped = true;
      }

      setLines(resolved);
      if (dropped) {
        setNotice("Some items in your basket are no longer available and were removed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  // Persist id/qty pairs on every change. Skipped until rehydration completes
  // so a fresh load never wipes storage before the stored cart is read.
  useEffect(() => {
    if (!hydratedRef.current) return;
    saveStoredCart(lines.map((l) => ({ product_id: l.product.id, qty: l.qty })));
  }, [lines]);

  const total = useMemo(() => lines.reduce((sum, l) => sum + (l.product.price ?? 0) * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        notice,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        clearCart,
        dismissNotice,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}