export interface Trip {
    id?: string;
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
    itinerary?: { day: number; title: string; description: string }[];
    featured?: boolean;
    rating?: number;
    reviewCount?: number;
    mode?: "bus" | "train"; // NEW
    price_3ac?: number; // NEW - for train trips
    price_sleeper?: number; // NEW - for train trips
}

export type TripFormData = Trip;
