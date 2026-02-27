import RestaurantCard from "@/components/modules/resturant/ResturantCard";
import { providerServices } from "@/services/provider.service";

type Provider = {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string;
  isVerified: boolean;
};


export default async function RestaurantsPage() {
  const providers = await providerServices.getProviders();

  const verifiedProviders = providers.filter(
    (provider: Provider) => provider.isVerified
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>

      {verifiedProviders.length === 0 ? (
        <div className="w-full h-80 text-center items-center">

          <p className="text-gray-500 text-2xl">No verified restaurants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}
    </div>
  );
}