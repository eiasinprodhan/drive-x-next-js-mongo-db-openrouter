"use client";

import { Globe2, TrendingUp } from "lucide-react";

// Stylised dot-matrix world continents (viewBox 600 x 300)
const CONTINENTS: { name: string; d: string; dot?: boolean }[] = [
  { name: "North America", d: "M38 78 Q60 40 118 44 Q150 46 158 68 Q166 84 148 96 Q132 106 120 132 Q112 150 96 148 Q78 144 72 122 Q64 96 38 78 Z" },
  { name: "South America", d: "M128 158 Q146 152 152 172 Q160 196 148 226 Q138 252 130 254 Q120 252 118 226 Q114 188 128 158 Z" },
  { name: "Europe", d: "M262 52 Q290 38 320 46 Q334 50 328 66 Q322 82 304 84 Q284 86 272 76 Q258 66 262 52 Z" },
  { name: "Africa", d: "M282 96 Q310 82 336 94 Q356 106 352 134 Q350 166 334 190 Q320 210 306 206 Q290 198 286 168 Q280 130 282 96 Z" },
  { name: "Asia", d: "M340 50 Q392 30 448 40 Q502 50 522 74 Q540 96 522 118 Q500 140 470 142 Q440 142 424 160 Q410 176 388 170 Q368 164 362 142 Q354 112 340 50 Z", dot: true },
  { name: "Oceania", d: "M528 196 Q546 188 556 202 Q564 216 552 228 Q540 238 528 230 Q518 218 528 196 Z" },
];

const FLAG: Record<string, string> = {
  Bangladesh: "🇧🇩",
  Dhaka: "🇧🇩",
  Singapore: "🇸🇬",
  Dubai: "🇦🇪",
  "Kuala Lumpur": "🇲🇾",
};

export default function SalesMap({ locations, loading }: { locations: { name: string; count: number; pct: number }[]; loading: boolean }) {
  const top = locations[0];
  const highlightName = top ? (top.name.includes("Dhaka") || top.name.includes("Chattogram") ? "Asia" : top.name.includes("Singapore") ? "Asia" : top.name.includes("Dubai") ? "Asia" : "Asia") : "Asia";

  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-navy-900">Sales by Countries</h3>
        <span className="chip bg-navy-50 text-navy-500">This Week <span className="ml-0.5 text-[9px]">▾</span></span>
      </div>

      {/* Map */}
      <div className="relative mt-2 flex-1">
        <svg viewBox="0 0 600 300" className="w-full">
          <defs>
            <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.6" fill="#D7DEE8" />
            </pattern>
            <linearGradient id="hot" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFA361" />
              <stop offset="100%" stopColor="#F05E00" />
            </linearGradient>
          </defs>
          {CONTINENTS.map((c) => (
            <g key={c.name}>
              <path d={c.d} fill={c.name === highlightName ? "#F05E00" : "url(#dots)"} opacity={0.9} />
              {c.name === highlightName && <path d={c.d} fill="none" stroke="#F05E00" strokeWidth="1.6" strokeOpacity="0.5" strokeDasharray="2 3" />}
            </g>
          ))}
          {/* marker on the hot region */}
          {top && (
            <g className="animate-pulse">
              <circle cx="420" cy="100" r="16" fill="#F05E00" opacity="0.15" />
              <circle cx="420" cy="100" r="7" fill="#F05E00" stroke="#fff" strokeWidth="2.5" />
            </g>
          )}
        </svg>
        {top && (
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 rounded-xl bg-navy-950 px-4 py-2 text-center shadow-pop">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-400">Top region</p>
            <p className="text-sm font-extrabold text-white">{top.count} bookings</p>
          </div>
        )}
      </div>

      {/* Location breakdown */}
      <div className="mt-4 space-y-2.5">
        {loading
          ? [...Array(4)].map((_, i) => <div key={i} className="h-6 animate-pulse rounded-lg bg-navy-50" />)
          : locations.slice(0, 5).map((l) => (
              <div key={l.name} className="flex items-center gap-2 text-[11px]">
                <span className="w-5 text-sm">{FLAG[l.name.split(",")[0]] || "🌍"}</span>
                <span className="w-24 truncate font-extrabold text-navy-700">{l.name.split(",")[0]}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-300 to-brand-500 transition-all duration-700" style={{ width: `${Math.max(6, l.pct)}%` }} />
                </div>
                <span className="w-9 text-right font-extrabold text-navy-900">{l.pct}%</span>
              </div>
            ))}
      </div>

      <p className="mt-3 flex items-center gap-1 border-t border-navy-50 pt-3 text-[11px] font-bold text-emerald-500">
        <TrendingUp size={12} /> Top location grows bookings — consider local campaign
      </p>
      <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-navy-400">
        <Globe2 size={10} /> 8 active branches · live booking attribution
      </p>
    </div>
  );
}
