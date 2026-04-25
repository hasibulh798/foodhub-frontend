import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors">
      
      {/* HERO SECTION */}
      <section className="bg-red-500 dark:bg-red-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About FoodHub
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/90">
            Delivering your favorite meals from the best restaurants 
            straight to your doorstep.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT SECTION */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* Image */}
          <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/6.jpg"
              alt="About Food"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Who We Are
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              FoodHub is a modern food delivery platform connecting
              customers with top-rated restaurants in their city.
              We aim to make food ordering fast, simple, and enjoyable.
            </p>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you are craving burgers, pizza, or traditional
              cuisine, FoodHub ensures quick delivery and excellent
              service every time.
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="bg-white dark:bg-gray-800 py-16 px-4 transition-colors">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Why Choose FoodHub?
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Fast Delivery
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get your meals delivered quickly and fresh from 
              your favorite restaurants.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Trusted Restaurants
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We partner only with verified and quality restaurants 
              to ensure great taste and hygiene.
            </p>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Easy Ordering
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smooth interface and secure payment system for a 
              hassle-free food ordering experience.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}