"use client"
import { GemIcon, TimerIcon, VanIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [search, setSearch] = useState("")
  return (
    <section
      className=" h-screen bg-cover bg-center flex   text-white"
      style={{ backgroundImage: "url('/hero.webp')" }}
    >
      <div className="w-[60%] flex-col ml-32 items-center justify-center ">
        <motion.h1
         initial={{ opacity: 0, x: 100 }}   
          animate={{ opacity: 1, x: 0 }}     
          transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl leading-20 font-bold py-4 mt-42 ">
          Excellence Taste in Every Bite & Adorn your Food Senses
        </motion.h1>

        <div className="relative max-w-[60%] mt-18">
          <input
            type="text"
            placeholder="Find your favourite food..."
            className="w-full px-5 py-5 pr-32 rounded-full border bg-amber-50 border-gray-300 outline-none text-black"
          />

          <Link href={"http://localhost:3000/meals"}>
          <button
          onChange={(e)=> setSearch(e.target.value)}
           className="absolute right-1 top-1 bottom-1 px-8 bg-red-500 text-white font-semibold rounded-full hover:bg-amber-500 transition-discrete">
            Find Now
          </button></Link>
        </div>

        <div className="w-[60%] flex justify-between mt-20">
          <h1 className="text-2xl font-bold hover:text-red-700 transition ">
            {" "}
            <VanIcon size={52} /> Fast delivery
          </h1>
          <h1 className="text-2xl font-bold hover:text-red-700 transition ">
            {" "}
            <TimerIcon size={52} /> Pickup
          </h1>
          <h1 className="text-2xl font-bold hover:text-red-700 transition ">
            <GemIcon size={52}  /> Divine In
          </h1>
        </div>
      </div>
    </section>
  );
}
