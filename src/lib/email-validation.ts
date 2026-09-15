// Server-authoritative, intentionally practical email validation for the public
// enquiry path (L6). Not a full RFC 5322 parser: it rejects the injection and
// malformed patterns that matter in practice while accepting standard
// real-world addresses. Dependency-free and side-effect-free so the verification
// harness can exercise it directly.

const CONTROLS = /[\u0000-\u001F\u007F]/;
const LOCAL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN = /^[A-Za-z0-9.-]+$/;
const DOMAIN_LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD = /^[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  if (typeof value !== "string") return false;

  const email = value.trim();
  if (email.length === 0) return false;
  if (email.length > 254) return false;
  if (CONTROLS.test(email)) return false; // control chars incl. newline / CRLF injection

  const at = email.indexOf("@");
  if (at <= 0) return false; // missing, or empty local part
  if (at !== email.lastIndexOf("@")) return false; // multiple @
  if (at === email.length - 1) return false; // empty domain

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);

  if (local.length > 64) return false;
  if (!LOCAL.test(local)) return false; // spaces / other invalid local chars
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;

  if (domain.length > 253) return false;
  if (!DOMAIN.test(domain)) return false; // only letters, digits, dots, hyphens
  if (domain.startsWith(".") || domain.endsWith(".") || domain.includes("..")) return false;
  if (!domain.includes(".")) return false; // require a dot-separated suffix

  const labels = domain.split(".");
  const tld = labels[labels.length - 1];
  if (!TLD.test(tld)) return false; // TLD must be plain letters
  for (const label of labels) {
    if (!DOMAIN_LABEL.test(label)) return false; // non-empty, no leading/trailing hyphen
  }
  return true;
}