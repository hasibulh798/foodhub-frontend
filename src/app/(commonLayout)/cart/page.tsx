"use client";

import { useCart } from "@/lib/Cart-context";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, totalPrice } = useCart();

  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
        <Link
          href="/restaurants"
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Browse Meals
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.mealId}
            className="flex items-center justify-between border rounded-xl p-4"
          >
            <div className="flex items-center gap-4">
              {item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded"
                />
              )}
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p>{item.price} BDT</p>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQty(item.mealId)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => increaseQty(item.mealId)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.mealId)}
                className="ml-4 text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Total: {totalPrice} BDT</h2>
        <Link href={"/checkout"}>
        <button className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600">
          Checkout
        </button>
        </Link>
      </div>
    </div>
  );
}