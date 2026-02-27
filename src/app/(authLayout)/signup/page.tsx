"use client";

import CustomerForm from "@/components/modules/signup/CustomerForm";
import RestaurantForm from "@/components/modules/signup/RestaurantForm";
import { useState } from "react";


export default function SignupPage() {
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER" | null>(null);

  return (
    <div className="max-w-md mx-auto py-12 px-6">
      {!role && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Register As
          </h2>

          <button
            onClick={() => setRole("CUSTOMER")}
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            Customer
          </button>

          <button
            onClick={() => setRole("PROVIDER")}
            className="w-full bg-red-500 text-white py-3 rounded-lg"
          >
            Restaurant Owner
          </button>
        </div>
      )}

      {role === "CUSTOMER" && <CustomerForm />}
      {role === "PROVIDER" && <RestaurantForm />}
    </div>
  );
}