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
    } catch (error:any) {
      return { data: null, error: error.message ||"Failed to create resturant" };
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

  getMyMeals: async () => {
    const res = await fetcher(`${BASE_URL}/provider/my-meals`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error("Failed to fetch providers");
    }

    return res.data;
  },    

  deleteMeal: async (mealId: string) => {
    const res = await fetcher(`${BASE_URL}/provider/meals/${mealId}`, {
      cache: "no-store",
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error("Failed to delete meal");
    }
    return res.data;
  },

  createMeal: async (data: any) => {
    const res = await fetcher(`${BASE_URL}/provider/meals`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to create meal");
    }
    return res.data;
  },

  updateMeal: async (mealId: string, data: any) => {
    const res = await fetcher(`${BASE_URL}/provider/meals/${mealId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update meal");
    }
    return res.data;
  },

  toggleMealAvailability: async (mealId: string) => {
    const res = await fetcher(`${BASE_URL}/provider/meals/${mealId}/toggle`, {
      method: "PATCH",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to toggle availability");
    }
    return res.data;
  },

  getMyProfile: async () => {
    const res = await fetcher(`${BASE_URL}/providers/me`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch profile");
    }
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await fetcher(`${BASE_URL}/providers/me`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update profile");
    }
    return res.data;
  },
};


