import { redirect } from "next/navigation";
import { getUser, isAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (!isAdmin(user)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen surface-warm">
      <AdminSidebar role={user!.role} email={user!.email} displayName={user!.displayName} />
      <div className="flex-1 min-w-0 px-6 py-8 md:px-8 md:py-10 lg:px-12">{children}</div>
    </div>
  );
}