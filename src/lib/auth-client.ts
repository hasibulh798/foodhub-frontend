import { createAuthClient } from "better-auth/react";
import { getSiteOrigin } from "./site-url";

export const authClient = createAuthClient({
  baseURL: `${getSiteOrigin()}/api/auth`,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    {
      id: "next-cookies-request",
      fetchPlugins: [
        {
          id: "next-cookies-request-plugin",
          name: "next-cookies-request-plugin",
          hooks: {
            async onRequest(ctx) {
              if(typeof window ==='undefined'){
                const {cookies} = await import("next/headers");
                const headers = await cookies();
                ctx.headers.set("cookie", headers.toString());
              }
            }
          }
        }
    ]
    }
  ]

});


export const { signIn, signUp, signOut, useSession, getSession } = authClient;