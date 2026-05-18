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
  Calendar,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  PENDING: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock },
  CONFIRMED: { color: "text-blue-500", bg: "bg-blue-500/10", icon: CheckCircle2 },
  PREPARING: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Package },
  OUT_FOR_DELIVERY: { color: "text-orange-500", bg: "bg-orange-500/10", icon: TrendingUp },
  DELIVERED: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  CANCELLED: { color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle },
};

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
        <Skeleton className="h-32 rounded-3xl" />
      </div>
      <Skeleton className="h-96 rounded-3xl" />
    </div>
  );
}

export default function CustomerDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
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
    return <DashboardSkeleton />;
  }

  const user = session?.user;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>! 🍔
          </h1>
          <p className="text-muted-foreground font-medium text-lg">What are we craving today?</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button size="lg" className="rounded-full font-bold px-8" asChild>
            <Link href="/meals">
              Explore Menu
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "primary" },
          { label: "Active Orders", value: activeOrders, icon: Clock, color: "orange" },
          { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "emerald" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300`}>
                    <stat.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black mt-1 tabular-nums">{stat.value}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-2 opacity-5">
                  <stat.icon size={80} strokeWidth={1} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Recent Activity */}
      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-border/50 bg-muted/20">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Calendar size={20} />
              </div>
              Recent Orders
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Track your most recent food adventures</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-bold" asChild>
            <Link href="/dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black border-b border-border/30">
                <th className="px-8 py-5">Order Reference</th>
                <th className="px-8 py-5">Restaurant</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {orders.slice(0, 5).map((order) => {
                const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="group hover:bg-primary/[0.02] transition-all">
                    <td className="px-8 py-6">
                      <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-tight">#{order.id.slice(-8)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{order.provider?.businessName || "Chef Delight"}</span>
                        <span className="text-[11px] text-muted-foreground">{order.orderItems?.length || 0} items ordered</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge 
                        variant="outline"
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border border-current/10",
                          config.bg, 
                          config.color
                        )}
                      >
                        <StatusIcon size={12} strokeWidth={3} className="mr-2" />
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-foreground tabular-nums">৳{Number(order.totalAmount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-xs font-bold text-muted-foreground">
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
                  <td colSpan={5} className="px-8 py-32 text-center text-muted-foreground">
                    <motion.div 
                      className="flex flex-col items-center gap-4"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="p-8 bg-muted rounded-[2.5rem] text-muted-foreground/30">
                        <ShoppingBag size={80} strokeWidth={1} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-black text-foreground">No orders yet</p>
                        <p className="text-sm font-medium">Your food journey starts here!</p>
                      </div>
                      <Button className="mt-4 rounded-full font-bold px-8" asChild>
                        <Link href="/meals">Start Ordering</Link>
                      </Button>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
