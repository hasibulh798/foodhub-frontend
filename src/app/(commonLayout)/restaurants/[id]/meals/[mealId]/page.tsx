"use client";

import { useCart } from "@/lib/Cart-context";
import { mealServices } from "@/services/meal.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  ChevronLeft, 
  Plus, 
  Minus, 
  ShoppingBag,
  Zap,
  CheckCircle2,
  Truck,
  RotateCcw,
  StarHalf,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  TrendingUp,
  Package,
  Utensils
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  params: Promise<{ id: string; mealId: string }>;
}) {
  const { id: providerId, mealId } = React.use(params);
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addItem, items } = useCart();

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

  const handleAddToCart = (showToast = true) => {
    if (!meal) return;
    
    for(let i = 0; i < quantity; i++) {
        addItem({
          mealId,
          name: meal.name,
          price: Number(meal.price),
          imageUrl: meal.imageUrl,
        });
    }
    
    if (showToast) {
        toast.success(`Selection updated! Added ${quantity} item(s)`, {
          style: {
            borderRadius: '12px',
            background: '#111827',
            color: '#fff',
          },
        });
    }
  };

  const handleOrderNow = () => {
    handleAddToCart(false);
    router.push("/cart");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!meal) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/restaurants" className="text-red-600 hover:underline">Return to Shop</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-red-600 transition-colors uppercase font-bold tracking-widest text-[10px]">Home</Link>
            <ChevronLeft size={12} className="rotate-180 opacity-30" />
            <Link href="/restaurants" className="hover:text-red-600 transition-colors uppercase font-bold tracking-widest text-[10px]">All Kitchens</Link>
            <ChevronLeft size={12} className="rotate-180 opacity-30" />
            <span className="truncate uppercase font-bold tracking-widest text-[10px] text-gray-900 dark:text-gray-400">{meal.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-800">
            
            {/* Left: Product Gallery */}
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square w-full rounded-[2rem] overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50"
                >
                    <Image
                        src={meal.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={meal.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    
                    {/* Discount Badge Placeholder */}
                    <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl">
                        -15% OFF
                    </div>
                </motion.div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-3 gap-4">
                    <TrustTile icon={<Truck size={18} />} label="Fast Delivery" />
                    <TrustTile icon={<CheckCircle2 size={18} />} label="Quality Guaranteed" />
                    <TrustTile icon={<RotateCcw size={18} />} label="Easy Returns" />
                </div>
            </div>

            {/* Right: Product Interaction */}
            <div className="flex flex-col">
                <div className="space-y-6 flex-1">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                <StarHalf size={16} fill="currentColor" />
                            </div>
                            <span className="text-xs font-bold text-gray-400">(4.8 / 32 Reviews)</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-2">
                            {meal.name}
                        </h1>
                        <p className="text-sm font-bold text-red-600 uppercase tracking-widest">Premium Collection</p>
                    </div>

                    <div className="flex items-baseline gap-4 py-6 border-y border-gray-100 dark:border-zinc-800">
                        <span className="text-5xl font-black text-gray-900 dark:text-white tabular-nums">৳{meal.price}</span>
                        <span className="text-xl text-gray-400 line-through tabular-nums italic decoration-2 decoration-red-600/30">৳{Number(meal.price) + 200}</span>
                        <div className="ml-auto flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                            <Package size={14} className="animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-widest">In Stock</span>
                        </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                        {meal.description || "Discover the essence of purity with our signature selection. Sourced from the finest local kitchens and tested for supreme quality and hygiene."}
                    </p>

                    <div className="space-y-8 pt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quantity</span>
                            <div className="flex items-center border-2 border-gray-100 dark:border-zinc-800 rounded-2xl p-1 bg-white dark:bg-zinc-800">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-16 text-center text-xl font-black tabular-nums">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Order Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={handleOrderNow}
                                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 active:scale-95"
                            >
                                <Zap size={18} fill="currentColor" />
                                Order Now
                            </button>
                            <button 
                                onClick={() => handleAddToCart()}
                                className="flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent hover:border-gray-900 dark:hover:border-white hover:bg-transparent hover:text-gray-900 dark:hover:text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                            >
                                <ShoppingBag size={18} />
                                Add To Cart
                            </button>
                        </div>
                    </div>

                    {/* Social Share & Meta */}
                    <div className="flex flex-wrap items-center gap-6 pt-8 text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest">Share:</span>
                            <div className="flex gap-4">
                                <Facebook size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                                <Twitter size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                                <Linkedin size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                            </div>
                        </div>
                        <div className="h-4 w-px bg-gray-100 dark:bg-zinc-800" />
                        <div className="flex items-center gap-2">
                             <TrendingUp size={16} className="text-orange-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Popularity Rising</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mt-16 space-y-10">
            <div className="flex justify-center border-b border-gray-200 dark:border-zinc-800">
                <TabButton 
                    active={activeTab === "description"} 
                    onClick={() => setActiveTab("description")} 
                    label="Description" 
                />
                <TabButton 
                    active={activeTab === "reviews"} 
                    onClick={() => setActiveTab("reviews")} 
                    label={`Reviews (${meal.reviews.length})`} 
                />
                <TabButton 
                    active={activeTab === "shipping"} 
                    onClick={() => setActiveTab("shipping")} 
                    label="Shipping Info" 
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-4xl mx-auto"
                >
                    {activeTab === "description" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 shadow-sm border border-gray-100 dark:border-zinc-800">
                             <div className="prose prose-red dark:prose-invert max-w-none">
                                <h3 className="text-2xl font-black mb-6">Unveiling the Authenticity</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Our {meal.name} is meticulously crafted selecting only the highest grade ingredients. We believe in transparency and quality, ensuring every delivery meeting the gourmet standards you deserve.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-red-600" />
                                            Certifications
                                        </h4>
                                        <ul className="text-sm text-gray-500 space-y-2">
                                            <li>• 100% Organic Ingredients</li>
                                            <li>• No Preservatives Added</li>
                                            <li>• Lab Tested for Purity</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold flex items-center gap-2 text-red-600 italic">Chef's Note</h4>
                                        <p className="text-sm italic text-gray-400">
                                            "A harmony of flavors that captures the soul of traditional culinary art. Best served fresh with your favorite side."
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="space-y-6">
                            {meal.reviews.length === 0 ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-zinc-800">
                                    <Star size={40} className="mx-auto text-gray-200 mb-4" />
                                    <h4 className="font-bold text-gray-400">Be the first to share your experience.</h4>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {meal.reviews.map((r, i) => (
                                        <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-50 dark:border-zinc-800 shadow-sm">
                                            <div className="flex items-center gap-1 mb-4 text-amber-400">
                                                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < r.rating ? "currentColor" : "none"} className={j < r.rating ? "" : "text-gray-200"} />)}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 italic mb-6">"{r.comment}"</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-[10px]">{r.user[0]}</div>
                                                <span className="font-bold text-sm">{r.user}</span>
                                                <span className="ml-auto text-[10px] font-black uppercase text-emerald-600">Verified Buy</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 border border-gray-100 dark:border-zinc-800">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black flex items-center gap-3">
                                        <Truck className="text-red-600" />
                                        Home Delivery
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        We provide door-to-door delivery across all major districts. Orders placed before 4 PM are dispatched the same day.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-600" />
                                        Hygiene Policy
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Our packaging follows strict WHO guidelines. Sanitized handling and secure sealing are guaranteed for every product.
                                    </p>
                                </div>
                             </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Suggestion / Upsell Section */}
        <div className="mt-24">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black tracking-tight">You May Also Feast On</h2>
                <Link href="/restaurants" className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-[0.2em] group">
                    Explore Shop
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 transition-all p-4">
                        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gray-50">
                            <Utensils className="absolute inset-0 m-auto text-gray-100" size={40} />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Coming Soon</p>
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">Signature Item {i+1}</h4>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function TrustTile({ icon, label }: any) {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800/50 rounded-2xl border border-gray-50 dark:border-zinc-800 shadow-sm text-center gap-2">
            <div className="text-red-600">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 leading-none">{label}</span>
        </div>
    );
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`px-10 py-6 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${
                active ? "text-red-600" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
            {label}
            {active && (
                <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-red-600"
                />
            )}
        </button>
    );
}


