"use client";

import { useSession } from "@/lib/auth-client";
import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { Order } from "@/constants/allType";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Package,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: "text-amber-400", bg: "bg-amber-400/10", icon: Clock },
  CONFIRMED: { color: "text-blue-400", bg: "bg-blue-400/10", icon: CheckCircle2 },
  PREPARING: { color: "text-purple-400", bg: "bg-purple-400/10", icon: Package },
  OUT_FOR_DELIVERY: { color: "text-orange-400", bg: "bg-orange-400/10", icon: TrendingUp },
  DELIVERED: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
  CANCELLED: { color: "text-rose-400", bg: "bg-rose-400/10", icon: XCircle },
};

export default function CustomerDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalSpent = orders
    .filter(o => o.status === "DELIVERED")
    .reduce((acc, order) => acc + Number(order.totalAmount), 0);
  
  const activeOrders = orders.filter(o => !["DELIVERED", "CANCELLED"].includes(o.status)).length;

  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-500/20" />
          <p className="text-gray-500 animate-pulse font-medium tracking-wide">Cooking up your dashboard...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hello, <span className="text-orange-500">{user?.name?.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-gray-400 font-medium">Manage your cravings and track your delights.</p>
        </motion.div>
        
        <Link 
          href="/meals" 
          className="group inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-orange-600/10 active:scale-95"
        >
          Explore Menu
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "blue", bg: "bg-blue-500/10", text: "text-blue-500" },
          { label: "Active Orders", value: activeOrders, icon: Clock, color: "orange", bg: "bg-orange-500/10", text: "text-orange-500" },
          { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "emerald", bg: "bg-emerald-500/10", text: "text-emerald-500" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2.5rem] bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-300 group relative overflow-hidden"
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.text}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black mt-1 text-white tabular-nums">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-800 rounded-xl">
              <Calendar className="text-orange-500" size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Recent Orders</h3>
          </div>
          <Link href="/dashboard/orders" className="text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors px-4 py-2 hover:bg-orange-500/5 rounded-xl">
            View History
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Delight From</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Total Amount</th>
                <th className="px-8 py-5 text-right">Placed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.slice(0, 5).map((order) => {
                const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="group hover:bg-gray-800/20 transition-all">
                    <td className="px-8 py-6">
                      <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-gray-300 transition-colors">#{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">{order.provider?.businessName || "Chef Delight"}</span>
                        <span className="text-[10px] text-gray-500">{order.orderItems?.length || 0} items ordered</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.color} border border-white/5 shadow-inner`}>
                        <StatusIcon size={12} className="stroke-[3]" />
                        {order.status.replace(/_/g, " ")}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-white tabular-nums">৳{Number(order.totalAmount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xs font-bold text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-gray-500">
                    <motion.div 
                      className="flex flex-col items-center gap-4 opacity-40"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.4 }}
                    >
                      <div className="p-6 bg-gray-800 rounded-[2rem]">
                        <ShoppingBag size={64} className="stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">Your order history is empty</p>
                        <p className="text-sm">Start your food journey by exploring the menu!</p>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
