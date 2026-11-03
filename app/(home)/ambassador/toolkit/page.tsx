"use client";

import { useState } from "react";
import {
  Copy,
  CheckCircle,
  MessageCircle,
  Instagram,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ContentBlock {
  id: string;
  title: string;
  content: string;
}

interface ToolkitSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  blocks: ContentBlock[];
}

// TODO: Fetch marketing content from API: GET /api/ambassador/toolkit
const toolkitSections: ToolkitSection[] = [
  {
    id: "whatsapp",
    title: "WhatsApp Group Announcements",
    description: "Copy & paste these into your college WhatsApp groups",
    icon: MessageCircle,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
    blocks: [
      {
        id: "wa-1",
        title: "Trip Announcement",
        content: `🏔️ *CONSOUL TRIPS — Book Now!* 🏔️

Hey everyone! 👋

CONSOUL is organising the SICKEST college trips this season — Rishikesh, Goa, Manali, Kasol & more! 🎒🔥

✅ Certified drivers & vehicles
✅ Female-only security options
✅ Hostel/camp stays with bonfire nights
✅ Budget-friendly — starts at ₹3,999

Use my promo code for an exclusive discount! DM me for the code or book at con-soul.in 🚀

Seats filling fast — don't miss out! 🙌`,
      },
      {
        id: "wa-2",
        title: "Last Seats Reminder",
        content: `⚡ *LAST FEW SEATS LEFT!* ⚡

Bhai log, the Rishikesh trip is almost FULL! 🏕️

Only 6 seats remaining — if you've been thinking about it, NOW is the time.

DM me for the promo code → extra discount guaranteed 💰

Book: con-soul.in
Dates: Check the website for upcoming batches

Don't regret later! 🤙`,
      },
      {
        id: "wa-3",
        title: "Safety Highlight",
        content: `🛡️ *Why CONSOUL is the SAFEST choice for college trips* 🛡️

Parents worried? Share this 👇

✅ All vehicles government-certified & GPS tracked
✅ Female security escort available on every trip
✅ 24/7 emergency helpline
✅ Verified accommodations only
✅ Professional trip leaders (not random organisers)

This is NOT your random college trip. It's CONSOUL. ✨

Book safely: con-soul.in`,
      },
    ],
  },
  {
    id: "instagram",
    title: "Instagram Story Captions",
    description: "Ready-to-use captions for your IG stories and posts",
    icon: Instagram,
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/10",
    blocks: [
      {
        id: "ig-1",
        title: "Trip Hype Story",
        content: `Mountains are calling and I must go 🏔️✨

The BEST college trips in Central India — CONSOUL is taking us places (literally 😂)

DM me for exclusive promo code 🎟️
@consoul.in

#CONSOUL #CollegeTrips #Rishikesh #Goa #Manali #TravelWithSquad`,
      },
      {
        id: "ig-2",
        title: "FOMO Post",
        content: `POV: Your squad already booked the trip and you're still "thinking about it" 🤡

Don't be THAT friend. Book now & use my code for a discount 💰

Link in bio → @consoul.in

#CONSOUL #TripPlanning #CollegeLife #WeekendGetaway #AdventureAwaits`,
      },
      {
        id: "ig-3",
        title: "Testimonial Style",
        content: `Went on a CONSOUL trip last month and genuinely came back a different person 🌄

Safe ✅ Budget ✅ Unforgettable ✅

If you're from Central India and want the best travel experience with your college crew — this is IT.

DM for promo code 🎒
@consoul.in`,
      },
    ],
  },
  {
    id: "safety",
    title: "Parent Safety Information Sheet",
    description: "Share with parents who want to know their kids are safe",
    icon: Shield,
    iconColor: "text-gold",
    iconBg: "bg-gold/10",
    blocks: [
      {
        id: "safety-1",
        title: "Safety Information Sheet",
        content: `CONSOUL INDIA — Parent Safety Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear Parent/Guardian,

We understand your concerns about your child's safety during group travel. Here's how CONSOUL ensures a secure experience:

🚐 TRANSPORTATION SAFETY
• All vehicles are government-certified with valid permits
• Professional drivers with 5+ years of experience
• Real-time GPS tracking shared with emergency contacts
• Regular vehicle maintenance & safety audits

👮‍♀️ FEMALE SECURITY PROTOCOLS
• Dedicated female security escort on every trip
• Female-only accommodation options available
• 24/7 female emergency helpline
• Strict anti-harassment policy with zero tolerance

🏨 ACCOMMODATION
• Pre-verified stays with safety certifications
• First-aid kits at every location
• Fire safety compliance checked

📞 EMERGENCY SUPPORT
• 24/7 emergency helpline: Available on booking confirmation
• Local emergency contacts at every destination
• Trip insurance coverage included
• Real-time location sharing with guardians

📋 TRIP LEADER QUALIFICATIONS
• Trained in first aid & emergency response
• Background-verified professionals
• Minimum 2 leaders per group of 20 students

For any questions, reach us at: support@con-soul.in
Website: con-soul.in

— Team CONSOUL`,
      },
    ],
  },
];

export default function ToolkitPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard. Ready to paste!",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Marketing Toolkit</h2>
        <p className="text-gray-400 mt-1">
          Ready-to-share content for your campus promotions
        </p>
      </div>

      {/* Sections */}
      {toolkitSections.map((section) => {
        const SectionIcon = section.icon;
        return (
          <div key={section.id} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${section.iconBg} rounded-xl`}>
                <SectionIcon className={`w-5 h-5 ${section.iconColor}`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {section.title}
                </h3>
                <p className="text-xs text-gray-500">{section.description}</p>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-3">
              {section.blocks.map((block) => (
                <Card
                  key={block.id}
                  className="bg-white/5 border border-white/10 rounded-2xl"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="text-sm font-semibold text-white">
                        {block.title}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(block.content, block.id)}
                        className="border-white/20 text-white hover:bg-white/10 flex-shrink-0"
                      >
                        {copiedId === block.id ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 mr-1.5" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-black/30 rounded-xl p-4 border border-white/5">
                      {block.content}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
