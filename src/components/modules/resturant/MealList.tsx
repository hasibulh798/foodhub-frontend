import { providerServices } from "@/services/provider.service";
import MealCard from "../meals/MealCard";

// const meals = [
//   {
//     id: 1,
//     name: "Burger Deluxe",
//     description: "Beef patty with cheese and lettuce",
//     price: 350,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//   },
//   {
//     id: 2,
//     name: "Chicken Combo",
//     description: "Fried chicken with fries and drink",
//     price: 450,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
//   },
//   {
//     id: 3,
//     name: "Chicken Combo",
//     description: "Fried chicken with fries and drink",
//     price: 450,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
//   },
//   {
//     id: 4,
//     name: "Burger Deluxe",
//     description: "Beef patty with cheese and lettuce",
//     price: 350,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349",
//   },
//   {
//     id: 5,
//     name: "Chicken Combo",
//     description: "Fried chicken with fries and drink",
//     price: 450,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
//   },
//   {
//     id: 6,
//     name: "Chicken Combo",
//     description: "Fried chicken with fries and drink",
//     price: 450,
//     isAvailable: true,
//     imageUrl: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
//   },
// ];
type ParamsType = {
  providerId: string;
};
interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
}
export default async function MealList(params: ParamsType) {
  const { providerId } = await params;
  const data = await providerServices.getSingleProvider(providerId as string);
  const provider = data.provider;
  console.log("Provider: ", provider.id);

  return (
    <div className="flex items-center justify-center  gap-4 flex-wrap space-y-6">
      {provider.meals.map((meal:MealType) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
