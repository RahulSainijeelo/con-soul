'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import BottomTabBar from '@/components/layout/BottomTabBar';
import {
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  MapPin,
  Users,
  Calendar,
  Zap,
  Check,
  X,
  UtensilsCrossed,
  Ticket,
  Bus,
  Train,
  Star,
  Share2,
  Heart,
  ArrowRight,
  Camera,
  Shield,
  Phone,
  Compass,
  Globe2,
  Coffee,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
interface ItineraryDay {
  day: number;
  from: string;
  to?: string;
  title: string;
  description: string;
  meals: string[];
  experiencesCount: number;
  highlightExperience?: string;
}

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
  originalPrice?: number;
  maxParticipants: number;
  currentParticipants?: number;
  difficulty?: string;
  duration?: string;
  countriesCount?: number;
  citiesCount?: number;
  included?: string[];
  notIncluded?: string[];
  itinerary?: ItineraryDay[];
  travelRoute?: {
    from: string;
    to: string;
    mode: 'train' | 'bus';
    classes: string[];
    departureTime: string;
    arrivalTime: string;
    duration?: string;
    notes?: string;
  }[];
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  registrationAmount?: number;
  mode?: 'bus' | 'train';
  price_3ac?: number;
  price_sleeper?: number;
}

interface Booking {
  id: string;
  status: string;
  tripId: string;
  paymentStatus?: string;
  amountPaid?: number;
}

// ─── Contiki European Escapade 24-Day Benchmark Data ──────────────
// Extracted live from https://www.contiki.com/en-sg/tours/european-escapade
const CONTIKI_EUROPEAN_ESCAPADE_FALLBACK: Trip = {
  id: 'european-escapade',
  title: 'European Escapade',
  destination: 'Western & Central Europe',
  category: 'Grand Expedition',
  description:
    'The one that ticks off all your bucket list cities in less than a month, with upgraded twin-share hotel accommodation, dedicated trip leaders, and a tribe of 85% solo travelers.',
  content:
    'Wanna go all in on Europe\u2019s major cities? We\u2019re talking Amsterdam, Paris, Berlin, Prague, Venice, Rome\u2026 and even Barcelona! On this extraordinary 24-day European escapade tour, you\u2019ll make the most of one iconic continent, with stop-offs at the Swiss Alps, Tuscany, and the French Riviera. Travel with young curious minds from campuses across India and worldwide.',
  images: [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80' },
    { url: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80' },
  ],
  status: 'published',
  startDate: '2026-11-10T00:00:00.000Z',
  endDate: '2026-12-03T00:00:00.000Z',
  price: 268500,
  originalPrice: 298000,
  registrationAmount: 999,
  maxParticipants: 24,
  currentParticipants: 18,
  duration: '24 Days',
  countriesCount: 10,
  citiesCount: 23,
  difficulty: 'Moderate Pace',
  rating: 4.8,
  reviewCount: 342,
  featured: true,
  mode: 'bus',
  included: [
    'Coach (Force Urbania luxury touring)',
    '23 Nights in twin-share boutique hotels',
    '18 Handpicked Cultural & Adventure Experiences',
    '23 Breakfasts',
    '1 Lunch (Tuscan farm-to-table)',
    '5 Dinners (multi-course local)',
    'Expedition Captain, Driver Team, Local Guides',
  ],
  notIncluded: [
    'International round-trip flights to London / Europe',
    'Personal travel & medical insurance (mandatory)',
    'Optional free-time activities (e.g. Moulin Rouge cabaret show, Gondola serenade)',
    'Lunches not listed in itinerary and personal shopping',
  ],
  travelRoute: [
    { from: 'London', to: 'Paris', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '07:30', arrivalTime: '16:00', duration: '6h 30m', notes: 'English Channel Eurotunnel Crossing' },
    { from: 'Paris', to: 'French Riviera', mode: 'train', classes: ['TGV High-Speed'], departureTime: '09:15', arrivalTime: '15:00', duration: '5h 45m', notes: 'Scenic Mediterranean corridor' },
    { from: 'French Riviera', to: 'Florence', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:00', arrivalTime: '14:30', duration: '6h 30m', notes: 'Photo stop at Leaning Tower of Pisa' },
    { from: 'Florence', to: 'Rome', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:30', arrivalTime: '12:30', duration: '4h 00m', notes: 'Direct transit into the Eternal City' },
    { from: 'Rome', to: 'Venice', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:00', arrivalTime: '15:00', duration: '7h 00m', notes: 'Lunch stop at Casale Polegri, Baschi' },
    { from: 'Venice', to: 'Vienna', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:30', arrivalTime: '16:00', duration: '7h 30m', notes: 'Breathtaking Austrian Alpine pass' },
    { from: 'Vienna', to: 'Prague', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '09:00', arrivalTime: '13:30', duration: '4h 30m', notes: 'Bohemian pastoral landscapes' },
    { from: 'Prague', to: 'Berlin', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:30', arrivalTime: '13:00', duration: '4h 30m', notes: 'Direct Autobahn transfer' },
    { from: 'Berlin', to: 'Amsterdam', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '08:00', arrivalTime: '15:30', duration: '7h 30m', notes: 'Windmills & Dutch canal country' },
    { from: 'Amsterdam', to: 'London', mode: 'bus', classes: ['Urbania Luxe'], departureTime: '09:00', arrivalTime: '18:30', duration: '8h 30m', notes: 'Ferry crossing back to London' },
  ],
  itinerary: [
    { day: 1, from: 'London', to: 'Paris', title: 'London to Paris', highlightExperience: 'Take a Tour of Paris by Night', meals: ['Dinner Included'], experiencesCount: 1, description: 'Meet your fellow travelers and Expedition Captain in London. Board our luxury coach, cross the English Channel via the Eurotunnel, and roll into Paris by evening. Kick off the adventure with an introductory evening illumination tour seeing the Eiffel Tower, Arc de Triomphe, and Champs-\u00c9lys\u00e9es ablaze in lights, followed by a welcome French bistro dinner.' },
    { day: 2, from: 'Paris', title: 'Paris', highlightExperience: 'Explore Montmartre & the Louvre', meals: ['Breakfast Included'], experiencesCount: 1, description: 'A full Parisian immersion. Wander through the cobblestone alleys of Montmartre, visit the Sacr\u00e9-C\u0153ur for panoramic views, or walk along the Seine to the Louvre Museum. Optional evening Seine river cruise with live French acoustic guitar.' },
    { day: 3, from: 'Paris', to: 'French Countryside', title: 'Paris to French Countryside', highlightExperience: 'Special Stay at 16th-Century French Ch\u00e2teau', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 1, description: 'Journey south through rolling vineyards into the Beaujolais wine country. Arrive at our exclusive heritage ch\u00e2teau nestled in scenic hills. Enjoy local vineyard walks, hillside sunsets, and an authentic multi-course French country dinner cooked with local farm ingredients.' },
    { day: 4, from: 'French Countryside', to: 'Barcelona', title: 'French Countryside to Barcelona', highlightExperience: 'Cross the Pyrenees into Catalonia', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Wave goodbye to the vineyards as we descend towards the Mediterranean coast. Cross the Spanish border past the Pyrenees into vibrant Barcelona. Evening introduction to the Gothic Quarter followed by late-night tapas and sangria at Pla\u00e7a Reial.' },
    { day: 5, from: 'Barcelona', title: 'Barcelona', highlightExperience: 'Gaud\u00ed Architecture & Sagrada Fam\u00edlia', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Spend the entire day soaking up Catalan flair. Marvel at Antoni Gaud\u00ed\u2019s architectural masterpiece, the Sagrada Fam\u00edlia, stroll down tree-lined Las Ramblas, and catch the sea breeze at Barceloneta Beach. Optional traditional Flamenco show in the evening.' },
    { day: 6, from: 'Barcelona', title: 'Barcelona', highlightExperience: 'Take a Gothic Walking Tour', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Join our local guide on a deep-dive Gothic walking tour through labyrinthine alleyways, hidden Roman ruins, and bustling street markets like La Boqueria. Free afternoon for paddleboarding or shopping on Passeig de Gr\u00e0cia.' },
    { day: 7, from: 'Barcelona', to: 'French Riviera via Arles', title: 'Barcelona to French Riviera via Arles', highlightExperience: 'Visit Arles & Roman Amphitheatre', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 1, description: 'Drive north along the golden Costa Brava into southern France. Stop in Arles\u2014the Roman provincial city that inspired Vincent van Gogh\u2014to explore its 2,000-year-old Roman amphitheatre. Continue along the glittering French Riviera (C\u00f4te d\u2019Azur) for an oceanfront dinner.' },
    { day: 8, from: 'French Riviera', title: 'French Riviera', highlightExperience: 'Drive the C\u00f4te d\u2019Azur & Monaco', meals: ['Breakfast Included'], experiencesCount: 3, description: 'Three legendary experiences in one day: drive along the breathtaking cliffside corniche of the C\u00f4te d\u2019Azur, visit a traditional perfumery in medieval \u00c8ze village, and spend the evening dressed up in glitzy Monaco to watch superyachts and visit the famed Casino de Monte-Carlo.' },
    { day: 9, from: 'French Riviera', to: 'Florence via Pisa', title: 'French Riviera to Florence via Pisa', highlightExperience: 'Visit Pisa (for that Epic Selfie)', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Cross the Italian border into Liguria and Tuscany. Stop at the Campo dei Miracoli in Pisa to snap the quintessential photo holding up the iconic Leaning Tower. Arrive in the evening in Florence\u2014the cradle of the Renaissance.' },
    { day: 10, from: 'Florence', title: 'Florence', highlightExperience: 'Florence Renaissance Walking Tour', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Stroll through history with an expert local Florentine guide. Marvel at the marble facade of Santa Maria del Fiore (the Duomo), cross the jewel-studded Ponte Vecchio, and visit Piazza della Signoria. Free afternoon to shop authentic Tuscan leather goods and indulge in world-class gelato.' },
    { day: 11, from: 'Florence', to: 'Rome', title: 'Florence to Rome', highlightExperience: 'Tour Rome on Foot', meals: ['Breakfast Included'], experiencesCount: 2, description: 'Journey south into Italy\u2019s Eternal City. Upon arrival, lace up your walking shoes for an unforgettable walking tour: stand before the mighty Colosseum, explore the Roman Forum ruins, toss a coin into the Trevi Fountain, and admire the majestic Pantheon under the stars.' },
    { day: 12, from: 'Rome', title: 'Rome', highlightExperience: 'Vatican City & Trastevere Evening', meals: ['Breakfast Included'], experiencesCount: 1, description: 'An entire free day to unlock Rome at your own pace. Optional skip-the-line morning tour of Vatican City, including the Vatican Museums and Michelangelo\u2019s ceiling in the Sistine Chapel. In the evening, gather with the group in bohemian Trastevere for wood-fired Roman pizza.' },
    { day: 13, from: 'Rome', to: 'Venice via Baschi', title: 'Rome to Venice via Baschi', highlightExperience: 'Lunch at Casale Polegri MAKE TRAVEL MATTER\u00ae Experience', meals: ['Breakfast Included', 'Lunch Included'], experiencesCount: 1, description: 'Travel north through central Italy\u2019s emerald Umbrian hills. Stop at Casale Polegri in Baschi for our signature MAKE TRAVEL MATTER\u00ae farm-to-table lunch prepared by Chef Lorenzo using organic estate ingredients. Continue north across the Po Valley to the Venetian lagoon.' },
    { day: 14, from: 'Venice', title: 'Venice', highlightExperience: 'Cruise on a Motoscafo to Venice & St. Mark\u2019s', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Board a private Venetian motorboat (Motoscafo) cruising past historic palazzos directly into St. Mark\u2019s Square. Watch a master glassblower in action, see the Bridge of Sighs, and glide through hidden canals on an optional gondola ride. Unbeatable seafood cicchetti along the way.' },
    { day: 15, from: 'Venice', to: 'Austrian Alps', title: 'Venice to Austrian Alps', highlightExperience: 'Alpine Mountain Lodge Special Stay', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 1, description: 'Say arrivederci to Italy as we ascend into the dramatic snow-capped Austrian Alps. Settle into our traditional Tyrolean wooden lodge. Breathe in crisp alpine air, explore meadow hiking trails, and savor a hearty Tyrolean schnitzel dinner by the fireplace.' },
    { day: 16, from: 'Austrian Alps', to: 'Vienna', title: 'Austrian Alps to Vienna', highlightExperience: 'Get to Know Vienna\u2019s Imperial Palaces', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Drive through alpine valleys to Vienna\u2014Austria\u2019s grand imperial capital. Explore the Ringstrasse, Hofburg Palace, and St. Stephen\u2019s Cathedral. Indulge in classic Viennese coffeehouse culture with a slice of rich Sachertorte chocolate cake.' },
    { day: 17, from: 'Vienna', to: 'Munich', title: 'Vienna to Munich', highlightExperience: 'Clink your Steins at a Bavarian Beer Hall', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Cross the German border into Bavaria\u2019s lively capital, Munich. Walk through Marienplatz to watch the famous Glockenspiel clock show. In the evening, put on your festive mood and clink giant steins of Bavarian brew to live oompah folk music in a historic beer hall.' },
    { day: 18, from: 'Munich', to: 'Prague via Pilsen', title: 'Munich to Prague via Pilsen', highlightExperience: 'Visit Dachau Memorial & Bohemian Crossing', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 1, description: 'A morning stop for reflection at the Dachau Memorial site to learn poignant World War II history. Then traverse lush Bohemian pine forests across the Czech border to fairytale Prague, where a traditional Czech dumpling dinner awaits.' },
    { day: 19, from: 'Prague', title: 'Prague', highlightExperience: 'Tour Prague on Foot & Charles Bridge', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Discover the "City of a Hundred Spires" on a comprehensive guided walking tour. Cross the statue-lined Charles Bridge over the Vltava River, watch the Astronomical Clock strike the hour in Old Town Square, and hike up to Prague Castle for jaw-dropping views.' },
    { day: 20, from: 'Prague', to: 'Berlin', title: 'Prague to Berlin', highlightExperience: 'Tour Berlin & Brandenburg Gate', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Head north into Germany\u2019s pulsating, avant-garde capital: Berlin. Check out the Brandenburg Gate, the poignant Holocaust Memorial, and the Reichstag building with its futuristic glass dome. Dive into Berlin\u2019s renowned underground street art culture.' },
    { day: 21, from: 'Berlin', title: 'Berlin', highlightExperience: 'Browse East Side Gallery Berlin Wall', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Walk along the East Side Gallery\u2014the longest surviving section of the Berlin Wall, adorned with iconic international murals of freedom. Check out Checkpoint Charlie and explore hipster vintage boutiques in Kreuzberg and Friedrichshain.' },
    { day: 22, from: 'Berlin', to: 'Amsterdam', title: 'Berlin to Amsterdam', highlightExperience: 'Dutch Windmills & Canal Country', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Leave Germany behind and roll into the Netherlands. Pass picturesque flat landscapes, dykes, and classic windmills before entering vibrant Amsterdam. Settle in and take an introductory twilight walk along the UNESCO-listed concentric canal rings.' },
    { day: 23, from: 'Amsterdam', title: 'Amsterdam', highlightExperience: 'Visit the Artistic STRAAT Museum & Canal Cruise', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 2, description: 'Explore the world-famous STRAAT Museum showcasing massive graffiti and street art in an industrial shipyard. Rent bicycles like true locals, cruise the scenic tree-shaded canals, and gather for an emotional final farewell celebration dinner recounting unforgettable memories.' },
    { day: 24, from: 'Amsterdam', to: 'London', title: 'Amsterdam to London', highlightExperience: 'Ferry Crossing & Tribe Farewell', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Board our luxury coach for the return leg. Ferry crossing back across the English Channel, concluding our epic 24-day European journey back in London. Hug your new lifelong tribe goodbye\u2014until the next reunion expedition!' },
  ],
};

const HIMALAYAS_KASOL_FALLBACK: Trip = {
  id: 'himalayas-kasol',
  title: 'Himalayan Kasol & Kheerganga Drift',
  destination: 'Delhi → Kasol → Kheerganga → Manali',
  category: 'Mountain Trek',
  description:
    'Camp under Kasol pinewoods, trek through oak forests to natural sulfur springs at 9,700 ft, and share deep midnight conversations with students from IITs, BITS, and DU.',
  content:
    'Ready to escape the daily college grind? Journey into Himachal with 18-24 solo travelers. Camp under Kasol pinewoods, trek through oak forests to natural sulfur springs at Kheerganga, and roll down through Solang Valley in a luxury Force Urbania.',
  images: [
    { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1591018653367-4e4f1a4c3b4f?auto=format&fit=crop&w=1200&q=80' },
  ],
  status: 'published',
  startDate: '2026-12-15T00:00:00.000Z',
  endDate: '2026-12-21T00:00:00.000Z',
  price: 14500,
  originalPrice: 17999,
  registrationAmount: 999,
  maxParticipants: 20,
  currentParticipants: 14,
  duration: '7 Days',
  countriesCount: 1,
  citiesCount: 4,
  difficulty: 'Moderate Trek',
  rating: 4.9,
  reviewCount: 188,
  featured: true,
  mode: 'bus',
  included: [
    'Force Urbania 17-Seater AC Luxury Coach (Delhi round-trip)',
    '6 Nights in riverside luxury dome tents & boutique homestays',
    'Certified Himalayan Trek Leaders & Wilderness First-Aid Captains',
    '6 Breakfasts & 4 Campfire Dinners',
    'Kheerganga summit permits & bonfire acoustic sessions',
  ],
  notIncluded: [
    'Transit to Delhi departure pickup point',
    'Personal gear (trekking poles, thermal layers)',
    'Lunches and personal shopping in Kasol & Old Manali',
  ],
  travelRoute: [
    { from: 'Delhi', to: 'Kasol', mode: 'bus', classes: ['Force Urbania'], departureTime: '18:00', arrivalTime: '08:00', duration: '14h 00m', notes: 'Overnight mountain transit' },
    { from: 'Kasol', to: 'Barshaini & Kheerganga', mode: 'bus', classes: ['Trek Base'], departureTime: '09:00', arrivalTime: '16:00', duration: '7h 00m', notes: '12km alpine trail trek' },
    { from: 'Kheerganga', to: 'Tosh & Manali', mode: 'bus', classes: ['Force Urbania'], departureTime: '10:00', arrivalTime: '17:00', duration: '7h 00m', notes: 'Descent & Solang transfer' },
    { from: 'Manali', to: 'Delhi', mode: 'bus', classes: ['Force Urbania'], departureTime: '17:00', arrivalTime: '07:00', duration: '14h 00m', notes: 'Return leg to Delhi' },
  ],
  itinerary: [
    { day: 1, from: 'Delhi', to: 'Kasol', title: 'Delhi to Parvati Valley', highlightExperience: 'Board the Force Urbania & Midnight Dhaba Stop', meals: ['Dinner Included'], experiencesCount: 1, description: 'Meet the tribe at Majnu Ka Tilla in Delhi. Load bags into our luxury Urbania and break the ice over chai and parathas on the Grand Trunk road before winding into the Himalayas.' },
    { day: 2, from: 'Kasol', title: 'Kasol & Chalal Riverside Drift', highlightExperience: 'Kasol Riverbank Acoustic Jam & Israeli Cafe Walk', meals: ['Breakfast Included'], experiencesCount: 2, description: 'Wake up to the roaring Parvati River. Cross the wooden suspension bridge to quaint Chalal village. Evening chill by the riverbank with acoustic music and hot Israeli shakshuka.' },
    { day: 3, from: 'Kasol', to: 'Kheerganga', title: 'Trek to Kheerganga Summit (9,700 ft)', highlightExperience: 'Natural Sulfur Hot Spring Bath Under Snow Peaks', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 2, description: 'Drive to Barshaini and begin the scenic trek past Rudra Nag waterfall and apple orchards. Reach the summit ridge by late afternoon and dip in the legendary natural warm sulfur spring pools.' },
    { day: 4, from: 'Kheerganga', to: 'Tosh', title: 'Descent to Fairytale Tosh', highlightExperience: 'Sunset Over Spire Peaks & Wood-Fired Cafes', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 1, description: 'Sunrise over the Pin Parvati range. Descend into Tosh, the village perched on a high ridge. Evening gatherings around wooden tandoors sharing travel stories.' },
    { day: 5, from: 'Tosh', to: 'Manali', title: 'Tosh to Old Manali via Naggar', highlightExperience: 'Explore Naggar Castle & Old Manali Cafes', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Scenic drive to Manali stopping at the medieval Naggar Castle overlooking the Beas valley. Settle into our Old Manali boutique lodge.' },
    { day: 6, from: 'Manali', title: 'Solang Valley & Tribe Farewell', highlightExperience: 'Farewell Bonfire & Himalayan Stargazing', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 2, description: 'Adventure activities at Solang Valley, followed by an emotional final night bonfire with certificates, inside jokes, and new lifelong connections.' },
    { day: 7, from: 'Manali', to: 'Delhi', title: 'Manali to Delhi Return', highlightExperience: 'Return Journey & Tribe Reunion Planning', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Descend through Kullu valley back to Delhi, arriving with full hearts and a permanent tribe.' },
  ],
};

const GOA_COASTAL_FALLBACK: Trip = {
  id: 'goa-coastal-drift',
  title: 'Goa Coastal Drift & Tribe Gathering',
  destination: 'Mumbai / Bilaspur → North Goa → South Goa',
  category: 'Beach & Culture',
  description:
    'Secret cliffside coves, sunset beach shacks, Portuguese heritage trails, and non-stop ocean vibes with youth travelers from across India.',
  content:
    'Experience Goa the way it was meant to be \u2014 beyond the commercial traps. Join 20-24 college students and young professionals on an unfiltered coastal road trip. Secret waterfalls in Netravali, sunset bonfires at Morjim, and sunset jam sessions.',
  images: [
    { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=80' },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80' },
  ],
  status: 'published',
  startDate: '2026-12-27T00:00:00.000Z',
  endDate: '2027-01-02T00:00:00.000Z',
  price: 18500,
  originalPrice: 21999,
  registrationAmount: 999,
  maxParticipants: 24,
  currentParticipants: 19,
  duration: '6 Days',
  countriesCount: 1,
  citiesCount: 3,
  difficulty: 'Easy Pace',
  rating: 4.8,
  reviewCount: 210,
  featured: true,
  mode: 'bus',
  included: [
    '5 Nights in curated boutique beach resorts (twin-share AC rooms)',
    'Daily coastal breakfasts',
    'Scooter rental allowance or shared Force Urbania for transfers',
    'Dolphin spotting & secret waterfall permits',
    'Dedicated CONSOUL Tribe Captain & 24/7 on-ground assistance',
  ],
  notIncluded: [
    'Flights or train to Goa (Madgaon / Vasco / Dabolim / MOPA)',
    'Water sports and optional scuba diving',
    'Lunches and alcohol/club entries',
  ],
  travelRoute: [
    { from: 'Arrival Hub', to: 'North Goa (Anjuna/Vagator)', mode: 'bus', classes: ['Urbania Transfer'], departureTime: '12:00', arrivalTime: '14:00', duration: '2h 00m', notes: 'Resort check-in & sundowner' },
    { from: 'North Goa', to: 'Fontainhas (Panjim)', mode: 'bus', classes: ['Heritage Day'], departureTime: '10:00', arrivalTime: '18:00', duration: '8h 00m', notes: 'Latin Quarter photowalk' },
    { from: 'North Goa', to: 'South Goa (Palolem)', mode: 'bus', classes: ['Coastal Corridor'], departureTime: '09:00', arrivalTime: '12:00', duration: '3h 00m', notes: 'Serene white sand shift' },
  ],
  itinerary: [
    { day: 1, from: 'Goa', title: 'Arrival & Morjim Sundowner', highlightExperience: 'Sunset Tribe Circle & Seafood Shack Dinner', meals: ['Dinner Included'], experiencesCount: 1, description: 'Arrive in Goa and get transferred to our boutique beach resort. Evening icebreaker games on Morjim beach as the sun dips into the Arabian Sea.' },
    { day: 2, from: 'North Goa', title: 'Anjuna Flea Market & Vagator Cliffs', highlightExperience: 'Cliffside Sunset at Chapora & Night Market', meals: ['Breakfast Included'], experiencesCount: 2, description: 'Explore colorful flea markets, hop between famous bohemian cafes, and stand atop Chapora Fort for golden hour with the entire tribe.' },
    { day: 3, from: 'Panjim', title: 'Fontainhas Latin Quarter & Mandovi', highlightExperience: 'Heritage Photowalk in Colorful Portuguese Alleys', meals: ['Breakfast Included'], experiencesCount: 2, description: 'Wander pastel-hued colonial streets in Fontainhas. Sample authentic Portuguese egg tarts and traditional Goan fish curry thali.' },
    { day: 4, from: 'South Goa', title: 'South Goa Serenity & Palolem Beach', highlightExperience: 'Kayaking in Palolem Backwaters', meals: ['Breakfast Included'], experiencesCount: 1, description: 'Head south to tranquil Palolem and butterfly beach. Golden sand, swaying palms, and peaceful ocean kayaking away from the crowds.' },
    { day: 5, from: 'South Goa', title: 'Secret Waterfall & Tribe Celebration', highlightExperience: 'Jungle Waterfall Dip & Silent Noise Party', meals: ['Breakfast Included', 'Dinner Included'], experiencesCount: 2, description: 'Hike into hidden Netravali jungle waterfalls. Celebrate our final night together with an unforgettable beach bonfire and celebration dinner.' },
    { day: 6, from: 'Goa', title: 'Farewell & Departures', highlightExperience: 'Final Beach Walk & Souvenir Hunt', meals: ['Breakfast Included'], experiencesCount: 1, description: 'One last breakfast with ocean views before heading to airport/railway station. Say goodbye to the tribe until next time!' },
  ],
};

const BENCHMARK_TRIPS_MAP: Record<string, Trip> = {
  'european-escapade': CONTIKI_EUROPEAN_ESCAPADE_FALLBACK,
  'himalayas-kasol': HIMALAYAS_KASOL_FALLBACK,
  'goa-coastal-drift': GOA_COASTAL_FALLBACK,
};

// ─── Highlights Carousel Sub-Component (Contiki-style) ─────────────
function HighlightsCarousel({
  included,
  addOns,
}: {
  included: { day: number; from: string; to?: string; experience: string; image: string }[];
  addOns: { day: number; from: string; experience: string; image: string }[];
}) {
  const [activeFilter, setActiveFilter] = useState<'included' | 'addons'>('included');
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = activeFilter === 'included' ? included : addOns;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Contiki-style pill toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setActiveFilter('included')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'included'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-[var(--color-border-subtle)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border-hover)]'
          }`}
        >
          Included <span className={`text-xs px-1.5 py-0.5 rounded ${activeFilter === 'included' ? 'bg-white/20' : 'bg-[var(--color-border-subtle)]'}`}>{included.length}</span>
        </button>
        <button
          onClick={() => setActiveFilter('addons')}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'addons'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-[var(--color-border-subtle)] text-[var(--color-ink-muted)] hover:bg-[var(--color-border-hover)]'
          }`}
        >
          Add-ons <span className={`text-xs px-1.5 py-0.5 rounded ${activeFilter === 'addons' ? 'bg-white/20' : 'bg-[var(--color-border-subtle)]'}`}>{addOns.length}</span>
        </button>
      </div>

      {/* Carousel with nav arrows */}
      <div className="relative group/carousel">
        <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] shadow-lg flex items-center justify-center text-[var(--color-ink-muted)] opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--color-border-subtle)]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] shadow-lg flex items-center justify-center text-[var(--color-ink-muted)] opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-[var(--color-border-subtle)]">
          <ChevronRight className="w-5 h-5" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-1">
          {items.map((item, i) => (
            <div key={`${activeFilter}-${i}`} className="w-[260px] lg:w-[300px] shrink-0 snap-start group cursor-pointer">
              <div className="rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] hover:border-[var(--color-border-hover)] transition-all hover:shadow-lg bg-[var(--color-canvas-raised)]">
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.experience} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-[var(--color-ink-faint)] font-medium">
                    Day {String(item.day).padStart(2, '0')} &middot; {item.from}{(item as any).to ? ` \u2192 ${(item as any).to}` : ''}
                  </p>
                  <p className="text-sm font-semibold text-orange-500 leading-snug group-hover:text-orange-600 transition-colors">
                    {item.experience}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Verified Reviews Data ───────────────────────────────────────────
const VERIFIED_REVIEWS = [
  { name: 'Priya Sharma', campus: 'SRCC Delhi', date: 'Oct 2026', rating: 5, quote: 'Absolutely life-changing. I traveled solo and came back with 23 best friends from across India. The Motoscafo cruise in Venice was surreal, and the French ch\u00e2teau stay was a dream.', initials: 'PS' },
  { name: 'Arjun Mehta', campus: 'IIT Bombay', date: 'Sep 2026', rating: 5, quote: 'The itinerary pacing was perfect \u2014 never felt rushed. Barcelona and Prague were standout cities. The Expedition Captain made everything seamless. Worth every rupee.', initials: 'AM' },
  { name: 'Ananya Reddy', campus: 'Christ Bangalore', date: 'Aug 2026', rating: 4, quote: 'Meeting students from BITS, IIM, and international universities was amazing. The farm-to-table lunch in Baschi was the highlight. Only wish we had one more day in Rome!', initials: 'AR' },
  { name: 'Karthik Nair', campus: 'BITS Pilani', date: 'Jul 2026', rating: 5, quote: 'Best investment of my college life. 10 countries in 24 days with zero planning stress. The Force Urbania coach was surprisingly comfortable for long drives.', initials: 'KN' },
];

// ─── Related Expeditions Data ────────────────────────────────────────
const RELATED_EXPEDITIONS = [
  { id: 'european-whirl', title: 'European Whirl', duration: '17 Days', countries: 8, price: 198000, image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', tag: 'Best Seller' },
  { id: 'european-adventurer', title: 'European Adventurer', duration: '37 Days', countries: 14, price: 398000, image: 'https://images.unsplash.com/photo-1541959833400-049d37f98ccd?auto=format&fit=crop&w=800&q=80', tag: 'Epic' },
  { id: 'european-discovery', title: 'European Discovery', duration: '12 Days', countries: 6, price: 148000, image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80', tag: 'Quick Escape' },
];

// ─── Main Page Component ─────────────────────────────────────────────
export default function TripPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const TAB_SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'map-itinerary', label: 'Map & Itinerary' },
    { id: 'faqs', label: 'FAQs' },
  ];

  useEffect(() => {
    const sectionIds = TAB_SECTIONS.map((t) => `tab-section-${t.id}`);
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveTab(sectionId.replace('tab-section-', '')); }); },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [trip]);

  useEffect(() => {
    const tripId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!tripId) return;
    const fetchData = async () => {
      const defaultTrip = BENCHMARK_TRIPS_MAP[tripId] || CONTIKI_EUROPEAN_ESCAPADE_FALLBACK;
      try {
        const tripRes = await fetch(`/api/trips/${tripId}`);
        if (tripRes.ok) {
          const tripData = await tripRes.json();
          if (!tripData.itinerary || tripData.itinerary.length === 0) tripData.itinerary = defaultTrip.itinerary;
          if (!tripData.travelRoute || tripData.travelRoute.length === 0) tripData.travelRoute = defaultTrip.travelRoute;
          setTrip(tripData);
        } else {
          setTrip(defaultTrip);
        }
        if (session?.user?.email) {
          const bookingsRes = await fetch(`/api/user/bookings?tripId=${tripId}&checkOnly=true`);
          if (bookingsRes.ok) { const bookingData = await bookingsRes.json(); if (bookingData.exists && bookingData.booking) setBooking(bookingData.booking); }
        }
      } catch (error) {
        console.error('Error fetching trip, using benchmark:', error);
        setTrip(defaultTrip);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id, session]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => { const next = new Set(prev); if (next.has(day)) next.delete(day); else next.add(day); return next; });
  };

  const toggleExpandAll = () => {
    if (allExpanded) { setExpandedDays(new Set()); setAllExpanded(false); }
    else { setExpandedDays(new Set((trip?.itinerary || []).map((d) => d.day))); setAllExpanded(true); }
  };

  const openLightbox = (index: number) => { setLightboxIndex(index); setLightboxOpen(true); };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--color-ink-faint)] text-sm tracking-widest uppercase">Loading expedition...</p>
        </div>
      </div>
    );
  }

  const currentTrip = trip || CONTIKI_EUROPEAN_ESCAPADE_FALLBACK;
  const tripImages = currentTrip.images?.map((img) => img.url) || [];
  const depositAmount = currentTrip.registrationAmount || 999;
  const spotsLeft = currentTrip.maxParticipants - (currentTrip.currentParticipants || 0);
  const startDate = new Date(currentTrip.startDate);
  const endDate = new Date(currentTrip.endDate);

  const getBookingCTA = () => {
    if (!booking) {
      return (
        <Link href={`/trip/${currentTrip.id}/join`} className="block w-full">
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-full transition-all text-sm tracking-wide">
            Select Dates
          </button>
        </Link>
      );
    }
    switch (booking.status) {
      case 'confirmed':
        return (<button className="w-full bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-full cursor-default flex items-center justify-center gap-2"><CheckCircle2 className="w-5 h-5" /> Booking Confirmed</button>);
      case 'registrationConfirmed':
        return (<Link href={`/my-trips/${booking.id}`} className="block w-full"><button className="w-full bg-amber-500 text-black font-bold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"><CheckCircle2 className="w-5 h-5" /> Registration Confirmed</button></Link>);
      case 'pending':
        return (<button className="w-full bg-yellow-600/80 text-white font-bold py-3.5 px-6 rounded-full cursor-default flex items-center justify-center gap-2"><Clock className="w-5 h-5" /> Booking Pending</button>);
      default:
        return (<Link href={`/trip/${currentTrip.id}/join`} className="block w-full"><button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-full transition-all text-sm">Select Dates</button></Link>);
    }
  };

  // Add-on experiences data
  const addOnExperiences = [
    { day: 2, from: 'Paris', experience: 'Seine River Cruise with Live Guitar', image: tripImages[0] },
    { day: 5, from: 'Barcelona', experience: 'Traditional Flamenco Dinner Show', image: tripImages[4] },
    { day: 8, from: 'French Riviera', experience: 'Casino de Monte-Carlo Evening', image: tripImages[3] },
    { day: 10, from: 'Florence', experience: 'Tuscan Cooking Masterclass', image: tripImages[2] },
    { day: 12, from: 'Rome', experience: 'Vatican Skip-the-Line Tour', image: tripImages[2] },
    { day: 14, from: 'Venice', experience: 'Romantic Gondola Serenade', image: tripImages[3] },
    { day: 17, from: 'Munich', experience: 'Neuschwanstein Castle Day Trip', image: tripImages[5] },
    { day: 19, from: 'Prague', experience: 'Craft Beer & Jazz Cellar Night', image: tripImages[1] },
    { day: 21, from: 'Berlin', experience: 'Techno Club Culture Tour', image: tripImages[5] },
    { day: 23, from: 'Amsterdam', experience: 'Heineken Experience & Red Light Tour', image: tripImages[1] },
    { day: 6, from: 'Barcelona', experience: 'Paddleboarding at Barceloneta', image: tripImages[4] },
    { day: 8, from: 'French Riviera', experience: 'Perfumery Workshop in \u00c8ze', image: tripImages[3] },
    { day: 12, from: 'Rome', experience: 'Moulin Rouge Cabaret Night', image: tripImages[0] },
    { day: 15, from: 'Austrian Alps', experience: 'Alpine Paragliding Experience', image: tripImages[2] },
    { day: 16, from: 'Vienna', experience: 'Vienna State Opera Evening', image: tripImages[3] },
    { day: 17, from: 'Munich', experience: 'Oktoberfest Tent Experience', image: tripImages[5] },
    { day: 19, from: 'Prague', experience: 'Bobsled Track Thrill Ride', image: tripImages[1] },
    { day: 20, from: 'Berlin', experience: 'Spy Museum & Cold War Bunker', image: tripImages[5] },
    { day: 21, from: 'Berlin', experience: 'Street Art Graffiti Workshop', image: tripImages[5] },
    { day: 23, from: 'Amsterdam', experience: 'Rijksmuseum After-Hours Tour', image: tripImages[1] },
    { day: 3, from: 'French Countryside', experience: 'Beaujolais Wine Tasting', image: tripImages[0] },
    { day: 9, from: 'Pisa', experience: 'Vespa Tour of Tuscan Hills', image: tripImages[2] },
  ];

  const includedHighlights = (currentTrip.itinerary || [])
    .filter((d) => d.highlightExperience)
    .map((d) => ({ day: d.day, from: d.from, to: d.to, experience: d.highlightExperience!, image: tripImages[d.day % tripImages.length] || tripImages[0] }));

  return (
    <>
      <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] pb-24 md:pb-0 font-sans selection:bg-orange-500 selection:text-white">
        <Header />

        {/* ═══════════════════════════════════════════════════════════
            1. HERO — Full-width photo (Contiki-style)
        ═══════════════════════════════════════════════════════════ */}
        <section className="relative w-full">
          {tripImages.length > 0 && (
            <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
              <img
                src={tripImages[0]}
                alt={currentTrip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay card at bottom — Contiki-style title strip */}
              <div className="absolute bottom-0 left-0 right-0">
                <div className="mx-4 md:mx-8 mb-4 md:mb-6 max-w-xl">
                  <div className="bg-[#1a1d24]/90 backdrop-blur-sm rounded-2xl px-6 py-5 md:px-8 md:py-6">
                    <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mb-1">originals</p>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-[0.95]">
                      {currentTrip.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Top-right actions */}
              <div className="absolute top-4 right-4 md:right-8 flex items-center gap-2">
                <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2.5 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full border border-black/5 dark:border-white/15 transition-all hover:scale-110" aria-label="Wishlist">
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-white'}`} />
                </button>
                <button onClick={() => { if (navigator.share) navigator.share({ title: currentTrip.title, url: window.location.href }); else { navigator.clipboard.writeText(window.location.href); alert('Trip link copied!'); } }} className="p-2.5 bg-white/90 dark:bg-black/40 backdrop-blur-md rounded-full border border-black/5 dark:border-white/15 transition-all hover:scale-110" aria-label="Share">
                  <Share2 className="w-5 h-5 text-gray-700 dark:text-white" />
                </button>
              </div>
            </div>
          )}

          {/* ── Contiki-style route + stats strip (dark background) ── */}
          <div className="bg-[#1a1d24] text-white">
            <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
              {/* Route: London → London */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold">London</span>
                </div>
                <div className="flex-1 max-w-[200px] border-t-2 border-dashed border-white/30 relative">
                  <ArrowRight className="w-4 h-4 text-white/50 absolute -right-1 -top-2" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">London</span>
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
              </div>

              {/* Stats: 24 Days | 10 Countries | 23 Cities */}
              <div className="flex items-center justify-center gap-6 md:gap-10">
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.duration?.replace(' Days', '') || '24'}</span>
                  <p className="text-xs text-white/60 mt-0.5">Days</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.countriesCount || 10}</span>
                  <p className="text-xs text-white/60 mt-0.5">Countries</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <span className="text-3xl md:text-4xl font-black">{currentTrip.citiesCount || 23}</span>
                  <p className="text-xs text-white/60 mt-0.5">Cities</p>
                </div>
              </div>
            </div>

            {/* Description card — Contiki-style italic serif */}
            <div className="container mx-auto max-w-5xl px-4 pb-8">
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-serif italic text-white/90 leading-snug">
                  {currentTrip.description}
                </h2>
                <p className="text-sm text-white/60 leading-relaxed">
                  {currentTrip.content}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. CONTIKI-STYLE 3-TAB NAVIGATION (Overview | Map & Itinerary | FAQs)
        ═══════════════════════════════════════════════════════════ */}
        <div className={`sticky top-0 z-30 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)] transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
          <div className="container mx-auto max-w-5xl px-4">
            <nav className="flex items-center gap-6 md:gap-8">
              {TAB_SECTIONS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const el = document.getElementById(`tab-section-${tab.id}`);
                    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 72; window.scrollTo({ top: y, behavior: 'smooth' }); }
                  }}
                  className={`py-4 text-sm md:text-base font-bold transition-all border-b-3 ${
                    activeTab === tab.id
                      ? 'text-orange-500 border-orange-500'
                      : 'text-[var(--color-ink-faint)] border-transparent hover:text-[var(--color-ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            3. OVERVIEW TAB CONTENT
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-overview" className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-14">

          {/* ── "What you'll get from this trip" (Contiki exact) ── */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              What you'll get from this trip
            </h2>

            {/* Price + Group Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center">
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">From</p>
                <p className="text-3xl font-black text-[var(--color-ink)]">{'\u20B9'}{currentTrip.price.toLocaleString()}<span className="text-sm font-normal text-[var(--color-ink-faint)] ml-1">pp</span></p>
              </div>
              <div className="hidden md:block w-px h-12 bg-[var(--color-border-subtle)]" />
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Group Size</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Maximum {currentTrip.maxParticipants} people</p>
              </div>
              <div className="hidden md:block w-px h-12 bg-[var(--color-border-subtle)]" />
              <div>
                <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-1">Accommodation</p>
                <p className="text-sm text-[var(--color-ink-muted)]">Twin-share boutique hotels</p>
              </div>
            </div>

            {/* What's included — Contiki-style vertical icon list */}
            <div className="max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-[var(--color-ink)] mb-5">What's included:</h3>
              <div className="space-y-4">
                {currentTrip.included?.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center text-orange-500">
                      {i === 0 && <Bus className="w-6 h-6" />}
                      {i === 1 && <MapPin className="w-6 h-6" />}
                      {i === 2 && <Compass className="w-6 h-6" />}
                      {i === 3 && <Coffee className="w-6 h-6" />}
                      {i === 4 && <UtensilsCrossed className="w-6 h-6" />}
                      {i === 5 && <UtensilsCrossed className="w-6 h-6" />}
                      {i === 6 && <Users className="w-6 h-6" />}
                    </div>
                    <span className="text-[15px] text-[var(--color-ink)] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Day Trip Highlights (Contiki exact) ── */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif italic text-[var(--color-ink)]">
                Day trip highlights
              </h2>
              <p className="text-sm text-[var(--color-ink-faint)]">
                Discover the moments that make this trip unforgettable — from must-see sights to optional adventures.
              </p>
            </div>
            <HighlightsCarousel included={includedHighlights} addOns={addOnExperiences} />
          </section>

          {/* ── Cross-Campus Synergy (ConSoul unique) ── */}
          <section className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-bold text-[var(--color-ink)]">
                Different Campuses. Distinct Minds. One Tribe.
              </h3>
            </div>
            <p className="text-sm text-[var(--color-ink-muted)] mb-4 leading-relaxed">
              85% join solo without a friend group. You are paired with curated, curious students and young graduates across top Indian and international universities.
            </p>
            <div className="flex flex-wrap gap-2">
              {['IIT Delhi', 'SRCC Delhi', 'BITS Pilani', 'St. Stephen\'s', 'IIM Bangalore', 'NIFT Mumbai', 'Christ Bangalore', 'Ashoka University'].map((col) => (
                <span key={col} className="px-3 py-1 bg-[var(--color-border-subtle)] border border-[var(--color-border-hover)] rounded-full text-xs font-semibold text-[var(--color-ink-muted)]">
                  {col}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            4. MAP & ITINERARY TAB
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-map-itinerary" className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-10">

            {/* Itinerary heading — Contiki exact */}
            <h2 className="text-3xl md:text-4xl font-serif italic text-[var(--color-ink)]">
              {currentTrip.itinerary?.length || 24}-Day Itinerary
            </h2>

            {/* Day-by-day accordion — Contiki exact structure */}
            {currentTrip.itinerary && currentTrip.itinerary.length > 0 && (
              <div className="divide-y divide-[var(--color-border-subtle)]">
                {currentTrip.itinerary.map((dayItem) => {
                  const isExpanded = expandedDays.has(dayItem.day);
                  return (
                    <div key={dayItem.day} className="group">
                      {/* Row Header — Contiki: Day # / City → City / meals / + button */}
                      <button
                        onClick={() => toggleDay(dayItem.day)}
                        className="w-full text-left py-5 md:py-6 flex items-start md:items-center justify-between gap-4 hover:bg-[var(--color-border-subtle)]/30 transition-colors px-2 rounded-lg"
                        aria-expanded={isExpanded}
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--color-ink-faint)] uppercase tracking-wider">Day {dayItem.day}</p>
                          <h3 className="text-xl md:text-2xl font-bold text-orange-500">
                            {dayItem.from}
                            {dayItem.to && (
                              <> <span className="text-[var(--color-ink-faint)] font-normal mx-1">&rarr;</span> <span className="text-orange-500">{dayItem.to}</span></>
                            )}
                          </h3>
                          {/* Meal & experience tags */}
                          <div className="flex items-center gap-3 flex-wrap">
                            {dayItem.meals.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-[var(--color-ink-muted)] font-medium">{dayItem.meals.join(', ')}</span>
                              </div>
                            )}
                            {dayItem.experiencesCount > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Ticket className="w-4 h-4 text-orange-500" />
                                <span className="text-xs text-[var(--color-ink-muted)] font-medium">{dayItem.experiencesCount} Included experience{dayItem.experiencesCount > 1 ? 's' : ''}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Expand/Collapse icon — Contiki uses - / + */}
                        <div className="shrink-0 mt-2 md:mt-0">
                          {isExpanded ? (
                            <Minus className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-[var(--color-ink-faint)] group-hover:text-orange-500 transition-colors" />
                          )}
                        </div>
                      </button>

                      {/* Expanded content — Contiki-style vertical timeline */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="pb-6 pl-4 md:pl-6">
                          {/* Vertical timeline with location stops */}
                          <div className="border-l-2 border-dashed border-orange-500/40 pl-6 space-y-6 ml-2">
                            {/* Stop: From city */}
                            <div className="relative">
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-orange-500 bg-[var(--color-canvas)]" />
                              <h4 className="text-lg font-bold text-orange-500 mb-2">{dayItem.from}</h4>
                              <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                                {dayItem.description}
                              </p>
                            </div>

                            {/* Stop: To city (if different) */}
                            {dayItem.to && (
                              <div className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-orange-500 bg-[var(--color-canvas)]" />
                                <h4 className="text-lg font-bold text-orange-500">{dayItem.to}</h4>
                              </div>
                            )}

                            {/* Highlight experience card */}
                            {dayItem.highlightExperience && (
                              <div className="relative">
                                <div className="absolute -left-[31px] top-3 w-4 h-4 rounded-full bg-orange-500" />
                                <div className="bg-[var(--color-canvas-raised)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <img src={tripImages[dayItem.day % tripImages.length] || tripImages[0]} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-[var(--color-ink-faint)] uppercase tracking-wider mb-0.5">Included Experience</p>
                                    <p className="text-sm font-semibold text-orange-500">{dayItem.highlightExperience}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Meals badges */}
                            <div className="flex flex-wrap gap-2">
                              {dayItem.meals.map((m) => (
                                <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-border-subtle)] text-xs text-[var(--color-ink-muted)] font-medium">
                                  <UtensilsCrossed className="w-3 h-3 text-orange-500" />
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Expand/Collapse all */}
            <div className="text-center">
              <button onClick={toggleExpandAll} className="px-6 py-2.5 bg-[var(--color-border-subtle)] hover:bg-[var(--color-border-hover)] rounded-full text-sm font-bold text-[var(--color-ink-muted)] transition-all">
                {allExpanded ? 'Collapse All Days' : 'Expand All Days'}
              </button>
            </div>

            {/* ── What's Included / Not Included ── */}
            <section className="space-y-6 pt-8 border-t border-[var(--color-border-subtle)]">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-emerald-500/20 rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Check className="w-5 h-5 text-emerald-500" /></div>
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">What's Included</h3>
                  </div>
                  <div className="space-y-3">
                    {currentTrip.included?.map((inc, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-ink-muted)]">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-red-500/20 rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center"><X className="w-5 h-5 text-red-500" /></div>
                    <h3 className="text-lg font-bold text-[var(--color-ink)]">Not Included</h3>
                  </div>
                  <div className="space-y-3">
                    {currentTrip.notIncluded?.map((notInc, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--color-ink-muted)]">{notInc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Booking / Deposit Info (ConSoul unique) ── */}
            <section className="border border-orange-500/20 border-dashed rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Book with confidence</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Zap className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">Only {'\u20B9'}{depositAmount} deposit to book</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Calendar className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">No booking fee, no change fee</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Shield className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">Pay balance 15 days before</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center"><Phone className="w-5 h-5 text-orange-500" /></div>
                    <p className="text-xs text-[var(--color-ink-muted)] font-medium">24/7 support</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            5. FAQs TAB — Cancellation & Refund Policy
        ═══════════════════════════════════════════════════════════ */}
        <div id="tab-section-faqs" className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-10">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              Trip FAQs
            </h2>

            {/* Cancellation Policy */}
            <div className="border border-[var(--color-border-subtle)] rounded-2xl p-6 md:p-8 bg-[var(--color-canvas-raised)]">
              <div className="flex items-center gap-3 mb-5">
                <ShieldAlert className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-[var(--color-ink)]">Cancellation & Refund Policy</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-3 mb-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">&gt; 15 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Full refund (minus gateway fee) or 100% transfer.</p>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">15 – 10 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">10% registration fee refunded (90% locked).</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">&lt; 10 Days Prior</p>
                  <p className="text-xs text-[var(--color-ink-muted)]">Strictly non-refundable due to vendor commitments.</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-[var(--color-ink-faint)] pt-3 border-t border-[var(--color-border-subtle)]">
                <span>Questions on flexible booking or travel insurance?</span>
                <Link href="/refund-policy" className="text-orange-500 hover:underline font-bold">Read Complete Terms &rarr;</Link>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            6. TRIP REVIEWS (Contiki-style centered layout)
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[var(--color-canvas)]">
          <div className="container mx-auto max-w-5xl px-4 py-10 md:py-14 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-[var(--color-ink)]">
              Trip Reviews
            </h2>

            {/* Overall Rating — Contiki centered style */}
            <div className="text-center space-y-3">
              <p className="text-sm font-bold text-orange-500 uppercase tracking-wider">Overall Rating</p>
              <p className="text-6xl font-black text-[var(--color-ink)]">{currentTrip.rating || 4.8}</p>
              <p className="text-sm font-semibold text-[var(--color-ink-muted)]">Out Of 5</p>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-5 h-5 ${s <= Math.round(currentTrip.rating || 4.8) ? 'fill-orange-500 text-orange-500' : 'text-gray-300 dark:text-white/20'}`} />
                ))}
              </div>
              <p className="text-xs text-[var(--color-ink-faint)]">Based on {currentTrip.reviewCount || 342} Independent Reviews</p>
            </div>

            {/* Review Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {VERIFIED_REVIEWS.map((review, i) => (
                <div key={i} className="border border-[var(--color-border-subtle)] rounded-xl p-5 bg-[var(--color-canvas-raised)] hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-orange-500 text-orange-500' : 'text-gray-300 dark:text-white/20'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-4">&ldquo;{review.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
                    <div className="w-8 h-8 rounded-full bg-orange-500/15 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-orange-500">{review.initials}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[var(--color-ink)]">{review.name}</p>
                      <p className="text-[11px] text-[var(--color-ink-faint)]">{review.campus} &middot; {review.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            7. "TRIPS YOU MAY LIKE" (Contiki — dark bg section)
        ═══════════════════════════════════════════════════════════ */}
        <div className="bg-[#1a1d24] text-white">
          <div className="container mx-auto max-w-5xl px-4 py-12 md:py-16 space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif italic text-center text-white">
              Trips you may like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RELATED_EXPEDITIONS.map((relTrip) => (
                <Link key={relTrip.id} href={`/trip/${relTrip.id}`} className="group">
                  <div className="rounded-2xl overflow-hidden hover:ring-2 hover:ring-orange-500/50 transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={relTrip.image} alt={relTrip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-lg font-bold text-white mb-1">{relTrip.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/70">
                          <span>{relTrip.duration}</span>
                          <span className="text-white/30">&middot;</span>
                          <span>{relTrip.countries} countries</span>
                        </div>
                        <p className="text-sm font-bold text-white mt-2">From {'\u20B9'}{relTrip.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            8. STICKY BOTTOM BAR — Contiki-style (mobile + desktop)
        ═══════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-canvas-raised)]/95 backdrop-blur-xl border-t border-[var(--color-border-subtle)] py-3 px-4 z-40 shadow-[0_-2px_20px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
            {/* Left: Trip name + stats */}
            <div className="flex items-center gap-4 min-w-0">
              <h3 className="text-base md:text-lg font-bold text-orange-500 truncate">{currentTrip.title}</h3>
              <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--color-ink-muted)] font-medium shrink-0">
                <span>{currentTrip.duration?.replace(' Days', '') || '24'} <span className="text-[var(--color-ink-faint)]">Days</span></span>
                <span className="text-[var(--color-border-subtle)]">|</span>
                <span>{currentTrip.countriesCount || 10} <span className="text-[var(--color-ink-faint)]">Countries</span></span>
                <span className="text-[var(--color-border-subtle)]">|</span>
                <span>{currentTrip.citiesCount || 23} <span className="text-[var(--color-ink-faint)]">Cities</span></span>
              </div>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border-hover)] rounded-full text-xs font-bold text-[var(--color-ink)] hover:bg-[var(--color-border-subtle)] transition-colors">
                Compare this trip <ChevronRight className="w-3 h-3" />
              </a>
              <Link href={`/trip/${currentTrip.id}/join`}>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-5 rounded-full text-xs md:text-sm transition-colors flex items-center gap-2">
                  Select Dates <Calendar className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FULLSCREEN LIGHTBOX
      ═══════════════════════════════════════════════════════════ */}
      {lightboxOpen && tripImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p - 1 + tripImages.length) % tripImages.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors">
            &#8249;
          </button>
          <img src={tripImages[lightboxIndex]} alt="Gallery preview" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((p) => (p + 1) % tripImages.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors">
            &#8250;
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {tripImages.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }} className={`h-2 rounded-full transition-all ${i === lightboxIndex ? 'bg-orange-500 w-8' : 'bg-white/30 w-2 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
      )}

      <BottomTabBar />
    </>
  );
}
