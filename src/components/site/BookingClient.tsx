"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Check, CreditCard, Loader2, MapPin, ShieldCheck, User } from "lucide-react";
import { api, useFetch } from "@/lib/api";
import { fmtMoney } from "@/lib/utils";
import type { Car } from "@/lib/types";
import { LOCATIONS, HELP_EMAIL } from "@/lib/seed-data";

const PAYMENTS = ["Paypal", "Stripe", "PayU", "Card"];

function todayPlus(days: number) {
  return new Date(Date.now() + days * 864e5).toISOString().slice(0, 10);
}

function BookingInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [carId, setCarId] = useState(params.get("car") || "");
  const [form, setForm] = useState({
    customer: "",
    email: "",
    phone: "",
    pickUp: LOCATIONS[0],
    dropOff: LOCATIONS[0],
    pickDate: todayPlus(1),
    dropDate: todayPlus(3),
    paymentMethod: "Paypal" as string,
  });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: cars } = useFetch<Car[]>("/api/cars");
  const selected = (cars || []).find((c) => c.id === carId);

  const days = useMemo(() => {
    const d1 = new Date(form.pickDate).getTime();
    const d2 = new Date(form.dropDate).getTime();
    return Math.max(1, Math.round((d2 - d1) / 864e5));
  }, [form.pickDate, form.dropDate]);
  const total = selected ? Math.round(selected.pricePerDay * days * 100) / 100 : 0;

  useEffect(() => {
    if (!carId && cars?.length) setCarId(cars[0].id);
    try {
      const savedUser = localStorage.getItem("drivex_user");
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setForm((prev) => ({
          ...prev,
          customer: prev.customer || u.name || "",
          email: prev.email || u.email || "",
          phone: prev.phone || u.phone || "",
        }));
      }
    } catch {}
  }, [cars, carId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!selected) return setErr("Please choose a car first.");
    if (new Date(form.dropDate) < new Date(form.pickDate)) return setErr("Drop-off must be after pickup.");
    if (!form.customer || !form.email) return setErr("Please add your name and email.");
    setBusy(true);
    try {
      const res = await api<any>("/api/booking", { method: "POST", body: JSON.stringify({ ...form, carId }) });
      try {
        const prev = JSON.parse(localStorage.getItem("drivex_my_bookings") || "[]");
        if (res?.ref && !prev.includes(res.ref)) {
          localStorage.setItem("drivex_my_bookings", JSON.stringify([...prev, res.ref]));
        }
      } catch {}
      router.push(`/booking/success?ref=${encodeURIComponent(res.ref)}&car=${encodeURIComponent(res.carName)}&total=${res.total}&days=${res.days}&email=${encodeURIComponent(form.email)}`);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Left: form */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Reservation</p>
          <h1 className="mt-2 text-3xl font-extrabold text-navy-900">Book your car</h1>
          <p className="mt-1 text-sm text-navy-500">Takes about 60 seconds — instant confirmation, free cancellation within 24h.</p>
        </div>

        <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8">
          {/* Step 1: car */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-900">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] text-white">1</span>
              Choose your vehicle
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(cars || []).slice(0, 8).map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCarId(c.id)}
                  disabled={!c.available}
                  className={`flex items-center gap-3 rounded-xl border-2 p-2.5 text-left transition ${carId === c.id ? "border-brand-500 bg-brand-50/60" : "border-navy-100 hover:border-navy-200"} ${!c.available ? "opacity-40" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.name} className="h-12 w-16 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold text-navy-900">{c.name}</p>
                    <p className="text-[11px] text-navy-400">{c.seats} seats · {c.transmission}</p>
                  </div>
                  <span className="text-xs font-extrabold text-brand-600">{fmtMoney(c.pricePerDay)}<span className="font-semibold text-navy-400">/d</span></span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: trip */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-900">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] text-white">2</span>
              Trip details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="label"><MapPin size={11} className="mr-1 inline" />Pick-up location</span>
                <select className="input" value={form.pickUp} onChange={(e) => setForm({ ...form, pickUp: e.target.value })}>
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label>
                <span className="label"><MapPin size={11} className="mr-1 inline" />Drop-off location</span>
                <select className="input" value={form.dropOff} onChange={(e) => setForm({ ...form, dropOff: e.target.value })}>
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label>
                <span className="label"><CalendarDays size={11} className="mr-1 inline" />Pick-up date</span>
                <input type="date" className="input" min={todayPlus(0)} value={form.pickDate} onChange={(e) => setForm({ ...form, pickDate: e.target.value })} />
              </label>
              <label>
                <span className="label"><CalendarDays size={11} className="mr-1 inline" />Drop-off date</span>
                <input type="date" className="input" min={form.pickDate} value={form.dropDate} onChange={(e) => setForm({ ...form, dropDate: e.target.value })} />
              </label>
            </div>
            <p className="mt-2 text-xs font-semibold text-navy-400">
              Duration: <b className="text-navy-700">{days} day{days > 1 ? "s" : ""}</b> · Free cancellation up to 24h before pickup
            </p>
          </div>

          {/* Step 3: driver */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] text-white">3</span>
                Driver details
              </p>

              {typeof window !== "undefined" && localStorage.getItem("drivex_user") ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                  <Check size={11} /> Auto-filled from your profile
                </span>
              ) : (
                <Link href="/login" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                  Have an account? Sign In
                </Link>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="label"><User size={11} className="mr-1 inline" />Full name *</span>
                <input required className="input" placeholder="e.g. Alex Cooper" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
              </label>
              <label>
                <span className="label">Email *</span>
                <input required type="email" className="input" placeholder="alex@mail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="sm:col-span-2">
                <span className="label">Phone</span>
                <input className="input" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
            </div>
          </div>

          {/* Step 4: payment */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-navy-900">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-[11px] text-white">4</span>
              Payment method
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENTS.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setForm({ ...form, paymentMethod: p })}
                  className={`rounded-xl border-2 px-3 py-3 text-xs font-extrabold transition ${form.paymentMethod === p ? "border-brand-500 bg-brand-50 text-brand-700" : "border-navy-100 text-navy-500 hover:border-navy-200"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-navy-400">
              <ShieldCheck size={12} className="text-emerald-500" /> 256-bit SSL encrypted. You'll be redirected after confirmation.
            </p>
          </div>

          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{err}</p>}

          <button disabled={busy} className="btn-primary w-full !py-3.5 text-[15px]">
            {busy ? (<><Loader2 size={16} className="animate-spin" /> Processing…</>) : <>Confirm reservation — {fmtMoney(total)}</>}
          </button>
          <p className="text-center text-[11px] font-medium text-navy-400">
            Questions? {HELP_EMAIL} · 24/7 support. By booking you agree to our rental terms.
          </p>
        </form>
      </div>

      {/* Right: summary */}
      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="card overflow-hidden">
          {selected ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image} alt={selected.name} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-navy-900">{selected.name}</h3>
                    <p className="text-xs font-medium text-navy-400">{selected.brand} · {selected.seats} seats · {selected.transmission} · {selected.fuel}</p>
                  </div>
                  <span className="chip bg-emerald-50 text-emerald-600">★ {selected.rating}</span>
                </div>
                <dl className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm">
                  <div className="flex justify-between"><dt className="text-navy-500">Rate</dt><dd className="font-bold text-navy-900">{fmtMoney(selected.pricePerDay)}/day</dd></div>
                  <div className="flex justify-between"><dt className="text-navy-500">Duration</dt><dd className="font-bold text-navy-900">{days} day{days > 1 ? "s" : ""}</dd></div>
                  <div className="flex justify-between"><dt className="text-navy-500">Insurance &amp; CDW</dt><dd className="font-bold text-emerald-600">Included</dd></div>
                  <div className="flex justify-between"><dt className="text-navy-500">Deposit (refundable)</dt><dd className="font-bold text-navy-900">$200.00</dd></div>
                  <div className="flex items-center justify-between border-t border-dashed border-navy-200 pt-2.5">
                    <dt className="font-extrabold text-navy-900">Total</dt>
                    <dd className="text-xl font-extrabold text-brand-600">{fmtMoney(total)}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : (
            <div className="grid h-64 place-items-center text-sm font-semibold text-navy-400">Loading availability…</div>
          )}
        </div>

        <div className="card space-y-3 p-5 text-xs text-navy-600">
          <p className="font-extrabold text-navy-900">What's included</p>
          {["Full insurance & collision waiver", "200 km/day mileage", "Free cancellation (24h)", "24/7 roadside assistance", "Airport delivery option"].map((t) => (
            <p key={t} className="flex items-center gap-2"><Check size={13} className="text-emerald-500" /> {t}</p>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function BookingClient() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-semibold text-navy-400">Loading…</div>}>
      <BookingInner />
    </Suspense>
  );
}
