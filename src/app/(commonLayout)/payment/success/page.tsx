"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/lib/Cart-context";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 max-w-md w-full p-10 rounded-[3rem] shadow-2xl border border-emerald-100 dark:border-emerald-500/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <CheckCircle2 size={48} className="text-emerald-600" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 bg-emerald-500 rounded-full"
          />
        </div>

        <h1 className="text-3xl font-black mb-4 dark:text-white">Payment Successful!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-medium">
          Your payment has been processed securely. We've notified the kitchen to start preparing your delicious meal.
        </p>

        {tranId && (
          <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Transaction ID</p>
            <p className="text-sm font-bold dark:text-white font-mono">{tranId}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link 
            href={`/dashboard/orders/${orderId}`} 
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
          >
            Track My Order
            <ArrowRight size={16} />
          </Link>
          
          <Link 
            href="/" 
            className="w-full flex items-center justify-center gap-3 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95"
          >
            <ShoppingBag size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
