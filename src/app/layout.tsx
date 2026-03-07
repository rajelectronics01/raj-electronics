import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rajelectronics.co'),
  title: "Raj Electronics - Best Electronics Store in Secunderabad | Authorized Dealer for AC, TV & More",
  description: "Raj Electronics is the most trusted electronics shop on RP Road, Secunderabad. We offer the best prices on Split ACs, Smart TVs, Refrigerators, and Washing Machines from top brands like Sony, Samsung, Voltas, and Blue Star. Affordable EMI options available.",
  keywords: "Best electronics shop Secunderabad, authorized AC dealer Secunderabad, affordable air coolers RP Road, TV shop near Secunderabad station, washing machine dealer Hyderabad, Raj Electronics RP Road",
  openGraph: {
    title: "Raj Electronics - Best Electronics Store in Secunderabad | Authorized Dealer",
    description: "Shop for premium ACs, TVs, and home appliances at Raj Electronics, Secunderabad. Best local prices & EMI.",
    locale: "en_IN",
    type: "website",
    siteName: "Raj Electronics",
  },
  verification: {
    google: "Yc4FSnBRedB6-fU-GPfMDOLUZrBH8b98qKp5KxAqKnI",
  },
  alternates: {
    canonical: 'https://rajelectronics.co',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Raj Electronics",
    "url": "https://rajelectronics.co/"
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Raj Electronics",
    "image": "https://rajelectronics.co/logo.png",
    "@id": "https://rajelectronics.co",
    "url": "https://rajelectronics.co",
    "telephone": "+919290748866",
    "priceRange": "₹₹",
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
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-VNCW6KFZLX"
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-16932910687"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-VNCW6KFZLX');
              gtag('config', 'AW-16932910687');
            `,
          }}
        />
      </head>
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
