"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TripItems from "./TripItems";
import DeleteTripDialog from "./DeleteTripDialog";
import type { Trip } from "@/types/Trip";
import Link from "next/link";

const tripCategories = [
  "Adventure",
  "Cultural",
  "Wildlife",
  "Beach",
  "Mountain",
  "Historical",
];

export function ManageTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async (force = false) => {
    setLoading(true);
    setError(null);

    const CACHE_DURATION = 120000; // 2 minutes
    const cacheKey = `dashboard_trips_${selectedCategory}_${selectedStatus}`;
    const cached = sessionStorage.getItem(cacheKey);
    const cachedAt = sessionStorage.getItem(`${cacheKey}_at`);
    const now = Date.now();

    // Use cache if available and not forced refresh
    if (
      !force &&
      cached &&
      cachedAt &&
      now - Number(cachedAt) < CACHE_DURATION
    ) {
      try {
        const cachedTrips = JSON.parse(cached);
        if (Array.isArray(cachedTrips)) {
          setTrips(cachedTrips);
          setLoading(false);
          return;
        }
      } catch (error) {
        // Clear corrupted cache
        sessionStorage.removeItem(cacheKey);
        sessionStorage.removeItem(`${cacheKey}_at`);
      }
    }

    try {
      const url = new URL("/api/trips", window.location.origin);

      if (selectedCategory !== "all") {
        url.searchParams.append("category", selectedCategory);
      }
      if (selectedStatus !== "all") {
        url.searchParams.append("status", selectedStatus);
      }

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const response = await res.json();

      let tripsData: Trip[];
      if (response.data && Array.isArray(response.data)) {
        tripsData = response.data;
      } else if (Array.isArray(response)) {
        tripsData = response;
      } else {
        throw new Error("Invalid response format");
      }

      setTrips(tripsData);
      sessionStorage.setItem(cacheKey, JSON.stringify(tripsData));
      sessionStorage.setItem(`${cacheKey}_at`, now.toString());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trips";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setTrips([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, [selectedCategory, selectedStatus]);

  const openDeleteDialog = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTrip = async () => {
    if (!selectedTrip?.id) {
      toast({
        title: "Error",
        description: "No trip selected for deletion",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTrip.id }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }

      toast({
        title: "Success!",
        description: "Trip has been deleted successfully",
      });

      setIsDeleteDialogOpen(false);
      setSelectedTrip(null);

      sessionStorage.removeItem(`dashboard_trips_${selectedCategory}_${selectedStatus}`);
      sessionStorage.removeItem(`dashboard_trips_${selectedCategory}_${selectedStatus}_at`);
      await fetchTrips(true);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete trip";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setLoading(false);
  };
// 
  const handleStatusChange = async (tripId: string, newStatus: 'completed' | 'published' | 'archived') => {
    if (!tripId) {
      toast({
        title: "Error",
        description: "Invalid trip ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tripId, status: newStatus }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `HTTP error! status: ${res.status}`);
      }

      toast({
        title: "Success!",
        description: `Trip status updated to ${newStatus}`,
      });

      sessionStorage.removeItem(`dashboard_trips_${selectedCategory}_${selectedStatus}`);
      sessionStorage.removeItem(`dashboard_trips_${selectedCategory}_${selectedStatus}_at`);
      await fetchTrips(true);

    } catch (err: any) {
      const errorMessage = err.message || "Failed to update trip status";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const filteredTrips = (trips || []).filter(trip => {
    if (!trip) return false;

    const matchesSearch = (
      (trip.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesCategory = selectedCategory === "all" || trip.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || trip.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleRefresh = () => {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('dashboard_trips_')) {
        sessionStorage.removeItem(key);
      }
    });
    fetchTrips(true);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStatus("all");
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg border bg-white/5 border-white/10 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-gold">
            Trip Management
          </h2>
          <p className="text-base text-gray-400">
            Manage your travel trips and destinations
          </p>
          {error && (
            <p className="text-sm text-red-400 mt-1">
              Error: {error}
            </p>
          )}
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="inline-flex items-center gap-2 border-white/10 hover:bg-white/5 text-gray-300"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link
            href="/dashboard/create-trip"
            className="inline-flex items-center gap-2 px-6 py-3 font-medium bg-gold hover:bg-yellow-600 text-black border-none rounded-lg text-sm shadow-sm transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Trip
          </Link>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search trips by title, destination, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/50 border-white/10 text-white placeholder:text-gray-600"
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-black/50 border-white/10 text-white">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Categories</SelectItem>
                {tripCategories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-white/10">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-36">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="bg-black/50 border-white/10 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all" className="text-white hover:bg-white/10">All Status</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                <SelectItem value="published" className="text-white hover:bg-white/10">Published</SelectItem>
                <SelectItem value="archived" className="text-white hover:bg-white/10">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredTrips.length} of {trips.length} trips
          </span>
          {(searchTerm || selectedCategory !== "all" || selectedStatus !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-400 hover:text-gold hover:bg-white/5"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-6 bg-white/5 backdrop-blur-sm">
        {loading && trips.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gold" />
              <p className="text-gray-400">Loading trips...</p>
            </div>
          </div>
        ) : filteredTrips.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {trips.length === 0 ? 'No trips found.' : 'No trips match your current filters.'}
            </p>
            {trips.length > 0 && (
              <Button onClick={handleClearFilters} variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <TripItems
            trips={filteredTrips}
            openDeleteDialog={openDeleteDialog}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        )}
      </div>

      <DeleteTripDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDeleteTrip={handleDeleteTrip}
        selectedTrip={selectedTrip}
        loading={loading}
      />
    </div>
  );
}
