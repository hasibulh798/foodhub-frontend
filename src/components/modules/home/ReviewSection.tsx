"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Food Enthusiast",
    content: "The variety of restaurants available is incredible. I've discovered so many local gems through Food Hub!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "David Chen",
    role: "Regular Customer",
    content: "Fast delivery and the food always arrives hot. The app is super intuitive and easy to use.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    role: "Local Guide",
    content: "I love the verification system for providers. It gives me peace of mind knowing the kitchens are vetted.",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop",
  },
];

export default function ReviewSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextStep = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % reviews.length);
  }, []);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextStep, 5000);
    return () => clearInterval(timer);
  }, [nextStep]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative min-h-[600px] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Loved by <span className="text-red-500">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Don't just take our word for it. Here's what our community says.
          </p>
        </motion.div>
      </div>

      <div className="relative max-w-4xl mx-auto w-full px-12 h-[350px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            className="absolute inset-0 flex items-center justify-center px-4"
          >
            <div className="bg-background border rounded-[2rem] p-10 md:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center text-center max-w-2xl">
              <Quote className="absolute -top-6 -right-6 w-32 h-32 text-red-500/5 rotate-12" />
              
              <div className="flex items-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < reviews[index].rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xl md:text-2xl leading-relaxed mb-10 font-light italic text-foreground tracking-tight">
                "{reviews[index].content}"
              </p>

              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-red-500/10 transition-transform hover:scale-110">
                  <img
                    src={reviews[index].avatar}
                    alt={reviews[index].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{reviews[index].name}</h4>
                  <p className="text-sm text-red-500 font-medium tracking-wide uppercase">{reviews[index].role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevStep}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-4 rounded-full bg-background border shadow-lg hover:bg-red-500 hover:text-white transition-all z-20 hidden md:block"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextStep}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-4 rounded-full bg-background border shadow-lg hover:bg-red-500 hover:text-white transition-all z-20 hidden md:block"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-12">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`transition-all duration-300 rounded-full ${
              i === index ? "w-8 h-2 bg-red-500" : "w-2 h-2 bg-muted hover:bg-muted-foreground"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

