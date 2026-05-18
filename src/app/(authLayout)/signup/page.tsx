"use client";

import { CustomerForm } from "@/components/modules/signup/CustomerForm";
import { RestaurantForm2 } from "@/components/modules/signup/RestaurantForm2";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Store, ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER" | null>(null);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-6 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-card/30 backdrop-blur-3xl rounded-[3rem] shadow-premium overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative border border-border/50"
      >
        
        {/* Left: Illustration / Brand Section */}
        <div className="hidden lg:block relative bg-zinc-950 p-16 overflow-hidden">
          <div className="relative z-20 space-y-12">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <div className="h-5 w-5 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Join Food Hub</span>
            </motion.div>
            
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85]">
                    Start your <br /> <span className="text-primary text-gradient">Adventure.</span>
                </h1>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm italic">
                    "Whether you're craving flavors or sharing them, we've built the perfect platform for your culinary dreams."
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-fit"
            >
                <ShieldCheck className="text-primary" size={24} />
                <div className="space-y-0.5">
                    <p className="text-xs text-white font-black uppercase tracking-widest">Secure Platform</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Trusted by 1000+ Partners</p>
                </div>
            </motion.div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Signup Illustration"
            fill
            className="object-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
          />
        </div>

        {/* Right: Interaction Section */}
        <div className="p-8 md:p-20 flex flex-col justify-center bg-card">
          <AnimatePresence mode="wait">
            {!role ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-3">
                    <h2 className="text-5xl font-black text-foreground tracking-tight leading-none">Choose Path</h2>
                    <p className="text-muted-foreground font-medium text-lg italic">How would you like to experience Food Hub?</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <RoleCard 
                    icon={<User className="text-primary" size={32} />}
                    title="Gourmet Patron"
                    description="Discover, order, and indulge in exquisite local cuisines."
                    onClick={() => setRole("CUSTOMER")}
                    color="bg-primary/10"
                  />
                  <RoleCard 
                    icon={<Store className="text-emerald-500" size={32} />}
                    title="Culinary Partner"
                    description="Share your kitchen's magic and grow your food business."
                    onClick={() => setRole("PROVIDER")}
                    color="bg-emerald-500/10"
                  />
                </div>

                <div className="pt-10 border-t border-border/50 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                        Already part of the family? {" "}
                        <Link href="/login" className="text-primary font-black hover:underline underline-offset-8 transition-all uppercase tracking-widest text-xs">
                            Sign In
                        </Link>
                    </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <button 
                    onClick={() => setRole(null)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary font-black text-[10px] uppercase tracking-[0.3em] transition-all group mb-4"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Choice
                </button>
                
                <div className="space-y-3">
                    <h2 className="text-5xl font-black text-foreground tracking-tight leading-none">
                        Identity
                    </h2>
                    <p className="text-primary font-black text-[10px] uppercase tracking-[0.4em] italic">
                        Becoming {role === "CUSTOMER" ? "a Gourmet Patron" : "a Culinary Partner"}
                    </p>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                  {role === "CUSTOMER" && <CustomerForm />}
                  {role === "PROVIDER" && <RestaurantForm2 />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 20px; }
      `}</style>
    </div>
  );
}

function RoleCard({ icon, title, description, onClick, color }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-8 p-8 rounded-[2.5rem] bg-muted/20 border border-border/50 hover:bg-muted/40 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden text-left shadow-sm hover:shadow-xl"
        >
            <div className={cn("p-5 rounded-2xl shadow-inner transition-all duration-500 group-hover:scale-110", color)}>
                {icon}
            </div>
            <div className="flex-1 space-y-1 relative z-10">
                <h3 className="text-2xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80">{description}</p>
            </div>
            <div className="absolute right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                <ChevronRight className="text-primary" size={24} />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
        </button>
    );
}

import { cn } from "@/lib/utils";

