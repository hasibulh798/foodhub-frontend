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
  ShieldCheck,
  ChevronRight,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; label: string }> = {
  PENDING: { variant: "warning", label: "Pending" },
  CONFIRMED: { variant: "default", label: "Confirmed" },
  PREPARING: { variant: "secondary", label: "Preparing" },
  OUT_FOR_DELIVERY: { variant: "warning", label: "On the Way" },
  DELIVERED: { variant: "success", label: "Delivered" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
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
    return <CustomerProfileSkeleton />;
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
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* ─── Hero Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[3rem] overflow-hidden bg-zinc-950 p-10 md:p-16 shadow-premium border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-20 flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-5xl font-black text-white shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              {initials}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-950 border-4 border-zinc-950 rounded-2xl flex items-center justify-center text-primary shadow-xl">
              <ShieldCheck size={20} strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
                <Badge variant="success" className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">Verified Account</Badge>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {user?.name}
                </h1>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                <Mail size={16} className="text-primary" />
                {user?.email}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                <Calendar size={16} className="text-primary" />
                Member Since {memberSince}
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="rounded-full px-8 py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] gap-2"
            onClick={() => setEditing(!editing)}
          >
            {editing ? <X size={16} /> : <Edit3 size={16} />}
            {editing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Decorative Background Image */}
        <div className="absolute inset-0 opacity-10 grayscale hover:grayscale-0 transition-all duration-1000">
            <Image 
                src="https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=2070&auto=format&fit=crop" 
                alt="Background" 
                fill 
                className="object-cover"
            />
        </div>
      </motion.div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Now", value: activeCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Successful", value: deliveredCount, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group hover:scale-105 transition-all duration-500 cursor-default overflow-hidden relative">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110", stat.bg, stat.color)}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-3xl font-black tabular-nums tracking-tighter text-foreground group-hover:text-primary transition-colors">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </CardContent>
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-current opacity-[0.03] rounded-full blur-2xl group-hover:opacity-[0.07] transition-opacity" />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Profile Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <User size={18} className="text-primary" />
                Profile Identity
              </CardTitle>
              <CardDescription>Personal details and contact info.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <AnimatePresence mode="wait">
                {editing ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Identity</label>
                        <Input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Phone</label>
                        <Input
                            value={form.phone}
                            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                            className="h-14 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold"
                            placeholder="+880..."
                        />
                    </div>
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-premium hover:shadow-primary/20">
                      <Save size={16} /> Update Identity
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="view-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {[
                      { icon: User, label: "Identity", value: user?.name || "—" },
                      { icon: Mail, label: "Electronic Mail", value: user?.email || "—" },
                      { icon: Phone, label: "Phone Line", value: (user as any)?.phone || "Not set" },
                      { icon: MapPin, label: "Main Address", value: (user as any)?.address || "No address provided" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mt-1 group-hover:bg-primary/10 transition-colors">
                          <item.icon size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                            {item.label}
                          </p>
                          <p className="text-sm text-foreground font-bold mt-0.5">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Achievements Badges */}
              <div className="pt-8 border-t border-border/50 space-y-4">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">
                  Culinary Milestones
                </p>
                <div className="flex flex-wrap gap-3">
                  {deliveredCount >= 1 && (
                    <Badge variant="success" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <Award size={12} /> First Taste
                    </Badge>
                  )}
                  {deliveredCount >= 5 && (
                    <Badge variant="warning" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <Star size={12} /> Regular Patron
                    </Badge>
                  )}
                  {totalSpent >= 1000 && (
                    <Badge variant="default" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <TrendingUp size={12} /> Epicurean Elite
                    </Badge>
                  )}
                  {deliveredCount === 0 && (
                    <p className="text-[10px] text-muted-foreground italic">
                      Start your journey to earn badges!
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Recent Orders ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" />
                Culinary Log
              </CardTitle>
              <CardDescription>Your most recent flavor experiences.</CardDescription>
            </CardHeader>
            <div className="divide-y divide-border/50 h-[500px] overflow-y-auto custom-scrollbar">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 text-center opacity-40">
                  <div className="w-24 h-24 bg-muted rounded-[2.5rem] flex items-center justify-center">
                    <ShoppingBag size={48} className="text-muted-foreground" strokeWidth={1} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-foreground uppercase tracking-tight">No History</p>
                    <p className="text-sm font-medium">Explore the menu to place your first order</p>
                  </div>
                  <Button className="rounded-full px-8 font-black uppercase tracking-widest text-[10px]" asChild>
                    <Link href="/meals">Browse Menu</Link>
                  </Button>
                </div>
              ) : (
                orders.map((order, i) => {
                    const config = STATUS_CONFIG[order.status] || { variant: "outline", label: order.status };
                    return (
                        <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="px-8 py-6 flex items-center justify-between gap-6 hover:bg-muted/30 transition-all group"
                        >
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                                <Package size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                                    {order.provider?.businessName || "Chef Delight"}
                                </p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    #{order.id.slice(-8).toUpperCase()} · {order.orderItems?.length || 0} ITEMS
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</p>
                                <p className="text-sm font-black text-foreground tabular-nums">৳{Number(order.totalAmount).toLocaleString()}</p>
                            </div>
                            <Badge variant={config.variant} className="px-3 py-1.5 rounded-xl font-black text-[9px] tracking-widest uppercase">
                                {config.label}
                            </Badge>
                            <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        </motion.div>
                    );
                })
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 20px; }
      `}</style>
    </div>
  );
}

function CustomerProfileSkeleton() {
  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10">
      <Skeleton className="h-64 md:h-80 w-full rounded-[3rem]" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-[600px] lg:col-span-1 rounded-[2.5rem]" />
        <Skeleton className="h-[600px] lg:col-span-2 rounded-[2.5rem]" />
      </div>
    </div>
  );
}
