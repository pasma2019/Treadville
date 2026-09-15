import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Slice 12 — CSP / security headers baseline + Supabase session / admin proxy.
//
// IMPORTANT ARCHITECTURE NOTE:
// This proxy was previously located at the repo root (`proxy.ts`). Because the
// app directory is `src/app`, Next.js only scans `<app parent>` (i.e. `src/`) for
// the `proxy.ts|middleware.ts` convention — the root file was compiled but never
// REGISTERED (`.next/server/middleware-manifest.json` was empty). This file is the
// same mechanism, relocated to `src/` so the documented routing/security layer
// actually runs, and extended for request-time CSP.
//
// Request lifecycle:
//      Browser -> proxy.ts -> Supabase Auth session refresh + /admin protection
//                           -> request CSP (per-request nonce) attached
// The nonce is generated per request and made available to Next.js SSR via the
// `x-nonce` request header (Next extracts the nonce from the request CSP header and
// applies it to its own inline bootstrap / flight-data scripts and bundles — see
// node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).

const SUPABASE_ORIGIN = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;

function buildCsp(nonce: string, isDev: boolean, requestIsHttps: boolean) {
  const images = ["'self'", "data:", "blob:", SUPABASE_ORIGIN]
    .filter(Boolean)
    .join(" ");
  const connects = ["'self'", SUPABASE_ORIGIN].filter(Boolean).join(" ");

  const directives = [
    "default-src 'self'",
    // Inline bootstrap / RSC flight-data scripts are authorized ONLY via the
    // per-request nonce (Next applies it automatically during dynamic SSR).
    // 'strict-dynamic' lets already-trusted (nonce'd) scripts load additional
    // scripts; 'self' remains as a fallback for browsers without
    // strict-dynamic. No 'unsafe-inline', no 'unsafe-eval' in production.
    // React dev needs 'unsafe-eval' for error-stack reconstruction.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // 'unsafe-inline' (STYLES only) is a deliberate compatibility allowance:
    // the app SSR's 89 React `style={{...}}` attributes cannot be authorized via
    // nonce/hash, and the dev webpack style-loader injects <style> elements.
    "style-src 'self' 'unsafe-inline'",
    `img-src ${images}`,
    "font-src 'self'", // next/font/google is self-hosted at build time
    `connect-src ${connects}`, // browser Supabase client (auth/REST/storage) + self
    "form-action 'self'", // server actions / enquiry + order forms post same-origin
    "base-uri 'self'",
    "frame-src 'none'", // no iframes/embeds are used
    "frame-ancestors 'none'", // never embeddable (primary clickjacking control)
    "object-src 'none'", // no plugins/objects
    requestIsHttps ? "upgrade-insecure-requests" : "",
  ]
    .filter(Boolean)
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return directives;
}

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const requestIsHttps =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https";
  const csp = buildCsp(nonce, isDev, requestIsHttps);

  // Stamp the nonce + CSP onto the REQUEST headers in place. The Supabase cookie
  // writer below re-wraps `request` into a fresh NextResponse, so mutating
  // request.headers (rather than passing a detached clone) keeps x-nonce and the
  // request CSP visible to Next.js SSR on every re-wrap.
  request.headers.set("x-nonce", nonce);
  request.headers.set("Content-Security-Policy", csp);

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: unknown }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any)
          );
        },
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: { user } } = await (supabase.auth as any).getUser() as { data: { user: { id: string } | null } };

  const pathname = request.nextUrl.pathname;

  const isPublicAdminRoute =
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/admin/forgot-password" ||
    pathname.startsWith("/admin/forgot-password/") ||
    pathname === "/admin/reset-password" ||
    pathname.startsWith("/admin/reset-password/");

  if (user && pathname === "/admin/login") {
    const redirect = NextResponse.redirect(new URL("/admin", request.url));
    redirect.headers.set("Content-Security-Policy", csp);
    return redirect;
  }

  if (!user && pathname.startsWith("/admin") && !isPublicAdminRoute) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    const redirect = NextResponse.redirect(url);
    redirect.headers.set("Content-Security-Policy", csp);
    return redirect;
  }

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|design-reference).*)",
  ],
};