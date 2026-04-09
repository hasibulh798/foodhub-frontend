"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import MealCard from "../meals/MealCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  categoryId: string;
}

interface Props {
  provider: {
    id: string;
    meals: MealType[];
  };
}

export default function RestaurantMenu({ provider }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMeals = provider.meals.filter(meal => {
    const matchesCategory = activeCategoryId ? meal.categoryId === activeCategoryId : true;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12">
      {/* Search & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
        <CategoryFilter 
          providerId={provider.id} 
          activeCategoryId={activeCategoryId}
          setActiveCategoryId={setActiveCategoryId}
        />
        
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search our flavors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all font-bold text-sm"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filteredMeals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-32 bg-gray-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-zinc-800"
          >
            <div className="bg-white dark:bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
               <SlidersHorizontal className="text-gray-300" size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Flavor Not Found</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're craving.</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
          >
            {filteredMeals.map((meal) => (
               <MealCard key={meal.id} meal={meal} provider={provider} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

