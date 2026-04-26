"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/Cart-context";
import { orderService, OrderTypes } from "@/services/order.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ChevronLeft,
  CheckCircle2,
  Wallet,
  ShieldCheck,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCart();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [loading, setLoading] = useState(false);

  const subtotalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 120;
  const totalPrice = subtotalPrice + deliveryFee;

  const handleOrder = async () => {
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    const orderPayload = {
      phone,
      paymentMethod,
      deliveryAddress,
      Items: cartItems.map((item) => ({
        mealId: item.mealId,
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);
      const res = await orderService.createOrder(orderPayload as OrderTypes);

      // ONLINE payment → backend returns paymentUrl → redirect to SSLCommerz
      if (paymentMethod === "ONLINE") {
        if (res?.paymentUrl) {
          clearCart();
          window.location.href = res.paymentUrl;
        } else {
          toast.error("Could not get payment URL. Please try again.");
        }
        return;
      }

      // COD → clear cart and go to success page
      clearCart();
      toast.success("Order placed successfully! 🎉");
      router.push("/order-success");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">
          Add some delicious meals to your cart before checking out.
        </p>
        <Button onClick={() => router.push("/meals")} className="rounded-full px-8">
          Browse Meals
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl hover:bg-white shadow-sm border border-gray-100 transition-all active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Finalize Order
            </h1>
            <p className="text-gray-500 font-medium">
              Fast, secure, and reliable delivery
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-white/50 border-b border-gray-100/50 p-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">
                      Phone Number
                    </Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g. +88017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-12 h-14 rounded-2xl border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-sm font-bold text-gray-700 ml-1">
                      Complete Address
                    </Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-5 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <textarea
                        id="address"
                        placeholder="House No, Street, Area, City"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full min-h-[120px] pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/50 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none text-base shadow-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm">
                <CardHeader className="bg-white/50 border-b border-gray-100/50 p-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                    <div className="p-2 bg-orange-100 rounded-xl">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                    </div>
                    Payment Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`relative flex flex-col items-start p-6 rounded-3xl border-2 transition-all duration-300 text-left group ${
                        paymentMethod === "COD"
                          ? "border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100"
                          : "border-gray-100 hover:border-orange-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <div className={`p-3 rounded-2xl mb-4 transition-colors ${
                        paymentMethod === "COD"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                          : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600"
                      }`}>
                        <Wallet className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg text-gray-900">Cash on Delivery</span>
                      <span className="text-sm text-gray-500 mt-1 font-medium">Pay when your food arrives</span>
                      {paymentMethod === "COD" && (
                        <motion.div layoutId="activePayment" className="absolute top-6 right-6">
                          <CheckCircle2 className="w-6 h-6 text-orange-500" />
                        </motion.div>
                      )}
                    </button>

                    {/* ONLINE */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ONLINE")}
                      className={`relative flex flex-col items-start p-6 rounded-3xl border-2 transition-all duration-300 text-left group ${
                        paymentMethod === "ONLINE"
                          ? "border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100"
                          : "border-gray-100 hover:border-orange-200 bg-white hover:shadow-md"
                      }`}
                    >
                      <div className={`p-3 rounded-2xl mb-4 transition-colors ${
                        paymentMethod === "ONLINE"
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                          : "bg-gray-100 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600"
                      }`}>
                        <CreditCard className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg text-gray-900">Online Payment</span>
                      <span className="text-sm text-gray-500 mt-1 font-medium">Cards, Mobile Banking & more</span>
                      {paymentMethod === "ONLINE" && (
                        <motion.div layoutId="activePayment" className="absolute top-6 right-6">
                          <CheckCircle2 className="w-6 h-6 text-orange-500" />
                        </motion.div>
                      )}
                    </button>
                  </div>

                  {/* ONLINE notice */}
                  <AnimatePresence>
                    {paymentMethod === "ONLINE" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <ShieldCheck className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-blue-700 font-medium">
                            You will be redirected to SSLCommerz secure payment gateway to complete your payment via card, bKash, Nagad, Rocket, and more.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-none shadow-2xl shadow-orange-100 rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
                    <CardTitle className="flex items-center gap-3 text-2xl font-black">
                      <ShoppingBag className="w-6 h-6" />
                      Order Summary
                    </CardTitle>
                    <p className="text-orange-100 text-sm font-medium mt-1">
                      Review items before confirmation
                    </p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-5 max-h-[350px] overflow-y-auto pr-3 mb-8 custom-scrollbar">
                      <AnimatePresence>
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.mealId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex justify-between items-center group"
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </span>
                              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="font-black text-gray-900">
                              {item.price * item.quantity} BDT
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Items Subtotal</span>
                        <span className="text-gray-800">{subtotalPrice} BDT</span>
                      </div>
                      <div className="flex justify-between text-gray-500 font-medium">
                        <span>Standard Delivery</span>
                        <span className="text-gray-800">{deliveryFee} BDT</span>
                      </div>
                      <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-100">
                        <span className="text-xl font-black text-gray-900">Total Payable</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                          {totalPrice} BDT
                        </span>
                      </div>
                    </div>

                    <div className="mt-10 space-y-6">
                      <Button
                        onClick={handleOrder}
                        disabled={loading}
                        className="w-full h-16 text-lg font-black rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-orange-200 flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-[3px] border-white border-t-transparent rounded-full"
                            />
                            {paymentMethod === "ONLINE" ? "Redirecting to payment..." : "Placing order..."}
                          </>
                        ) : (
                          <>
                            {paymentMethod === "ONLINE" ? "Pay Now" : "Place Order"}
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </Button>

                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
                          <ShieldCheck className="w-4 h-4 text-green-500" />
                          Encrypted & Secure
                        </div>
                        <div className="flex items-center gap-4 grayscale opacity-40">
                          <Truck className="w-6 h-6" />
                          <Clock className="w-6 h-6" />
                          <Star className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e2e2; }
      `}</style>
    </div>
  );
}