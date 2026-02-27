"use client";

import { useState } from "react";

export default function CustomerForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/auth/sign-up/email", {
      method: "POST",
      body: JSON.stringify(form),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Customer Registration</h2>

      <input
        type="text"
        placeholder="Full Name"
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
        placeholder="Phone (optional)"
        className="input"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <button className="w-full bg-blue-500 text-white py-2 rounded">
        Register
      </button>
    </form>
  );
}