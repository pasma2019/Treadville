import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-[var(--line)] p-6">
        <p className="font-display text-lg">Treadville Admin</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--parchment)]/40">Prototype — no login yet</p>
        <nav className="mt-10 flex flex-col gap-3 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/70">
          <Link href="/admin" className="hover:text-accent">Dashboard</Link>
          <Link href="/admin/categories" className="hover:text-accent">Categories</Link>
          <Link href="/admin/products" className="hover:text-accent">Products</Link>
          <Link href="/admin/content" className="hover:text-accent">Content</Link>
          <Link href="/" className="mt-6 text-[var(--parchment)]/40 hover:text-accent">← Back to storefront</Link>
        </nav>
      </aside>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
