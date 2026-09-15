import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Slice 12 — static (non-nonce) security headers.
  // The CSP header itself is request-time (per-request nonce) and is emitted by
  // proxy.ts; the headers below are static and safe to apply globally.
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // MIME-sniffing protection on all responses.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Trim referrers cross-origin; keep full URLs same-origin. No strict
          // mode: the storefront intentionally relies on default behavior for
          // shared links and the app posts only own forms.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Deny browser features the application never uses (no camera, mic,
          // geolocation, payments, USB, motion/XR sensors, fullscreen).
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), gyroscope=(), accelerometer=(), magnetometer=(), xr-spatial-tracking=(), fullscreen=()",
          },
          // Legacy clickjacking parity for clients without CSP frame-ancestors
          // support; frame-ancestors 'none' (in proxy.ts CSP) is the primary
          // modern control.
          { key: "X-Frame-Options", value: "DENY" },
          // HSTS starting baseline (180 days, subdomains). Deliberately no
          // `preload` until the production domain/certificate posture is final.
          {
            key: "Strict-Transport-Security",
            value: "max-age=15552000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;