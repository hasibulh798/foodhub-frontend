"use client";

import RestaurantCard from "@/components/modules/resturant/ResturantCard";
import { providerServices } from "@/services/provider.service";
import { Search, UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await providerServices.getProviders({ page, limit: 12 });
        const providerData = Array.isArray(res) ? res : (res?.data || []);
        setProviders(providerData);
        setTotalPages(res?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  const verifiedProviders = providers.filter(
    (provider: Provider) => provider.isVerified
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Search & Hero Section */}
      <section className="bg-white border-b border-gray-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <UtensilsCrossed size={14} />
            Exclusive Dining
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Discover the Best <br/>
            <span className="text-orange-600">Local Flavors</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto font-medium"
          >
            Explore curated collections of top-rated restaurants and home chefs near you.
          </motion.p>

          <div className="relative max-w-2xl mx-auto group text-left">
            <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
            <div className="relative flex flex-col md:flex-row items-stretch md:items-center bg-white border border-gray-100 p-2 rounded-2xl shadow-xl gap-2 md:gap-0">
              <div className="flex-1 flex items-center px-4 gap-3 md:border-r md:border-gray-100">
                <Search className="text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by restaurant or cuisine..." 
                  className="w-full bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 font-medium py-3"
                />
              </div>
              <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors duration-300 whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Listing */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Verified Kitchens</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Found {verifiedProviders.length} premium restaurants</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-100 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm">Popular</button>
            <button className="bg-gray-900 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-gray-900/10">Nearest</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : verifiedProviders.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-400 text-xl font-bold">No verified kitchens discovered yet.</p>
            <button className="mt-4 text-orange-600 font-bold hover:underline">Explore featured collections</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {verifiedProviders.map((provider: Provider) => (
                <RestaurantCard
                  key={provider.id}
                  id={provider.id}
                  businessName={provider.businessName}
                  address={provider.address}
                  logoUrl={provider.logoUrl}
                  isVerified={provider.isVerified}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-16">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                      p === page 
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-inherit"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}