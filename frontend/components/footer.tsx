"use client";

import Link from "next/link";
import { mona } from "@/lib/fonts";

export default function Footer() {
  return (
    <footer
      className={`${mona.variable} font-sans bg-gray-50 text-gray-900 px-6 py-12 md:px-16`}
      style={{ fontFamily: "var(--font-mona)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Brand */}
        <div className="order-2 md:order-1 flex flex-col gap-2">
          <h2 className="text-[40px] font-medium leading-tight">
            Sofa <br /> Society <br /> Co.
          </h2>
          <p className="text-[12px] font-normal text-gray-500">
            © 2024, Sofa Society
          </p>
        </div>

        {/* Links */}
        <div className="order-3 md:order-2 grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2 text-[16px] font-normal">
          {/* First Row */}
          <Link href="#">FAQ</Link>
          <Link href="#">Instagram</Link>
          <Link href="#">Privacy Policy</Link>

          {/* Second Row */}
          <Link href="#">Help</Link>
          <Link href="#">TikTok</Link>
          <Link href="#">Cookie Policy</Link>

          {/* Third Row */}
          <Link href="#">Delivery</Link>
          <Link href="#">Pinterest</Link>
          <Link href="#">Terms of Use</Link>

          {/* Fourth Row */}
          <Link href="#">Returns</Link>
          <Link href="#">Facebook</Link>
        </div>

        {/* Newsletter */}
        <div className="order-1 md:order-3 max-w-sm">
          <h3 className="text-[32px] font-medium mb-1">Join our newsletter</h3>
          <p className="text-[16px] font-normal text-gray-700 mb-4">
            We will also send you our discount coupons!
          </p>

          <form className="flex mb-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-[12px] font-normal focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-r-md text-[12px] font-normal hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[12px] font-normal text-gray-500 leading-snug">
            By subscribing you agree to with our Privacy Policy and provide
            consent to receive updates from our company.
          </p>
        </div>
      </div>
    </footer>
  );
}
