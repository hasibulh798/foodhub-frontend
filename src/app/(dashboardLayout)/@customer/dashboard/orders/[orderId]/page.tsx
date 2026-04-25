"use client";

import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { Order } from "@/constants/allType";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  Truck,
  MapPin,
  Phone,
  CreditCard,
  ChevronLeft,
  AlertCircle,
  ArrowRight,
  Utensils,
  Receipt,
  Store
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const STATUS_STEPS = ["PENDING", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  PENDING: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock, label: "Order Placed" },
  CONFIRMED: { color: "text-blue-500", bg: "bg-blue-500/10", icon: CheckCircle2, label: "Confirmed" },
  PREPARING: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Package, label: "Preparing Your Feast" },
  OUT_FOR_DELIVERY: { color: "text-orange-500", bg: "bg-orange-500/10", icon: Truck, label: "On The Way" },
  DELIVERED: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2, label: "Delivered & Enjoyed" },
  CANCELLED: { color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle, label: "Cancelled" },
};

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = React.use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const router = useRouter();

  const fetchOrderDetails = async () => {
    try {
      const data = await orderService.getSingleOrder(orderId);
      setOrder(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    
    setCancelling(true);
    try {
      await orderService.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      fetchOrderDetails();
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="p-6 bg-red-500/10 rounded-3xl text-red-500 mb-6">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-sm">We couldn't find the order you're looking for. It may have been deleted or the ID is incorrect.</p>
        <Link href="/dashboard/orders" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold border border-gray-800 hover:border-gray-700 transition-all">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-white hover:bg-gray-800 transition-all active:scale-90"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-2xl font-black text-white tracking-tight">Order Details</h1>
               <span className="text-xs font-mono text-gray-600 font-bold">#{order.id.toUpperCase()}</span>
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-BD", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
            </p>
          </div>
        </div>

        {order.status === "PENDING" && (
          <button 
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 border border-red-500/20"
          >
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Order Status & Items */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Progress Tracker */}
          {!isCancelled && (
            <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-xl">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                    <Truck size={16} className="text-orange-500" />
                    Delivery Tracking
                  </h3>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_CONFIG[order.status]?.bg} ${STATUS_CONFIG[order.status]?.color} border border-current/10`}>
                    {STATUS_CONFIG[order.status]?.label}
                  </div>
               </div>

               <div className="relative flex justify-between items-start pt-2">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-800 rounded-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                      className="h-full bg-orange-600 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)]"
                    />
                  </div>

                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    const Config = STATUS_CONFIG[step];

                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center text-center gap-3 w-1/5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                          isActive ? "bg-orange-600 border-orange-600/30 text-white scale-110 shadow-lg shadow-orange-600/20" :
                          isCompleted ? "bg-gray-900 border-orange-600 text-orange-600" :
                          "bg-gray-900 border-gray-800 text-gray-700"
                        }`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-tighter leading-tight max-w-[60px] ${
                          isCompleted ? "text-white" : "text-gray-700"
                        }`}>
                          {Config?.label.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 text-center shadow-xl">
               <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
                 <XCircle size={40} />
               </div>
               <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Order Cancelled</h3>
               <p className="text-gray-500 max-w-sm mx-auto font-medium">This order was cancelled. If you believe this is a mistake, please contact support.</p>
            </div>
          )}

          {/* Items List */}
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="p-8 border-b border-gray-800 bg-gray-800/20">
               <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                 <Utensils size={16} className="text-orange-500" />
                 Items Ordered
               </h3>
            </div>
            <div className="divide-y divide-gray-800">
               {order.orderItems?.map((item: any) => (
                 <div key={item.id} className="p-8 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                       <div className="relative w-20 h-20 rounded-3xl overflow-hidden bg-gray-800 border border-gray-800 shadow-inner group-hover:scale-105 transition-transform">
                          <Image 
                            src={item.meal?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                            alt={item.meal?.name || "Meal"} 
                            fill 
                            className="object-cover"
                          />
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-black text-white text-lg tracking-tight">{item.meal?.name}</h4>
                          <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-widest">
                             <span>৳{Number(item.price).toLocaleString()}</span>
                             <span>×</span>
                             <span className="text-orange-500">{item.quantity}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-white tracking-tight">৳{(Number(item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Info & Summary */}
        <div className="space-y-8">
           {/* Store Info */}
           <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
               <Store size={80} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
               <Store size={14} className="text-orange-500" />
               Kitchen Info
             </h3>
             <div className="space-y-4">
                <p className="text-xl font-black text-white tracking-tight leading-tight">{order.provider?.businessName || "Gourmet Kitchen"}</p>
                <div className="flex items-start gap-3 text-sm text-gray-500 font-medium">
                  <MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
                  <span>{order.provider?.address || "Address not provided"}</span>
                </div>
             </div>
           </div>

           {/* Delivery Details */}
           <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-xl">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
               <MapPin size={14} className="text-orange-500" />
               Delivery Details
             </h3>
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Contact Phone</p>
                    <p className="text-sm font-bold text-white mt-1">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Shipping Address</p>
                    <p className="text-sm font-bold text-white mt-1 leading-relaxed">{order.deliveryAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Payment Method</p>
                    <p className="text-sm font-bold text-white mt-1">{order.paymentMethod.replace(/_/g, " ")}</p>
                  </div>
                </div>
             </div>
           </div>

           {/* Order Summary */}
           <div className="bg-gray-900 border border-orange-500/20 rounded-[2.5rem] p-8 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[80px] -mr-16 -mt-16" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-2">
               <Receipt size={14} className="text-orange-500" />
               Order Summary
             </h3>
             <div className="space-y-5">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-white">৳{Number(order.subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-white">৳{Number(order.deliveryFee).toLocaleString()}</span>
                </div>
                <div className="h-px bg-gray-800 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Amount</span>
                  <span className="text-3xl font-black text-orange-500 tabular-nums tracking-tighter">৳{Number(order.totalAmount).toLocaleString()}</span>
                </div>
             </div>
             
             {order.status === "DELIVERED" && (
                <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-10 hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                  Reorder Now <ArrowRight size={14} />
                </button>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
