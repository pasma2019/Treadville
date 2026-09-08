import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import JournalClient from "@/components/admin/JournalClient";
import type { Article } from "@/lib/types";

export const metadata = { title: "Journal — Treadville Admin" };

export default async function JournalPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  const articles = (data ?? []) as Article[];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">Journal</h1>
        <p className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
          Manage articles, stories, and field notes.
        </p>
      </header>
      <JournalClient articles={articles} />
    </div>
  );
}
