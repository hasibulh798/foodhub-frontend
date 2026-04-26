"use client";

import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { Order } from "@/constants/allType";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  TrendingUp,
  Search,
  ChevronRight,
  Utensils,
  AlertTriangle,
  X
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  PENDING: { color: "text-amber-400", bg: "bg-amber-400/10", icon: Clock, label: "Pending" },
  CONFIRMED: { color: "text-blue-400", bg: "bg-blue-400/10", icon: CheckCircle2, label: "Confirmed" },
  PREPARING: { color: "text-purple-400", bg: "bg-purple-400/10", icon: Package, label: "Preparing" },
  OUT_FOR_DELIVERY: { color: "text-orange-400", bg: "bg-orange-400/10", icon: TrendingUp, label: "Out for Delivery" },
  DELIVERED: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2, label: "Delivered" },
  CANCELLED: { color: "text-rose-400", bg: "bg-rose-400/10", icon: XCircle, label: "Cancelled" },
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    setIsCancelling(true);
    const toastId = toast.loading("Cancelling order...");
    try {
      await orderService.cancelOrder(orderToCancel);
      toast.success("Order cancelled successfully", { id: toastId });
      setOrders(prev => prev.map(o => o.id === orderToCancel ? { ...o, status: "CANCELLED" } : o));
      setOrderToCancel(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel order", { id: toastId });
    } finally {
      setIsCancelling(false);
    }
  };

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Order History</h1>
          <p className="text-gray-500 mt-1 font-medium">Relive your favorite dining moments.</p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["ALL", ...Object.keys(STATUS_CONFIG)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap border ${
                filter === s 
                ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order, index) => (
            <motion.div
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 group hover:border-gray-700 transition-all flex flex-col md:flex-row gap-6 md:items-center justify-between shadow-xl"
            >
              <div className="flex gap-5 md:items-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-orange-500 shadow-inner group-hover:bg-gray-700 transition-colors">
                  <Utensils size={28} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white">{order.provider?.businessName || "Great Chef"}</span>
                    <span className="text-[10px] font-mono text-gray-600 font-bold">#{order.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium tracking-tight">
                    <span>{order.orderItems?.length} items</span>
                    <span>•</span>
                    <span>৳{Number(order.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${STATUS_CONFIG[order.status]?.bg} ${STATUS_CONFIG[order.status]?.color}`}>
                      {order.status.replace(/_/g, " ")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString("en-BD", { day: 'numeric', month: 'long', year: 'numeric'})}</p>
                <div className="flex items-center gap-2">
                  <Link 
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-750 text-gray-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    Details
                    <ChevronRight size={14} />
                  </Link>
                  {order.status === "PENDING" && (
                    <button 
                      onClick={() => setOrderToCancel(order.id)}
                      className="bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.status === "DELIVERED" && (
                     <button className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-600/10 active:scale-95">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900/40 rounded-[3rem] border border-gray-800 border-dashed">
            <div className="p-6 bg-gray-800 rounded-3xl text-gray-600 mb-4 opacity-30">
              <Search size={48} />
            </div>
            <p className="text-gray-500 font-bold tracking-tight">No orders found for this filter.</p>
            <button onClick={() => setFilter("ALL")} className="mt-4 text-orange-500 text-sm font-black uppercase tracking-widest hover:text-orange-400">Clear Filters</button>
          </div>
        )}
      </div>

      {/* ─── Cancel Confirmation Modal ─── */}
      <AnimatePresence>
        {orderToCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setOrderToCancel(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-600" />
              
              <button 
                onClick={() => setOrderToCancel(null)}
                disabled={isCancelling}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500">
                  <AlertTriangle size={40} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Cancel Order?</h2>
                  <p className="text-gray-400 text-sm font-medium mt-2 leading-relaxed">
                    Are you sure you want to cancel this order? This action cannot be undone and your meal preparation will be stopped.
                  </p>
                </div>

                <div className="w-full flex flex-col gap-3 pt-4">
                  <button 
                    onClick={handleCancelOrder}
                    disabled={isCancelling}
                    className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-rose-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isCancelling ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Yes, Cancel Order"
                    )}
                  </button>
                  <button 
                    onClick={() => setOrderToCancel(null)}
                    disabled={isCancelling}
                    className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-black uppercase tracking-widest text-[10px] rounded-2xl active:scale-[0.98] transition-all"
                  >
                    Keep Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
