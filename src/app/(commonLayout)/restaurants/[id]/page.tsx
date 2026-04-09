import RestaurantHeader from "@/components/modules/resturant/ResturantHeader";
import RestaurantMenu from "@/components/modules/resturant/ResturantMenu";
import { providerServices } from "@/services/provider.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;

  const data = await providerServices.getSingleProvider(id as string);

  if (!data || !data.provider) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🏪</div>
        <h2 className="text-2xl font-black text-gray-900">Restaurant Not Found</h2>
        <p className="text-gray-500 mt-2">The kitchen you're looking for might be closed or doesn't exist.</p>
        <Link href="/restaurants" className="mt-8 text-orange-600 font-bold flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-32">
      <div className="max-w-7xl mx-auto px-6 py-6 font-sans">
        {/* Breadcrumb / Back Link */}
        <div className="mb-10">
            <Link 
                href="/restaurants" 
                className="inline-flex items-center gap-3 text-gray-400 hover:text-orange-600 transition-colors group"
            >
                <div className="p-2 rounded-full border border-gray-100 dark:border-zinc-800 group-hover:border-orange-500/20 group-hover:bg-orange-500/5 transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Kitchens</span>
            </Link>
        </div>

        <RestaurantHeader
          provider={data.provider}
          totalMeals={data.totalMeals}
          totalOrder={data.totalOrder}
        />
        
        <div className="mt-20">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-2 bg-orange-600 rounded-full shadow-lg shadow-orange-600/20" />
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">Curation & Flavors</h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">Our Signature Selection</p>
                    </div>
                </div>
                <div className="hidden md:block h-[1px] flex-1 bg-gradient-to-r from-gray-100 via-gray-100 to-transparent dark:from-zinc-800 dark:via-zinc-800 dark:to-transparent mx-10" />
            </div>
            
            <RestaurantMenu provider={data.provider} />
        </div>
      </div>
    </div>
  );
}

