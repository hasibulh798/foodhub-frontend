import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const providerServices = {
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
