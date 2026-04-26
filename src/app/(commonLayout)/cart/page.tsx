"use client";

import { useCart } from "@/lib/Cart-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft,
  Clock,
  ShieldCheck,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, totalPrice, deliveryFee } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </motion.div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          Looks like you haven't added anything to your cart yet. Browse our delicious meals and find something you love!
        </p>
        <Button 
          onClick={() => router.push("/meals")} 
          className="rounded-full px-8 py-6 h-auto text-lg font-bold bg-orange-600 hover:bg-orange-700 transition-all shadow-xl shadow-orange-200"
        >
          Browse Meals
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 pt-10 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-50/50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-xl hover:bg-white shadow-sm border border-gray-100 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Your Cart</h1>
            <p className="text-gray-500 font-medium">{items.length} items ready for checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.mealId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm group">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Image Container */}
                        <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-500">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-10 h-10 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center sm:text-left">
                          <h2 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h2>
                          <p className="text-orange-600 font-black text-lg">{item.price} BDT</p>
                          <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 20-30 min</span>
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> Fresh</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-6">
                          <div className="flex items-center bg-gray-100/80 rounded-2xl p-1 border border-gray-200">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => decreaseQty(item.mealId)}
                              className="w-10 h-10 rounded-xl hover:bg-white hover:text-orange-600 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-black text-gray-900">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => increaseQty(item.mealId)}
                              className="w-10 h-10 rounded-xl hover:bg-white hover:text-orange-600 transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.mealId)}
                            className="w-12 h-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-10"
            >
              <Card className="border-none shadow-2xl shadow-orange-100 rounded-[2.5rem] overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white">
                  <h2 className="text-2xl font-black">Order Summary</h2>
                  <p className="text-orange-100 font-medium">Almost there! Finalize your meal</p>
                </div>
                
                <CardContent className="p-8">
                  <div className="space-y-4 mb-8 text-sm font-medium">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900 font-black">{totalPrice} BDT</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Fee</span>
                      <span className="text-gray-900 font-black">{deliveryFee} BDT</span>
                    </div>
                    <Separator className="bg-gray-100" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-gray-900">Total Payable</span>
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                        {totalPrice + deliveryFee} BDT
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      asChild
                      className="w-full rounded-2xl py-8 h-auto bg-gradient-to-r from-orange-600 to-red-600 hover:scale-[1.02] transition-all shadow-xl shadow-orange-200 group border-none"
                    >
                      <Link href="/checkout">
                        <span className="text-lg font-black uppercase tracking-widest text-white">Proceed to Checkout</span>
                        <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      Secure Transaction & Fresh Delivery
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-gray-400 opacity-50 grayscale">
                      <Truck className="w-6 h-6" />
                      <Clock className="w-6 h-6" />
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Promo Card Placeholder */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="mt-6 p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-center gap-4 cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
                  %
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Have a promo code?</h4>
                  <p className="text-xs text-blue-700">Apply it at the next step for discounts</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}