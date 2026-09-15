// Shared serialization for JSON-LD embedded in a
// <script type="application/ld+json"> element.
//
// JSON.stringify output is NOT safe to inject via dangerouslySetInnerHTML: a
// stored string value such as "</script><script>alert(1)</script>" would
// terminate the script element early (stored/self-XSS). This helper escapes
// the HTML-sensitive characters as JSON Unicode escapes, which are valid JSON
// (JSON.parse resolves \u003c back to "<") so the serialized data survives
// byte-for-byte identical once parsed by a consumer:
//
//   <  ->  \u003c
//   >  ->  \u003e
//   &  ->  \u0026
//
// Escaping "<" also neutralizes the "<!--" sequence, which would otherwise put
// the HTML tokenizer into "script data escaped" state and allow nested
// script-open changes. Since "<", ">" and "&" never appear outside string
// values in JSON syntax, a global replace over the serialized string is safe.
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}