import { db } from '@/config/firebase';

export default async function sitemap() {
  const baseUrl = "https://con-soul.in";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/past-trips`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  // Dynamic trip pages — so Google indexes each trip individually
  let tripPages: { url: string; lastModified: Date; changeFrequency: "weekly"; priority: number }[] = [];
  try {
    const tripsSnapshot = await db.collection('trips').get();
    tripPages = tripsSnapshot.docs.map((doc) => ({
      url: `${baseUrl}/trip/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Silently continue with static pages if Firestore fails
    console.error('Sitemap: Failed to fetch trips', error);
  }

  return [...staticPages, ...tripPages];
}