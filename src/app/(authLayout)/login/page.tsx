"use client";

import { LoginForm } from "@/components/layout/login-form";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-6 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-card/50 backdrop-blur-3xl rounded-[3rem] shadow-premium overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative border border-border/50"
      >
        
        {/* Left: Brand / Experience Section */}
        <div className="hidden lg:block relative bg-zinc-950 p-16 overflow-hidden">
          <div className="relative z-20 h-full flex flex-col justify-between">
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="h-5 w-5 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Food Hub Login</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">
                  Welcome <br /> <span className="text-primary text-gradient">Back.</span>
                </h1>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm mt-10 italic">
                  "The flavors you love are just a few clicks away. Sign in to continue your culinary journey."
                </p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-5 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-fit">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-2xl border-2 border-zinc-950 bg-zinc-900 overflow-hidden relative shadow-xl">
                       <Image src={`https://i.pravatar.cc/100?img=${i+15}`} alt="User" fill className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs text-white font-black uppercase tracking-widest">Joined by 10k+</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Gourmet Foodies</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
            alt="Food"
            fill
            className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
          />
        </div>

        {/* Right: Login Form Section */}
        <div className="p-8 md:p-20 flex flex-col justify-center bg-card">
          <div className="mb-12 flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-widest transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">New here?</span>
              <Link href="/signup">
                <Badge variant="success" className="cursor-pointer hover:scale-105 transition-transform px-4 py-2 rounded-full font-black text-[10px] tracking-widest uppercase">
                  Join Now <ChevronRight size={12} className="ml-1" />
                </Badge>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <div className="mb-12 space-y-2">
              <h2 className="text-5xl font-black text-foreground tracking-tight leading-none">Login</h2>
              <p className="text-muted-foreground font-medium text-lg italic">Access your personalized food experience.</p>
            </div>

            <LoginForm />
          </motion.div>
          
          <div className="mt-16 pt-8 border-t border-border/50 text-center">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
              © 2026 Food Hub · Secure & Private
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
