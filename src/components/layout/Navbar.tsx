"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface User {
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
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
  ];

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get session user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user ?? null);
    };
    getUser();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await authClient.signOut();
    setUser(null);
    setOpen(false);
  };

  return (
    <nav className="h-16 bg-amber-300 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.webp"
              alt="logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-lg font-medium">
            {navigationMenuList.map((menu) => (
              <Link
                key={menu.url}
                href={menu.url}
                className="hover:text-red-500 transition"
              >
                {menu.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {/* Desktop Auth */}
          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm hover:bg-red-600 transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="border border-red-500 text-red-500 px-4 py-2 rounded-full text-sm hover:bg-red-500 hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative hidden md:block">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                    {user.name.charAt(0)}
                  </div>
                )}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-44 bg-white shadow-lg rounded-xl py-2 text-sm">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-4 space-y-3">
          {navigationMenuList.map((menu) => (
            <Link
              key={menu.url}
              href={menu.url}
              className="block"
              onClick={() => setMobileOpen(false)}
            >
              {menu.name}
            </Link>
          ))}

          <hr />

          {!user ? (
            <>
              <Link
                href="/login"
                className="block text-red-500"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block text-red-500"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}