"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight, ArrowUpRight, Banknote, CalendarCheck2, ChevronDown, Clock3, Gem,
  RefreshCw, TrendingUp, Users,
} from "lucide-react";
import { useFetch, api } from "@/lib/api";
import { fmtCompact, fmtMoney, timeAgo } from "@/lib/utils";
import RevenueChart from "@/components/admin/RevenueChart";
import SalesMap from "@/components/admin/SalesMap";
import StatusPill from "@/components/admin/StatusPill";

const RANGES = ["7d", "30d", "90d", "180d", "ytd"];

export default function DashboardPage() {
  const [range, setRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, setData } = useFetch<any>(`/api/admin/dashboard?range=${range}`);

  const stats = data?.stats;
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.statusCounts || []).forEach((s: any) => (map[s.status] = s.count));
    return map;
  }, [data]);

  async function refresh() {
    setRefreshing(true);
    try {
      const fresh = await api<any>(`/api/admin/dashboard?range=${range}`);
      setData(fresh);
    } finally {
      setRefreshing(false);
    }
  }

  const cards = [
    {
      title: "Total Revenue",
      value: fmtMoney(stats?.revenue || 0),
      sub: `+${stats?.revenueDelta ?? 0}% increase vs previous period`,
      subUp: true,
      icon: Banknote,
      accent: "text-emerald-500",
      card: (
        <span className="relative grid h-20 w-24 place-items-center rounded-2xl bg-emerald-50">
          <Banknote size={38} className="text-emerald-500" />
          <span className="absolute -right-2 top-1 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow"><TrendingUp size={14} /></span>
        </span>
      ),
    },
    {
      title: "Total Bookings",
      value: fmtCompact(stats?.bookings || 0),
      sub: `+${stats?.bookingsDelta ?? 0}% vs previous period`,
      subUp: true,
      accent: "text-brand-500",
      card: (
        <span className="relative grid h-20 w-24 place-items-center rounded-2xl bg-brand-500 text-white">
          <CalendarCheck2 size={34} />
          <span className="absolute -right-2 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/25"><TrendingUp size={14} /></span>
        </span>
      ),
    },
    {
      title: "Active Fleet",
      value: String(stats?.activeFleet ?? 0),
      sub: `${stats?.occupancy ?? 0}% occupancy this period`,
      subUp: false,
      accent: "text-navy-300",
      card: (
        <span className="relative grid h-20 w-24 place-items-center rounded-2xl bg-navy-900 text-white">
          <Gem size={34} />
          <span className="absolute -right-2 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/15 text-[10px] font-extrabold">Live</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">
            👋 Hi Mike Witzel, here's what's happening with your store today.
          </h1>
          <p className="mt-1 text-xs font-semibold text-navy-400">
            Live inventory, bookings &amp; AI-qualified leads — updated in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-3 py-2 text-xs font-bold text-navy-600 shadow-sm">
            <span className="text-navy-400">📅</span> {new Date(Date.now() - 10 * 864e5).toISOString().slice(0, 10)} → {new Date().toISOString().slice(0, 10)}
          </div>
          <button onClick={refresh} className="grid h-9 w-9 place-items-center rounded-xl border border-navy-100 bg-white text-navy-500 shadow-sm transition hover:text-brand-600" title="Refresh data">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="card flex items-center justify-between gap-4 p-5">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wide text-navy-400">{c.title}</p>
              <p className="mt-1.5 text-2xl font-extrabold text-navy-900 sm:text-[1.7rem]">{loading ? "…" : c.value}</p>
              <p className={`mt-1 flex items-center gap-1 text-[11px] font-bold ${c.subUp ? "text-emerald-500" : "text-navy-400"}`}>
                {c.subUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {c.sub}
              </p>
            </div>
            {c.card}
          </div>
        ))}
      </div>

      {/* Best sellers + transactions */}
      <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
        {/* Best sellers */}
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-navy-900">Best Seller Cars</h3>
            <Link href="/admin/fleet" className="text-[11px] font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading
              ? [...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-navy-50" />)
              : (data?.topCars || []).slice(0, 6).map((c: any, i: number) => (
                  <div key={c.name} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt={c.name} className="h-11 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-extrabold text-navy-900">
                        <span className="mr-1.5 text-[11px] font-bold text-navy-300">#{i + 1}</span>
                        {c.name}
                      </p>
                      <p className="text-[11px] font-semibold text-navy-400">{c.days} days booked</p>
                    </div>
                    <span className="text-[13px] font-extrabold text-navy-900">{fmtMoney(c.revenue)}</span>
                  </div>
                ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div id="transactions" className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-3">
            <h3 className="text-sm font-extrabold text-navy-900">Recent Transactions</h3>
            <Link href="/admin/bookings" className="text-[11px] font-bold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[12px]">
              <thead>
                <tr className="border-y border-navy-100 bg-navy-50/50 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">
                  <th className="px-5 py-2.5">#</th>
                  <th className="px-3 py-2.5">Order Details</th>
                  <th className="px-3 py-2.5">Payment</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-5 py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="h-8 animate-pulse rounded-lg bg-navy-50" /></td></tr>
                    ))
                  : (data?.recent || []).slice(0, 6).map((b: any, i: number) => (
                      <tr key={b.id} className="border-b border-navy-50 transition hover:bg-navy-50/40">
                        <td className="px-5 py-3 font-extrabold text-navy-300">{i + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.carImage || "/images/cars/corolla.jpg"} alt={b.carName} className="h-9 w-12 rounded-md object-cover" />
                            <div>
                              <p className="font-extrabold text-navy-900">{b.carName}</p>
                              <p className="flex items-center gap-1 text-[10px] font-semibold text-navy-400">
                                <Clock3 size={9} /> {timeAgo(b.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-bold text-navy-700">{b.paymentMethod}</p>
                          <p className="text-[10px] font-semibold text-navy-400">#{String(b.ref).slice(0, 12)}</p>
                        </td>
                        <td className="px-3 py-3"><StatusPill status={b.status} /></td>
                        <td className="px-5 py-3 text-right font-extrabold text-navy-900">{fmtMoney(b.total)}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Analytics + map */}
      <div id="analytics" className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <RevenueChart data={data?.series || []} loading={loading} range={range} setRange={setRange} />
        <SalesMap locations={data?.locations || []} loading={loading} />
      </div>

      {/* Activity strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Users, label: "AI-qualified leads", value: stats?.leads ?? 0, sub: `${Math.round((stats?.leadsDelta ?? 0) + 12)}% qualified this week`, href: "/admin/leads" },
          { icon: CalendarCheck2, label: "Pending confirmations", value: statusCounts["Pending"] ?? 0, sub: "awaiting your action", href: "/admin/bookings" },
          { icon: Gem, label: "Confirmed trips today", value: statusCounts["Confirmed"] ?? 0, sub: "ready for pickup", href: "/admin/bookings" },
        ].map((c) => (
          <Link key={c.label} href={c.href} className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-pop">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><c.icon size={20} /></span>
            <div>
              <p className="text-lg font-extrabold leading-none text-navy-900">{loading ? "…" : c.value}</p>
              <p className="mt-1 text-[11px] font-bold text-navy-500">{c.label}</p>
              <p className="text-[10px] font-semibold text-navy-400">{c.sub}</p>
            </div>
            <ChevronDown size={15} className="ml-auto -rotate-90 text-navy-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
