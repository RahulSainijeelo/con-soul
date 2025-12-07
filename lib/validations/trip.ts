import { z } from "zod";

// Image validation schema
export const imageSchema = z.object({
    url: z.string().url("Invalid image URL"),
    deleteUrl: z.string().optional(),
});

// Itinerary item schema
export const itineraryItemSchema = z.object({
    day: z.number().int().positive("Day must be a positive integer"),
    title: z.string().min(1, "Itinerary title is required"),
    description: z.string().min(1, "Itinerary description is required"),
});

// Main trip validation schema
// Base trip schema without refinements
const baseTripSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must not exceed 200 characters"),

    destination: z
        .string()
        .min(2, "Destination must be at least 2 characters")
        .max(100, "Destination must not exceed 100 characters"),

    category: z.enum(
        ["Adventure", "Cultural", "Wildlife", "Beach", "Mountain", "Historical"],
        {
            errorMap: () => ({ message: "Please select a valid category" }),
        }
    ),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must not exceed 500 characters"),

    content: z
        .string()
        .min(50, "Content must be at least 50 characters")
        .max(10000, "Content must not exceed 10000 characters"),

    images: z
        .array(imageSchema)
        .min(1, "At least one image is required")
        .max(10, "Maximum 10 images allowed"),

    status: z.enum(["completed", "published", "archived"], {
        errorMap: () => ({ message: "Invalid status" }),
    }),

    startDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

    endDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),

    price: z
        .number()
        .positive("Price must be greater than 0")
        .max(1000000, "Price must not exceed 1,000,000"),

    maxParticipants: z
        .number()
        .int("Participants must be a whole number")
        .positive("Must have at least 1 participant")
        .max(1000, "Maximum 1000 participants allowed"),

    currentParticipants: z.number().int().nonnegative().optional(),

    difficulty: z
        .enum(["Easy", "Moderate", "Challenging", "Expert"])
        .optional(),

    duration: z.string().optional(),

    included: z.array(z.string()).optional(),

    notIncluded: z.array(z.string()).optional(),

    itinerary: z.array(itineraryItemSchema).optional(),

    featured: z.boolean().optional(),

    rating: z.number().min(0).max(5).optional(),

    reviewCount: z.number().int().nonnegative().optional(),
});

// Main trip schema with refinement
export const tripSchema = baseTripSchema.refine(
    (data) => {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end > start;
    },
    {
        message: "End date must be after start date",
        path: ["endDate"],
    }
);

// Schema for creating a trip (without auto-generated fields)
export const createTripSchema = baseTripSchema
    .omit({
        featured: true,
        rating: true,
        reviewCount: true,
        currentParticipants: true,
    })
    .refine(
        (data) => {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end > start;
        },
        {
            message: "End date must be after start date",
            path: ["endDate"],
        }
    );

// Schema for updating a trip (all fields optional except id)
export const updateTripSchema = baseTripSchema
    .partial()
    .extend({
        id: z.string().min(1, "Trip ID is required"),
    })
    .refine(
        (data) => {
            if (data.startDate && data.endDate) {
                const start = new Date(data.startDate);
                const end = new Date(data.endDate);
                return end > start;
            }
            return true;
        },
        {
            message: "End date must be after start date",
            path: ["endDate"],
        }
    );

// Schema for get trip by ID
export const getTripSchema = z.object({
    id: z.string().min(1, "Trip ID is required"),
});

// Schema for delete trip
export const deleteTripSchema = z.object({
    id: z.string().min(1, "Trip ID is required"),
});

// Schema for query parameters when listing trips
export const listTripsSchema = z.object({
    category: z.string().optional(),
    status: z.enum(["published", "archived", "completed"]).optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    featured: z.coerce.boolean().optional(),
});

export type TripInput = z.infer<typeof tripSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
export type ListTripsInput = z.infer<typeof listTripsSchema>;
