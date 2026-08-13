/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      // Reverse redirects: SEO slugs → actual Firestore IDs
      // The old permanent redirects cached slug URLs in browsers/Google, so we redirect them back
      {
        source: '/past-trips/uttarakhand-mussoorie-rishikesh-7-days',
        destination: '/past-trips/PTAGBlq6mklnL9OewFAC',
        permanent: false, // Use 302 (temporary) so browsers don't cache this forever
      },
      {
        source: '/past-trips/vizag-araku-beach-adventure-4-days',
        destination: '/past-trips/YYUNS3dPVHiCG3knelGj',
        permanent: false,
      },
      {
        source: '/past-trips/mainpat-shimla-chhattisgarh-2-days',
        destination: '/past-trips/ABJeA89QviSylm4iQPWP',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

