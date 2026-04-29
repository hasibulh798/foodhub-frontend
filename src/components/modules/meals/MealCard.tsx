"use client";

import { useCart } from "@/lib/Cart-context";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Info, Utensils, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
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
    deliveryFee?: number | string;
  };
}

export default function MealCard({ provider, meal }: MealCardProps) {
  const { addItem, items, removeItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isPopular] = useState(() => Math.random() > 0.7);
  
  if (!meal) return null;

  const cartItem = items.find((item) => item.mealId === meal.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    // If provider is passed as prop, use it. Otherwise try to get it from meal.
    const pId = provider?.id || (meal as any).providerId;
    const dFee = Number(provider?.deliveryFee) || Number((meal as any).provider?.deliveryFee) || 60;

    if (!pId) {
      toast.error("Provider information missing");
      return;
    }

    addItem({
      mealId: meal.id,
      name: meal.name,
      price: Number(meal.price),
      imageUrl: meal.imageUrl ?? undefined,
      providerId: pId,
      deliveryFee: dFee,
    });
    if (quantity === 0) {
      toast.success(`${meal.name} added to selection`, {
        icon: '👨‍🍳',
        style: {
          borderRadius: '20px',
          background: '#111827',
          color: '#fff',
          fontSize: '14px',
          padding: '16px 24px',
        },
      });
    }
  };

  const handleRemoveOne = () => {
    if (quantity > 0) {
      removeItem(meal.id);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Top Media Section */}
      <div className="relative h-60 w-full bg-gray-50 dark:bg-zinc-800 overflow-hidden">
        {meal.imageUrl ? (
          <Image
            src={meal.imageUrl}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-zinc-700">
             <Utensils size={48} className="mb-2 opacity-20" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Preview</span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
            >
                <Heart size={16} className={isLiked ? "fill-current" : ""} />
            </button>
            <Link 
                href={`/restaurants/${provider?.id}/meals/${meal.id}`}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white shadow-lg transition-all"
            >
                <Info size={16} />
            </Link>
        </div>

        {/* Dietary Tag */}
        {meal.dietaryType && (
           <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl flex items-center gap-1.5 ${
             meal.dietaryType === "VEG" ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"
           }`}>
             <span className={`w-1.5 h-1.5 rounded-full bg-white ${meal.dietaryType === "VEG" ? "animate-pulse" : ""}`} />
             {meal.dietaryType}
           </div>
        )}

        {/* Popular Badge Placeholder */}
        {isPopular && (
            <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-amber-500 text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg">
                <Star size={10} className="fill-current" />
                Popular Choice
            </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 transition-colors">
                <Link href={`/restaurants/${provider?.id}/meals/${meal.id}`} className="hover:text-orange-600 transition-colors"  >
                    {meal.name}
                </Link>
            </h3>
            <div className="flex flex-col items-end">
                <span className="text-lg font-black text-orange-600 tabular-nums">
                    ৳{Number(meal.price)}
                </span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Per Serving</span>
            </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2 leading-relaxed flex-1 mb-8">
            {meal.description || "Indulge in our masterfully crafted signature dish, prepared with premium locally sourced ingredients and authentic family recipes passed down through generations."}
        </p>

        {/* Unified Action Button / Quantity Selector */}
        <div className="relative mt-auto">
            <AnimatePresence mode="wait">
                {quantity > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between bg-orange-600 rounded-[1.5rem] p-1 shadow-xl shadow-orange-600/30 border border-orange-500"
                    >
                        <button 
                            onClick={handleRemoveOne}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
                        >
                            <Minus size={18} strokeWidth={3} />
                        </button>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-white tabular-nums leading-none">{quantity}</span>
                            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">In Plate</span>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className="p-3 bg-white text-orange-600 rounded-2xl transition-all active:scale-95 shadow-lg"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        disabled={!meal.isAvailable}
                        onClick={handleAddToCart}
                        className={`w-full py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group/btn flex items-center justify-center gap-3 active:scale-[0.98] ${
                            meal.isAvailable
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-orange-600 hover:dark:bg-orange-600 hover:text-white shadow-xl shadow-gray-900/10 hover:shadow-orange-600/20"
                            : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed"
                        }`}
                    >
                        {meal.isAvailable ? (
                            <>
                                <Utensils size={14} className="stroke-[3] group-hover:rotate-12 transition-transform" />
                                <span>Add to Cart</span>
                                <Plus size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </>
                        ) : (
                          <span className="flex items-center gap-2 italic">
                            Currently Unavailable
                          </span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
      </div>
      
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none" />
    </motion.div>
  );
}

