"use client";

import MealCard from "@/components/modules/meals/MealCard";
import { categoryServices } from "@/services/category.service";
import { mealServices } from "@/services/meal.service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
}
type Category = {
  id: string;
  name: string;
};

const dietaryOptions = ["VEG", "NON_VEG", "VEGAN"];

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietaryType, setDietaryType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");

  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await categoryServices.getAllCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  // Fetch meals
  useEffect(() => {
    const fetchMeals = async () => {
      const params = {
        search: search || urlSearch,
        isAvailable,
        dietaryType,
        categoryId,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page,
      };
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== ""),
      );
      const res = await mealServices.getAllMeals(filteredParams);
      const mealData = Array.isArray(res) ? res : (res?.data || []);
      setMeals(mealData);
      setTotalPages(res?.totalPages || 1);
    };

    fetchMeals();
  }, [
    search,
    urlSearch,
    isAvailable,
    dietaryType,
    categoryId,
    priceRange,
    page,
  ]);

  return (
    <div>
      {/* Meals Header */}
            {/* HERO SECTION */}
      <section className="bg-red-500 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            All Meals
          </h1>
          <p className="text-lg text-white/90">
            Choose Your Favourite Meal.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* FILTER PANEL */}
        <aside className="w-full md:w-64 shrink-0 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Filters</h2>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search meals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Availability */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />
              Available Only
            </label>
          </div>

          {/* Dietary Type */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Dietary Type</label>
            <select
              value={dietaryType}
              onChange={(e) => setDietaryType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>
              {dietaryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          {/* Price Range */}
          <div className="mb-4">
            <label className="block font-medium mb-2">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>

            <div className="flex gap-3">
              {/* Min Price */}
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="border p-2 w-1/2 rounded"
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="border p-2 w-1/2 rounded"
              />
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch("");
              setIsAvailable(false);
              setDietaryType("");
              setCategoryId("");
              setPriceRange([0, 1000]);
            }}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Reset Filters
          </button>
        </aside>

        {/* MEAL LIST */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${p === page ? "bg-red-500 text-white" : "hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
