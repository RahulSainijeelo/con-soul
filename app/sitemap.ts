// app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/config/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://con-soul.in'
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/past-trips`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/trips`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/about`,      lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`,    lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/terms`,      lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/refund`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    // ❌ DO NOT include: /auth/login, /my-trips, /profile (auth-gated — will 302 redirect)
  ]

  // Dynamic trip pages from Firestore
  let tripPages: MetadataRoute.Sitemap = [];
  try {
    const tripsSnapshot = await db.collection('trips').get();
    tripPages = tripsSnapshot.docs.map((doc) => ({
      url: `${base}/past-trips/${doc.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    // Fallback to known trips if Firestore fails
    console.error('Sitemap: Failed to fetch trips', error);
    const fallbackTrips = [
      { id: 'PTAGBlq6mklnL9OewFAC', updatedAt: '2026-04-10' },
      { id: 'YYUNS3dPVHiCG3knelGj', updatedAt: '2026-01-10' },
      { id: 'ABJeA89QviSylm4iQPWP', updatedAt: '2025-11-10' },
      { id: 'cEE675C2XurJTXIb5cPg', updatedAt: '2026-08-10' },
    ];
    tripPages = fallbackTrips.map((trip) => ({
      url: `${base}/past-trips/${trip.id}`,
      lastModified: trip.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));
  }

  return [...staticPages, ...tripPages]
}