"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as cartApi from "@/lib/cart";

interface CartContextType {
  cart: any | null;
  isLoading: boolean;
  itemsCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  console.log("[CartContext] Current state:", {
    cartId: cart?.id,
    itemsCount: cart?.items?.length,
    isLoading,
    isCartOpen,
  });

  // Total items in cart
  const itemsCount =
    cart?.items?.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    ) || 0;

  console.log("[CartContext] Items count:", itemsCount);

  // Load the cart
  useEffect(() => {
    console.log("[CartContext] Component mounted, loading cart");
    loadCart();
  }, []);

  const loadCart = async () => {
    console.log("[CartContext] Loading cart...");
    setIsLoading(true);
    try {
      const cartData = await cartApi.getCart();
      console.log("[CartContext] Cart loaded:", cartData);
      setCart(cartData);
    } catch (error) {
      console.error("[CartContext] Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh the cart
  const refreshCart = useCallback(async () => {
    console.log("[CartContext] Refreshing cart");
    await loadCart();
  }, []);

  // Add an item to the cart
  const addItem = async (variantId: string, quantity: number) => {
    console.log("[CartContext] Adding item:", { variantId, quantity });

    try {
      const updatedCart = await cartApi.addToCart(variantId, quantity);
      console.log("[CartContext] Item added, updated cart:", updatedCart);
      setCart(updatedCart);
      setIsCartOpen(true);
      console.log("[CartContext] Cart drawer opened");
    } catch (error: any) {
      console.error("[CartContext] Failed to add item:", error);

      // Detect insufficient stock error with Medusa
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";

      if (
        message.toLowerCase().includes("insufficient") ||
        message.toLowerCase().includes("inventory") ||
        message.toLowerCase().includes("stock")
      ) {
        alert("There isn't enough stock in the inventory of this item.");
      } else {
        alert("Failed to add item in the cart. Please try again.");
      }

      throw error;
    }
  };

  // Update the cart (Removed the item, lower quantity etc etc..)
  const updateItem = async (lineItemId: string, quantity: number) => {
    console.log("[CartContext] Updating item:", { lineItemId, quantity });

    try {
      const updatedCart = await cartApi.updateLineItem(lineItemId, quantity);
      console.log("[CartContext] Item updated, updated cart:", updatedCart);
      setCart(updatedCart);
    } catch (error: any) {
      console.error("[CartContext] Failed to update item:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred.";

      if (
        message.toLowerCase().includes("insufficient") ||
        message.toLowerCase().includes("inventory") ||
        message.toLowerCase().includes("stock")
      ) {
        alert("You can’t add more of this item (Not enough stock available).");
      } else {
        alert("Failed to update item. Please try again.");
      }

      throw error;
    }
  };

  // Remove item from cart
  const removeItem = async (lineItemId: string) => {
    console.log("[CartContext] Removing item:", lineItemId);

    try {
      const updatedCart = await cartApi.removeLineItem(lineItemId);
      console.log("[CartContext] Item removed, updated cart:", updatedCart);
      setCart(updatedCart);
    } catch (error) {
      console.error("[CartContext] Failed to remove item:", error);
      throw error;
    }
  };

  // Open the cart
  const openCart = () => {
    console.log("[CartContext] Opening cart drawer");
    setIsCartOpen(true);
  };

  // Close the cart
  const closeCart = () => {
    console.log("[CartContext] Closing cart drawer");
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemsCount,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateItem,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
