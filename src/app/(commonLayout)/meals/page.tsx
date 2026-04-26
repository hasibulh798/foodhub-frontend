"use client";

import MealCard from "@/components/modules/meals/MealCard";
import { categoryServices } from "@/services/category.service";
import { mealServices } from "@/services/meal.service";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  RotateCcw, 
  Utensils,
  Leaf,
  Beef,
  Flame,
  LayoutGrid
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

const dietaryOptions = [
  { value: "VEG", label: "Vegetarian", icon: Leaf },
  { value: "NON_VEG", label: "Non-Veg", icon: Beef },
  { value: "VEGAN", label: "Vegan", icon: Flame },
];

function MealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlSearch = searchParams.get("search") || "";
  const urlCategoryId = searchParams.get("categoryId") || "";

  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState(urlSearch);
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietaryType, setDietaryType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>(urlCategoryId);
  const [loading, setLoading] = useState(true);

  // Sync with URL params when they change
  useEffect(() => {
    if (urlCategoryId) {
      setCategoryId(urlCategoryId);
    } else {
      setCategoryId("");
    }
  }, [urlCategoryId]);

  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    } else {
      setSearch("");
    }
  }, [urlSearch]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryServices.getAllCategories();
        const categoryData = Array.isArray(data) ? data : (data?.data || []);
        setCategories(categoryData);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch meals
  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        isAvailable,
        dietaryType,
        categoryId,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        page,
      };
      
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== "")
      );
      
      const res = await mealServices.getAllMeals(filteredParams);
      const mealData = Array.isArray(res) ? res : (res?.data || []);
      setMeals(mealData);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch meals", err);
    } finally {
      setLoading(false);
    }
  }, [search, isAvailable, dietaryType, categoryId, priceRange, page]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const resetFilters = () => {
    setSearch("");
    setIsAvailable(true);
    setDietaryType("");
    setCategoryId("");
    setPriceRange([0, 2000]);
    setPage(1);
    router.push("/meals");
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Premium Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 scale-105" />
        
        <div className="relative z-20 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
              Delicious <span className="text-orange-500">Meals</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto font-medium">
              Discover a world of flavors delivered to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Enhanced Filter Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-10 space-y-6">
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-orange-600" />
                    Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={resetFilters}
                    className="rounded-full hover:bg-orange-50 hover:text-orange-600 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>

                <CardContent className="p-6 space-y-8">
                  {/* Search */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for meals..."
                        className="pl-10 h-12 rounded-xl border-gray-100 focus:border-orange-500 focus:ring-orange-500 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-100/50" />

                  {/* Categories */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Category</label>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <button
                        onClick={() => setCategoryId("")}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                          categoryId === "" 
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="text-sm font-bold">All Categories</span>
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryId(cat.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            categoryId === cat.id 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Utensils className="w-4 h-4" />
                          <span className="text-sm font-bold">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-100/50" />

                  {/* Dietary Type */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Dietary preference</label>
                    <div className="grid grid-cols-1 gap-2">
                      {dietaryOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDietaryType(dietaryType === opt.value ? "" : opt.value)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            dietaryType === opt.value 
                            ? "bg-orange-50 border-orange-200 text-orange-700 font-bold" 
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"
                          }`}
                        >
                          <opt.icon className={`w-4 h-4 ${dietaryType === opt.value ? "text-orange-600" : "text-gray-400"}`} />
                          <span className="text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-100/50" />

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      Price Range (BDT)
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="h-10 rounded-xl bg-gray-50 border-none text-sm font-bold"
                      />
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="h-10 rounded-xl bg-gray-50 border-none text-sm font-bold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Meals Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900">
                {loading ? "Searching..." : `${meals.length} Meals Found`}
              </h3>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-[400px] bg-gray-100 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : meals.length > 0 ? (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {meals.map((meal) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MealCard meal={meal} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-16">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="rounded-xl border-gray-200 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-30"
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-xl font-bold transition-all ${
                            p === page 
                            ? "bg-orange-600 text-white shadow-lg shadow-orange-200" 
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-100"
                          }`}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === totalPages}
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      className="rounded-xl border-gray-200 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-30"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl shadow-gray-100/50">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 mb-2">No meals found</h4>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Try adjusting your filters or search terms.
                </p>
                <Button 
                  onClick={resetFilters}
                  className="rounded-full px-8 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-200"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e2e2; }
      `}</style>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading meals...</div>}>
      <MealsContent />
    </Suspense>
  );
}
