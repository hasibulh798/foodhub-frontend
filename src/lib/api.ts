import axios from "axios";
import type {
  Category,
  Meal,
  MealQueryParams,
  CreateMealInput,
  Order,
  OrderStatus,
  PlaceOrderInput,
  Review,
  CreateReviewInput,
  ProviderProfile,
  User,
  UserStatus,
  AdminStats,
} from "../constants/allType";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Better Auth session cookie
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ════════════════════════════════════════════
//  PROVIDER PROFILE
// ════════════════════════════════════════════

export const providerAPI = {
  createProfile: (data: Pick<ProviderProfile, "businessName" | "address"> & { logoUrl?: string }) =>
    api.post<ProviderProfile>("/provider/profile", data),

  getMyProfile: () =>
    api.get<ProviderProfile>("/provider/profile/me"),

  updateProfile: (data: Partial<Pick<ProviderProfile, "businessName" | "address" | "logoUrl">>) =>
    api.put<ProviderProfile>("/provider/profile", data),

  getAll: () =>
    api.get<ProviderProfile[]>("/providers"),

  getById: (id: string) =>
    api.get<ProviderProfile>(`/providers/${id}`),
};

// ════════════════════════════════════════════
//  CATEGORIES
// ════════════════════════════════════════════

export const categoryAPI = {
  getAll: () =>
    api.get<Category[]>("/categories"),

  getAllAdmin: () =>
    api.get<Category[]>("/admin/categories"),

  create: (data: { name: string }) =>
    api.post<Category>("/admin/categories", data),

  update: (id: string, data: { name?: string; isActive?: boolean }) =>
    api.put<Category>(`/admin/categories/${id}`, data),

  toggleActive: (id: string) =>
    api.patch<Category>(`/admin/categories/${id}/toggle`),

  delete: (id: string) =>
    api.delete(`/admin/categories/${id}`),
};

// ════════════════════════════════════════════
//  MEALS
// ════════════════════════════════════════════

export const mealAPI = {
  getAll: (params?: MealQueryParams) =>
    api.get<Meal[]>("/meals", { params }),

  getById: (id: string) =>
    api.get<Meal>(`/meals/${id}`),

  getMyMeals: () =>
    api.get<Meal[]>("/provider/meals"),

  create: (data: CreateMealInput) =>
    api.post<Meal>("/provider/meals", data),

  update: (id: string, data: Partial<CreateMealInput>) =>
    api.put<Meal>(`/provider/meals/${id}`, data),

  delete: (id: string) =>
    api.delete(`/provider/meals/${id}`),

  toggleAvailability: (id: string) =>
    api.patch<Meal>(`/provider/meals/${id}/toggle`),
};

// ════════════════════════════════════════════
//  ORDERS
// ════════════════════════════════════════════

export const orderAPI = {
  place: (data: PlaceOrderInput) =>
    api.post<Order>("/orders", data),

  getMyOrders: () =>
    api.get<Order[]>("/orders/my"),

  getProviderOrders: (params?: { status?: OrderStatus }) =>
    api.get<Order[]>("/provider/orders", { params }),

  getAllOrders: (params?: { status?: OrderStatus }) =>
    api.get<Order[]>("/admin/orders", { params }),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
};

// ════════════════════════════════════════════
//  REVIEWS
// ════════════════════════════════════════════

export const reviewAPI = {
  create: (data: CreateReviewInput) =>
    api.post<Review>("/reviews", data),

  getByMeal: (mealId: string) =>
    api.get<Review[]>(`/reviews/meal/${mealId}`),

  getMyReviews: () =>
    api.get<Review[]>("/reviews/my"),

  getAll: () =>
    api.get<Review[]>("/admin/reviews"),

  delete: (id: string) =>
    api.delete(`/admin/reviews/${id}`),
};

// ════════════════════════════════════════════
//  ADMIN
// ════════════════════════════════════════════

export const adminAPI = {
  getStats: () =>
    api.get<AdminStats>("/admin/stats"),

  getAllUsers: (params?: { role?: string; status?: UserStatus }) =>
    api.get<User[]>("/admin/users", { params }),

  updateUserStatus: (id: string, status: UserStatus) =>
    api.patch<User>(`/admin/users/${id}/status`, { status }),

  getAllProviders: () =>
    api.get<ProviderProfile[]>("/admin/providers"),

  verifyProvider: (id: string) =>
    api.patch<ProviderProfile>(`/admin/providers/${id}/verify`),
};

export default api;