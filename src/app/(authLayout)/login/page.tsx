"use client";

import { LoginForm } from "@/components/layout/login-form";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative border border-gray-100 dark:border-zinc-800">
        
        {/* Left: Brand / Experience Section */}
        <div className="hidden lg:block relative bg-zinc-900 p-16 overflow-hidden">
          <div className="relative z-20 h-full flex flex-col justify-between">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="h-4 w-4 bg-orange-600 rounded-full animate-pulse" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Food Hub Login</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">
                  Welcome <br /> <span className="text-orange-500">Back.</span>
                </h1>
                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm mt-8">
                  The flavors you love are just a few clicks away. Sign in to continue your culinary journey.
                </p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 overflow-hidden relative">
                       <Image src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" fill />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Joined by 10k+ Foodies</p>
              </div>
            </motion.div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-transparent to-transparent z-10" />
          <Image
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
            alt="Food"
            fill
            className="object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000 scale-110"
          />
        </div>

        {/* Right: Login Form Section */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-zinc-900">
          <div className="mb-10 flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-all group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Home
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">New here?</span>
              <Link href="/signup">
                <Button variant="ghost" size="sm" className="rounded-full text-[10px] font-black uppercase tracking-widest hover:text-orange-600">
                  Join Now <ChevronRight size={12} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="mb-10">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Login</h2>
              <p className="text-gray-400 font-medium mt-2">Access your personalized food experience.</p>
            </div>

            <LoginForm />
          </motion.div>
          
          <p className="mt-10 text-center text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">
            © 2026 Food Hub · Secure Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
