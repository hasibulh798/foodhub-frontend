/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const providerServices = {
  createProvider: async (data: any) => {
    try {
      console.log("FormData: ", data);
      const res = await fetcher(`${BASE_URL}/providers`, {
        method: "POST",
        cache: "no-store",
        body: JSON.stringify(data),
      });

      if (!res.success) {
        throw new Error("Failed to fetch providers");
      }
      return { data: res.data, error: null };
    } catch (error) {
      return { data: null, error: "Failed to create resturant" };
    }
  },
  getProviders: async () => {
    const res = await fetcher(`${BASE_URL}/providers`, { cache: "no-store" });

    if (!res.success) {
      throw new Error("Failed to fetch providers");
    }

    return res.data;
  },

  getSingleProvider: async (providerId: string) => {
    const res = await fetcher(`${BASE_URL}/providers/${providerId}`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error("Failed to fetch providers");
    }

    return res.data;
  },
};
