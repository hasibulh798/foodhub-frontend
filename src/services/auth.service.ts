// import { cookies } from "next/headers";


// const AUTH_URL = process.env.AUTH_URL ?? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth`;

// export const userService = {
//   getSession: async function () {
//     try {
//       if (!AUTH_URL) {
//         throw new Error("AUTH_URL is not defined");
//       }

//       const cookieStore = await cookies();

//       const cookieHeader = cookieStore.toString();

//       const res = await fetch(`${AUTH_URL}/get-session`, {
//         headers: { Cookie: cookieHeader },
//         cache: "no-store",
//       });

//       if (!res.ok) return { data: null, error: "Failed to fetch session" };

//       const session = await res.json();
//       return { data: session, error: null };
//     } catch (err) {
//       return { data: null, error: "Authentication error" };
//     }
//   },
// };


import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const AUTH_SESSION_URL = `${BACKEND_URL}/api/auth/get-session`;

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