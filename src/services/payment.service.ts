import { fetcher } from "@/lib/fetcher";


export const paymentService = {
  initiatePayment: async (orderId: string) => {
    const res = await fetcher(`/payment/${orderId}/initiate`, {
      method: "POST",
    });

    if (!res.success) {
      throw new Error(res.message || "Failed to initiate payment");
    }

    return res.data;
  },
};
