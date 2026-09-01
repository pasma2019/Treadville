"use client";

import { useEffect, useState } from "react";
import { getSiteContent, setSiteContent } from "@/lib/queries";

const FIELDS = [
  { key: "hero_headline", label: "Homepage headline", rows: 1, hint: "Top of the homepage hero" },
  { key: "hero_subheadline", label: "Homepage subheadline", rows: 2, hint: "Subtext below the hero" },
  { key: "hero_image", label: "Homepage hero image URL", rows: 1, hint: "Optional background image" },
  { key: "about_blurb", label: "Story section text", rows: 3, hint: "Used in the homepage story section" },
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
      <p className="label-on-light">Site copy</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Content
      </h1>
      <p className="mt-4 max-w-[56ch] body-on-light">
        Homepage hero and story text — save a field, then reload the storefront
        to see it live. Full section-by-section editing comes in a later phase;
        this proves the pattern.
      </p>

      {loading ? (
        <p className="mt-10 label-on-light">Loading…</p>
      ) : (
        <div className="mt-10 space-y-8">
          {FIELDS.map((f) => (
            <div
              key={f.key}
              className="card-light-soft p-6"
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="label-on-light">{f.label}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--ink-whisper)]">
                    {f.hint}
                  </p>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[var(--ink-whisper)]">
                  {f.key}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3 md:flex-row">
                <textarea
                  value={values[f.key] ?? ""}
                  onChange={(e) =>
                    setValues({ ...values, [f.key]: e.target.value })
                  }
                  rows={f.rows}
                  className="field-light flex-1"
                />
                <button
                  onClick={() => handleSave(f.key)}
                  className="shrink-0 border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--warm-white)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
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
