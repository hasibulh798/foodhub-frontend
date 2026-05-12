// fetcher.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
// NEXT_PUBLIC_API_URL না থাকলে empty string → Next.js rewrite কাজ করবে

export async function fetcher(
  url: string,
  options?: RequestInit
) {

  const normalizedUrl = url.startsWith("/api/") ? url : `/api${url.startsWith("/") ? "" : "/"}${url}`;

  const fullUrl = `${API_BASE}${normalizedUrl}`;

  const res = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}