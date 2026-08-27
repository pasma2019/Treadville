"use client";

import { useEffect, useState } from "react";
import { createProduct, deleteProduct, getCategories, getProducts, updateProduct } from "@/lib/queries";
import type { Category, Product } from "@/lib/types";

const empty = { name: "", slug: "", category_id: "", price: "", image_url: "", description: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.category_id) return;
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-");
    try {
      await createProduct({
        ...form,
        slug,
        category_id: form.category_id,
        price: form.price ? Number(form.price) : null,
        status: "draft",
        stock: 0,
      });
      setForm(empty);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleStatus = async (p: Product) => {
    await updateProduct(p.id, { status: p.status === "published" ? "draft" : "published" });
    refresh();
  };

  const toggleFeatured = async (p: Product) => {
    await updateProduct(p.id, { featured: !p.featured });
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    refresh();
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Products</h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--parchment)]/50">
        New products start as Draft — publish them to show on the storefront.
      </p>

      {error && <p className="mt-4 font-mono text-xs text-red-400">{error}</p>}

      <div className="mt-8 grid gap-3 border border-[var(--line)] p-5 md:grid-cols-2">
        <input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          className="border border-[var(--line)] bg-[var(--soil)] px-3 py-2 text-sm"
        >
          <option value="">Select category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Price (KSh, blank = request quote)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
        />
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm md:col-span-2"
        />
        <button onClick={handleAdd} className="bg-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--soil)] md:col-span-2">
          + Add product
        </button>
      </div>

      {loading ? (
        <p className="mt-8 font-mono text-xs text-[var(--parchment)]/40">Loading…</p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/40">
            <tr className="border-b border-[var(--line)]">
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)]">
                <td className="py-3">{p.name}</td>
                <td className="font-mono text-xs text-[var(--parchment)]/50">
                  {categories.find((c) => c.id === p.category_id)?.name ?? "—"}
                </td>
                <td className="font-mono text-xs">{p.price ? `KSh ${p.price.toLocaleString()}` : "Quote"}</td>
                <td>
                  <button onClick={() => toggleStatus(p)} className={p.status === "published" ? "text-accent" : "text-[var(--parchment)]/30"}>
                    {p.status}
                  </button>
                </td>
                <td>
                  <button onClick={() => toggleFeatured(p)} className={p.featured ? "text-accent" : "text-[var(--parchment)]/30"}>
                    {p.featured ? "Yes" : "No"}
                  </button>
                </td>
                <td className="text-right">
                  <button onClick={() => handleDelete(p.id)} className="font-mono text-xs text-[var(--parchment)]/40 hover:text-red-400">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
