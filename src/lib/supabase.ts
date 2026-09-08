import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud on purpose — the whole prototype's "money shot" depends on this
  // being a real backend, not silently falling back to nothing.
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Create a Supabase project, run supabase/schema.sql + seed.sql, and set these in .env.local."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Phase 28 — error surface: wrap any unhandled supabase-js error into a
// serializable log. The browser's collapsed-object view of PostgrestError
// hides code/message/hint. Use JSON.stringify so the full object lands in
// the console and any logger.
if (typeof window !== "undefined") {
  (window as unknown as { __supabaseErrorLog?: (e: unknown) => void }).__supabaseErrorLog = (e: unknown) => {
    try {
      console.error("SUPABASE ERROR:", JSON.stringify(e, Object.getOwnPropertyNames(e ?? {}), 2));
    } catch {
      console.error("SUPABASE ERROR (unserializable):", e);
    }
  };
}
