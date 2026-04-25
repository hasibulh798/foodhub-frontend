"use client";

import { XCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentFailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 max-w-md w-full p-10 rounded-[3rem] shadow-2xl border border-red-100 dark:border-red-500/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
        
        <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <XCircle size={48} className="text-red-600" />
        </div>

        <h1 className="text-3xl font-black mb-4 dark:text-white">Payment Failed</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
          Something went wrong while processing your payment. Don't worry, no funds were deducted from your account.
        </p>

        <div className="space-y-4">
          <Link 
            href="/cart" 
            className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 active:scale-95"
          >
            <RefreshCcw size={16} />
            Try Again
          </Link>
          
          <Link 
            href="/" 
            className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
          >
            <Home size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
