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
  "order_created",
  "order_status_changed",
  "order_notes_updated",
  "order_communication_logged",
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
    category_deleted: "Deleted category",
    article_created: "Created article",
    article_published: "Published article",
    article_unpublished: "Unpublished article",
    article_updated: "Updated article",
    article_deleted: "Deleted article",
    enquiry_submitted: "New enquiry received",
    enquiry_status_changed: "Changed enquiry status",
    enquiry_deleted: "Deleted enquiry",
    content_updated: "Updated site content",
    profile_updated: "Updated profile",
    password_changed: "Changed password",
    image_uploaded: "Uploaded image",
    image_deleted: "Deleted image",
    user_invited: "Invited admin user",
    role_changed: "Changed user role",
    role_removed: "Removed admin role",
    order_created: "New order received",
    order_status_changed: "Changed order status",
    order_notes_updated: "Updated order internal notes",
    order_communication_logged: "Logged customer communication",
  };
  return labels[action] ?? action.replace(/_/g, " ");
}
