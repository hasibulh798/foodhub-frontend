import { UserStatus } from "@/constants/allType";
import { fetcher } from "@/lib/fetcher";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const adminService = {
  getAllUsers: async () => {
    const res = await fetcher(`${BASE_URL}/admin/users`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error("Failed to creare Order");
    }
    console.log(res);
    return { user: res.data, totalUsers: res.data.length };
  },
  updateUserStatus: async (userId: string, updatedStatus: UserStatus) => {
    const res = await fetcher(`${BASE_URL}/admin/users/${userId}`, {
      method: "PATCH",
      cache: "no-store",
      body: JSON.stringify({ status: updatedStatus }),
    });
    if (!res.success) {
      throw new Error("Failed to creare Order");
    }
    console.log(res);
    return res.data;
  },
  deleteUser: async (userId: string) => {
    const res = await fetcher(`${BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error("Failed to creare Order");
    }
    console.log(res);
    return res;
  },
  verifyProvider: async (providerId: string, verifyData: boolean) => {
    console.log("PId: ", providerId);
    const res = await fetcher(
      `${BASE_URL}/admin/verify-provider/${providerId}`,
      {
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify({ isVerified: verifyData }),
      },
    );
    if (!res.success) {
      throw new Error("Failed to creare Order");
    }
    console.log(res);
    return res.data;
  },
  deleteProvider: async (providerId: string) => {
    const res = await fetcher(`${BASE_URL}/admin/providers/${providerId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error("Failed to delete provider");
    }

    return res;
  },
  getStats: async () => {
    try {
      const res = await fetcher(`${BASE_URL}/admin/dashboard-stats`, {
        cache: "no-store",
      });
      if (!res.success) {
        return { data: null, error: "Something went wrong" };
      }
      return { data: res.data, error: null };
    } catch (error) {
      return { data: null, error: "Failed to fetche" };
    }
  },
};
