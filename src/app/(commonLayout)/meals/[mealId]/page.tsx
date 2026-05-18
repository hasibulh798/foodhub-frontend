import { mealServices } from "@/services/meal.service";
import { reviewServices } from "@/services/review.service";
import MealDetails from "@/components/modules/meals/MealDetails";
import RelatedMeals from "@/components/modules/meals/RelatedMeals";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    mealId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { mealId } = await params;
    const meal = await mealServices.getSingleMeal(mealId);
    return {
      title: `${meal.name} | Food Hub`,
      description: meal.description,
    };
  } catch (error) {
    return {
      title: "Meal Details | Food Hub",
    };
  }
}

export default async function MealDetailsPage({ params }: Props) {
  const { mealId } = await params;

  // Fetch meal data, reviews, and related items in parallel
  const [meal, reviews, allMeals] = await Promise.all([
    mealServices.getSingleMeal(mealId),
    reviewServices.getMealReviews(mealId).catch(() => []),
    mealServices.getAllMeals({ limit: 5 }).catch(() => [])
  ]);

  // Filter out the current meal from related items
  const mealsArray = Array.isArray(allMeals) ? allMeals : (allMeals?.data || []);
  const relatedMeals = mealsArray.filter((m: any) => m.id !== mealId);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <MealDetails meal={meal} reviews={reviews} />
      <RelatedMeals meals={relatedMeals} />
    </div>
  );
}
