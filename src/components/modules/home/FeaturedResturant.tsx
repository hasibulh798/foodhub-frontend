"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const restaurants = [
  {
    id: "1",
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Italiano Pizza",
    image:
      "https://imgs.search.brave.com/yhgKe2-dlF_9ExarJXekUimg1aUctYD4DKWQyOaUMT0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMDkv/NTYxLzEwMC9zbWFs/bC9pdGFsaWFuLXBp/enphLWFuZC1pbmdy/ZWRpZW50cy1vbi13/b29kZW4tdGFibGUt/cGhvdG8uanBn",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Spicy Biryani",
    image:
      "https://imgs.search.brave.com/hVeTrqZgTVLetM004Km29oot7JG2kpyMgyaPtzRV8S8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tcnNi/YWxiaXJzaW5naC5j/b20vY2RuL3Nob3Av/cHJvZHVjdHMvQklS/WUFOSV83ZTAyZjE0/MS1hNmE2LTQ5OTUt/YWVkMS0wZTczMzgy/YTlkMzEucG5nP3Y9/MTc1ODM1ODEwMyZ3/aWR0aD0xMDgw",
    rating: 4.7,
  },
];

export default function FeaturedRestaurantsSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/2.webp')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 max-w-6xl w-full px-4">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-14"
        >
          Featured Restaurants
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:scale-105 transition duration-300"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">
                  {restaurant.name}
                </h3>

                <p className="text-sm text-gray-500 mb-3">
                  ⭐ {restaurant.rating} Rating
                </p>

                <Link
                  href={`/restaurant/${restaurant.id}`}
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  View Menu →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
