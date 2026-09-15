import DOMPurify from "isomorphic-dompurify";

// Single sanitization entry point for admin-authored article HTML that reaches
// the storefront. Article bodies are written in the admin Tiptap editor and
// rendered verbatim on journal/[slug] via dangerouslySetInnerHTML, so they are
// a candidate for stored XSS (Finding H1).
//
// Library choice: DOMPurify via isomorphic-dompurify (v4, Node + browser).
// - DOMPurify is the widely adopted reference HTML sanitizer, maintained by
//   agitmuller and kkomelin with a standing security review relationship to
//   Cure53; it ships an audited default allowlist that strips scripts,
//   event-handler attributes, javascript:/data: URI schemes, <iframe>, <embed>
//   and similar script-capable markup out of the box.
// - isomorphic-dompurify wraps DOMPurify with a jsdom environment so the same
//   code runs in Server Components/RSC and on the client. It is actively
//   maintained (4.x, 2025 releases) and is the standard pairing for
//   server-rendered Next.js apps.
// - Chosen over sanitize-html and over a hand-rolled allowlist because the
//   field-tested default allowlist preserves the full Tiptap/StarterKit output
//   set (h2/h3, p, blockquote, ul/ol/li, pre/code, strong/em, a, br, hr, img)
//   with far lower regression risk than maintaining our own tag list.
//
// Strategy: sanitize at BOTH boundaries with this one helper —
//   1. when an article is saved (admin-actions create/update), so hostile
//      markup never enters the database and the admin editor never loads it,
//   2. at render time on journal/[slug], so any pre-existing rows are defused
//      without a destructive backfill (existing articles stay unmodified).
export function sanitizeArticleHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    // Tiptap's link extension emits target="_blank" rel="noopener noreferrer";
    // these are safe passthrough attributes but not in DOMPurify's default
    // allowlist.
    ADD_ATTR: ["target", "rel"],
    // Belt-and-braces: style markup and interactive/form/embedded elements are
    // already excluded by DOMPurify defaults; forbid them explicitly so the
    // policy is self-documenting and robust to default-allowlist drift.
    FORBID_TAGS: [
      "style",
      "form",
      "input",
      "button",
      "select",
      "textarea",
      "iframe",
      "object",
      "embed",
      "video",
      "audio",
      "canvas",
      // Tiptap never emits SVG/MathML here, so forbid them outright instead of
      // relying on DOMPurify's (already safe) in-SVG handler stripping.
      "svg",
      "math",
    ],
    FORBID_ATTR: ["style"],
    ALLOW_DATA_ATTR: false,
  });
}