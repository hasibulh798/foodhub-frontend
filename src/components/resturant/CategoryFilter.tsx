"use client";

import { useState } from "react";

const categories = ["All", "Burger", "Drinks", "Fries", "Combo"];

export default function CategoryFilter() {
  const [active, setActive] = useState("All");

  return (
    <div className="flex gap-3 overflow-x-auto mb-8">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            active === cat
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}