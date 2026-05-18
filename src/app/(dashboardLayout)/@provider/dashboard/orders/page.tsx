"use client";

import type { Order, OrderStatus } from "@/constants/allType";
import { orderService } from "@/services/order.service";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ORDER_STATUSES: OrderStatus[] = [
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
  PREPARING: {
    label: "Preparing",
    color: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    dot: "bg-violet-400",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    dot: "bg-orange-400",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, RefreshCcw } from "lucide-react";

type FilterStatus = OrderStatus | "ALL";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await orderService.getProviderOrders();
      setOrders(ordersData);
    } catch {
      toast.error("Orders load failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      toast.success(`→ ${STATUS_META[status].label}`);
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);
  
  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filtered.slice(startIndex, startIndex + itemsPerPage);

  const countByStatus = (s: OrderStatus) =>
    orders.filter((o) => o.status === s).length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 p-4 md:p-8 space-y-6">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium">Handle your kitchen pipeline efficiently</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchOrders}
          className="rounded-xl border-gray-800 hover:bg-gray-900 font-bold"
        >
          <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </header>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-gray-900/50 p-2 rounded-2xl border border-gray-800/50 w-fit">
        <FilterPill
          label="All"
          count={orders.length}
          active={filter === "ALL"}
          onClick={() => { setFilter("ALL"); setCurrentPage(1); }}
        />
        {(
          [
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
          ] as OrderStatus[]
        ).map((s) => (
          <FilterPill
            key={s}
            label={STATUS_META[s].label}
            count={countByStatus(s)}
            active={filter === s}
            onClick={() => { setFilter(s); setCurrentPage(1); }}
            dot={STATUS_META[s].dot}
          />
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-gray-900/40 border border-gray-800/60 rounded-[2rem] overflow-hidden backdrop-blur-sm shadow-xl">
        <Table>
          <TableHeader className="bg-gray-900/60">
            <TableRow className="border-gray-800/60 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Reference</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Customer</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Status</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8">Amount</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-gray-500 py-6 px-8 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="border-gray-800/40">
                  <TableCell colSpan={5} className="py-8 px-8"><div className="h-12 w-full bg-gray-800/50 animate-pulse rounded-xl" /></TableCell>
                </TableRow>
              ))
            ) : currentOrders.length === 0 ? (
              <TableRow className="hover:bg-transparent border-none">
                <TableCell colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-30">
                    <p className="text-6xl font-black">∅</p>
                    <p className="text-lg font-bold">No orders matching criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentOrders.map((order) => {
                const meta = STATUS_META[order.status];
                return (
                  <TableRow key={order.id} className="border-gray-800/40 hover:bg-white/5 transition-colors group">
                    <TableCell className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-gray-500 group-hover:text-white transition-colors">#{order.id.slice(-8).toUpperCase()}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-200">{order.customer?.name ?? "Guest User"}</span>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-gray-500"><Phone size={10} /> {order.phone}</span>
                          <span className="flex items-center gap-1 text-[10px] text-gray-500 truncate max-w-[150px]"><MapPin size={10} /> {order.deliveryAddress}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${meta.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className="text-sm font-black text-orange-400 tabular-nums">৳{order.totalAmount}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                        {ORDER_STATUSES.filter(s => s !== order.status && s !== "PENDING").slice(0, 2).map(s => (
                          <Button
                            key={s}
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(order.id, s)}
                            disabled={updatingId === order.id}
                            className="text-[10px] font-black uppercase tracking-tighter bg-gray-800 hover:bg-gray-700 rounded-lg h-8"
                          >
                            Mark {STATUS_META[s].label}
                          </Button>
                        ))}
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={`rounded-xl border-gray-800 font-bold ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`rounded-xl border-gray-800 font-bold ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'cursor-pointer'}`}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={`rounded-xl border-gray-800 font-bold ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
  dot,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
        active
          ? "bg-orange-500 text-white border-orange-500"
          : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
      }`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {label}
      <span
        className={`font-mono ${active ? "text-orange-200" : "text-gray-600"}`}
      >
        {count}
      </span>
    </button>
  );
}

function OrderCard({
  order,
  onStatusChange,
  updating,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  updating: boolean;
}) {
  const meta = STATUS_META[order.status];
  const createdAt = new Date(order.createdAt);

  return (
    <div
      className={`bg-gray-900 border rounded-xl transition ${updating ? "opacity-60 pointer-events-none" : "border-gray-800 hover:border-gray-700"}`}
    >
      {/* Order Header */}
      <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-gray-600">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.color}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border ${
              order.paymentMethod === "COD"
                ? "bg-gray-800 text-gray-400 border-gray-700"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}
          >
            {order.paymentMethod}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded border ${
              order.paymentStatus === "PAID"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {order.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-orange-400 font-bold font-mono text-lg">
            ৳{order.totalAmount}
          </p>
          <p className="text-[10px] text-gray-600 mt-0.5">
            {createdAt.toLocaleTimeString("en-BD", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" · "}
            {createdAt.toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
      </div>

      {/* Customer + Items */}
      <div className="px-5 py-3 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
            Customer
          </p>
          <p className="text-sm font-medium text-gray-200">
            {order.customer?.name ?? "—"}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {order.deliveryAddress}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">
            Items
          </p>
          <div className="space-y-1">
            {order.orderItems?.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{item.meal?.name}</span>
                <span className="text-xs font-mono text-gray-500">
                  ×{item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-800 flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span className="font-mono">৳{order.subtotal}</span>
          </div>
        </div>
      </div>

      {/* Status Actions */}
      {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
        <div className="px-5 pb-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">
            Update Status
          </p>
          <div className="flex gap-2 flex-wrap">
            {ORDER_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(order.id, s)}
                disabled={order.status === s}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  order.status === s
                    ? "bg-orange-500/15 text-orange-400 border-orange-500/25 cursor-default"
                    : s === "CANCELLED"
                      ? "bg-gray-800 text-gray-500 border-gray-700 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                      : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                {updating ? "..." : STATUS_META[s].label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
