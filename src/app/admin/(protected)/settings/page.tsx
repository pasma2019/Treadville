import { requireAdmin } from "@/lib/auth";
import SettingsClient from "@/components/admin/SettingsClient";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings — Treadville Admin" };

export default async function SettingsPage() {
  const user = await requireAdmin();

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: siteContent } = await supabase
    .from("site_content")
    .select("*");

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Settings</h1>
        <p className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
          Manage your account and business information.
        </p>
      </header>
      <SettingsClient
        userId={user.id}
        userEmail={user.email}
        initialProfile={profile ?? { id: user.id, display_name: null, created_at: "", updated_at: "" }}
        initialSiteContent={siteContent ?? []}
      />
    </div>
  );
}
