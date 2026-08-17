import { Metadata } from 'next';
import { db } from '@/config/firebase';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let title = 'Past Trip Details';
  let description = 'Explore this completed group trip by CONSOUL and read reviews from fellow travelers.';
  let image = '/images/og-cover.jpg';
  
  try {
    // Try direct ID lookup first
    let tripDoc = await db.collection('trips').doc(id).get();
    
    // If not found, try slug lookup
    if (!tripDoc.exists) {
      const slugQuery = await db.collection('trips')
        .where('slug', '==', id)
        .limit(1)
        .get();
      if (!slugQuery.empty) {
        tripDoc = slugQuery.docs[0];
      }
    }
    
    if (tripDoc.exists) {
      const data = tripDoc.data();
      title = data?.title || title;
      description = data?.description || `Relive ${title} — a completed group trip by CONSOUL. See photos and reviews from fellow travelers.`;
      image = data?.coverImage || data?.images?.[0]?.url || image;
    }
  } catch (e) {
    // fallback to defaults
  }
  
  const slug = id;
  return {
    title,
    description,
    openGraph: {
      title: `${title} — Trip Review | CONSOUL`,
      description,
      type: 'article',
      url: `https://con-soul.in/past-trips/${slug}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://con-soul.in/past-trips/${slug}`,
    },
  };
}

export default function PastTripLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
