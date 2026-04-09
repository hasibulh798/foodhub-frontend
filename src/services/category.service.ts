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
    // console.log(res.data)
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

  createCategory: async (data: { name: string }) => {
    const res = await fetcher(`${BASE_URL}/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to create category");
    }
    return res.data;
  },

  updateCategory: async (catId: string, data: { name?: string; isActive?: boolean }) => {
    const res = await fetcher(`${BASE_URL}/categories/${catId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update category");
    }
    return res.data;
  },

  deleteCategory: async (catId: string) => {
    const res = await fetcher(`${BASE_URL}/categories/${catId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete category");
    }
    return res.data;
  },
};

