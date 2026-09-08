import { requireRole, ForbiddenError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  product_created: "Created product",
  product_updated: "Updated product",
  product_published: "Published product",
  product_unpublished: "Unpublished product",
  product_deleted: "Deleted product",
  category_created: "Created category",
  category_updated: "Updated category",
  category_deleted: "Deleted category",
  content_updated: "Updated site content",
  enquiry_status_changed: "Changed enquiry status",
  enquiry_deleted: "Deleted enquiry",
  user_invited: "Invited admin user",
  role_changed: "Changed user role",
  role_removed: "Removed admin access",
  session_created: "Signed in",
  session_destroyed: "Signed out",
};

async function loadAuditLog() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []) as Array<{
    id: string;
    actor_email: string | null;
    action: string;
    entity: string;
    entity_id: string | null;
    details: Record<string, unknown> | null;
    created_at: string;
  }>;
}

export default async function AdminActivityPage() {
  try {
    await requireRole(["SYSTEM_ADMIN"]);
  } catch (e) {
    if (e instanceof ForbiddenError) {
      return (
        <div className="max-w-[600px]">
          <p className="label-on-light">Access denied</p>
          <h1 className="mt-2 font-display text-4xl italic text-[var(--ink)]">403</h1>
          <p className="mt-4 body-on-light">
            You need System Administrator access to view this page.
          </p>
        </div>
      );
    }
    redirect("/admin");
  }

  const logs = await loadAuditLog();

  return (
    <div className="max-w-[1200px]">
      <p className="label-on-light">System administration</p>
      <h1 className="mt-2 max-w-[16ch] font-display text-4xl italic leading-[1.02] tracking-[-0.015em] text-[var(--ink)]">
        Activity log
      </h1>
      <p className="mt-4 max-w-[60ch] body-on-light">
        A record of administrative actions — product changes, content updates, user management, and system events.
      </p>

      {logs.length === 0 ? (
        <div className="mt-10 card-light p-10 text-center">
          <p className="font-display text-base italic text-[var(--ink)]/60">
            No activity recorded yet.
          </p>
          <p className="mt-2 font-mono text-[11px] text-[var(--ink-faint)]">
            Actions such as creating products or updating content will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-1">
          {logs.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-4 border-b border-[var(--line-on-light)] py-3 px-1 hover:bg-[var(--bone)]/50"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm italic text-[var(--ink)]">
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </p>
                {entry.details && Object.keys(entry.details).length > 0 && (
                  <p className="mt-0.5 font-mono text-[10px] text-[var(--ink-faint)]">
                    {JSON.stringify(entry.details)}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  {entry.actor_email ?? "System"}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  {new Date(entry.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
