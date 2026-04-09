import { UserStatus } from "@/constants/allType";
import { fetcher } from "@/lib/fetcher";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const adminService = {
  getAllUsers: async () => {
    const res = await fetcher(`${BASE_URL}/admin/users`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch users");
    }
    return { users: res.data, totalUsers: res.data.length };
  },

  updateUserStatus: async (userId: string, status: UserStatus) => {
    const res = await fetcher(`${BASE_URL}/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update user status");
    }
    return res.data;
  },

  deleteUser: async (userId: string) => {
    const res = await fetcher(`${BASE_URL}/admin/users/${userId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete user");
    }
    return res.data;
  },

  verifyProvider: async (providerId: string, isVerified: boolean) => {
    const res = await fetcher(`${BASE_URL}/admin/verify-provider/${providerId}`, {
      method: "PATCH",
      body: JSON.stringify({ isVerified }),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to verify provider");
    }
    return res.data;
  },

  deleteProvider: async (providerId: string) => {
    const res = await fetcher(`${BASE_URL}/admin/providers/${providerId}`, {
      method: "DELETE",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to delete provider profile");
    }
    return res.data;
  },

  getStats: async () => {
    const res = await fetcher(`${BASE_URL}/admin/dashboard-stats`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch dashboard stats");
    }
    return res.data;
  },

  verifyEmail: async (userId: string, isVerified: boolean) => {
    const res = await fetcher(`${BASE_URL}/admin/verify-email/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ isVerified }),
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to update email verification status");
    }
    return res.data;
  },

};
