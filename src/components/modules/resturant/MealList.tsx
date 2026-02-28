import MealCard from "../meals/MealCard";

interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
}
interface Props {
  provider: {
    id: string;
    meals: MealType[];
  };
}
export default async function MealList({ provider }: Props) {
  return (
    <div className="flex items-center gap-4 flex-wrap rounded-xl p-4">
      {provider.meals.map((meal: MealType) => (
        <MealCard key={meal.id} meal={meal} provider={provider} />
      ))}
    </div>
  );
}
