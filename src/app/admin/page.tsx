import { getCategories, getProducts } from "@/lib/queries";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const published = products.filter((p) => p.status === "published").length;

  const cards = [
    { label: "Categories", value: categories.length },
    { label: "Products", value: products.length },
    { label: "Published", value: published },
    { label: "Draft", value: products.length - published },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-[var(--line)] p-6">
            <p className="font-mono text-3xl">{c.value}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">{c.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-md text-sm text-[var(--parchment)]/50">
        Orders and customers aren&apos;t built yet — this prototype covers catalogue and content only, on purpose.
      </p>
    </div>
  );
}
