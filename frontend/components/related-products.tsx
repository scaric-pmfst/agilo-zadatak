"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface RelatedProductsProps {
  products: any[];
  regionId: string;
}

export default function RelatedProducts({
  products,
  regionId,
}: RelatedProductsProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-white text-black">
      <h2 className="text-[28px] md:text-[36px] font-semibold mb-10">
        Related products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} regionId={regionId} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  regionId,
}: {
  product: any;
  regionId: string;
}) {
  // Get the first variant
  const displayVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }
    return product.variants[0];
  }, [product.variants]);

  // Calculate pricing (same as ProductDetail)
  const { originalPrice, calculatedPrice, isOnSale, discountPercentage } =
    useMemo(() => {
      if (!displayVariant?.prices) {
        return {
          originalPrice: 0,
          calculatedPrice: 0,
          isOnSale: false,
          discountPercentage: 0,
        };
      }

      // Try to find price with region rule
      const regionPrice = displayVariant.prices.find(
        (p: any) => p.rules?.region_id === regionId
      );

      // If not found, use the default price
      const defaultPrice = displayVariant.prices.find(
        (p: any) => !p.rules || Object.keys(p.rules).length === 0
      );

      const priceObj = regionPrice || defaultPrice;
      const original = priceObj ? priceObj.amount : 0;

      // Calculate price with discounts (if there are any)
      const calculated = displayVariant.calculated_price?.calculated_amount
        ? displayVariant.calculated_price.calculated_amount
        : original;

      const onSale = calculated < original && original > 0;
      const discount = onSale
        ? Math.round(((original - calculated) / original) * 100)
        : 0;

      return {
        originalPrice: original,
        calculatedPrice: calculated,
        isOnSale: onSale,
        discountPercentage: discount,
      };
    }, [displayVariant, regionId]);

  // Get the first image of the product
  const imageUrl = product.images?.[0]?.url || "";

  // Get product title and subtitle
  const title = product.title || "Untitled Product";
  const subtitle = product.subtitle || product.collection?.title || "Product";

  return (
    <Link href="" className="flex flex-col group cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50 shadow-sm">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Details and Price */}
      <div className="mt-5 flex justify-between items-start gap-2">
        {/* Details (Left Side) */}
        <div className="flex-1">
          <h3 className="text-gray-900 text-sm font-medium mb-0.5 opacity-80">
            {subtitle}
          </h3>
          <p className="text-[16px] md:text-[18px] font-medium text-gray-900 group-hover:underline">
            {title}
          </p>
        </div>

        {/* Price (Right Side) */}
        <div className="text-right flex-shrink-0">
          {isOnSale ? (
            <>
              <p className="text-lg md:text-xl text-red-600 font-medium">
                €{calculatedPrice.toFixed(2)}
              </p>
              <p className="text-sm md:text-base line-through text-gray-500">
                €{originalPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-lg md:text-xl text-gray-800">
              €{calculatedPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
