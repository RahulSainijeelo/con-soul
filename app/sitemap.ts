// app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/config/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://con-soul.in'
  const now = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}`,                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/past-trips`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/about`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    // ❌ DO NOT include: /auth/login, /my-trips, /profile (auth-gated — will 302 redirect)
    // ❌ DO NOT include: /trips, /terms, /refund (routes do not exist)
  ]

  // Dynamic trip pages from Firestore
  let tripPages: MetadataRoute.Sitemap = [];
  try {
    const tripsSnapshot = await db.collection('trips').get();
    tripPages = tripsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const status = data.status || 'archived';
      // Published trips use /trip/[id], completed trips use /past-trips/[slug or id]
      const prefix = status === 'published' ? '/trip' : '/past-trips';
      const identifier = (status !== 'published' && data.slug) ? data.slug : doc.id;
      return {
        url: `${base}${prefix}/${identifier}`,
        lastModified: data.updatedAt || now,
        changeFrequency: 'monthly' as const,
        priority: status === 'published' ? 0.9 : 0.8,
      };
    });
  } catch (error) {
    console.error('Sitemap: Failed to fetch trips', error);
    tripPages = [];
  }

  return [...staticPages, ...tripPages]
}