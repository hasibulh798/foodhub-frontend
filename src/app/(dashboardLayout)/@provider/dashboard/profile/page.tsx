"use client";

import { useSession } from "@/lib/auth-client";
import { providerServices } from "@/services/provider.service";
import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { ProviderProfile, Order } from "@/constants/allType";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Mail,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Clock,
  ShoppingBag,
  TrendingUp,
  Star,
  Package,
  Image as ImageIcon,
  BadgeCheck,
  AlertCircle,
  ChefHat,
  Truck,
  ShieldCheck,
  ChevronRight,
  Loader2,
  Banknote,
  User,
  Store
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";

const STATUS_CONFIG: Record<string, { variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"; label: string }> = {
  PENDING: { variant: "warning", label: "Pending" },
  CONFIRMED: { variant: "default", label: "Confirmed" },
  PREPARING: { variant: "secondary", label: "Preparing" },
  OUT_FOR_DELIVERY: { variant: "warning", label: "On the Way" },
  DELIVERED: { variant: "success", label: "Delivered" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
};

export default function ProviderProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user;

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    logoUrl: "",
    deliveryFee: 60,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileData, ordersData] = await Promise.allSettled([
        providerServices.getMyProfile(),
        orderService.getMyOrders(),
      ]);

      if (profileData.status === "fulfilled" && profileData.value) {
        setProfile(profileData.value);
        setForm({
          businessName: profileData.value.businessName,
          address: profileData.value.address,
          logoUrl: profileData.value.logoUrl ?? "",
          deliveryFee: Number(profileData.value.deliveryFee) || 60,
        });
      }
      if (ordersData.status === "fulfilled") {
        setOrders(ordersData.value || []);
      }
    } catch {
      toast.error("Failed to load profile intelligence");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating your brand identity...");
    setSaving(true);
    try {
      const updated = await providerServices.updateProfile({
        businessName: form.businessName,
        address: form.address,
        logoUrl: form.logoUrl || undefined,
        deliveryFee: Number(form.deliveryFee),
      });
      setProfile(updated);
      setEditing(false);
      toast.success("Brand updated successfully!", { id: toastId });
    } catch {
      toast.error("Process failed. Please try again.", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (loading || sessionLoading) {
    return <ProviderProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto">
                <AlertCircle size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-bold tracking-tight uppercase text-xs">Authentication Required</p>
        </div>
      </div>
    );
  }

  const initials =
    profile?.businessName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user.name?.charAt(0).toUpperCase() ||
    "P";

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((acc, o) => acc + Number(o.totalAmount), 0);
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* ─── Hero Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[3rem] overflow-hidden bg-zinc-950 p-10 md:p-16 shadow-premium border border-white/5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-20 flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 overflow-hidden border-4 border-white/5">
                    {form.logoUrl ? (
                        <Image
                            src={form.logoUrl}
                            alt={profile?.businessName || "Brand"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-5xl font-black text-white">{initials}</span>
                    )}
                </div>
                <div className={cn(
                    "absolute -bottom-2 -right-2 w-10 h-10 border-4 border-zinc-950 rounded-2xl flex items-center justify-center text-white shadow-xl",
                    profile?.isVerified ? "bg-emerald-500" : "bg-amber-500"
                )}>
                    {profile?.isVerified ? <CheckCircle2 size={20} strokeWidth={3} /> : <Clock size={20} strokeWidth={3} />}
                </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                    <Badge variant={profile?.isVerified ? "success" : "warning"} className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
                        {profile?.isVerified ? "Verified Partner" : "Pending Verification"}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {profile?.businessName || user.name}
                    </h1>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                        <Mail size={16} className="text-emerald-400" />
                        {user.email}
                    </div>
                    {profile?.address && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 text-sm font-bold">
                            <MapPin size={16} className="text-emerald-400" />
                            {profile.address}
                        </div>
                    )}
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
                {editing ? "Cancel Edit" : "Edit Profile"}
            </Button>
        </div>

        {/* Decorative background food image */}
        <div className="absolute inset-0 opacity-[0.07] grayscale pointer-events-none">
            <Image 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop" 
                alt="Restaurant" 
                fill 
                className="object-cover"
            />
        </div>
      </motion.div>

      {/* ─── Stats Row ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Volume", value: orders.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Incoming", value: pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Delivered", value: deliveredCount, icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
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
        {/* ─── Business Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-8"
        >
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Security & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {[
                { label: "Legal Name", value: user.name, icon: User },
                { label: "Digital Mail", value: user.email, icon: Mail },
                { 
                    label: "Verify Status", 
                    value: user.emailVerified ? "LEGITIMATE" : "UNVERIFIED", 
                    icon: BadgeCheck,
                    className: user.emailVerified ? "text-emerald-500" : "text-amber-500"
                },
                { label: "Platform Role", value: "PROVIDER", icon: ChefHat, className: "text-primary" },
                { label: "Logistics Fee", value: `৳${profile?.deliveryFee || 60}`, icon: Truck },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mt-1 group-hover:bg-emerald-500/10 transition-colors">
                        <item.icon size={18} className="text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{item.label}</p>
                        <p className={cn("text-sm font-bold mt-0.5", item.className)}>{item.value}</p>
                    </div>
                </div>
              ))}

              <div className="pt-8 border-t border-border/50 space-y-4">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Recognition</p>
                <div className="flex flex-wrap gap-3">
                  {deliveredCount >= 1 && (
                    <Badge variant="success" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <Star size={12} /> Grand Opening
                    </Badge>
                  )}
                  {deliveredCount >= 10 && (
                    <Badge variant="default" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <TrendingUp size={12} /> Rising Star
                    </Badge>
                  )}
                  {profile?.isVerified && (
                    <Badge variant="secondary" className="px-3 py-1.5 rounded-xl font-bold text-[9px] tracking-widest uppercase gap-1.5">
                      <BadgeCheck size={12} /> Certified Gourmet
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Edit Form / Business Control ─── */}
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
                    <Building2 size={18} className="text-primary" />
                    Brand Management
                </CardTitle>
                <CardDescription>Configure your restaurant profile and logistics.</CardDescription>
              </div>
              {editing && (
                <Badge variant="warning" className="rounded-full animate-pulse">Live Editing</Badge>
              )}
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Business Identity</label>
                        <div className="relative group">
                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                            <Input
                                required
                                disabled={!editing}
                                value={form.businessName}
                                onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold disabled:opacity-50"
                                placeholder="Gourmet Kitchen"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Logistics Fee (BDT)</label>
                        <div className="relative group">
                            <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                            <Input
                                required
                                type="number"
                                disabled={!editing}
                                value={form.deliveryFee}
                                onChange={(e) => setForm((p) => ({ ...p, deliveryFee: Number(e.target.value) }))}
                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold disabled:opacity-50"
                                placeholder="60"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Physical Address</label>
                    <div className="relative group">
                        <MapPin className="absolute left-4 top-6 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                        <textarea
                            required
                            rows={3}
                            disabled={!editing}
                            value={form.address}
                            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/30 border-border/50 focus:bg-background outline-none transition-all font-bold disabled:opacity-50 resize-none text-sm border focus:ring-4 focus:ring-primary/10"
                            placeholder="Complete operating address..."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Brand Logo Asset</label>
                    <div className="flex gap-4">
                        <div className="relative flex-1 group">
                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                            <Input
                                disabled={!editing}
                                value={form.logoUrl}
                                onChange={(e) => setForm((p) => ({ ...p, logoUrl: e.target.value }))}
                                className="h-14 pl-12 rounded-2xl bg-muted/30 border-border/50 focus:bg-background transition-all font-bold disabled:opacity-50"
                                placeholder="https://..."
                            />
                        </div>
                        {form.logoUrl && (
                            <div className="shrink-0 w-14 h-14 rounded-2xl overflow-hidden border border-border shadow-xl">
                                <img src={form.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                        )}
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
                                type="submit"
                                disabled={saving}
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 shadow-premium"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
                                Synchronize Identity
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditing(false)}
                                className="h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-xs"
                            >
                                Revert
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
              </form>

              {/* Order History Preview */}
              <div className="mt-12 pt-12 border-t border-border/50 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Recent Transactions</h3>
                    <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest h-8" asChild>
                        <Link href="/provider/dashboard/orders">View All <ChevronRight size={12} className="ml-1" /></Link>
                    </Button>
                </div>
                
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="py-12 text-center opacity-30">
                        <ShoppingBag size={32} className="mx-auto mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Activity Yet</p>
                    </div>
                  ) : (
                    orders.slice(0, 3).map((order) => {
                        const config = STATUS_CONFIG[order.status] || { variant: "outline", label: order.status };
                        return (
                            <div key={order.id} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-border/30 hover:border-primary/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Package size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest">#{order.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()} · {order.orderItems?.length} ITEMS
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <p className="text-sm font-black tabular-nums">৳{Number(order.totalAmount).toLocaleString()}</p>
                                    <Badge variant={config.variant} className="px-2 py-1 rounded-lg text-[8px] font-black tracking-widest uppercase">
                                        {config.label}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })
                  )}
                </div>
              </div>
            </CardContent>
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

function ProviderProfileSkeleton() {
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
