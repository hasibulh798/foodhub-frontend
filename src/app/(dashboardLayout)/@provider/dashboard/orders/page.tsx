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

type FilterStatus = OrderStatus | "ALL";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const filtered =
    filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const countByStatus = (s: OrderStatus) =>
    orders.filter((o) => o.status === s).length;

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-white">Orders</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {orders.length} total orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      <div className="px-8 py-6 flex-1">
        {/* Status Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          <FilterPill
            label="All"
            count={orders.length}
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
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
              onClick={() => setFilter(s)}
              dot={STATUS_META[s].dot}
            />
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <p className="text-4xl mb-3 opacity-30">∅</p>
            <p className="text-sm">No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={updateStatus}
                updating={updatingId === order.id}
              />
            ))}
          </div>
        )}
      </div>
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
