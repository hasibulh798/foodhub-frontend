import MealCard from "./MealCard";

const meals = [
  {
    id: 1,
    name: "Burger Deluxe",
    description: "Beef patty with cheese and lettuce",
    price: 350,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
  {
    id: 2,
    name: "Chicken Combo",
    description: "Fried chicken with fries and drink",
    price: 450,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
  },
];

export default function MealList() {
  return (
    <div className="space-y-6">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          name={meal.name}
          description={meal.description}
          price={meal.price}
          image={meal.image}
        />
      ))}
    </div>
  );
}
