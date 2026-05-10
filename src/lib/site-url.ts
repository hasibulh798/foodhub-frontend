/**
 * Canonical origin of the Next.js app (where `/api/*` rewrites run).
 * Auth cookies must be set for this host — not for the raw API URL — so
 * `cookies()` and middleware see the same session the browser stores.
 */
export function getSiteOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const fromEnv = process.env.NEXT_PUBLIC_FRONTEND_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
