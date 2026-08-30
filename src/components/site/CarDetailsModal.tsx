"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Check, Fuel, Gauge, Settings2, Star, Users, X } from "lucide-react";
import type { Car } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";

export default function CarDetailsModal({ car, onClose }: { car: Car; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="card relative my-8 w-full max-w-3xl overflow-hidden animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-navy-700 shadow backdrop-blur hover:bg-white" aria-label="Close">
          <X size={17} />
        </button>
        <div className="relative aspect-[16/8] bg-navy-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={car.image} alt={car.name} className="h-full w-full object-cover" />
          <span className="absolute left-4 top-4 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">{car.category}</span>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h3 className="text-2xl font-extrabold text-navy-900">{car.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-navy-500">
              <span className="chip bg-emerald-50 text-emerald-600"><Star size={11} className="fill-emerald-500 text-emerald-500" /> {car.rating} · {car.reviews} reviews</span>
              <span>{car.brand} · {car.year}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-600">{car.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [Users, `${car.seats} Seats`],
                [Settings2, car.transmission],
                [Fuel, car.fuel],
                [Gauge, car.mpg > 0 ? `${car.mpg} mpg` : "Full electric"],
              ].map(([Icon, label]: any) => (
                <div key={label} className="rounded-xl bg-navy-50 px-3 py-2.5 text-center">
                  <Icon size={15} className="mx-auto text-brand-500" />
                  <p className="mt-1 text-[11px] font-bold text-navy-700">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-navy-400">Top features</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 rounded-lg border border-navy-100 bg-white px-2.5 py-1 text-[11px] font-semibold text-navy-600">
                    <Check size={11} className="text-emerald-500" /> {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col rounded-2xl bg-navy-950 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-400">All-inclusive rate</p>
            <p className="mt-2 text-3xl font-extrabold">{fmtMoney(car.pricePerDay)}<span className="text-sm font-semibold text-navy-300"> /day</span></p>
            <ul className="mt-4 space-y-2 text-xs text-navy-200">
              {["Full insurance & CDW", "200 km/day included", "Free cancellation (24h)", "24/7 roadside assistance", "No hidden fees"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check size={13} className="text-brand-400" /> {t}</li>
              ))}
            </ul>
            <Link href={`/booking?car=${car.id}`} className="btn-primary mt-6 w-full">
              Reserve this car
            </Link>
            <button onClick={onClose} className="btn mt-2 w-full border border-white/15 text-white hover:bg-white/10">
              Keep browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
