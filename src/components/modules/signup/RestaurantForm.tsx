"use client";

import { useState } from "react";

export default function RestaurantForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    address: "",
    logoUrl:""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/providers", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Restaurant Registration</h2>

      <input
        type="text"
        placeholder="Owner Name"
        required
        className="input"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        required
        className="input"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        required
        className="input"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <input
        type="text"
        placeholder="Phone"
        className="input"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <input
        type="text"
        placeholder="Business Name"
        required
        className="input"
        onChange={(e) =>
          setForm({ ...form, businessName: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Business Address"
        required
        className="input"
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Logo URL (Optional)"
        className="input border-2"
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">
        Register Restaurant
      </button>
    </form>
  );
}