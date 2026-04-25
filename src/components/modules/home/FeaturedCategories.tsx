"use client";

import { categoryServices } from "@/services/category.service";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UtensilsCrossed 
} from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Category {
  id: string;
  name: string;
  iconUrl?: string;
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoryServices.getAllCategories();
        // Defensive check for array structure
        const categoryData = Array.isArray(data) ? data : (data?.data || []);
        setCategories(categoryData); 
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <section className="py-24 bg-[#F8F9FA] dark:bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-3">
                    <TrendingUp size={16} />
                    Featured Collections
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                    Browse By <span className="text-orange-600">Category</span>
                </h2>
            </motion.div>

            <div className="flex items-center gap-3">
                <button 
                  ref={prevRef}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <button 
                  ref={nextRef}
                  className="w-8 h-8 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-sm"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="pb-16 !overflow-visible"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link 
                  href={`/meals?category=${category.id}`} 
                  className="flex flex-col items-center p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="w-20 h-20 rounded-full bg-[#FFF5EE] dark:bg-orange-900/10 flex items-center justify-center mb-4 overflow-hidden">
                    {category.iconUrl ? (
                      <img 
                        src={category.iconUrl} 
                        alt={category.name} 
                        className="w-16 h-16 object-contain" 
                      />
                    ) : (
                      <UtensilsCrossed size={32} className="text-orange-600 group-hover:text-white transition-colors duration-500" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #D1D5DB;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: #EA580C !important;
        }
        .dark .swiper-pagination-bullet {
          background: #3F3F46;
        }
      `}</style>
    </section>
  );
}

