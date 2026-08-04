import { Metadata } from "next";
import { DashboardClientWrapper } from "./DashboardClientWrapper";

export const metadata: Metadata = {
  title: "Dashboard - CONSOUL",
  description: "dashboard for managing CONSOUL services and content",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
