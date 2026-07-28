"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import Link from "next/link";
import type { EditTrip, RouteSegment } from "@/types/Trip";
import { uploadImageToImgBB } from "@/lib/imgbb";

const tripCategories = [
    "Adventure",
    "Cultural",
    "Wildlife",
    "Beach",
    "Mountain",
    "Historical",
];

const difficultyLevels = ["Easy", "Moderate", "Challenging", "Expert"];
const transportModes = ["bus", "train"];

export default function EditTripPage() {
    const router = useRouter();
    const params = useParams();
    const tripId = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState<EditTrip>({
        id:tripId,
        title: "",
        destination: "",
        category: "",
        description: "",
        content: "",
        images: [],
        status: "archived",
        startDate: "",
        endDate: "",
        price: 0,
        maxParticipants: 0,
        difficulty: "Moderate",
        duration: "",
        included: [],
        notIncluded: [],
        mode: "bus",
        price_3ac: 0,
        price_sleeper: 0,
        travelRoute: [],
    });

    const [newRouteSegment, setNewRouteSegment] = useState<RouteSegment>({
        from: "",
        to: "",
        mode: "train",
        classes: [],
        departureTime: "",
        arrivalTime: "",
        duration: "",
        notes: "",
    });
    const [currentClass, setCurrentClass] = useState("");

    const [includedItem, setIncludedItem] = useState("");
    const [notIncludedItem, setNotIncludedItem] = useState("");

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await fetch(`/api/trips/${tripId}`);
                if (!res.ok) throw new Error("Failed to fetch trip");

                const trip = await res.json();

                // Format dates for input fields
                setFormData({
                    ...trip,
                    startDate: trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : "",
                    endDate: trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : "",
                    travelRoute: trip.travelRoute || [],
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load trip data",
                    variant: "destructive",
                });
            } finally {
                setFetching(false);
            }
        };

        fetchTrip();
    }, [tripId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const addIncludedItem = () => {
        if (includedItem.trim()) {
            setFormData((prev) => ({
                ...prev,
                included: [...(prev.included || []), includedItem.trim()],
            }));
            setIncludedItem("");
        }
    };

    const removeIncludedItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            included: prev.included?.filter((_, i) => i !== index) || [],
        }));
    };

    const addNotIncludedItem = () => {
        if (notIncludedItem.trim()) {
            setFormData((prev) => ({
                ...prev,
                notIncluded: [...(prev.notIncluded || []), notIncludedItem.trim()],
            }));
            setNotIncludedItem("");
        }
    };

    const removeNotIncludedItem = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            notIncluded: prev.notIncluded?.filter((_, i) => i !== index) || [],
        }));
    };

    const handleRouteSegmentChange = (field: keyof RouteSegment, value: any) => {
        setNewRouteSegment((prev) => ({ ...prev, [field]: value }));
    };

    const addRouteClass = () => {
        if (currentClass.trim()) {
            setNewRouteSegment(prev => ({
                ...prev,
                classes: [...prev.classes, currentClass.trim()]
            }));
            setCurrentClass("");
        }
    };

    const removeRouteClass = (index: number) => {
        setNewRouteSegment(prev => ({
            ...prev,
            classes: prev.classes.filter((_, i) => i !== index)
        }));
    };

    const addRouteSegment = () => {
        if (newRouteSegment.from && newRouteSegment.to && newRouteSegment.departureTime && newRouteSegment.arrivalTime) {
            setFormData(prev => ({
                ...prev,
                travelRoute: [...(prev.travelRoute || []), newRouteSegment]
            }));
            setNewRouteSegment({
                from: "",
                to: "",
                mode: "train",
                classes: [],
                departureTime: "",
                arrivalTime: "",
                duration: "",
                notes: "",
            });
        } else {
            toast({
                title: "Validation Error",
                description: "Please fill in From, To, Departure and Arrival times",
                variant: "destructive",
            });
        }
    };

    const removeRouteSegment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            travelRoute: prev.travelRoute?.filter((_, i) => i !== index) || []
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);

        try {
            // Upload all images to ImgBB
            const uploadPromises = Array.from(files).map((file) =>
                uploadImageToImgBB(file)
            );

            const uploadedImages = await Promise.all(uploadPromises);

            const newImages = uploadedImages.map((img) => ({
                url: img.url,
                deleteUrl: img.deleteUrl,
            }));

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages],
            }));

            toast({
                title: "Success!",
                description: `${files.length} image(s) uploaded successfully`,
            });
        } catch (error) {
            toast({
                title: "Upload Failed",
                description: error instanceof Error ? error.message : "Failed to upload images",
                variant: "destructive",
            });
        } finally {
            setUploadingImages(false);
            // Reset file input
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));

        toast({
            title: "Image Removed",
            description: "Image has been removed from the list",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.destination || !formData.category) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/trips/${tripId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to update trip");
            }

            // Clear the cache
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith('dashboard_trips_')) {
                    sessionStorage.removeItem(key);
                }
            });

            toast({
                title: "Success!",
                description: "Trip updated successfully",
            });

            router.push("/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update trip. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gold" />
                    <p className="text-gray-400">Loading trip details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            className="mb-4 text-gray-400 hover:text-gold hover:bg-white/5"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-gold mb-2">
                        Edit Trip
                    </h1>
                    <p className="text-gray-400">
                        Update the trip details below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title" className="text-gray-300">
                                    Trip Title *
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-black/50 border-white/10 text-white"
                                    placeholder="e.g., Himalayan Adventure Trek"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="destination" className="text-gray-300">
                                    Destination *
                                </Label>
                                <Input
                                    id="destination"
                                    name="destination"
                                    value={formData.destination}
                                    onChange={handleInputChange}
                                    className="bg-black/50 border-white/10 text-white"
                                    placeholder="e.g., Nepal, Himalayas"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category" className="text-gray-300">
                                        Category *
                                    </Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleSelectChange("category", value)}
                                    >
                                        <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10">
                                            {tripCategories.map((cat) => (
                                                <SelectItem
                                                    key={cat}
                                                    value={cat}
                                                    className="text-white hover:bg-white/10"
                                                >
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="difficulty" className="text-gray-300">
                                        Difficulty Level
                                    </Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={(value) => handleSelectChange("difficulty", value)}
                                    >
                                        <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10">
                                            {difficultyLevels.map((level) => (
                                                <SelectItem
                                                    key={level}
                                                    value={level}
                                                    className="text-white hover:bg-white/10"
                                                >
                                                    {level}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description" className="text-gray-300">
                                    Short Description
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="bg-black/50 border-white/10 text-white min-h-[100px]"
                                    placeholder="Brief overview of the trip (2-3 sentences)"
                                />
                            </div>

                            <div>
                                <Label htmlFor="content" className="text-gray-300">
                                    Detailed Description
                                </Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    className="bg-black/50 border-white/10 text-white min-h-[200px]"
                                    placeholder="Full details about the trip, itinerary highlights, what to expect..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Trip Details */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">Trip Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="startDate" className="text-gray-300">
                                        Start Date
                                    </Label>
                                    <Input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="endDate" className="text-gray-300">
                                        End Date
                                    </Label>
                                    <Input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={handleInputChange}
                                        className="bg-black/50 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="duration" className="text-gray-300">
                                        Duration
                                    </Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="e.g., 7 days 6 nights"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="mode" className="text-gray-300">
                                        Mode of Transportation *
                                    </Label>
                                    <Select
                                        value={formData.mode}
                                        onValueChange={(value) => handleSelectChange("mode", value)}
                                    >
                                        <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-900 border-white/10">
                                            {transportModes.map((mode) => (
                                                <SelectItem
                                                    key={mode}
                                                    value={mode}
                                                    className="text-white hover:bg-white/10 capitalize"
                                                >
                                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="price" className="text-gray-300">
                                        {formData.mode === "train" ? "Base Price (₹)" : "Price (₹)"} *
                                    </Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => handleNumberChange("price", e.target.value)}
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="0"
                                    />
                                </div>

                                {formData.mode === "train" && (
                                    <>
                                        <div>
                                            <Label htmlFor="price_3ac" className="text-gray-300">
                                                3AC Price (₹)
                                            </Label>
                                            <Input
                                                id="price_3ac"
                                                name="price_3ac"
                                                type="number"
                                                value={formData.price_3ac}
                                                onChange={(e) => handleNumberChange("price_3ac", e.target.value)}
                                                className="bg-black/50 border-white/10 text-white"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="price_sleeper" className="text-gray-300">
                                                Sleeper Price (₹)
                                            </Label>
                                            <Input
                                                id="price_sleeper"
                                                name="price_sleeper"
                                                type="number"
                                                value={formData.price_sleeper}
                                                onChange={(e) => handleNumberChange("price_sleeper", e.target.value)}
                                                className="bg-black/50 border-white/10 text-white"
                                                placeholder="0"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label htmlFor="registrationAmount" className="text-gray-300">
                                        Registration Amount (Optional)
                                    </Label>
                                    <Input
                                        id="registrationAmount"
                                        name="registrationAmount"
                                        type="number"
                                        value={formData.registrationAmount ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                registrationAmount: e.target.value ? parseFloat(e.target.value) : undefined,
                                            }))
                                        }
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="Leave empty for full payment"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        If set, users pay only this amount to register. Remaining is payable later.
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="maxParticipants" className="text-gray-300">
                                        Max Participants
                                    </Label>
                                    <Input
                                        id="maxParticipants"
                                        name="maxParticipants"
                                        type="number"
                                        value={formData.maxParticipants}
                                        onChange={(e) =>
                                            handleNumberChange("maxParticipants", e.target.value)
                                        }
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Travel Route Builder */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">Travel Route Builder</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-black/30">
                                <h3 className="font-semibold text-gray-300">Add Route Segment</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="segmentFrom" className="text-gray-300">From *</Label>
                                        <Input
                                            id="segmentFrom"
                                            value={newRouteSegment.from}
                                            onChange={(e) => handleRouteSegmentChange("from", e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            placeholder="Departure City"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="segmentTo" className="text-gray-300">To *</Label>
                                        <Input
                                            id="segmentTo"
                                            value={newRouteSegment.to}
                                            onChange={(e) => handleRouteSegmentChange("to", e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            placeholder="Arrival City"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="segmentMode" className="text-gray-300">Mode *</Label>
                                        <Select
                                            value={newRouteSegment.mode}
                                            onValueChange={(value) => handleRouteSegmentChange("mode", value)}
                                        >
                                            <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-gray-900 border-white/10">
                                                <SelectItem value="train" className="text-white hover:bg-white/10">Train</SelectItem>
                                                <SelectItem value="bus" className="text-white hover:bg-white/10">Bus</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-gray-300">Travel Classes</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentClass}
                                                onChange={(e) => setCurrentClass(e.target.value)}
                                                className="bg-black/50 border-white/10 text-white"
                                                placeholder="e.g., 3AC, Sleeper"
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRouteClass())}
                                            />
                                            <Button type="button" onClick={addRouteClass} className="bg-gold/20 text-gold hover:bg-gold/30">
                                                Add
                                            </Button>
                                        </div>
                                        {newRouteSegment.classes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {newRouteSegment.classes.map((cls, idx) => (
                                                    <span key={idx} className="bg-gold/10 text-gold text-xs px-2 py-1 rounded-full flex items-center gap-1 border border-gold/20">
                                                        {cls}
                                                        <button type="button" onClick={() => removeRouteClass(idx)} className="hover:text-red-400">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="segmentDepTime" className="text-gray-300">Departure Time *</Label>
                                        <Input
                                            id="segmentDepTime"
                                            value={newRouteSegment.departureTime}
                                            onChange={(e) => handleRouteSegmentChange("departureTime", e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            placeholder="e.g., 21:00 (Day 1)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="segmentArrTime" className="text-gray-300">Arrival Time *</Label>
                                        <Input
                                            id="segmentArrTime"
                                            value={newRouteSegment.arrivalTime}
                                            onChange={(e) => handleRouteSegmentChange("arrivalTime", e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            placeholder="e.g., 08:00 (Day 2)"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="segmentDuration" className="text-gray-300">Duration (Optional)</Label>
                                        <Input
                                            id="segmentDuration"
                                            value={newRouteSegment.duration}
                                            onChange={(e) => handleRouteSegmentChange("duration", e.target.value)}
                                            className="bg-black/50 border-white/10 text-white"
                                            placeholder="e.g., 11h"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="segmentNotes" className="text-gray-300">Notes (Optional)</Label>
                                    <Input
                                        id="segmentNotes"
                                        value={newRouteSegment.notes}
                                        onChange={(e) => handleRouteSegmentChange("notes", e.target.value)}
                                        className="bg-black/50 border-white/10 text-white"
                                        placeholder="e.g., Meet at Platform 1"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        onClick={addRouteSegment}
                                        className="bg-gold hover:bg-yellow-600 text-black"
                                    >
                                        Add Segment
                                    </Button>
                                </div>
                            </div>

                            {/* Existing Segments Timeline */}
                            {formData.travelRoute && formData.travelRoute.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-300">Current Route</h3>
                                    <div className="relative pl-6 space-y-4 border-l-2 border-white/10 ml-2">
                                        {formData.travelRoute.map((segment, index) => (
                                            <div key={index} className="relative bg-black/40 p-4 rounded-lg border border-white/5">
                                                <div className="absolute -left-[31px] top-4 w-4 h-4 rounded-full bg-gold border-4 border-black"></div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-white uppercase tracking-wider">{segment.from}</span>
                                                            <span className="text-gold">→</span>
                                                            <span className="font-bold text-white uppercase tracking-wider">{segment.to}</span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300 ml-2 capitalize">
                                                                {segment.mode}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-400 grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                                                            <div><span className="text-gray-500">Dep:</span> {segment.departureTime}</div>
                                                            <div><span className="text-gray-500">Arr:</span> {segment.arrivalTime}</div>
                                                            {segment.duration && <div><span className="text-gray-500">Dur:</span> {segment.duration}</div>}
                                                        </div>
                                                        {segment.classes && segment.classes.length > 0 && (
                                                            <div className="flex gap-1 mt-2">
                                                                {segment.classes.map((cls, i) => (
                                                                    <span key={i} className="text-xs px-1.5 py-0.5 bg-black/60 border border-white/10 rounded text-gray-300">
                                                                        {cls}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {segment.notes && (
                                                            <div className="mt-2 text-sm text-gray-400 italic">
                                                                Note: {segment.notes}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeRouteSegment(index)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 -mt-2 -mr-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* What's Included */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">What's Included</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={includedItem}
                                    onChange={(e) => setIncludedItem(e.target.value)}
                                    placeholder="e.g., Airport transfers"
                                    className="bg-black/50 border-white/10 text-white"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedItem())}
                                />
                                <Button
                                    type="button"
                                    onClick={addIncludedItem}
                                    className="bg-gold hover:bg-yellow-600 text-black"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.included?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-black/50 p-2 rounded border border-white/10"
                                    >
                                        <span className="text-gray-300">{item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeIncludedItem(index)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* What's Not Included */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">What's Not Included</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={notIncludedItem}
                                    onChange={(e) => setNotIncludedItem(e.target.value)}
                                    placeholder="e.g., Personal expenses"
                                    className="bg-black/50 border-white/10 text-white"
                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addNotIncludedItem())}
                                />
                                <Button
                                    type="button"
                                    onClick={addNotIncludedItem}
                                    className="bg-gold hover:bg-yellow-600 text-black"
                                >
                                    Add
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.notIncluded?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-black/50 p-2 rounded border border-white/10"
                                    >
                                        <span className="text-gray-300">{item}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeNotIncludedItem(index)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">Trip Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="images" className="text-gray-300">
                                    Upload Images
                                </Label>
                                <div className="mt-2">
                                    <input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                        className="hidden"
                                    />
                                    <label htmlFor="images">
                                        <div className={`border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-gold transition-colors ${uploadingImages ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            {uploadingImages ? (
                                                <>
                                                    <Loader2 className="h-8 w-8 mx-auto mb-2 text-gold animate-spin" />
                                                    <p className="text-gray-400">
                                                        Uploading images...
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                    <p className="text-gray-400">
                                                        Click to upload images or drag and drop
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.url}
                                                alt={`Trip image ${index + 1}`}
                                                className="w-full h-32 object-cover rounded border border-white/10"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 h-6 w-6 p-0 bg-red-500/80 hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-gold">Publication Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => handleSelectChange("status", value)}
                            >
                                <SelectTrigger className="bg-black/50 border-white/10 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10">
                                    <SelectItem value="completed" className="text-white hover:bg-white/10">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="published" className="text-white hover:bg-white/10">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="archived" className="text-white hover:bg-white/10">
                                        Archived
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Link href="/dashboard">
                            <Button
                                type="button"
                                variant="outline"
                                className="border-white/10 text-gray-300 hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={loading || uploadingImages}
                            className="bg-gold hover:bg-yellow-600 text-black font-semibold"
                        >
                            {loading ? "Updating..." : "Update Trip"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
