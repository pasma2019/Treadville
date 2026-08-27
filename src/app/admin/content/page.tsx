"use client";

import { useEffect, useState } from "react";
import { getSiteContent, setSiteContent } from "@/lib/queries";

const FIELDS = [
  { key: "hero_headline", label: "Homepage headline" },
  { key: "hero_subheadline", label: "Homepage subheadline" },
  { key: "hero_image", label: "Homepage hero image URL" },
  { key: "about_blurb", label: "Story section text" },
];

export default function AdminContentPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteContent().then((v) => {
      setValues(v);
      setLoading(false);
    });
  }, []);

  const handleSave = async (key: string) => {
    await setSiteContent(key, values[key] ?? "");
    setSaved(key);
    setTimeout(() => setSaved(null), 1500);
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Content</h1>
      <p className="mt-2 max-w-lg text-sm text-[var(--parchment)]/50">
        Homepage hero and story text — save a field, then reload the storefront to see it live. Full section-by-section
        editing comes in a later phase; this proves the pattern.
      </p>

      {loading ? (
        <p className="mt-8 font-mono text-xs text-[var(--parchment)]/40">Loading…</p>
      ) : (
        <div className="mt-8 max-w-xl space-y-6">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="font-mono text-xs uppercase tracking-widest text-[var(--parchment)]/50">{f.label}</label>
              <div className="mt-2 flex gap-2">
                <textarea
                  value={values[f.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  rows={f.key.includes("headline") ? 1 : 2}
                  className="flex-1 border border-[var(--line)] bg-transparent px-3 py-2 text-sm"
                />
                <button
                  onClick={() => handleSave(f.key)}
                  className="shrink-0 bg-accent px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--soil)]"
                >
                  {saved === f.key ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
