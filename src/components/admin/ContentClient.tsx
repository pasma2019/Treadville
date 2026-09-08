"use client";

import { useState, useTransition } from "react";
import { setSiteContentAction } from "@/lib/admin-actions";

type Field = { key: string; label: string; rows: number; hint: string };
type Props = { initialValues: Record<string, string>; fields: Field[] };

export default function ContentClient({ initialValues, fields }: Props) {
  const [, startTransition] = useTransition();
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = (key: string) => {
    setError(null);
    startTransition(async () => {
      try {
        await setSiteContentAction(key, values[key] ?? "");
        setSaved(key);
        setTimeout(() => setSaved(null), 2000);
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  };

  return (
    <div className="max-w-[900px]">
      <p className="label-on-light">Site copy</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Homepage content
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Edit the homepage hero and story text. Changes appear on the storefront immediately after saving.
      </p>

      {error && (
        <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 font-mono text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 space-y-6">
        {fields.map((f) => (
          <div key={f.key} className="card-light-soft p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="label-on-light">{f.label}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                  {f.hint}
                </p>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
                {f.key}
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                rows={f.rows}
                className="field-light flex-1 resize-none"
              />
              <button
                onClick={() => handleSave(f.key)}
                className="shrink-0 border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(212,190,145,0.50)] focus-visible:ring-offset-2 disabled:opacity-50"
              >
                {saved === f.key ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
