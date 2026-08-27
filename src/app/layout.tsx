import type { Metadata } from "next";
import { Fraunces, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/queries";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Archivo({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Treadville — Premium African Products",
  description:
    "Specialty coffee, tea, horticulture, and grains — sourced across Kenya's volcanic highlands and fertile plains.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader categories={categories} />
          {children}
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
