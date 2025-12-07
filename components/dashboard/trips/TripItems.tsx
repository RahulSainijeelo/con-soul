import React from "react";
import type { Trip } from "@/types/Trip";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Eye, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TripItemsProps {
  trips: Trip[];
  openDeleteDialog: (trip: Trip) => void;
  onStatusChange: (tripId: string, newStatus: 'completed' | 'published' | 'archived') => void;
  loading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'completed':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'archived':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    'Adventure': 'bg-red-500/20 text-red-400',
    'Cultural': 'bg-purple-500/20 text-purple-400',
    'Wildlife': 'bg-green-500/20 text-green-400',
    'Beach': 'bg-cyan-500/20 text-cyan-400',
    'Mountain': 'bg-blue-500/20 text-blue-400',
    'Historical': 'bg-amber-500/20 text-amber-400',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
};

const TripItems: React.FC<TripItemsProps> = ({
  trips,
  openDeleteDialog,
  onStatusChange,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
            <Skeleton className="aspect-video w-full mb-4 bg-white/10" />
            <div className="px-4 pb-4">
              <Skeleton className="h-6 w-2/3 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-1/3 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-full mb-4 bg-white/10" />
              <div className="flex justify-between gap-2">
                <Skeleton className="h-8 w-20 bg-white/10" />
                <Skeleton className="h-8 w-20 bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-gold" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No trips found</h3>
        <p className="text-gray-400 mb-6">Get started by creating your first trip.</p>
        <Link href="/dashboard/create-trip">
          <Button className="bg-gold hover:bg-yellow-600 text-black font-semibold">
            Create New Trip
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-black/50 border-white/10">

          {trip.images && trip.images.length > 0 && (
            <div className="aspect-video relative">
              <Image
                src={trip.images[0].url}
                alt={trip.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}

          <CardHeader className="pb-3">
            {/* Category and Status */}
            <div className="flex items-center justify-between mb-3">
              <Badge className={getCategoryColor(trip.category)}>
                {trip.category}
              </Badge>

              <Select
                value={trip.status}
                onValueChange={(value) => onStatusChange(trip.id, value as 'completed' | 'published' | 'archived')}
              >
                <SelectTrigger className="w-auto h-7 text-xs bg-black/50 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="completed" className="text-white hover:bg-white/10">Completed</SelectItem>
                  <SelectItem value="published" className="text-white hover:bg-white/10">Published</SelectItem>
                  <SelectItem value="archived" className="text-white hover:bg-white/10">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <CardTitle className="text-lg leading-tight line-clamp-2 text-white">
              {trip.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-3">
            {/* Trip Meta */}
            <div className="space-y-2 text-sm text-gray-400 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span>
                  {trip.startDate ? format(new Date(trip.startDate), 'MMM dd') : 'TBD'} -
                  {trip.endDate ? format(new Date(trip.endDate), 'MMM dd, yyyy') : 'TBD'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold" />
                  <span>{trip.maxParticipants} max</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold">${trip.price}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 line-clamp-2">
              {trip.description}
            </p>
          </CardContent>

          <CardFooter className="flex justify-between gap-2 pt-3 border-t border-white/10">
            {/* View Trip */}
            <Link href={`/trip/${trip.id}`} target="_blank">
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-300 hover:text-gold hover:bg-white/5">
                <Eye className="w-4 h-4" />
                View
              </Button>
            </Link>

            <div className="flex gap-2">
              {/* Edit Trip */}
              <Link href={`/dashboard/edit-trip/${trip.id}`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 border-white/10 text-gray-300 hover:bg-white/5">
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              </Link>

              {/* Bookings */}
              <Link href={`/dashboard/trips/${trip.id}/bookings`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2 border-white/10 text-gray-300 hover:bg-white/5">
                  <Users className="w-4 h-4" />
                  Bookings
                </Button>
              </Link>

              {/* Delete Trip */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => openDeleteDialog(trip)}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TripItems;
