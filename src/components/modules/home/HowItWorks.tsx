"use client";

import { motion } from "framer-motion";
import { Search, MapPin, ChefHat, Bike, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Discover Nearby",
    description: "Browse curated menus from top-rated restaurants in your neighborhood.",
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Customize & Order",
    description: "Choose your favorites, add special requests, and pay securely.",
    icon: ChefHat,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Track Delivery",
    description: "Watch your meal travel to you in real-time with precise GPS tracking.",
    icon: Bike,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Savor the Moment",
    description: "Receive your fresh, hot meal and enjoy the gourmet experience.",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  }
];

export default function HowItWorks() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
            >
              The Process
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none sm:leading-tight dark:text-white"
            >
              Simple. Fast. <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Gourmet.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg font-medium max-w-md italic"
          >
            "We've engineered every step to ensure your culinary journey is seamless from discovery to first bite."
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 group-hover:scale-110", step.bg, step.color)}>
                  <step.icon size={40} strokeWidth={2.5} />
                </div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-background border-4 border-muted flex items-center justify-center font-black text-sm shadow-xl">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed px-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
