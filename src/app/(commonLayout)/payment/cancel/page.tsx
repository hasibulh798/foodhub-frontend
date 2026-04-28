"use client";

import { AlertCircle, ShoppingCart, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 max-w-md w-full p-10 rounded-[3rem] shadow-2xl border border-amber-100 dark:border-amber-500/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
        
        <div className="w-24 h-24 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <AlertCircle size={48} className="text-amber-600" />
        </div>

        <h1 className="text-3xl font-black mb-4 dark:text-white">Payment Cancelled</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
          You've cancelled the payment process. Don't worry, your order has been saved. You can try paying again anytime from your order history.
        </p>

        <div className="space-y-4">
          <Link 
            href="/dashboard/orders" 
            className="w-full flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-600/20 active:scale-95"
          >
            <ShoppingCart size={16} />
            View My Orders
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
