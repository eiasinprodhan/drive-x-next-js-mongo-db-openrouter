"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarRange, TrendingUp } from "lucide-react";

const RANGES = ["7d", "30d", "90d", "180d", "ytd"];

export default function RevenueChart({
  data,
  loading,
  range,
  setRange,
}: {
  data: { label: string; revenue: number; bookings: number }[];
  loading: boolean;
  range: string;
  setRange: (r: string) => void;
}) {
  return (
    <div className="card flex flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold text-navy-900">Sales Analytics</h3>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-emerald-500">
            <TrendingUp size={12} /> Revenue trend · {range === "ytd" ? "year to date" : `last ${range}`}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-navy-100 bg-white p-1">
          <CalendarRange size={13} className="ml-1.5 text-navy-400" />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="bg-transparent px-1.5 py-1 text-[11px] font-extrabold text-navy-700 outline-none"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 h-72">
        {loading || !data.length ? (
          <div className="grid h-full place-items-center">
            <div className="h-48 w-full animate-pulse rounded-2xl bg-navy-50" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9E5E" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#FF9E5E" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#EEF2F7" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8A94A6", fontWeight: 600 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "#8A94A6", fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} />
              <Tooltip
                contentStyle={{ borderRadius: 14, border: "1px solid #EEF2F7", boxShadow: "0 12px 30px -12px rgba(10,22,40,.2)", fontSize: 12, fontWeight: 700 }}
                formatter={(value: any, name: any) => (name === "revenue" ? [`$${Number(value).toLocaleString()}`, "Revenue"] : [value, "Bookings"])}
              />
              <Area type="monotone" dataKey="revenue" stroke="#F05E00" strokeWidth={2.5} fill="url(#rev)" dot={{ r: 3, fill: "#F05E00", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex justify-between border-t border-navy-50 pt-3 text-[10px] font-bold text-navy-400">
        <span>{data.length} data points</span>
        <span>Auto-bucketed daily / monthly</span>
      </div>
    </div>
  );
}
