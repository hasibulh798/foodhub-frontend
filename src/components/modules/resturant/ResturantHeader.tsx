import Image from "next/image";
interface RestaurantHeaderProps {
  provider: {
    businessName: string;
    logoUrl?: string | null;
    address: string;
    rating?: number; 
    deliveryFee?: number; 
    estimatedTime?: string;
  };
  totalMeals?: number;
  totalOrder?: number;
}
export default function RestaurantHeader({
  provider,
  totalMeals,
  totalOrder,
}: RestaurantHeaderProps) {
  console.log("RestaurantHeader: provider: ",provider.businessName)
  return (
    <div className="mb-8">
      {/* Banner / Logo */}
      <div className="h-60 w-full rounded-xl overflow-hidden mb-6">
        <Image
          src={
            provider.logoUrl ??
            "https://images.unsplash.com/photo-1550547660-d9450f859349"
          }
          alt={provider.businessName ?? "Image"}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold mb-2">{provider.businessName}</h1>
      {/* Meta */}
      <div className="text-gray-600 flex gap-4 text-sm">
        <span>⭐ {provider.rating ?? 4.5}</span>
        <span>{provider.estimatedTime ?? "30-40 min"}</span>
        <span>Delivery: {provider.deliveryFee ?? 40}৳</span>
        <span>Meals: {totalMeals ?? 0}</span>
        <span>Orders: {totalOrder ?? 0}</span>
      </div>

      {/* Address */}
      <p className="text-gray-500 mt-2">{provider.address}</p>
    </div>
  );
}
