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
      throw new Error("Failed to creare Order");
    }
  },
};
