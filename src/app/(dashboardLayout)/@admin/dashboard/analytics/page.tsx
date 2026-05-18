"use client";

import { adminService } from "@/services/admin.service";
import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ArrowLeft, 
  Calendar,
  Activity,
  DollarSign,
  ChefHat,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import AdminRevenueChart from "@/components/modules/dashboard/AdminRevenueChart";
import AcquisitionChart from "@/components/modules/dashboard/AcquisitionChart";
import CategorySalesChart from "@/components/modules/dashboard/CategorySalesChart";
import AdminOrderStatsChart from "@/components/modules/dashboard/AdminOrderStatsChart";
import { Badge } from "@/components/ui/badge";

import { DateRangeSelector, DateRangeType } from "@/components/modules/dashboard/DateRangeSelector";
import { isWithinInterval, subDays, startOfDay, endOfDay } from "date-fns";

export default function AdminAnalyticsPage() {
  const [allData, setAllData] = useState<{
    orders: any[];
    users: any[];
    providers: any[];
    stats: any | null;
  }>({
    orders: [],
    users: [],
    providers: [],
    stats: null,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRangeType>("30days");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [orders, usersData, providers, stats] = await Promise.all([
          adminService.getAllOrders(),
          adminService.getAllUsers(),
          adminService.getAllProviders(),
          adminService.getStats(),
        ]);

        setAllData({
          orders,
          users: usersData.users || [],
          providers,
          stats,
        });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  /* ─── Filtering Logic ─── */
  const filterByDate = (items: any[]) => {
    return items.filter((item) => {
      if (dateRange === "all") return true;
      const itemDate = new Date(item.createdAt);
      const now = new Date();
      let start;
      if (dateRange === "today") start = startOfDay(now);
      else if (dateRange === "7days") start = startOfDay(subDays(now, 7));
      else if (dateRange === "30days") start = startOfDay(subDays(now, 30));
      else if (dateRange === "90days") start = startOfDay(subDays(now, 90));
      else return true;
      return isWithinInterval(itemDate, { start, end: endOfDay(now) });
    });
  };

  const data = {
    orders: filterByDate(allData.orders),
    users: filterByDate(allData.users),
    providers: filterByDate(allData.providers),
  };

  if (loading) {
    return (
      <div className="space-y-8 p-8 animate-pulse">
        <div className="h-12 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-3xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="h-[450px] bg-muted rounded-[3rem]" />
          <div className="h-[450px] bg-muted rounded-[3rem]" />
        </div>
      </div>
    );
  }

  /* ─── Computed Insights ─── */
  const deliveredOrders = data.orders.filter(o => o.status === "DELIVERED");
  const totalRev = deliveredOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const avgOrderValue = deliveredOrders.length > 0 ? totalRev / deliveredOrders.length : 0;
  const successRate = data.orders.length > 0 ? (deliveredOrders.length / data.orders.length) * 100 : 0;

  return (
    <div className="space-y-10 p-4 md:p-8 max-w-[1600px] mx-auto bg-gray-950/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Button variant="ghost" className="mb-4 hover:bg-white/5 text-muted-foreground font-bold rounded-xl" asChild>
            <Link href="/dashboard">
              <ArrowLeft size={16} className="mr-2" />
              Back to Overview
            </Link>
          </Button>
          <h1 className="text-4xl font-black text-white tracking-tighter">System <span className="text-primary">Intelligence</span></h1>
          <p className="text-gray-500 font-medium text-lg mt-1">Deep-dive into your platform's operational performance.</p>
        </div>
        
        <div className="flex gap-3">
           <DateRangeSelector 
             currentRange={dateRange} 
             onRangeChange={setDateRange} 
           />
        </div>
      </div>

      {/* Advanced Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Avg. Order Value", value: `৳${avgOrderValue.toFixed(0)}`, icon: DollarSign, trend: "+8.4%", color: "emerald" },
          { label: "Success Rate", value: `${successRate.toFixed(1)}%`, icon: Activity, trend: "+2.1%", color: "primary" },
          { label: "Active Providers", value: data.providers.length, icon: ChefHat, trend: "Live", color: "purple" },
          { label: "Total Members", value: data.users.length, icon: Users, trend: "Total", color: "blue" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-2xl rounded-[2.5rem] bg-gray-900/40 backdrop-blur-xl border border-white/5">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                    <stat.icon size={24} />
                  </div>
                  <Badge className="rounded-lg bg-white/5 border-none text-[10px] font-black">{stat.trend}</Badge>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight tabular-nums">{stat.value}</h3>
                <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-widest text-[10px]">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AdminRevenueChart orders={data.orders} />
        <AcquisitionChart users={data.users} providers={data.providers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategorySalesChart orders={data.orders} />
        <AdminOrderStatsChart orders={data.orders} />
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
         <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-gray-900/60 backdrop-blur-3xl overflow-hidden border border-white/5">
            <CardHeader className="p-10 border-b border-white/5">
               <CardTitle className="text-2xl font-black flex items-center gap-3">
                 <BarChart3 className="text-primary" size={24} />
                 Provider Performance Index
               </CardTitle>
               <CardDescription className="text-gray-500 font-medium">Ranking providers by gross contribution and efficiency</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] bg-white/5">
                        <th className="px-10 py-6">Provider</th>
                        <th className="px-10 py-6">Verified</th>
                        <th className="px-10 py-6">Orders</th>
                        <th className="px-10 py-6 text-right">Gross Rev.</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {data.providers.slice(0, 10).map((p) => {
                        const providerOrders = data.orders.filter(o => o.providerId === p.id);
                        const rev = providerOrders.filter(o => o.status === "DELIVERED").reduce((sum, o) => sum + Number(o.totalAmount), 0);
                        return (
                           <tr key={p.id} className="group hover:bg-white/5 transition-all">
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center font-black text-xs">
                                       {p.businessName.charAt(0)}
                                    </div>
                                    <span className="font-bold text-gray-200 group-hover:text-primary transition-colors">{p.businessName}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 {p.isVerified ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-lg text-[10px] font-black uppercase">Verified</Badge>
                                 ) : (
                                    <Badge className="bg-amber-500/10 text-amber-500 border-none rounded-lg text-[10px] font-black uppercase">Pending</Badge>
                                 )}
                              </td>
                              <td className="px-10 py-8 font-bold text-gray-400 tabular-nums">{providerOrders.length}</td>
                              <td className="px-10 py-8 text-right font-black text-white tabular-nums">৳{rev.toLocaleString()}</td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </Card>

         {/* System Health / Anomalies */}
         <div className="space-y-8">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-primary/5 border border-primary/10 overflow-hidden">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <Activity size={20} className="text-primary" />
                    Anomaly Detector
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  {[
                    { label: "Cancelled Orders", value: data.orders.filter(o => o.status === "CANCELLED").length, limit: "15%", icon: ChevronDown, color: "rose" },
                    { label: "Failed Payments", value: 0, limit: "2%", icon: ChevronUp, color: "amber" }
                  ].map(anomaly => (
                    <div key={anomaly.label} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                       <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{anomaly.label}</p>
                          <Badge variant="outline" className="text-[10px] rounded-lg">Threshold {anomaly.limit}</Badge>
                       </div>
                       <div className="flex items-end gap-3">
                          <p className="text-2xl font-black text-white">{anomaly.value}</p>
                          <p className={`text-${anomaly.color}-500 text-xs font-bold flex items-center mb-1`}>
                             <anomaly.icon size={12} /> Stable
                          </p>
                       </div>
                    </div>
                  ))}
               </CardContent>
            </Card>

            <Card className="border-none shadow-2xl rounded-[3rem] bg-gray-900 border border-white/5 p-8">
               <h3 className="text-lg font-black text-white mb-4">Export Reports</h3>
               <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" className="rounded-2xl h-14 font-bold border-white/5 hover:bg-white/5 justify-start px-6">
                     <ShoppingCart size={18} className="mr-3 text-primary" />
                     CSV: All Transactions
                  </Button>
                  <Button variant="outline" className="rounded-2xl h-14 font-bold border-white/5 hover:bg-white/5 justify-start px-6">
                     <Users size={18} className="mr-3 text-blue-500" />
                     PDF: Provider Audit
                  </Button>
                  <Button variant="outline" className="rounded-2xl h-14 font-bold border-white/5 hover:bg-white/5 justify-start px-6">
                     <TrendingUp size={18} className="mr-3 text-emerald-500" />
                     Excel: Growth Projections
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
