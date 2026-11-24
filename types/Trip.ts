export interface RouteSegment {
    from: string;
    to: string;
    mode: "train" | "bus";
    classes: string[];
    departureTime: string;
    arrivalTime: string;
    duration?: string;
    notes?: string;
}

export interface ItineraryDay {
    day: number;
    from: string;
    to?: string;
    title: string;
    description: string;
    meals: string[];
    experiencesCount: number;
    highlightExperience?: string;
}

interface BaseTrip {
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
    difficulty?: string;
    duration?: string;
    included?: string[];
    notIncluded?: string[];
    itinerary?: ItineraryDay[];
    featured?: boolean;
    rating?: number;
    reviewCount?: number;
    mode?: "bus" | "train"; // NEW
    price_3ac?: number; // NEW - for train trips
    price_sleeper?: number; // NEW - for train trips
    registrationAmount?: number; // Partial payment: minimum advance to join
    travelRoute?: RouteSegment[]; // Travel route segments
}

interface TripWithId extends BaseTrip {
    id: string;
}


export type CreateTrip = BaseTrip;
export type EditTrip = TripWithId;
