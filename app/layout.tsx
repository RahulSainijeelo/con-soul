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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://con-soul.in'),

  title: {
    default: "con-soul | Expeditions for the Soul",
    template: "%s | Con-Soul"
  },
  description: "Join con-soul for immersive travel experiences. Discover your next adventure with our curated expeditions and journeys designed for the soul.",

  keywords: [
    "travel", "expeditions", "adventure", "soul journeys", "con-soul", "trips", "tours", "spiritual travel", "cultural expeditions"
  ],

  authors: [
    { name: "con-soul Team" },
    { name: "Antaryah" }
  ],
  creator: "con-soul",
  publisher: "con-soul",

  alternates: {
    canonical: '/',
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: "con-soul | Expeditions for the Soul",
    description: "Join con-soul for immersive travel experiences. Discover your next adventure with our curated expeditions and journeys designed for the soul.",
    siteName: 'con-soul',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'con-soul Expeditions',
        type: 'image/jpeg',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@con-soul',
    creator: '@con-soul',
    title: "con-soul | Expeditions for the Soul",
    description: "Join con-soul for immersive travel experiences. Discover your next adventure with our curated expeditions and journeys designed for the soul.",
    images: ['/twitter-image.jpg'],
  },

  // App-specific
  applicationName: 'con-soul',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'con-soul',
  },

  // Verification
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
    yandex: process.env.YANDEX_VERIFICATION_ID,
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_VERIFICATION_ID || '',
      'pinterest-site-verification': process.env.PINTEREST_VERIFICATION_ID || '',
    },
  },

  // Additional metadata
  category: 'travel',
  classification: 'travel agency',

  // Robots
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
  manifest: '/site.webmanifest',
  other: {
    'google-site-verification': process.env.GOOGLE_VERIFICATION_ID || '',
    'msvalidate.01': process.env.BING_VERIFICATION_ID || '',
    'yandex-verification': process.env.YANDEX_VERIFICATION_ID || '',
    'p:domain_verify': process.env.PINTEREST_VERIFICATION_ID || '',
  },

};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "con-soul",
    "alternateName": "con-soul Expeditions",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://con-soul.in",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      "width": 512,
      "height": 512
    },
    "description": "Join con-soul for immersive travel experiences. Discover your next adventure with our curated expeditions and journeys designed for the soul.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "con-soul Team"
    },
    "sameAs": [
      "https://instagram.com/con-soul",
      "https://facebook.com/con-soul",
      "https://twitter.com/con-soul"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "India"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9876543210",
      "contactType": "Customer Service",
      "email": "contact@con-soul.in"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "con-soul",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://con-soul.in",
    "description": "Expeditions for the Soul",
    "inLanguage": ["en-US"],
    "publisher": {
      "@type": "Organization",
      "name": "con-soul",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Noto+Sans+Devanagari:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://platform.twitter.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* Manifest and PWA */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data - Organization */}
        <JsonLd data={organizationJsonLd} />

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
