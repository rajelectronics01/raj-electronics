import type { Metadata, Viewport } from "next";
import { Inter, DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Script from "next/script";
import { UserProvider } from "@/context/UserContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/ui/CartDrawer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: '--font-dm' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ['700'], display: "swap", variable: '--font-playfair' });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ['400'], display: "swap", variable: '--font-mono' });

export const viewport: Viewport = {
  themeColor: '#111827',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rajelectronics.co'),
  title: "Raj Electronics - Best Electronics Store in Secunderabad | Authorized Dealer for AC, TV, Cooler & More",
  description: "Raj Electronics on RP Road, Secunderabad — your trusted dealer for Split ACs, Smart TVs, Air Coolers, Refrigerators, Washing Machines, Mobile Phones & Home Appliances. Authorized dealer for LG, Voltas, Samsung, Daikin, Lloyd, Carrier, Hitachi, O-General & more. Lowest price guaranteed with easy EMI options. Visit us near Secunderabad Railway Station, Hyderabad.",
  keywords: "Raj Electronics Secunderabad, electronics shop RP Road Secunderabad, AC dealer Secunderabad, air conditioner price Secunderabad, Voltas AC dealer Hyderabad, LG AC dealer Secunderabad, Samsung TV dealer Secunderabad, split AC Hyderabad, best air cooler price Secunderabad, air cooler dealer Secunderabad, refrigerator showroom Secunderabad, washing machine dealer Hyderabad, home appliances store near me Secunderabad, LED TV shop Secunderabad, mobile phone shop Secunderabad, authorized electronics dealer Hyderabad, O-General AC Secunderabad, Daikin AC dealer Hyderabad, Hitachi AC Secunderabad, Mitsubishi AC dealer, Carrier AC dealer Secunderabad, Bluestar AC dealer, chest freezer dealer Hyderabad, water dispenser shop Secunderabad, Lloyd AC dealer Secunderabad, inverter AC price Hyderabad, 1.5 ton AC best price Secunderabad, electronics on EMI Secunderabad, cheap electronics Secunderabad, electronics near railway station Secunderabad",
  openGraph: {
    title: "Raj Electronics - Best Electronics Dealer in Secunderabad | AC, TV, Coolers & Appliances",
    description: "Shop ACs, Smart TVs, Air Coolers, Refrigerators, Washing Machines & Mobile Phones at Raj Electronics, RP Road Secunderabad. Authorized dealer for LG, Voltas, Samsung, Daikin, Hitachi & more. Best price + EMI available.",
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
    "alternateName": ["Raj Electronics Secunderabad", "Raj Electronics RP Road", "Best AC Dealer Secunderabad"],
    "url": "https://rajelectronics.co/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rajelectronics.co/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Raj Electronics",
    "description": "Raj Electronics is Secunderabad's most trusted electronics dealer on RP Road, offering Air Conditioners, Smart TVs, Air Coolers, Refrigerators, Washing Machines, Mobile Phones and Home Appliances at the lowest prices with easy EMI. Authorized dealer for LG, Voltas, Samsung, Daikin, Lloyd, Carrier, O-General, Hitachi, Mitsubishi, Bluestar and more.",
    "image": "https://rajelectronics.co/logo.png",
    "@id": "https://rajelectronics.co",
    "url": "https://rajelectronics.co",
    "telephone": "+919290748866",
    "priceRange": "₹₹",
    "hasMap": "https://maps.google.com/?q=Raj+Electronics+RP+Road+Secunderabad",
    "servesCuisine": null,
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
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "10:30",
      "closes": "21:30"
    },
    "sameAs": [
      "https://rajelectronics.co"
    ]
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
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
      <body className={`${inter.className} ${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
        <UserProvider>
          <CartProvider>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            <CartDrawer />
            <main style={{ minHeight: 'calc(100vh - 300px)' }}>
              {children}
            </main>
            <WhatsAppButton />
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
