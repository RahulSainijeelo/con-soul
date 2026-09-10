import { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Us — CONSOUL INDIA Travel',
  description: 'Get in touch with CONSOUL INDIA for group trip inquiries, bookings, and support. Reach us via phone, email, or WhatsApp. Based in Bilaspur, Chhattisgarh.',
  openGraph: {
    title: 'Contact CONSOUL INDIA — Youth Group Travel India',
    description: 'Get in touch for group trip inquiries, bookings, and support.',
    url: 'https://con-soul.in/contact',
  },
  alternates: {
    canonical: 'https://con-soul.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact CONSOUL INDIA Travel",
    "url": "https://con-soul.in/contact",
    "description": "Get in touch with CONSOUL INDIA for group trip inquiries, bookings, and support.",
    "mainEntity": {
      "@type": "TravelAgency",
      "name": "CONSOUL INDIA",
      "email": "con.sol.082025@gmail.com",
      "url": "https://con-soul.in",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bilaspur",
        "addressRegion": "Chhattisgarh",
        "addressCountry": "IN"
      }
    }
  };

  return (
    <>
      <JsonLd data={contactJsonLd} />
      {children}
    </>
  );
}
