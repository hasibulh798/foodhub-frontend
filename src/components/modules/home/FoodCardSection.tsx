"use client";

import { motion } from "framer-motion";
import FoodCard from "@/components/shared/FoodCard";
import FoodCardSkeleton from "@/components/shared/FoodCardSkeleton";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { mealServices } from "@/services/meal.service";

export default function FoodCardSection() {
  const { data: rawMeals, isLoading: loading } = useQuery({
    queryKey: ["popular-meals"],
    queryFn: () => mealServices.getAllMeals({ limit: 8 }),
  });

  const mealsData = Array.isArray(rawMeals) ? rawMeals : (rawMeals?.data || []);
  const meals = mealsData.slice(0, 8); // Ensure max 8 for this section

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-red-600 dark:text-red-500 font-black tracking-[0.25em] uppercase text-[10px] mb-3 block"
            >
              Popular Dishes
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 leading-none sm:leading-tight"
            >
              Trending on <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Food Hub</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/meals">
              <Button variant="outline" className="rounded-full px-8 py-6 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-bold">
                View All Meals <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <FoodCardSkeleton key={i} />
              ))
            : meals.map((meal: any) => (
                <FoodCard 
                  key={meal.id} 
                  id={meal.id}
                  title={meal.name}
                  description={meal.description || "A delicious meal prepared with fresh ingredients."}
                  price={Number(meal.price)}
                  rating={meal.averageRating || 4.9}
                  location={meal.provider?.address || "Local Kitchen"}
                  date={meal.isAvailable ? "Available Now" : "Unavailable"}
                  image={meal.imageUrl || (meal.images && meal.images[0]) || "/home/food/1.jpg"}
                  category={typeof meal.category === 'string' ? meal.category : meal.category?.name || "Specialty"}
                />
              ))}
        </div>
        
        {!loading && meals.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">No popular meals found at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
