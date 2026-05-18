"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    title: "Delicious Homemade Meals,",
    highlight: "Delivered Warm.",
    subtitle: "Experience the magic of authentic home-cooked flavors prepared by top local home chefs.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop",
    accent: "from-orange-400 via-red-500 to-rose-600",
    badge: "Chef's Special"
  },
  {
    title: "Crave Your Favorite Food,",
    highlight: "Delivered Instantly.",
    subtitle: "From traditional comfort foods to gourmet street delicacies, we bring the best menus straight to you.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop",
    accent: "from-emerald-400 via-teal-500 to-cyan-600",
    badge: "Popular Cravings"
  },
  {
    title: "Authentic Local Flavors,",
    highlight: "Crafted With Love.",
    subtitle: "Every bite is a journey. Made fresh daily with local, organic ingredients and delivered with care.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    accent: "from-amber-400 via-orange-500 to-yellow-600",
    badge: "Locally Sourced"
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (search.trim()) {
      router.push(`/meals?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] lg:h-[85vh] flex items-center py-12 md:py-20 lg:py-0 overflow-hidden bg-zinc-950">
      {/* Dynamic Background Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.35, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[current].image}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-zinc-950/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />

      {/* Main Content Area */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy & Form */}
        <div className="col-span-1 lg:col-span-7 space-y-8 md:space-y-10 text-left">
          
          {/* Accent Badge */}
          <motion.div
            key={`badge-${current}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-white/80"
          >
            <Sparkles size={12} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]">{slides[current].badge}</span>
          </motion.div>

          {/* Heading and Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.1] sm:leading-[1.05]">
                {slides[current].title} <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[current].accent}`}>
                  {slides[current].highlight}
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
                {slides[current].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Search & CTAs */}
          <div className="space-y-6 max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl sm:rounded-full blur-xl opacity-20 group-hover:opacity-35 transition duration-1000 group-focus-within:opacity-50" />
              <div className="relative flex flex-col sm:flex-row items-center bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-full border border-white/10 p-2 gap-2 sm:gap-0 focus-within:border-white/20 transition-all">
                <div className="flex items-center w-full flex-1 px-3 sm:px-4">
                  <Search className="text-white/40 shrink-0" size={18} />
                  <input 
                    type="text"
                    placeholder="Search meals, kitchens, cuisines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-white px-3 sm:px-4 py-3 sm:h-12 font-medium placeholder:text-white/30 text-sm sm:text-base"
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto h-12 px-8 rounded-xl sm:rounded-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs transition-all active:scale-95 shadow-lg shadow-red-600/30 shrink-0">
                  Search
                </button>
              </div>
            </form>

            {/* CTAs & Social Proof */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/meals" className="inline-flex h-12 px-6 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm items-center justify-center transition-all shadow-md active:scale-95">
                  Order Food
                </Link>
                <Link href="/dashboard" className="inline-flex h-12 px-6 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold text-sm items-center justify-center transition-all active:scale-95">
                  Chef Portal
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden relative">
                      <Image src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Happy Foodie" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-none">
                  <span className="text-white block text-xs font-black">10K+ Foodies</span>
                  Served Warm Daily
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Animated Food Showcase (Visible on Desktop) */}
        <div className="col-span-1 lg:col-span-5 hidden lg:flex flex-col items-center justify-center relative px-8">
          
          {/* Outer decorative glowing ring */}
          <div className="absolute w-96 h-96 rounded-full border border-white/5 bg-gradient-to-r from-red-500/5 to-orange-500/5 blur-xl z-0 animate-pulse" />
          
          {/* Continuous Slow Rotating Food Ring Container */}
          <div className="relative w-80 h-80 xl:w-96 xl:h-96 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                className="w-full h-full relative"
              >
                {/* Main Dish (Slightly rotating continuously in the background loop) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                  className="w-full h-full rounded-full overflow-hidden border-8 border-white/10 shadow-2xl backdrop-blur-md bg-zinc-900/30 relative"
                >
                  <Image 
                    src={slides[current].image} 
                    alt="Delicious Food Dish" 
                    fill 
                    className="object-cover hover:scale-110 transition-transform duration-700" 
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Floating Element 1: Mini Burger (Top Left) */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 w-20 h-20 rounded-full border-4 border-white/15 shadow-xl overflow-hidden bg-zinc-900 z-30"
            >
              <Image 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop" 
                alt="Popular Burger" 
                fill 
                className="object-cover" 
              />
            </motion.div>

            {/* Floating Element 2: Mini Pizza (Bottom Right) */}
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.7 }}
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-4 border-white/15 shadow-xl overflow-hidden bg-zinc-900 z-30"
            >
              <Image 
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200&auto=format&fit=crop" 
                alt="Popular Pizza" 
                fill 
                className="object-cover" 
              />
            </motion.div>

            {/* Floating Glassmorphic Badge 1: Hot Seller */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute top-1/2 -right-16 -translate-y-1/2 bg-zinc-950/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 z-30 select-none"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">🔥 Popular Order</span>
            </motion.div>

            {/* Floating Glassmorphic Badge 2: Ratings */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.3 }}
              className="absolute bottom-8 -left-16 bg-zinc-950/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 z-30 select-none"
            >
              <span className="text-yellow-400 font-bold text-xs">★ 4.9</span>
              <span className="text-[9px] font-bold text-white/50 tracking-wider uppercase">(1.2k+ ratings)</span>
            </motion.div>

            {/* Floating Badge 3: Free Delivery Campaign */}
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute -top-8 right-6 bg-gradient-to-r from-red-600 to-rose-600 px-4 py-1.5 rounded-full shadow-lg border border-red-500/20 z-30 select-none"
            >
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Free Delivery</span>
            </motion.div>
          </div>

          {/* Simple Navigation Dot Indicator below dish */}
          <div className="flex gap-2 mt-8 z-20">
            {slides.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-8 bg-red-500' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex gap-2.5 mt-4 z-20">
            <button 
              onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all active:scale-95"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all active:scale-95"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer opacity-40 hover:opacity-100 transition-all"
      >
        <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-red-500 to-transparent" />
      </motion.div>
    </section>
  );
}
