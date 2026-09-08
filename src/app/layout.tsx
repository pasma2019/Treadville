import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import CartDrawer from "@/components/CartDrawer";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getCategories } from "@/lib/queries";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/structured-data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Treadville — Premium Kenyan Agricultural Products",
    template: "%s · Treadville",
  },
  description:
    "Specialty coffee, tea, horticulture, and grains sourced across Kenya's volcanic highlands and fertile plains. Traceable origins. Exceptional quality.",
  keywords: [
    "Kenyan coffee",
    "specialty coffee Kenya",
    "Kenyan tea",
    "Kenyan agricultural export",
    "Kirinyaga coffee",
    "Mt Kenya coffee",
    "Treadville",
    "Kenya coffee exporter",
    "Kenyan horticulture",
    "Kenyan grains",
  ],
  authors: [{ name: "Treadville Company Limited" }],
  creator: "Treadville Company Limited",
  publisher: "Treadville Company Limited",
  metadataBase: new URL("https://treadville.co.ke"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "https://treadville.co.ke",
    siteName: "Treadville",
    title: "Treadville — Premium Kenyan Agricultural Products",
    description:
      "Specialty coffee, tea, horticulture, and grains sourced across Kenya's volcanic highlands.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Treadville — From Kenyan soil to global markets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Treadville — Premium Kenyan Agricultural Products",
    description:
      "Specialty coffee, tea, horticulture, and grains sourced across Kenya's volcanic highlands.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <CartProvider>
          <LanguageProvider>
            <SiteHeader categories={categories} />
            {children}
            <SiteFooter />
            <CartDrawer />
          </LanguageProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
