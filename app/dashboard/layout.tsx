import { Metadata } from "next";
import { DashboardClientWrapper } from "./DashboardClientWrapper";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard - CONSOUL INDIA",
  description: "dashboard for managing CONSOUL INDIA services and content",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
