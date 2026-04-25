import { PaymentMethod } from "@/constants/allType";
import { fetcher } from "@/lib/fetcher";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export type OrderTypes = {
  phone: string;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  Items: { mealId: string; quantity: number }[];
};
export const orderService = {
  createOrder: async (orderPayload: OrderTypes) => {
    const res = await fetcher(`${BASE_URL}/orders`, {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(orderPayload),
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to create Order");
    }
    return res.data;
  },

  getMyOrders: async () => {
    const res = await fetcher(`${BASE_URL}/orders`, {
      cache: "no-store",
    });
    // Treat "no orders found" as an empty list, not an error
    if (!res.success) {
      const msg = (res.message || "").toLowerCase();
      if (
        msg.includes("no order found") ||
        msg.includes("failed to fetch orders") ||
        msg.includes("no data")
      ) {
        return [];
      }
      throw new Error(res.message || "Failed to fetch orders");
    }
    return Array.isArray(res.data) ? res.data : [];
  },
  

  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetcher(`${BASE_URL}/provider/orders/${orderId}/status`, {
      cache: "no-store",
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.success) {
      throw new Error("Failed to update order status");
    }

    return res.data;
  },  

  getProviderOrders: async () => {
    const res = await fetcher(`${BASE_URL}/orders`, {
      cache: "no-store",
    });

    if (!res.success) {
      const msg = (res.message || "").toLowerCase();
      if (
        msg.includes("no order") ||
        msg.includes("not found") ||
        msg.includes("no data")
      ) {
        return [];
      }
      throw new Error("Failed to fetch orders");
    }

    return Array.isArray(res.data) ? res.data : [];
  },

  getSingleOrder: async (orderId: string) => {
    const res = await fetcher(`${BASE_URL}/orders/${orderId}`, {
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to fetch order details");
    }
    return res.data;
  },

  cancelOrder: async (orderId: string) => {
    const res = await fetcher(`${BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.success) {
      throw new Error(res.message || "Failed to cancel order");
    }
    return res.data;
  },
};

