"use client";

import { useState, useTransition } from "react";
import { inviteAdminAction, setUserRoleAction, removeAdminRoleAction } from "@/lib/admin-actions";

type User = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

type Props = {
  currentUserId: string;
  users: User[];
  hasServiceRole: boolean;
};

export default function UsersClient({ currentUserId, users, hasServiceRole }: Props) {
  const [, startTransition] = useTransition();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"OWNER" | "SYSTEM_ADMIN">("OWNER");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [inviting, setInviting] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviting(true);
    setMessage(null);
    startTransition(async () => {
      const result = await inviteAdminAction(inviteEmail, inviteRole);
      setInviting(false);
      if (result.error) setMessage({ type: "error", text: result.error });
      if (result.success) {
        setMessage({ type: "success", text: result.success });
        setInviteEmail("");
      }
    });
  };

  return (
    <div className="max-w-[900px]">
      <p className="label-on-light">System administration</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Users
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        Manage administrator accounts. Invite new users by email — they will receive a setup link.
      </p>

      {!hasServiceRole && (
        <div className="mt-6 border border-[var(--sand)] bg-[var(--champagne)]/10 px-4 py-4">
          <p className="font-mono text-xs text-[var(--ink)]">
            Service role key not configured. Set <code className="bg-[var(--bone)] px-1 py-0.5">SUPABASE_SERVICE_ROLE_KEY</code> in your environment to enable user management.
          </p>
        </div>
      )}

      {message && (
        <div className={`mt-6 border px-4 py-3 font-mono text-xs ${
          message.type === "success"
            ? "border-[var(--accent)] bg-[var(--champagne)]/20 text-[var(--ink)]"
            : "border-red-300 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      <section className="mt-10">
        <h2 className="label-on-light">Invite administrator</h2>
        <div className="mt-4 card-light-soft p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <div>
              <label htmlFor="invite-email" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Email address
              </label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="field-light w-full"
              />
            </div>
            <div>
              <label htmlFor="invite-role" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                Role
              </label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as "OWNER" | "SYSTEM_ADMIN")}
                className="field-light cursor-pointer"
              >
                <option value="OWNER">Owner — Business management</option>
                <option value="SYSTEM_ADMIN">System Admin — Full access</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail || !hasServiceRole}
                className="border border-[var(--ink)] bg-[var(--ink)] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--warm-white)] transition-colors hover:bg-[var(--warm-white)] hover:text-[var(--ink)] disabled:opacity-40"
              >
                {inviting ? "Sending…" : "Send invite"}
              </button>
            </div>
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-faint)]">
            Owner: catalogue and content management. System Admin: full system access including users and integrations.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="label-on-light">
          {users.length} {users.length === 1 ? "administrator" : "administrators"}
        </h2>
        <div className="mt-4 overflow-hidden border border-[var(--line-on-light)] bg-[var(--warm-white)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line-on-light)] bg-[var(--bone)]">
              <tr className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-muted)]">
                <th className="px-5 py-4 font-normal">Name</th>
                <th className="px-5 py-4 font-normal">Email</th>
                <th className="px-5 py-4 font-normal">Role</th>
                <th className="px-5 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[var(--line-on-light)] last:border-b-0 transition-colors hover:bg-[var(--ivory)]"
                >
                  <td className="px-5 py-4 font-display text-base italic text-[var(--ink)]">
                    {u.display_name || "—"}
                    {u.id === currentUserId && (
                      <span className="ml-2 font-mono text-[10px] normal-case italic tracking-[0.08em] text-[var(--ink-faint)]">
                        (you)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-[var(--ink-muted)]">
                    {u.email}
                  </td>
                  <td className="px-5 py-4">
                    {u.role === "—" ? (
                      <span className="font-mono text-[10px] uppercase tracking-[0.20em] text-[var(--ink-faint)]">
                        No role
                      </span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => {
                          if (!confirm(`Change role to ${e.target.value}?`)) return;
                          startTransition(async () => {
                            await setUserRoleAction(u.id, e.target.value as "OWNER" | "SYSTEM_ADMIN");
                          });
                        }}
                        disabled={u.id === currentUserId}
                        className="field-light cursor-pointer text-[11px]"
                      >
                        <option value="OWNER">Owner</option>
                        <option value="SYSTEM_ADMIN">System Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.id !== currentUserId && u.role !== "—" && (
                      <button
                        onClick={() => {
                          if (!confirm(`Remove admin access for ${u.email}?`)) return;
                          startTransition(async () => {
                            await removeAdminRoleAction(u.id);
                          });
                        }}
                        className="font-mono text-[10px] uppercase tracking-[0.20em] text-red-600 transition-colors hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <p className="font-display text-base italic text-[var(--ink)]/60">
                      No administrators yet.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
