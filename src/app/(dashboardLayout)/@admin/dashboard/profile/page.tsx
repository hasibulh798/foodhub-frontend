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
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};

export default function AdminProfilePage() {
  const { data: session, isPending } = useSession();
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
        toast.error(err.message || "Failed to load stats");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (isPending || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/20" />
          <p className="text-gray-400 animate-pulse font-medium">
            Loading admin profile...
          </p>
        </div>
      </div>
    );
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

  const statsRows = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Providers",
      value: stats?.totalProviders ?? 0,
      icon: UserCheck,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* ─── Hero Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-indigo-500/5 rounded-full translate-y-1/2 blur-3xl" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar with glowing ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg scale-110" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/30 border border-white/10">
                {initials}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
                <Shield size={11} className="text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {user?.name}
                </h1>
                <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                  <Shield size={11} /> Super Admin
                </span>
                {user?.emailVerified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-3">
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Mail size={13} className="text-blue-400" />
                  {user?.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full border border-white/10 flex items-center gap-1.5">
                  <Calendar size={10} /> Admin since {memberSince}
                </span>
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full border border-white/10 flex items-center gap-1.5">
                  <Globe size={10} /> Full Platform Access
                </span>
              </div>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                editing
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
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

      {/* ─── Stats ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statsRows.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`rounded-2xl border ${stat.border} ${stat.bg} p-5 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-default`}
          >
            <div
              className={`${stat.color} ${stat.bg} w-10 h-10 rounded-xl flex items-center justify-center`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {stat.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Profile Info / Edit ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          {/* Account Details */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <User size={15} className="text-blue-500" />
              Account Details
            </h2>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/60 transition"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                  <Save size={14} /> Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: User, label: "Name", value: user?.name },
                  { icon: Mail, label: "Email", value: user?.email },
                  {
                    icon: Shield,
                    label: "Role",
                    value: "ADMIN",
                    className: "text-blue-400",
                  },
                  {
                    icon: CheckCircle2,
                    label: "Email Verified",
                    value: user?.emailVerified ? "✓ Verified" : "✗ Not Verified",
                    className: user?.emailVerified
                      ? "text-emerald-400"
                      : "text-rose-400",
                  },
                  { icon: Calendar, label: "Member Since", value: memberSince },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2.5 border-b border-gray-800/60 last:border-0 group"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon
                        size={13}
                        className="text-gray-600 group-hover:text-blue-400 transition-colors"
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {item.label}
                      </span>
                    </div>
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
            )}
          </div>

          {/* Admin Privileges */}
          <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border border-blue-500/20 rounded-3xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={15} className="text-blue-400" />
              Admin Privileges
            </h2>
            <div className="space-y-2">
              {[
                "Manage Users & Status",
                "Verify Provider Profiles",
                "Manage Categories",
                "View All Orders",
                "Access System Stats",
                "Full Platform Control",
              ].map((priv) => (
                <div key={priv} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={10} className="text-blue-400" />
                  </div>
                  <span className="text-xs text-gray-400">{priv}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Right Column: Security + Activity ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* Security Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock size={15} className="text-blue-500" />
              Security & Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: "Two-Factor Auth",
                  status: "Not Configured",
                  statusColor: "text-amber-400",
                  bg: "bg-amber-500/5 border-amber-500/20",
                  icon: Shield,
                },
                {
                  label: "Last Login",
                  status: "Just Now",
                  statusColor: "text-emerald-400",
                  bg: "bg-emerald-500/5 border-emerald-500/20",
                  icon: Activity,
                },
                {
                  label: "Account Status",
                  status: "Active",
                  statusColor: "text-blue-400",
                  bg: "bg-blue-500/5 border-blue-500/20",
                  icon: CheckCircle2,
                },
                {
                  label: "Session",
                  status: "Secure",
                  statusColor: "text-emerald-400",
                  bg: "bg-emerald-500/5 border-emerald-500/20",
                  icon: Lock,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border p-4 ${item.bg} flex items-center gap-3`}
                >
                  <div className="w-9 h-9 rounded-xl bg-gray-800/50 flex items-center justify-center shrink-0">
                    <item.icon size={16} className={item.statusColor} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {item.label}
                    </p>
                    <p className={`text-sm font-bold ${item.statusColor}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={15} className="text-blue-500" />
              Platform Overview
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: "Users Registered",
                  count: stats?.totalUsers ?? 0,
                  max: 100,
                  color: "bg-blue-500",
                  textColor: "text-blue-400",
                },
                {
                  label: "Providers Active",
                  count: stats?.verifiedProviders ?? 0,
                  max: stats?.totalProviders || 1,
                  color: "bg-emerald-500",
                  textColor: "text-emerald-400",
                },
                {
                  label: "Orders Completed",
                  count: stats?.totalOrders ?? 0,
                  max: stats?.totalOrders || 1,
                  color: "bg-purple-500",
                  textColor: "text-purple-400",
                },
              ].map((item) => {
                const pct = Math.min(
                  100,
                  Math.round((item.count / item.max) * 100)
                );
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">
                        {item.label}
                      </span>
                      <span className={`text-xs font-black ${item.textColor}`}>
                        {item.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Badges */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-4">
              Admin Achievements
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Platform Guardian",
                  icon: Shield,
                  color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                },
                {
                  label: "Data Curator",
                  icon: Star,
                  color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                },
                {
                  label: "System Operator",
                  icon: Zap,
                  color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                },
                {
                  label: "Full Access",
                  icon: Globe,
                  color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${badge.color}`}
                >
                  <badge.icon size={11} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
