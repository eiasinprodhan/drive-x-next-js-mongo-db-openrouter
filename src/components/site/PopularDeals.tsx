"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { useFetch } from "@/lib/api";
import type { Car, CarCategory } from "@/lib/types";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";

const TABS: Array<"Popular" | CarCategory> = ["Popular", "Large Car", "Small Car", "Exclusive Car"];

export default function PopularDeals() {
  const [tab, setTab] = useState<string>("Popular");
  const [limit, setLimit] = useState(8);
  const { data: cars, loading } = useFetch<Car[]>(`/api/cars?${tab !== "Popular" ? `category=${encodeURIComponent(tab)}` : ""}`);

  const shown = (cars || []).slice(0, limit);

  return (
    <section id="deals" className="bg-[#FAF7F2] py-20 lg:py-28">
      <div className="container-x">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Our deals</p>
          <h2 className="section-title mt-3">Most popular car rental deals</h2>
          <p className="section-sub">A high-performing, well-designed car rental system — built for any car company and website.</p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-navy-100 bg-white p-1.5 shadow-card max-xl:mx-auto max-xl:max-w-xl">
          {TABS.map((t) => {
            const isActive = tab === t;
            return (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setLimit(8);
                }}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-200 sm:px-6 sm:text-sm ${
                  isActive ? "bg-navy-950 text-white shadow-md" : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
                }`}
              >
                {isActive && loading && <Loader2 size={13} className="animate-spin text-brand-400" />}
                <span>{t}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
                <CarCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid animate-fade-in gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        {/* Show more / all cars */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {shown.length < (cars || []).length && (
            <button onClick={() => setLimit((l) => l + 8)} className="btn-outline" disabled={loading}>
              Show more cars ({shown.length}/{cars?.length || 0})
            </button>
          )}
          <Link href="/cars" className="btn-primary">
            <Sparkles size={15} /> View all cars
          </Link>
        </div>
      </div>
    </section>
  );
}
