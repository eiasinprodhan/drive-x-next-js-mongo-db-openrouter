"use client";

import { useState } from "react";
import { Fuel, Gauge, Heart, Settings2, Star, Users } from "lucide-react";
import type { Car } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import CarDetailsModal from "./CarDetailsModal";

export default function CarCard({ car, onReserve }: { car: Car; onReserve?: (car: Car) => void }) {
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <article className="card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-pop">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.image}
            alt={car.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          />
          <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            {car.category}
          </span>
          <button
            onClick={() => setLiked(!liked)}
            aria-label="Save car"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow backdrop-blur transition hover:scale-110"
          >
            <Heart size={16} className={liked ? "fill-red-500 text-red-500" : "text-navy-400"} />
          </button>
          {!car.available && (
            <div className="absolute inset-0 grid place-items-center bg-navy-950/60 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-navy-900">
                Currently unavailable
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-navy-900">{car.name}</h3>
              <p className="text-xs font-medium text-navy-400">
                {car.brand} · {car.year}
              </p>
            </div>
            <span className="chip bg-emerald-50 text-emerald-600">
              <Star size={11} className="fill-emerald-500 text-emerald-500" /> {car.rating}
              <span className="font-semibold text-emerald-400">({car.reviews})</span>
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-semibold text-navy-500">
            <span className="flex items-center gap-1.5"><Users size={13} className="text-brand-500" /> {car.seats} seats</span>
            <span className="flex items-center gap-1.5"><Settings2 size={13} className="text-brand-500" /> {car.transmission}</span>
            <span className="flex items-center gap-1.5"><Fuel size={13} className="text-brand-500" /> {car.fuel}</span>
            <span className="flex items-center gap-1.5"><Gauge size={13} className="text-brand-500" /> {car.mpg > 0 ? `${car.mpg} mpg` : "EV"}</span>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-navy-100 pt-4">
            <div>
              <p className="text-xl font-extrabold text-navy-900">
                {fmtMoney(car.pricePerDay)}
                <span className="text-xs font-semibold text-navy-400"> /day</span>
              </p>
              <p className="text-[11px] font-medium text-navy-400">Free cancellation · Insurance incl.</p>
            </div>
            <button onClick={() => onReserve ? onReserve(car) : setOpen(true)} className="btn-primary px-4 py-2 text-xs" disabled={!car.available}>
              Book Now
            </button>
          </div>
        </div>
      </article>

      {open && <CarDetailsModal car={car} onClose={() => setOpen(false)} />}
    </>
  );
}
