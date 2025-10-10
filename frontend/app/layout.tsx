import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SofaSocietyCo.",
  description: "Next.JS + Medusa Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
