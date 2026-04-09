/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { adminService } from "@/services/admin.service";
import {
  CheckCircle,
  Search,
  Trash2,
  UserX,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Provider = {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  providerProfiles: {
    id: string;
    isVerified: boolean;
  } | null;
};

export default function ProviderManagement() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await adminService.getAllUsers();
        setProviders(usersRes.users?.filter((u: any) => u.role === "PROVIDER") || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch providers");
      }
    }
    fetchData();
  }, []);

  const filteredProviders = useMemo(() => 
    providers.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.email.toLowerCase().includes(searchQuery.toLowerCase())),
    [providers, searchQuery]
  );

  const handleVerifyProvider = async (providerId: string, isVerified: boolean) => {
    try {
      await adminService.verifyProvider(providerId, !isVerified);
      setProviders((prev) =>
        prev.map((u) =>
          u.providerProfiles?.id === providerId
            ? {
                ...u,
                providerProfiles: {
                  ...u.providerProfiles,
                  isVerified: !isVerified,
                },
              }
            : u
        )
      );
      toast.success(isVerified ? "Provider unverified" : "Provider verified");
    } catch {
      toast.error("Verification failed");
    }
  };

  const handleVerifyEmail = async (userId: string, isVerified: boolean) => {
    try {
      await adminService.verifyEmail(userId, !isVerified);
      setProviders((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, emailVerified: !isVerified } : u))
      );
      toast.success(`Email verification status updated`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update email verification status");
    }
  };

  const handleDeleteProvider = async (userId: string, providerProfileId?: string) => {
    try {
      if (providerProfileId) {
        await adminService.deleteProvider(providerProfileId);
      } else {
        await adminService.deleteUser(userId);
      }
      setProviders((prev) => prev.filter((p) => p.id !== userId));
      toast.success("Provider record removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Management</h1>
        <p className="text-muted-foreground mt-1">Verify and manage service providers.</p>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              className="pl-9 bg-background/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-semibold border-b">
                    <th className="px-6 py-4 text-left">Provider</th>
                    <th className="px-6 py-4 text-left">Email Verified</th>
                    <th className="px-6 py-4 text-left">Verification Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredProviders.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleVerifyEmail(p.id, p.emailVerified)}
                          className={`text-xs font-medium px-2 py-1 rounded-full transition-all hover:ring-2 hover:ring-offset-1 ${
                            p.emailVerified 
                              ? "bg-green-500/10 text-green-500 hover:ring-green-500/30" 
                              : "bg-red-500/10 text-red-500 hover:ring-red-500/30"
                          }`}
                        >
                          {p.emailVerified ? "Verified" : "Unverified"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {p.providerProfiles?.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium">
                            <CheckCircle className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                            <UserX className="w-3 h-3" /> Unverified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!p.providerProfiles}
                          className={`h-8 ${p.providerProfiles?.isVerified ? "hover:bg-destructive/10 text-muted-foreground" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"}`}
                          onClick={() => p.providerProfiles && handleVerifyProvider(p.providerProfiles.id, !!p.providerProfiles.isVerified)}
                        >
                          {p.providerProfiles?.isVerified ? "Unverify" : "Verify"}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the provider
                                profile and remove their data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteProvider(p.id, p.providerProfiles?.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                  {filteredProviders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No providers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
