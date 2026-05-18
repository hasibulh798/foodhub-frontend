"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { providerServices } from "@/services/provider.service";
import { Star, MapPin, ArrowRight, Loader2, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string;
  isVerified: boolean;
}

export default function FeaturedRestaurantsSection() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await providerServices.getProviders();
        const restaurantData = Array.isArray(res) ? res : (res?.data || []);
        setRestaurants(restaurantData.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="relative py-24 bg-gradient-to-b from-[#FAF6F0]/30 to-[#FFF] dark:from-[#060606] dark:to-[#0a0a0a] overflow-hidden border-b border-gray-100/50 dark:border-zinc-900/50">
      {/* Premium glowing ambient light blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/5 dark:bg-orange-500/[0.03] rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-red-500/5 dark:bg-red-500/[0.02] rounded-full blur-[90px] -z-10 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        
        {/* Header Layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.25em] mb-4 border border-red-500/20"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Discover the Best
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-none sm:leading-tight"
            >
              Featured <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Restaurants</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-zinc-500 dark:text-zinc-400 text-base md:text-lg font-medium leading-relaxed max-w-xl"
            >
              From gourmet kitchens to local favorites, explore our hand-picked selection of top-rated eateries.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/restaurants">
              <Button variant="outline" className="rounded-xl px-7 py-5 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-200 transition-all bg-transparent font-black text-xs uppercase tracking-widest active:scale-95 shrink-0 shadow-sm">
                Explore All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Restaurants Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-zinc-400 font-black tracking-widest uppercase text-[10px]">Loading Excellence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-100 dark:border-zinc-800/80 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-red-500/30 dark:hover:border-red-500/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full">
                  
                  {/* Photo area */}
                  <div className="aspect-[16/10] w-full overflow-hidden relative bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50">
                    <img
                      src={restaurant.logoUrl || "/home/misc/restaurant.jpg"}
                      alt={restaurant.businessName}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      {restaurant.isVerified && (
                        <div className="bg-[#FFF] dark:bg-zinc-950 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                          <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
                          <span className="text-zinc-800 dark:text-zinc-200 text-[9px] font-black uppercase tracking-wider">Verified</span>
                        </div>
                      )}
                      
                      <div className="bg-[#FFF] dark:bg-zinc-950 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-zinc-100 dark:border-zinc-800 shadow-sm ml-auto">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-zinc-800 dark:text-zinc-200 text-[10px] font-black">4.9</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex-grow space-y-3">
                      <h3 className="text-2xl font-black text-zinc-850 dark:text-zinc-100 leading-tight group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                        {restaurant.businessName}
                      </h3>
                      <div className="flex items-center text-zinc-500 dark:text-zinc-400 text-xs gap-1.5 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-red-500/70" />
                        {restaurant.address}
                      </div>
                    </div>

                    {/* Styled Action Button */}
                    <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-6">
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black py-3 px-6 rounded-xl text-center transition-all shadow-md shadow-orange-500/15 hover:shadow-orange-500/30 flex items-center justify-center gap-2 group/btn text-xs uppercase tracking-widest active:scale-95"
                      >
                        Visit Kitchen
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {restaurants.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-dashed border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-500 dark:text-zinc-400 text-lg italic font-light">Join us as the first featured restaurant today!</p>
             <Link href="/signup">
              <Button variant="link" className="text-red-500 mt-2 font-bold uppercase tracking-widest text-xs">Partner with us</Button>
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}
