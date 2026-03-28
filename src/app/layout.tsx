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
  title: "Raj Electronics Secunderabad | Best AC, TV & Appliance Dealer | Bulk & Institutional Orders Accepted",
  description: "Raj Electronics — Secunderabad's trusted electronics dealer since 1995. Shop ACs, Smart TVs, Refrigerators, Washing Machines & more. Bulk orders, institutional supply & corporate procurement welcome. Call +91 92907 48866.",
  keywords: "Raj Electronics Secunderabad, bulk AC purchase Hyderabad, institutional electronics supplier Secunderabad, corporate appliance procurement Telangana, wholesale electronics dealer Hyderabad, bulk TV purchase for office, school AC supplier Hyderabad, hospital appliances supplier, bulk order electronics GST billing India, electronics shop Secunderabad, electronics dealer Hyderabad, authorized AC dealer Secunderabad, best electronics store Hyderabad, buy AC Secunderabad, split AC dealer Hyderabad, inverter AC best price Secunderabad, Samsung TV dealer Hyderabad, LG refrigerator dealer Secunderabad, washing machine shop Hyderabad, air cooler bulk purchase Hyderabad, Daikin AC dealer Hyderabad, electronics shop near Secunderabad, home appliances Trimulgherry, electronics dealer Marredpally, appliances store Bowenpally, AC shop Secundarabad",
  openGraph: {
    title: "Raj Electronics Secunderabad | Best AC, TV & Appliance Dealer | Bulk & Institutional Orders Accepted",
    description: "Raj Electronics — Secunderabad's trusted electronics dealer since 1995. Shop ACs, Smart TVs, Refrigerators, Washing Machines & more. Bulk/Institutional supply welcome.",
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
    "description": "Secunderabad's trusted electronics dealer since 1995. Authorized AC dealer, leading institutional electronics supplier, and wholesale provider for corporate orders.",
    "image": "https://rajelectronics.co/logo.png",
    "@id": "https://rajelectronics.co",
    "url": "https://rajelectronics.co",
    "telephone": "+919290748866",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Secunderabad",
      "addressRegion": "Telangana",
      "addressCountry": "India"
    },
    "openingHours": "Mo-Su 10:30-21:30"
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
