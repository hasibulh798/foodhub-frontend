"use client";

import { categoryServices } from "@/services/category.service";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface ProviderProps {
  providerId: string;
}

export default function CategoryFilter({ providerId }: ProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryServices.getCategoriesByProvider(providerId);
      setCategories(data);
    };

    if (providerId) {
      fetchCategories();
    }
  }, [providerId]);

  return (
    <div className="flex gap-3 overflow-x-auto mb-8">
      {/* All button */}
      <button
        onClick={() => setActive("")}
        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
          active === ""
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        All
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActive(cat.id)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            active === cat.id
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}