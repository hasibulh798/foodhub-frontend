import CategoryFilter from "@/components/resturant/CategoryFilter";
import MealList from "@/components/resturant/MealList";
import RestaurantHeader from "@/components/resturant/ResturantHeader";

export default function RestaurantPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <RestaurantHeader />
      <CategoryFilter />
      <MealList />
    </div>
  );
}
