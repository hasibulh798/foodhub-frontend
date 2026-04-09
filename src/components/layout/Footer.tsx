"use client";

import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  UtensilsCrossed 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-orange-600 rounded-xl shadow-lg shadow-orange-600/20 group-hover:rotate-12 transition-transform">
                <UtensilsCrossed size={24} className="text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                Food<span className="text-orange-600">Hub</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              Connecting you with the finest local kitchens and home chefs. 
              Fresh ingredients, authentic flavors, delivered with love.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-600/10 transition-all"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">
              Featured Menu
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Browse Menu", href: "/meals" },
                { name: "Top Restaurants", href: "/restaurants" },
                { name: "Special Offers", href: "#" },
                { name: "Track Order", href: "/dashboard/orders" },
                { name: "New Arrivals", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Our Story", href: "/about" },
                { name: "Contact Support", href: "/contact" },
                { name: "Terms & Conditions", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Join as Provider", href: "/register?role=PROVIDER" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-500 text-sm font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">
              Download App
            </h4>
            <div className="space-y-4">
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Get special discounts only on our mobile app.
                </p>
                <div className="space-y-3">
                    <button className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl shadow-gray-900/10">
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-bold leading-none mb-1">Download on the</p>
                            <p className="text-sm font-black leading-none">App Store</p>
                        </div>
                    </button>
                    <button className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl shadow-gray-900/10">
                        <div className="text-left">
                            <p className="text-[10px] uppercase font-bold leading-none mb-1">Get it on</p>
                            <p className="text-sm font-black leading-none">Google Play</p>
                        </div>
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-semibold tabular-nums uppercase tracking-widest">
            © {currentYear} FoodHub Technologies Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
            Made with <Heart size={14} className="text-rose-500 fill-rose-500" /> in Nature
          </div>
        </div>
      </div>
    </footer>
  );
}
