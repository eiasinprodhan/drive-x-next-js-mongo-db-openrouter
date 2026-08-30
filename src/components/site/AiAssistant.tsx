"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  Car as CarIcon,
  Check,
  CheckCircle2,
  Compass,
  CreditCard,
  DollarSign,
  ExternalLink,
  Fuel,
  Headphones,
  Loader2,
  MapPin,
  MessageCircle,
  Printer,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { api } from "@/lib/api";
import { fmtMoney } from "@/lib/utils";
import type { Car } from "@/lib/types";
import { LOCATIONS } from "@/lib/seed-data";

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  car?: Car;
  cars?: Car[];
  booking?: any;
  score?: number;
  intent?: string;
}

const QUICK = [
  { icon: CarIcon, label: "Luxury SUVs", prompt: "Recommend the best luxury SUV in our fleet" },
  { icon: Tag, label: "Under $100/day", prompt: "What budget vehicles do you have under $100/day?" },
  { icon: MapPin, label: "Branch Locations", prompt: "What are your branch locations in Dhaka?" },
  { icon: Zap, label: "Book Range Rover", prompt: "I want to reserve the Range Rover Sport for 3 days" },
];

function tomorrow(days = 1) {
  return new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    pickUp: LOCATIONS[0],
    dropOff: LOCATIONS[0],
    pickDate: tomorrow(1),
    dropDate: tomorrow(4),
  });
  const [bookingBusy, setBookingBusy] = useState(false);
  const [unseen, setUnseen] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const session = useRef(`s-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    if (!open && !msgs.length) return;
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, busy]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("drivex_user");
      if (saved) {
        const u = JSON.parse(saved);
        setBookingForm((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
        }));
      }
    } catch {}
  }, []);

  function push(m: ChatMsg) {
    setMsgs((prev) => [...prev, m]);
  }

  async function ask(text: string) {
    if (!text.trim() || busy) return;
    setBookingCar(null);
    push({ id: `u-${Date.now()}`, role: "user", text });
    setInput("");
    setBusy(true);
    try {
      const res = await api<any>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ session: session.current, message: text }),
      });
      push({
        id: `a-${Date.now()}`,
        role: "assistant",
        text: res.text,
        car: res.car,
        cars: res.cars && res.cars.length > 0 ? res.cars : res.car ? [res.car] : [],
        booking: res.booking,
        score: res.score,
        intent: res.intent,
      });
    } catch (e: any) {
      push({ id: `a-${Date.now()}`, role: "assistant", text: "I encountered a network issue. Please try your request again." });
    } finally {
      setBusy(false);
    }
  }

  async function confirmAiBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!bookingCar || !bookingForm.name || !bookingForm.email) return;

    setBookingBusy(true);
    try {
      const d1 = new Date(bookingForm.pickDate).getTime();
      const d2 = new Date(bookingForm.dropDate).getTime();
      const days = Math.max(1, Math.round((d2 - d1) / 864e5));
      const total = Math.round(bookingCar.pricePerDay * days * 100) / 100;

      const res = await api<any>("/api/booking", {
        method: "POST",
        body: JSON.stringify({
          carId: bookingCar.id,
          customer: bookingForm.name,
          email: bookingForm.email,
          phone: bookingForm.phone,
          pickUp: bookingForm.pickUp,
          dropOff: bookingForm.dropOff,
          pickDate: bookingForm.pickDate,
          dropDate: bookingForm.dropDate,
          paymentMethod: "Card",
        }),
      });

      const bookedCarRef = bookingCar;
      setBookingCar(null);

      try {
        const prev = JSON.parse(localStorage.getItem("drivex_my_bookings") || "[]");
        if (res?.ref && !prev.includes(res.ref)) {
          localStorage.setItem("drivex_my_bookings", JSON.stringify([...prev, res.ref]));
        }
      } catch {}

      push({
        id: `a-${Date.now()}`,
        role: "assistant",
        text: `Reservation Confirmed: Your booking for the ${bookedCarRef.name} has been processed successfully.`,
        booking: {
          id: res.id,
          ref: res.ref,
          carName: bookedCarRef.name,
          carImage: bookedCarRef.image,
          pickDate: bookingForm.pickDate,
          dropDate: bookingForm.dropDate,
          days,
          total,
          pickUp: bookingForm.pickUp,
          dropOff: bookingForm.dropOff,
        },
      });
    } catch (err: any) {
      push({
        id: `a-${Date.now()}`,
        role: "assistant",
        text: `Unable to complete reservation: ${err.message}`,
      });
    } finally {
      setBookingBusy(false);
    }
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => {
          setOpen(!open);
          setUnseen(0);
          if (!msgs.length) {
            push({
              id: "hello",
              role: "assistant",
              text: "Hello. I am Rex, your DriveX AI Fleet Advisor.\n\nI can recommend vehicles, provide rate breakdowns, and book your reservation directly right here.\n\nHow may I assist you today?",
            });
          }
        }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[80] flex h-12 w-12 sm:h-auto sm:w-auto items-center justify-center sm:justify-start gap-2.5 rounded-full bg-navy-950 p-0 sm:px-4 sm:py-3.5 text-xs font-extrabold text-white shadow-pop transition hover:scale-105 hover:bg-navy-900 border border-navy-800"
        aria-label="Open AI Assistant"
      >
        {open ? <X size={18} /> : <Headphones size={18} className="text-brand-400" />}
        {!open && <span className="hidden sm:inline">AI Booking Assistant</span>}
        {unseen > 0 && !open && (
          <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-[10px] font-extrabold">
            {unseen}
          </span>
        )}
      </button>

      {/* Main Chat Interface */}
      {open && (
        <div className="fixed bottom-[4.5rem] right-3 sm:bottom-22 sm:right-6 z-[85] flex h-[500px] max-h-[calc(100dvh-5.5rem)] w-[calc(100vw-1.5rem)] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-2xl animate-pop-in">
          {/* Header */}
          <div className="flex items-center gap-3 bg-navy-950 px-4 py-3 text-white border-b border-navy-900">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-500 shadow-md shadow-brand-500/25 shrink-0">
              <Headphones size={17} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-navy-950 bg-emerald-400" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold truncate">Rex · AI Fleet Advisor</p>
              <p className="text-[10px] text-navy-400 font-medium truncate">Instant Reservations &amp; Vehicle Matching</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-brand-300 shrink-0">
              <Sparkles size={10} /> 24/7 Live
            </span>
          </div>

          {/* Messages Stream */}
          <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto bg-[#FAF8F5] p-3">
            {msgs.map((m) => {
              const displayCars = m.cars && m.cars.length > 0 ? m.cars : m.car ? [m.car] : [];

              return (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "rounded-br-md bg-navy-950 text-white"
                        : "rounded-bl-md border border-navy-100 bg-white text-navy-800"
                    }`}
                  >
                    {m.text}

                    {/* Recommended Vehicle Cards */}
                    {displayCars.length > 0 && !m.booking && (
                      <div className="mt-2.5 space-y-2">
                        {displayCars.map((c) => (
                          <div key={c.id} className="overflow-hidden rounded-xl border border-navy-100 bg-white p-2.5 shadow-sm transition hover:border-brand-300">
                            <div className="flex gap-2.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={c.image} alt={c.name} className="h-12 w-18 rounded-lg object-cover border border-navy-100 shadow-xs shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs font-extrabold text-navy-900 truncate">{c.name}</p>
                                  <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1 py-0.2 text-[9px] font-bold text-emerald-700">
                                    <Star size={9} className="fill-emerald-500 text-emerald-500" /> {c.rating}
                                  </span>
                                </div>
                                <p className="text-[10px] text-navy-500 font-medium">
                                  {c.seats} seats · {c.transmission}
                                </p>
                                <p className="text-xs font-extrabold text-brand-600">
                                  {fmtMoney(c.pricePerDay)}<span className="text-[10px] font-medium text-navy-400">/day</span>
                                </p>
                              </div>
                            </div>

                            <div className="mt-2 flex gap-1.5 pt-1.5 border-t border-navy-50">
                              <button
                                type="button"
                                onClick={() => setBookingCar(c)}
                                className="btn-primary flex-1 !py-1.5 text-[11px] flex items-center justify-center gap-1 shadow-xs"
                              >
                                <Zap size={11} /> Instant Reserve
                              </button>
                              <Link
                                href={`/booking?car=${c.id}`}
                                className="btn-outline !py-1.5 !px-2 text-[11px] flex items-center justify-center gap-1"
                              >
                                Details <ExternalLink size={10} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Official Confirmed Booking Voucher Card */}
                    {m.booking && (
                      <div className="mt-2.5 overflow-hidden rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-3 shadow-sm text-navy-900">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white">
                              <Check size={12} />
                            </span>
                            <span className="text-[11px] font-extrabold text-emerald-900 uppercase tracking-wide">Reservation Confirmed</span>
                          </div>
                          <span className="rounded bg-emerald-100/80 px-1.5 py-0.5 font-mono text-[10px] font-extrabold text-emerald-800">
                            #{m.booking.ref}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="mt-2 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="text-navy-500 font-medium">Vehicle</span>
                            <span className="font-extrabold text-navy-900">{m.booking.carName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-navy-500 font-medium">Dates ({m.booking.days}d)</span>
                            <span className="font-bold text-navy-800">{m.booking.pickDate} → {m.booking.dropDate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-navy-500 font-medium">Branch</span>
                            <span className="font-bold text-navy-800">{m.booking.pickUp || "Dhaka, Bangladesh"}</span>
                          </div>
                          <div className="flex items-center justify-between border-t border-emerald-100 pt-1.5">
                            <span className="text-navy-600 font-bold">Total</span>
                            <span className="text-xs font-extrabold text-brand-600">{fmtMoney(m.booking.total)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-2.5 flex gap-1.5">
                          <Link
                            href="/dashboard"
                            className="flex-1 rounded-lg bg-navy-950 py-2 text-center text-[11px] font-extrabold text-white shadow-xs transition hover:bg-navy-900"
                          >
                            Dashboard →
                          </Link>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-lg border border-navy-200 bg-white px-2.5 py-2 text-[11px] font-bold text-navy-700 transition hover:bg-navy-50"
                            title="Print Voucher"
                          >
                            <Printer size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-xl rounded-bl-md border border-navy-100 bg-white px-3 py-2 shadow-xs">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-brand-500" />
                </div>
              </div>
            )}
          </div>

          {/* Inline Fast Booking Sheet */}
          {bookingCar ? (
            <form onSubmit={confirmAiBooking} className="space-y-2.5 border-t border-navy-100 bg-white p-3 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1 text-[11px] font-extrabold text-navy-900 truncate">
                  <Zap size={11} className="text-brand-500 shrink-0" /> Quick Book: {bookingCar.name} (${bookingCar.pricePerDay}/d)
                </p>
                <button
                  type="button"
                  onClick={() => setBookingCar(null)}
                  className="rounded-lg p-0.5 text-navy-400 hover:bg-navy-100"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-navy-500">Pick-up Date</label>
                  <input
                    type="date"
                    required
                    min={tomorrow(0)}
                    value={bookingForm.pickDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, pickDate: e.target.value })}
                    className="input !py-1 !px-2 !text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-navy-500">Drop-off Date</label>
                  <input
                    type="date"
                    required
                    min={bookingForm.pickDate}
                    value={bookingForm.dropDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, dropDate: e.target.value })}
                    className="input !py-1 !px-2 !text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-navy-500">Full Name</label>
                  <input
                    required
                    placeholder="Alex Johnson"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="input !py-1 !px-2 !text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-navy-500">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="alex@mail.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="input !py-1 !px-2 !text-[11px]"
                  />
                </div>
              </div>

              <button disabled={bookingBusy} className="btn-primary w-full !py-2 text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm">
                {bookingBusy ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Processing reservation…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={12} /> Confirm Reservation
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Input Box & Quick Prompt Shortcuts */
            <div className="border-t border-navy-100 bg-white p-2.5">
              <div className="flex flex-wrap gap-1 pb-2">
                {QUICK.map(({ icon: Icon, label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => ask(prompt)}
                    className="inline-flex items-center gap-1 rounded-full border border-navy-200 bg-navy-50/60 px-2 py-0.5 text-[10px] font-bold text-navy-700 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Icon size={10} className="text-navy-500" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Rex or request a reservation…"
                  className="input !py-1.5 !px-3 text-xs"
                />
                <button disabled={busy || !input.trim()} className="btn-primary !px-3 !py-1.5" aria-label="Send">
                  <Send size={13} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
