import { createServiceRoleClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

type AuditInput = {
  action: string;
  entity: string;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  actorId?: string | null;
  actorEmail?: string | null;
};

export async function logAudit(input: AuditInput): Promise<void> {
  // The service role is the only role that can write to audit_log by design.
  // (See Phase 19 audit report and RLS policies.)
  const serviceSupabase = await createServiceRoleClient();
  if (!serviceSupabase) return;

  let actorId = input.actorId;
  let actorEmail = input.actorEmail;

  if (!actorId) {
    try {
      const supabase = await createClient();
      const { data } = await (supabase.auth as any).getUser() as { data: { user: { id: string; email?: string } | null } };
      if (data.user) {
        actorId = data.user.id;
        actorEmail = actorEmail ?? data.user.email ?? undefined;
      }
    } catch {
      // best-effort only
    }
  }

  await serviceSupabase.from("audit_log").insert({
    actor_id: actorId ?? undefined,
    actor_email: actorEmail ?? undefined,
    action: input.action,
    entity: input.entity,
    entity_id: input.entity_id ?? null,
    details: input.details ?? null,
  });
}
