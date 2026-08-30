"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";

const REVIEWS = [
  {
    name: "Vladik Rubatev",
    role: "Business traveler",
    text: "The AI assistant found me a BMW 5 Series under my budget in seconds. Flawless pickup at the airport — car was spotless, paperwork done in 5 minutes.",
  },
  {
    name: "Ayesha Rahman",
    role: "Event planner",
    text: "Booked the Mercedes S-Class for a wedding. Delivery was on time, the chauffeur was professional, and the car was immaculate. Booking confirmation in 10 seconds!",
  },
  {
    name: "David Chen",
    role: "Family road-tripper",
    text: "Rented the Audi Q7 for 10 days across 3 cities. The flat-rate pricing meant zero surprises at return. Roadside assistance answered instantly when we had a flat tyre.",
  },
  {
    name: "Fatima Noor",
    role: "Frequent renter",
    text: "I rent every month for work. The loyalty pricing and free upgrades keep me coming back — and their support team replies within minutes, even at 2am.",
  },
  {
    name: "Omar Faruk",
    role: "Corporate fleet lead",
    text: "We moved 12 company cars to DriveX. The admin dashboard gives us live booking analytics, and the AI lead scoring helps our sales team prioritise.",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const visible = [REVIEWS[idx], REVIEWS[(idx + 1) % REVIEWS.length], REVIEWS[(idx + 2) % REVIEWS.length]];

  return (
    <section id="reviews" className="bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Testimonials</p>
          <h2 className="section-title mt-3">Trusted by thousands of happy customers</h2>
          <p className="section-sub">A high-performing, well-designed car rental system — built for any car company and website.</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {visible.map((r, i) => (
            <figure
              key={r.name + i}
              className={`card relative p-7 transition-all duration-500 ${i === 0 ? "border-brand-200 shadow-pop md:-translate-y-1" : "opacity-90"}`}
            >
              <Quote size={34} className="absolute right-6 top-6 text-brand-100" />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-navy-600">“{r.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-navy-100 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-navy-950 text-xs font-extrabold text-white">
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-navy-900">{r.name}</p>
                  <p className="text-xs font-medium text-navy-400">{r.role}</p>
                </div>
                <span className="chip ml-auto bg-emerald-50 text-emerald-600">✓ Verified</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-7 bg-brand-500" : "w-2 bg-navy-200 hover:bg-navy-300"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIdx((idx - 1 + REVIEWS.length) % REVIEWS.length)} className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 text-navy-600 transition hover:border-brand-400 hover:text-brand-600" aria-label="Previous">
              <ArrowLeft size={17} />
            </button>
            <button onClick={() => setIdx((idx + 1) % REVIEWS.length)} className="grid h-10 w-10 place-items-center rounded-full border border-navy-100 text-navy-600 transition hover:border-brand-400 hover:text-brand-600" aria-label="Next">
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
