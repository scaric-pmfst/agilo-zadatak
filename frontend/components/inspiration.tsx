"use client";

import Image from "next/image";
import { mona } from "@/lib/fonts";
import image1 from "@/public/inspiration/image1.png";
import image2 from "@/public/inspiration/image2.png";
import image3 from "@/public/inspiration/image3.png";

export default function CollectionInspiration() {
  return (
    <section
      className={`${mona.variable} font-sans px-6 md:px-16 py-16 space-y-12 md:space-y-16`}
      style={{ fontFamily: "var(--font-mona)" }}
    >
      {/* Title */}
      <h2 className="text-[32px] md:text-[48px] font-medium">
        Collection Inspired Interior
      </h2>

      {/* Image 1 */}
      <div className="w-full overflow-hidden rounded-lg">
        <Image
          src={image1}
          alt="Setup Image 1"
          className="w-full h-auto rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
          priority
        />
      </div>

      {/* Image 2 */}
      <div className="w-full overflow-hidden rounded-lg">
        <Image
          src={image2}
          alt="Setup Image 2"
          className="w-full h-auto rounded-lg object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      </div>

      {/* Image 3 + Text */}
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2 max-w-[500px] overflow-hidden rounded-lg">
          <Image
            src={image3}
            alt="Setup Image 3"
            className="w-full h-auto rounded-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 space-y-3 md:space-y-4 text-left md:text-left">
          <h3 className="text-[32px] md:text-[48px] font-medium leading-snug">
            The Paloma Haven sofa is a masterpiece of minimalism and luxury.
          </h3>
          <p className="text-[18px] md:text-[24px] font-normal text-gray-700">
            See more out of ‘Modern Luxe’ collection
          </p>
        </div>
      </div>
    </section>
  );
}