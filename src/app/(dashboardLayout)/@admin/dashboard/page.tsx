/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { adminService } from "@/services/admin.service";
import {
  DollarSign,
  ShoppingCart,
  Users,
  UserCheck,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};

import AdminRevenueChart from "@/components/modules/dashboard/AdminRevenueChart";
import AdminOrderStatsChart from "@/components/modules/dashboard/AdminOrderStatsChart";
import AdminProviderPerformanceChart from "@/components/modules/dashboard/AdminProviderPerformanceChart";

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[450px] rounded-[2.5rem]" />
        <Skeleton className="h-[450px] rounded-[2.5rem]" />
      </div>
    </div>
  );
}

import { DateRangeSelector, DateRangeType } from "@/components/modules/dashboard/DateRangeSelector";
import { isWithinInterval, subDays, startOfDay, endOfDay } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeType>("7days");

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, ordersRes] = await Promise.allSettled([
          adminService.getStats(),
          adminService.getAllOrders()
        ]);

        if (statsRes.status === "fulfilled") {
           setStats(statsRes.value);
        }
        if (ordersRes.status === "fulfilled") {
           setAllOrders(ordersRes.value);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
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

  /* ─── Re-compute Stats based on filtered orders ─── */
  const filteredRevenue = orders
    .filter(o => o.status === "DELIVERED")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);
  
  const filteredOrdersCount = orders.length;


  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
                <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Control <span className="text-primary">Center</span>
              </h1>
              <p className="text-muted-foreground font-semibold flex items-center gap-2 mt-1">
                System Governance & Analytics
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="bg-emerald-500/10 text-emerald-500 px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center gap-3 border border-emerald-500/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Core Engine Live
          </div>
          <DateRangeSelector 
            currentRange={dateRange} 
            onRangeChange={setDateRange} 
          />
          <Button variant="outline" className="rounded-2xl border-gray-200 dark:border-gray-800 font-bold" onClick={() => window.location.reload()}>
            Refresh Dashboard
          </Button>
        </motion.div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value={`৳${(filteredRevenue).toLocaleString()}`}
          icon={<DollarSign size={20} />}
          description={dateRange === "all" ? "Total system earnings" : `Earnings: ${dateRange}`}
          color="emerald"
          index={0}
        />
        <MetricCard
          title="Orders"
          value={filteredOrdersCount}
          icon={<ShoppingCart size={20} />}
          description={dateRange === "all" ? "Total transactions" : `Transactions: ${dateRange}`}
          color="primary"
          index={1}
        />
        <MetricCard
          title="User Ecosystem"
          value={stats?.totalUsers ?? 0}
          icon={<Users size={20} />}
          description="Registered accounts"
          color="blue"
          index={2}
        />
        <MetricCard
          title="Partnerships"
          value={stats?.totalProviders ?? 0}
          icon={<UserCheck size={20} />}
          description="Onboarded providers"
          color="purple"
          index={3}
        />
      </div>

      {/* Primary Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminRevenueChart orders={orders} />
        <AdminOrderStatsChart orders={orders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance & Summary */}
        <div className="lg:col-span-2">
          <AdminProviderPerformanceChart orders={orders} />
        </div>

        {/* Quick Management Actions */}
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl">
          <CardHeader className="p-8 border-b border-border/30">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Activity size={20} />
              </div>
              Core Controls
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground">Admin-only operations</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <QuickLink
              title="User Management"
              desc="Account bans & permissions"
              href="/dashboard/user"
              icon={<Users className="text-blue-500" />}
              bg="bg-blue-500/10"
            />
            <QuickLink
              title="Provider Audits"
              desc="Verification workflow"
              href="/dashboard/providers"
              icon={<UserCheck className="text-purple-500" />}
              bg="bg-purple-500/10"
            />
            <QuickLink
              title="System Categories"
              desc="Taxonomy & menus"
              href="/dashboard/categories"
              icon={<Layers className="text-amber-500" />}
              bg="bg-amber-500/10"
            />
             <QuickLink
              title="Global Logs"
              desc="Review all transactions"
              href="/dashboard/orders"
              icon={<ShoppingCart className="text-primary" />}
              bg="bg-primary/10"
            />
          </CardContent>
        </Card>
      </div>

      {/* System Status Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-xl border border-primary/5">
          <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-2">
               <h3 className="text-2xl font-black">System Integrity Monitor</h3>
               <p className="text-muted-foreground font-medium max-w-2xl">
                 Your system is currently processing <span className="text-primary font-bold">{orders.filter(o => o.status !== "DELIVERED" && o.status !== "CANCELLED").length} active orders</span>. 
                 The last update was <span className="text-foreground font-bold">seconds ago</span>. All gateways are operational.
               </p>
            </div>
            <div className="flex gap-4">
               <Button className="rounded-2xl font-bold px-8 h-14 shadow-lg shadow-primary/20" asChild>
                 <Link href="/dashboard/analytics">
                   System Health Report
                 </Link>
               </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


function MetricCard({ title, value, icon, description, color, index }: any) {
  const colorMap: any = {
    primary: "text-primary bg-primary/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    blue: "text-blue-500 bg-blue-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
    >
        <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">{title}</p>
                        <p className="text-2xl font-black mt-1 tabular-nums">{value}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="flex items-center text-emerald-500 text-[10px] font-bold">
                        <ArrowUpRight size={12} />
                        <span>12%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">{description}</p>
                </div>
                <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12">
                   {icon}
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
}

function QuickLink({ title, desc, href, icon, bg }: any) {
  return (
    <Link href={href}>
      <div className="p-5 rounded-3xl border border-border/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all group h-full relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-3 rounded-2xl ${bg} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="space-y-0.5">
            <h3 className="font-black text-sm group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-[11px] font-medium text-muted-foreground">{desc}</p>
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 transition-all">
            <ChevronRight size={18} className="text-primary" />
        </div>
      </div>
    </Link>
  )
}
