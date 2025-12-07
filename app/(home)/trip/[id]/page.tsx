'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  destination: string;
  category: string;
  description: string;
  content: string;
  images: { url: string; deleteUrl?: string }[];
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  maxParticipants: number;
  currentParticipants?: number;
  difficulty?: string;
  duration?: string;
  included?: string[];
  notIncluded?: string[];
  itinerary?: { day: number; title: string; description: string }[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface Booking {
  id: string;
  status: string;
  tripId: string;
}

interface TripPageProps {
  params: { id: string };
}

export default function TripPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trip data
        const tripRes = await fetch(`/api/trips/${params.id}`);
        if (!tripRes.ok) {
          setTrip(null);
          setLoading(false);
          return;
        }
        const tripData = await tripRes.json();
        setTrip(tripData);

        // Fetch user's booking if logged in
        if (session?.user?.email && params?.id) {
          const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
          const bookingsRes = await fetch(`/api/user/bookings?tripId=${tripId}&checkOnly=true`);
          if (bookingsRes.ok) {
            const bookingData = await bookingsRes.json();
            if (bookingData.exists && bookingData.booking) {
              setBooking(bookingData.booking);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!trip) {
    notFound();
  }

  const getBookingStatusButton = () => {
    if (!booking) {
      return (
        <Link href={`/trip/${params.id}/join`} className="w-full">
          <button className="w-full bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/30">
            Book This Trip
          </button>
        </Link>
      );
    }

    // User has a booking
    switch (booking.status) {
      case 'confirmed':
        return (
          <div className="w-full">
            <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl cursor-default flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Booking Confirmed
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">Your trip is confirmed!</p>
          </div>
        );
      case 'pending':
        return (
          <div className="w-full">
            <button className="w-full bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl cursor-default flex items-center justify-center gap-2">
              <Clock className="w-5 h-5" />
              Booking Pending
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">Awaiting confirmation</p>
          </div>
        );
      case 'rejected':
        return (
          <div className="w-full">
            <button className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl cursor-default flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5" />
              Booking Rejected
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">Please contact support</p>
          </div>
        );
      default:
        return (
          <Link href={`/trip/${params.id}/join`} className="w-full">
            <button className="w-full bg-gold hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold/30">
              Book This Trip
            </button>
          </Link>
        );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black pb-16 md:pb-0">
        <Header />

        {/* Hero Image Section */}
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          {trip.images && trip.images.length > 0 ? (
            <img
              src={trip.images[0].url}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container mx-auto">
              <div className="inline-block px-4 py-1 bg-gold text-black text-sm font-bold rounded-full mb-4">
                {trip.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {trip.title}
              </h1>
              {trip.description && (
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
                  {trip.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trip Highlights */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                  Trip Highlights
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Scenic {trip.category} Views</h4>
                      <p className="text-sm text-gray-400">Experience breathtaking {trip.destination}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Cultural Immersion</h4>
                      <p className="text-sm text-gray-400">Connect with local traditions and culture</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Adventure Activities</h4>
                      <p className="text-sm text-gray-400">Exciting outdoor experiences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-black/30 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Premium Experience</h4>
                      <p className="text-sm text-gray-400">Carefully curated journey</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Overview */}
              {trip.itinerary && trip.itinerary.length > 0 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                    Itinerary Overview
                  </h2>
                  <div className="space-y-6">
                    {trip.itinerary.map((item, index) => (
                      <div key={index} className={`relative pl-8 ${index !== trip.itinerary!.length - 1 ? 'pb-6 border-l-2 border-gold/30' : ''}`}>
                        <div className="absolute -left-2.5 top-0 w-5 h-5 bg-gold rounded-full border-4 border-black" />
                        <div className="bg-black/40 rounded-xl p-5 border border-white/10 hover:border-gold/30 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-white">Day {item.day}</h3>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-200 mb-2">{item.title}</h4>
                          <p className="text-gray-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Details/Content */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                  About This Trip
                </h2>
                <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-strong:text-gold">
                  <p>{trip.content}</p>
                </div>
              </div>

              {/* Image Gallery */}
              {trip.images && trip.images.length > 1 && (
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                    Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trip.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
                        <img
                          src={image.url}
                          alt={`${trip.title} - Image ${index + 2}`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Price & Booking Card */}
              <div className="bg-gradient-to-br from-gold/10 to-orange-500/5 rounded-2xl p-6 border border-gold/20">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-400 mb-2">Starting from</p>
                  <p className="text-4xl font-bold text-gold">₹{trip.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mt-1">per person</p>
                </div>

                <div className="space-y-3">
                  {getBookingStatusButton()}

                  <button className="w-full bg-transparent hover:bg-white/5 text-gold font-semibold py-3 px-6 rounded-xl border-2 border-gold transition-colors">
                    Contact Us
                  </button>
                </div>
              </div>

              {/* Trip Information Card */}
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Trip Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Destination</p>
                      <p className="font-medium text-white">{trip.destination}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Start Date</p>
                      <p className="font-medium text-white">
                        {new Date(trip.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {trip.duration && (
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                      <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Duration</p>
                        <p className="font-medium text-white">{trip.duration}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400">Group Size</p>
                      <p className="font-medium text-white">Max {trip.maxParticipants} People</p>
                      {trip.currentParticipants !== undefined && (
                        <p className="text-xs text-gray-500 mt-1">{trip.currentParticipants} / {trip.maxParticipants} booked</p>
                      )}
                    </div>
                  </div>

                  {trip.difficulty && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Difficulty</p>
                        <p className="font-medium text-white">{trip.difficulty}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* What's Included Card */}
              {trip.included && trip.included.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">What's Included</h3>

                  <div className="space-y-3">
                    {trip.included.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's Not Included Card */}
              {trip.notIncluded && trip.notIncluded.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Not Included</h3>

                  <div className="space-y-3">
                    {trip.notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}