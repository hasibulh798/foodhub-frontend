"use client";

import { CustomerForm } from "@/components/modules/signup/CustomerForm";
import { RestaurantForm2 } from "@/components/modules/signup/RestaurantForm2";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER" | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center py-12 px-6 overflow-hidden">
      <div className="max-w-6xl w-full bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative">
        
        {/* Left: Illustration / Brand Section */}
        <div className="hidden lg:block relative bg-orange-600 p-16">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-white rounded-full" />
                <span className="text-white font-black uppercase tracking-[0.4em] text-xs">Join Food Hub</span>
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
                Start your culinary <br /> <span className="text-orange-200">adventure</span> today.
            </h1>
            <p className="text-orange-100 text-lg font-medium leading-relaxed max-w-sm">
                Whether you're craving flavors or sharing them, we've built the perfect platform for you.
            </p>
          </div>
          <Image
            src="/signup_illustration_1775731937938.png"
            alt="Signup Illustration"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-orange-600/50 to-transparent" />
        </div>

        {/* Right: Interaction Section */}
        <div className="p-8 md:p-16 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!role ? (
              <motion.div
                key="choice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Choose your path</h2>
                    <p className="text-gray-400 font-medium">Select how you'd like to join our community.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <RoleCard 
                    icon={<User className="text-orange-600" size={32} />}
                    title="Register as Customer"
                    description="Do you want to discover and order delicious local meals?"
                    onClick={() => setRole("CUSTOMER")}
                  />
                  <RoleCard 
                    icon={<Store className="text-red-600" size={32} />}
                    title="Register as Provider"
                    description="Are you want to share your kitchen and grow your restaurant?"
                    onClick={() => setRole("PROVIDER")}
                  />
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 text-center">
                    <p className="text-gray-400 text-sm font-medium">
                        Already have an account? {" "}
                        <Link href="/login" className="text-orange-600 font-black hover:underline underline-offset-4 transition-all">
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
                className="space-y-8"
              >
                <button 
                    onClick={() => setRole(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
                >
                    <ArrowLeft size={14} />
                    Back to Choice
                </button>
                
                <div className="space-y-2 mb-10">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                        Basic Info
                    </h2>
                    <p className="text-gray-400 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Becoming {role === "CUSTOMER" ? "a Gourmet Patron" : "a Restaurant Partner"}</p>
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-4 scrollbar-hide">
                  {role === "CUSTOMER" && <CustomerForm />}
                  {role === "PROVIDER" && <RestaurantForm2 />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ icon, title, description, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-6 p-8 bg-gray-50 dark:bg-zinc-800 rounded-3xl border border-transparent hover:border-orange-500/30 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 text-left"
        >
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-xl">
                {icon}
            </div>
            <div className="flex-1 space-y-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight group-hover:text-orange-600 transition-colors">{title}</h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{description}</p>
            </div>
        </button>
    );
}

