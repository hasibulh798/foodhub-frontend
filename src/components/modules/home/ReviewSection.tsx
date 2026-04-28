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
    customer: { name: "Sarah Johnson", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop" },
    meal: { name: "Premium Burger" },
    comment: "The variety of restaurants available is incredible. I've discovered so many local gems through Food Hub!",
    rating: 5,
  },
  {
    id: "static-2",
    customer: { name: "David Chen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop" },
    meal: { name: "Spicy Ramen" },
    comment: "Fast delivery and the food always arrives hot. The app is super intuitive and easy to use.",
    rating: 5,
  },
  {
    id: "static-3",
    customer: { name: "Maria Rodriguez", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop" },
    meal: { name: "Vegan Bowl" },
    comment: "I love the verification system for providers. It gives me peace of mind knowing the kitchens are vetted.",
    rating: 4,
  },
  {
    id: "static-4",
    customer: { name: "Khairul Islam", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop" },
    meal: { name: "Honey Glazed Salmon" },
    comment: "The interface is simply stunning. Ordering feels like a premium experience every single time.",
    rating: 5,
  },
  {
    id: "static-5",
    customer: { name: "Ayesha Ahmed", image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&h=150&auto=format&fit=crop" },
    meal: { name: "Truffle Pasta" },
    comment: "Finally a platform that treats local providers with the respect they deserve. Quality is unmatched.",
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
    <section className="py-32 bg-gray-50 dark:bg-zinc-950/50 overflow-hidden relative">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">
                <Star size={10} fill="currentColor" />
                Diner's Voice
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none dark:text-white">
                Our Global <br />
                <span className="text-red-600 italic">Community</span>
              </h2>
              <p className="text-muted-foreground text-xl font-medium tracking-tight max-w-lg">
                Discover why thousands of foodies choose our platform for their daily culinary adventures.
              </p>
            </motion.div>
            
            <div className="flex gap-3">
                <button
                  ref={prevRef}
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group"
                >
                  <ChevronLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
                <button
                  ref={nextRef}
                  className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center group"
                >
                  <ChevronRight className="w-5 h-5 group-active:scale-90 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6">
        {!mounted || isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[200px] bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-[2rem]" />
             ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
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
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={1000}
            breakpoints={{
              768: { slidesPerView: 2, slidesPerGroup: 1 },
              1024: { slidesPerView: 3, slidesPerGroup: 1 },
            }}
            className="pb-20 !overflow-visible"
          >
            {displayReviews.map((review: any, idx: number) => (
              <SwiperSlide key={review.id || idx}>
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-gray-100 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col items-start text-left group hover:shadow-xl hover:shadow-red-500/5 hover:border-red-500/30 transition-all duration-500 h-[200px]">
                  <Quote className="absolute top-4 right-6 w-8 h-8 text-red-500/10 group-hover:text-red-500/20 transition-all duration-500" />
                  
                  <div className="flex-1 w-full overflow-hidden mb-4">
                    <p className="text-sm md:text-base leading-tight font-bold text-gray-800 dark:text-zinc-100 tracking-tight line-clamp-2 italic group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      "{review.comment || review.content}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-zinc-800/50 w-full mt-auto">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-gray-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-700 shrink-0">
                      {review.customer?.image ? (
                        <img
                          src={review.customer.image}
                          alt={review.customer.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-sm uppercase bg-red-50 dark:bg-red-500/10">
                          {review.customer?.name?.[0]}
                        </div>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h4 className="font-black text-xs text-gray-900 dark:text-white truncate leading-none mb-1">{review.customer?.name}</h4>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={` ${
                              i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-100 dark:text-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-tighter truncate max-w-[60px] block">
                           {review.meal?.name?.split(' ')[0] || "Diner"}
                        </span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
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
          width: 32px;
          border-radius: 4px;
          background: #EF4444 !important;
        }
        .dark .swiper-pagination-bullet {
          background: #3F3F46;
        }
      `}</style>
    </section>
  );
}


