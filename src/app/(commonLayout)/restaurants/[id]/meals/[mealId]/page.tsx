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
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Truck,
  Utensils,
  Share2,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  AlertCircle,
  Package,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Zap,
  ArrowRight,
  ShoppingBag,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  // Fetch Meal Data with React Query
  const { data: meal, isLoading: mealLoading, error: mealError } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: () => mealServices.getSingleMeal(mealId),
    staleTime: 1000 * 60,
    refetchInterval: 30000,
  });

  // Fetch Related Meals
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

  const validOrder = myOrders?.find((order: any) => 
    order.status === "DELIVERED" && 
    order.orderItems?.some((item: any) => item.mealId === mealId)
  );

  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        mealId,
        name: meal.name,
        price: Number(meal.price),
        imageUrl: meal.imageUrl || (meal.images && meal.images[0]),
        providerId: providerId,
        deliveryFee: meal.provider?.deliveryFee 
                      ? Number(meal.provider.deliveryFee) 
                      : 60,
      });
    }
    
    if (showToast) {
        toast.success(`Selection updated! Added ${quantity} item(s) to Cart`);
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
    <div className="min-h-screen flex items-center justify-center bg-[#FFF] dark:bg-[#060606]">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Utensils size={16} className="text-orange-500 animate-pulse" />
            </div>
        </div>
    </div>
  );

  if (!meal || mealError) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF] dark:bg-[#060606] p-4 text-center">
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

  const images = (meal.images && meal.images.length > 0)
    ? meal.images
    : [meal.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"];

  const kitchenName = meal.provider?.businessName || meal.provider?.name || "Premium Kitchen";
  const categoryName = meal.category?.name || meal.category || "Gourmet Choice";

  // Double place descriptions:
  const shortDescription = meal.description 
    ? (meal.description.length > 180 ? meal.description.substring(0, 180) + "..." : meal.description)
    : "Indulge in our masterfully crafted chef signature meal, freshly prepared daily with organic locally-sourced ingredients and authentic seasoning.";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Meal link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#060606] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* 1. Amazon Breadcrumbs & Live Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-[11px] text-[#565959] dark:text-zinc-400 font-medium">
                <Link href="/" className="hover:text-[#c45500] hover:underline transition-colors">Home</Link>
                <span>&nbsp;›&nbsp;</span>
                <Link href="/restaurants" className="hover:text-[#c45500] hover:underline transition-colors">Kitchens</Link>
                <span>&nbsp;›&nbsp;</span>
                <Link href={`/restaurants/${providerId}`} className="hover:text-[#c45500] hover:underline transition-colors">{kitchenName}</Link>
                <span>&nbsp;›&nbsp;</span>
                <span className="text-[#333333] dark:text-zinc-200 font-semibold">{meal.name}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100/50 dark:border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
                   <Clock size={10} /> Live Kitchen Data
                </span>
            </div>
        </div>

        {/* 2. Amazon Three-Column Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-16 bg-white dark:bg-zinc-900/10 border border-gray-100 dark:border-zinc-900 rounded-[2.5rem] p-6 md:p-10 shadow-sm">
            
            {/* ================= COLUMN 1: Image Gallery (Span 5) ================= */}
            <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 items-start w-full">
              
              {/* Vertical Thumbnails on Left (hidden on mobile, visible md+) */}
              <div className="hidden md:flex flex-col gap-2 shrink-0">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    onMouseEnter={() => setCurrentImageIndex(idx)}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all p-[1px] bg-white ${
                      currentImageIndex === idx 
                        ? "border-[#e77600] dark:border-orange-500 ring-2 ring-orange-500/20 scale-105" 
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-450"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-md overflow-hidden bg-white">
                      <Image src={img} alt="thumbnail" fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Large Main Display Frame */}
              <div className="flex-grow w-full">
                <div className="relative w-full aspect-square border border-zinc-200/80 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden flex items-center justify-center p-6 shadow-sm group">
                  
                  {/* Share & Heart Action Badges */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <button 
                      onClick={handleShare}
                      className="w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-white flex items-center justify-center shadow-sm transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setIsFavorite(!isFavorite);
                        toast.success(isFavorite ? "Removed from wishlist" : "Added to wishlist!", { icon: isFavorite ? "💔" : "❤️" });
                      }}
                      className={`w-9 h-9 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm transition-all ${
                        isFavorite ? "text-rose-500 border-rose-250 bg-rose-50/20" : "text-zinc-500 hover:text-rose-500"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Dietary tag */}
                  {meal.dietaryType && (
                      <div className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md flex items-center gap-1.5 ${
                          meal.dietaryType === "VEG" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                      }`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {meal.dietaryType}
                      </div>
                  )}

                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={images[currentImageIndex]}
                      alt={meal.name}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                {/* Mobile Thumbnails List (hidden on larger screens) */}
                <div className="flex md:hidden flex-wrap justify-center gap-2 mt-4">
                  {images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-10 h-10 rounded-lg overflow-hidden border-2 transition-all p-[1px] bg-white ${
                        currentImageIndex === idx ? "border-orange-500" : "border-zinc-200"
                      }`}
                    >
                      <div className="relative w-full h-full bg-white rounded-md overflow-hidden">
                        <Image src={img} alt="thumb" fill className="object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Roll over zoom indicator */}
                <p className="text-zinc-400 dark:text-zinc-500 text-[10px] text-center mt-3 font-semibold">
                  *Roll over image to zoom in
                </p>
              </div>
            </div>

            {/* ================= COLUMN 2: Product Info & Highlights (Span 4) ================= */}
            <div className="lg:col-span-4 flex flex-col text-left space-y-4">
              <div>
                {/* Kitchen Link */}
                <Link 
                  href={`/restaurants/${providerId}`}
                  className="text-[#007185] dark:text-[#00a8c6] hover:text-[#c45500] hover:underline text-xs sm:text-sm font-black transition-colors"
                >
                  Visit the {kitchenName} Kitchen
                </Link>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight mt-1 mb-2">
                  {meal.name}
                </h1>

                {/* Ratings */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{averageRating}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        className={` ${i < Math.floor(Number(averageRating) || 4.8) ? "fill-current" : "text-zinc-200 dark:text-zinc-800"}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[#007185] dark:text-[#00a8c6] hover:text-[#c45500] hover:underline cursor-pointer transition-colors text-xs font-semibold">
                    {reviews.length} ratings
                  </span>
                </div>
              </div>

              <Separator className="bg-zinc-150 dark:bg-zinc-800/80" />

              {/* Price Details */}
              <div className="space-y-1.5">
                <div className="flex items-baseline gap-1 text-red-600 dark:text-red-500">
                  <span className="text-sm font-bold mt-1">৳</span>
                  <span className="text-3xl font-black tracking-tight">{meal.price}</span>
                  <span className="text-sm text-zinc-400 line-through ml-2 font-medium">৳{Number(meal.price) + 50}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#FF9900]/10 hover:bg-[#FF9900]/20 text-[#CC7A00] border-none font-black text-[9px] rounded-md tracking-wider py-1 px-2.5">
                    Chef Choice
                  </Badge>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-650 dark:text-emerald-500 font-black uppercase">
                    <Truck className="w-3.5 h-3.5" />
                    Free Delivery above ৳500
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-150 dark:bg-zinc-800/80" />

              {/* Place 1: Short Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">About this item</h4>
                <p className="text-zinc-650 dark:text-zinc-300 text-sm font-medium leading-relaxed italic">
                  "{shortDescription}"
                </p>
              </div>

              {/* Bulleted Highlights */}
              <div className="space-y-2 pt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span><strong>Prep Time:</strong> Quick culinary preparation (15-20 Mins).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span><strong>Kitchen Certified:</strong> Hand-picked local vetted chef with 100% hygiene clearance.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span><strong>Portion Size:</strong> Perfectly packaged for 1-2 generous servings.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  <span><strong>Always Fresh:</strong> Sourced local farm greens and premium cuts, delivered directly.</span>
                </div>
              </div>
            </div>

            {/* ================= COLUMN 3: Sticky Buy Box (Span 3) ================= */}
            <div className="lg:col-span-3">
              <div className="border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 bg-white dark:bg-zinc-900/40 shadow-sm sticky top-6 text-left space-y-5">
                
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1 text-zinc-900 dark:text-white">
                    <span className="text-xs font-bold">৳</span>
                    <span className="text-2xl font-black">{meal.price}</span>
                  </div>
                  <p className="text-xs text-[#007185] dark:text-[#00a8c6] font-semibold hover:text-[#c45500] hover:underline cursor-pointer">
                    FREE Delivery tomorrow on your first order.
                  </p>
                </div>

                {/* Stock Availability */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {meal.isAvailable ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-500 font-black text-sm">In Stock</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span className="text-rose-500 font-black text-sm">Currently Unavailable</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 font-semibold">Ordered fresh, crafted to perfection.</p>
                </div>

                {/* Quantitative Select Counter */}
                {meal.isAvailable && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block">Quantity</label>
                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 rounded-xl p-1.5 border border-zinc-200/60 dark:border-zinc-700/80 w-full justify-between">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-700 active:scale-95 shrink-0"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      </Button>
                      <span className="font-black text-sm text-zinc-800 dark:text-white">{quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-700 active:scale-95 shrink-0"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Add & Buy Actions */}
                <div className="space-y-2.5 pt-2">
                  <Button 
                    disabled={!meal.isAvailable}
                    onClick={() => handleAddToCart(true)}
                    className="w-full h-11 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all border border-[#FCD200] active:scale-98 shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                  
                  <Button 
                    disabled={!meal.isAvailable}
                    onClick={handleOrderNow}
                    className="w-full h-11 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 border-none"
                  >
                    <Zap size={15} fill="currentColor" />
                    Buy Now
                  </Button>
                </div>

                {/* Transaction Badges */}
                <div className="space-y-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-150 dark:border-zinc-800">
                  <div className="flex justify-between">
                    <span>Ships from</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-200">Food Hub Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sold by</span>
                    <span className="font-bold text-[#007185] dark:text-[#00a8c6] hover:underline cursor-pointer truncate max-w-[130px]">{kitchenName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">Secure <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /></span>
                  </div>
                </div>
                
              </div>
            </div>

        </div>

        {/* 3. Detailed Tabs Section (Place 2: Full Description) */}
        <div className="mt-16 space-y-10">
            <div className="flex justify-center border-b border-gray-200 dark:border-zinc-800 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
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
                    label="Hygiene & Delivery" 
                    icon={<ShieldCheck size={14} />}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto text-left"
                >
                    {activeTab === "description" && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-zinc-850">
                             <div className="prose prose-red dark:prose-invert max-w-none">
                                <h3 className="text-2xl font-black mb-6 dark:text-white">The Culinary Experience</h3>
                                <div className="text-zinc-650 dark:text-zinc-350 leading-relaxed text-sm sm:text-base font-medium whitespace-pre-wrap mb-8">
                                  {meal.description || (
                                    <div className="space-y-4">
                                      <p>
                                        Our signature {meal.name} is meticulously prepared daily by our certified culinary partners. We source our proteins and greens locally to ensure premium freshness and maximum gourmet quality.
                                      </p>
                                      <p>
                                        Every single order is packaged with specialized heat-retention sealing to guarantee it arrives fresh and piping hot directly at your doorstep.
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4 bg-zinc-50 dark:bg-zinc-850 p-6 rounded-2xl border border-zinc-150 dark:border-zinc-800 shadow-sm">
                                        <h4 className="font-black flex items-center gap-2 text-base dark:text-white">
                                            <ShieldCheck size={20} className="text-orange-500" />
                                            Certifications
                                        </h4>
                                        <ul className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 space-y-2.5 font-bold">
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> 100% Organic Ingredients</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Vetted Clean-Kitchen Guarantee</li>
                                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> No Artificial Preservatives</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4 bg-orange-500/5 dark:bg-orange-500/[0.02] p-6 rounded-2xl border border-orange-500/10">
                                        <h4 className="font-black flex items-center gap-3 text-base text-orange-600 dark:text-orange-400 italic">Chef's Note</h4>
                                        <p className="text-xs sm:text-sm italic text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                            "A harmony of flavors that captures the soul of traditional culinary art. We focus on the balance between texture and taste to bring you a meal that is both healthy and indulgent."
                                        </p>
                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-xs">👨‍🍳</div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-orange-500 leading-none">Head Chef</p>
                                                <p className="text-xs font-black dark:text-white mt-1">Hasib Ahmed</p>
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
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Total Feedback</p>
                                    <p className="text-xl sm:text-2xl font-black dark:text-white">{reviews.length} Customer Reviews</p>
                                </div>
                                <button 
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-sm"
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
                                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-orange-100 dark:border-orange-500/20 shadow-xl shadow-orange-600/5 mb-8 text-left">
                                            <h4 className="text-lg sm:text-xl font-black mb-6 dark:text-white">Share Your Feast Experience</h4>
                                            
                                            {!validOrder ? (
                                                <div className="bg-amber-50 dark:bg-amber-500/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/20 text-center">
                                                    <ShieldCheck size={36} className="text-amber-500 mx-auto mb-4" />
                                                    <p className="text-amber-800 dark:text-amber-400 font-bold text-sm leading-relaxed">
                                                        You can only review meals you have purchased and received. 
                                                        If you've already ordered this dish, please wait until it is delivered!
                                                    </p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handleSubmitReview} className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">Rating</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                    className={`p-2 rounded-xl transition-all ${
                                                                        newReview.rating >= star 
                                                                        ? "bg-amber-50 text-amber-500 scale-110" 
                                                                        : "bg-gray-50 dark:bg-zinc-800 text-zinc-300"
                                                                    }`}
                                                                >
                                                                    <Star size={20} fill={newReview.rating >= star ? "currentColor" : "none"} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">Your Feedback</label>
                                                        <textarea
                                                            value={newReview.comment}
                                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                            placeholder="How was the taste, packaging, and delivery?"
                                                            rows={4}
                                                            className="w-full bg-zinc-50 dark:bg-zinc-850 rounded-2xl p-6 border border-zinc-250 dark:border-zinc-800 focus:border-orange-500 focus:outline-none transition-all dark:text-white resize-none text-sm font-medium"
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={createReviewMutation.isPending}
                                                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-650 hover:to-red-650 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-600/10 disabled:bg-gray-400 border-none"
                                                    >
                                                        {createReviewMutation.isPending ? "Submitting..." : (
                                                            <>
                                                                <Send size={14} />
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
                                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Loading Reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-16 text-center border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-850 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <MessageSquare size={32} className="text-zinc-300" />
                                    </div>
                                    <h4 className="font-black text-zinc-900 dark:text-white text-lg mb-2">No reviews yet</h4>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 font-medium">Be the first to share your experience with this meal.</p>
                                    {!showReviewForm && (
                                        <button 
                                            onClick={() => setShowReviewForm(true)}
                                            className="text-orange-500 font-black text-xs uppercase tracking-widest hover:underline"
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
                                            transition={{ delay: i * 0.05 }}
                                            key={r.id} 
                                            className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[2.5rem] border border-gray-50 dark:border-zinc-800/80 shadow-sm hover:shadow-xl transition-all group text-left flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-0.5 text-amber-500">
                                                        {[...Array(5)].map((_, j) => (
                                                            <Star 
                                                                key={j} 
                                                                size={12} 
                                                                fill={j < r.rating ? "currentColor" : "none"} 
                                                                className={j < r.rating ? "" : "text-gray-100 dark:text-zinc-850"} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-100/50 dark:border-emerald-500/15">
                                                        Verified Purchase
                                                    </span>
                                                </div>
                                                <p className="text-zinc-600 dark:text-zinc-400 italic mb-6 text-sm sm:text-base font-semibold leading-relaxed group-hover:text-zinc-850 dark:group-hover:text-white transition-colors">
                                                    "{r.comment}"
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 border-t border-zinc-50 dark:border-zinc-850 pt-5 mt-auto">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/5 dark:bg-zinc-800 overflow-hidden relative border border-zinc-200 dark:border-zinc-700 shadow-xs shrink-0">
                                                    {r.customer?.image ? (
                                                        <Image src={r.customer.image} alt={r.customer.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-sm uppercase">
                                                            {r.customer?.name?.[0] || <User size={14} />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="font-black text-xs block dark:text-white truncate leading-none mb-1">{r.customer?.name || "Gourmet Diner"}</span>
                                                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
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
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-850 shadow-sm">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center">
                                        <Truck className="text-orange-500" size={24} />
                                    </div>
                                    <h4 className="text-xl font-black dark:text-white">Doorstep Delivery</h4>
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium">
                                        We provide door-to-door fresh meal delivery across Gulshan, Banani, Dhanmondi, and other key areas. Cooking begins instantly upon order placement.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-wider">
                                        <Clock size={14} />
                                        <span>Average Delivery: 30-45 Mins</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                        <Check className="text-emerald-500" size={24} />
                                    </div>
                                    <h4 className="text-xl font-black dark:text-white">Strict Hygiene Policy</h4>
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm font-medium">
                                        Our packages feature specialized secure heat-trapping seals to lock in flavors. Sanitized kitchen handling is strictly monitored under deep health parameters.
                                    </p>
                                    <div className="flex items-center gap-2 text-xs font-black text-emerald-650 dark:text-emerald-500 uppercase tracking-wider">
                                        <ShieldCheck size={14} />
                                        <span>100% Certified Safe Kitchen</span>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* 4. Suggestion / Upsell Section */}
        {relatedMeals.length > 0 && (
          <div className="mt-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-left">
                  <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1 dark:text-white">More Delights to Explore</h2>
                      <p className="text-zinc-400 font-medium text-xs sm:text-sm italic">Handpicked recommendations just for your taste buds.</p>
                  </div>
                  <Link href="/restaurants" className="flex items-center gap-1.5 text-orange-500 font-black text-[10px] uppercase tracking-[0.2em] group bg-white dark:bg-zinc-900 px-5 py-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                      Explore Shop
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedMeals.map((m: any) => (
                      <Link 
                        key={m.id} 
                        href={`/restaurants/${providerId}/meals/${m.id}`}
                        className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-150 dark:border-zinc-850 hover:border-orange-500/20 dark:hover:border-orange-500/20 transition-all p-5 shadow-sm hover:shadow-lg flex flex-col justify-between h-full"
                      >
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                            <Image 
                              src={m.imageUrl || (m.images && m.images[0]) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                              alt={m.name} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <h4 className="font-black text-zinc-850 dark:text-zinc-150 truncate text-base leading-snug group-hover:text-orange-500 transition-colors">{m.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm text-zinc-900 dark:text-white">৳{m.price}</span>
                              <div className="flex items-center gap-0.5 text-amber-500">
                                  <Star size={10} fill="currentColor" />
                                  <span className="text-[10px] font-bold text-zinc-400">4.8</span>
                              </div>
                            </div>
                        </div>
                      </Link>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TrustTile({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-150 dark:border-zinc-800 shadow-sm text-center gap-2 group hover:border-orange-500/20 transition-all">
            <div className="text-orange-500 p-2.5 bg-orange-500/5 rounded-xl group-hover:scale-105 transition-transform">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 leading-none">{label}</span>
        </div>
    );
}

function TabButton({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 sm:px-10 py-6 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all relative flex items-center gap-2 sm:gap-3 whitespace-nowrap bg-transparent border-none outline-none ${
                active ? "text-orange-500" : "text-zinc-400 hover:text-zinc-850 dark:hover:text-white"
            }`}
        >
            {icon}
            {label}
            {active && (
                <motion.div 
                    layoutId="activeTabIndicatorDetails"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full shadow-[0_-4px_12px_rgba(249,115,22,0.3)]"
                />
            )}
        </button>
    );
}
