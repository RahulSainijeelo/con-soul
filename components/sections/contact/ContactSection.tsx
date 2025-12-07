"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { QuickResponseCard } from "./QuickResponseCard";
import { ContactConfirmationDialog } from "./ContactConfirmationDialog";
import Link from "next/link";
interface Profile {
  phoneNumbers?: string[];
  email?: string;
  workingHours?: string;
  name?: string;
  bio?: string;
}

interface ContactSectionProps {
  profile: Profile | null;
  loading: boolean;
}

export function ContactSection({ profile, loading }: ContactSectionProps) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  return (
    <section
      id="contact"
      className="py-20"
      style={{
        fontFamily: "var(--font-primary)",
        backgroundColor: "var(--color-background)", // Main section background
        color: "var(--color-text-primary)",
      }}
    >
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <Link href="/contact">
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Contact Us
            </h2>
          </Link>
          <p
            className="text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Get in touch for a free quote or to discuss your project
            requirements.
          </p>
        </div>

        {/* Grid: form on left, info + quick on right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form Card */}
          <Card
            style={{
              backgroundColor: "var(--color-surface)", // Card surface background
              boxShadow: "var(--shadow-md)", // Optional elevated shadow
            }}
          >
            <CardHeader>
              <CardTitle
                style={{
                  color: "var(--color-text-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Send an Enquiry
              </CardTitle>
              <CardDescription style={{ color: "var(--color-text-secondary)" }}>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm
                onSuccess={(id) => {
                  setRequestId(id);
                  setConfirmationOpen(true);
                }}
              />
            </CardContent>
          </Card>

          {/* Contact Info + Quick Response */}
          <div className="space-y-6">
            <div
              style={{
                backgroundColor: "var(--color-surface)",
                boxShadow: "var(--shadow-md)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              <ContactInfo profile={profile} profileLoading={loading} />
            </div>

            <div
              style={{
                backgroundColor: "var(--color-surface)",
                boxShadow: "var(--shadow-md)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
              }}
            >
              {/* Pass phone number dynamically */}
              <QuickResponseCard
                phoneNumber={profile?.phoneNumbers?.[0] || undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ContactConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        requestId={requestId}
      />
    </section>
  );
}
