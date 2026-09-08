const BUSINESS_ACTIONS = new Set([
  "product_created",
  "product_published",
  "product_unpublished",
  "product_updated",
  "product_deleted",
  "category_created",
  "category_updated",
  "article_created",
  "article_published",
  "article_unpublished",
  "article_updated",
  "article_deleted",
  "enquiry_submitted",
  "content_updated",
  "profile_updated",
]);

export function isBusinessAction(action: string): boolean {
  return BUSINESS_ACTIONS.has(action);
}

export function formatAuditAction(action: string): string {
  const labels: Record<string, string> = {
    product_created: "Created product",
    product_published: "Published product",
    product_unpublished: "Unpublished product",
    product_updated: "Updated product",
    product_deleted: "Deleted product",
    category_created: "Created category",
    category_updated: "Updated category",
    article_created: "Created article",
    article_published: "Published article",
    article_unpublished: "Unpublished article",
    article_updated: "Updated article",
    article_deleted: "Deleted article",
    enquiry_submitted: "New enquiry received",
    content_updated: "Updated site content",
    profile_updated: "Updated profile",
    password_changed: "Changed password",
    image_uploaded: "Uploaded image",
    image_deleted: "Deleted image",
    role_invited: "Invited admin user",
    role_changed: "Changed user role",
    role_removed: "Removed admin role",
  };
  return labels[action] ?? action.replace(/_/g, " ");
}
