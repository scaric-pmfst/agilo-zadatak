"use client";

import { useCart } from "@/components/cart-component";
import Image from "next/image";
import { useEffect } from "react";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateItem, removeItem, itemsCount } =
    useCart();

  useEffect(() => {
    console.log("[CartDrawer] Render state:", {
      isCartOpen,
      itemsCount,
      cartItems: cart?.items?.length,
    });
  }, [isCartOpen, itemsCount, cart]);

  if (!isCartOpen) {
    return null;
  }

  const subtotal =
    cart?.items?.reduce((total: number, item: any) => {
      return total + item.unit_price * item.quantity;
    }, 0) || 0;

  console.log("[CartDrawer] Calculated subtotal:", subtotal);

  return (
    <>
      {/* Shopping cart drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-medium">Shopping Cart ({itemsCount})</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Debug Info
        <div className="p-4 bg-yellow-50 border-b text-xs">
          <p className="font-bold mb-1">Cart Debug Info:</p>
          <p>Cart ID: {cart?.id || "None"}</p>
          <p>Items Count: {itemsCount}</p>
          <p>Items in Array: {cart?.items?.length || 0}</p>
          <p>Subtotal: €{subtotal}</p>
          <p>Region: {cart?.region?.currency_code || "N/A"}</p>
        </div> */}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {!cart || cart.items?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item: any) => {
                console.log("[CartDrawer] Rendering item:", item);

                {
                  /* Product */
                }
                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant?.title || item.description || ""} {item.variant_title}
                      </p>

                      {/* Quantity + Price */}

                      <div className="flex items-center justify-between mt-2">
                        {/* Controls */}
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => {
                              console.log(
                                "[CartDrawer] Decreasing quantity for item:",
                                item.id
                              );
                              updateItem(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              );
                            }}
                            className="px-2 py-1 text-sm hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              console.log(
                                "[CartDrawer] Increasing quantity for item:",
                                item.id
                              );
                              updateItem(item.id, item.quantity + 1);
                            }}
                            className="px-2 py-1 text-sm hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-medium text-sm">
                          €{(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Item */}
                    <button
                      onClick={() => {
                        console.log("[CartDrawer] Removing item:", item.id);
                        removeItem(item.id);
                      }}
                      className="text-gray-400 hover:text-red-500 text-sm"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items?.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between text-lg font-medium">
              <span>Subtotal</span>
              <span>€{subtotal}</span>
            </div>

            {/* Checkout */}
            <button
              onClick={() => console.log("[CartDrawer] Checkout clicked")}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
            >
              Checkout
            </button>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
