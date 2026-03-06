"use client";

import { providerAPI } from "@/lib/api";
import { useEffect, useState } from "react";

import type { ProviderProfile } from "@/constants/allType";

import toast from "react-hot-toast";

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: "",
    address: "",
    logoUrl: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await providerAPI.getMyProfile();
      setProfile(res.data);
      setForm({
        businessName: res.data.businessName,
        address: res.data.address,
        logoUrl: res.data.logoUrl ?? "",
      });
    } catch {
      toast.error("Profile load failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await providerAPI.updateProfile({
        businessName: form.businessName,
        address: form.address,
        logoUrl: form.logoUrl || undefined,
      });
      setProfile(res.data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-8 py-4">
        <h1 className="text-base font-semibold text-white">
          Profile & Settings
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage your business information
        </p>
      </header>

      <div className="px-8 py-6 max-w-2xl space-y-6">
        {/* Account Info (read-only from Better Auth) */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Account
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl font-bold text-orange-400">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-200">{user?.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PROVIDER
              </span>
            </div>
          </div>
          {profile && (
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${profile.isVerified ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              <span
                className={`text-xs ${profile.isVerified ? "text-emerald-400" : "text-amber-400"}`}
              >
                {profile.isVerified
                  ? "Verified provider"
                  : "Pending verification"}
              </span>
            </div>
          )}
        </div>

        {/* Business Info (editable) */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4"
        >
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Business Information
          </h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Business Name *
            </label>
            <input
              required
              value={form.businessName}
              onChange={(e) =>
                setForm((p) => ({ ...p, businessName: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition"
              placeholder="Your restaurant name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Address *
            </label>
            <textarea
              required
              rows={2}
              value={form.address}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition resize-none"
              placeholder="Full business address"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              Logo URL
            </label>
            <input
              value={form.logoUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, logoUrl: e.target.value }))
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500/60 transition"
              placeholder="https://..."
            />
            {form.logoUrl && (
              <img
                src={form.logoUrl}
                alt="logo preview"
                className="mt-2 w-16 h-16 rounded-lg object-cover border border-gray-700"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
