"use client";

import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    content: "The variety of restaurants available is incredible. I've discovered so many local gems through Food Hub!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Regular Customer",
    content: "Fast delivery and the food always arrives hot. The app is super intuitive and easy to use.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Local Guide",
    content: "I love the verification system for providers. It gives me peace of mind knowing the kitchens are vetted.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Khairul Islam",
    role: "Verified Epicure",
    content: "The interface is simply stunning. Ordering feels like a premium experience every single time.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Ayesha Ahmed",
    role: "Gourmet Critic",
    content: "Finally a platform that treats local providers with the respect they deserve. Quality is unmatched.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Tanvir Rahman",
    role: "Daily Diner",
    content: "Supporting local businesses has never been this easy or looked this good. Highly recommended!",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&h=150&auto=format&fit=crop",
  },
];

export default function ReviewSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="py-32 bg-gray-50 dark:bg-zinc-950/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest mb-6">
                <Star size={12} fill="currentColor" />
                Community Stories
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none dark:text-white">
                Loved by <span className="text-red-600">Thousands</span>
              </h2>
              <p className="text-muted-foreground text-xl font-medium tracking-tight">
                Join the gourmet revolution. Here's what our community says about their experience.
              </p>
            </motion.div>
            
            <div className="flex gap-4">
                <button
                  ref={prevRef}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl hover:bg-red-600 hover:text-white transition-all group"
                >
                  <ChevronLeft className="w-6 h-6 group-active:scale-90 transition-transform" />
                </button>
                <button
                  ref={nextRef}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl hover:bg-red-600 hover:text-white transition-all group"
                >
                  <ChevronRight className="w-6 h-6 group-active:scale-90 transition-transform" />
                </button>
            </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={32}
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
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: { slidesPerView: 2, slidesPerGroup: 1 },
            1024: { slidesPerView: 3, slidesPerGroup: 1 },
          }}
          className="pb-20 !overflow-visible"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden flex flex-col items-start text-left group hover:shadow-2xl hover:border-red-500/20 transition-all duration-500 h-[400px]">
                <Quote className="absolute -top-6 -right-6 w-32 h-32 text-red-500/5 rotate-12 group-hover:text-red-500/10 transition-colors" />
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-100 dark:text-zinc-800"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xl leading-relaxed mb-10 font-bold text-gray-900 dark:text-white tracking-tight flex-1">
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:rotate-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-[10px] text-red-500 font-black tracking-[0.2em] uppercase">{review.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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


