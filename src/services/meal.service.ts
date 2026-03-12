/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meal } from "@/constants/allType";
import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const mealServices = {
  getAllMeals: async (params: Record<string, any>) => {
    const queryString = new URLSearchParams(params).toString();
    console.log("---: ", queryString);
    const res = await fetcher(`${BASE_URL}/meals?${queryString}`, {
      next:{
        revalidate:60
      }
    });

    if (!res.success) {
      throw new Error("Failed to fecth meals");
    }
    console.log("Meal services : ", res);
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
  craeteMeals: async (mealData : Meal) => {
    try {
      const res = await fetcher(`${BASE_URL}/meals`, {
        method: "POST",
        body: JSON.stringify(mealData),
      });
      return { data: res.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message || "Failed to create Meal" };
    }
  },
};
