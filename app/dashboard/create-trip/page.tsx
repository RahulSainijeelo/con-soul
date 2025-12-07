"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import type { CreateTrip } from "@/types/Trip";
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

export default function CreateTripPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [formData, setFormData] = useState<CreateTrip>({
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
    });

    const [includedItem, setIncludedItem] = useState("");
    const [notIncludedItem, setNotIncludedItem] = useState("");

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);

        try {
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
            const res = await fetch("/api/trips", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                throw new Error("Failed to create trip");
            }

            // Clear the cache for manage trips
            const keys = Object.keys(sessionStorage);
            keys.forEach(key => {
                if (key.startsWith('dashboard_trips_')) {
                    sessionStorage.removeItem(key);
                }
            });

            toast({
                title: "Success!",
                description: "Trip created successfully",
            });

            router.push("/dashboard");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create trip. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

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
                        Create New Trip
                    </h1>
                    <p className="text-gray-400">
                        Fill in the details to create a new travel experience
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
                                        {formData.mode === "train" ? "Base Price (USD)" : "Price (USD)"} *
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
                                                3AC Price (USD)
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
                                                Sleeper Price (USD)
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
                                    <SelectItem value="archived" className="text-white hover:bg-white/10">
                                        Archived
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
                            disabled={loading}
                            className="bg-gold hover:bg-yellow-600 text-black font-semibold"
                        >
                            {loading ? "Creating..." : "Create Trip"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
