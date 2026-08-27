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
      <h1 className="font-display text-3xl">Categories</h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--parchment)]/50">
        Add a category here, then check the storefront — it appears in the shop nav and tabs immediately, no code
        changes.
      </p>

      {error && <p className="mt-4 font-mono text-xs text-red-400">{error}</p>}

      <div className="mt-8 grid gap-3 border border-[var(--line)] p-5 md:grid-cols-2">
        <input
          placeholder="Name (e.g. Honey)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
        />
        <input
          placeholder="Slug (optional — auto-generated)"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm md:col-span-2"
        />
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="border border-[var(--line)] bg-transparent px-3 py-2 text-sm md:col-span-2"
        />
        <button onClick={handleAdd} className="bg-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--soil)] md:col-span-2">
          + Add category
        </button>
      </div>

      {loading ? (
        <p className="mt-8 font-mono text-xs text-[var(--parchment)]/40">Loading…</p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/40">
            <tr className="border-b border-[var(--line)]">
              <th className="py-2">Name</th>
              <th>Slug</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-[var(--line)]">
                <td className="py-3">{cat.name}</td>
                <td className="font-mono text-xs text-[var(--parchment)]/50">{cat.slug}</td>
                <td>
                  <button onClick={() => toggleActive(cat)} className={cat.active ? "text-accent" : "text-[var(--parchment)]/30"}>
                    {cat.active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="text-right">
                  <button onClick={() => handleDelete(cat.id)} className="font-mono text-xs text-[var(--parchment)]/40 hover:text-red-400">
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
