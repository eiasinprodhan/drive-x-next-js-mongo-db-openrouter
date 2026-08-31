"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Bot, ChevronDown, RotateCcw, SlidersHorizontal, Sparkles } from "lucide-react";
import { useFetch } from "@/lib/api";
import type { Car } from "@/lib/types";
import CarCard from "./CarCard";
import CarCardSkeleton from "./CarCardSkeleton";
import AiMatchQuiz from "./AiMatchQuiz";

const CATS = ["All", "Popular", "Large Car", "Small Car", "Exclusive Car"];
const ORDERS = ["Recommended", "Price: low → high", "Price: high → low", "Rating"];

function CarsInner() {
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "All");
  const [q, setQ] = useState(params.get("q") || "");
  const [order, setOrder] = useState(ORDERS[0]);
  const [filters, setFilters] = useState({ transmission: "Any", fuel: "Any", seats: "Any" });
  const [showFilters, setShowFilters] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (category !== "All") p.set("category", category);
    if (q.trim()) p.set("q", q.trim());
    return `/api/cars?${p.toString()}`;
  }, [category, q]);

  const { data: cars, loading } = useFetch<Car[]>(query);

  const list = useMemo(() => {
    let out = [...(cars || [])];
    if (filters.transmission !== "Any") out = out.filter((c) => c.transmission === filters.transmission);
    if (filters.fuel !== "Any") out = out.filter((c) => c.fuel === filters.fuel);
    if (filters.seats !== "Any") out = out.filter((c) => c.seats >= Number(filters.seats));
    if (order === ORDERS[1]) out.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (order === ORDERS[2]) out.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else if (order === ORDERS[3]) out.sort((a, b) => b.rating - a.rating);
    return out;
  }, [cars, filters, order]);

  return (
    <div className="container-x pb-24">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Our fleet</p>
        <h1 className="section-title mt-3">Find your perfect drive</h1>
        <p className="section-sub">Every vehicle is AI-vetted, fully insured and delivered clean — or let Rex match you in 20 seconds.</p>
      </div>

      {/* Toolbar */}
      <div className="card mt-8 flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, brand, feature…" className="input lg:max-w-xs" />

        <div className="flex flex-1 flex-wrap items-center gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${category === c ? "bg-navy-950 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-outline !px-3.5 text-xs ${showFilters ? "!border-brand-400 !text-brand-600" : ""}`}>
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="relative">
            <select value={order} onChange={(e) => setOrder(e.target.value)} className="input appearance-none !pr-8 text-xs font-semibold">
              {ORDERS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-navy-400" />
          </div>
        </div>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="card mt-3 grid animate-fade-up gap-3 p-4 sm:grid-cols-3">
          {(
            [
              ["Transmission", filters.transmission, (v: string) => setFilters({ ...filters, transmission: v }), ["Any", "Automatic", "Manual"]],
              ["Fuel", filters.fuel, (v: string) => setFilters({ ...filters, fuel: v }), ["Any", "Petrol", "Diesel", "Hybrid", "Electric"]],
              ["Seats", filters.seats, (v: string) => setFilters({ ...filters, seats: v }), ["Any", "2", "4", "5", "7"]],
            ] as const
          ).map(([label, val, set, opts]) => (
            <div key={label as string}>
              <p className="label">{label as string}</p>
              <div className="flex flex-wrap gap-1.5">
                {(opts as readonly string[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => (set as any)(o)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${val === o ? "bg-brand-500 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}
                  >
                    {o === "Any" ? "Any" : o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI match banner */}
      <button
        onClick={() => setQuizOpen(true)}
        className="group relative mt-8 flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-navy-950 p-6 text-left text-white transition hover:shadow-pop"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-brand-500/25 blur-[70px]" />
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500 text-white shadow-lg shadow-brand-500/40 transition group-hover:scale-110">
            <Sparkles size={24} />
          </span>
          <div>
            <p className="text-base font-extrabold sm:text-lg">
              AI Fleet Matchmaker — 20-Second Recommendation Quiz
            </p>
            <p className="mt-0.5 text-xs text-navy-300 sm:text-sm">
              Input your trip purpose, budget, and passenger count — Rex analyzes the entire fleet to match you in seconds.
            </p>
          </div>
        </div>
        <span className="chip hidden bg-white/10 text-brand-300 sm:inline-flex"><Sparkles size={11} /> Match Fleet</span>
      </button>

      {/* Grid */}
      {loading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <CarCardSkeleton />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card mt-8 grid place-items-center p-16 text-center">
          <p className="text-lg font-extrabold text-navy-900">No cars match those filters</p>
          <p className="mt-1 text-sm text-navy-500">Try clearing the search or filters — or ask Rex what fits your budget.</p>
          <button onClick={() => { setQ(""); setFilters({ transmission: "Any", fuel: "Any", seats: "Any" }); setCategory("All"); }} className="btn-outline mt-4">
            <RotateCcw size={14} /> Reset everything
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      <p className="mt-8 text-center text-xs font-semibold text-navy-400">
        Showing {list.length} of {cars?.length || 0} vehicles · Prices include insurance &amp; 200 km/day
      </p>

      {quizOpen && <AiMatchQuiz onClose={() => setQuizOpen(false)} />}
    </div>
  );
}

export default function CarsClient() {
  return (
    <Suspense fallback={<div className="container-x py-24 text-center text-sm font-semibold text-navy-400">Loading fleet…</div>}>
      <CarsInner />
    </Suspense>
  );
}
