"use client";

import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Clock,
  Shield,
  Star,
  ChefHat,
  Truck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const floatingCards = [
  {
    emoji: "🍕",
    label: "Pizza",
    delay: 0,
    position: "top-[15%] right-[8%] md:right-[5%]",
  },
  {
    emoji: "🍔",
    label: "Burger",
    delay: 0.3,
    position: "top-[45%] right-[2%] md:right-[0%]",
  },
  {
    emoji: "🍜",
    label: "Noodles",
    delay: 0.6,
    position: "bottom-[25%] right-[10%] md:right-[6%]",
  },
  {
    emoji: "🥗",
    label: "Salad",
    delay: 0.9,
    position: "top-[30%] right-[22%] md:right-[18%]",
  },
];

const stats = [
  { value: "500+", label: "Restaurants", icon: ChefHat },
  { value: "30 min", label: "Avg. Delivery", icon: Clock },
  { value: "4.9★", label: "User Rating", icon: Star },
];

export default function Hero() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (search.trim()) {
      router.push(`/meals?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/hero.webp')" }}
      />

      {/* Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Animated Grain/Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%2F%3E%3C%2Fsvg%3E')]" />

      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Column — Text & Search */}
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white"
            >
              <Sparkles size={14} className="text-orange-400" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                #1 Food Delivery Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl font-black text-white leading-[1.1] tracking-tight"
            >
              Delicious Food,{" "}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-500">
                  Delivered
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-orange-500/20 rounded-full origin-left"
                />
              </span>{" "}
              <br className="hidden sm:block" />
              to Your Door
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-gray-300/90 max-w-xl leading-relaxed font-light"
            >
              Browse hundreds of restaurants, explore curated menus, and get
              fresh meals delivered in minutes — all from your neighborhood.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="relative max-w-xl"
            >
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-full border border-white/15 p-1.5 sm:p-2 shadow-2xl shadow-black/20 focus-within:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-5 flex-1">
                  <Search
                    size={20}
                    className="text-gray-400 flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Search for pizza, burger, biryani..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent text-white placeholder:text-gray-500 text-sm sm:text-base py-2.5 sm:py-3 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm sm:text-base px-5 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-full transition-all shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 active:scale-[0.97]"
                >
                  <span className="hidden sm:inline">Find Food</span>
                  <Search size={18} className="sm:hidden" />
                </button>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-4 pl-1">
                <span className="text-gray-500 text-xs font-medium">
                  Popular:
                </span>
                {["Pizza", "Biryani", "Sushi", "Burger"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearch(tag);
                      router.push(`/meals?search=${tag}`);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-orange-400 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                    <stat.icon size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-sm sm:text-base leading-none">
                      {stat.value}
                    </p>
                    <p className="text-gray-500 text-[10px] sm:text-xs font-medium mt-0.5">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-2"
            >
              <Link
                href="/restaurants"
                className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-7 py-4 rounded-2xl sm:rounded-full shadow-xl shadow-orange-600/20 hover:shadow-orange-600/40 transition-all text-sm sm:text-base"
              >
                Explore Restaurants
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 text-white/80 hover:text-white font-semibold px-7 py-4 rounded-2xl sm:rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 backdrop-blur-sm transition-all text-sm sm:text-base"
              >
                <Shield size={16} />
                Join for Free
              </Link>
            </motion.div>
          </div>

          {/* Right Column — Floating Food Cards (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:block relative h-[500px] xl:h-[550px]">
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.8 + card.delay,
                  type: "spring",
                  stiffness: 150,
                }}
                className={`absolute ${card.position}`}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/20 hover:bg-white/15 transition-colors cursor-pointer group"
                >
                  <span className="text-4xl sm:text-5xl block group-hover:scale-110 transition-transform">
                    {card.emoji}
                  </span>
                  <p className="text-white/80 text-xs font-bold mt-2 text-center tracking-wide">
                    {card.label}
                  </p>
                </motion.div>
              </motion.div>
            ))}

            {/* Central Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Delivery Badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute bottom-[8%] right-[15%] bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl px-5 py-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-500/20 rounded-xl">
                  <Truck size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Free Delivery</p>
                  <p className="text-gray-400 text-xs">On first order</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile-only Quick Features Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="lg:hidden mt-10 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Truck, label: "Fast Delivery", color: "text-green-400" },
            { icon: Clock, label: "30 Min Avg", color: "text-blue-400" },
            { icon: Shield, label: "Secure Pay", color: "text-purple-400" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
            >
              <item.icon size={20} className={item.color} />
              <span className="text-white/80 text-[10px] sm:text-xs font-semibold text-center">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" /> */}
    </section>
  );
}
