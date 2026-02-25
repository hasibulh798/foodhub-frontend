"use client";

import { useState } from "react";

const categories = [
  { id: 1, name: "Pizza", icon: "🍕" },
  { id: 2, name: "Burger", icon: "🍔" },
  { id: 3, name: "Biryani", icon: "🍚" },
  { id: 4, name: "Drinks", icon: "🥤" },
  { id: 5, name: "Dessert", icon: "🍰" },
  { id: 6, name: "Fries", icon: "🍟" },
  { id: 7, name: "Chicken", icon: "🍗" },
  { id: 8, name: "Sandwich", icon: "🥪" },
];

export default function CategoriesSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => setActive(category.id)}
              className={`min-w-[120px] cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center shadow-sm transition 
                ${
                  active === category.id
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 hover:bg-red-100"
                }`}
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="text-sm font-medium">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}