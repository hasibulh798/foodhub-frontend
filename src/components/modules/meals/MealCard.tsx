"use client";

import { useCart } from "@/lib/Cart-context";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Info, Utensils, Star, Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";

interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
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
  const [isPopular] = useState(() => Math.random() > 0.8);
  
  if (!meal) return null;

  const cartItem = items.find((item) => item.mealId === meal.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    const pId = provider?.id || (meal as any).providerId;
    const dFee = Number(provider?.deliveryFee) || Number((meal as any).provider?.deliveryFee) || 60;

    if (!pId) {
      toast.error("Kitchen info missing");
      return;
    }

    addItem({
      mealId: meal.id,
      name: meal.name,
      price: Number(meal.price),
      imageUrl: meal.images && meal.images.length > 0 ? meal.images[0] : undefined,
      providerId: pId,
      deliveryFee: dFee,
    });

    if (quantity === 0) {
      toast.success(`${meal.name} added!`, {
        icon: '👨‍🍳',
        style: {
          borderRadius: '1.5rem',
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          fontWeight: 'bold',
          border: '1px solid hsl(var(--border))',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
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
      className="group relative bg-card rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col h-full"
    >
      {/* Top Media Section */}
      <div className="relative h-64 w-full bg-muted overflow-hidden">
        {meal.images && meal.images.length > 0 ? (
          <Image
            src={meal.images[0]}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
             <Utensils size={64} strokeWidth={1} className="mb-2" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Preview</span>
          </div>
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Floating Actions */}
        <div className="absolute top-5 right-5 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-500 delay-75">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-2xl backdrop-blur-md shadow-xl transition-all active:scale-90 ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
            </button>
            <Link 
                href={`/restaurants/${provider?.id || (meal as any).providerId}/meals/${meal.id}`}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white shadow-xl transition-all active:scale-90"
            >
                <Info size={18} />
            </Link>
        </div>

        {/* Status Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
            {meal.dietaryType && (
            <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-2xl flex items-center gap-2 ${
                meal.dietaryType === "VEG" ? "bg-emerald-500/80 text-white" : "bg-primary/80 text-white"
            }`}>
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${meal.dietaryType === "VEG" ? "animate-pulse" : ""}`} />
                {meal.dietaryType}
            </div>
            )}
            {isPopular && (
                <div className="flex items-center gap-2 bg-amber-500/90 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md border border-white/20">
                    <Star size={12} className="fill-current" />
                    Popular
                </div>
            )}
        </div>

        {/* Hover Info Overlay */}
        <div className="absolute bottom-5 left-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
             <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest line-clamp-1">
                From {provider?.businessName || (meal as any).provider?.businessName || "Chef Delight"}
             </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
            <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                <Link href={`/restaurants/${provider?.id || (meal as any).providerId}/meals/${meal.id}`} className="hover:text-primary transition-colors">
                    {meal.name}
                </Link>
            </h3>
            <div className="flex flex-col items-end">
                <div className="text-2xl font-black text-primary tabular-nums">
                    ৳{Number(meal.price).toLocaleString()}
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">serving</div>
            </div>
        </div>

        <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed flex-1 mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
            {meal.description || "A masterfully crafted signature dish, prepared with premium locally sourced ingredients and authentic family secrets."}
        </p>

        {/* Actions */}
        <div className="relative mt-auto">
            <AnimatePresence mode="wait">
                {quantity > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-between bg-primary rounded-3xl p-1.5 shadow-xl shadow-primary/30 border border-primary/50"
                    >
                        <button 
                            onClick={handleRemoveOne}
                            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all active:scale-90"
                        >
                            <Minus size={20} strokeWidth={4} />
                        </button>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-black text-white tabular-nums leading-none">{quantity}</span>
                            <span className="text-[9px] font-black text-white/70 uppercase tracking-widest mt-1">Added</span>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            className="p-3 bg-white text-primary rounded-2xl transition-all active:scale-95 shadow-xl hover:shadow-white/20"
                        >
                            <Plus size={20} strokeWidth={4} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        disabled={!meal.isAvailable}
                        onClick={handleAddToCart}
                        className={`w-full py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 group/btn flex items-center justify-center gap-3 active:scale-[0.98] border shadow-sm ${
                            meal.isAvailable
                            ? "bg-foreground text-background hover:bg-primary hover:text-white hover:border-primary shadow-xl hover:shadow-primary/30"
                            : "bg-muted text-muted-foreground/50 border-transparent cursor-not-allowed"
                        }`}
                    >
                        {meal.isAvailable ? (
                            <>
                                <ShoppingBag size={16} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                                <span>Add to Selection</span>
                                <Plus size={14} strokeWidth={4} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
      
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
}

