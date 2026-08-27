"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/types";

type CartLine = { product: Product; qty: number };

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

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

  const total = useMemo(() => lines.reduce((sum, l) => sum + (l.product.price ?? 0) * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);

  return (
    <CartContext.Provider
      value={{
        lines,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
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
