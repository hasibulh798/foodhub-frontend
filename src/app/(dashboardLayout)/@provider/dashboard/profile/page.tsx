"use client";

import { useSession } from "@/lib/auth-client";
import { providerServices } from "@/services/provider.service";
import { orderService } from "@/services/order.service";
import { useEffect, useState } from "react";
import type { ProviderProfile, Order } from "@/constants/allType";
import toast from "react-hot-toast";
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
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || sessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-orange-500/20" />
          <p className="text-gray-400 animate-pulse font-medium">
            Loading provider profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Please sign in to view your profile.</p>
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
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* ─── Hero Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-amber-600/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />

        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo / Avatar */}
            <div className="relative">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt={profile?.businessName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-orange-500/30 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-orange-500/20">
                  {initials}
                </div>
              )}
              <div
                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center ${
                  profile?.isVerified ? "bg-emerald-500" : "bg-amber-500"
                }`}
              >
                {profile?.isVerified ? (
                  <CheckCircle2 size={12} className="text-white" />
                ) : (
                  <Clock size={12} className="text-white" />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {profile?.businessName || user.name}
                </h1>
                {profile?.isVerified ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                    <BadgeCheck size={12} /> Verified Provider
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                    <AlertCircle size={12} /> Pending Verification
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-3">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Mail size={13} className="text-orange-400" />
                  {user.email}
                </p>
                {profile?.address && (
                  <p className="text-gray-400 text-sm flex items-center gap-2">
                    <MapPin size={13} className="text-orange-400" />
                    {profile.address}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full border border-white/10 flex items-center gap-1">
                  <ChefHat size={10} /> Food Provider
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                editing
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
              }`}
            >
              {editing ? (
                <>
                  <X size={15} /> Cancel
                </>
              ) : (
                <>
                  <Edit3 size={15} /> Edit Profile
                </>
              )}
            </button>
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
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
          },
          {
            label: "Completed",
            value: deliveredCount,
            icon: Package,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
          },
          {
            label: "Total Revenue",
            value: `৳${totalRevenue.toLocaleString()}`,
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
        {/* ─── Edit / Info Card ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Account Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail size={15} className="text-orange-500" />
              Account Details
            </h2>
            <div className="space-y-3">
              {[
                { label: "Name", value: user.name },
                { label: "Email", value: user.email },
                {
                  label: "Email Verified",
                  value: user.emailVerified ? "✓ Verified" : "✗ Not Verified",
                  className: user.emailVerified
                    ? "text-emerald-400"
                    : "text-rose-400",
                },
                {
                  label: "Role",
                  value: "PROVIDER",
                  className: "text-orange-400",
                },
                {
                  label: "Delivery Fee",
                  value: `৳${profile?.deliveryFee || 60}`,
                  className: "text-orange-400",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-800/60 last:border-0"
                >
                  <span className="text-xs text-gray-500 font-medium">
                    {item.label}
                  </span>
                  <span
                    className={`text-sm font-semibold text-gray-200 ${
                      (item as any).className || ""
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div
            className={`rounded-2xl border p-5 ${
              profile?.isVerified
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-amber-500/5 border-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-3">
              {profile?.isVerified ? (
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <BadgeCheck size={20} className="text-emerald-400" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                  <AlertCircle size={20} className="text-amber-400" />
                </div>
              )}
              <div>
                <p
                  className={`text-sm font-bold ${
                    profile?.isVerified ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {profile?.isVerified
                    ? "Verified Provider"
                    : "Pending Verification"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {profile?.isVerified
                    ? "Your business is verified and active."
                    : "Admin review in progress."}
                </p>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">
              Achievements
            </p>
            <div className="flex flex-wrap gap-2">
              {deliveredCount >= 1 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                  <Star size={10} /> First Sale
                </span>
              )}
              {deliveredCount >= 10 && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">
                  <TrendingUp size={10} /> 10 Orders
                </span>
              )}
              {profile?.isVerified && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                  <BadgeCheck size={10} /> Verified
                </span>
              )}
              {deliveredCount === 0 && !profile?.isVerified && (
                <span className="text-xs text-gray-600 italic">
                  Complete your first order to earn badges!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ─── Business Info / Edit ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-5"
          >
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 size={15} className="text-orange-500" />
              Business Information
            </h2>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Business Name *
              </label>
              <input
                required
                disabled={!editing}
                value={form.businessName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, businessName: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition"
                placeholder="Your restaurant / business name"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Address *
              </label>
              <textarea
                required
                rows={3}
                disabled={!editing}
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition resize-none"
                placeholder="Full business address"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Logo URL
              </label>
              <div className="flex gap-3">
                <input
                  disabled={!editing}
                  value={form.logoUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, logoUrl: e.target.value }))
                  }
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  placeholder="https://your-logo-url.com/logo.png"
                />
                {form.logoUrl && (
                  <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-gray-700">
                    <img
                      src={form.logoUrl}
                      alt="logo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                {!form.logoUrl && (
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                    <ImageIcon size={16} className="text-gray-600" />
                  </div>
                )}
              </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                Delivery Fee (BDT) *
              </label>
              <div className="relative group">
                <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  required
                  type="number"
                  disabled={!editing}
                  value={form.deliveryFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, deliveryFee: Number(e.target.value) }))
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-200 outline-none focus:border-orange-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  placeholder="60"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1.5 ml-1">
                This fee will be charged to customers for each order from your restaurant.
              </p>
            </div>
            </div>

            {editing && (
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    if (profile) {
                      setForm({
                        businessName: profile.businessName,
                        address: profile.address,
                        logoUrl: profile.logoUrl ?? "",
                        deliveryFee: Number(profile.deliveryFee) || 60,
                      });
                    }
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-bold transition-colors"
                >
                  Discard
                </button>
              </div>
            )}
          </form>

          {/* Recent Orders */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag size={15} className="text-orange-500" />
                Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-gray-800/40">
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3 opacity-40">
                    <ShoppingBag size={24} className="text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500">No orders yet</p>
                </div>
              ) : (
                orders.slice(0, 5).map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-800/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {order.orderItems?.length || 0} items ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                          STATUS_COLORS[order.status] ||
                          "text-gray-400 bg-gray-800"
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
