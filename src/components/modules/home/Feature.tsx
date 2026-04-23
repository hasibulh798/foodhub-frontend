"use client";

import { motion } from "framer-motion";
import { Truck, CreditCard, MapPin, ShieldCheck, Headphones, Leaf } from "lucide-react";

const features = [
  {
    title: "Fast Delivery",
    icon: Truck,
    text: "No long waits. Track your order in real-time and enjoy timely delivery every time.",
    color: "from-green-500 to-emerald-600",
    bgGlow: "bg-green-500/10",
  },
  {
    title: "Secure Payment",
    icon: CreditCard,
    text: "Your transactions are protected with advanced encryption, ensuring safe and hassle-free payments.",
    color: "from-blue-500 to-indigo-600",
    bgGlow: "bg-blue-500/10",
  },
  {
    title: "Live Tracking",
    icon: MapPin,
    text: "Stay informed every step of the way with real-time tracking and instant delivery notifications.",
    color: "from-orange-500 to-red-600",
    bgGlow: "bg-orange-500/10",
  },
  {
    title: "Quality Assured",
    icon: ShieldCheck,
    text: "Every kitchen is verified and rated. We maintain strict quality standards for your peace of mind.",
    color: "from-purple-500 to-violet-600",
    bgGlow: "bg-purple-500/10",
  },
  {
    title: "24/7 Support",
    icon: Headphones,
    text: "Our dedicated support team is available around the clock to help you with any questions or issues.",
    color: "from-pink-500 to-rose-600",
    bgGlow: "bg-pink-500/10",
  },
  {
    title: "Fresh & Local",
    icon: Leaf,
    text: "Supporting local businesses with fresh ingredients sourced from your neighborhood kitchens.",
    color: "from-teal-500 to-cyan-600",
    bgGlow: "bg-teal-500/10",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 sm:py-28 md:py-36 bg-gray-50 dark:bg-zinc-950/50 relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest mb-5 sm:mb-6"
          >
            <ShieldCheck size={14} />
            Why Choose Us
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            Built for <span className="text-orange-600">Your Convenience</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-500 dark:text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed"
          >
            Every feature is designed to make your food ordering experience seamless, secure, and delightful.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Icon */}
              <div
                className={`inline-flex p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br ${item.color} mb-5 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon size={22} className="text-white sm:w-6 sm:h-6" />
              </div>

              {/* Text */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                {item.text}
              </p>

              {/* Corner Glow on Hover */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${item.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
