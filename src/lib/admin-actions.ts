"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireRole } from "@/lib/auth";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

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
    .insert({ name, slug, category_id, description, price, image_url, stock, featured, status, gallery: [] })
    .select("id")
    .single();

  if (error) {
    return { error: "Could not create product. " + error.message };
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

  // Gallery: parse JSON array from form data
  const galleryRaw = String(formData.get("gallery") ?? "");
  let gallery: string[] = [];
  if (galleryRaw) {
    try { gallery = JSON.parse(galleryRaw); } catch { gallery = []; }
  }
  updates.gallery = gallery;

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return { error: "Could not update product. " + error.message };

  await logAudit({
    action: statusRaw === "published" ? "product_published" : "product_unpublished",
    entity: "products",
    entity_id: id,
    details: { name: updates.name, status: updates.status },
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

  if (!name) return { error: "Category name is required." };

  const slug = String(formData.get("slug") ?? "").trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, description, image_url, active })
    .select("id")
    .single();
  if (error) return { error: "Could not create category. " + error.message };

  await logAudit({
    action: "category_created",
    entity: "categories",
    entity_id: data.id,
    details: { name, active },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");

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

  const { error } = await supabase.from("categories").update(updates).eq("id", id);
  if (error) return { error: "Could not update category. " + error.message };

  await logAudit({
    action: "category_updated",
    entity: "categories",
    entity_id: id,
    details: { name: updates.name, has_image: !!image_url },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
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
}

// ============================================================
// SITE CONTENT
// ============================================================

export async function setSiteContentAction(
  key: string,
  value: string
): Promise<{ success: string } | { error: string }> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) return { error: "Could not save. " + error.message };

  await logAudit({
    action: "content_updated",
    entity: "site_content",
    entity_id: key,
    details: { value_length: value.length },
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
    return { error: "Could not send invitation. " + error.message };
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
  const body = String(formData.get("body") ?? "").trim() || null;
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
    return { error: "Could not create article. " + error.message };
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
  updates.body = String(formData.get("body") ?? "").trim() || null;
  updates.author_name = String(formData.get("author_name") ?? "").trim() || null;
  updates.cover_image_url = String(formData.get("cover_image_url") ?? "").trim() || null;

  const supabase = await createClient();
  const { error } = await supabase.from("articles").update(updates).eq("id", id);
  if (error) return { error: "Could not update article. " + error.message };

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

export async function createImageUploadAction(
  bucket: string,
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
    .from(bucket)
    .createSignedUploadUrl(storagePath);

  if (error || !data) {
    return { error: "Could not prepare upload. " + (error?.message ?? "Unknown error") };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: publicData } = (supabase.storage as any)
    .from(bucket)
    .getPublicUrl(storagePath);

  return {
    uploadUrl: data.signedUrl,
    storagePath,
    publicUrl: publicData.publicUrl,
    bucket,
    token: data.token,
  };
}

export async function recordImageUploadAction(
  bucket: string,
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
    bucket,
    storage_path: storagePath,
    original_filename: originalFilename,
    mime_type: mimeType,
    file_size: fileSize,
  });

  if (error) {
    return { error: "Could not record upload. " + error.message };
  }

  await logAudit({
    action: "image_uploaded",
    entity: "storage_files",
    entity_id: storagePath,
    details: { bucket, original_filename: originalFilename, file_size: fileSize },
  });

  return { success: true };
}

export async function deleteImageAction(
  bucket: string,
  storagePath: string
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();
  const supabase = await createServiceRoleClient();
  if (!supabase) return { error: "Storage service not configured." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: storageError } = await (supabase.storage as any)
    .from(bucket)
    .remove([storagePath]);

  if (storageError) {
    return { error: "Could not delete from storage. " + storageError.message };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("storage_files").delete().eq("storage_path", storagePath);

  await logAudit({
    action: "image_deleted",
    entity: "storage_files",
    entity_id: storagePath,
    details: { bucket },
  });

  return { success: true };
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
    return { error: "Could not update profile. " + error.message };
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
    if (error) return { error: "Could not save metadata. " + error.message };
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

  revalidatePath(`/product/[slug]`, "page");
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
    return { error: "Could not update password. " + error.message };
  }

  await logAudit({
    action: "password_changed",
    entity: "profiles",
    entity_id: user.id,
  });

  return { success: "Password updated." };
}


