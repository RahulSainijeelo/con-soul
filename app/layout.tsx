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
  metadataBase: new URL('https://con-soul.in'),
  title: {
    default: "CONSOUL | Youth Group Travel India",
    template: "%s | CONSOUL"
  },
  description: "CONSOUL is India's youth group travel platform. Group trips across Himalayas, Goa, Rajasthan and more. Join 300+ travelers at con-soul.in",
  keywords: "consoul, con-soul, youth group travel india, group trips india, consoul travel, adventure trips india, himalayas trip, goa group trip, rajasthan travel, kerala backpacking",
  authors: [{ name: "CONSOUL" }],
  creator: "CONSOUL",
  publisher: "CONSOUL",
  alternates: {
    canonical: "https://con-soul.in",
  },
  openGraph: {
    title: "CONSOUL | Youth Group Travel India",
    description: "India's youth group travel platform. Group trips across Himalayas, Goa, Rajasthan and more for young explorers.",
    url: "https://con-soul.in",
    siteName: "CONSOUL",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: 'summary_large_image',
    title: "CONSOUL | Youth Group Travel India",
    description: "India's youth group travel platform. Group trips across Himalayas, Goa, Rajasthan and more for young explorers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
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
    "@type": "TravelAgency",
    "name": "CONSOUL",
    "alternateName": "CONSOUL Expeditions",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://con-soul.in",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      "width": 512,
      "height": 512
    },
    "description": "Join CONSOUL for immersive travel experiences. Discover your next adventure with our curated expeditions and journeys designed for the soul.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "CONSOUL Team"
    },
    "sameAs": [
      "https://instagram.com/consoul.in",
      "https://facebook.com/consoul.in",
      "https://twitter.com/consoul"
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
    "name": "CONSOUL",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://con-soul.in",
    "description": "Expeditions for the Soul",
    "inLanguage": ["en-US"],
    "publisher": {
      "@type": "Organization",
      "name": "CONSOUL",
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
        {/* General Sans from Fontshare — used for hero headlines */}
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@600,700&display=swap" rel="stylesheet" />
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
