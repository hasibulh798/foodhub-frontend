"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useQuery } from "@tanstack/react-query";
import { reviewServices } from "@/services/review.service";

const STATIC_REVIEWS = [
  {
    id: "static-1",
    customer: { 
      name: "Tasnim Rahman", 
      role: "Dhaka Food Critic",
      image: "/home/reviews/1.jpg" 
    },
    meal: { name: "Premium Burger" },
    comment: "The variety of restaurants available in Dhaka is incredible. I've discovered so many local gems through Food Hub!",
    rating: 5,
  },
  {
    id: "static-2",
    customer: { 
      name: "Asif Chowdhury", 
      role: "Dhanmondi Food Blogger",
      image: "/home/reviews/2.jpg" 
    },
    meal: { name: "Spicy Ramen" },
    comment: "Fast delivery in Gulshan and the food always arrives boiling hot. The app is super intuitive and easy to use.",
    rating: 5,
  },
  {
    id: "static-3",
    customer: { 
      name: "Naimur Hasan", 
      role: "Tech Enthusiast",
      image: "/home/reviews/3.jpg" 
    },
    meal: { name: "Vegan Bowl" },
    comment: "I love the verification system for providers. It gives me peace of mind knowing the kitchens are certified.",
    rating: 4,
  },
  {
    id: "static-4",
    customer: { 
      name: "Zayd Al-Masoom", 
      role: "Student & Foodie",
      image: "/home/reviews/4.jpg" 
    },
    meal: { name: "Honey Salmon" },
    comment: "The interface is simply stunning. Ordering feels like a premium experience every single time.",
    rating: 5,
  },
  {
    id: "static-5",
    customer: { 
      name: "Tanvir Ahmed", 
      role: "Culinary Explorer",
      image: "/home/reviews/5.jpg" 
    },
    meal: { name: "Truffle Pasta" },
    comment: "Finally a platform that treats local providers with the respect they deserve. Quality of the meals is unmatched.",
    rating: 5,
  },
];

export default function ReviewSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: rawReviews, isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: () => reviewServices.getPublicReviews(),
  });

  const realReviews = Array.isArray(rawReviews) ? rawReviews : [];

  // Ensure at least 5 reviews by combining real and static data
  const displayReviews = [...realReviews];
  if (displayReviews.length < 5) {
    const remaining = 5 - displayReviews.length;
    displayReviews.push(...STATIC_REVIEWS.slice(0, remaining));
  }

  return (
    <section className="py-20 sm:py-28 bg-[#FFF] dark:bg-[#060606] overflow-hidden relative border-b border-gray-100/50 dark:border-zinc-900/50">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.02] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl space-y-2"
            >
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.25em]">
                <Star size={10} fill="currentColor" />
                Diner's Voice
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none text-zinc-900 dark:text-white">
                Our Global <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Community</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium max-w-md leading-relaxed">
                Discover why thousands of foodies choose our platform for their daily culinary adventures.
              </p>
            </motion.div>
            
            {/* Sleek, Compact Arrow Navigation */}
            <div className="flex gap-2">
                <button
                  ref={prevRef}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center justify-center group active:scale-95 shrink-0"
                >
                  <ChevronLeft className="w-4.5 h-4.5 group-active:scale-90 transition-transform" />
                </button>
                <button
                  ref={nextRef}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 shadow-sm hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all flex items-center justify-center group active:scale-95 shrink-0"
                >
                  <ChevronRight className="w-4.5 h-4.5 group-active:scale-90 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      {/* Review Slides Area */}
      <div className="max-w-[1400px] mx-auto w-full px-6">
        {!mounted || isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[240px] bg-zinc-100 dark:bg-zinc-800/50 animate-pulse rounded-3xl" />
             ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
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
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={800}
            breakpoints={{
              640: { slidesPerView: 2, slidesPerGroup: 1 },
              1024: { slidesPerView: 3, slidesPerGroup: 1 },
            }}
            className="pb-16 !overflow-visible"
          >
            {displayReviews.map((review: any, idx: number) => (
              <SwiperSlide key={review.id || idx}>
                <div className="bg-gradient-to-br from-orange-50/70 to-red-50/40 dark:from-[#110e0c]/60 dark:to-[#070707]/80 backdrop-blur-md border border-orange-100/50 dark:border-zinc-800/70 rounded-[2rem] p-8 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/30 dark:hover:border-orange-500/40 transition-all duration-500 min-h-[240px]">
                  
                  <Quote className="absolute top-6 right-6 w-7 h-7 text-orange-500/10 group-hover:text-orange-500/25 transition-all duration-500" />
                  
                  {/* Styled Review Comment */}
                  <div className="flex-1 w-full overflow-hidden mb-6">
                    <p className="text-xs sm:text-[13px] leading-relaxed font-semibold italic text-zinc-700 dark:text-zinc-300 tracking-wide line-clamp-3 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                      "{review.comment || review.content}"
                    </p>
                  </div>

                  {/* Customer Information Footer */}
                  <div className="flex items-center gap-3 pt-4 border-t border-orange-100/20 dark:border-zinc-800/80 w-full mt-auto">
                    <div className="relative w-9.5 h-9.5 rounded-xl overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-800 border border-orange-100 dark:border-zinc-700 shrink-0">
                      {review.customer?.image ? (
                        <img
                          src={review.customer.image}
                          alt={review.customer.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-red-650 font-black text-xs uppercase bg-red-50 dark:bg-red-500/10">
                          {review.customer?.name?.[0]}
                        </div>
                      )}
                    </div>
                    
                    <div className="overflow-hidden flex-grow text-left">
                      <h4 className="font-black text-[11px] sm:text-xs text-zinc-850 dark:text-white truncate leading-none mb-1">
                        {review.customer?.name}
                      </h4>
                      {/* Reviewer Role Display */}
                      <p className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wide mb-1.5 leading-none">
                        {review.customer?.role || "Gourmet Diner"}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={9}
                            className={` ${
                              i < review.rating ? "fill-amber-450 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Compact Item Badge */}
                    <div className="hidden sm:block">
                        <span className="text-[8px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-tighter truncate max-w-[65px] block bg-orange-500/10 dark:bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/10 dark:border-orange-500/30">
                           {review.meal?.name?.split(' ')[0] || "Diner"}
                        </span>
                    </div>
                  </div>
                  
                  {/* Tiny decorative border stripe */}
                  <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
