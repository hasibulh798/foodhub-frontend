import { cookies } from "next/headers";


const AUTH_URL = process.env.AUTH_URL ?? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`;

export const userService = {
  getSession: async function () {
    try {
      if (!AUTH_URL) {
        throw new Error("AUTH_URL is not defined");
      }

      const cookieStore = cookies();

      const cookieHeader = cookieStore.toString();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: { Cookie: cookieHeader },
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