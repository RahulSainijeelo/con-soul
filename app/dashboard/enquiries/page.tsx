"use client";

import { ContactEnquiries } from "@/components/dashboard/contact/ContactEnquiries";

export default function EnquiriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Enquiries</h1>
        <p className="text-sm text-gray-400 mt-1">Manage contact form submissions and trip enquiries</p>
      </div>
      <ContactEnquiries />
    </div>
  );
}
