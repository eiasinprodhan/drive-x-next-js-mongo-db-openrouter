import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveX — Rent the drive of your life",
  description:
    "DriveX is an AI-powered car rental platform: book premium cars in 60 seconds, get AI recommendations, and rent with full confidence.",
  keywords: ["car rental", "rent a car", "drivex", "AI car rental", "Bangladesh car rental"],
  openGraph: {
    title: "DriveX — Rent the drive of your life",
    description: "Premium car rental with AI-powered recommendations. Book in 60 seconds.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden max-w-full">
      <body className="overflow-x-hidden max-w-full">
        {/* System UI font stack — no external requests, renders perfectly in sandboxed preview */}
        <style>{`
          @font-face{font-family:'Plus Jakarta Sans';src:local('Segoe UI'),local('Helvetica Neue'),local(Arial);font-display:swap;}
        `}</style>
        {children}
      </body>
    </html>
  );
}
