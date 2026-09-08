import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ContentClient from "@/components/admin/ContentClient";

export const dynamic = "force-dynamic";

async function loadContent() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("*");
  return Object.fromEntries(
    (data ?? []).map((row: { key: string; value: string | null }) => [row.key, row.value ?? ""])
  ) as Record<string, string>;
}

const FIELDS = [
  {
    key: "hero_headline",
    label: "Homepage headline",
    rows: 1,
    hint: "Top of the homepage hero",
  },
  {
    key: "hero_subheadline",
    label: "Homepage subheadline",
    rows: 2,
    hint: "Subtext below the hero",
  },
  {
    key: "hero_image",
    label: "Homepage hero image URL",
    rows: 1,
    hint: "Optional background image",
  },
  {
    key: "about_blurb",
    label: "Story section text",
    rows: 3,
    hint: "Used in the homepage story section",
  },
];

export default async function AdminContentPage() {
  await requireAdmin();
  const values = await loadContent();
  return <ContentClient initialValues={values} fields={FIELDS} />;
}
