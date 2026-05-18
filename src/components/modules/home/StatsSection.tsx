"use client";

import { motion } from "framer-motion";
import { Users, Store, Bike, Star, TrendingUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { 
    label: "Gourmet Users", 
    value: "50K+", 
    icon: Users, 
    color: "text-blue-500", 
    bg: "bg-blue-500/10",
    description: "Active patrons exploring flavors daily"
  },
  { 
    label: "Culinary Partners", 
    value: "1,200+", 
    icon: Store, 
    color: "text-orange-500", 
    bg: "bg-orange-500/10",
    description: "Verified restaurants across the city"
  },
  { 
    label: "Fast Deliveries", 
    value: "1M+", 
    icon: Bike, 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10",
    description: "Meals delivered within 30 minutes"
  },
  { 
    label: "Average Rating", 
    value: "4.9/5", 
    icon: Star, 
    color: "text-amber-500", 
    bg: "bg-amber-500/10",
    description: "Consistency and quality you can trust"
  }
];

export default function StatsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <TrendingUp size={14} />
            Our Impact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none sm:leading-tight dark:text-white"
          >
            Numbers that speak <br /> for our <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Passion</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={32} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mt-2">{stat.description}</p>
              </div>
              
              {/* Decorative line */}
              <div className="absolute bottom-6 right-8 w-12 h-1 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full w-0 group-hover:w-full transition-all duration-700 bg-current", stat.color)} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
