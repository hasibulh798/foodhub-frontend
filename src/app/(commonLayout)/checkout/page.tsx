"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/Cart-context";
import { orderService, OrderTypes } from "@/services/order.service";

export default function CheckoutPage() {
  const { items:cartItems, clearCart } = useCart();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleOrder = async () => {
    if (!phone || !deliveryAddress) {
      alert("Phone and address required");
      return;
    }

    const orderPayload = {
      phone,
      paymentMethod,
      deliveryAddress,
      Items: cartItems.map((item) => ({
        mealId: item.mealId,
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);

      const res = await orderService.createOrder(orderPayload as OrderTypes);

      // if (!res.success) {
      //   throw new Error("Order failed");
      // }

      clearCart();
      alert("Order placed successfully 🎉");
      router.push("/");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Cart Items */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cartItems.map((item) => (
          <div
            key={item.mealId}
            className="flex justify-between border-b py-2"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{item.price * item.quantity} BDT</span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-4">
          <span>Total</span>
          <span>{totalPrice} BDT</span>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-4">
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <textarea
          placeholder="Delivery Address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="COD">Cash on Delivery</option>
          <option value="ONLINE">Online Payment</option>
        </select>

        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-green-500 text-white py-3 rounded hover:bg-green-600 transition"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}