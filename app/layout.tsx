import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { JsonLd } from "@/components/seo/JsonLd";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import NextTopLoader from 'nextjs-toploader';
import localFont from 'next/font/local';
import Script from 'next/script';
import "./globals.css";

// All pages require ClerkProvider which needs env vars at runtime — skip static prerendering
export const dynamic = 'force-dynamic';


const primaryFont = localFont({
  src: '../public/fonts/seb-neue/SebneueRegular-eAGm.otf',
  variable: '--fpr1',
});
const primaryFontBold = localFont({
  src: '../public/fonts/seb-neue/SebneueExtrabold.otf',
  variable: '--fpr1-bold',
});
const HeadingFontBold = localFont({
  src: '../public/fonts/clear_metal.ttf',
  variable: '--heading-bold',
});
const HeartAndLove = localFont({
  src: '../public/fonts/heart.otf',
  variable: '--heart',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ea580c' },
    { media: '(prefers-color-scheme: dark)', color: '#ea580c' }
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://con-soul.in'),
  title: {
    default: "CONSOUL — Youth Group Travel India | Himalayas, Goa & More",
    template: "%s | CONSOUL"
  },
  description: "CONSOUL is India's youth group travel platform. Curated group trips to Himalayas, Goa, Rajasthan & Kerala. Starting from Bilaspur, CG. Join 300+ young travelers.",
  keywords: [
    'CONSOUL','consoul','consoul travel','consoul.in','con-soul.in',
    'youth group travel India','group trips India','adventure trips India',
    'group travel platform India','youth travel India','group tour India',
    'group trips Himalayas','Goa group trip','Rajasthan group travel',
    'group trips from Bilaspur','youth travel Chhattisgarh',
    'affordable group trips India','solo travel group India',
    'Uttarakhand group trip','Vizag group tour','Rishikesh group tour',
  ],
  authors: [{ name: "CONSOUL" }],
  creator: "CONSOUL",
  publisher: "CONSOUL",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://con-soul.in',
    siteName: 'CONSOUL',
    title: 'CONSOUL — Youth Group Travel India',
    description: "Curated group trips to Himalayas, Goa & Kerala. Join 300+ young explorers.",
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630, alt: 'CONSOUL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONSOUL — Youth Group Travel India',
    description: 'Group trips to Himalayas, Goa & more for young explorers.',
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  category: 'travel',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CONSOUL",
    "alternateName": ["consoul", "con-soul", "con-soul.in", "consoul travel"],
    "url": "https://con-soul.in",
    "logo": { "@type": "ImageObject", "url": "https://con-soul.in/images/logo.png" },
    "description": "India's youth group travel platform. Group trips to Himalayas, Goa, Rajasthan and Kerala for young explorers. Based in Bilaspur, Chhattisgarh.",
    "foundingLocation": { "@type": "Place", "name": "Bilaspur, Chhattisgarh, India" },
    "areaServed": { "@type": "Country", "name": "India" },
    "knowsAbout": ["Group Travel","Youth Travel","Adventure Tourism","Himalayan Trips","Beach Travel"],
    "sameAs": ["https://www.instagram.com/consoul.in"],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@con-soul.in",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English","Hindi"]
    }
  };

  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "CONSOUL",
    "url": "https://con-soul.in",
    "email": "hello@con-soul.in",
    "description": "India's youth group travel platform. Starting from Bilaspur, Chhattisgarh.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bilaspur",
      "addressRegion": "Chhattisgarh",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "300",
      "bestRating": "5"
    },
    "sameAs": ["https://www.instagram.com/consoul.in"]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CONSOUL",
    "url": "https://con-soul.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": "https://con-soul.in/trips?q={search_term_string}" },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Google Fonts asynchronously to prevent render-blocking */}
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" as="style" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Manifest and PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data - Organization */}
        <JsonLd data={organizationJsonLd} />
        
        {/* Structured Data - TravelAgency */}
        <JsonLd data={travelAgencyJsonLd} />

        {/* Structured Data - Website */}
        <JsonLd data={websiteJsonLd} />

        {/* Google Analytics */}
        <GoogleAnalytics />
      </head>
      <body className={`${primaryFont.variable} ${HeartAndLove.variable} ${HeadingFontBold.variable} ${primaryFontBold.variable} antialiased`}>
        <NextTopLoader showSpinner={false} />

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-600 text-white px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClerkProvider>
            <div id="main-content">
              {children}
            </div>
          </ClerkProvider>
          <Toaster />
        </ThemeProvider>
        {/* Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
