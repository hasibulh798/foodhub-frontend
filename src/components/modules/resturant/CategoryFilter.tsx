"use client";

import { categoryServices } from "@/services/category.service";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface FilterProps {
  providerId: string;
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
}

export default function CategoryFilter({ 
  providerId, 
  activeCategoryId, 
  setActiveCategoryId 
}: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryServices.getCategoriesByProvider(providerId);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    if (providerId) {
      fetchCategories();
    }
  }, [providerId]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
      <button
        onClick={() => setActiveCategoryId("")}
        className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
          activeCategoryId === ""
            ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/20"
            : "bg-white border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900 shadow-sm"
        }`}
      >
        All Selection
      </button>

      {categories.map((cat, i) => (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          key={cat.id}
          onClick={() => setActiveCategoryId(cat.id)}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
            activeCategoryId === cat.id
              ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/20"
              : "bg-white border-gray-100 text-gray-400 hover:border-gray-900 hover:text-gray-900 shadow-sm"
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}