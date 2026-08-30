import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import AiAssistant from "@/components/site/AiAssistant";
import RegisterClient from "@/components/site/RegisterClient";
import { CarFront, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "Register — DriveX Car Rental",
  description: "Create your DriveX account to unlock 60-second booking, exclusive fleet rates, and AI car matchmaking.",
};

const PERKS = [
  {
    icon: Sparkles,
    title: "AI Vehicle Matcher",
    desc: "Personalized car recommendations matched to your trip purpose, passenger count and budget.",
  },
  {
    icon: CarFront,
    title: "Keyless Airport Pickup",
    desc: "Direct access to your reserved vehicle across 8 branches and 24/7 airport counters.",
  },
  {
    icon: ShieldCheck,
    title: "Comprehensive Coverage",
    desc: "Zero-deductible CDW insurance & 24/7 roadside assistance included in every drive.",
  },
];

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF8F5] pt-24 lg:pt-28">
        {/* Header */}
        <section className="bg-gradient-to-br from-[#FAF8F5] via-[#F4F1EC] to-[#ECE7DF] py-12 text-center">
          <div className="container-x">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Member Access</p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-950 sm:text-4xl">Join DriveX Fleet Network</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-navy-600">
              Sign up in 30 seconds to manage bookings, track live reservations, and receive priority fleet discounts.
            </p>
          </div>
        </section>

        {/* Content */}
        <div className="container-x grid gap-8 py-12 lg:grid-cols-[1.1fr_1.3fr] lg:gap-12 lg:py-16">
          {/* Left: Perks */}
          <div className="space-y-4">
            <div className="card bg-navy-950 p-6 text-white sm:p-8">
              <span className="chip bg-brand-500 text-white">DriveX Privilege</span>
              <h2 className="mt-4 text-2xl font-extrabold">Why create an account?</h2>
              <p className="mt-2 text-sm text-navy-300">
                Experience seamless car rentals tailored for modern travelers and business professionals.
              </p>
              <div className="mt-6 space-y-4 border-t border-navy-800 pt-6">
                {PERKS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-500/20 text-brand-400">
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{title}</p>
                      <p className="mt-0.5 text-xs text-navy-400">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <RegisterClient />
        </div>
      </main>
      <Footer />
      <AiAssistant />
    </>
  );
}
