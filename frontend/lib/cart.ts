import medusa, { DEFAULT_REGION_ID } from "./medusa";

const CART_ID_KEY = "medusa_cart_id";

// Get Cart ID from LocalStorage
export function getCartId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const cartId = localStorage.getItem(CART_ID_KEY);
  console.log("[Cart] Getting cart ID from localStorage:", cartId);
  return cartId;
}

// Set Cart ID in LocalStorage
export function setCartId(cartId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  console.log("[Cart] Setting cart ID in localStorage:", cartId);
  localStorage.setItem(CART_ID_KEY, cartId);
}

// Clear Cart ID from LocalStorage
export function clearCartId(): void {
  if (typeof window === "undefined") {
    return;
  }
  console.log("[Cart] Clearing cart ID from localStorage");
  localStorage.removeItem(CART_ID_KEY);
}

// Create a new Cart
export async function createCart(regionId: string = DEFAULT_REGION_ID) {
  console.log("[Cart] Creating new cart with region:", regionId);

  try {
    const { cart } = await medusa.store.cart.create({
      region_id: regionId,
    });

    console.log("[Cart] Cart created successfully:", cart);
    setCartId(cart.id);
    return cart;
  } catch (error) {
    console.error("[Cart] Error creating cart:", error);
    throw error;
  }
}

// Get or create Cart if missing
export async function getOrCreateCart(regionId: string = DEFAULT_REGION_ID) {
  console.log("[Cart] Getting or creating cart");
  const cartId = getCartId();

  if (cartId) {
    try {
      console.log("[Cart] Attempting to retrieve existing cart:", cartId);
      const { cart } = await medusa.store.cart.retrieve(cartId);
      console.log("[Cart] Cart retrieved successfully:", cart);
      return cart;
    } catch (error) {
      console.error("[Cart] Error retrieving cart, creating new one:", error);
      clearCartId();
    }
  }

  return await createCart(regionId);
}

// Add an item to the cart using createLineItem (Only 1 item)
export async function addToCart(variantId: string, quantity: number = 1) {
  console.log("[Cart] Adding to cart:", { variantId, quantity });

  const cart = await getOrCreateCart();
  console.log("[Cart] Using cart:", cart.id);

  try {
    const { cart: updatedCart } = await medusa.store.cart.createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      }
    );

    console.log("[Cart] Item added successfully. Updated cart:", updatedCart);
    return updatedCart;
  } catch (error) {
    console.error("[Cart] Error adding item to cart:", error);
    throw error;
  }
}

// Update item quantity using updateLineItem
export async function updateLineItem(lineItemId: string, quantity: number) {
  console.log("[Cart] Updating line item:", { lineItemId, quantity });

  const cartId = getCartId();
  if (!cartId) {
    console.error("[Cart] No cart ID found");
    throw new Error("No cart found");
  }

  try {
    const { cart } = await medusa.store.cart.updateLineItem(
      cartId,
      lineItemId,
      { quantity }
    );

    console.log("[Cart] Line item updated successfully:", cart);
    return cart;
  } catch (error) {
    console.error("[Cart] Error updating line item:", error);
    throw error;
  }
}

// Remove item from the Cart using deleteLineItem
export async function removeLineItem(lineItemId: string) {
  console.log("[Cart] Removing line item:", lineItemId);

  const cartId = getCartId();
  if (!cartId) {
    console.error("[Cart] No cart ID found");
    throw new Error("No cart found");
  }

  try {
    // deleteLineItem doesn't return the cart, just a success response
    const deleteResponse = await medusa.store.cart.deleteLineItem(
      cartId,
      lineItemId
    );

    console.log("[Cart] Delete response:", deleteResponse);
    console.log("[Cart] Line item deleted successfully");

    // Fetch the updated cart separately
    const { cart } = await medusa.store.cart.retrieve(cartId);
    console.log("[Cart] Cart retrieved after deletion:", cart);
    return cart;
  } catch (error) {
    console.error("[Cart] Error removing line item:", error);
    throw error;
  }
}

// Get the cart with items
export async function getCart() {
  console.log("[Cart] Getting cart");

  const cartId = getCartId();
  if (!cartId) {
    console.log("[Cart] No cart ID found, returning null");
    return null;
  }

  try {
    const { cart } = await medusa.store.cart.retrieve(cartId);
    console.log("[Cart] Cart retrieved:", cart);
    return cart;
  } catch (error) {
    console.error("[Cart] Error getting cart:", error);
    clearCartId();
    return null;
  }
}

// Debug Function
export function debugCart() {
  const cartId = getCartId();
  console.group("Cart Debug Info");
  console.log("Cart ID:", cartId);
  console.log("Exists in localStorage:", !!cartId);
  console.log("Storage Key:", CART_ID_KEY);
  console.log("Available cart methods:", Object.keys(medusa.store.cart));
  console.groupEnd();
  return cartId;
}
