import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — CONSOUL Travel',
  description: 'Get in touch with CONSOUL for group trip inquiries, bookings, and support. Reach us via phone, email, or WhatsApp. Based in Bilaspur, Chhattisgarh.',
  openGraph: {
    title: 'Contact CONSOUL — Youth Group Travel India',
    description: 'Get in touch for group trip inquiries, bookings, and support.',
    url: 'https://con-soul.in/contact',
  },
  alternates: {
    canonical: 'https://con-soul.in/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
