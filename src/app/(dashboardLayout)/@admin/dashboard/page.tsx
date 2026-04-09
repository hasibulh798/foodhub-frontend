/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserRole, UserStatus } from "@/constants/allType";
import { adminService } from "@/services/admin.service";
import {
  CheckCircle,
  DollarSign,
  ShoppingCart,
  UserMinus,
  Users,
  Search,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  providerProfiles: {
    id: string;
    isVerified: boolean;
  };
};

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "providers">("users");

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminService.getStats(),
          adminService.getAllUsers()
        ]);
        // adminService.getStats() returns res.data
        setStats(statsRes);
        // adminService.getAllUsers() returns { users: res.data, ... }
        setUsers(usersRes.users || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      }
    }
    fetchData();
  }, []);

  const normalUsers = useMemo(() => 
    users.filter((u) => u.role === "CUSTOMER" && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))),
    [users, searchQuery]
  );

  const providers = useMemo(() => 
    users.filter((u) => u.role === "PROVIDER" && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase()))),
    [users, searchQuery]
  );

  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      setLoadingId(userId);
      await adminService.updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      toast.success(`User status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleVerifyProvider = async (providerId: string, isVerified: boolean) => {
    try {
      await adminService.verifyProvider(providerId, !isVerified);
      setUsers((prev) =>
        prev.map((u) =>
          u.providerProfiles?.id === providerId
            ? {
                ...u,
                providerProfiles: {
                  ...u.providerProfiles,
                  isVerified: !isVerified,
                },
              }
            : u
        )
      );
      toast.success(isVerified ? "Provider unverified" : "Provider verified");
    } catch {
      toast.error("Verification failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage users, providers and track system statistics.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Live
          </div>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue ?? 0}`}
          icon={<DollarSign className="w-5 h-5" />}
          description="+12.5% from last month"
          color="blue"
        />
        <MetricCard
          title="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={<ShoppingCart className="w-5 h-5" />}
          description="+8% increase"
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={users.filter(u => u.role === "CUSTOMER").length}
          icon={<Users className="w-5 h-5" />}
          description="48 new today"
          color="purple"
        />
        <MetricCard
          title="Verified Providers"
          value={users.filter(u => u.role === "PROVIDER" && u.providerProfiles?.isVerified).length}
          icon={<UserCheck className="w-5 h-5" />}
          description="92% conversion rate"
          color="amber"
        />
      </div>

      {/* ================= MANAGEMENT AREA ================= */}
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6">
          <div className="flex bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "users" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Customer Users
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "providers" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Service Providers
            </button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              className="pl-9 bg-background/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "users" ? (
                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b">
                        <th className="px-6 py-4 text-left">Customer</th>
                        <th className="px-6 py-4 text-left">Email</th>
                        <th className="px-6 py-4 text-left">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {normalUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4 font-medium">{u.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4">
                            <select
                              disabled={loadingId === u.id}
                              value={u.status}
                              onChange={(e) => handleStatusChange(u.id, e.target.value as UserStatus)}
                              className={`text-xs px-2 py-1 rounded-md border-none ring-1 bg-background focus:ring-primary outline-none transition-shadow ${
                                u.status === "ACTIVE" ? "text-green-500 ring-green-500/20" : 
                                u.status === "SUSPENDED" ? "text-red-500 ring-red-500/20" : "text-orange-500 ring-orange-500/20"
                              }`}
                            >
                              <option value="ACTIVE">Active</option>
                              <option value="SUSPENDED">Suspended</option>
                              <option value="INACTIVE">Inactive</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {normalUsers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                            No customers found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border/50">
                   <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b">
                        <th className="px-6 py-4 text-left">Provider</th>
                        <th className="px-6 py-4 text-left">ID</th>
                        <th className="px-6 py-4 text-left">Verification</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {providers.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-medium">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground">{p.email}</div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                            {p.providerProfiles?.id}
                          </td>
                          <td className="px-6 py-4">
                            {p.providerProfiles?.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                                <UserX className="w-3 h-3" /> Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                             <Button
                              variant="outline"
                              size="sm"
                              className={`h-8 ${p.providerProfiles?.isVerified ? "hover:bg-destructive/10 text-muted-foreground" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"}`}
                              onClick={() => handleVerifyProvider(p.providerProfiles?.id, !!p.providerProfiles?.isVerified)}
                            >
                              {p.providerProfiles?.isVerified ? "Unverify" : "Verify"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => adminService.deleteProvider(p.providerProfiles.id).then(() => setUsers(prev => prev.filter(u => u.id !== p.id)))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {providers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                            No providers found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, description, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-emerald-500 bg-emerald-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    amber: "text-amber-500 bg-amber-500/10",
  };

  return (
    <Card className="border-none shadow-lg overflow-hidden relative group">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              {description} <ArrowUpRight className="w-3 h-3 text-green-500" />
            </p>
          </div>
          <div className={`p-2 rounded-xl ${colors[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

