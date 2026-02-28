"use client";

import { useCart } from "@/lib/Cart-context";
import { mealServices } from "@/services/meal.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Meal {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
  reviews: { id: string; user: string; rating: number; comment: string }[];
}

export default function MealDetailsPage({
  params,
}: {
  params: { mealId: string };
}) {
  const { mealId } = React.use(params);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  useEffect(() => {
    async function fetchMeal() {
      try {
        const data = await mealServices.getSingleMeal(mealId);
        setMeal(data);
      } catch (err) {
        console.error("Failed to fetch meal:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMeal();
  }, [mealId]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!meal) return <div className="text-center py-10">Meal not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Meal Info */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 bg-white rounded-xl shadow p-6">
        {meal.imageUrl && (
          <div className="w-full md:w-1/2 h-64 relative">
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              width={400}
              height={400}
              className="w-full h-60 object-cover rounded-xl"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{meal.name}</h1>
          <p className="text-gray-600">{meal.description}</p>
          <p className="text-xl font-semibold">Price: {meal.price} BDT</p>
          {meal.dietaryType && (
            <p className="text-sm font-medium text-muted-foreground">
              Dietary: {meal.dietaryType}
            </p>
          )}
          <button
            className="mt-auto px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
            onClick={() =>
              addItem({
                mealId,
                name: meal.name,
                price: Number(meal.price),
                imageUrl: meal.imageUrl,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {meal.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {meal.reviews.map((review) => (
              <div key={review.id} className="border rounded-xl p-4 bg-gray-50">
                <p className="font-semibold">{review.user}</p>
                <p className="text-yellow-500">Rating: {review.rating}/5</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
