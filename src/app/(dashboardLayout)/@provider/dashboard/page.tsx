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
  BarChart3,
  Calendar,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DateRangeSelector, DateRangeType } from "@/components/modules/dashboard/DateRangeSelector";
import { isWithinInterval, subDays, startOfDay, endOfDay } from "date-fns";
import RevenueChart from "@/components/modules/dashboard/RevenueChart";
import OrderStatusChart from "@/components/modules/dashboard/OrderStatusChart";
import TopMealsChart from "@/components/modules/dashboard/TopMealsChart";

/* ─── Status Config ─── */
const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: any; dot: string }
> = {
  PENDING: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock, dot: "bg-amber-500" },
  CONFIRMED: { color: "text-blue-500", bg: "bg-blue-500/10", icon: CheckCircle2, dot: "bg-blue-500" },
  PREPARING: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Package, dot: "bg-purple-500" },
  OUT_FOR_DELIVERY: { color: "text-orange-500", bg: "bg-orange-500/10", icon: TrendingUp, dot: "bg-orange-500" },
  DELIVERED: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2, dot: "bg-emerald-500" },
  CANCELLED: { color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle, dot: "bg-rose-500" },
};

function ProviderDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

export default function ProviderDashboard() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRangeType>("7days");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, mealsData, profileData] = await Promise.allSettled([
          orderService.getProviderOrders(),
          providerServices.getMyMeals(),
          providerServices.getMyProfile(),
        ]);

        if (ordersData.status === "fulfilled") {
          setAllOrders(Array.isArray(ordersData.value) ? ordersData.value : []);
        }
        if (mealsData.status === "fulfilled") {
          setMeals(Array.isArray(mealsData.value) ? mealsData.value : []);
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

  /* ─── Filtering Logic ─── */
  const orders = allOrders.filter((order) => {
    if (dateRange === "all") return true;
    
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    
    let start;
    if (dateRange === "today") start = startOfDay(now);
    else if (dateRange === "7days") start = startOfDay(subDays(now, 7));
    else if (dateRange === "30days") start = startOfDay(subDays(now, 30));
    else if (dateRange === "90days") start = startOfDay(subDays(now, 90));
    else return true;

    return isWithinInterval(orderDate, { start, end: endOfDay(now) });
  });

  /* ─── Computed Stats ─── */
  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((acc, order) => acc + Number(order.totalAmount), 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const activeOrders = orders.filter(
    (o) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length;
  const availableMeals = meals.filter((m) => m.isAvailable).length;

  if (sessionLoading || loading) {
    return <ProviderDashboardSkeleton />;
  }

  const user = session?.user;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      {/* Welcome Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground">
                Chef <span className="text-primary">{user?.name?.split(" ")[0]}</span>'s Kitchen 🍳
              </h1>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                {profile?.businessName || "Your Restaurant"}
                {profile?.isVerified && (
                  <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DateRangeSelector 
            currentRange={dateRange} 
            onRangeChange={setDateRange} 
          />
          <Button variant="outline" className="rounded-xl font-bold" asChild>
            <Link href="/dashboard/orders">
              <Package size={16} className="mr-2" />
              All Orders
            </Link>
          </Button>
          <Button className="rounded-xl font-bold group" asChild>
            <Link href="/dashboard/menu">
              <UtensilsCrossed size={16} className="mr-2" />
              Manage Menu
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `৳${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            trend: "All-time earnings",
          },
          {
            label: "Total Orders",
            value: orders.length,
            icon: ShoppingCart,
            color: "text-primary",
            bg: "bg-primary/10",
            trend: `${activeOrders} in progress`,
          },
          {
            label: "Active Menu",
            value: meals.length,
            icon: UtensilsCrossed,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            trend: `${availableMeals} available`,
          },
          {
            label: "Pending",
            value: pendingOrders,
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            trend: "Action required",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-colors`}>
                    <stat.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black mt-1 tabular-nums">{stat.value}</p>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-muted-foreground">{stat.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart orders={orders} />
        <OrderStatusChart orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <TopMealsChart orders={orders} />
        </div>
        
        {/* Quick Actions Card */}
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <Star size={20} className="text-primary" />
              Quick Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
             {[
              { title: "Add New Meal", desc: "Create a menu item", icon: UtensilsCrossed, href: "/dashboard/menu", color: "text-primary bg-primary/10" },
              { title: "Active Orders", desc: "Check current tasks", icon: Package, href: "/dashboard/orders", color: "text-blue-500 bg-blue-500/10" },
              { title: "Earnings", desc: "Detailed overview", icon: DollarSign, href: "/dashboard/analytics", color: "text-emerald-500 bg-emerald-500/10" },
              { title: "Settings", desc: "Restaurant info", icon: ChefHat, href: "/dashboard/profile", color: "text-purple-500 bg-purple-500/10" },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-muted transition-all"
              >
                <div className={`p-3 rounded-xl ${action.color} transition-transform group-hover:scale-110`}>
                  <action.icon size={18} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate font-medium">{action.desc}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
        <CardHeader className="p-8 border-b border-border/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Calendar size={20} />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Incoming Orders</CardTitle>
                <CardDescription className="font-medium">Live view of customer requests</CardDescription>
              </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl font-bold" asChild>
            <Link href="/dashboard/orders">Full Order Manager</Link>
          </Button>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="border-b border-border/30">
                <TableHead className="px-8 py-5 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Order Reference</TableHead>
                <TableHead className="px-8 py-5 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Customer</TableHead>
                <TableHead className="px-8 py-5 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Status</TableHead>
                <TableHead className="px-8 py-5 text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Revenue</TableHead>
                <TableHead className="px-8 py-5 text-right text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black">Placed On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {orders.slice((currentPage - 1) * 5, currentPage * 5).map((order) => {
                const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                return (
                  <TableRow key={order.id} className="group hover:bg-primary/[0.02] transition-all border-border/30">
                    <TableCell className="px-8 py-6">
                      <span className="text-xs font-mono font-bold text-muted-foreground group-hover:text-foreground transition-colors uppercase">#{order.id.slice(-8)}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{order.customer?.name || "Customer"}</span>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin size={10} />
                          <span className="truncate max-w-[200px]">{order.deliveryAddress}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${config.bg} ${config.color} border border-current/10`}>
                        <config.icon size={12} strokeWidth={3} />
                        {order.status.replace(/_/g, " ")}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className="text-sm font-black text-foreground tabular-nums">৳{Number(order.totalAmount).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <span className="text-xs font-bold text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-50">
                      <div className="p-8 bg-muted rounded-[2.5rem]">
                        <Package size={80} strokeWidth={1} />
                      </div>
                      <p className="text-xl font-black">No orders yet</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Simple Pagination for Dashboard Summary */}
        {orders.length > 5 && (
          <div className="p-6 border-t border-border/30 flex justify-between items-center bg-muted/5">
            <p className="text-xs font-bold text-muted-foreground">
              Showing page {currentPage} of {Math.ceil(orders.length / 5)}
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-lg font-bold"
              >
                Prev
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= Math.ceil(orders.length / 5)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-lg font-bold"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
