"use client";
import Link from "next/link";
import { useState } from "react";
import { mona } from "@/lib/fonts";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={`${mona.className} w-full border-b border-gray-200 px-6 py-4 bg-white flex justify-between items-center relative`}
    >
      {/* Logo/Company Name */}
      <div className="text-lg font-medium text-[#050505]">
        <Link href="/">SofaSocietyCo.</Link>
      </div>

      {/* Menu (Desktop) */}
      <div className="hidden md:flex gap-8 text-[#050505] font-normal">
        <Link href="#">About</Link>
        <Link href="#">Inspiration</Link>
        <Link href="#">Shop</Link>
      </div>

      {/* Icons (Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-[#050505] font-normal">
        <Link href="#" className="flex items-center gap-1">
          HR <span className="text-xs">▼</span>
        </Link>
        <Link href="#">
          {/* Search */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
        </Link>
        <Link href="#">
          {/* Cart */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
            />
          </svg>
        </Link>
      </div>

      {/* Menu (Mobile) */}
      <div className="md:hidden flex items-center gap-4">
        {/* Cart (Always Visible/Not included in hamburger)*/}
        <Link href="#" className="text-[#050505]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9"
            />
          </svg>
        </Link>

        {/* Hamburger menu*/}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[#050505] focus:outline-none"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Expanded Hamburger Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-gray-200 text-[#050505] md:hidden flex flex-col gap-4 p-4 z-10 font-normal">
          <Link href="#" className="flex items-center gap-1">
            Search
          </Link>
          <Link href="#">About</Link>
          <Link href="#">Inspiration</Link>
          <Link href="#">Shop</Link>
          <Link href="#" className="flex items-center gap-1">
            HR <span className="text-xs">▼</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
