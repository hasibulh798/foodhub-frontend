// // fetcher.ts

// const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
// // If NEXT_PUBLIC_API_URL is missing, use empty string -> Next.js rewrite will work

// export async function fetcher(
//   url: string,
//   options?: RequestInit
// ) {

//   const normalizedUrl = url.startsWith("/api/") ? url : `/api${url.startsWith("/") ? "" : "/"}${url}`;

//   const fullUrl = `${API_BASE}${normalizedUrl}`;

//   const res = await fetch(fullUrl, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Something went wrong");
//   }

//   return data;
// }



// function getBaseUrl() {
//   // Client-side: relative URL is enough
//   if (typeof window !== "undefined") return "";

//   // Server-side: absolute URL required
//   if (process.env.NEXT_PUBLIC_APP_URL) {
//     return process.env.NEXT_PUBLIC_APP_URL;
//   }

//   // Vercel automatic URL
//   if (process.env.VERCEL_URL) {
//     return `https://${process.env.VERCEL_URL}`;
//   }

//   // Local fallback
//   return "http://localhost:3000";
// }

// export async function fetcher(url: string, options?: RequestInit) {
//   const normalizedUrl = url.startsWith("/api/")
//     ? url
//     : `/api${url.startsWith("/") ? "" : "/"}${url}`;

//   const fullUrl = `${getBaseUrl()}${normalizedUrl}`;

//   const res = await fetch(fullUrl, {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     ...options,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Something went wrong");
//   }

//   return data;
// }

function getBaseUrl() {
  // Client-side: relative URL, rewrite will work
  if (typeof window !== "undefined") return "";

  // Server-side: Direct backend URL
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }

  return "http://localhost:5000";
}

export async function fetcher(url: string, options?: RequestInit) {
  const isServer = typeof window === "undefined";

  let fullUrl: string;

  if (isServer) {
    // Server-side: Direct call to backend, with /api prefix
    const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
    fullUrl = `${getBaseUrl()}/api${normalizedUrl}`;
  } else {
    // Client-side: Will go through Next.js rewrite
    const normalizedUrl = url.startsWith("/api/")
      ? url
      : `/api${url.startsWith("/") ? "" : "/"}${url}`;
    fullUrl = normalizedUrl;
  }

  const res = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  // Check content-type before JSON parsing
  const contentType = res.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text.slice(0, 100)}`);
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}