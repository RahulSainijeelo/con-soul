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
import { Inter, Montserrat, Anton } from 'next/font/google';
import Script from 'next/script';
import "./globals.css";



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

// Google Fonts — loaded via next/font (no render-blocking link tags)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' }
  ],
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://con-soul.in'),
  title: {
    default: "CONSOUL INDIA — Youth Group Travel India | Himalayas, Goa & More",
    template: "%s | CONSOUL INDIA"
  },
  description: "CONSOUL INDIA is India's youth group travel platform. Curated group trips to Himalayas, Goa, Rajasthan & Kerala. Starting from Bilaspur, CG. Join 300+ young travelers.",
  keywords: [
    'CONSOUL INDIA','CONSOUL','consoul','consoulindia','consoul india',
    'CONSOUL INDIA travel','consoul india travel','consoul travel',
    'consoul.in','con-soul.in','con-soul',
    'group trip','group trips India','group tour India',
    'strangers trip','strangers trip India','travel with strangers',
    'college students trip','college trip India','college group tour',
    'youth group travel India','youth travel India','youth travel platform',
    'adventure trips India','group travel platform India',
    'affordable group trips India','budget group trips for students',
    'solo travel group India','travel for college students India',
    'group trips Himalayas','Goa group trip','Rajasthan group travel',
    'group trips from Bilaspur','youth travel Chhattisgarh',
    'Uttarakhand group trip','Vizag group tour','Rishikesh group tour',
  ],
  authors: [{ name: "CONSOUL INDIA" }],
  creator: "CONSOUL INDIA",
  publisher: "CONSOUL INDIA",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://con-soul.in',
    siteName: 'CONSOUL INDIA',
    title: 'CONSOUL INDIA — Youth Group Travel India',
    description: "Curated group trips to Himalayas, Goa & Kerala. Join 300+ young explorers.",
    images: [{ url: '/images/og-cover.jpg', width: 1200, height: 630, alt: 'CONSOUL INDIA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CONSOUL INDIA — Youth Group Travel India',
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
    "name": "CONSOUL INDIA",
    "alternateName": ["CONSOUL", "consoul", "consoulindia", "consoul india", "con-soul", "con-soul.in", "consoul travel", "consoul india travel"],
    "url": "https://con-soul.in",
    "logo": { "@type": "ImageObject", "url": "https://con-soul.in/images/logo.png" },
    "description": "India's youth group travel platform. Group trips to Himalayas, Goa, Rajasthan and Kerala for young explorers. Based in Bilaspur, Chhattisgarh.",
    "foundingLocation": { "@type": "Place", "name": "Bilaspur, Chhattisgarh, India" },
    "areaServed": { "@type": "Country", "name": "India" },
    "knowsAbout": ["Group Travel","Youth Travel","Adventure Tourism","Himalayan Trips","Beach Travel"],
    "sameAs": ["https://www.instagram.com/consoul.in"],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "con.sol.082025@gmail.com",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English","Hindi"]
    }
  };

  const travelAgencyJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "CONSOUL INDIA",
    "url": "https://con-soul.in",
    "email": "con.sol.082025@gmail.com",
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
    "name": "CONSOUL INDIA",
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
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Manifest and PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0A0A0A" />
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
      <body className={`${primaryFont.variable} ${HeartAndLove.variable} ${HeadingFontBold.variable} ${primaryFontBold.variable} ${inter.variable} ${montserrat.variable} ${anton.variable} antialiased`}>
        <NextTopLoader showSpinner={false} />

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="dark" themes={["dark", "light"]} enableSystem={false}>
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
