// Type declarations for @supabase/ssr
// The package ships JS-only; this makes TypeScript happy.

declare module "@supabase/ssr" {
  import type { SupabaseClient } from "@supabase/supabase-js";
  import type { CookieOptions } from "@supabase/supabase-js";

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        getAll(): Array<{ name: string; value: string }>;
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>
        ): void;
      };
    }
  ): SupabaseClient;

  export function createBrowserClient(
    supabaseUrl: string,
    supabaseKey: string
  ): SupabaseClient;

  export { createServerClient as createServerClient };
}
