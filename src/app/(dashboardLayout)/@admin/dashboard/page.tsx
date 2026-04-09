/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UserRole, UserStatus } from "@/constants/allType";
import { adminService } from "@/services/admin.service";
import {
  CheckCircle,
  DollarSign,
  ShoppingCart,
  UserMinus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  providerProfiles: {
    id: string;
    isVerified: boolean;
  }; // for provider
};

type Stats = {
  totalOrders: number;
  totalUsers: number;
  totalProviders: number;
  verifiedProviders: number;
  totalRevenue: number;
};
export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  //Fetch Stats
  useEffect(() => {
    async function fetchStats() {
      const res = await adminService.getStats();
      console.log("Statistic: ", res.data);
      setStats(res.data);
    }
    fetchStats();
  }, []);

  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;

  useEffect(() => {
    async function fetchUsers() {
      const res = await adminService.getAllUsers();
      setUsers(res.user);
    }
    fetchUsers();
  }, []);

  // Split users
  const normalUsers = users.filter((u) => u.role === "CUSTOMER");
  const providers = users.filter((u) => u.role === "PROVIDER");

  // =========================
  // USER STATUS CHANGE
  // =========================
  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
    try {
      setLoadingId(userId);

      await adminService.updateUserStatus(userId, newStatus);

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)),
      );
    } catch (error: any) {
      alert(error.message || "Status update failed");
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // DELETE USER
  // =========================
  const handleDeleteUser = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const res = await adminService.deleteUser(id);

      if (!res?.success) {
        throw new Error("Delete failed");
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // =========================
  // VERIFY PROVIDER
  // =========================
  const handleVerifyProvider = async (
    providerId: string,
    isVerified: boolean,
  ) => {
    try {
      await adminService.verifyProvider(providerId, !isVerified);

      setUsers((prev) =>
        prev.map((u) =>
          u.providerProfiles?.id === providerId
            ? {
                ...u,
                providerProfile: {
                  ...u.providerProfiles,
                  isVerified: !isVerified,
                },
              }
            : u,
        ),
      );
    } catch {
      alert("Verification failed");
    }
  };

  // =========================
  // DELETE PROVIDER
  // =========================
  const handleDeleteProvider = async (id: string) => {
    try {
      await adminService.deleteProvider(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={<ShoppingCart />}
          label="Total Orders"
          value={totalOrders}
        />
        <StatCard
          icon={<Users />}
          label="Total Users"
          value={normalUsers.length}
        />
        <StatCard
          icon={<CheckCircle />}
          label="Verified Providers"
          value={providers.filter((p) => p.providerProfiles?.isVerified).length}
        />
        <StatCard
          icon={<UserMinus />}
          label="Non-Verified Providers"
          value={
            providers.filter((p) => !p.providerProfiles?.isVerified).length
          }
        />
        <StatCard
          icon={<DollarSign />}
          label="Total Revenue"
          value={`$${totalRevenue}`}
        />
      </div>

      {/* ================= USERS TABLE ================= */}
      <TableCard title="Users Management">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {normalUsers.map((u) => (
              <tr key={u.id} className="border-b">
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    disabled={loadingId === u.id}
                    value={u.status}
                    onChange={(e) =>
                      handleStatusChange(u.id, e.target.value as UserStatus)
                    }
                    className="border px-3 py-1 rounded"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* ================= PROVIDERS TABLE ================= */}
      <TableCard title="Providers Management">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-b">
                <td>{p.providerProfiles.id}</td>
                <td>{p.name}</td>
                <td>{p.email}</td>
                <td>
                  {p.providerProfiles?.isVerified ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                      Verified
                    </span>
                  ) : (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() =>
                      handleVerifyProvider(
                        p.providerProfiles?.id,
                        !!p.providerProfiles?.isVerified,
                      )
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    {p.providerProfiles.isVerified ? "Unverify" : "Verify"}
                  </button>

                  <button
                    onClick={() => handleDeleteProvider(p.providerProfiles.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </div>
  );
}

/* ================= Reusable Components ================= */

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white shadow rounded-xl p-6 flex items-center gap-4">
      <div className="text-blue-500">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function TableCard({ title, children }: any) {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
