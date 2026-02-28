"use client";

import { Box, ShoppingCart, DollarSign, Users } from "lucide-react";

export default function ProviderDashboard() {
  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <Box className="w-10 h-10 text-blue-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Total Services</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <ShoppingCart className="w-10 h-10 text-green-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Active Orders</p>
            <p className="text-xl font-bold">35</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <Users className="w-10 h-10 text-purple-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Customers Served</p>
            <p className="text-xl font-bold">120</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-xl p-6 flex items-center">
          <DollarSign className="w-10 h-10 text-orange-500 mr-4" />
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-xl font-bold">$4,800</p>
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">#3012</td>
                <td>Hasib</td>
                <td>Feb 28, 2026</td>
                <td className="text-green-600 font-medium">Completed</td>
                <td>$120</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-3">#3013</td>
                <td>Rahim</td>
                <td>Feb 27, 2026</td>
                <td className="text-yellow-600 font-medium">Pending</td>
                <td>$75</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3">#3014</td>
                <td>Karim</td>
                <td>Feb 26, 2026</td>
                <td className="text-red-600 font-medium">Cancelled</td>
                <td>$50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}