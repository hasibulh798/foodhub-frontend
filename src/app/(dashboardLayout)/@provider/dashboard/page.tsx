"use client";

import { useSession } from "@/lib/auth-client";
import { orderService } from "@/services/order.service";
import { providerServices } from "@/services/provider.service";
import { useEffect, useState } from "react";
import type { Order, Meal, ProviderProfile } from "@/constants/allType";
import {
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  Package,
  UtensilsCrossed,
  DollarSign,
  AlertCircle,
  ChefHat,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ─── Status Config ─── */
const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: typeof Clock; dot: string }
> = {
  PENDING: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    icon: Clock,
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    icon: CheckCircle2,
    dot: "bg-blue-400",
  },
  PREPARING: {
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    icon: Package,
    dot: "bg-purple-400",
  },
  OUT_FOR_DELIVERY: {
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    icon: TrendingUp,
    dot: "bg-orange-400",
  },
  DELIVERED: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    icon: CheckCircle2,
    dot: "bg-emerald-400",
  },
  CANCELLED: {
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    icon: XCircle,
    dot: "bg-rose-400",
  },
};

export default function ProviderDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, mealsData, profileData] = await Promise.allSettled([
          orderService.getProviderOrders(),
          providerServices.getMyMeals(),
          providerServices.getMyProfile(),
        ]);

        if (ordersData.status === "fulfilled") {
          setOrders(
            Array.isArray(ordersData.value) ? ordersData.value : []
          );
        }
        if (mealsData.status === "fulfilled") {
          setMeals(
            Array.isArray(mealsData.value) ? mealsData.value : []
          );
        }
        if (profileData.status === "fulfilled") {
          setProfile(profileData.value);
        }
      } catch (error) {
        console.error("Failed to fetch provider data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ─── Computed Stats ─── */
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((acc, order) => acc + Number(order.totalAmount), 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const activeOrders = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter(
    (o) => o.status === "DELIVERED"
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.status === "CANCELLED"
  ).length;
  const availableMeals = meals.filter((m) => m.isAvailable).length;
  const unavailableMeals = meals.filter((m) => !m.isAvailable).length;

  if (sessionLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-500/20" />
          <p className="text-muted-foreground animate-pulse font-medium tracking-wide text-sm">
            Loading your kitchen...
          </p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
      {/* ═══════════════════════════════════════════
          WELCOME HEADER
      ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/20">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome back,{" "}
                <span className="text-orange-500">
                  {user?.name?.split(" ")[0]}
                </span>
                ! 🍳
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {profile?.businessName || "Your Restaurant"}{" "}
                {profile?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-bold ml-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard/menu"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 md:px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/15 active:scale-[0.97] text-sm"
          >
            <UtensilsCrossed size={16} />
            Manage Menu
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl font-bold border border-border hover:bg-muted text-sm transition-all active:scale-[0.97]"
          >
            <Package size={16} />
            All Orders
          </Link>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          STATS GRID
      ═══════════════════════════════════════════ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: "Total Revenue",
            value: `৳${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: `${deliveredOrders} delivered`,
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingCart,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: `${activeOrders} active`,
          },
          {
            label: "Menu Items",
            value: meals.length,
            icon: UtensilsCrossed,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            trend: `${availableMeals} available`,
          },
          {
            label: "Pending",
            value: pendingOrders,
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            trend: "Needs attention",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group relative p-5 md:p-6 rounded-2xl bg-card border border-border hover:border-orange-500/20 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="absolute -right-3 -top-3 w-20 h-20 bg-gradient-to-br from-transparent to-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={16} />
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-black tabular-nums leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-2 font-medium">
                {stat.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════
          ORDER STATUS BREAKDOWN + QUICK ACTIONS
      ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Order Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="px-5 md:px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <BarChart3 size={16} className="text-orange-500" />
              </div>
              <h3 className="font-bold text-sm md:text-base">Order Breakdown</h3>
            </div>
            <Link
              href="/dashboard/orders"
              className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="p-5 md:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(
                [
                  "PENDING",
                  "CONFIRMED",
                  "PREPARING",
                  "OUT_FOR_DELIVERY",
                  "DELIVERED",
                  "CANCELLED",
                ] as const
              ).map((status) => {
                const config = STATUS_CONFIG[status];
                const count = orders.filter(
                  (o) => o.status === status
                ).length;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={status}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border border-border/50 ${config.bg} transition-all hover:scale-[1.02]`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-background/50 ${config.color}`}
                    >
                      <StatusIcon size={16} />
                    </div>
                    <div>
                      <p className="text-xl font-black tabular-nums leading-none">
                        {count}
                      </p>
                      <p className="text-[10px] font-semibold text-muted-foreground mt-0.5 capitalize">
                        {status.replace(/_/g, " ").toLowerCase()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="px-5 md:px-6 py-4 border-b border-border">
            <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
              <Star size={16} className="text-orange-500" />
              Quick Actions
            </h3>
          </div>

          <div className="p-4 space-y-2">
            {[
              {
                title: "Add New Meal",
                desc: "Create a new menu item",
                icon: UtensilsCrossed,
                href: "/dashboard/menu",
                color: "text-orange-500 bg-orange-500/10",
              },
              {
                title: "View Orders",
                desc: "Manage incoming orders",
                icon: Package,
                href: "/dashboard/orders",
                color: "text-blue-500 bg-blue-500/10",
              },
              {
                title: "Edit Profile",
                desc: "Update restaurant info",
                icon: ChefHat,
                href: "/dashboard/profile",
                color: "text-emerald-500 bg-emerald-500/10",
              },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-3 p-3.5 rounded-xl hover:bg-muted transition-all"
              >
                <div className={`p-2.5 rounded-xl ${action.color}`}>
                  <action.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-orange-500 transition-colors truncate">
                    {action.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight
                  size={14}
                  className="text-muted-foreground group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════
          RECENT ORDERS TABLE
      ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-5 md:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Calendar size={16} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">Recent Orders</h3>
              <p className="text-[11px] text-muted-foreground">
                Last {Math.min(orders.length, 5)} of {orders.length} total
                orders
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-bold border-b border-border">
                <th className="px-5 md:px-6 py-3.5">Order ID</th>
                <th className="px-5 md:px-6 py-3.5">Customer</th>
                <th className="px-5 md:px-6 py-3.5">Items</th>
                <th className="px-5 md:px-6 py-3.5">Status</th>
                <th className="px-5 md:px-6 py-3.5">Amount</th>
                <th className="px-5 md:px-6 py-3.5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => {
                const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = config.icon;
                return (
                  <tr
                    key={order.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 md:px-6 py-4">
                      <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {order.customer?.name || "—"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin size={10} />
                          {order.deliveryAddress?.slice(0, 25)}
                          {(order.deliveryAddress?.length || 0) > 25
                            ? "..."
                            : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <span className="text-xs font-bold text-muted-foreground">
                        {order.orderItems?.length || 0} items
                      </span>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase ${config.bg} ${config.color} border border-transparent`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                        />
                        {order.status.replace(/_/g, " ")}
                      </div>
                    </td>
                    <td className="px-5 md:px-6 py-4">
                      <span className="text-sm font-black tabular-nums">
                        ৳{Number(order.totalAmount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 md:px-6 py-4 text-right">
                      <span className="text-xs font-semibold text-muted-foreground">
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
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <motion.div
                      className="flex flex-col items-center gap-4 opacity-50"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.5 }}
                    >
                      <div className="p-6 bg-muted rounded-2xl">
                        <ShoppingCart size={48} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold">No orders yet</p>
                        <p className="text-sm text-muted-foreground">
                          Orders will appear here once customers start ordering!
                        </p>
                      </div>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          MENU OVERVIEW
      ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-5 md:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <UtensilsCrossed size={16} className="text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm md:text-base">Menu Overview</h3>
              <p className="text-[11px] text-muted-foreground">
                {availableMeals} available • {unavailableMeals} unavailable
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/menu"
            className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
          >
            Manage Menu →
          </Link>
        </div>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 md:p-6">
            {meals.slice(0, 6).map((meal) => (
              <div
                key={meal.id}
                className="group flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-border hover:bg-muted/30 transition-all"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                  {meal.imageUrl ? (
                    <img
                      src={meal.imageUrl}
                      alt={meal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UtensilsCrossed
                        size={20}
                        className="text-muted-foreground"
                      />
                    </div>
                  )}
                  {!meal.isAvailable && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase">
                        Off
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate group-hover:text-orange-500 transition-colors">
                    {meal.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-orange-500 tabular-nums">
                      ৳{Number(meal.price).toLocaleString()}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        meal.isAvailable
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-rose-500/10 text-rose-500"
                      }`}
                    >
                      {meal.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center gap-3 opacity-50">
              <UtensilsCrossed size={40} strokeWidth={1.5} />
              <div>
                <p className="font-bold">No menu items yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by adding your first meal!
                </p>
              </div>
              <Link
                href="/dashboard/menu"
                className="mt-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Add Your First Meal
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {meals.length > 6 && (
          <div className="px-6 pb-4 text-center">
            <Link
              href="/dashboard/menu"
              className="text-xs font-bold text-muted-foreground hover:text-orange-500 transition-colors"
            >
              + {meals.length - 6} more items in your menu
            </Link>
          </div>
        )}
      </motion.section>
    </div>
  );
}
