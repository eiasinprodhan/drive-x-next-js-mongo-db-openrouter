import type { Metadata } from "next";
import LoginClient from "@/components/site/LoginClient";

export const metadata: Metadata = {
  title: "Sign In — DriveX Car Rental",
  description: "Sign in to manage your vehicle bookings and profile.",
};

export default function LoginPage() {
  return <LoginClient />;
}
