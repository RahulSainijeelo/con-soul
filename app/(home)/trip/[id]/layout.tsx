import { Metadata } from 'next';
import { db } from '@/config/firebase';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let title = 'Trip Details';
  let description = 'Explore this curated group trip by CONSOUL — India\'s youth group travel platform.';
  let image = '/images/og-cover.jpg';
  
  try {
    const tripDoc = await db.collection('trips').doc(id).get();
    if (tripDoc.exists) {
      const data = tripDoc.data();
      title = data?.title || title;
      description = data?.description || `Join ${title} — a curated group trip by CONSOUL. ${data?.duration || ''} of adventure, culture and unforgettable memories.`;
      image = data?.coverImage || data?.images?.[0] || image;
    }
  } catch (e) {
    // fallback to defaults
  }
  
  return {
    title,
    description,
    openGraph: {
      title: `${title} | CONSOUL`,
      description,
      type: 'article',
      url: `https://con-soul.in/trip/${id}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://con-soul.in/trip/${id}`,
    },
  };
}

export default function TripLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
