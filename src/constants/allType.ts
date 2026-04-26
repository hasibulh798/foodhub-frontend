// ═══════════════════════════════════════════
//  ENUMS — Schema থেকে exact match
// ═══════════════════════════════════════════
export const userRole = {
  admin: "ADMIN",
  provider: "PROVIDER",
  customer: "CUSTOMER",
};
export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "COD" | "ONLINE";
export type DietaryType = "VEG" | "NON_VEG" | "VEGAN";

// ═══════════════════════════════════════════
//  USER
// ═══════════════════════════════════════════

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  phone?: string;
  status?: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════
//  PROVIDER PROFILE
// ═══════════════════════════════════════════

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  address: string;
  isVerified: boolean;
  logoUrl?: string;
  deliveryFee: number | string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// ═══════════════════════════════════════════
//  CATEGORY
// ═══════════════════════════════════════════

export interface Category {
  id: string;
  name: string;
  iconUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════
//  MEAL
// ═══════════════════════════════════════════

export interface Meal {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number | string; // Prisma Decimal → string হয়ে আসে
  isAvailable: boolean;
  imageUrl?: string;
  cuisine?: string;
  dietaryType?: DietaryType;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  provider?: ProviderProfile;
}

// ═══════════════════════════════════════════
//  ORDER
// ═══════════════════════════════════════════

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  price: number | string;
  createdAt: string;
  updatedAt: string;
  meal?: Meal;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  phone: string;
  subtotal: number | string;
  totalAmount: number | string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryFee: number | string;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItem[];
  provider?: ProviderProfile;
  customer?: User;
  reviews?: Review[];
}

// ═══════════════════════════════════════════
//  REVIEW
// ═══════════════════════════════════════════

export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  mealId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  meal?: Meal;
  order?: Order;
  customer?: User;
}

// ═══════════════════════════════════════════
//  API REQUEST TYPES
// ═══════════════════════════════════════════

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterProviderInput extends RegisterInput {
  businessName: string;
  address: string;
}

export interface MealQueryParams {
  categoryId?: string;
  search?: string;
  dietaryType?: DietaryType;
  cuisine?: string;
  providerId?: string;
}

export interface CreateMealInput {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable?: boolean;
  imageUrl?: string;
  cuisine?: string;
  dietaryType?: DietaryType;
}

export interface PlaceOrderInput {
  providerId: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  deliveryFee: number;
  subtotal: number;
  totalAmount: number;
  items: Array<{
    mealId: string;
    quantity: number;
    price: number;
  }>;
}

export interface CreateReviewInput {
  orderId: string;
  mealId: string;
  rating: number;
  comment?: string;
}

// ═══════════════════════════════════════════
//  CART
// ═══════════════════════════════════════════

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface CheckoutInput {
  phone: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  deliveryFee?: number;
}

// ═══════════════════════════════════════════
//  ADMIN STATS
// ═══════════════════════════════════════════

export interface AdminStats {
  totalUsers: number;
  totalProviders: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}
