"use client";

import Image from "next/image";
import { Star, Clock, Bike, Utensils, Info, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="relative mb-12">
      {/* Hero Banner Area */}
      <div className="relative h-[300px] md:h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
        <Image
          src={
            provider.logoUrl ??
            "https://images.unsplash.com/photo-1550547660-d9450f859349"
          }
          alt={provider.businessName ?? "Image"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

        {/* Floating Info Badge */}
        <div className="absolute top-6 left-6 md:top-10 md:left-10 flex gap-3">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
            <ShieldCheck size={18} className="text-orange-600" />
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Partner since 2024</span>
          </div>
        </div>

        {/* Text Details Overlay */}
        <div className="absolute bottom-10 left-6 md:left-10 right-6 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
                {provider.businessName}
              </h1>
              <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                <ShieldCheck size={20} className="fill-current text-white" />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 font-bold text-sm">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span>{provider.rating ?? 4.8} (200+ Reviews)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Clock size={16} className="text-orange-400" />
                <span>{provider.estimatedTime ?? "25-35 min"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Bike size={16} className="text-emerald-400" />
                <span>Delivery: ৳{provider.deliveryFee ?? 50}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4"
          >
            <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-xl text-center min-w-[100px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Menu Items</p>
              <p className="text-2xl font-black text-gray-900 tabular-nums">{totalMeals ?? 0}</p>
            </div>
            <div className="bg-orange-600 px-6 py-4 rounded-[1.5rem] shadow-xl text-center min-w-[100px] text-white shadow-orange-600/20">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-1">Satisfied</p>
              <p className="text-2xl font-black tabular-nums">{totalOrder ?? 0}+</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Address Section */}
      <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2.5 rounded-xl text-gray-400">
            <Utensils size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Our Location</p>
            <p className="text-sm font-bold text-gray-600 mt-0.5">{provider.address}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest hover:bg-orange-50 px-4 py-2 rounded-xl transition-all">
          <Info size={16} />
          More Info
        </button>
      </div>
    </div>
  );
}
