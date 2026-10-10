"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEnquiries } from "./useEnquiries";
import { EnquiryTable } from "./EnquiryTable";
import { EnquiryDetailsDialog } from "./EnquiryDetailsDialog";
import { Phone, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactEnquiries() {
  const { enquiries, loading, updateStatus } = useEnquiries();
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const res = await fetch("/api/bookings/pending");
        if (res.ok) {
          const data = await res.json();
          setPendingBookings(data);
        }
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    };
    fetchPendingBookings();
  }, []);

  const handleCall = (mobile: string) => {
    window.location.href = `tel:${mobile}`;
  };

  const handleSMS = (mobile: string) => {
    window.location.href = `sms:${mobile}`;
  };

  const handleEmail = (email: string, name: string) => {
    const subject = `Regarding Your Project Inquiry - ${name}`;
    const body = `Hello ${name},\n\nThank you for your interest in our tech solutions. We'd like to discuss your project requirements in detail.\n\nBest regards,\nTech Solutions Team`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = (mobile: string, name: string) => {
    const message = `Hello ${name}, this is Tech Solutions Team regarding your enquiry about our digital services. We'd be happy to discuss your project requirements.`;
    window.open(
      `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-6 text-white font-primary">
      {/* Header Section */}
      <div className="flex items-center justify-between p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-foreground font-heading">
            Contact Enquiries
          </h2>
          <p className="text-base text-gray-400">
            Manage and respond to client inquiries
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-lg font-semibold text-blue-400">
              {enquiries?.length || 0}
            </div>
            <div className="text-xs text-gray-400">
              Total
            </div>
          </div>
          <div className="text-center px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-lg font-semibold text-yellow-400">
              {(enquiries?.filter((e) => e.status === "pending")?.length || 0) + pendingBookings.length}
            </div>
            <div className="text-xs text-gray-400">
              Pending
            </div>
          </div>
        </div>
      </div>

      {/* Pending Bookings Section */}
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium text-white font-heading">
            Pending Trip Bookings
          </h3>
        </div>
        <div className="p-6">
          {pendingBookings.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No pending bookings.</p>
          ) : (
            <div className="grid gap-4">
              {pendingBookings.map((booking: any) => (
                <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-colors gap-4">
                  <div>
                    <h4 className="font-medium text-white text-lg">{booking.fullName}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400 mt-1">
                      <span className="text-foreground">{booking.tripTitle}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{booking.mobileNo}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                    className="w-full md:w-auto border-foreground/30 text-foreground hover:bg-foreground hover:text-black transition-colors"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Enquiries Section */}
      <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-medium mb-2 text-white font-heading">
            Recent Enquiries
          </h3>

          {/* Action Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500/10">
                <Phone className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-gray-400">Call</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500/10">
                <MessageSquare className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-gray-400">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-500/10">
                <Mail className="h-4 w-4 text-yellow-400" />
              </div>
              <span className="text-gray-400">Email</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <EnquiryTable
            enquiries={enquiries}
            loading={loading}
            onView={(enquiry) => {
              setSelectedEnquiry(enquiry);
              setIsViewOpen(true);
            }}
            onCall={handleCall}
            onWhatsApp={handleWhatsApp}
            onSMS={handleSMS}
            onStatusChange={updateStatus}
          />
        </div>
      </div>
      <EnquiryDetailsDialog
        enquiry={selectedEnquiry}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        onCall={handleCall}
        onWhatsApp={handleWhatsApp}
        onSMS={handleSMS}
      />
    </div>
  );
}
