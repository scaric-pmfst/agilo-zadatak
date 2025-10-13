"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart-component";

interface ProductDetailProps {
  product: any;
  regionId: string;
}

const COLOR_MAP: Record<string, string> = {
  Black: "#000000",
  "Dark Gray": "#4B5563",
  "Light Gray": "#D1D5DB",
  White: "#FFFFFF",
  Green: "#10B981",
  Purple: "#8B5CF6",
};

export default function ProductDetail({
  product,
  regionId,
}: ProductDetailProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Debug: Product data logging
  useEffect(() => {
    console.log("Full product data:", product);
    console.log("Variants:", product.variants);
    console.log("Region ID:", regionId);
  }, [product, regionId]);

  // Extract unique option values
  const colorsOption = product.options?.find((opt: any) =>
    ["color", "colors"].includes(opt.title.toLowerCase())
  );

  const materialsOption = product.options?.find((opt: any) =>
    ["material", "materials"].includes(opt.title.toLowerCase())
  );

  const colors = colorsOption?.values?.map((v: any) => v.value) || [];
  const materials = materialsOption?.values?.map((v: any) => v.value) || [];

  console.log("Colors:", colors);
  console.log("Materials:", materials);

  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || "");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  // Find the matching variant based on selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants) {
      console.log("No variants found!");
      return null;
    }

    console.log("Looking for variant with:", {
      selectedMaterial,
      selectedColor,
    });

    const found = product.variants.find((variant: any) => {
      const variantOptions = variant.options || [];

      console.log("Checking variant:", variant.title, variantOptions);

      const variantMaterial = variantOptions.find(
        (opt: any) =>
          opt.option?.title === "Materials" || opt.option?.title === "Material"
      )?.value;

      const variantColor = variantOptions.find(
        (opt: any) =>
          opt.option?.title === "Colors" || opt.option?.title === "Color"
      )?.value;

      console.log("Variant options:", { variantMaterial, variantColor });

      const matches =
        variantMaterial === selectedMaterial && variantColor === selectedColor;
      console.log("Matches:", matches);

      return matches;
    });

    console.log("Selected variant:", found);
    return found;
  }, [product.variants, selectedMaterial, selectedColor]);

  // Automatically select the first variant if nothing is selected yet
  useEffect(() => {
    if (product.variants?.length && !selectedVariant) {
      const firstVariant = product.variants[0];
      console.log("Auto-selecting first variant:", firstVariant);

      // Extract colors and materials (If they are available)
      const variantMaterial =
        firstVariant.options?.find(
          (opt: any) =>
            opt.option?.title === "Materials" ||
            opt.option?.title === "Material"
        )?.value || "";
      const variantColor =
        firstVariant.options?.find(
          (opt: any) =>
            opt.option?.title === "Colors" || opt.option?.title === "Color"
        )?.value || "";

      if (variantMaterial) {
        setSelectedMaterial(variantMaterial);
      }
      if (variantColor) {
        setSelectedColor(variantColor);
      }
    }
  }, [product.variants, selectedVariant]);

  // Get the price for the region
  const originalPrice = useMemo(() => {
    console.log("Calculating price for variant:", selectedVariant);

    if (!selectedVariant?.prices) {
      console.log("No prices found on variant");
      return 0;
    }

    console.log("Available prices:", selectedVariant.prices);

    // Try to find price with region rule
    const regionPrice = selectedVariant.prices.find(
      (p: any) => p.rules?.region_id === regionId
    );

    // If not found, get the default price (no rules)
    const defaultPrice = selectedVariant.prices.find(
      (p: any) => !p.rules || Object.keys(p.rules).length === 0
    );

    console.log("Region price:", regionPrice);
    console.log("Default price:", defaultPrice);

    const priceObj = regionPrice || defaultPrice;
    const finalPrice = priceObj ? priceObj.amount : 0;

    console.log("Final price:", finalPrice);
    return finalPrice;
  }, [selectedVariant, regionId]);

  // Calculated price (Discount)
  const calculatedPrice = useMemo(() => {
    if (!selectedVariant?.calculated_price) {
      return originalPrice;
    }

    // Calculated Price from any price list discounts
    return selectedVariant.calculated_price.calculated_amount || originalPrice;
  }, [selectedVariant, originalPrice]);

  const isOnSale = useMemo(() => {
    return calculatedPrice < originalPrice && originalPrice > 0;
  }, [calculatedPrice, originalPrice]);

  const discountPercentage = useMemo(() => {
    if (!isOnSale) {
      return 0;
    }
    return Math.round(
      ((originalPrice - calculatedPrice) / originalPrice) * 100
    );
  }, [isOnSale, originalPrice, calculatedPrice]);

  // Get inventory quantity
  const inventoryQuantity = useMemo(() => {
    console.log("Calculating inventory for variant:", selectedVariant);

    if (!selectedVariant?.inventory_items) {
      console.log("No inventory_items found");
      return 0;
    }

    console.log("Inventory items:", selectedVariant.inventory_items);

    const inventoryItem = selectedVariant.inventory_items[0];
    if (!inventoryItem?.inventory?.location_levels?.[0]) {
      console.log("No location levels found");
      return 0;
    }

    const qty =
      inventoryItem.inventory.location_levels[0].available_quantity || 0;
    console.log("Available quantity:", qty);
    return qty;
  }, [selectedVariant]);

  const images = product.images?.map((img: any) => img.url) || [];

  const handleAddToCart = async () => {
    console.log("[ProductDetail] Add to cart clicked");

    if (!selectedVariant) {
      console.warn("[ProductDetail] No variant selected");
      alert("Please select all options");
      return;
    }

    if (inventoryQuantity < quantity) {
      console.warn("[ProductDetail] Insufficient inventory:", {
        inventoryQuantity,
        quantity,
      });
      alert(`Only ${inventoryQuantity} items available in stock`);
      return;
    }

    console.log("Adding to cart:", {
      variantId: selectedVariant.id,
      quantity,
      calculatedPrice,
      sku: selectedVariant.sku,
    });

    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      console.log("[ProductDetail] Item added successfully");
      setQuantity(1); // Reset quantity
    } catch (error) {
      // No need to show another alert since CartContext is handling errors
      console.error("[ProductDetail] Failed to add item:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row min-h-screen px-6 md:px-16 py-16 md:py-24">
      {/* Image showcase */}
      <div className="md:w-1/2 flex flex-col items-center justify-center relative rounded-lg overflow-hidden">
        {/* Image container */}
        <div className="relative w-full h-[500px] md:h-[700px] flex justify-center items-center rounded-lg">
          {images.length > 0 ? (
            <Image
              src={images[currentImage]}
              alt={product.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}

          {/* Previous / Next Image */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImage(
                    currentImage === 0 ? images.length - 1 : currentImage - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentImage(
                    currentImage === images.length - 1 ? 0 : currentImage + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Image index buttons */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4">
            {images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-8 h-8 flex items-center justify-center text-sm border rounded-md transition-all ${
                  currentImage === index
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-500 hover:border-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="md:w-1/2 md:pl-16 mt-10 md:mt-0 flex flex-col justify-center">
        <p className="text-sm text-gray-500 mb-1">
          {product.subtitle || product.collection?.title || ""}
        </p>

        <h1 className="text-[32px] md:text-[48px] font-medium mb-2">
          {product.title}
        </h1>

        <div className="mb-6">
          {isOnSale ? (
            <div className="flex flex-col items-start">
              <p className="text-xl md:text-2xl text-red-600">
                €{calculatedPrice.toFixed(2)}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-lg line-through text-gray-500">
                  €{originalPrice.toFixed(2)}
                </p>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  -{discountPercentage}%
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xl md:text-2xl font-normal">
              €{calculatedPrice.toFixed(2)}
            </p>
          )}
        </div>

        <p className="text-gray-700 mb-8 max-w-lg text-[16px] md:text-[18px] leading-relaxed">
          {product.description}
        </p>

        {/* Materials */}
        {materials.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-800 font-medium mb-2">Materials</p>
            <select
              value={selectedMaterial}
              onChange={(e) => {
                console.log(
                  "[ProductDetail] Material changed to:",
                  e.target.value
                );
                setSelectedMaterial(e.target.value);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {materials.map((material: string) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div className="mb-8">
            <p className="text-gray-800 font-medium mb-3">Colors</p>
            <div className="flex gap-3">
              {colors.map((color: string) => {
                const hexColor = COLOR_MAP[color] || "#CCCCCC";
                return (
                  <button
                    key={color}
                    onClick={() => {
                      console.log("[ProductDetail] Color changed to:", color);
                      setSelectedColor(color);
                    }}
                    className={`w-10 h-10 rounded-md border-2 transition-all ${
                      selectedColor === color
                        ? "border-black ring-2 ring-black ring-offset-2"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: hexColor }}
                    aria-label={`Select color ${color}`}
                    title={color}
                  />
                );
              })}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedColor}
            </p>
          </div>
        )}

        {/* Debug info */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-xs space-y-1">
          <p className="font-bold">Product Debug Info:</p>
          <p>Selected Material: {selectedMaterial}</p>
          <p>Selected Color: {selectedColor}</p>
          <p>Variant Found: {selectedVariant ? "Yes" : "No"}</p>
          <p>Variant ID: {selectedVariant?.id || "N/A"}</p>
          <p>Variant SKU: {selectedVariant?.sku || "N/A"}</p>
          <p>Price: €{calculatedPrice}</p>
          <p>Stock: {inventoryQuantity}</p>
          <p>Quantity to Add: {quantity}</p>
          <p>Adding State: {isAdding ? "Yes" : "No"}</p>
        </div>

        {/* Stock and Variant SKU */}
        {selectedVariant && (
          <div className="mb-4 space-y-1">
            <p className="text-sm text-gray-600">
              SKU:{" "}
              <span className="font-medium">
                {selectedVariant.sku || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Stock:{" "}
              <span
                className={`font-medium ${
                  inventoryQuantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {inventoryQuantity > 0
                  ? `${inventoryQuantity} available`
                  : "Out of stock"}
              </span>
            </p>
          </div>
        )}

        {/* Quantity and `Add to cart`/˙Out of stock` */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-lg hover:bg-gray-50"
              disabled={!selectedVariant || inventoryQuantity === 0 || isAdding}
            >
              -
            </button>
            <span className="px-4 text-sm min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity(Math.min(inventoryQuantity, quantity + 1))
              }
              className="px-3 py-2 text-lg hover:bg-gray-50"
              disabled={!selectedVariant || inventoryQuantity === 0 || isAdding}
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || inventoryQuantity === 0 || isAdding}
            className="bg-black text-white px-8 py-3 rounded-md text-sm hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAdding
              ? "Adding..."
              : inventoryQuantity === 0
              ? "Out of stock"
              : "Add to cart"}
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">Estimate delivery 2–3 days</p>
      </div>
    </section>
  );
}
