"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/lib/Cart-context";
import { useTheme } from "@/providers/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Moon, ShoppingCart, Sun, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    { name: "Meals", url: "/meals" },
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* LEFT: Logo & Links */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-all">
              <span className="text-white font-black text-2xl">F</span>
            </div>
            <span className="text-2xl font-black tracking-tight hidden sm:block">
              Food<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navigationMenuList.map((menu) => (
              <Link
                key={menu.url}
                href={menu.url}
                className="relative text-sm font-bold text-muted-foreground hover:text-primary transition-colors py-2 group"
              >
                {menu.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            className="rounded-full"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          {/* Cart */}
          <Link href="/cart" className="relative group">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            </Button>
            {count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center ring-2 ring-background"
              >
                {count}
              </motion.span>
            )}
          </Link>

          <div className="hidden sm:block h-6 w-px bg-border mx-2" />

          {/* Auth Section */}
          {!user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="font-bold">
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild className="rounded-full font-bold shadow-md shadow-primary/20">
                <Link href="/signup">Join Now</Link>
              </Button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors group"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-64 glass-card rounded-2xl py-2 z-50 overflow-hidden origin-top-right shadow-2xl"
                  >
                    <div className="px-5 py-4 border-b border-border/50">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="font-bold truncate text-foreground">{user.name}</p>
                    </div>
                    <div className="p-1.5">
                      <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors text-foreground font-semibold group" onClick={() => setOpen(false)}>
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                            <User size={16} className="text-muted-foreground group-hover:text-primary" />
                          </div>
                          Profile Settings
                      </Link>
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/5 transition-colors text-foreground font-semibold group" onClick={() => setOpen(false)}>
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                            <LayoutDashboard size={16} className="text-muted-foreground group-hover:text-primary" />
                          </div>
                          Dashboard
                      </Link>
                      <hr className="my-1.5 border-border/50" />
                      <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-4 py-2.5 rounded-xl hover:bg-destructive/10 transition-colors text-destructive font-bold group"
                      >
                          <div className="p-2 rounded-lg bg-destructive/5 group-hover:bg-destructive/20 transition-colors">
                            <LogOut size={16} />
                          </div>
                          Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden rounded-xl"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden w-full bg-background border-b border-border overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4">
                {navigationMenuList.map((menu) => (
                  <Link
                    key={menu.url}
                    href={menu.url}
                    className="text-xl font-black text-foreground hover:text-primary transition-colors uppercase tracking-tight"
                    onClick={() => setMobileOpen(false)}
                  >
                    {menu.name}
                  </Link>
                ))}
              </div>

              <hr className="border-border" />

              {!user ? (
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" size="lg" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="default" size="lg" asChild onClick={() => setMobileOpen(false)}>
                      <Link href="/signup">Join Now</Link>
                    </Button>
                 </div>
              ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary relative">
                            {user.image ? <Image src={user.image} alt={user.name} fill /> : <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black">{user.name.charAt(0)}</div>}
                        </div>
                        <div>
                            <p className="font-black text-foreground">{user.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Active Member</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="lg" asChild onClick={() => setMobileOpen(false)} className="rounded-2xl">
                          <Link href="/profile" className="flex items-center gap-2">
                            <User size={16} /> Profile
                          </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild onClick={() => setMobileOpen(false)} className="rounded-2xl">
                          <Link href="/dashboard" className="flex items-center gap-2">
                            <LayoutDashboard size={16} /> Dashboard
                          </Link>
                        </Button>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="lg" 
                      onClick={handleLogout}
                      className="w-full rounded-2xl gap-2"
                    >
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}