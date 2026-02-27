"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Fast Delivery",
    icon: "🚚",
    text: "No long waits. Track your order in real-time and enjoy timely delivery every time.",
  },
  {
    title: "Secure Payment",
    icon: "💳",
    text: "Your transactions are protected with advanced encryption, ensuring safe and hassle-free payments every time.",
  },
  {
    title: "Live Tracking",
    icon: "📍",
    text: "Stay informed every step of the way with real-time tracking and instant delivery notifications.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="h-screen flex items-center py-24 bg-gray-200 bg-cover"
    
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-16">Why Choose Us</h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
