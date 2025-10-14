import type { Metadata } from "next";
import "./globals.css";
import { mona } from "@/lib/fonts";
import { CartProvider } from "@/components/cart-component";
import CartDrawer from "@/components/cart-drawer";

export const metadata: Metadata = {
  title: "SofaSocietyCo.",
  description: "E-commerce store with Next.js and Medusa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${mona.variable}`}>
      <body className="font-sans">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
