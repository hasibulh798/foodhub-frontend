"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export interface FoodCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  date?: string;
  location: string;
  category?: string;
}

const FoodCard = ({
  id,
  image,
  title,
  description,
  price,
  rating,
  date,
  location,
  category,
}: FoodCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group h-full"
    >
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-500 shadow-sm border border-white/20">
                {category}
              </span>
            </div>
          )}
          {/* Rating Badge */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-bold">{rating}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-red-500 transition-colors">
              {title}
            </h3>
            <span className="text-lg font-black text-red-600 dark:text-red-500">
              ${price}
            </span>
          </div>

          <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 mb-6 font-light leading-relaxed">
            {description}
          </p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs font-medium truncate">{location}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-xs font-medium truncate">{date || "Today"}</span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-auto">
            <Link href={`/meals/${id}`}>
              <Button 
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white rounded-xl py-6 font-bold transition-all group/btn flex items-center justify-center gap-2"
              >
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
