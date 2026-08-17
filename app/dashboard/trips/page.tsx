"use client";

import { ManageTrips } from "@/components/dashboard/trips/ManageTrips";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trips</h1>
          <p className="text-sm text-gray-400 mt-1">Create, manage and track all your trips</p>
        </div>
      </div>
      <ManageTrips />
    </div>
  );
}
