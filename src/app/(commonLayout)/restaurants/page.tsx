"use client";

import RestaurantCard from "@/components/modules/resturant/ResturantCard";
import { providerServices } from "@/services/provider.service";
import { Search, UtensilsCrossed, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Provider = {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string | null;
  isVerified: boolean;
};

export default function RestaurantsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // We now filter for verified providers at the API level
        const res = await providerServices.getProviders({ 
          page, 
          limit: 12,
          isVerified: true,
          search: search || undefined
        });
        
        const providerData = res?.data || [];
        setProviders(providerData);
        setTotalPages(res?.totalPages || 1);
        setTotalCount(res?.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, search]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors">

      {/* HERO SECTION */}
      <section className="relative bg-zinc-900 py-32 px-4 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-0" />
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-0" />
         
        <div className="max-w-7xl mx-auto text-center relative z-10">

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-orange-500/20"
          >
            <UtensilsCrossed size={14} />
            Exclusive Dining Experience
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]"
          >
            Discover Local <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Culinary Masters
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto font-medium"
          >
            From heritage kitchens to modern bistros, find the finest flavors delivered to your doorstep with precision.
          </motion.p>

          {/* Search */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 p-3 rounded-[2rem] shadow-2xl gap-3">
              <div className="flex-1 flex items-center px-4 gap-4">
                <Search className="text-orange-500" size={24} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1); // Reset to first page on search
                  }}
                  placeholder="Search by restaurant name or location..." 
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-500 font-bold py-4 text-lg"
                />
              </div>

              <div className="hidden md:block w-[1px] h-10 bg-zinc-700" />

              <div className="px-6 flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                <Store size={16} />
                {totalCount} Partners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-24">

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16">
          <div>
            <div className="h-1 w-20 bg-orange-600 mb-6" />
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              Verified Partners
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">
              Showing {providers.length} of {totalCount} premium kitchens
            </p>
          </div>

          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-2xl border border-gray-200 dark:border-zinc-800">
            <button className="px-6 py-3 bg-white dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white shadow-sm">
              All Partners
            </button>
            <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Nearest
            </button>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-96 bg-gray-100 dark:bg-zinc-900 animate-pulse rounded-[3rem]" />
            ))}
          </div>

        ) : providers.length === 0 ? (
          <div className="text-center py-40 bg-white dark:bg-zinc-900 rounded-[4rem] border border-dashed border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-gray-300 dark:text-zinc-700" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">No kitchens found</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
              We couldn't find any verified partners matching your search. Try a different term.
            </p>
            <button 
              onClick={() => { setSearch(""); setPage(1); }}
              className="mt-10 px-8 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all"
            >
              Clear Search
            </button>
          </div>

        ) : (
          <>
            {/* Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
              <AnimatePresence mode="popLayout">
                {providers.map((provider: Provider) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <RestaurantCard {...provider} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-24">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all disabled:opacity-30 active:scale-90"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-12 h-12 rounded-2xl font-black text-xs transition-all active:scale-90 ${
                        p === page 
                          ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20 border-orange-600" 
                          : "bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:border-orange-600"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-12 h-12 rounded-2xl border border-gray-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all disabled:opacity-30 active:scale-90"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}