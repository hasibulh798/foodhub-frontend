"use client";

import Image from "next/image";
import { Star, Clock, Bike, Utensils, Info, ShieldCheck, Share2, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface RestaurantHeaderProps {
  provider: {
    businessName: string;
    logoUrl?: string | null;
    address: string;
    rating?: number;
    deliveryFee?: number;
    estimatedTime?: string;
  };
  totalMeals?: number;
  totalOrder?: number;
}

export default function RestaurantHeader({
  provider,
  totalMeals,
  totalOrder,
}: RestaurantHeaderProps) {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div ref={containerRef} className="relative mb-16 pt-6">
      <div className="relative h-[450px] md:h-[550px] w-full rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10">
        {/* Parallax Background Image */}
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <Image
            src={
              provider.logoUrl ??
              "https://images.unsplash.com/photo-1550547660-d9450f859349"
            }
            alt={provider.businessName ?? "Restaurant Image"}
            fill
            className="object-cover scale-110"
            priority
          />
        </motion.div>

        {/* Sophisticated Multi-layer Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent" />

        {/* Top Control Bar */}
        <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-2 rounded-full shadow-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Open Now</span>
            </div>
            <div className="bg-orange-600/90 backdrop-blur-xl px-5 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-orange-500/30">
              <ShieldCheck size={14} className="text-white" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Top Rated Partner</span>
            </div>
          </motion.div>

          <div className="flex gap-3">
             <button className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl">
                <Share2 size={18} />
             </button>
             <button className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all shadow-xl">
                <Heart size={18} />
             </button>
          </div>
        </div>

        {/* Main Branding Section */}
        <div className="absolute bottom-12 left-10 right-10 z-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div 
              style={{ opacity }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-3xl space-y-6"
            >
              <div className="space-y-2">
                 <div className="flex items-center gap-3 mb-1">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest ml-1">4.9 (2.4k Reviews)</span>
                 </div>
                 <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                  {provider.businessName}
                </h1>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <QuickBadge icon={<Clock size={16} />} text={provider.estimatedTime || "25-30 MIN"} color="orange" />
                <QuickBadge icon={<Bike size={16} />} text={`৳${provider.deliveryFee || 50} DELIVERY`} color="emerald" />
                <QuickBadge icon={<Utensils size={16} />} text="GOURMET CUISINE" color="blue" />
              </div>
            </motion.div>

            {/* Performance Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 lg:w-[350px]"
            >
              <StatCard label="Curation" value={totalMeals || 0} sub="Original Meals" />
              <StatCard label="Community" value={`${totalOrder || 0}+`} sub="Success Orders" highlight />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Meta Details */}
      <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-6">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3">
              <div className="p-4 rounded-3xl bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white shadow-inner">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Location Details</p>
                <p className="text-base font-black text-gray-700 dark:text-gray-300 leading-none">{provider.address}</p>
              </div>
           </div>
           
           <div className="hidden lg:flex flex-col border-l border-gray-100 dark:border-zinc-800 pl-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Service Quality</p>
              <div className="flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                 </div>
                 <p className="text-xs font-bold text-emerald-600">Excellent Hygiene Certified</p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl shadow-gray-900/20 active:scale-95">
              <Info size={18} />
              Restaurant Guide
           </button>
        </div>
      </div>
    </div>
  );
}

function QuickBadge({ icon, text, color }: any) {
    const colors: any = {
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    };
    return (
        <div className={`flex items-center gap-2 backdrop-blur-md px-5 py-2.5 rounded-2xl border font-black text-[10px] tracking-widest shadow-lg ${colors[color]}`}>
            {icon}
            {text}
        </div>
    );
}

function StatCard({ label, value, sub, highlight }: any) {
    return (
        <div className={`p-6 rounded-[2.5rem] transition-all border ${highlight ? 'bg-orange-600 text-white border-orange-500 shadow-2xl shadow-orange-600/40' : 'bg-white/10 backdrop-blur-xl text-white border-white/10 shadow-2xl'}`}>
            <p className={`text-[9px] font-bold uppercase tracking-[0.3em] mb-3 ${highlight ? 'text-orange-200' : 'text-white/40'}`}>{label}</p>
            <div className="flex flex-col">
                <span className="text-3xl font-black leading-none mb-1">{value}</span>
                <span className={`text-[10px] font-bold ${highlight ? 'text-white/70' : 'text-white/30'}`}>{sub}</span>
            </div>
        </div>
    );
}

import { Heart } from "lucide-react";

