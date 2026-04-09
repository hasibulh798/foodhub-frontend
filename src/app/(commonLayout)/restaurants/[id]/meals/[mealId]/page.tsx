"use client";

import { useCart } from "@/lib/Cart-context";
import { mealServices } from "@/services/meal.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  Clock, 
  Flame, 
  ShieldCheck, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Utensils, 
  Leaf, 
  Info,
  ArrowRight,
  ThumbsUp
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Meal {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
  reviews: { id: string; user: string; rating: number; comment: string; createdAt?: string }[];
}

export default function MealDetailsPage({
  params,
}: {
  params: { id: string; mealId: string };
}) {
  const { id: providerId, mealId } = React.use(params);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, items, removeItem } = useCart();

  useEffect(() => {
    async function fetchMeal() {
      try {
        const data = await mealServices.getSingleMeal(mealId);
        setMeal(data);
      } catch (err) {
        console.error("Failed to fetch meal:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [mealId]);

  const currentCartItem = items.find(item => item.mealId === mealId);
  const cartQuantity = currentCartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (!meal) return;
    
    // If adding from detail page, we add the current selected quantity
    for(let i = 0; i < quantity; i++) {
        addItem({
          mealId,
          name: meal.name,
          price: Number(meal.price),
          imageUrl: meal.imageUrl,
        });
    }
    
    toast.success(`Selected ${quantity} of ${meal.name}`, {
      icon: '✨',
      style: {
        borderRadius: '24px',
        background: '#111827',
        color: '#fff',
        fontSize: '14px',
      },
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Preparing Visuals...</p>
        </div>
    </div>
  );

  if (!meal) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Meal Not Found</h2>
        <Link href="/restaurants" className="text-orange-600 font-bold underline">Discover other flavors</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20 overflow-x-hidden">
      {/* Dynamic Header / Cover Section */}
      <div className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden">
        <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
        >
          <Image
            src={meal.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
            alt={meal.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
        
        {/* Top Floating Controls */}
        <div className="absolute top-8 left-8 z-20">
            <Link 
                href={`/restaurants/${providerId}`}
                className="p-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-2 group shadow-2xl"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Return to Menu</span>
            </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Primary Info */}
            <div className="lg:col-span-8 space-y-12">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-14 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-zinc-800"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        {meal.dietaryType && (
                           <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${
                             meal.dietaryType === "VEG" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                           }`}>
                             <Leaf size={14} />
                             {meal.dietaryType} Choice
                           </div>
                        )}
                        <div className="px-5 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                           <Flame size={14} />
                           High Calorie
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-8">
                        {meal.name}
                    </h1>

                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-12">
                        {meal.description || "Every ingredient is selected for flavor, nutrition, and environmental impact. We source our produce locally to ensure peak freshness and taste in every bite you take."}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-gray-50 dark:border-zinc-800">
                        <Feature icon={<Clock className="text-orange-500" />} label="Prep Time" value="15-20 m" />
                        <Feature icon={<ShieldCheck className="text-emerald-500" />} label="Hygiene" value="Grade A" />
                        <Feature icon={<Star className="text-amber-500" />} label="Rating" value="4.8/5" />
                        <Feature icon={<Utensils className="text-blue-500" />} label="Portion" value="Standard" />
                    </div>

                    {/* Nutritional Information (Mock) */}
                    <div className="mt-12">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-6">Nutritional Essence</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <Nutrient label="PROTEIN" value="24g" />
                            <Nutrient label="CARBS" value="52g" />
                            <Nutrient label="FAT" value="12g" />
                            <Nutrient label="CALORIES" value="450" />
                        </div>
                    </div>
                </motion.div>

                {/* Reviews Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-6">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                            Gastronomic Reviews
                        </h2>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{meal.reviews.length} Voices</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {meal.reviews.length === 0 ? (
                          <div className="col-span-full py-20 bg-gray-50 dark:bg-zinc-900/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-zinc-800 text-center">
                              <p className="text-gray-400 font-bold">Be the first to taste and review!</p>
                          </div>
                        ) : (
                          meal.reviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-zinc-900 border border-gray-50 dark:border-zinc-800 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mb-6 italic">"{review.comment}"</p>
                                <div className="flex items-center gap-3 border-t border-gray-50 dark:border-zinc-800 pt-6">
                                    <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 font-black text-xs uppercase">
                                        {review.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-sm text-gray-900 dark:text-white leading-none">{review.user}</p>
                                        <p className="text-[10px] text-gray-400 uppercase font-black mt-1">Verified Patron</p>
                                    </div>
                                </div>
                            </div>
                          ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Sticky Action Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden"
                >
                    <div className="relative z-10 space-y-10">
                        <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 dark:text-gray-400">Pure Indulgence</p>
                             <h2 className="text-5xl font-black tracking-tight tabular-nums italic">৳{meal.price}</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="font-black text-[10px] uppercase tracking-widest opacity-60">Selection Weight</span>
                                <div className="flex items-center gap-6 bg-white/10 dark:bg-gray-100 p-2 rounded-2xl">
                                    <button 
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl bg-white/10 dark:bg-white flex items-center justify-center hover:bg-white/20 dark:hover:bg-gray-200 transition-all text-white dark:text-gray-900"
                                    >
                                        <Minus size={18} strokeWidth={3} />
                                    </button>
                                    <span className="text-2xl font-black w-8 text-center">{quantity}</span>
                                    <button 
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl bg-white/10 dark:bg-white flex items-center justify-center hover:bg-white/20 dark:hover:bg-gray-200 transition-all text-white dark:text-gray-900"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-orange-600/30 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Utensils size={18} strokeWidth={2.5} />
                                Add to selection
                            </button>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/10 dark:border-gray-100">
                             <DetailRow icon={<ShieldCheck size={16} />} text="HACCP Certified Quality" />
                             <DetailRow icon={<Clock size={16} />} text="Fresh-to-Door Delivery" />
                             <DetailRow icon={<ThumbsUp size={16} />} text="100% Satisfaction Guarantee" />
                        </div>
                    </div>
                    
                    {/* Visual Decor */}
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-600 opacity-20 blur-[100px]" />
                </motion.div>

                {/* Upsell / Info Card */}
                <div className="mt-8 bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">First Order Deal</p>
                            <h4 className="text-xl font-black tracking-tight leading-none">Free delivery on your first feast.</h4>
                        </div>
                        <ArrowRight className="w-10 h-10 opacity-40 group-hover:translate-x-2 transition-transform" />
                    </div>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label, value }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mb-1">
                {icon}
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">{label}</p>
            <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{value}</p>
        </div>
    );
}

function Nutrient({ label, value }: any) {
    return (
        <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-[8px] font-black text-gray-300 dark:text-zinc-600 uppercase tracking-widest mb-1">{label}</span>
            <span className="text-sm font-black text-gray-900 dark:text-white leading-none">{value}</span>
        </div>
    );
}

function DetailRow({ icon, text }: any) {
    return (
        <div className="flex items-center gap-3 opacity-60">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{text}</span>
        </div>
    );
}

