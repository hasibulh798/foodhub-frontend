"use client";

import { motion } from "framer-motion";
import { Smartphone, Apple, Play, QrCode, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export default function AppPromoSection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <Smartphone size={14} />
                Mobile Experience
              </motion.div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none dark:text-white">
                Gourmet Hub in <br /><span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Your Pocket.</span>
              </h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-lg italic">
                "Experience the fastest ordering flow, real-time GPS tracking, and exclusive app-only culinary events. Your next meal is just a tap away."
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Zap, text: "Instant ordering with 1-tap checkout", color: "text-amber-500" },
                { icon: ShieldCheck, text: "Biometric security for all payments", color: "text-emerald-500" },
                { icon: QrCode, text: "Scan & Eat features at partner venues", color: "text-blue-500" },
              ].map((item, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                        <item.icon size={20} className={item.color} />
                    </div>
                    <span className="font-bold text-foreground/80">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-3 bg-zinc-950 text-white px-8 py-4 rounded-2xl hover:bg-zinc-800 transition-all group active:scale-95">
                    <Apple size={24} className="group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Download on the</p>
                        <p className="text-lg font-black leading-none mt-1">App Store</p>
                    </div>
                </button>
                <button className="flex items-center gap-3 bg-zinc-950 text-white px-8 py-4 rounded-2xl hover:bg-zinc-800 transition-all group active:scale-95">
                    <Play size={24} className="group-hover:scale-110 transition-transform text-primary" />
                    <div className="text-left">
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Get it on</p>
                        <p className="text-lg font-black leading-none mt-1">Google Play</p>
                    </div>
                </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* Phone Mockup Frame */}
            <div className="relative w-72 h-[580px] bg-zinc-900 rounded-[3rem] border-8 border-zinc-800 shadow-3xl overflow-hidden group">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-20" />
                <Image 
                    src="/home/misc/app-promo.jpg" 
                    alt="App Interface" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                <div className="absolute bottom-10 left-6 right-6 z-20 space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">F</div>
                    <p className="text-white font-black text-xl">Ready to Eat?</p>
                    <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-[40%] bg-primary" />
                    </div>
                </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-20 right-0 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl z-30"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-white text-xs font-black">Order Delivered!</p>
                        <p className="text-white/40 text-[10px]">Just now by Alex</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-20 left-0 lg:left-20 p-4 rounded-2xl bg-primary backdrop-blur-xl shadow-2xl z-30"
            >
                <div className="flex items-center gap-3 text-white">
                    <Zap size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">30 Min Delivery</span>
                </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
    </section>
  );
}

import { CheckCircle2 } from "lucide-react";
