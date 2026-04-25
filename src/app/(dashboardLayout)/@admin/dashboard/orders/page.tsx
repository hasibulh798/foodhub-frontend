"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order.service";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  AlertCircle,
  Calendar,
  User,
  Store,
  MapPin,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: any }> = {
  PENDING: { color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10", icon: Clock },
  CONFIRMED: { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10", icon: CheckCircle2 },
  PREPARING: { color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10", icon: Package },
  OUT_FOR_DELIVERY: { color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-500/10", icon: Truck },
  DELIVERED: { color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10", icon: CheckCircle2 },
  CANCELLED: { color: "text-red-600", bg: "bg-red-50 dark:bg-red-500/10", icon: AlertCircle },
};

export default function AdminOrderTracking() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => orderService.getMyOrders(), // Admin gets all orders via this endpoint
    refetchInterval: 30000, // Refresh every 30 seconds for real-time tracking
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.provider?.businessName?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!mounted) return null;

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Order Tracking</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Real-time monitoring of all platform transactions.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">System Live</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={<ShoppingCart className="text-blue-500" />} label="Total Orders" value={orders.length} />
        <StatsCard icon={<Clock className="text-amber-500" />} label="Pending" value={orders.filter((o: any) => o.status === "PENDING").length} />
        <StatsCard icon={<Truck className="text-orange-500" />} label="In Transit" value={orders.filter((o: any) => o.status === "OUT_FOR_DELIVERY").length} />
        <StatsCard icon={<CheckCircle2 className="text-emerald-500" />} label="Delivered" value={orders.filter((o: any) => o.status === "DELIVERED").length} />
      </div>

      <Card className="border-none shadow-2xl shadow-gray-200 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden rounded-[2.5rem]">
        <CardHeader className="border-b border-gray-50 dark:border-zinc-800 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-black flex items-center gap-3">
              <Package className="w-6 h-6 text-red-600" />
              Recent Orders
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search orders, customers..." 
                  className="pl-10 h-12 w-full sm:w-64 rounded-xl border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-12 px-6 rounded-xl border-gray-100 dark:border-zinc-800 gap-2 font-black text-xs uppercase tracking-widest">
                    <Filter className="w-4 h-4" />
                    {statusFilter === "ALL" ? "All Status" : statusFilter}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                  <DropdownMenuItem onClick={() => setStatusFilter("ALL")} className="rounded-xl font-bold">All Status</DropdownMenuItem>
                  {(Object.keys(statusConfig) as OrderStatus[]).map((status) => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)} className="rounded-xl font-bold">
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-50 dark:border-zinc-800">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Provider</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Total Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="px-8 py-6"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-8 w-24 rounded-full" /></td>
                        <td className="px-8 py-6 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                        <td className="px-8 py-6"><Skeleton className="h-8 w-8 mx-auto rounded-full" /></td>
                      </tr>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No orders found matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order: any) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={order.id} 
                        className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</p>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                <Calendar size={10} />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-black dark:text-white">{order.customer?.name || "Guest User"}</p>
                                <p className="text-[10px] font-bold text-gray-400">{order.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Store size={14} />
                            </div>
                            <div>
                                <p className="text-xs font-black dark:text-white">{order.provider?.businessName || "Unknown Kitchen"}</p>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 max-w-[150px] truncate">
                                    <MapPin size={8} />
                                    {order.provider?.address}
                                </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className="text-sm font-black text-gray-900 dark:text-white">৳{order.totalAmount}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{order.paymentMethod}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl p-2 w-48">
                              <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3">
                                <Eye className="w-4 h-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-xl font-bold gap-3 py-3 text-red-600">
                                <AlertCircle className="w-4 h-4" /> Flag Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))
                  )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.color} border border-current/10`}>
      <Icon size={12} className="shrink-0" />
      <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{status.replace(/_/g, " ")}</span>
    </div>
  );
}

function StatsCard({ icon, label, value }: { icon: any; label: string; value: number | string }) {
    return (
        <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-500">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-none mb-1">{label}</p>
                    <p className="text-2xl font-black dark:text-white leading-none">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
