import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

export type ExtendedReview = {
  id: string;
  email: string;
  enquiryId: string;
  userName: string;
  rating: number;
  comment: string;
  time: string;
  images: string[];
  vibeTags?: string[];
  squadChemistry?: number;
  consoulHost?: number;
  tripVibe?: number;
  certifiedHighlight?: string;
  personalityBadge?: string;
  fomoScore?: string;
  honestTake?: string;
  likes?: number;
  status: "approved" | "pending" | "rejected";
};

export function useManageReviews() {
  const [reviews, setReviews] = useState<ExtendedReview[]>([]);
  const [loading, setLoading] = useState(true);

  // Add force param to bypass cache
  const fetchReviews = async (force = false) => {
    setLoading(true);
    const CACHE_DURATION = 120 * 1000;
    const cached = sessionStorage.getItem("allReviews");
    const cachedAt = sessionStorage.getItem("allReviewsAt");
    const now = Date.now();
    if (!force && cached && cachedAt && now - Number(cachedAt) < CACHE_DURATION) {
      setReviews(JSON.parse(cached));
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/reviews", { next: { revalidate: 120 } });
      const data = await res.json();
      setReviews(data);
      sessionStorage.setItem("allReviews", JSON.stringify(data));
      sessionStorage.setItem("allReviewsAt", now.toString());
    } catch {
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast({
        title: "Review approved",
        description: "The review is now visible on the website.",
      });
      await fetchReviews(true); // Refetch and recache, bypassing cache
    } catch {
      toast({
        title: "Update failed",
        description: "Could not update review status in the database.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast({
        title: "Review rejected",
        description: "The review has been rejected and won't be displayed.",
      });
      await fetchReviews(true); // Refetch and recache, bypassing cache
    } catch {
      toast({
        title: "Update failed",
        description: "Could not update review status in the database.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete review");
      toast({
        title: "Review deleted",
        description: "The review has been permanently deleted.",
      });
      await fetchReviews(true); // Refetch and recache, bypassing cache
    } catch {
      toast({
        title: "Delete failed",
        description: "Could not delete the review from the database.",
        variant: "destructive",
      });
    }
  };

  return {
    reviews,
    loading,
    handleApprove,
    handleReject,
    handleDelete,
    setReviews,
  };
}