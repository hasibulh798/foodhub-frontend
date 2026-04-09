"use client";

import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import MealList from "./MealList";

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

  const filteredMeals = activeCategoryId 
    ? provider.meals.filter(meal => meal.categoryId === activeCategoryId)
    : provider.meals;

  return (
    <div className="space-y-8">
      <CategoryFilter 
        providerId={provider.id} 
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />
      
      {filteredMeals.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold">No meals available for this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeals.map((meal) => (
             /* Using the actual MealCard component */
             <MealList_Card key={meal.id} meal={meal} provider={provider} />
          ))}
        </div>
      )}
    </div>
  );
}

/* Internal wrapper to avoid circular deps if needed, but I'll use MealCard directly if possible */
import MealCard from "../meals/MealCard";
function MealList_Card({ meal, provider }: any) {
    return <MealCard meal={meal} provider={provider} />;
}
