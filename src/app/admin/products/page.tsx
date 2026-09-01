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

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div>
      <p className="label-on-light">Catalogue items</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Products
      </h1>
      <p className="mt-4 max-w-[56ch] body-on-light">
        New products start as Draft — publish them to show on the storefront.
      </p>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {error}
        </div>
      )}

      <section className="mt-10">
        <h2 className="label-on-light">Add a new product</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field-light"
          />
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="field-light"
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
            className="field-light"
          />
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="field-light"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field-light md:col-span-2"
          />
          <button
            onClick={handleAdd}
            className="md:col-span-2 border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--warm-white)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
          >
            + Add product
          </button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="label-on-light">
            {products.length} {products.length === 1 ? "product" : "products"}
          </h2>
        </div>

        {loading ? (
          <p className="mt-6 label-on-light">Loading…</p>
        ) : (
          <div className="mt-4 overflow-hidden border border-[var(--line-on-light)] bg-[var(--warm-white)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--line-on-light)] bg-[var(--bone)]">
                <tr className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)]">
                  <th className="px-5 py-4 font-normal">Name</th>
                  <th className="px-5 py-4 font-normal">Category</th>
                  <th className="px-5 py-4 font-normal">Price</th>
                  <th className="px-5 py-4 font-normal">Status</th>
                  <th className="px-5 py-4 font-normal">Featured</th>
                  <th className="px-5 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--line-on-light)] last:border-b-0 transition-colors hover:bg-[var(--ivory)]"
                  >
                    <td className="px-5 py-4 font-display text-base italic text-[var(--ink)]">
                      {p.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--ink-muted)]">
                      {getCategoryName(p.category_id)}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--ink-muted)]">
                      {p.price ? `KSh ${p.price.toLocaleString()}` : "Quote"}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`font-mono text-[10px] uppercase tracking-[0.28em] transition-colors ${
                          p.status === "published"
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink-faint)]"
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`font-mono text-[10px] uppercase tracking-[0.28em] transition-colors ${
                          p.featured
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink-faint)]"
                        }`}
                      >
                        {p.featured ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center body-on-light"
                    >
                      No products yet — add one above to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
