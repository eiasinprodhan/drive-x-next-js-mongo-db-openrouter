import type { Metadata } from "next";
import CustomerDashboardClient from "@/components/site/CustomerDashboardClient";

export const metadata: Metadata = {
  title: "My Rentals & Dashboard — DriveX",
  description: "View and manage your active, pending, and past car rental reservations.",
};

export default function DashboardPage() {
  return <CustomerDashboardClient />;
}
