"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "./CartContext";
import type { Category } from "@/lib/types";

export default function SiteHeader({ categories }: { categories: Category[] }) {
  const { openCart, count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        e.preventDefault();
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => firstLinkRef.current?.focus(), 60);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleMenuClose = () => {
    setMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--glass-border)] bg-[var(--soil)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--soil)]/[0.72]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-base tracking-wider">
          TREADVILLE
        </Link>

        <div
          ref={menuRef}
          id="site-mobile-menu"
          aria-hidden={!menuOpen}
          className={`fixed inset-0 z-40 bg-[var(--soil-raised)]/95 backdrop-blur transition-opacity duration-300 ease-out md:static md:relative md:flex md:items-center md:gap-8 md:bg-transparent md:backdrop-blur-none ${
            menuOpen
              ? "flex flex-col items-center justify-center opacity-100"
              : "pointer-events-none hidden opacity-0 md:flex md:pointer-events-auto md:opacity-100"
          }`}
        >
          <nav
            aria-label="Main navigation"
            className="flex flex-col items-center gap-6 md:flex-row md:gap-8"
          >
            <Link
              ref={firstLinkRef}
              href="/shop"
              className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/70 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
              onClick={handleMenuClose}
            >
              Shop
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/70 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
                onClick={handleMenuClose}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleMenuClose}
            aria-label="Close menu"
            className="mt-10 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/60 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)] md:hidden"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            aria-label={`Open cart (${count} items)`}
            className="relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/70 transition-colors hover:text-[var(--parchment)]"
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] text-[var(--soil)]">
                {count}
              </span>
            )}
          </button>
          <button
            ref={hamburgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            className="md:hidden text-[var(--parchment)]/70 transition-colors hover:text-[var(--parchment)] focus-visible:outline-none focus-visible:text-[var(--parchment)]"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
