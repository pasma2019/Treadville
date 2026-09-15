"use client";

import { useState, useTransition } from "react";
import { updateProfileAction, changePasswordAction } from "@/lib/admin-actions";

type Props = {
  userId: string;
  userEmail: string;
  initialProfile: { id: string; display_name: string | null };
};

export default function SettingsClient({ userId: _userId, userEmail, initialProfile }: Props) {
  const [tab, setTab] = useState<"account" | "security">("account");
  const [pending, startTransition] = useTransition();
  const [accountState, setAccountState] = useState<{ success?: string; error?: string } | null>(null);
  const [passwordState, setPasswordState] = useState<{ success?: string; error?: string } | null>(null);

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

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex gap-1 border-b border-[var(--line-on-light)]">
        {(["account", "security"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`border-b-2 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
              tab === t
                ? "border-[var(--ink)] text-[var(--ink)]"
                : "border-transparent text-[var(--ink-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {t === "account" ? "Account" : "Security"}
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
                if (pending) return;
                setPasswordState(null);
                const fd = new FormData(e.currentTarget);
                startTransition(async () => {
                  const result = await changePasswordAction({}, fd);
                  setPasswordState(result);
                });
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
                disabled={pending}
                className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:opacity-50"
              >
                {pending ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-10 rounded border border-[var(--line-on-light)] bg-[var(--champagne)]/20 p-5">
        <p className="label-on-light">Business and site identity</p>
        <p className="mt-2 text-[12px] leading-relaxed text-[var(--ink-muted)]">
          Company name, email, phone, location, tagline and description settings are currently not
          consumed anywhere on the public storefront, so they&apos;ve been removed from this panel
          until they are wired to real customer-facing output. Edit all live site content from the
          Content section instead.
        </p>
      </div>
    </div>
  );
}