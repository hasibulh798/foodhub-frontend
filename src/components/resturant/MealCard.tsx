interface MealCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function MealCard({
  name,
  description,
  price,
  image,
}: MealCardProps) {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm p-4 rounded-lg hover:shadow-md transition">
      <div className="flex-1 pr-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="font-bold">{price}৳</p>
      </div>

      <div className="w-24 h-24 rounded-lg overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}