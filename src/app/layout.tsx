import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raj Electronics - Best Electronics Store in Secunderabad",
  description: "Shop the best electronics at Raj Electronics, Secunderabad. ACs, TVs, Refrigerators, and more. 4.9 Star Rating. Visit us today!",
  keywords: "Electronics store Secunderabad, AC shop Secunderabad, TV shop near me, Air cooler shop, Refrigerator shop",
  openGraph: {
    title: "Raj Electronics - Secunderabad",
    description: "Your Trusted Electronics Store in Secunderabad.",
    locale: "en_IN",
    type: "website",
  },
  verification: {
    google: "Yc4FSnBRedB6-fU-GPfMDOLUZrBH8b98qKp5KxAqKnI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
