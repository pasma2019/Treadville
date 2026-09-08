import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { AuditLog, AdminRole } from "@/lib/types";

export const metadata = { title: "Security — Treadville Admin" };

export default async function SecurityPage() {
  const user = await requireRole(["SYSTEM_ADMIN"]);

  const supabase = await createClient();
  const svcRole = await createServiceRoleClient();

  const [{ data: profiles }, auditLogsRes, storageRes] = await Promise.all([
    supabase.from("profiles").select("id, display_name, created_at, admin_roles(role)"),
    supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    svcRole
      ? svcRole.from("storage_files").select("bucket, created_at")
      : Promise.resolve({ data: null, error: null }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auditLogs = (auditLogsRes as any)?.data as AuditLog[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storageFiles = (storageRes as any)?.data as unknown[] | null;

  const recentActivity = (auditLogs ?? []).slice(0, 10);
  void storageFiles;

  const status = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    darajaKey: !!process.env.DARAJA_CONSUMER_KEY,
    darajaSecret: !!process.env.DARAJA_CONSUMER_SECRET,
    darajaEnv: process.env.DARAJA_ENVIRONMENT ?? "not set",
    darajaCallback: !!process.env.DARAJA_CALLBACK_URL,
  };

  const admingUsers = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.display_name ?? "—",
    role: (p as { admin_roles?: { role: string }[] }).admin_roles?.[0]?.role ?? "—" as AdminRole,
    joined: new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Security</h1>
        <p className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
          System configuration status. No secrets are displayed.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Authentication &amp; Database
          </h2>
          <div className="space-y-3">
            {[
              { label: "Supabase URL", ok: status.supabaseUrl },
              { label: "Anon Key", ok: status.anonKey },
              { label: "Service Role Key", ok: status.serviceRole },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between rounded border border-[var(--line-on-light)] px-4 py-3">
                <span className="font-mono text-sm text-[var(--ink)]">{label}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${ok ? "text-[var(--forest)]" : "text-red-500"}`}>
                  {ok ? "Configured" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            M-PESA Daraja
          </h2>
          <div className="space-y-3">
            {[
              { label: "Consumer Key", ok: status.darajaKey },
              { label: "Consumer Secret", ok: status.darajaSecret },
              { label: "Environment", ok: status.darajaEnv !== "not set" },
              { label: "Callback URL", ok: status.darajaCallback },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between rounded border border-[var(--line-on-light)] px-4 py-3">
                <span className="font-mono text-sm text-[var(--ink)]">{label}</span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${ok ? "text-[var(--forest)]" : "text-[var(--ink-faint)]"}`}>
                  {ok ? "Configured" : "Not configured"}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded border border-[var(--line-on-light)] bg-[var(--champagne)]/10 px-4 py-3">
              <span className="font-mono text-sm text-[var(--ink)]">Environment mode</span>
              <span className={`font-mono text-[10px] uppercase tracking-[0.15em] ${status.darajaEnv === "live" ? "text-red-600" : "text-[var(--ink-muted)]"}`}>
                {status.darajaEnv}
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Active Admin Users
          </h2>
          <div className="space-y-2">
            {admingUsers.length === 0 ? (
              <p className="font-mono text-sm text-[var(--ink-faint)] italic">No admin users found.</p>
            ) : (
              admingUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded border border-[var(--line-on-light)] px-4 py-3">
                  <div>
                    <p className="font-mono text-sm text-[var(--ink)]">{u.name}</p>
                    <p className="font-mono text-[10px] text-[var(--ink-faint)]">Joined {u.joined}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] ${
                    u.role === "SYSTEM_ADMIN" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "bg-[var(--champagne)]/40 text-[var(--ink)]"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--ink-faint)]">
            Recent Activity
          </h2>
          {recentActivity.length === 0 ? (
            <p className="font-mono text-sm text-[var(--ink-faint)] italic">No activity recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="rounded border border-[var(--line-on-light)] px-4 py-2.5">
                  <p className="font-mono text-xs text-[var(--ink)]">{entry.action.replace(/_/g, " ")}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-[var(--ink-faint)]">
                    {entry.actor_email ?? "—"} · {new Date(entry.created_at).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-8 rounded border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-6 py-4">
        <p className="font-mono text-xs text-[var(--ink-muted)]">
          <span className="font-semibold">Security note:</span> This page shows configuration status only. No secret values are displayed. Secret values (service role key, Daraja credentials) never reach the browser. RLS is enforced at the database level for all tables.
        </p>
      </div>
    </div>
  );
}
