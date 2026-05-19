"use client";

import { motion } from "framer-motion";
import { Mail, Send, Bell } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the inner circle! Exclusive offers are on their way.");
      setEmail("");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[3.5rem] bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-transparent p-12 md:p-20 overflow-hidden text-center shadow-3xl"
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] -z-10" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-10">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 backdrop-blur-xl text-zinc-700 dark:text-white/80 text-[10px] font-black uppercase tracking-[0.4em]"
                    >
                        <Bell size={14} className="text-primary" />
                        Gourmet Updates
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-none"
                    >
                        Join the <br /><span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Inner Circle.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 dark:text-white/40 text-lg font-medium italic"
                    >
                        "Be the first to discover new restaurants, hidden menus, and exclusive culinary events."
                    </motion.p>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-[2rem] border border-zinc-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none"
                >
                    <div className="relative flex-1 w-full flex items-center px-6 gap-4">
                        <Mail className="text-zinc-400 dark:text-white/20" size={24} />
                        <input
                            type="email"
                            required
                            placeholder="Enter your email identity"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent border-none outline-none text-zinc-900 dark:text-white w-full h-14 font-bold placeholder:text-zinc-400 dark:placeholder:text-white/20"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-primary hover:bg-primary/80 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20"
                    >
                        Subscribe <Send size={16} />
                    </button>
                </motion.form>
                
                <p className="text-[10px] font-black text-zinc-400 dark:text-white/20 uppercase tracking-[0.5em]">
                    Privacy First · No Spam · Culinary Excellence Only
                </p>
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </motion.div>
      </div>
    </section>
  );
}
