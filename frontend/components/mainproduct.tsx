"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductDetailProps {
  title: string;
  collection: string;
  price: number;
  description: string;
  materials: string[];
  colors: string[];
  images: string[];
}

export default function ProductDetail({
  title,
  collection,
  price,
  description,
  materials,
  colors,
  images,
}: ProductDetailProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <section className="flex flex-col md:flex-row min-h-screen px-6 md:px-16 py-16 md:py-24">
      {/* Image showcase */}
      <div className="md:w-1/2 flex flex-col items-center justify-center relative rounded-lg overflow-hidden">
        {/* Image container */}
        <div className="relative w-full h-[500px] md:h-[700px] flex justify-center items-center rounded-lg">
          <Image
            src={images[currentImage]}
            alt={title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />

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
          <div className="flex gap-2">
            {images.map((_, index) => (
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
        <p className="text-sm text-gray-500 mb-1">{collection}</p>
        <h1 className="text-[32px] md:text-[48px] font-medium mb-2">{title}</h1>
        <p className="text-xl md:text-2xl font-normal mb-6">€{price}</p>

        <p className="text-gray-700 mb-8 max-w-lg text-[16px] md:text-[18px] leading-relaxed">
          {description}
        </p>

        {/* Materials */}
        <div className="mb-6">
          <p className="text-gray-800 font-medium mb-2">Materials</p>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {materials.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
        </div>

        {/* Colors */}
        <div className="mb-8">
          <p className="text-gray-800 font-medium mb-3">Colors</p>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-md border transition-transform ${
                  selectedColor === color
                    ? "border-black scale-105"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Quantity and `Add to Cart` */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-lg"
            >
              -
            </button>
            <span className="px-4 text-sm">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-lg"
            >
              +
            </button>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-md text-sm hover:bg-gray-800 transition">
            Add to cart
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">Estimate delivery 2–3 days</p>
      </div>
    </section>
  );
}
