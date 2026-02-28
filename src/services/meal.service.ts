/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const mealServices = {
  getAllMeals: async (params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetcher(`${BASE_URL}/meals/${queryString}`, {
      cache: "no-store",
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
};
