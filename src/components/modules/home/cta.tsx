"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight,
  ChefHat,
  Utensils,
  Clock,
  Star,
  Sparkles,
  Heart,
  Gift,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Lightning Fast",
    desc: "Average 30 min delivery",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ChefHat,
    title: "Top Chefs",
    desc: "500+ verified kitchens",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Star,
    title: "Best Rated",
    desc: "4.9★ average rating",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Gift,
    title: "Exclusive Deals",
    desc: "Daily offers & rewards",
    color: "from-purple-500 to-pink-500",
  },
];

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 md:py-36 overflow-hidden"
    >
      {/* Background — Rich Dark Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Decorative Mesh Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-600/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Emojis — decorative */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] text-5xl sm:text-6xl opacity-10 pointer-events-none hidden md:block"
      >
        🍕
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[15%] right-[8%] text-5xl sm:text-6xl opacity-10 pointer-events-none hidden md:block"
      >
        🍔
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] right-[3%] text-4xl opacity-10 pointer-events-none hidden lg:block"
      >
        🥡
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section — Headline */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-6 sm:mb-8"
          >
            <Sparkles size={14} />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              Join Thousands of Happy Customers
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6 sm:mb-8"
          >
            Your Next Meal Is{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-500">
                Just a Click
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute bottom-0 sm:bottom-1 left-0 w-full h-2 sm:h-3 bg-orange-500/20 rounded-full origin-left"
              />
            </span>{" "}
            Away
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
          >
            From local favorites to gourmet kitchens — discover, order, and
            enjoy fresh meals delivered to your doorstep in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            <Link
              href="/restaurants"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-full text-base sm:text-lg shadow-2xl shadow-orange-600/25 hover:shadow-orange-600/40 transition-all active:scale-[0.97]"
            >
              <Utensils size={20} />
              Order Now
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/signup"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 text-white/90 hover:text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 backdrop-blur-sm transition-all text-base sm:text-lg"
            >
              <Heart size={18} />
              Join FoodHub
            </Link>
          </motion.div>
        </div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {benefits.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 cursor-default"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} mb-4 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon size={20} className="text-white sm:w-6 sm:h-6" />
              </div>

              {/* Text */}
              <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
                {item.desc}
              </p>

              {/* Hover Glow */}
              <div
                className={`absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.color} blur-xl -z-10 scale-75`}
                style={{ opacity: 0.04 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Trust Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/[0.06]"
        >
          {/* Avatars Stack */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[
                "photo-1494790108377-be9c29b29330",
                "photo-1507003211169-0a1dd7228f2d",
                "photo-1580489944761-15a19d654956",
                "photo-1599566150163-29194dcaad36",
              ].map((id, i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/${id}?q=60&w=80&h=80&auto=format&fit=crop`}
                  alt=""
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-900 object-cover"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className="text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
              <p className="text-gray-500 text-[10px] sm:text-xs font-medium mt-0.5">
                Trusted by <span className="text-white font-bold">10,000+</span>{" "}
                customers
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-white/10" />

          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Available in your area — Order now!
          </div>
        </motion.div>
      </div>
    </section>
  );
}