"use client";

import { useState, useTransition } from "react";
import { updateProfileAction, setSiteContentAction, changePasswordAction } from "@/lib/admin-actions";
import type { SiteContent } from "@/lib/types";

type Props = {
  userId: string;
  userEmail: string;
  initialProfile: { id: string; display_name: string | null };
  initialSiteContent: SiteContent[];
};

const BUSINESS_FIELDS = [
  { key: "company_name", label: "Company name" },
  { key: "company_tagline", label: "Tagline" },
  { key: "company_email", label: "Email" },
  { key: "company_phone", label: "Phone" },
  { key: "company_location", label: "Location" },
  { key: "company_description", label: "Short description" },
];

export default function SettingsClient({ userId: _userId, userEmail, initialProfile, initialSiteContent }: Props) {
  const [tab, setTab] = useState<"account" | "business" | "security">("account");
  const [pending, startTransition] = useTransition();
  const [accountState, setAccountState] = useState<{ success?: string; error?: string } | null>(null);
  const [businessState, setBusinessState] = useState<{ success?: string; error?: string } | null>(null);
  const [passwordState, setPasswordState] = useState<{ success?: string; error?: string } | null>(null);

  const contentMap = Object.fromEntries(
    (initialSiteContent ?? []).map((c) => [c.key, c.value ?? ""])
  );

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("display_name", fd.get("display_name") as string);
    setAccountState(null);
    startTransition(async () => {
      const result = await updateProfileAction({}, fd);
      setAccountState(result);
    });
  };

  const handleBusinessSave = async (key: string, value: string) => {
    setBusinessState(null);
    const result = await setSiteContentAction(key, value);
    if ("error" in result) {
      setBusinessState({ error: result.error });
    } else {
      setBusinessState({ success: result.success });
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex gap-1 border-b border-[var(--line-on-light)]">
        {(["account", "business", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              tab === t
                ? "border-[var(--ink)] text-[var(--ink)]"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t === "account" ? "Account" : t === "business" ? "Business" : "Security"}
          </button>
        ))}
      </div>

      {tab === "account" && (
        <form onSubmit={handleAccountSubmit} className="space-y-5">
          <div>
            <label htmlFor="display_name" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={initialProfile?.display_name ?? ""}
              placeholder="e.g. Eunice Wanjiku"
              className="field-light w-full max-w-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Email address
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              disabled
              className="field-light w-full max-w-sm cursor-not-allowed opacity-60"
            />
            <p className="mt-1 font-mono text-[9px] text-[var(--ink-faint)]">
              Email is managed through your identity provider. Contact an administrator to change it.
            </p>
          </div>
          {accountState?.error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-600">
              {accountState.error}
            </div>
          )}
          {accountState?.success && (
            <div className="rounded border border-[var(--forest)]/30 bg-[var(--forest)]/5 px-4 py-3 font-mono text-xs text-[var(--forest)]">
              {accountState.success}
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:opacity-50"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}

      {tab === "business" && (
        <div className="space-y-6">
          <p className="font-mono text-xs text-[var(--ink-muted)]">
            These fields appear in the footer and brand sections of the public site.
          </p>
          {BUSINESS_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={`biz_${key}`} className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                {label}
              </label>
              <div className="flex gap-3">
                <input
                  id={`biz_${key}`}
                  type="text"
                  defaultValue={contentMap[key] ?? ""}
                  className="field-light w-full max-w-sm"
                  onBlur={(e) => {
                    if (e.target.defaultValue !== e.target.value) {
                      handleBusinessSave(key, e.target.value);
                      e.target.defaultValue = e.target.value;
                    }
                  }}
                />
              </div>
            </div>
          ))}
          {businessState?.error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-600">
              {businessState.error}
            </div>
          )}
          {businessState?.success && (
            <div className="rounded border border-[var(--forest)]/30 bg-[var(--forest)]/5 px-4 py-3 font-mono text-xs text-[var(--forest)]">
              {businessState.success}
            </div>
          )}
        </div>
      )}

      {tab === "security" && (
        <div className="space-y-6">
          <div>
            <h2 className="mb-1 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
              Signed in as
            </h2>
            <p className="font-display text-base italic text-[var(--ink)]">{userEmail}</p>
          </div>

          <div className="border-t border-[var(--line-on-light)] pt-6">
            <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
              Change password
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPasswordState(null);
                const fd = new FormData(e.currentTarget);
                const result = changePasswordAction({}, fd);
                result.then(setPasswordState);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="new_password" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                  New password *
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  minLength={8}
                  required
                  placeholder="Minimum 8 characters"
                  className="field-light w-full max-w-sm"
                />
              </div>
              <div>
                <label htmlFor="confirm_password" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                  Confirm new password *
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  minLength={8}
                  required
                  placeholder="Re-enter new password"
                  className="field-light w-full max-w-sm"
                />
              </div>
              {passwordState?.error && (
                <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-mono text-xs text-red-600">
                  {passwordState.error}
                </div>
              )}
              {passwordState?.success && (
                <div className="rounded border border-[var(--forest)]/30 bg-[var(--forest)]/5 px-4 py-3 font-mono text-xs text-[var(--forest)]">
                  {passwordState.success}
                </div>
              )}
              <button
                type="submit"
                className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)]"
              >
                Update password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
