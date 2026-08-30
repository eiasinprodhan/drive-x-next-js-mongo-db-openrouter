import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, Clock3, MapPin } from "lucide-react";

async function SuccessInner({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const ref = typeof sp.ref === "string" ? sp.ref : "DX-XXXXXX";
  const car = typeof sp.car === "string" ? sp.car : "your car";
  const total = typeof sp.total === "string" ? sp.total : "—";
  const days = typeof sp.days === "string" ? sp.days : "—";

  return (
    <div className="container-x grid min-h-[80vh] place-items-center bg-[#FAF7F2] py-16">
      <div className="card w-full max-w-lg p-8 text-center sm:p-10 animate-fade-up">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50">
          <CheckCircle2 size={44} className="text-emerald-500" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold text-navy-900">Booking confirmed! 🎉</h1>
        <p className="mt-2 text-sm text-navy-500">
          Your {car} is reserved for <b>{days} day{days !== "1" ? "s" : ""}</b> at <b>${total}</b>. A confirmation email is
          on its way — the admin dashboard already has your booking.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-500">Booking reference</p>
          <p className="mt-1 text-3xl font-extrabold tracking-wider text-navy-900">{ref}</p>
          <p className="mt-1 text-[11px] font-semibold text-navy-500">Show this at pickup — keep it in your wallet 📱</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left text-xs">
          <div className="rounded-xl bg-navy-50 p-3.5">
            <p className="flex items-center gap-1 font-extrabold text-navy-900">
              <Clock3 size={12} className="text-brand-500" /> Pickup
            </p>
            <p className="mt-1 font-semibold text-navy-500">At your selected branch, from 10:00 AM</p>
          </div>
          <div className="rounded-xl bg-navy-50 p-3.5">
            <p className="flex items-center gap-1 font-extrabold text-navy-900">
              <MapPin size={12} className="text-brand-500" /> Need docs?
            </p>
            <p className="mt-1 font-semibold text-navy-500">Driver's licence + ID — that's it.</p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2">
          <Link href="/cars" className="btn-primary w-full">Rent another car</Link>
          <Link href="/" className="btn-ghost w-full">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] py-32 text-center text-sm text-navy-400">Loading…</div>}>
      <SuccessInner searchParams={searchParams} />
    </Suspense>
  );
}
