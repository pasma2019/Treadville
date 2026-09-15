"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireRole } from "@/lib/auth";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import {
  nextOrderStatuses,
  ORDER_COMMUNICATION_CHANNELS,
  ORDER_COMMUNICATION_MAX_LENGTH,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
} from "@/lib/order-status";
import type { AdminRole, OrderStatus } from "@/lib/types";
import {
  CMS_IMAGE_VALUE_MAX_LENGTH,
  CMS_TEXT_MAX_LENGTH,
  CMS_STATIC_FIELD_BY_KEY,
  CATEGORY_HERO_PREFIX,
  isCmsContentKey,
} from "@/lib/cms-fields";

// ============================================================
// Slice 17 — operator-safe failure messages
// ============================================================
// Raw database / Supabase error strings are never rendered to the admin.
// They are logged server-side for diagnosis; the admin gets a stable, honest
// message and the failed operation is never reported as success.
function safeDbError(context: string, error: unknown): string {
  if (error instanceof Error) {
    console.error(`[admin] ${context}: ${error.message}`);
  } else {
    console.error(`[admin] ${context}:`, error);
  }
  return "The change could not be completed. Nothing was saved — please try again.";
}

// ============================================================
// PRODUCTS
// ============================================================

export type ProductFormState = {
  error?: string;
  success?: string;
  productId?: string;
};

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  const featured = formData.get("featured") === "on";
  const status = (String(formData.get("status") ?? "draft") === "published" ? "published" : "draft") as "draft" | "published";

  if (!name) return { error: "Product name is required." };
  if (!category_id) return { error: "Please choose a category." };

  const slug = String(formData.get("slug") ?? "").trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const price = priceRaw ? Number(priceRaw) : null;
  const stock = stockRaw ? Number(stockRaw) : 0;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ name, slug, category_id, description, price, image_url, stock, featured, status, gallery: parseGalleryValue(String(formData.get("gallery") ?? "")) })
    .select("id")
    .single();

  if (error) {
    return { error: safeDbError("create product", error) };
  }

  await logAudit({
    action: "product_created",
    entity: "products",
    entity_id: data.id,
    details: { name, status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: "Product saved.", productId: data.id };
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const updates: Record<string, unknown> = {};

  const name = String(formData.get("name") ?? "").trim();
  if (name) updates.name = name;
  const category_id = String(formData.get("category_id") ?? "").trim();
  if (category_id) updates.category_id = category_id;
  const description = String(formData.get("description") ?? "").trim();
  updates.description = description || null;
  const priceRaw = String(formData.get("price") ?? "").trim();
  updates.price = priceRaw ? Number(priceRaw) : null;
  const image_url = String(formData.get("image_url") ?? "").trim();
  updates.image_url = image_url || null;
  const stockRaw = String(formData.get("stock") ?? "0").trim();
  updates.stock = stockRaw ? Number(stockRaw) : 0;
  updates.featured = formData.get("featured") === "on";
  const statusRaw = String(formData.get("status") ?? "draft");
  updates.status = statusRaw === "published" ? "published" : "draft";

  const slug = String(formData.get("slug") ?? "").trim();
  if (slug) updates.slug = slug;

  // Gallery: parse JSON array from form data (validated)
  updates.gallery = parseGalleryValue(String(formData.get("gallery") ?? ""));

  const supabase = await createClient();

  // Slice 15: snapshot current image refs + status before update for orphan-safe deletion.
  const { data: prevProduct } = await supabase
    .from("products")
    .select("image_url, gallery, status")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return { error: safeDbError("update product", error) };

  // Slice 15: delete storage objects no longer referenced (DB-first, storage-after).
  if (prevProduct) {
    const prevRefs = [prevProduct.image_url, ...(prevProduct.gallery ?? [])].filter(Boolean);
    const newRefs = [(updates.image_url ?? null) as string | null, ...((updates.gallery as string[]) ?? [])].filter(Boolean) as string[];
    await deleteRemovedManagedImages(prevRefs, newRefs);
  }

  // Slice 15: do not mislabel a plain edit as a publish/unpublish event.
  const prevStatus = prevProduct?.status ?? null;
  const nextStatus = updates.status as "draft" | "published";
  const statusChanged = prevStatus !== nextStatus;
  await logAudit({
    action: statusChanged ? (nextStatus === "published" ? "product_published" : "product_unpublished") : "product_updated",
    entity: "products",
    entity_id: id,
    details: { name: updates.name, status: nextStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/product/${slug}`);

  return { success: "Product updated." };
}

export async function setProductStatusAction(id: string, status: "draft" | "published") {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw error;

  await logAudit({
    action: status === "published" ? "product_published" : "product_unpublished",
    entity: "products",
    entity_id: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;

  await logAudit({
    action: "product_deleted",
    entity: "products",
    entity_id: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

// ============================================================
// CATEGORIES
// ============================================================

export async function createCategoryAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const image_url = String(formData.get("image_url") ?? "").trim() || null;
  const active = formData.get("active") !== null ? formData.get("active") === "on" : true;
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  const sort_order = sortOrderRaw !== "" && Number.isFinite(Number(sortOrderRaw)) ? Math.max(0, Math.floor(Number(sortOrderRaw))) : 0;

  if (!name) return { error: "Category name is required." };

  const slug = String(formData.get("slug") ?? "").trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, description, image_url, active, sort_order })
    .select("id")
    .single();
  if (error) return { error: safeDbError("create category", error) };

  await logAudit({
    action: "category_created",
    entity: "categories",
    entity_id: data.id,
    details: { name, active, sort_order },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");

  return { success: "Category added." };
}

export async function toggleCategoryActiveAction(id: string, active: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ active }).eq("id", id);
  if (error) throw error;
  await logAudit({
    action: "category_updated",
    entity: "categories",
    entity_id: id,
    details: { active },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function updateCategoryAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const updates: Record<string, unknown> = {};
  const name = String(formData.get("name") ?? "").trim();
  if (name) updates.name = name;
  const slug = String(formData.get("slug") ?? "").trim();
  if (slug) updates.slug = slug;
  const description = String(formData.get("description") ?? "").trim();
  updates.description = description || null;
  const image_url = String(formData.get("image_url") ?? "").trim();
  updates.image_url = image_url || null;
  const sortOrderRaw = String(formData.get("sort_order") ?? "").trim();
  if (sortOrderRaw !== "") {
    updates.sort_order = Number.isFinite(Number(sortOrderRaw)) ? Math.max(0, Math.floor(Number(sortOrderRaw))) : 0;
  }

  const { data: prevCategory } = await supabase
    .from("categories")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").update(updates).eq("id", id);
  if (error) return { error: safeDbError("update category", error) };
  // Slice 15: delete replaced category image (best-effort, DB-first).
  if (prevCategory?.image_url) {
    const newUrl = updates.image_url as string | null;
    if (newUrl !== prevCategory.image_url) {
      await deleteRemovedManagedImages([prevCategory.image_url], newUrl ? [newUrl] : []);
    }
  }

  await logAudit({
    action: "category_updated",
    entity: "categories",
    entity_id: id,
    details: { name: updates.name, has_image: !!image_url },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
  return { success: "Category updated." };
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
  await logAudit({
    action: "category_deleted",
    entity: "categories",
    entity_id: id,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/");
}

// ============================================================
// SITE CONTENT
// ============================================================

export async function setSiteContentAction(
  key: string,
  value: string
): Promise<{ success: string } | { error: string }> {
  await requireAdmin();

  // Slice 16: strict CMS allowlist — the browser cannot write arbitrary
  // site_content keys. Only fields declared in cms-fields.ts are editable.
  const fieldKey = String(key ?? "");
  if (!isCmsContentKey(fieldKey)) {
    return { error: "Unknown content field." };
  }

  // Category hero keys must map to a real, active category.
  let isImage = false;
  if (fieldKey.startsWith(CATEGORY_HERO_PREFIX)) {
    const supabaseCheck = await createClient();
    const { data: cat } = await supabaseCheck
      .from("categories")
      .select("slug, active")
      .eq("slug", fieldKey.slice(CATEGORY_HERO_PREFIX.length))
      .maybeSingle();
    if (!cat || !cat.active) {
      return { error: "Unknown category." };
    }
    isImage = true;
  } else {
    const field = CMS_STATIC_FIELD_BY_KEY[fieldKey];
    if (!field) return { error: "Unknown content field." };
    isImage = field.type === "image";
  }

  const nextValue = String(value ?? "");
  if (isImage) {
    if (nextValue.length > CMS_IMAGE_VALUE_MAX_LENGTH) {
      return { error: "That image reference is too long." };
    }
    if (nextValue !== "") {
      const managed = deriveManagedStoragePath(nextValue);
      if (!managed) {
        return { error: "That image is not a managed Treadville image." };
      }
    }
  } else {
    if (nextValue.length > CMS_TEXT_MAX_LENGTH) {
      return { error: `Content is too long (max ${CMS_TEXT_MAX_LENGTH} characters).` };
    }
  }

  const supabase = await createClient();

  // Slice 16: snapshot the current value so a replaced managed image can be
  // retired through the approved Slice 15 lifecycle (DB-first, storage-after).
  const { data: prevRow } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", fieldKey)
    .maybeSingle();
  const prevValue = prevRow?.value ?? "";

  const { error } = await supabase
    .from("site_content")
    .upsert({ key: fieldKey, value: nextValue, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return { error: safeDbError("save site content", error) };

  // Retire the previous managed image only after the reference has moved.
  if (isImage && prevValue && prevValue !== nextValue) {
    await deleteRemovedManagedImages([prevValue], nextValue ? [nextValue] : []);
  }

  await logAudit({
    action: "content_updated",
    entity: "site_content",
    entity_id: fieldKey,
    details: { kind: isImage ? "image" : "text", value_length: nextValue.length },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/origins");
  revalidatePath("/quality");
  revalidatePath("/export");
  revalidatePath("/shop/[category]", "page");
  return { success: "Saved." };
}

// ============================================================
// ENQUIRIES
// ============================================================

export async function setEnquiryStatusAction(
  id: string,
  status: "new" | "in_review" | "responded" | "closed"
) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) throw error;

  await logAudit({
    action: "enquiry_status_changed",
    entity: "enquiries",
    entity_id: id,
    details: { status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiryAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) throw error;

  await logAudit({
    action: "enquiry_deleted",
    entity: "enquiries",
    entity_id: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}

// ============================================================
// ORDERS — Slice 3 (admin order queue + order detail)
// ============================================================

export async function setOrderStatusAction(
  id: string,
  status: string
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  // Server-side validation even though the UI only offers known values:
  // defense in depth against a forged/malformed action payload. The schema
  // CHECK constraint on orders.status is the final guard.
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return { error: "Invalid order status." };
  }

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (readError || !current) {
    return { error: "Order not found." };
  }

  if (current.status === status) return { success: true };

  // Slice 5: light state machine. Free transitions are gone — only the
  // transitions in ORDER_TRANSITIONS (order-status.ts) are allowed. Reject
  // directly here so a forged action payload cannot bypass the UI. Message
  // names the attempted transition so the admin understands the failure.
  const from = current.status as OrderStatus;
  const allowed = nextOrderStatuses(from);
  if (!allowed.includes(status as OrderStatus)) {
    const fromLabel = ORDER_STATUS_LABELS[from] ?? from;
    const allowedText = allowed.length > 0 ? allowed.join(", ") : "none — this status is terminal";
    return {
      error: `Cannot change order status from "${fromLabel}" to "${String(status)}". Allowed next statuses: ${allowedText}.`,
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { error: safeDbError("update order status", error) };
  }

  await logAudit({
    action: "order_status_changed",
    entity: "orders",
    entity_id: id,
    details: { from, to: status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`, "page");

  return { success: true };
}

export async function updateOrderNotesAction(
  id: string,
  internalNotes: string
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const value = String(internalNotes ?? "").trim() || null;

  const supabase = await createClient();
  const { data: current, error: readError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (readError || !current) {
    return { error: "Order not found." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ internal_notes: value, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { error: safeDbError("update order notes", error) };
  }

  await logAudit({
    action: "order_notes_updated",
    entity: "orders",
    entity_id: id,
    details: { updated: true, length: value?.length ?? 0 },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`, "page");

  return { success: true };
}

// ============================================================
// ORDERS — Slice 5 (customer communication, manual send + record)
// ============================================================

export async function logOrderCommunicationAction(
  orderId: string,
  channel: string,
  messageSummary: string
): Promise<{ success: true } | { error: string }> {
  const user = await requireAdmin();

  // Server-side validation of the channel against the CHECK set, mirroring
  // the order_communications.channel constraint. The DB CHECK is the final
  // guard, but reject early with a clear message rather than a 500.
  if (!ORDER_COMMUNICATION_CHANNELS.includes(channel as (typeof ORDER_COMMUNICATION_CHANNELS)[number])) {
    return { error: `Invalid channel "${channel}". Allowed: ${ORDER_COMMUNICATION_CHANNELS.join(", ")}.` };
  }

  const summary = String(messageSummary ?? "").trim();
  if (!summary) {
    return { error: "Message summary is required." };
  }
  if (summary.length > ORDER_COMMUNICATION_MAX_LENGTH) {
    return {
      error: `Message summary is too long (max ${ORDER_COMMUNICATION_MAX_LENGTH} characters).`,
    };
  }

  const supabase = await createClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, reference_number")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return { error: "Order not found." };
  }

  // Only the communicated content is recorded — no delivery state, no read
  // receipt. sent_by snapshots the admin (uuid + email mirroring audit_log's
  // actor convention so the history can show *who* sent it without reading
  // auth.users, which PostgREST never exposes).
  const { data: inserted, error } = await supabase
    .from("order_communications")
    .insert({
      order_id: order.id,
      channel: channel as (typeof ORDER_COMMUNICATION_CHANNELS)[number],
      message_summary: summary,
      sent_by: user.id,
      sent_by_email: user.email || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: safeDbError("log order communication", error) };
  }

  await logAudit({
    action: "order_communication_logged",
    entity: "order_communications",
    entity_id: inserted.id,
    details: {
      order_id: order.id,
      reference_number: order.reference_number,
      channel,
      summary_length: summary.length,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`, "page");

  return { success: true };
}

// ============================================================
// USER MANAGEMENT (SYSTEM_ADMIN only)
// ============================================================

export async function inviteAdminAction(email: string, role: "OWNER" | "SYSTEM_ADMIN") {
  const user = await requireRole(["SYSTEM_ADMIN"]);

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  const serviceSupabase = await createServiceRoleClient();
  if (!serviceSupabase) {
    return { error: "Service role not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment." };
  }

  const { data, error } = await (serviceSupabase as any).auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login`,
    app_metadata: { role },
  });

  if (error) {
    return { error: safeDbError("send invitation", error) };
  }

  if (data?.user) {
    // Create profile entry
    await serviceSupabase.from("profiles").upsert({
      id: data.user.id,
      display_name: null,
    });
    // Mirror role in admin_roles for management listing/audit. The JWT
    // role claim in app_metadata is the source of truth for access control.
    await serviceSupabase.from("admin_roles").upsert({
      user_id: data.user.id,
      role,
    });
  }

  await logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "user_invited",
    entity: "admin_users",
    entity_id: data?.user?.id ?? null,
    details: { email, role },
  });

  revalidatePath("/admin/users");
  return { success: `Invitation sent to ${email}.` };
}

export async function setUserRoleAction(userId: string, role: "OWNER" | "SYSTEM_ADMIN") {
  const user = await requireRole(["SYSTEM_ADMIN"]);
  const serviceSupabase = await createServiceRoleClient();
  if (!serviceSupabase) throw new Error("Service role not configured");

  const { error } = await serviceSupabase.from("admin_roles").upsert({ user_id: userId, role });
  if (error) throw error;

  // Update JWT role claim so the new role takes effect on next sign-in.
  const { error: metaErr } = await (serviceSupabase as any).auth.admin.updateUserById(userId, {
    app_metadata: { role },
  });
  if (metaErr) throw metaErr;

  await logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "role_changed",
    entity: "admin_users",
    entity_id: userId,
    details: { role },
  });

  revalidatePath("/admin/users");
}

export async function removeAdminRoleAction(userId: string) {
  const user = await requireRole(["SYSTEM_ADMIN"]);
  if (userId === user.id) {
    throw new Error("You cannot remove your own admin role.");
  }

  const serviceSupabase = await createServiceRoleClient();
  if (!serviceSupabase) throw new Error("Service role not configured");

  const { error } = await serviceSupabase.from("admin_roles").delete().eq("user_id", userId);
  if (error) throw error;

  // Remove JWT role claim so the role revoke takes effect on next sign-in.
  const { error: metaErr } = await (serviceSupabase as any).auth.admin.updateUserById(userId, {
    app_metadata: { role: null },
  });
  if (metaErr) throw metaErr;

  await logAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: "role_removed",
    entity: "admin_users",
    entity_id: userId,
  });

  revalidatePath("/admin/users");
}

// ============================================================
// ARTICLES — Phase 20 Journal CMS
// ============================================================

export type ArticleFormState = {
  error?: string;
  success?: string;
};

export async function createArticleAction(
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const slug = String(formData.get("slug") ?? "").trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  // Sanitize on write so hostile Tiptap HTML never enters the database and the
  // admin editor can never reload raw stored markup (Finding H1).
  const body = String(formData.get("body") ?? "").trim()
    ? sanitizeArticleHtml(String(formData.get("body") ?? ""))
    : null;
  const author_name = String(formData.get("author_name") ?? "").trim() || null;
  const cover_image_url = String(formData.get("cover_image_url") ?? "").trim() || null;
  const wantsPublished = formData.get("status") === "published";
  const status: "draft" | "published" = wantsPublished ? "published" : "draft";
  const published_at = status === "published" ? new Date().toISOString() : null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({ title, slug, excerpt, body, author_name, cover_image_url, status, published_at })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("articles_slug_key")) {
      return { error: "An article with this slug already exists. Choose a different slug." };
    }
    return { error: safeDbError("create article", error) };
  }

  await logAudit({
    action: "article_created",
    entity: "articles",
    entity_id: data.id,
    details: { title, status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/journal");
  revalidatePath("/journal");

  return { success: "Article saved." };
}

export async function updateArticleAction(
  id: string,
  _prev: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Title is required." };

  const updates: Record<string, unknown> = {
    title,
    updated_at: new Date().toISOString(),
  };

  const slug = String(formData.get("slug") ?? "").trim();
  if (slug) updates.slug = slug;
  updates.excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  updates.body = String(formData.get("body") ?? "").trim()
    ? sanitizeArticleHtml(String(formData.get("body") ?? ""))
    : null;
  updates.author_name = String(formData.get("author_name") ?? "").trim() || null;
  updates.cover_image_url = String(formData.get("cover_image_url") ?? "").trim() || null;

  const supabase = await createClient();
  const { data: prevArticle } = await supabase
    .from("articles")
    .select("cover_image_url")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("articles").update(updates).eq("id", id);
  if (error) return { error: safeDbError("update article", error) };
  // Slice 15: delete replaced cover image (best-effort, DB-first).
  if (prevArticle?.cover_image_url) {
    const newCover = updates.cover_image_url as string | null;
    if (newCover !== prevArticle.cover_image_url) {
      await deleteRemovedManagedImages([prevArticle.cover_image_url], newCover ? [newCover] : []);
    }
  }

  await logAudit({
    action: "article_updated",
    entity: "articles",
    entity_id: id,
    details: { title },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/journal");
  revalidatePath("/journal");

  return { success: "Article updated." };
}

export async function setArticleStatusAction(id: string, status: "draft" | "published") {
  await requireAdmin();
  const supabase = await createClient();

  const updates: Record<string, unknown> = { status };
  if (status === "published") {
    updates.published_at = new Date().toISOString();
  } else {
    updates.published_at = null;
  }

  const { error } = await supabase.from("articles").update(updates).eq("id", id);
  if (error) throw error;

  await logAudit({
    action: status === "published" ? "article_published" : "article_unpublished",
    entity: "articles",
    entity_id: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;

  await logAudit({
    action: "article_deleted",
    entity: "articles",
    entity_id: id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/journal");
  revalidatePath("/journal");
}

// ============================================================
// STORAGE — Phase 20 image upload
// ============================================================

export type UploadUrlResult = {
  uploadUrl: string;
  storagePath: string;
  publicUrl: string;
  bucket: string;
  token: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

// Storage bucket is fixed server-side (L5): a client-supplied bucket could
// steer signed-upload URLs at arbitrary buckets. site-images is the single
// intended image bucket; its public read is intentional for product, article
// and category images.
const IMAGE_UPLOAD_BUCKET = "site-images";

// ---- Slice 15 helpers ------------------------------------------------

const STORAGE_PATH_MAX = 500;

function isSafeRelativePath(path: string): boolean {
  if (!path || path.length > STORAGE_PATH_MAX) return false;
  if (path.startsWith("/") || path.endsWith("/")) return false;
  if (/^\s|\s$/.test(path)) return false;
  const segments = path.split("/");
  for (const seg of segments) {
    if (!seg || seg === "." || seg === "..") return false;
    if (!/^[\w.\-+]+$/.test(seg)) return false;
  }
  return true;
}

function deriveManagedStoragePath(urlOrPath: string): { bucket: string; path: string } | null {
  const value = String(urlOrPath ?? "").trim();
  if (!value) return null;
  const marker = "/storage/v1/object/public/";
  if (!value.includes(marker)) return null;

  // Managed refs are only the public URLs produced by this app's project.
  const projectUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  if (!projectUrl) return null;
  if (!value.startsWith(projectUrl + marker)) return null;

  const rest = value.slice(value.indexOf(marker) + marker.length);
  const [bucketRaw, ...pathParts] = rest.split("/");
  const bucket = decodeURIComponent(bucketRaw);
  const path = pathParts.map((p) => decodeURIComponent(p)).join("/");
  if (bucket !== IMAGE_UPLOAD_BUCKET || !isSafeRelativePath(path)) return null;
  return { bucket, path };
}

function parseGalleryValue(raw: string): string[] {
  if (!raw) return [];
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return []; }
  if (!Array.isArray(parsed)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of parsed) {
    if (typeof item !== "string") continue;
    const v = item.trim();
    if (!v || !/^https?:\/\//.test(v)) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out.slice(0, 12);
}

async function deleteManagedImage(storagePath: string): Promise<{ success: true } | { error: string }> {
  if (!isSafeRelativePath(storagePath)) return { error: "Invalid storage path." };
  const supabase = await createServiceRoleClient();
  if (!supabase) return { error: "Storage service not configured." };
  const { error: storageError } = await (supabase.storage as any)
    .from(IMAGE_UPLOAD_BUCKET)
    .remove([storagePath]);
  if (storageError) return { error: safeDbError("delete managed image", storageError) };
  await (supabase as any).from("storage_files").delete().eq("storage_path", storagePath);
  await logAudit({
    action: "image_deleted",
    entity: "storage_files",
    entity_id: storagePath,
    details: { bucket: IMAGE_UPLOAD_BUCKET },
  });
  return { success: true };
}

async function deleteRemovedManagedImages(prevUrls: string[], currentUrls: string[]): Promise<void> {
  const removed = prevUrls.filter((u) => !currentUrls.includes(u));
  const derived = Array.from(new Set(removed))
    .map((u) => deriveManagedStoragePath(u))
    .filter((d): d is NonNullable<typeof d> => d !== null);
  for (const d of derived) {
    const res = await deleteManagedImage(d.path);
    if ("error" in res) {
      console.error("[Slice 15] best-effort image deletion failed:", d.path, res.error);
    }
  }
}

export async function createImageUploadAction(
  originalFilename: string,
  mimeType: string,
  fileSize: number
): Promise<UploadUrlResult | { error: string }> {
  await requireAdmin();

  if (!ALLOWED_MIME.includes(mimeType)) {
    return { error: "Unsupported file format. Please use JPG, PNG, or WebP." };
  }
  if (fileSize > MAX_FILE_SIZE) {
    return { error: "That image is too large. Please choose an image under 10 MB." };
  }

  const supabase = await createServiceRoleClient();
  if (!supabase) {
    return { error: "Storage service not configured. Set SUPABASE_SERVICE_ROLE_KEY in environment." };
  }

  // Generate safe filename: <timestamp>-<random>-<slug>
  const ext = originalFilename.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
  const random = Math.random().toString(36).slice(2, 10);
  const ts = Date.now();
  const storagePath = `${ts}-${random}.${safeExt}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.storage as any)
    .from(IMAGE_UPLOAD_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return { error: safeDbError("prepare image upload", error) };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: publicData } = (supabase.storage as any)
    .from(IMAGE_UPLOAD_BUCKET)
    .getPublicUrl(storagePath);

  return {
    uploadUrl: data.signedUrl,
    storagePath,
    publicUrl: publicData.publicUrl,
    bucket: IMAGE_UPLOAD_BUCKET,
    token: data.token,
  };
}

export async function recordImageUploadAction(
  storagePath: string,
  originalFilename: string,
  mimeType: string,
  fileSize: number
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();
  const supabase = await createServiceRoleClient();
  if (!supabase) return { error: "Storage service not configured." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("storage_files").insert({
    bucket: IMAGE_UPLOAD_BUCKET,
    storage_path: storagePath,
    original_filename: originalFilename,
    mime_type: mimeType,
    file_size: fileSize,
  });

  if (error) {
    return { error: safeDbError("record image upload", error) };
  }

  await logAudit({
    action: "image_uploaded",
    entity: "storage_files",
    entity_id: storagePath,
    details: { bucket: IMAGE_UPLOAD_BUCKET, original_filename: originalFilename, file_size: fileSize },
  });

  return { success: true };
}

export async function deleteImageAction(
  reference: string
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();
  const managed = deriveManagedStoragePath(String(reference ?? ""));
  if (!managed) return { error: "Not a managed image reference." };
  return deleteManagedImage(managed.path);
}

// ============================================================
// PROFILE — Phase 20 self-service account management
// ============================================================

export async function updateProfileAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requireAdmin();
  const displayName = String(formData.get("display_name") ?? "").trim() || null;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profiles") as any)
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: safeDbError("update profile", error) };
  }

  await logAudit({
    action: "profile_updated",
    entity: "profiles",
    entity_id: user.id,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/settings");

  return { success: "Profile updated." };
}

// ============================================================
// PRODUCT METADATA — Phase 22
// ============================================================

export async function loadProductWithMetadata(productId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: product, error: pError } = await supabase
    .from("products")
    .select("*, categories!inner(name, slug)")
    .eq("id", productId)
    .single();

  if (pError || !product) return null;

  const { data: metadataRows, error: mError } = await supabase
    .from("product_metadata")
    .select("key, value")
    .eq("product_id", productId);

  const metadata: Record<string, string> = {};
  if (!mError && metadataRows) {
    for (const row of metadataRows) {
      if (row.value) metadata[row.key] = row.value;
    }
  }

  return { ...product, metadata };
}

export async function upsertProductMetadata(
  productId: string,
  metadata: Record<string, string>
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();
  const supabase = await createClient();

  const rows = Object.entries(metadata)
    .filter(([, value]) => value.trim() !== "")
    .map(([key, value]) => ({
      product_id: productId,
      key,
      value: value.trim(),
      updated_at: new Date().toISOString(),
    }));

  if (rows.length > 0) {
    const { error } = await supabase
      .from("product_metadata")
      .upsert(rows, { onConflict: "product_id,key" });
    if (error) return { error: safeDbError("save product metadata", error) };
  }

  // Delete keys that were cleared
  const clearedKeys = Object.entries(metadata)
    .filter(([, value]) => value.trim() === "")
    .map(([key]) => key);
  if (clearedKeys.length > 0) {
    await supabase
      .from("product_metadata")
      .delete()
      .eq("product_id", productId)
      .in("key", clearedKeys);
  }

  // Revalidate the product's concrete URL. Metadata lives on the product
  // detail page, so revalidating the unresolved pattern is never enough.
  const { data: product } = await supabase
    .from("products")
    .select("slug")
    .eq("id", productId)
    .maybeSingle();
  if (product?.slug) {
    revalidatePath(`/product/${product.slug}`, "page");
  }
  revalidatePath("/admin/products");
  return { success: true };
}

// ============================================================
// CHANGE PASSWORD — Phase 22
// ============================================================

export async function changePasswordAction(
  _prev: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const user = await requireAdmin();
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.auth as any).updateUser({ password: newPassword });

  if (error) {
    return { error: safeDbError("update password", error) };
  }

  await logAudit({
    action: "password_changed",
    entity: "profiles",
    entity_id: user.id,
  });

  return { success: "Password updated." };
}


