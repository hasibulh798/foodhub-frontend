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
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MapPin size={16} className="text-primary" />
                    <span>123 Culinary Ave, Food City</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Phone size={16} className="text-primary" />
                    <span>+880 1234 567890</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={16} className="text-primary" />
                    <span>concierge@foodhub.com</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-white hover:bg-primary transition-all shadow-sm"
                >
                  <Icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white mb-6">
              Culinary Journey
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Global Menu", href: "/meals" },
                { name: "Top Hubs", href: "/restaurants" },
                { name: "Special Offers", href: "#" },
                { name: "Track Order", href: "/dashboard/orders" },
                { name: "Join the Team", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-bold transition-all hover:translate-x-1 inline-block"
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
              Platform
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Our Manifesto", href: "/about" },
                { name: "Culinary Support", href: "/contact" },
                { name: "Trust & Safety", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Partner With Us", href: "/signup" },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-bold transition-all hover:translate-x-1 inline-block"
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
