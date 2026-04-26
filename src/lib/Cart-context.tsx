"use client";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("food-hub-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("food-hub-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((meal: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.mealId === meal.mealId);
      if (existing) {
        return prev.map((i) =>
          i.mealId === meal.mealId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((mealId: string) => {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  }, []);

  const increaseQty = useCallback((mealId: string) =>
    setItems((prev) =>
      prev.map((i) =>
        i.mealId === mealId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    ), []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const decreaseQty = useCallback((mealId: string) =>
    setItems((prev) =>
      prev
        .map((i) =>
          i.mealId === mealId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    ), []);
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
