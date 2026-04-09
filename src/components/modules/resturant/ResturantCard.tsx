"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, ShieldCheck } from "lucide-react";

interface ProviderProps {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string | null;
  isVerified: boolean;
}

export default function RestaurantCard({
  id,
  businessName,
  address,
  logoUrl,
  isVerified,
}: ProviderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/restaurants/${id}`}>
        <div className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full">
          
          {/* Logo / Cover Container */}
          <div className="relative h-48 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={businessName}
                width={400}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-300">
                <span className="text-4xl">🍽️</span>
                <span className="text-xs font-medium uppercase tracking-widest">No Image</span>
              </div>
            )}

            {/* Verification Badge - Overlay */}
            {isVerified && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500 fill-emerald-500/10" />
                <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider">Premium</span>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg shadow-orange-600/20">
              NEW
            </div>
          </div>

          {/* Info Section */}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                {businessName}
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-amber-700">4.8</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-gray-500 mb-6">
              <MapPin size={14} className="mt-0.5 shrink-0 text-orange-500" />
              <p className="text-xs font-medium leading-relaxed line-clamp-2">
                {address}
              </p>
            </div>

            {/* Bottom Actions/Tags */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-tighter">Fast Delivery</span>
                <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-tighter">Top Rated</span>
              </div>
              <div className="bg-gray-900 group-hover:bg-orange-600 p-2 rounded-xl text-white transition-colors duration-300 shadow-lg shadow-gray-900/10 group-hover:shadow-orange-600/20">
                <Star size={14} className="fill-current" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}