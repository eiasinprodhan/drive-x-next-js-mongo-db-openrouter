"use client";

import { useState } from "react";
import { CheckCircle2, Download, Search } from "lucide-react";
import { useFetch, api } from "@/lib/api";
import { fmtMoney, timeAgo } from "@/lib/utils";
import StatusPill from "@/components/admin/StatusPill";
import type { Booking } from "@/lib/types";

const STATUSES = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

function toCSV(rows: Booking[]) {
  const head = ["Ref", "Customer", "Email", "Car", "Location", "Pickup", "Dropoff", "Days", "Total", "Payment", "Status", "Created"];
  const lines = rows.map((b) =>
    [b.ref, b.customer, b.email, b.carName, b.location, b.pickDate, b.dropDate, b.days, b.total, b.paymentMethod, b.status, b.createdAt]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [head.join(","), ...lines].join("\n");
}

export default function BookingsPage() {
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");
  const { data: bookings, loading, setData } = useFetch<Booking[]>(`/api/booking?status=${status}`);
  const [saving, setSaving] = useState<string | null>(null);

  const list = (bookings || []).filter((b) => {
    const s = q.toLowerCase();
    return !s || (b.customer + b.carName + b.ref + b.email).toLowerCase().includes(s);
  });

  async function setStatusFor(b: Booking, next: string) {
    setSaving(b.id);
    try {
      const updated = await api<Booking>(`/api/bookings/${b.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      setData((prev: Booking[] | null) => (prev || []).map((x) => (x.id === b.id ? updated : x)));
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">Bookings &amp; Transactions</h1>
          <p className="mt-0.5 text-xs font-semibold text-navy-400">{list.length} records · update statuses — customers see confirmation instantly</p>
        </div>
        <button onClick={() => { const blob = new Blob([toCSV(list)], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "drivex-bookings.csv"; a.click(); }} className="btn-outline text-xs">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${status === s ? "bg-navy-950 text-white" : "bg-navy-50 text-navy-600 hover:bg-navy-100"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer, car, ref…" className="input !py-2 !pl-9 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-[12px]">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50/50 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">
                <th className="px-5 py-3">Ref</th>
                <th className="px-3 py-3">Customer</th>
                <th className="px-3 py-3">Car</th>
                <th className="px-3 py-3">Trip</th>
                <th className="px-3 py-3">Payment</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm font-bold text-navy-400">Loading bookings…</td></tr>
              )}
              {!loading && list.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm font-bold text-navy-400">No bookings found for this filter.</td></tr>
              )}
              {list.map((b) => (
                <tr key={b.id} className="border-b border-navy-50 transition hover:bg-navy-50/40">
                  <td className="px-5 py-3">
                    <p className="font-extrabold text-navy-900">{b.ref}</p>
                    <p className="text-[10px] font-semibold text-navy-400">{timeAgo(b.createdAt)}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-bold text-navy-900">{b.customer}</p>
                    <p className="text-[10px] font-semibold text-navy-400">{b.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.carImage} alt={b.carName} className="h-8 w-11 rounded-md object-cover" />
                      <span className="font-bold text-navy-700">{b.carName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[11px] font-semibold text-navy-500">
                    <p>{b.pickUp} → {b.dropOff}</p>
                    <p className="text-navy-400">{b.pickDate} · {b.days}d</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-bold text-navy-700">{b.paymentMethod}</p>
                    <p className="text-[10px] font-semibold text-navy-400">#{String(b.ref).slice(3)}-4478</p>
                  </td>
                  <td className="px-3 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-3 py-3 font-extrabold text-navy-900">{fmtMoney(b.total)}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="relative inline-block">
                      <select
                        value={b.status}
                        disabled={saving === b.id}
                        onChange={(e) => setStatusFor(b, e.target.value)}
                        className="rounded-lg border border-navy-200 bg-white px-2.5 py-1.5 pr-6 text-[11px] font-extrabold text-navy-700 outline-none transition focus:border-brand-400"
                      >
                        {STATUSES.filter((s) => s !== "All").map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <CheckCircle2 size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-navy-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
