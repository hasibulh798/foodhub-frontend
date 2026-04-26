"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChefHat, Truck, Heart, Star, Users, Target } from "lucide-react";

const stats = [
  { label: "Partner Restaurants", value: "500+", icon: ChefHat },
  { label: "Happy Customers", value: "100k+", icon: Users },
  { label: "Cities Covered", value: "25+", icon: Target },
  { label: "Top Ratings", value: "4.9/5", icon: Star },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] overflow-hidden">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/50 dark:bg-orange-900/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-50/50 dark:bg-red-900/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-[2px] w-12 bg-orange-600" />
                <span className="text-orange-600 font-black uppercase tracking-[0.4em] text-xs">Our Story</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                Revolutionizing <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                  The Way You Eat.
                </span>
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl">
                Food Hub isn't just about delivery; it's about connecting passion with plates. 
                We've built a bridge between the city's finest kitchens and your dining table, 
                ensuring that quality and convenience never have to be a compromise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-200 dark:shadow-orange-900/20 aspect-square lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
                  alt="Delicious Food"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                />
              </div>
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 z-20 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">100%</p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Love</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-20 bg-gray-50/50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm text-orange-600 border border-gray-100 dark:border-zinc-700">
                  <stat.icon size={24} />
                </div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Mission ─── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                 <div className="relative rounded-[2rem] overflow-hidden aspect-square">
                    <Image src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" alt="Kitchen" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                 </div>
                 <div className="relative rounded-[2rem] overflow-hidden aspect-square border-4 border-orange-500 shadow-xl">
                    <Image src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" alt="Chef" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="relative rounded-[2rem] overflow-hidden aspect-square">
                    <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop" alt="Restaurant" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                 </div>
                 <div className="relative rounded-[2rem] overflow-hidden aspect-square">
                    <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" alt="Dining" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                 </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight mb-8">
                The Mission Behind <br /> <span className="text-orange-600">Every Delivery.</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl shrink-0 flex items-center justify-center text-orange-600 font-black">01</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quality First</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">We vet every restaurant to ensure they meet our rigorous standards for taste and hygiene.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl shrink-0 flex items-center justify-center text-orange-600 font-black">02</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Speed Matters</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Our advanced routing technology ensures your food arrives hot and fresh, every time.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl shrink-0 flex items-center justify-center text-orange-600 font-black">03</div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Support Local</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">We empower local restaurateurs by providing them with the tools to reach thousands of new customers.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Call to Action ─── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-orange-600 to-red-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-orange-500/30">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Ready to taste the difference?</h2>
            <p className="text-orange-100 text-lg mb-10 max-w-xl mx-auto">Join thousands of foodies who have already upgraded their dining experience.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-10 py-5 bg-white text-orange-600 font-black rounded-2xl hover:bg-gray-100 transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">Order Now</button>
              <button className="px-10 py-5 bg-orange-500/20 border border-white/20 text-white font-black rounded-2xl hover:bg-orange-500/40 transition-all active:scale-95 uppercase tracking-widest text-xs">Become a Partner</button>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
      </section>
    </div>
  );
}