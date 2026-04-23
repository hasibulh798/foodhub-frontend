"use client";

import { useSession } from "@/lib/auth-client";
import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { Order } from "@/constants/allType";
import {
  User,
  Mail,
  Phone,
  ShoppingBag,
  TrendingUp,
  Clock,
  Star,
  CheckCircle2,
  Edit3,
  Save,
  X,
  MapPin,
  Calendar,
  Award,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400 bg-amber-400/10",
  CONFIRMED: "text-blue-400 bg-blue-400/10",
  PREPARING: "text-purple-400 bg-purple-400/10",
  OUT_FOR_DELIVERY: "text-orange-400 bg-orange-400/10",
  DELIVERED: "text-emerald-400 bg-emerald-400/10",
  CANCELLED: "text-rose-400 bg-rose-400/10",
};

export default function CustomerProfilePage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: (user as any).phone || "" });
    }
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSpent = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const activeCount = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length;

  if (isPending || loadingOrders) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-500/20" />
          <p className="text-gray-400 animate-pulse font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* ─── Hero Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-8 shadow-2xl shadow-orange-500/20"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-xl">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-white">
              {user?.name}
            </h1>
            <p className="text-orange-100 mt-1 flex items-center gap-2 text-sm">
              <Mail size={14} />
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                🍽️ Food Lover
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30 flex items-center gap-1">
                <Calendar size={10} /> Member since {memberSince}
              </span>
              {user?.emailVerified && (
                <span className="px-3 py-1 bg-emerald-400/20 backdrop-blur-sm text-emerald-100 text-xs font-bold rounded-full border border-emerald-300/30 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Stats Row ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
          },
          {
            label: "Active Orders",
            value: activeCount,
            icon: Clock,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
          },
          {
            label: "Delivered",
            value: deliveredCount,
            icon: Package,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
          {
            label: "Total Spent",
            value: `৳${totalSpent.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-default`}
          >
            <div className={`${stat.color} ${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Profile Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              Account Info
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-lg"
            >
              {editing ? <X size={15} /> : <Edit3 size={15} />}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/60 transition"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                  Phone Number
                </label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-orange-500/60 transition"
                  placeholder="+880..."
                />
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                <Save size={14} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  icon: User,
                  label: "Full Name",
                  value: user?.name || "—",
                },
                {
                  icon: Mail,
                  label: "Email Address",
                  value: user?.email || "—",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: (user as any)?.phone || "Not set",
                },
                {
                  icon: Calendar,
                  label: "Member Since",
                  value: memberSince,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mt-0.5 group-hover:bg-orange-500/10 transition-colors">
                    <item.icon size={14} className="text-gray-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-200 font-medium mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="pt-4 border-t border-gray-800">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-3">
              Achievements
            </p>
            <div className="flex flex-wrap gap-2">
              {deliveredCount >= 1 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                  <Award size={10} /> First Order
                </span>
              )}
              {deliveredCount >= 5 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">
                  <Star size={10} /> Regular Customer
                </span>
              )}
              {totalSpent >= 1000 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-full border border-purple-500/20">
                  <TrendingUp size={10} /> Big Spender
                </span>
              )}
              {deliveredCount === 0 && (
                <span className="text-xs text-gray-600 italic">
                  Place your first order to earn badges!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ─── Recent Orders ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag size={16} className="text-orange-500" />
              Order History
            </h2>
          </div>
          <div className="divide-y divide-gray-800/60">
            {orders.length === 0 ? (
              <div className="p-16 flex flex-col items-center gap-3 text-center opacity-40">
                <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={28} className="text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-400">No orders yet</p>
                <p className="text-xs text-gray-600">
                  Explore the menu to place your first order
                </p>
              </div>
            ) : (
              orders.slice(0, 6).map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {order.provider?.businessName || "Restaurant"}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        #{order.id.slice(-8).toUpperCase()} ·{" "}
                        {order.orderItems?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        STATUS_COLORS[order.status] || "text-gray-400 bg-gray-800"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-black text-white tabular-nums">
                      ৳{Number(order.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
