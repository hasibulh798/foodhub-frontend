/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from "@/lib/fetcher";


export const mealServices = {
  getAllMeals: async (params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetcher(`/meals?${queryString}`, {
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
    const res = await fetcher(`/meals/${mealId}`, {
      cache: "no-store",
    });

    if (!res.success) {
      throw new Error("Failed to fecth meals");
    }
    return res.data;
  },
  createMeal: async (mealData: any) => {
    const res = await fetcher('/meals', {
      method: "POST",
      body: JSON.stringify(mealData),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to create meal");
    }
    return res.data;
  },

  updateMeal: async (mealId: string, mealData: any) => {
    const res = await fetcher(`/meals/${mealId}`, {
      method: "PATCH",
      body: JSON.stringify(mealData),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update meal");
    }
    return res.data;
  },

  deleteMeal: async (mealId: string) => {
    const res = await fetcher(`/meals/${mealId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete meal");
    }
    return res.data;
  },
};

