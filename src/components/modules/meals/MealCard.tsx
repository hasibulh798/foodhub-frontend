"use client";

import { useCart } from "@/lib/Cart-context";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Info } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
}

interface MealCardProps {
  meal: MealType;
  provider?: {
    id: string;
    businessName?: string;
  };
}

export default function MealCard({ provider, meal }: MealCardProps) {
  const { addItem } = useCart();
  
  if (!meal) return null;

  const handleAddToCart = () => {
    addItem({
      mealId: meal.id,
      name: meal.name,
      price: Number(meal.price),
      imageUrl: meal.imageUrl ?? undefined,
    });
    toast.success(`${meal.name} added to cart!`, {
      style: {
        borderRadius: '16px',
        background: '#111827',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold'
      },
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
             <Utensils_Internal size={40} />
          </div>
        )}
        
        {/* Dietary Badge */}
        {meal.dietaryType && (
           <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg ${
             meal.dietaryType === "VEG" ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
           }`}>
             {meal.dietaryType}
           </div>
        )}

        {/* Info Overlay on Hover */}
        <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link 
                href={`/restaurants/${provider?.id}/meals/${meal.id}`}
                className="bg-white text-gray-900 p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
            >
                <Info size={20} />
            </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                {meal.name}
            </h3>
            <span className="text-sm font-black text-orange-600 tabular-nums whitespace-nowrap">
                ৳{Number(meal.price)}
            </span>
        </div>

        <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed flex-1">
            {meal.description || "Freshly prepared with the finest ingredients and authentic spices."}
        </p>

        {/* Action Button */}
        <div className="mt-6">
            <button
                disabled={!meal.isAvailable}
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 ${
                    meal.isAvailable
                    ? "bg-gray-900 text-white hover:bg-orange-600 shadow-xl shadow-gray-900/10 hover:shadow-orange-600/20"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
                {meal.isAvailable ? (
                    <>
                        <Plus size={14} className="stroke-[3]" />
                        Add To Selection
                    </>
                ) : "Sold Out"}
            </button>
        </div>
      </div>
    </motion.div>
  );
}

import { Utensils as Utensils_Internal } from "lucide-react";
