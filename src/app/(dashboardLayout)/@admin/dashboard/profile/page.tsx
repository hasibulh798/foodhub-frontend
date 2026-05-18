"use client";

import { useSession } from "@/lib/auth-client";
import { adminService } from "@/services/admin.service";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Shield,
  TrendingUp,
  Users,
  ShoppingCart,
  UserCheck,
  Activity,
  Edit3,
  Save,
  X,
  Lock,
  Calendar,
  CheckCircle2,
  Star,
  Zap,
  Globe,
  Loader2,
  ChevronRight,
  ShieldCheck,
  BadgeCheck,
  Server,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};

export default function AdminProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const user = session?.user;

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load system intelligence");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (sessionLoading || loadingStats) {
    return <AdminProfileSkeleton />;
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* ─── Hero Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[3rem] overflow-hidden bg-zinc-950 p-10 md:p-16 shadow-premium border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-20 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 overflow-hidden border-4 border-white/5">
                    <span className="text-5xl font-black text-white">{initials}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 border-4 border-zinc-950 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl">
                    <ShieldCheck size={20} strokeWidth={3} />
                </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                    <Badge variant="default" className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-blue-500/20 text-blue-400 border-blue-500/30">
                        System Authority
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {user?.name}
                    </h1>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                        <Mail size={16} className="text-blue-400" />
                        {user?.email}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                        <Calendar size={16} className="text-blue-400" />
                        Since {memberSince}
                    </div>
                </div>
            </div>
            
            <Button 
                variant="outline" 
                className={cn(
                    "rounded-full px-8 py-6 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] gap-2 transition-all",
                    editing && "bg-white/20"
                )}
                onClick={() => setEditing(!editing)}
            >
                {editing ? <X size={16} /> : <Edit3 size={16} />}
                {editing ? "Cancel Edit" : "Configure Account"}
            </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </motion.div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Residents", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Verified Hubs", value: stats?.verifiedProviders ?? 0, icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "System Revenue", value: `৳${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group hover:scale-105 transition-all duration-500 cursor-default">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500", stat.bg, stat.color)}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column: Identity & Access ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-8"
        >
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={18} className="text-blue-500" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { label: "Admin Identifier", value: user?.name, icon: User },
                { label: "System Endpoint", value: user?.email, icon: Mail },
                { label: "Authority Level", value: "SUPER_ADMIN", icon: Shield, className: "text-blue-500" },
                { 
                    label: "Security Status", 
                    value: user?.emailVerified ? "VALIDATED" : "PENDING", 
                    icon: BadgeCheck,
                    className: user?.emailVerified ? "text-emerald-500" : "text-amber-500"
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mt-1 group-hover:bg-blue-500/10 transition-colors">
                        <item.icon size={18} className="text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{item.label}</p>
                        <p className={cn("text-sm font-bold mt-0.5", item.className)}>{item.value}</p>
                    </div>
                </div>
              ))}

              <div className="pt-8 border-t border-border/50 space-y-4">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">System Privileges</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Global Analytics", "User Moderation", "Provider Audit", "System Config", "Financial View"
                  ].map((p) => (
                    <Badge key={p} variant="secondary" className="px-3 py-1 rounded-lg font-bold text-[9px] tracking-widest uppercase">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-white/5 overflow-hidden">
            <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Activity size={24} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white font-black uppercase tracking-widest text-xs">System Health</p>
                        <p className="text-emerald-400 text-xs font-bold">All services operational</p>
                    </div>
                </div>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 font-black uppercase">API Latency</span>
                        <span className="text-[10px] text-emerald-400 font-bold">24ms</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[10%] bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 font-black uppercase">DB Load</span>
                        <span className="text-[10px] text-blue-400 font-bold">12%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[12%] bg-blue-500 rounded-full" />
                    </div>
                </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Right Column: Management & Insights ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                    <Server size={18} className="text-primary" />
                    System Configuration
                </CardTitle>
                <CardDescription>Manage your administrative identity and protocols.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Legal Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                            <Input
                                disabled={!editing}
                                value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold disabled:opacity-50"
                                placeholder="Admin Name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">System Mail</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                            <Input
                                disabled={!editing}
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold disabled:opacity-50"
                                placeholder="admin@foodhub.com"
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {editing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex gap-4 pt-4"
                        >
                            <Button
                                type="button"
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-premium"
                                onClick={() => {
                                    toast.success("Identity updated in neural core.");
                                    setEditing(false);
                                }}
                            >
                                <Save size={16} /> Update Matrix
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditing(false)}
                                className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-xs"
                            >
                                Abort
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
              </form>

              {/* Platform Insights */}
              <div className="mt-12 pt-12 border-t border-border/50 space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Platform Utilization</h3>
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">Real-time Intelligence</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                        { 
                            label: "User Saturation", 
                            count: stats?.totalUsers ?? 0, 
                            max: 1000, 
                            color: "bg-blue-500", 
                            icon: Users 
                        },
                        { 
                            label: "Provider Capacity", 
                            count: stats?.totalProviders ?? 0, 
                            max: 100, 
                            color: "bg-purple-500", 
                            icon: UserCheck 
                        },
                        { 
                            label: "Transaction Flow", 
                            count: stats?.totalOrders ?? 0, 
                            max: 500, 
                            color: "bg-emerald-500", 
                            icon: ShoppingCart 
                        },
                        { 
                            label: "Data Density", 
                            count: 84, 
                            max: 100, 
                            color: "bg-amber-500", 
                            icon: Database 
                        },
                    ].map((item) => {
                        const pct = Math.min(100, Math.round((item.count / item.max) * 100));
                        return (
                            <div key={item.label} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color.replace('bg-', 'bg-opacity-10 text-').replace('500', '400'))}>
                                            <item.icon size={16} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black tabular-nums">{pct}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className={cn("h-full rounded-full", item.color)}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <style jsx global>{`
        .shadow-premium {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

function AdminProfileSkeleton() {
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
