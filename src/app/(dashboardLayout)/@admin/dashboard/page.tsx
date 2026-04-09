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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await adminService.getStats();
        setStats(statsRes);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and performance metrics.</p>
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
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={<Users className="w-5 h-5" />}
          description="Active accounts"
          color="purple"
        />
        <MetricCard
          title="Verified Providers"
          value={stats?.verifiedProviders ?? 0}
          icon={<UserCheck className="w-5 h-5" />}
          description="Verified profiles"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Quick Management
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickLink
              title="Manage Users"
              description="View and update customer accounts"
              href="/dashboard/user"
              icon={<Users className="w-8 h-8 text-purple-500" />}
            />
            <QuickLink
              title="Manage Providers"
              description="Verify service providers"
              href="/dashboard/providers"
              icon={<UserCheck className="w-8 h-8 text-amber-500" />}
            />
            <QuickLink
              title="Manage Categories"
              description="Organize meal types"
              href="/dashboard/categories"
              icon={<Layers className="w-8 h-8 text-blue-500" />}
            />
             <QuickLink
              title="View Orders"
              description="Track system-wide orders"
              href="/dashboard/orders"
              icon={<ShoppingCart className="w-8 h-8 text-emerald-500" />}
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your system has seen a steady growth in both providers and customers this week.
              </p>
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-xl border-muted/50">
                   <div className="text-center">
                      <TrendingUp className="w-10 h-10 text-muted mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm font-medium">Chart visualization placeholder</p>
                   </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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

function QuickLink({ title, description, href, icon }: any) {
  return (
    <Link href={href}>
      <div className="p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-all group h-full">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-background shadow-sm group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
