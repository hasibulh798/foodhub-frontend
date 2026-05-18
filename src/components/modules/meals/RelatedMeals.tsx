"use client";

import { motion } from "framer-motion";
import FoodCard from "@/components/shared/FoodCard";

interface RelatedMealsProps {
  meals: any[];
}

const RelatedMeals = ({ meals }: RelatedMealsProps) => {
  if (!meals || meals.length === 0) return null;

  return (
    <section className="py-24 border-t border-zinc-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-red-600 dark:text-red-500 font-bold tracking-widest uppercase text-xs mb-3 block"
          >
            Recommendations
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100"
          >
            Related <span className="text-red-600">Dishes</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {meals.slice(0, 4).map((meal) => (
            <FoodCard
              key={meal.id}
              id={meal.id}
              title={meal.name}
              description={meal.description}
              price={meal.price}
              rating={meal.rating || 4.5}
              location={meal.provider?.businessName || "Food Hub"}
              image={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"}
              category={meal.category}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedMeals;
