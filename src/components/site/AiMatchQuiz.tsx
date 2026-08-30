"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Compass,
  DollarSign,
  Loader2,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { fmtMoney } from "@/lib/utils";
import type { Car } from "@/lib/types";

const PURPOSES = [
  { id: "business", label: "Executive / Business", icon: Briefcase },
  { id: "family", label: "Family Vacation", icon: Users },
  { id: "wedding", label: "Special Event", icon: Sparkles },
  { id: "city", label: "City & Commuting", icon: Building2 },
];

const BUDGETS = [
  { id: 80, label: "Under $80/day" },
  { id: 150, label: "$80 – $150/day" },
  { id: 250, label: "$150 – $250/day" },
  { id: 500, label: "Premium / Unlimited" },
];

export default function AiMatchQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState("family");
  const [budget, setBudget] = useState(250);
  const [passengers, setPassengers] = useState(4);
  const [transmission, setTransmission] = useState("Any");
  const [res, setRes] = useState<{ car: Car; reason: string }[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function run() {
    setBusy(true);
    setErr("");
    try {
      const data = await api<{ matches: { car: Car; reason: string }[]; model: string }>("/api/ai/recommend", {
        method: "POST",
        body: JSON.stringify({ purpose, budget, passengers, transmission: transmission === "Any" ? "" : transmission, days: 3 }),
      });
      setRes(data.matches);
    } catch (e: any) {
      setErr(e.message || "Unable to match vehicles");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="card relative w-full max-w-2xl overflow-hidden animate-pop-in border border-navy-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-600 hover:bg-navy-100" aria-label="Close">
          <X size={16} />
        </button>

        <div className="bg-gradient-to-br from-navy-950 to-navy-900 p-6 text-white sm:p-8 border-b border-navy-800">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-brand-300">
            <Bot size={13} /> Fleet Matchmaker
          </p>
          <h3 className="mt-3 text-2xl font-extrabold">Find the Ideal Vehicle for Your Trip</h3>
          {/* progress */}
          <div className="mt-4 flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? "bg-brand-500" : "bg-white/15"}`} />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-[#FAF8F5]">
          {step === 0 && (
            <>
              <p className="text-sm font-extrabold text-navy-900">What is the purpose of your journey?</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PURPOSES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPurpose(id)}
                    className={`rounded-2xl border-2 p-4 text-center transition flex flex-col items-center justify-center gap-2.5 ${
                      purpose === id ? "border-brand-500 bg-brand-50/70 text-brand-700 shadow-sm" : "border-navy-100 bg-white text-navy-700 hover:border-navy-200"
                    }`}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${purpose === id ? "bg-brand-500 text-white" : "bg-navy-50 text-navy-600"}`}>
                      <Icon size={18} />
                    </span>
                    <span className="text-xs font-bold leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="text-sm font-extrabold text-navy-900">Target daily budget?</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BUDGETS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`rounded-2xl border-2 px-3 py-4 text-xs font-bold transition ${
                      budget === b.id ? "border-brand-500 bg-brand-50/70 text-brand-700 shadow-sm" : "border-navy-100 bg-white text-navy-700 hover:border-navy-200"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm font-extrabold text-navy-900">Required passenger capacity?</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {[2, 4, 5, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPassengers(n)}
                    className={`rounded-2xl border-2 px-6 py-3.5 text-xs font-extrabold transition ${
                      passengers === n ? "border-brand-500 bg-brand-50/70 text-brand-700 shadow-sm" : "border-navy-100 bg-white text-navy-700 hover:border-navy-200"
                    }`}
                  >
                    {n} Seats
                  </button>
                ))}
              </div>
              <p className="mt-6 text-sm font-extrabold text-navy-900">Transmission preference?</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {["Any", "Automatic", "Manual"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTransmission(t)}
                    className={`rounded-2xl border-2 px-5 py-3 text-xs font-bold transition ${
                      transmission === t ? "border-brand-500 bg-brand-50/70 text-brand-700 shadow-sm" : "border-navy-100 bg-white text-navy-700 hover:border-navy-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="grid place-items-center py-4">
              {err && <p className="text-sm font-bold text-red-500">{err}</p>}
              {busy || !res ? (
                <div className="text-center py-6">
                  {busy ? (
                    <>
                      <Loader2 size={32} className="mx-auto animate-spin text-brand-500" />
                      <p className="mt-3 text-sm font-extrabold text-navy-900">Evaluating fleet availability…</p>
                      <p className="mt-1 text-xs text-navy-500">Matching criteria against active fleet</p>
                    </>
                  ) : (
                    <>
                      <Bot size={36} className="mx-auto text-brand-500" />
                      <p className="mt-3 text-sm font-extrabold text-navy-900">Ready to Match Fleet</p>
                      <p className="mt-1 text-xs text-navy-500">Click below to generate tailored options.</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-500">
                    <Sparkles size={13} /> Tailored Fleet Matches
                  </p>
                  <div className="mt-4 w-full space-y-3">
                    {res.map(({ car, reason }, i) => (
                      <div key={car.id} className="flex flex-col gap-3 rounded-2xl border border-navy-100 bg-white p-4 transition hover:border-brand-200 hover:shadow-card sm:flex-row sm:items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={car.image} alt={car.name} className="h-20 w-full rounded-xl object-cover sm:w-32 border border-navy-100" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="chip bg-brand-50 text-brand-600">Option #{i + 1}</span>
                            <span className="chip bg-emerald-50 text-emerald-600"><Star size={10} className="fill-emerald-500 text-emerald-500" /> {car.rating}</span>
                          </div>
                          <p className="mt-1.5 font-extrabold text-navy-900">{car.name}</p>
                          <p className="text-xs leading-relaxed text-navy-500">{reason}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-base font-extrabold text-navy-900">{fmtMoney(car.pricePerDay)}<span className="text-xs font-semibold text-navy-400">/day</span></p>
                          <Link href={`/booking?car=${car.id}`} className="btn-primary mt-1.5 !px-4 !py-2 text-xs">Reserve</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Nav */}
          {step < 3 && (
            <div className="mt-8 flex items-center justify-between border-t border-navy-100 pt-4">
              <button onClick={() => setStep(Math.max(0, step - 1))} className="btn-ghost text-xs" disabled={step === 0}>
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={() => {
                  if (step === 2) run();
                  setStep(step + 1);
                }}
                className="btn-primary text-xs"
              >
                {step === 2 ? "Generate Match" : "Continue"} <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
