import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | CONSOUL',
  description: 'The page you are looking for could not be found. Return to CONSOUL homepage to explore our latest articles and news.',
  robots: {
    index: false,
    follow: true,
  },
};

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Lottie Animation */}
          <div className="w-full max-w-md mx-auto mb-8">

          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto">
              Oops! The page you&apos;re looking for seems to have vanished into the digital realm.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;