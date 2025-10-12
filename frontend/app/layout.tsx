import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
