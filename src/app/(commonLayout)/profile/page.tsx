"use client";

import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  address?: string;
  createdAt: string;
};

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("http://localhost:5000/auth/api/me", {
        credentials: "include",
        cache: "no-store"
      });

      if (!res.ok) return null;
      const { user } = await res.json();
      console.log(user)
      setUser(user);
    }

    fetchProfile();
  }, []);

  if (!user) {
    return <div className="p-10">Loading profile...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
            {user.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>

            <span
              className={`mt-2 inline-block px-3 py-1 text-sm rounded-full text-white ${
                user.status === "ACTIVE"
                  ? "bg-green-500"
                  : user.status === "SUSPENDED"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        <button className="mt-4 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <div className="flex items-center space-x-3 text-gray-600">
            <Mail size={18} />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <Phone size={18} />
            <span>{user.phone || "Not provided"}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin size={18} />
            <span>{user.address || "No address added"}</span>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold">Account Information</h2>

          <div className="flex items-center space-x-3 text-gray-600">
            <ShieldCheck size={18} />
            <span>Role: {user.role}</span>
          </div>

          <div className="text-gray-600">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-xl font-bold">24</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-xl font-bold">18</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-xl font-bold">6</p>
          </div>
        </div>
      </div>
    </div>
  );
}
