import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

export type AdminUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: AdminRole;
};

export async function getSession() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.auth as any).getSession();
}

export async function getUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: { user }, error } = await (supabase.auth as any).getUser() as { data: { user: { id: string; email?: string; app_metadata?: Record<string, unknown> } | null }; error: Error | null };
  if (error || !user) return null;

  const role: AdminRole = (user.app_metadata?.role as AdminRole) ?? null;

  let displayName: string | null = null;
  if (user.id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle() as { data: { display_name: string | null } | null };
    displayName = profile?.display_name ?? null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    displayName,
    role,
  };
}

export function isAdmin(user: AdminUser | null): boolean {
  return user?.role === "OWNER" || user?.role === "SYSTEM_ADMIN";
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getUser();
  if (!isAdmin(user)) {
    redirect("/admin/login");
  }
  return user!;
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
  }
}

export async function requireRole(roles: AdminRole[]): Promise<AdminUser> {
  const user = await getUser();
  if (!isAdmin(user)) {
    redirect("/admin/login");
  }
  if (!roles.includes(user!.role)) {
    throw new ForbiddenError();
  }
  return user!;
}
