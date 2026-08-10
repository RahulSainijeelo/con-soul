/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      // Old Firestore ID → SEO keyword slugs
      {
        source: '/past-trips/PTAGBlq6mklnL9OewFAC',
        destination: '/past-trips/uttarakhand-mussoorie-rishikesh-7-days',
        permanent: true,
      },
      {
        source: '/past-trips/YYUNS3dPVHiCG3knelGj',
        destination: '/past-trips/vizag-araku-beach-adventure-4-days',
        permanent: true,
      },
      {
        source: '/past-trips/ABJeA89QviSylm4iQPWP',
        destination: '/past-trips/mainpat-shimla-chhattisgarh-2-days',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
