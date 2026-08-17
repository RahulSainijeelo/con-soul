"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamic imports — only load the active tab's JS bundle
const ManageTrips = dynamic(
  () => import("@/components/dashboard/trips/ManageTrips").then(mod => mod.ManageTrips),
  { loading: () => <div className="flex items-center justify-center py-20 text-gray-400">Loading trips…</div> }
);
const ContactEnquiries = dynamic(
  () => import("@/components/dashboard/contact/ContactEnquiries").then(mod => mod.ContactEnquiries),
  { loading: () => <div className="flex items-center justify-center py-20 text-gray-400">Loading enquiries…</div> }
);
const ManageReviews = dynamic(
  () => import("@/components/dashboard/reviews/ManageReviews").then(mod => mod.ManageReviews),
  { loading: () => <div className="flex items-center justify-center py-20 text-gray-400">Loading reviews…</div> }
);

export default function Dashboard() {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-black text-white">
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2 text-gold">
                Dashboard
              </h1>
              <p className="text-base text-gray-400">
                Manage your trips and content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-gold hover:bg-yellow-600 text-black font-semibold"
              >
                <Link href="/">View Website</Link>
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="rounded-xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm">
            <Tabs defaultValue="trips" className="space-y-6">
              <div className="w-full overflow-x-auto no-scrollbar md:overflow-visible flex justify-center">
                <TabsList className="flex min-w-max md:min-w-0 p-1 rounded-xl bg-white/5 border border-white/10">
                  <TabsTrigger
                    value="enquiries"
                    className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gold data-[state=active]:text-black text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Enquiries
                  </TabsTrigger>

                  <TabsTrigger
                    value="trips"
                    className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gold data-[state=active]:text-black text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Trips
                  </TabsTrigger>

                  <TabsTrigger
                    value="reviews"
                    className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 data-[state=active]:bg-gold data-[state=active]:text-black text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                    Reviews
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="enquiries" className="space-y-4">
                <ContactEnquiries />
              </TabsContent>
              <TabsContent value="trips" className="space-y-4">
                <ManageTrips />
              </TabsContent>
              <TabsContent value="reviews" className="space-y-4">
                <ManageReviews />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
