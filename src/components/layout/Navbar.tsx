"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Sun, Moon, User, LayoutDashboard, LogOut } from "lucide-react";
import { useCart } from "@/lib/Cart-context";
import { useTheme } from "@/providers/ThemeProvider";

interface UserType {
  name: string;
  image?: string | null;
}

type NavMenu = {
  name: string;
  url: string;
};

export default function Navbar() {
  const navigationMenuList: NavMenu[] = [
    { name: "Home", url: "/" },
    { name: "Restaurants", url: "/restaurants" },
    { name: "About Hub", url: "/about" },
    { name: "Contact", url: "/contact" },
  ];

  const [user, setUser] = useState<UserType | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user ?? null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    setOpen(false);
  };

  return (
    <nav className="h-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* LEFT: Logo & Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:rotate-6 transition-transform">
              <span className="text-white font-black text-xl">F</span>
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter hidden sm:block">
              Food<span className="text-orange-600">Hub</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navigationMenuList.map((menu) => (
              <Link
                key={menu.url}
                href={menu.url}
                className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors uppercase tracking-widest px-2 py-1"
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-600/10 hover:text-orange-600 transition-all border border-transparent hover:border-orange-100 dark:hover:border-orange-600/20"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-600/10 hover:text-orange-600 transition-all group border border-transparent hover:border-orange-100 dark:hover:border-orange-600/20">
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center ring-4 ring-white dark:ring-gray-950">
                {count}
              </span>
            )}
          </Link>

          <div className="h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1 hidden sm:block" />

          {/* Auth Section */}
          {!user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-gray-500 dark:text-gray-400 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gray-900 dark:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-500 transition-all shadow-xl shadow-gray-900/10"
              >
                Join Now
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-orange-600">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-gray-900 dark:text-white line-clamp-1">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Member</p>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-4 w-60 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-800 py-2 text-sm z-50 overflow-hidden scale-in-95 animate-in fade-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                  </div>
                  <div className="p-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 font-bold group" onClick={() => setOpen(false)}>
                        <User size={18} className="text-gray-400 group-hover:text-orange-600" />
                        Profile Settings
                    </Link>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300 font-bold group" onClick={() => setOpen(false)}>
                        <LayoutDashboard size={18} className="text-gray-400 group-hover:text-orange-600" />
                        Dashboard
                    </Link>
                    <hr className="my-1 border-gray-100 dark:border-gray-800" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-600/10 transition-colors text-rose-500 font-bold group"
                    >
                        <LogOut size={18} className="text-rose-400" />
                        Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 p-6 space-y-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            {navigationMenuList.map((menu) => (
              <Link
                key={menu.url}
                href={menu.url}
                className="block text-xl font-black text-gray-900 dark:text-white hover:text-orange-600 transition-colors uppercase tracking-tighter"
                onClick={() => setMobileOpen(false)}
              >
                {menu.name}
              </Link>
            ))}
          </div>

          <hr className="border-gray-100 dark:border-gray-900" />

          {!user ? (
             <div className="grid grid-cols-2 gap-4">
                <Link href="/login" className="flex items-center justify-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/signup" className="flex items-center justify-center py-4 rounded-2xl font-black uppercase text-xs tracking-widest bg-orange-600 text-white" onClick={() => setMobileOpen(false)}>Join Now</Link>
             </div>
          ) : (
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-600 relative">
                        {user.image ? <Image src={user.image} alt={user.name} fill /> : <div className="w-full h-full bg-orange-600 flex items-center justify-center text-white font-black">{user.name.charAt(0)}</div>}
                    </div>
                    <div>
                        <p className="font-black text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Active Account</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/profile" className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 font-bold text-xs" onClick={() => setMobileOpen(false)}>
                        <User size={16} /> Profile
                    </Link>
                    <Link href="/dashboard" className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-100 dark:border-gray-800 font-bold text-xs" onClick={() => setMobileOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                    </Link>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full py-4 rounded-2xl bg-rose-50 dark:bg-rose-600/10 text-rose-500 font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}