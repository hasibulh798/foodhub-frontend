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
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 pl-1">Browse Specialties</p>
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <FilterButton 
          active={activeCategoryId === ""} 
          onClick={() => setActiveCategoryId("")}
          label="All Selection"
        />

        {categories.map((cat, i) => (
          <FilterButton 
            key={cat.id}
            active={activeCategoryId === cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            label={cat.name}
            index={i + 1}
          />
        ))}
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, index = 0 }: any) {
    return (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
          onClick={onClick}
          className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 border-2 ${
            active
              ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-gray-900/20 active:scale-95"
              : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-gray-500 hover:border-orange-500/30 hover:text-orange-600 shadow-sm"
          }`}
        >
          {label}
        </motion.button>
    );
}