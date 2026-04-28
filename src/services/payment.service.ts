import { fetcher } from "@/lib/fetcher";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const paymentService = {
  initiatePayment: async (orderId: string) => {
    const res = await fetcher(`${BASE_URL}/payment/${orderId}/initiate`, {
      method: "POST",
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to initiate payment");
    }

    return res.data;
  },
};
