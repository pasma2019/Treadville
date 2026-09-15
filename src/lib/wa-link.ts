// WhatsApp click-to-chat link construction (Slice 5).
// Client-safe pure helpers: the admin UI builds the wa.me link live as the
// message is edited. No server call, no credentials, no message-provider SDK.

const WA_COUNTRY_CODE_KE = "254";

// Normalize a phone to the digits-only international form wa.me requires,
// stripping formatting (spaces, dashes, "(+)" characters) entirely.
//
//   "0712 345 678" / "+254712345678" / "254712345678" -> 254712345678
//   "07########" or "01########"                       -> 254 <9-10 digits>
//   "+44 7911 123456"                                 -> 447911123456 (as captured)
//   212-555-0100 (no country code)                    -> 2125550100 (pass-through —
//                                                         un-inferable, see notes)
//
// Verdict (see Slice 5 report): orders.customer_phone is the RAW intake
// snapshot (Slice 1 stored the phone as submitted, never canonicalized on the
// order row). canonical_ke_phone() only ever touches customers.phone in the
// DB and is not client-importable, so the snapshot is normalized here instead.
// Kenyan locals (07x/01x) are caught by the 0 -> 254 rewrite. Numbers already
// carrying a country code pass through unchanged. A bare subscriber number
// with no country code cannot be inferred — wa.me would interpret it against
// the recipient's own locale, which is undocumented and unreliable, so it is
// flagged rather than guessed.
export function normalizeWaPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits.length) return null;
  if (digits.startsWith("0") && digits.length >= 10) {
    return WA_COUNTRY_CODE_KE + digits.slice(1);
  }
  if (digits.startsWith(WA_COUNTRY_CODE_KE)) return digits;
  return digits;
}

export function buildWaLink(
  phone: string | null | undefined,
  message: string
): string | null {
  const digits = normalizeWaPhone(phone);
  if (!digits) return null;
  const text = encodeURIComponent(message.trim());
  return `https://wa.me/${digits}?text=${text}`;
}