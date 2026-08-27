"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import type { Category } from "@/lib/types";

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const { openCart, count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--soil)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-lg tracking-wide">
          TREADVILLE
        </Link>
        <nav className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/70 md:flex">
          <Link href="/shop" className="hover:text-accent">
            Shop
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop/${cat.slug}`} className="hover:text-accent">
              {cat.name}
            </Link>
          ))}
        </nav>
        <button onClick={openCart} className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-[var(--soil)]">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
