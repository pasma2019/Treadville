// Admin login redirect guard (L4). Only single-slash internal admin paths pass;
// anything external, protocol-relative, script/data-schemed, or malformed falls
// back to /admin. Pure and dependency-free so the harness can exercise it.

export function sanitizeAdminRedirect(next: string | null | undefined): string {
  if (typeof next !== "string") return "/admin";

  const value = next.trim();
  if (value.length === 0) return "/admin";
  if (!value.startsWith("/")) return "/admin"; // rejects https:, javascript:, data:, bare text…
  if (value.startsWith("//")) return "/admin"; // protocol-relative
  if (value.includes("\\")) return "/admin"; // backslash path tricks
  if (/[\u0000-\u001F\u007F\s]/.test(value)) return "/admin"; // control/whitespace
  if (value === "/") return "/admin";
  if (value !== "/admin" && !value.startsWith("/admin/")) return "/admin"; // admin area only
  return value;
}