import { Metadata } from 'next';
import { db } from '@/config/firebase';
import { JsonLd } from '@/components/seo/JsonLd';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
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
      image = data?.coverImage || data?.images?.[0]?.url || image;
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

export default async function TripLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  // Fetch trip data for structured data
  let tripJsonLd = null;
  try {
    const tripDoc = await db.collection('trips').doc(id).get();
    if (tripDoc.exists) {
      const data = tripDoc.data();
      tripJsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        "name": data?.title,
        "description": data?.description,
        "touristType": "Youth Group Travelers",
        "image": data?.images?.map((img: any) => img.url) || [],
        "url": `https://con-soul.in/trip/${id}`,
        "provider": {
          "@type": "TravelAgency",
          "name": "CONSOUL",
          "url": "https://con-soul.in"
        },
        ...(data?.startDate && {
          "itinerary": {
            "@type": "ItemList",
            "name": `${data.title} Itinerary`,
          }
        }),
        ...(data?.price && {
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "INR",
            "availability": data?.status === 'published'
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
            "url": `https://con-soul.in/trip/${id}`,
            "validFrom": data?.createdAt || new Date().toISOString(),
          }
        }),
      };
    }
  } catch (e) {
    // fallback silently
  }

  return (
    <>
      {tripJsonLd && <JsonLd data={tripJsonLd} />}
      {children}
    </>
  );
}
