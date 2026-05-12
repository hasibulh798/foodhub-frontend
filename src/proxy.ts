import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/cart",
  "/checkout",
  "/order-success",
];

const AUTH_ONLY_ROUTES = ["/login", "/signup"];

function startsWith(pathname: string, routes: string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + "/"));
}

// ✅ Cookie forward করে backend থেকে session নাও
async function getSession(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/auth/get-session`,
      {
        headers: {
          // ✅ Browser এর cookie backend-এ পাঠাও
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!response.ok) return null;

    const session = await response.json();
    return session?.user ? session : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ userService.getSession() না, এটা ব্যবহার করো
  const session = await getSession(request);
  const isLoggedIn = !!session?.user;

  if (isLoggedIn && startsWith(pathname, AUTH_ONLY_ROUTES)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isLoggedIn && startsWith(pathname, PROTECTED_ROUTES)) {
    const dest = new URL("/login", request.url);
    dest.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(dest);
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/cart",
    "/checkout",
    "/order-success",
    "/login",
    "/signup",
  ],
};