export default function RestaurantHeader() {
  return (
    <div className="mb-8">
      <div className="h-60 w-full rounded-xl overflow-hidden mb-6">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349"
          alt="Restaurant"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">Burger King</h1>

      <div className="text-gray-600 flex gap-4 text-sm">
        <span>⭐ 4.5</span>
        <span>30-40 min</span>
        <span>Delivery: 40৳</span>
      </div>
    </div>
  );
}