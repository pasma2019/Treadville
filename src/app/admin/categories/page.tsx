"use client";

import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/lib/queries";
import type { Category } from "@/lib/types";

const empty = { name: "", slug: "", description: "", image_url: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setCategories(await getCategories());
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
    if (!form.name.trim()) return;
    const slug = form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-");
    try {
      await createCategory({ ...form, slug, sort_order: categories.length + 1 });
      setForm(empty);
      refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleActive = async (cat: Category) => {
    await updateCategory(cat.id, { active: !cat.active });
    refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category and all its products?")) return;
    await deleteCategory(id);
    refresh();
  };

  return (
    <div>
      <p className="label-on-light">Catalogue structure</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Categories
      </h1>
      <p className="mt-4 max-w-[56ch] body-on-light">
        Add a category here, then check the storefront — it appears in the shop
        nav and tabs immediately, no code changes.
      </p>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {error}
        </div>
      )}

      <section className="mt-10">
        <h2 className="label-on-light">Add a new category</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            placeholder="Name (e.g. Honey)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field-light"
          />
          <input
            placeholder="Slug (optional — auto-generated)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="field-light"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field-light md:col-span-2"
          />
          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            className="field-light md:col-span-2"
          />
          <button
            onClick={handleAdd}
            className="md:col-span-2 border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--warm-white)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
          >
            + Add category
          </button>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between">
          <h2 className="label-on-light">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
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
                  <th className="px-5 py-4 font-normal">Slug</th>
                  <th className="px-5 py-4 font-normal">Active</th>
                  <th className="px-5 py-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-[var(--line-on-light)] last:border-b-0 transition-colors hover:bg-[var(--ivory)]"
                  >
                    <td className="px-5 py-4 font-display text-base italic text-[var(--ink)]">
                      {cat.name}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--ink-muted)]">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(cat)}
                        className={`font-mono text-[10px] uppercase tracking-[0.28em] transition-colors ${
                          cat.active
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink-faint)]"
                        }`}
                      >
                        {cat.active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-muted)] transition-colors hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-10 text-center body-on-light"
                    >
                      No categories yet — add one above to begin.
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
