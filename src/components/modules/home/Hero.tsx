"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative h-screen flex items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/hero.webp')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl"
        >
          Taste Excellence in Every Bite
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-lg text-gray-300"
        >
          Order from the best restaurants near you
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <button className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-full text-lg font-semibold shadow-xl">
            Order Now →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
