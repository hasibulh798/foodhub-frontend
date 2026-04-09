"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { providerServices } from "@/services/provider.service";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
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
        const data = await providerServices.getProviders();
        setRestaurants(data.slice(0, 3)); // Show top 3 featured
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Parallax-esque effect */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        
      />
      
      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider mb-4 border border-red-500/30"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Discover the Best
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white leading-tight"
            >
              Featured <span className="text-red-500">Restaurants</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 text-gray-300 text-lg md:text-xl font-light max-w-xl"
            >
              From gourmet kitchens to local favorites, explore our hand-picked selection of top-rated eateries.
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/restaurants">
              <Button variant="outline" className="rounded-full px-8 py-6 border-white/20 hover:bg-white/10 text-white transition-all bg-transparent backdrop-blur-sm">
                Explore All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            <p className="text-white/60 font-medium tracking-widest uppercase text-xs">Loading Excellence...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-red-500/50 hover:shadow-red-500/10 hover:-translate-y-2">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={restaurant.logoUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"}
                      alt={restaurant.businessName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-xs font-bold">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                          {restaurant.businessName}
                        </h3>
                        <div className="flex items-center text-gray-400 text-sm gap-1.5 font-light">
                          <MapPin className="w-3.5 h-3.5 text-red-500/70" />
                          {restaurant.address}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-6">
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-2xl text-center transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 group/btn"
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
          <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/10">
             <p className="text-white/60 text-lg italic font-light">Join us as the first featured restaurant today!</p>
             <Link href="/signup">
              <Button variant="link" className="text-red-500 mt-2 font-bold uppercase tracking-widest text-xs">Partner with us</Button>
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}

