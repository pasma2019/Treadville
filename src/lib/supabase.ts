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
