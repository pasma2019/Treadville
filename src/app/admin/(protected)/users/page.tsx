import { requireRole, ForbiddenError } from "@/lib/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import UsersClient from "@/components/admin/UsersClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminUser = {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  created_at: string;
};

async function loadUsers() {
  const service = await createServiceRoleClient();
  if (!service) return { users: [], hasServiceRole: false };

  const { data } = await service
    .from("profiles")
    .select("id, display_name, created_at, admin_roles(role)")
    .order("created_at", { ascending: false });

  // Get auth users for emails (admin API)
  const { data: authData } = await (service as any).auth.admin.listUsers();

  const users: AdminUser[] = ((data ?? []) as Array<{
    id: string;
    display_name: string | null;
    created_at: string;
    admin_roles: { role: string }[] | { role: string } | null;
  }>).map((p) => {
    const authUser = authData?.users?.find((u: any) => u.id === p.id);
    const role = Array.isArray(p.admin_roles)
      ? p.admin_roles[0]?.role
      : p.admin_roles?.role;
    return {
      id: p.id,
      email: authUser?.email ?? "—",
      display_name: p.display_name,
      role: role ?? "—",
      created_at: p.created_at,
    };
  });

  return { users, hasServiceRole: true };
}

export default async function AdminUsersPage() {
  let user;
  try {
    user = await requireRole(["SYSTEM_ADMIN"]);
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

  const { users, hasServiceRole } = await loadUsers();
  return <UsersClient currentUserId={user.id} users={users} hasServiceRole={hasServiceRole} />;
}
