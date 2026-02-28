"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500 w-20 h-20" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is now being processed.
        </p>

        {/* Order Info (Optional Dynamic Section) */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left text-sm">
          <p><span className="font-semibold">Order ID:</span> #123456</p>
          <p><span className="font-semibold">Payment Method:</span> Cash on Delivery</p>
          <p><span className="font-semibold">Estimated Delivery:</span> 3-5 Days</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/meals"
            className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/dashboard/orders"
            className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}