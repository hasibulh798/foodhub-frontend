import RestaurantHeader from "@/components/modules/resturant/ResturantHeader";
import RestaurantMenu from "@/components/modules/resturant/ResturantMenu";
import { providerServices } from "@/services/provider.service";

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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RestaurantHeader
          provider={data.provider}
          totalMeals={data.totalMeals}
          totalOrder={data.totalOrder}
        />
        
        <div className="mt-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-1.5 bg-orange-600 rounded-full" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Curation & Flavors</h2>
            </div>
            
            <RestaurantMenu provider={data.provider} />
        </div>
      </div>
    </div>
  );
}
