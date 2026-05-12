

import { cookies } from "next/headers";
import { getSiteOrigin } from "../lib/site-url";

const AUTH_SESSION_URL = `${getSiteOrigin()}/api/auth/get-session`;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = await cookies();
      const sessionToken =
        cookieStore.get("__Secure-session_token")?.value ||
        cookieStore.get("session_token")?.value;
      if (!sessionToken) return { data: null, error: "No session cookie" };
      const cookieHeader = cookieStore.toString();

      const res = await fetch(AUTH_SESSION_URL, {
        headers: {
          Cookie: cookieHeader,
          origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
        },
        cache: "no-store",
      });

      if (!res.ok) return { data: null, error: "Failed to fetch session" };

      const session = await res.json();
      return { data: session, error: null };
    } catch (err) {
      return { data: null, error: "Authentication error" };
    }
  },
};