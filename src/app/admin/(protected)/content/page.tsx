import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CmsClient from "@/components/admin/CmsClient";
import { CMS_STATIC_FIELDS, cmsFieldsForCategories, type CmsField } from "@/lib/cms-fields";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdmin();

  const supabase = await createClient();
  const [{ data: siteContent }, { data: categories }] = await Promise.all([
    supabase.from("site_content").select("*"),
    supabase.from("categories").select("*").order("sort_order"),
  ]);

  const dbMap = Object.fromEntries(
    (siteContent ?? []).map((r: { key: string; value: string | null }) => [r.key, r.value ?? ""])
  );

  // Effective values show what the storefront actually renders today: the
  // database value when present, otherwise the code fallback. Saving a field
  // persists it, making the CMS the source of truth.
  const allFields: CmsField[] = [
    ...CMS_STATIC_FIELDS,
    ...cmsFieldsForCategories(categories ?? []),
  ];
  const effective = Object.fromEntries(
    allFields.map((f) => [f.key, dbMap[f.key] ?? f.fallback ?? ""])
  );

  return (
    <div>
      <CmsClient initialValues={effective} categories={categories ?? []} />
    </div>
  );
}