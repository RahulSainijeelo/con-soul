import { useEffect, useState } from "react";

interface DashboardStats {
  totalTrips: number;
  activeTrips: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  totalReviews: number;
  pendingReviews: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    activeTrips: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    totalReviews: 0,
    pendingReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const CACHE_DURATION = 360_000; // 6 minutes
    const cached = sessionStorage.getItem("dashboardStats");
    const cachedAt = sessionStorage.getItem("dashboardStatsAt");
    const now = Date.now();

    if (cached && cachedAt && now - Number(cachedAt) < CACHE_DURATION) {
      setStats(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel instead of sequentially
        const [enquiriesRes, tripsRes, reviewsRes] = await Promise.all([
          fetch("/api/contact"),
          fetch("/api/trips?limit=100"),
          fetch("/api/reviews"),
        ]);

        const [enquiries, tripsData, reviews] = await Promise.all([
          enquiriesRes.json(),
          tripsRes.json(),
          reviewsRes.json(),
        ]);

        // Process enquiries
        const enquiriesList = Array.isArray(enquiries) ? enquiries : [];
        const pendingEnquiries = enquiriesList.filter(
          (e: { status?: string }) => e.status === "new"
        ).length;

        // Process trips
        const tripsList = tripsData?.data || (Array.isArray(tripsData) ? tripsData : []);
        const totalTrips = tripsList.length;
        const activeTrips = tripsList.filter(
          (t: { status?: string }) => t.status === "published"
        ).length;

        // Process reviews
        const reviewsList = Array.isArray(reviews) ? reviews : [];
        const pendingReviews = reviewsList.filter(
          (r: { status?: string }) => r.status === "pending"
        ).length;
        const totalReviews = reviewsList.length;

        const newStats: DashboardStats = {
          totalTrips,
          activeTrips,
          totalEnquiries: enquiriesList.length,
          pendingEnquiries,
          totalReviews,
          pendingReviews,
        };
        setStats(newStats);
        sessionStorage.setItem("dashboardStats", JSON.stringify(newStats));
        sessionStorage.setItem("dashboardStatsAt", now.toString());
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
}