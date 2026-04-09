"use client";

import { categoryServices } from "@/services/category.service";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Pizza, 
  Leaf, 
  Coffee, 
  Sandwich, 
  CakeSlice, 
  Soup, 
  UtensilsCrossed, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

const iconMap: Record<string, any> = {
  "Pizza": <Pizza size={32} />,
  "Healthy": <Leaf size={32} />,
  "Beverages": <Coffee size={32} />,
  "Fast Food": <Sandwich size={32} />,
  "Desserts": <CakeSlice size={32} />,
  "Traditional": <Soup size={32} />,
  "default": <UtensilsCrossed size={32} />
};

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryServices.getAllCategories();
        setCategories(data.slice(0, 8)); // Show top 8
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-2 text-orange-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                    <TrendingUp size={14} />
                    Popular Cravings
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-6">
                    Browse By <span className="text-orange-600">Category</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium tracking-tight max-w-xl">
                    Discover your next favorite meal through our curated collections of local and international flavors.
                </p>
            </motion.div>

            <Link href="/restaurants" className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-sm font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                View All Specialties
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {categories.map((category, i) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                >
                    <Link href={`/restaurants?category=${category.id}`} className="group relative flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-600/5 hover:-translate-y-2">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        
                        <div className="mb-6 w-20 h-20 rounded-3xl bg-white dark:bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:text-orange-600 group-hover:bg-orange-50 transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:rotate-6">
                            {iconMap[category.name] || iconMap["default"]}
                        </div>

                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight group-hover:text-orange-600 transition-colors">
                            {category.name}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore Selection
                        </p>

                        {/* Background Decor */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-600/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
