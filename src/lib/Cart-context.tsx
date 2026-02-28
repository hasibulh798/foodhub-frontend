"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export interface CartItem {
  mealId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (meal: Omit<CartItem, "quantity">) => void;
  removeItem: (mealId: string) => void;
  clearCart: () => void;
  increaseQty: (mealId: string) => void;
  decreaseQty: (mealId: string) => void;
  count: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (meal: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.mealId === meal.mealId);
      if (existing) {
        return prev.map((i) =>
          i.mealId === meal.mealId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
  };

  const removeItem = (mealId: string) => {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  };
  const increaseQty = (mealId: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.mealId === mealId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    );
  const clearCart = () => {
    setItems([]);
  };
  const decreaseQty = (mealId: string) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.mealId === mealId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        increaseQty,
        decreaseQty,
        count,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
