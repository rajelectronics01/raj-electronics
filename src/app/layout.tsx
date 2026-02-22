import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raj Electronics - Best Electronics Store in Secunderabad | AC, TV, Washing Machine",
  description: "Raj Electronics is the top electronics store in Secunderabad. Buy ACs, TVs, Refrigerators, Washing Machines with best prices and EMI options.",
  keywords: "Electronics store Secunderabad, AC shop Secunderabad, TV shop near me, Air cooler shop, Refrigerator shop",
  openGraph: {
    title: "Raj Electronics - Best Electronics Store in Secunderabad | AC, TV, Washing Machine",
    description: "Your Trusted Electronics Store in Secunderabad.",
    locale: "en_IN",
    type: "website",
  },
  verification: {
    google: "Yc4FSnBRedB6-fU-GPfMDOLUZrBH8b98qKp5KxAqKnI",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
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
