"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { userRole } from "@/constants/allType";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  UserCheck,
  Layers,
  UtensilsCrossed,
  User,
  ChefHat,
  Package,
  Home,
  LogOut,
  Settings,
  TrendingUp,
  Compass,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const adminRoutes: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/dashboard/analytics", icon: TrendingUp },
    ],
  },
  {
    title: "Management",
    items: [
      { title: "Users", url: "/dashboard/user", icon: Users },
      { title: "Providers", url: "/dashboard/providers", icon: UserCheck },
      { title: "Orders", url: "/dashboard/orders", icon: ShoppingCart },
      { title: "Categories", url: "/dashboard/categories", icon: Layers },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

const providerRoutes: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Restaurant",
    items: [
      { title: "Menu Items", url: "/dashboard/menu", icon: UtensilsCrossed },
      { title: "Orders", url: "/dashboard/orders", icon: Package },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

const customerRoutes: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Orders",
    items: [
      { title: "My Orders", url: "/dashboard/orders", icon: Package },
      { title: "Explore Menu", url: "/meals", icon: Compass },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },
];

function getRoutes(role?: string): NavGroup[] {
  if (role === userRole.admin) return adminRoutes;
  if (role === userRole.provider) return providerRoutes;
  if (role === userRole.customer) return customerRoutes;
  return customerRoutes;
}

function getRoleBadge(role?: string) {
  if (role === userRole.admin)
    return { label: "Admin", color: "bg-red-500/15 text-red-400 border-red-500/20" };
  if (role === userRole.provider)
    return { label: "Provider", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" };
  return { label: "Customer", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" };
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

export function AppSidebar({
  role,
  userName,
  userEmail,
  userImage,
  ...props
}: AppSidebarProps) {
  const pathname = usePathname();
  const routes = getRoutes(role);
  const badge = getRoleBadge(role);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <Sidebar {...props}>
      {/* ─── Header / Branding ─── */}
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="px-3 py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:shadow-orange-600/40 group-hover:scale-105 transition-all">
              <ChefHat size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight leading-none">
                Food<span className="text-orange-500">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase mt-0.5">
                {badge.label} Panel
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      {/* ─── Navigation ─── */}
      <SidebarContent className="px-1 py-2">
        {routes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-1">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/dashboard" &&
                      pathname.startsWith(item.url));

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`
                          group/item relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                          ${
                            isActive
                              ? "bg-orange-500/10 text-orange-500 font-bold shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <div
                            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? "bg-orange-500/15 text-orange-500"
                                : "text-muted-foreground group-hover/item:text-foreground"
                            }`}
                          >
                            <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                          </div>
                          <span className="truncate">{item.title}</span>
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-orange-500 rounded-r-full" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Quick Links */}
        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <Link href="/" className="flex items-center gap-3 w-full">
                    <div className="p-1.5 rounded-lg">
                      <Home size={16} />
                    </div>
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ─── Footer / User Card ─── */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-3 py-4">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 flex-shrink-0 flex items-center justify-center shadow-md">
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {userName?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {userName || "User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {userEmail || "user@example.com"}
              </p>
            </div>
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${badge.color} flex-shrink-0`}
            >
              {badge.label}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition-all active:scale-[0.98]"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
