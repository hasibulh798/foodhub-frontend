"use client";

import { Review } from "@/constants/allType";
import { useSession } from "@/lib/auth-client";
import { useCart } from "@/lib/Cart-context";
import { mealServices } from "@/services/meal.service";
import { orderService } from "@/services/order.service";
import { reviewServices } from "@/services/review.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Facebook,
    Linkedin,
    MessageSquare,
    Minus,
    Package,
    Plus,
    RotateCcw,
    Send,
    ShieldCheck,
    ShoppingBag,
    Star,
    TrendingUp,
    Truck,
    Twitter,
    User,
    Utensils,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MealDetailsPage({
  params,
}: {
  params: Promise<{ id: string; mealId: string }>;
}) {
  const { id: providerId, mealId } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addItem } = useCart();

  // Fetch Meal Data with React Query for "real-time" feel
  const { data: meal, isLoading: mealLoading, error: mealError } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => mealServices.getSingleMeal(mealId),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 30000, // Polling every 30 seconds for real-time updates
  });

  // Fetch Related Meals (from same provider and same category)
  const { data: relatedMeals = [], isLoading: relatedLoading } = useQuery({
    queryKey: ["related-meals", providerId, meal?.categoryId],
    queryFn: async () => {
        if (!meal?.categoryId) return [];
        const res = await mealServices.getAllMeals({ 
            providerId, 
            categoryId: meal.categoryId,
            limit: 5 
        });
        const data = Array.isArray(res) ? res : (res?.data || []);
        // Filter out the current meal
        return data.filter((m: any) => m.id !== mealId).slice(0, 4);
    },
    enabled: !!meal?.categoryId,
  });

  // Fetch Reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", mealId],
    queryFn: () => reviewServices.getMealReviews(mealId),
    enabled: !!mealId,
  });

  // Fetch User's Orders to check eligibility for review
  const { data: myOrders = [] } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => orderService.getMyOrders(),
    enabled: !!session?.user,
  });

  // Check if user has a delivered order for this meal
  const validOrder = myOrders?.find((order: any) => 
    order.status === "DELIVERED" && 
    order.orderItems?.some((item: any) => item.mealId === mealId)
  );

  // Review Form State
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create Review Mutation
  const createReviewMutation = useMutation({
    mutationFn: (data: { mealId: string; rating: number; comment: string; orderId: string }) => 
      reviewServices.createReview(data),
    onSuccess: () => {
      toast.success("Thank you for your review!");
      setNewReview({ rating: 5, comment: "" });
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", mealId] });
      queryClient.invalidateQueries({ queryKey: ["meal", mealId] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    }
  });

  const handleAddToCart = (showToast = true) => {
    if (!meal) return;
    
for(let i = 0; i < quantity; i++) {
    addItem({
      mealId,
      name: meal.name,
      price: Number(meal.price),
      imageUrl: meal.imageUrl,
      providerId: providerId,        // ← add করুন
      deliveryFee: meal.provider?.deliveryFee 
                    ? Number(meal.provider.deliveryFee) 
                    : 60,            // ← add করুন (default 60)
    });
}
    
    if (showToast) {
        toast.success(`Selection updated! Added ${quantity} item(s)`);
    }
  };

  const handleOrderNow = () => {
    handleAddToCart(false);
    router.push("/cart");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to write a review");
      return;
    }
    if (!validOrder) {
      toast.error("You can only review meals you have purchased and received.");
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    createReviewMutation.mutate({
      mealId,
      rating: newReview.rating,
      comment: newReview.comment,
      orderId: validOrder.id,
    });
  };

  if (mealLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Utensils size={20} className="text-red-600 animate-pulse" />
            </div>
        </div>
    </div>
  );

  if (!meal || mealError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4 text-center">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-zinc-800 max-w-md w-full">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-black mb-2 dark:text-white">Meal Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">The meal you are looking for might have been removed or is temporarily unavailable.</p>
            <Link href="/restaurants" className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20">
                <ChevronLeft size={18} />
                Back to Kitchens
            </Link>
        </div>
    </div>
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, rev: Review) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Breadcrumb & Real-time Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 overflow-hidden whitespace-nowrap">
                <Link href="/" className="hover:text-red-600 transition-colors uppercase font-bold tracking-widest text-[10px]">Home</Link>
                <ChevronLeft size={12} className="rotate-180 opacity-30" />
                <Link href="/restaurants" className="hover:text-red-600 transition-colors uppercase font-bold tracking-widest text-[10px]">Kitchens</Link>
                <ChevronLeft size={12} className="rotate-180 opacity-30" />
                <span className="truncate uppercase font-bold tracking-widest text-[10px] text-gray-900 dark:text-gray-400">{meal.name}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                   <Clock size={10} /> Live Data
                </span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-800">
            
            {/* Left: Product Gallery */}
            <div className="space-y-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 bg-gray-50 group shadow-inner"
                >
                    <Image
                        src={meal.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                        alt={meal.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        priority
                    />
                    
                    {/* Dietary Badge */}
                    {meal.dietaryType && (
                        <div className={`absolute top-6 left-6 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 ${
                            meal.dietaryType === "VEG" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}>
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            {meal.dietaryType}
                        </div>
                    )}
                </motion.div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-3 gap-4">
                    <TrustTile icon={<Truck size={18} />} label="Fast Delivery" />
                    <TrustTile icon={<CheckCircle2 size={18} />} label="Quality Food" />
                    <TrustTile icon={<RotateCcw size={18} />} label="Hygiene First" />
                </div>
            </div>

            {/* Right: Product Interaction */}
            <div className="flex flex-col justify-center">
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18} 
                                        fill={i < Math.floor(Number(averageRating)) ? "currentColor" : "none"} 
                                        className={i < Math.floor(Number(averageRating)) ? "" : "text-gray-200 dark:text-zinc-700"}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-gray-400">({averageRating} / {reviews.length} Reviews)</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-4">
                            {meal.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-red-600 uppercase tracking-widest px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-lg">
                                {meal.cuisine || "Fusion Cuisine"}
                            </span>
                            <span className="text-xs font-medium text-gray-400">By {meal.provider?.businessName || "Chef Special"}</span>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4 py-8 border-y border-gray-100 dark:border-zinc-800">
                        <span className="text-5xl font-black text-gray-900 dark:text-white tabular-nums">৳{meal.price}</span>
                        <span className="text-xl text-gray-400 line-through tabular-nums italic decoration-2 decoration-red-600/30">৳{Number(meal.price) + 50}</span>
                        <div className="ml-auto flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                            <Package size={14} className="animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{meal.isAvailable ? "In Stock" : "Unavailable"}</span>
                        </div>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-medium">
                        {meal.description || "Discover the essence of purity with our signature selection. Sourced from the finest local kitchens and tested for supreme quality and hygiene."}
                    </p>

                    <div className="space-y-8 pt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Quantity</span>
                            <div className="flex items-center border-2 border-gray-100 dark:border-zinc-800 rounded-2xl p-1 bg-white dark:bg-zinc-800 shadow-sm">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all active:scale-90"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-16 text-center text-xl font-black tabular-nums">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all active:scale-90"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Order Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={handleOrderNow}
                                disabled={!meal.isAvailable}
                                className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 active:scale-95 group"
                            >
                                <Zap size={18} fill="currentColor" className="group-hover:animate-pulse" />
                                Order Now
                            </button>
                            <button 
                                onClick={() => handleAddToCart()}
                                disabled={!meal.isAvailable}
                                className="flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent hover:border-gray-900 dark:hover:border-white hover:bg-transparent hover:text-gray-900 dark:hover:text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                            >
                                <ShoppingBag size={18} />
                                Add To Cart
                            </button>
                        </div>
                    </div>

                    {/* Social Share & Meta */}
                    <div className="flex flex-wrap items-center gap-6 pt-8 text-gray-400 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest">Share:</span>
                            <div className="flex gap-4">
                                <Facebook size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                                <Twitter size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                                <Linkedin size={16} className="hover:text-red-600 cursor-pointer transition-colors" />
                            </div>
                        </div>
                        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800" />
                        <div className="flex items-center gap-2">
                             <TrendingUp size={16} className="text-orange-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Popular Item</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mt-16 space-y-10">
            <div className="flex justify-center border-b border-gray-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
                <TabButton 
                    active={activeTab === "description"} 
                    onClick={() => setActiveTab("description")} 
                    label="Description" 
                    icon={<Utensils size={14} />}
                />
                <TabButton 
                    active={activeTab === "reviews"} 
                    onClick={() => setActiveTab("reviews")} 
                    label={`Reviews (${reviews.length})`} 
                    icon={<MessageSquare size={14} />}
                />
                <TabButton 
                    active={activeTab === "shipping"} 
                    onClick={() => setActiveTab("shipping")} 
                    label="Policy" 
                    icon={<ShieldCheck size={14} />}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="max-w-4xl mx-auto"
                >
                    {activeTab === "description" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 shadow-sm border border-gray-100 dark:border-zinc-800">
                             <div className="prose prose-red dark:prose-invert max-w-none">
                                <h3 className="text-3xl font-black mb-6 dark:text-white">The Culinary Experience</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-lg">
                                    Our {meal.name} is meticulously crafted selecting only the highest grade ingredients. We believe in transparency and quality, ensuring every delivery meeting the gourmet standards you deserve.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6 bg-gray-50 dark:bg-zinc-800/50 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800">
                                        <h4 className="font-black flex items-center gap-3 text-lg dark:text-white">
                                            <ShieldCheck size={24} className="text-red-600" />
                                            Certifications
                                        </h4>
                                        <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-3 font-bold">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /> 100% Organic Ingredients</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /> No Artificial Preservatives</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /> Lab Tested for Nutritional Purity</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-6 bg-red-50/50 dark:bg-red-500/5 p-8 rounded-3xl border border-red-100 dark:border-red-500/10">
                                        <h4 className="font-black flex items-center gap-3 text-lg text-red-600 italic">Chef's Note</h4>
                                        <p className="text-sm italic text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                            "A harmony of flavors that captures the soul of traditional culinary art. We focus on the balance between texture and taste to bring you a meal that is both healthy and indulgent."
                                        </p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black">H</div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-red-600">Head Chef</p>
                                                <p className="text-sm font-bold dark:text-white">Hasib Ahmed</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="space-y-8">
                            {/* Review Action Bar */}
                            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Feedback</p>
                                    <p className="text-2xl font-black dark:text-white">{reviews.length} Customer Reviews</p>
                                </div>
                                <button 
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
                                >
                                    {showReviewForm ? "Close Form" : "Write a Review"}
                                </button>
                            </div>

                            {/* Add Review Form */}
                            <AnimatePresence>
                                {showReviewForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-red-100 dark:border-red-500/20 shadow-xl shadow-red-600/5 mb-8">
                                            <h4 className="text-xl font-black mb-6 dark:text-white">Share Your Feast Experience</h4>
                                            
                                            {!validOrder ? (
                                                <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-center">
                                                    <ShieldCheck size={40} className="text-amber-500 mx-auto mb-4" />
                                                    <p className="text-amber-800 dark:text-amber-400 font-bold">
                                                        You can only review meals you have purchased and received. 
                                                        If you've already ordered this dish, please wait until it's delivered!
                                                    </p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmitReview} className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Rating</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                    className={`p-2 rounded-xl transition-all ${
                                                                        newReview.rating >= star 
                                                                        ? "bg-amber-50 text-amber-500 scale-110" 
                                                                        : "bg-gray-50 dark:bg-zinc-800 text-gray-300"
                                                                    }`}
                                                                >
                                                                    <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">Your Feedback</label>
                                                        <textarea
                                                            value={newReview.comment}
                                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                            placeholder="How was the taste, packaging, and delivery?"
                                                            rows={4}
                                                            className="w-full bg-gray-50 dark:bg-zinc-800 rounded-2xl p-6 border-2 border-transparent focus:border-red-600/20 focus:outline-none transition-all dark:text-white resize-none"
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={createReviewMutation.isPending}
                                                        className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 disabled:bg-gray-400"
                                                    >
                                                        {createReviewMutation.isPending ? "Submitting..." : (
                                                            <>
                                                                <Send size={16} />
                                                                Post Review
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Reviews List */}
                            {reviewsLoading ? (
                                <div className="text-center py-20">
                                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-20 text-center border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare size={40} className="text-gray-200" />
                                    </div>
                                    <h4 className="font-black text-gray-900 dark:text-white text-xl mb-2">No reviews yet</h4>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">Be the first to share your experience with this meal.</p>
                                    {!showReviewForm && (
                                        <button 
                                            onClick={() => setShowReviewForm(true)}
                                            className="text-red-600 font-black text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Write the first review
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {reviews.map((r: Review, i: number) => (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={r.id} 
                                            className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-50 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group"
                                        >
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    {[...Array(5)].map((_, j) => (
                                                        <Star 
                                                            key={j} 
                                                            size={14} 
                                                            fill={j < r.rating ? "currentColor" : "none"} 
                                                            className={j < r.rating ? "" : "text-gray-100 dark:text-zinc-800"} 
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                                                    Verified Purchase
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 italic mb-8 text-lg font-medium leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                "{r.comment}"
                                            </p>
                                            <div className="flex items-center gap-4 border-t border-gray-50 dark:border-zinc-800 pt-6">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden relative border-2 border-white dark:border-zinc-700 shadow-sm">
                                                    {r.customer?.image ? (
                                                        <Image src={r.customer.image} alt={r.customer.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-red-600 font-black">
                                                            {r.customer?.name?.[0] || <User size={18} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-black text-sm block dark:text-white">{r.customer?.name || "Gourmet Diner"}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        {mounted ? new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 border border-gray-100 dark:border-zinc-800 shadow-sm">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center">
                                        <Truck className="text-red-600" size={28} />
                                    </div>
                                    <h4 className="text-2xl font-black dark:text-white">Doorstep Delivery</h4>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        We provide door-to-door delivery across all major districts. Orders placed before 4 PM are typically dispatched within 30 minutes to ensure maximum freshness.
                                    </p>
                                    <div className="flex items-center gap-3 text-sm font-bold text-red-600">
                                        <Clock size={16} />
                                        <span>Average time: 30-45 mins</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                        <CheckCircle2 className="text-emerald-600" size={28} />
                                    </div>
                                    <h4 className="text-2xl font-black dark:text-white">Hygiene Policy</h4>
                                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                                        Our packaging follows strict safety guidelines. Sanitized handling and eco-friendly secure sealing are guaranteed for every product to preserve taste and temperature.
                                    </p>
                                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                                        <ShieldCheck size={16} />
                                        <span>Safety Certified Kitchen</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Suggestion / Upsell Section */}
        <div className="mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">More Delights to Explore</h2>
                    <p className="text-gray-500 font-medium italic">Handpicked recommendations just for your taste buds.</p>
                </div>
                <Link href="/restaurants" className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-[0.2em] group bg-white dark:bg-zinc-900 px-6 py-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                    Explore Shop
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 transition-all p-6 shadow-sm hover:shadow-xl">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center">
                            <Utensils className="text-gray-200 dark:text-zinc-700 group-hover:scale-110 transition-transform duration-500" size={60} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Coming Soon</p>
                            <h4 className="font-black text-gray-900 dark:text-white truncate text-lg">Signature Dish {i+1}</h4>
                            <div className="flex items-center gap-1 text-amber-400">
                                <Star size={10} fill="currentColor" />
                                <span className="text-[10px] font-bold text-gray-400">4.9 (New)</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function TrustTile({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800/50 rounded-[2rem] border border-gray-50 dark:border-zinc-800 shadow-sm text-center gap-3 group hover:border-red-600/20 transition-all">
            <div className="text-red-600 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 leading-none">{label}</span>
        </div>
    );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className={`px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-3 whitespace-nowrap ${
                active ? "text-red-600" : "text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
        >
            {icon}
            {label}
            {active && (
                <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-t-full shadow-[0_-4px_12px_rgba(220,38,38,0.3)]"
                />
            )}
        </button>
    );
}
