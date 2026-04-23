import { NextRequest, NextResponse } from "next/server";
import { userService } from "./services/auth.service";

// ─────────────────────────────────────────────
//  Route groups
// ─────────────────────────────────────────────

/** Require a valid session. Unauthenticated → /login */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/cart",
  "/checkout",
  "/order-success",
];

/** Public-only pages. Authenticated → /dashboard */
const AUTH_ONLY_ROUTES = ["/login", "/signup"];

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

function startsWith(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

/**
 * Better Auth names the cookie exactly what you set in `advanced.cookies.session_token.name`.
 * On the server we set name: "session_token".
 *
 * In dev (HTTP) the cookie has no Secure flag → stored as "session_token".
 * In prod (HTTPS) it may be prefixed with "__Secure-" by the browser.
 * We check both so this file never needs to change between environments.
 */
function hasSessionCookie(req: NextRequest): boolean {
  const { cookies } = req;

  return !!(
    cookies.get("session_token")?.value ||
    cookies.get("better-auth.session_token")?.value ||
    cookies.get("__Secure-session_token")?.value ||
    cookies.get("__Secure-better-auth.session_token")?.value
  );
}

// ─────────────────────────────────────────────
//  Proxy  (Next.js 16 = proxy.ts / `proxy` fn)
// ─────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session, error } = await userService.getSession();

  const isLoggedIn = !!session?.user;

  // ① Authenticated user hitting a login/signup page → send to dashboard
  if (isLoggedIn && startsWith(pathname, AUTH_ONLY_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ② Unauthenticated user hitting a protected page → send to login
  if (!isLoggedIn && startsWith(pathname, PROTECTED_ROUTES)) {
    const dest = new URL("/login", request.url);
    dest.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export default proxy;

// ─────────────────────────────────────────────
//  Matcher — skip static assets & Next internals
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    "/dashboard",
    "/profile",
    "/cart",
    "/checkout",
    "/order-success",
    "/login",
    "/signup",
  ],
};
