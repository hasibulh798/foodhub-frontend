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
    <section className="py-6 sm:py-8 bg-[#F8F9FA] dark:bg-[#060606] border-y border-gray-100/50 dark:border-zinc-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Sleek, Compact Header Area */}
        <div className="flex items-center justify-between gap-6 mb-5">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-1"
            >
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 font-black text-[9px] uppercase tracking-[0.2em]">
                    <TrendingUp size={12} />
                    Categories
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    Browse By <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Category</span>
                </h2>
            </motion.div>

            {/* Small Navigation Arrows */}
            <div className="flex items-center gap-2">
                <button 
                  ref={prevRef}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-800/80 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                >
                    <ChevronLeft size={14} />
                </button>
                <button 
                  ref={nextRef}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-zinc-800/80 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-sm active:scale-95 shrink-0"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>

        {/* Compact Slides Layout */}
        <div className="relative group">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={14}
            slidesPerView={3}
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
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 10 },
              480: { slidesPerView: 4, spaceBetween: 12 },
              640: { slidesPerView: 5, spaceBetween: 12 },
              768: { slidesPerView: 6, spaceBetween: 14 },
              1024: { slidesPerView: 8, spaceBetween: 14 },
              1280: { slidesPerView: 9, spaceBetween: 16 },
            }}
            className="pb-7 !overflow-visible"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <Link 
                  href={`/meals?categoryId=${category.id}`} 
                  className="flex flex-col items-center justify-center aspect-square w-full p-2 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/60 rounded-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FFF5EE] dark:bg-orange-950/20 flex items-center justify-center mb-2 overflow-hidden transition-transform duration-300 hover:scale-105">
                    {category.iconUrl ? (
                      <img 
                        src={category.iconUrl} 
                        alt={category.name} 
                        className="w-8 h-8 object-contain" 
                      />
                    ) : (
                      <UtensilsCrossed size={18} className="text-orange-600 dark:text-orange-500 hover:scale-110 transition-transform duration-300" />
                    )}
                  </div>
                  <h3 className="text-[12px] font-black text-zinc-700 dark:text-zinc-300 text-center tracking-tight truncate max-w-full group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
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
          width: 5px;
          height: 5px;
          background: #D1D5DB;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 15px;
          border-radius: 3px;
          background: #EA580C !important;
        }
        .dark .swiper-pagination-bullet {
          background: #3F3F46;
        }
      `}</style>
    </section>
  );
}

