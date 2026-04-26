/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const mealServices = {
  getAllMeals: async (params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetcher(`${BASE_URL}/meals?${queryString}`, {
      next:{
        revalidate:60
      }
    });

    if (!res.success) {
      throw new Error("Failed to fecth meals");
    }

    return res.data;
  },
  getSingleMeal: async (mealId: string) => {
    const res = await fetcher(`${BASE_URL}/meals/${mealId}`, {
      cache: "no-store",
    });

    if (!res.success) {
      throw new Error("Failed to fecth meals");
    }
    return res.data;
  },
  createMeal: async (mealData: any) => {
    const res = await fetcher(`${BASE_URL}/meals`, {
      method: "POST",
      body: JSON.stringify(mealData),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to create meal");
    }
    return res.data;
  },

  updateMeal: async (mealId: string, mealData: any) => {
    const res = await fetcher(`${BASE_URL}/meals/${mealId}`, {
      method: "PATCH",
      body: JSON.stringify(mealData),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update meal");
    }
    return res.data;
  },

  deleteMeal: async (mealId: string) => {
    const res = await fetcher(`${BASE_URL}/meals/${mealId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete meal");
    }
    return res.data;
  },
};

