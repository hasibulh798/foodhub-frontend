/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const reviewServices = {
  createReview: async (reviewData: { mealId: string; rating: number; comment: string }) => {
    const res = await fetcher(`${BASE_URL}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to create review");
    }
    return res.data;
  },

  getAllReviews: async () => {
    const res = await fetcher(`${BASE_URL}/reviews`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch reviews");
    }
    return res.data;
  },

  getMealReviews: async (mealId: string) => {
    const res = await fetcher(`${BASE_URL}/reviews/meal/${mealId}`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch meal reviews");
    }
    return res.data;
  },

  deleteReview: async (reviewId: string) => {
    const res = await fetcher(`${BASE_URL}/reviews/${reviewId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete review");
    }
    return res.data;
  },

  getPublicReviews: async () => {
    const res = await fetcher(`${BASE_URL}/reviews/public`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch public reviews");
    }
    return res.data;
  },
};
