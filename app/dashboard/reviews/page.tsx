"use client";

import { ManageReviews } from "@/components/dashboard/reviews/ManageReviews";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <p className="text-sm text-gray-400 mt-1">Moderate and manage customer reviews</p>
      </div>
      <ManageReviews />
    </div>
  );
}
