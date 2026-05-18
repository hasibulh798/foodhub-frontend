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
  LayoutGrid,
  ChevronDown
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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

function MealsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-64 rounded-[2.5rem]" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function MealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlSearch = searchParams.get("search") || "";
  const urlCategoryId = searchParams.get("categoryId") || "";

  const [meals, setMeals] = useState<Meal[]>([]);
  const [search, setSearch] = useState(urlSearch);
  const [isAvailable, setIsAvailable] = useState(true);
  const [dietaryType, setDietaryType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>(urlCategoryId);
  const [loading, setLoading] = useState(true);

  // Sync with URL params
  useEffect(() => {
    setCategoryId(urlCategoryId);
  }, [urlCategoryId]);

  useEffect(() => {
    setSearch(urlSearch);
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
    setPriceRange([0, 5000]);
    setPage(1);
    router.push("/meals");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background z-10" />
        <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" 
        />
        
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
              Curated <span className="text-primary text-gradient">Culinary</span> Experiences
            </h1>
            <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto backdrop-blur-sm bg-white/5 py-2 px-4 rounded-full border border-white/10">
              Discover local chefs and premium flavors delivered instantly.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Enhanced Filter Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/30 backdrop-blur-xl border border-border/50">
                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <Filter className="w-5 h-5 text-primary" />
                      Filters
                    </CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={resetFilters}
                    className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardHeader>

                <CardContent className="p-8 space-y-10">
                  {/* Search */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Search</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for delights..."
                        className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/50 focus:bg-background transition-all"
                      />
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Categories */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Category</label>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                      <button
                        onClick={() => setCategoryId("")}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                          categoryId === "" 
                          ? "bg-primary text-white shadow-xl shadow-primary/20" 
                          : "bg-muted/50 text-foreground hover:bg-muted font-bold"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                            <LayoutGrid size={18} />
                            <span className="text-sm">All Delights</span>
                        </div>
                        {categoryId === "" && <ChevronRight size={14} />}
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setCategoryId(cat.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                            categoryId === cat.id 
                            ? "bg-primary text-white shadow-xl shadow-primary/20" 
                            : "bg-muted/50 text-foreground hover:bg-muted font-bold"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Utensils size={18} />
                            <span className="text-sm">{cat.name}</span>
                          </div>
                          {categoryId === cat.id && <ChevronRight size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Dietary Type */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Dietary</label>
                    <div className="grid grid-cols-1 gap-3">
                      {dietaryOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setDietaryType(dietaryType === opt.value ? "" : opt.value)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                            dietaryType === opt.value 
                            ? "bg-primary/10 border-primary/30 text-primary font-black" 
                            : "bg-muted/30 border-transparent text-muted-foreground hover:border-border"
                          }`}
                        >
                          <opt.icon className={`w-4 h-4 ${dietaryType === opt.value ? "text-primary" : ""}`} />
                          <span className="text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="opacity-50" />

                  {/* Price Range */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">
                      Price Range (৳)
                    </label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="h-12 rounded-xl bg-muted/50 border-none text-xs font-black pl-8"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">Min</span>
                      </div>
                      <div className="relative flex-1">
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="h-12 rounded-xl bg-muted/50 border-none text-xs font-black pl-8"
                        />
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-bold">Max</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Meals Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-foreground">
                  {loading ? "Searching delights..." : "Discover Menu"}
                </h3>
                {!loading && (
                   <p className="text-muted-foreground font-medium">{meals.length} exquisite dishes found</p>
                )}
              </div>
              <div className="hidden md:block">
                 {/* Sort could go here */}
              </div>
            </div>

            {loading ? (
              <MealsSkeleton />
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
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MealCard meal={meal} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Enhanced Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-20">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1}
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="rounded-2xl h-12 w-12 transition-all disabled:opacity-20"
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-12 h-12 rounded-2xl font-black transition-all ${
                            p === page 
                            ? "bg-primary text-white shadow-xl shadow-primary/30" 
                            : "bg-muted/50 text-foreground hover:bg-muted border-none"
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
                      className="rounded-2xl h-12 w-12 transition-all disabled:opacity-20"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-32 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-8 text-muted-foreground/30">
                  <Utensils size={48} strokeWidth={1} />
                </div>
                <h4 className="text-3xl font-black text-foreground mb-3">No matching delights</h4>
                <p className="text-muted-foreground mb-10 max-w-sm mx-auto font-medium">
                  We couldn't find anything matching your filters. Try something broader?
                </p>
                <Button 
                  onClick={resetFilters}
                  className="rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-primary/20"
                >
                  Reset All Filters
                </Button>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--muted)); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--muted-foreground) / 0.3); }
      `}</style>
    </div>
  );
}

export default function MealsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black animate-pulse">Preheating...</div>}>
      <MealsContent />
    </Suspense>
  );
}
