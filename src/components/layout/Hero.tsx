import Link from "next/link";
// import { Button } from "../ui/button";
export default function Hero() {
  return (
    <section
      className=" h-[100vh] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: "url('/hero.webp')" }}
    >
      <div className="bg-black/50 p-8 rounded-xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Delicious Food Delivered To You
        </h1>
        <p className="mb-6">Order from your favorite restaurants</p>
        <Link
          href={"http://localhost:3000/meals"}
          className="bg-red-500 px-6 py-3 rounded-lg"
        >
          Order Now
        </Link>
      </div>
    </section>
  );
}
