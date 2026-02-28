import Image from "next/image";

interface MealType {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  dietaryType?: "VEG" | "NON_VEG" | "VEGAN" | null;
}

interface MealCardProps {
  meal: MealType;
}

export default function MealCard({ meal }: MealCardProps) {
    if (!meal) return null;

  return (
    <div className="w-65 flex-col justify-center items-center bg-white rounded-xl shadow p-4">
      {meal.imageUrl && (
        <Image
          src={meal.imageUrl}
          alt={meal.name}
          width={300}
          height={300}
          className="h-40 w-full object-cover rounded-md"
        />
      )}

      <h3 className="text-lg font-semibold mt-3">{meal.name}</h3>

      <p className="text-sm text-gray-500 h-4 overflow-hidden">{meal.description}</p>

      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-red-500">
          ৳ {Number(meal.price)}
        </span>

        <button
          disabled={!meal.isAvailable}
          className={`px-3 py-1 rounded text-white ${
            meal.isAvailable
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {meal.isAvailable ? "Add to Cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}