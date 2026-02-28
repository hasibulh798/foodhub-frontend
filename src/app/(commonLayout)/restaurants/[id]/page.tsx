import CategoryFilter from "@/components/modules/resturant/CategoryFilter";
import MealList from "@/components/modules/resturant/MealList";
import RestaurantHeader from "@/components/modules/resturant/ResturantHeader";
import { providerServices } from "@/services/provider.service";

interface PageProps {
  params: { id: string };
}

export default async function RestaurantPage({ params }: PageProps) {
  const { id } = await params;

  const data = await providerServices.getSingleProvider(id as string);

  if (!data) {
    return <div className="text-center py-10">Restaurant not found</div>;
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <RestaurantHeader
        provider={data.provider}
        totalMeals={data.totalMeals}
        totalOrder={data.totalOrder}
      />
      <CategoryFilter providerId={data.provider.id} />
      <MealList provider={data.provider} />
    </div>
  );
}
