"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/Cart-context";
import toast from "react-hot-toast";

interface MealDetailsProps {
  meal: any;
  reviews: any[];
}

const MealDetails = ({ meal, reviews }: MealDetailsProps) => {
  const { addItem, items } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = (meal.images && meal.images.length > 0) 
    ? meal.images 
    : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop"];

  const cartItem = items.find((item) => item.mealId === meal.id);
  const quantityInCart = cartItem?.quantity || 0;
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const kitchenName = meal.provider?.businessName || meal.provider?.name || "Premium Kitchen";
  const categoryName = meal.category?.name || meal.category || "Gourmet";

  // Double place descriptions:
  const shortDescription = meal.description 
    ? (meal.description.length > 180 ? meal.description.substring(0, 180) + "..." : meal.description)
    : "Indulge in our masterfully crafted chef signature meal, freshly prepared daily with organic locally-sourced ingredients and authentic seasoning.";

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setSelectedQuantity(prev => prev + 1);
    } else if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const pId = meal.providerId || meal.provider?.id;
    const dFee = Number(meal.provider?.deliveryFee) || 60;

    if (!pId) {
      toast.error("Kitchen information is missing", {
        style: { borderRadius: "1rem" }
      });
      return;
    }

    // Add selected quantity of items
    for (let i = 0; i < selectedQuantity; i++) {
      addItem({
        mealId: meal.id,
        name: meal.name,
        price: Number(meal.price),
        imageUrl: images[0],
        providerId: pId,
        deliveryFee: dFee,
      });
    }

    toast.success(`Added ${selectedQuantity}x ${meal.name} to selection!`, {
      icon: "🛒",
      style: {
        borderRadius: "1.5rem",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        fontWeight: "bold",
        border: "1px solid hsl(var(--border))",
      },
    });
    setSelectedQuantity(1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect cleanly or show instant checkout toast
    toast.success("Proceeding to instant checkout...", { icon: "⚡" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Meal link copied to clipboard!", { icon: "🔗" });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 font-sans">
      
      {/* 1. Amazon Breadcrumbs */}
      <div className="flex items-center gap-1 text-[11px] text-[#565959] dark:text-zinc-400 mb-6 flex-wrap font-medium">
        <Link href="/meals" className="hover:text-[#c45500] hover:underline transition-colors">Meals</Link>
        <span>&nbsp;›&nbsp;</span>
        <span className="hover:text-[#c45500] hover:underline cursor-pointer transition-colors">{categoryName}</span>
        <span>&nbsp;›&nbsp;</span>
        <span className="text-[#333333] dark:text-zinc-200 font-semibold">{meal.name}</span>
      </div>

      {/* 2. Amazon Three-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 mb-16">
        
        {/* ================= COLUMN 1: Image Gallery (Span 5) ================= */}
        <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 items-start">
          
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
                  <Image src={img} alt={`${meal.name} thumb ${idx}`} fill className="object-cover" />
                </div>
              </button>
            ))}
          </div>

          {/* Large Main Display (Middle) */}
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
            
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] text-center mt-3 font-medium">
              *Roll over image to zoom in
            </p>
          </div>
        </div>

        {/* ================= COLUMN 2: Product Info & Highlights (Span 4) ================= */}
        <div className="lg:col-span-4 flex flex-col text-left space-y-4">
          <div>
            {/* Seller link */}
            <Link 
              href={`/restaurants/${meal.providerId || meal.provider?.id}`}
              className="text-[#007185] dark:text-[#00a8c6] hover:text-[#c45500] hover:underline text-xs sm:text-sm font-black transition-colors"
            >
              Visit the {kitchenName} Kitchen
            </Link>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight mt-1 mb-2">
              {meal.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{meal.rating || "4.8"}</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={` ${i < Math.floor(meal.rating || 4.8) ? "text-amber-500 fill-amber-500" : "text-zinc-200 dark:text-zinc-800"}`} 
                  />
                ))}
              </div>
              <span className="text-[#007185] dark:text-[#00a8c6] hover:text-[#c45500] hover:underline cursor-pointer transition-colors text-xs font-semibold">
                {reviews.length} ratings
              </span>
            </div>
          </div>

          <Separator className="bg-zinc-150 dark:bg-zinc-850" />

          {/* Amazon Price Row */}
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1 text-red-600 dark:text-red-500">
              <span className="text-sm font-bold mt-1">৳</span>
              <span className="text-3xl font-black tracking-tight">{meal.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FF9900]/10 hover:bg-[#FF9900]/20 text-[#CC7A00] border-none font-black text-[9px] rounded-md tracking-wider py-1 px-2.5">
                Choice Meal
              </Badge>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-500 font-black uppercase">
                <Truck className="w-3.5 h-3.5" />
                Free Delivery above ৳500
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-150 dark:bg-zinc-850" />

          {/* Place 1: Short Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">About this item</h4>
            <p className="text-zinc-650 dark:text-zinc-300 text-sm font-medium leading-relaxed italic">
              "{shortDescription}"
            </p>
          </div>

          {/* Bulleted Highlights (Amazon Style) */}
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

        {/* ================= COLUMN 3: Sticky Add/Buy Box (Span 3) ================= */}
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

            {/* Availability */}
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

            {/* Selection Quantity Counter */}
            {meal.isAvailable && (
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-500 uppercase tracking-wider block">Quantity</label>
                <div className="flex items-center bg-zinc-50 dark:bg-zinc-800 rounded-xl p-1.5 border border-zinc-200/60 dark:border-zinc-700/80 w-full justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-700 active:scale-95 shrink-0"
                    onClick={() => handleQuantityChange("dec")}
                  >
                    <Minus className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                  </Button>
                  <span className="font-black text-sm text-zinc-800 dark:text-white">{selectedQuantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-zinc-700 active:scale-95 shrink-0"
                    onClick={() => handleQuantityChange("inc")}
                  >
                    <Plus className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Button 
                disabled={!meal.isAvailable}
                onClick={handleAddToCart}
                className="w-full h-11 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 hover:text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all border border-[#FCD200] active:scale-98 shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              
              <Button 
                disabled={!meal.isAvailable}
                onClick={handleBuyNow}
                className="w-full h-11 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-98 shadow-md flex items-center justify-center gap-2 border-none"
              >
                Buy Now
              </Button>
            </div>

            {/* Security Guarantee */}
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

      {/* 3. Place 2: Full Description Tabs System */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-start gap-8 bg-transparent border-b border-zinc-200/60 dark:border-zinc-800 rounded-none h-auto p-0 mb-12">
          <TabsTrigger 
            value="description" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 px-2 pb-4 text-base font-black transition-all bg-transparent"
          >
            Product Description
          </TabsTrigger>
          <TabsTrigger 
            value="info" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 px-2 pb-4 text-base font-black transition-all bg-transparent"
          >
            Ingredients & Details
          </TabsTrigger>
          <TabsTrigger 
            value="reviews" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:text-orange-500 px-2 pb-4 text-base font-black transition-all bg-transparent"
          >
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>
        
        {/* Full Styled Description (Provider formatting preserved) */}
        <TabsContent value="description" className="mt-0 text-left">
          <div className="max-w-4xl space-y-6">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">From the Kitchen of {kitchenName}</h3>
            <div className="text-zinc-650 dark:text-zinc-300 leading-relaxed text-sm sm:text-base font-medium whitespace-pre-wrap">
              {meal.description || (
                <div className="space-y-4 font-normal">
                  <p>
                    Our signature <strong>{meal.name}</strong> is a true home-cooked masterpiece that brings together the finest ingredients in a harmonious blend of authentic flavors and delicate textures. We source our produce and proteins daily from local farmers to ensure peak freshness and quality.
                  </p>
                  <p>
                    Prepared in our vetted clean kitchen, each serving is crafted exactly to order with strict hygiene guarantees. Whether you're looking for a satisfying family dinner or a quick delicious lunch, this dish is guaranteed to please.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="info" className="mt-0 text-left">
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Specifications</h3>
                <div className="space-y-3 font-semibold text-xs sm:text-sm">
                  {[
                    { label: "Category", value: categoryName },
                    { label: "Prep Time", value: "15-20 Minutes" },
                    { label: "Portion Size", value: "Generous 1-2 Servings" },
                    { label: "Preparation Date", value: "Freshly prepared upon order" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-zinc-150 dark:border-zinc-850">
                      <span className="text-zinc-400">{item.label}</span>
                      <span className="text-zinc-850 dark:text-zinc-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">Dietary & Health Badges</h3>
                <div className="flex flex-wrap gap-2.5">
                  {["100% Halal Certified", "Prepared Daily", "Eco Friendly Packaging", "Vetted Kitchen"].map((tag, idx) => (
                    <span key={idx} className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-850/80 text-zinc-650 dark:text-zinc-300 font-bold border border-zinc-150 dark:border-zinc-800 text-xs shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-0 text-left">
          <div className="max-w-4xl space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Customer Reviews</h3>
                <p className="text-zinc-400 text-xs font-semibold">Vetted insights from real customers who ordered this dish.</p>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 rounded-xl py-5 text-xs uppercase tracking-wider border-none">
                Write a Review
              </Button>
            </div>

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-850/30 border border-zinc-150 dark:border-zinc-800/80 shadow-sm text-left">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 font-black text-sm uppercase flex items-center justify-center border border-orange-500/10">
                          {review.user?.name?.[0] || "U"}
                        </div>
                        <div>
                          <p className="font-black text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm leading-none mb-1">{review.user?.name || "Verified Diner"}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{review.createdAt || "Recent purchase"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-zinc-850 rounded-lg border border-zinc-150 dark:border-zinc-750 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black text-zinc-800 dark:text-white">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-350 font-medium text-sm leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-850/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-zinc-400 italic text-sm font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MealDetails;
