import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raj Electronics - Best Electronics Store in Secunderabad | Authorized Dealer for AC, TV & More",
  description: "Raj Electronics is the most trusted electronics shop on RP Road, Secunderabad. We offer the best prices on Split ACs, Smart TVs, Refrigerators, and Washing Machines from top brands like Sony, Samsung, Voltas, and Blue Star. Affordable EMI options available.",
  keywords: "Best electronics shop Secunderabad, authorized AC dealer Secunderabad, affordable air coolers RP Road, TV shop near Secunderabad station, washing machine dealer Hyderabad, Raj Electronics RP Road",
  openGraph: {
    title: "Raj Electronics - Best Electronics Store in Secunderabad | Authorized Dealer",
    description: "Shop for premium ACs, TVs, and home appliances at Raj Electronics, Secunderabad. Best local prices & EMI.",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Raj Electronics",
  "image": "https://rajelectronics.com/logo.png",
  "@id": "https://rajelectronics.com",
  "url": "https://rajelectronics.com",
  "telephone": "+919290748866",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "RP Road",
    "addressLocality": "Secunderabad",
    "addressRegion": "Telangana",
    "postalCode": "500003",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 17.447,
    "longitude": 78.498
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "10:30",
    "closes": "21:30"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main style={{ minHeight: 'calc(100vh - 300px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
