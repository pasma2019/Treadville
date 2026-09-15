import { headers } from "next/headers";

// Minimal per-IP fixed-window submission limiter for Server Actions.
//
// This is a best-effort, in-process counter. On serverless deployments it is
// scoped to a single instance and is NOT a hard global guarantee — a
// production-grade limiter (Upstash/Redis or a database-backed counter) is a
// follow-up. It exists to throttle automated bursts on submission paths that
// otherwise have no limiting (Finding C3).

// Fixed window shared by every scene unless overridden per call.
const DEFAULT_WINDOW_MS = 60_000; // 60-second fixed window
// Max submissions per IP per window. The order path's chosen threshold: 5 per
// minute is comfortably above human checkout cadence but caps automated burst
// writes (and the Resend emails they would trigger).
const DEFAULT_MAX_ATTEMPTS = 5;

// Scenes are counter namespaces. They exist so one submission path's bursts
// cannot consume another path's budget (e.g. an enquiry flood must not
// throttle orders). Add a scene for any new Server Action using this limiter.
export const RATE_LIMIT_SCENES = {
  submission: "submission",
  enquiry: "enquiry",
} as const;

type RateLimitOptions = {
  scene?: string;
  windowMs?: number;
  maxAttempts?: number;
};

type WindowEntry = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, WindowEntry>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export async function checkSubmissionRateLimit(
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  const scene = options?.scene ?? RATE_LIMIT_SCENES.submission;
  const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS;
  const maxAttempts = options?.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;

  const requestHeaders = await headers();
  // Vercel sets x-forwarded-for at the edge proxy, so the first value is the
  // client IP. x-real-ip is a fallback for other hosts.
  const forwarded = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    realIp?.trim() ||
    "unknown";

  // Namespace the counter per scene + IP so paths never share a budget.
  const key = `${scene}:${ip}`;

  // Prune expired entries so the Map cannot grow without bound.
  const now = Date.now();
  for (const [entryKey, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(entryKey);
  }

  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= maxAttempts) {
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}