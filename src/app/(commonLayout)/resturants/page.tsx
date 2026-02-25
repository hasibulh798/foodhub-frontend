import RestaurantCard from "@/components/resturant/ResturantCard";

type Provider = {
  id: string;
  businessName: string;
  address: string;
  logoUrl?: string;
  isVerified: boolean;
};

async function getProviders() {
  const res = await fetch("http://localhost:5000/api/providers", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch providers");
  }

  return res.json();
}

export default async function RestaurantsPage() {
  const providers = await getProviders();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">All Restaurants</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.data.map((provider: Provider) => (
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
    </div>
  );
}
