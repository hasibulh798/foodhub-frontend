import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const categoryServices = {
  getAllCategories: async () => {
    
    const res = await fetcher(`${BASE_URL}/categories`, {
      cache: "no-store",
    });

    if (!res.success) {
      throw new Error("Failed to fecth categories");
    }
    return res.data;
  },
  getCategoriesByProvider:async(providerId:string)=>{
    const res = await fetcher(`${BASE_URL}/categories/provider/${providerId}`, {
      cache: "no-store",
    })
    if (!res.success) {
      throw new Error("Failed to fecth categories");
    }
    return res.data;
  },
};
