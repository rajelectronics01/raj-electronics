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
import MobileCTA from "@/components/ui/MobileCTA";

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
  title: "Raj Electronics Secunderabad | Best AC, TV & Appliance Dealer | Bulk Orders Accepted",
  description: "Raj Electronics — Secunderabad's trusted electronics dealer since 1995. Split AC, Smart TV, Refrigerator, Washing Machine, Air Cooler & more. Bulk & institutional orders welcome. Call +91 92907 48866.",
  keywords: [
    // Core store identity
    "Raj Electronics Secunderabad", "Raj Electronics RP Road", "Raj Electronics Hyderabad",
    "electronics store in Hyderabad", "best electronics store in Hyderabad",
    "electronics store in Secunderabad", "best electronics store in Secunderabad",
    "electronics shop in Secunderabad", "electronics showroom in Secunderabad",
    "electronics dealer Secunderabad", "electronics dealer Hyderabad",
    "home appliances store Hyderabad", "appliance store Secunderabad",
    // Local landmarks
    "electronics store in RP Road", "electronics store in Rashtrapati Road",
    "electronics store in Bhoiguda", "electronics store Clock Tower Secunderabad",
    "electronics store Rani Gunj", "electronics store MG Road Secunderabad",
    // AC - core
    "ac dealer Secunderabad", "ac dealer Hyderabad", "air conditioner dealer Secunderabad",
    "split ac dealer Secunderabad", "split ac dealer Hyderabad", "inverter ac dealer Secunderabad",
    "inverter ac dealer Hyderabad", "window ac dealer Secunderabad",
    "1 ton ac dealer Secunderabad", "1.5 ton ac dealer Secunderabad", "2 ton ac dealer Secunderabad",
    "authorized AC dealer Secunderabad", "best AC price Secunderabad",
    "air conditioner Secunderabad near me", "air conditioner Secunderabad best price",
    "air conditioner Secunderabad with installation", "air conditioner Secunderabad authorized dealer",
    // Brand AC
    "LG ac dealer in Secunderabad", "LG split ac dealer in Secunderabad", "LG inverter ac dealer in Secunderabad",
    "Samsung ac dealer in Secunderabad", "Daikin ac dealer in Secunderabad", "Daikin ac dealer Hyderabad",
    "Voltas ac dealer in Secunderabad", "Blue Star ac dealer in Secunderabad",
    "LG ac dealer in Hyderabad", "Samsung ac dealer in Hyderabad",
    "Voltas ac dealer in Hyderabad", "Blue Star ac dealer in Hyderabad",
    // Air cooler
    "air cooler dealer Secunderabad", "air cooler shop Secunderabad",
    "desert air cooler dealer Secunderabad", "personal air cooler dealer Secunderabad",
    "tower air cooler dealer Secunderabad", "air cooler Secunderabad near me",
    "air cooler Secunderabad best price", "air cooler bulk purchase Hyderabad",
    "Symphony air cooler dealer Secunderabad", "Bajaj air cooler dealer Secunderabad",
    // TV
    "smart tv dealer Secunderabad", "led tv shop Secunderabad", "television showroom Secunderabad",
    "4k tv dealer Secunderabad", "Google tv dealer Secunderabad",
    "Samsung tv dealer Secunderabad", "LG tv dealer Secunderabad", "LG 4k tv dealer in Secunderabad",
    "smart tv Secunderabad near me", "led tv Secunderabad best price", "4k tv Secunderabad best price",
    "bulk TV purchase for office", "office tv supplier Hyderabad",
    // Refrigerator
    "refrigerator dealer Secunderabad", "fridge shop Secunderabad",
    "double door refrigerator dealer Secunderabad", "single door refrigerator dealer Secunderabad",
    "frost free refrigerator dealer Secunderabad", "LG refrigerator dealer Secunderabad",
    "Samsung refrigerator dealer Secunderabad", "refrigerator Secunderabad near me",
    // Washing machine
    "washing machine dealer Secunderabad", "washing machine shop Hyderabad",
    "top load washing machine dealer Secunderabad", "front load washing machine dealer Secunderabad",
    "semi automatic washing machine shop Secunderabad", "fully automatic washing machine dealer Secunderabad",
    "LG washing machine dealer Secunderabad", "Samsung washing machine dealer Secunderabad",
    // B2B / bulk
    "bulk AC purchase Hyderabad", "institutional electronics supplier Secunderabad",
    "corporate appliance procurement Telangana", "wholesale electronics dealer Hyderabad",
    "wholesale electronics dealer Secunderabad", "bulk electronics supplier Secunderabad",
    "school AC supplier Hyderabad", "hospital appliance supplier Hyderabad",
    "gst billing electronics store Hyderabad", "bulk order electronics GST billing India",
    // AEO / question
    "where to buy ac in secunderabad", "best tv showroom in secunderabad",
    "who sells daikin ac in hyderabad", "where to buy lg tv in secunderabad",
    "best appliance store near rp road", "authorized ac dealer secunderabad",
  ].join(", "),
  openGraph: {
    title: "Raj Electronics Secunderabad | Best AC, TV & Appliance Dealer | Bulk Orders Accepted",
    description: "Raj Electronics — Secunderabad's trusted electronics dealer since 1995. Split AC, Smart TV, Refrigerator, Washing Machine, Air Cooler & more. Bulk & institutional orders welcome. Call +91 92907 48866.",
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
    "alternateName": [
      "Raj Electronics Secunderabad",
      "Raj Electronics RP Road",
      "Raj Electronics Rashtrapati Road",
      "Best AC Dealer Secunderabad",
      "Best Electronics Store Hyderabad",
      "Authorized Electronics Dealer Secunderabad"
    ],
    "url": "https://rajelectronics.co/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rajelectronics.co/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": "Raj Electronics",
    "description": "Raj Electronics is Secunderabad's authorized electronics dealer since 1995. Specializing in Split AC, Smart TV, Refrigerator, Washing Machine, Air Cooler & more. Bulk and institutional orders welcome across Hyderabad, Secunderabad, Bhoiguda, Rani Gunj, Ameerpet, Koti, Kukatpally, Madhapur, Miyapur, and all of Telangana.",
    "image": "https://rajelectronics.co/logo.png",
    "@id": "https://rajelectronics.co",
    "url": "https://rajelectronics.co",
    "telephone": "+919290748866",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "7-1-949 Rashtrapati Rd",
      "addressLocality": "Secunderabad",
      "addressRegion": "Telangana",
      "postalCode": "500003",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4432,
      "longitude": 78.4981
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "10:30",
        "closes": "21:30"
      }
    ],
    "areaServed": [
      "Secunderabad", "Hyderabad", "RP Road", "Rashtrapati Road", "Bhoiguda",
      "Clock Tower Secunderabad", "Rani Gunj", "MG Road Secunderabad",
      "Ameerpet", "Koti", "Kukatpally", "Madhapur",
      "Miyapur", "Attapur", "Kothapet", "Himayat Nagar",
      "RTC X Roads", "Alwal", "Toli Chowki"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Electronics & Home Appliances",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Split Air Conditioner" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Smart Television" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Refrigerator" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Washing Machine" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Air Cooler" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Water Dispenser" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Chest Freezer" } },
        { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Voltage Stabilizer" } }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "312"
    },
    "sameAs": [
      "https://g.co/kgs/rajelectronicssecunderabad"
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
            <MobileCTA />
            <WhatsAppButton />
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
