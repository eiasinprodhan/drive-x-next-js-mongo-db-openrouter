"use client";

import { useState } from "react";
import { Bot, Fingerprint, Mail, Phone, RefreshCw, Sparkles, Target, Trash2 } from "lucide-react";
import { useFetch, api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted"];
const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "bg-amber-50 text-amber-600",
  contacted: "bg-sky-50 text-sky-600",
  qualified: "bg-emerald-50 text-emerald-600",
  converted: "bg-navy-950 text-white",
};

function scoreColor(s: number) {
  if (s >= 70) return "from-emerald-500 to-emerald-400";
  if (s >= 45) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

export default function LeadsPage() {
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const { data: leads, loading, setData } = useFetch<Lead[]>(tab === "all" ? "/api/leads" : `/api/leads?status=${tab}`);
  const [rescoring, setRescoring] = useState(false);
  const [toast, setToast] = useState("");

  const list = (leads || []).filter((l) => tab === "all" || l.status === tab);
  const avg = list.length ? Math.round(list.reduce((s, l) => s + l.score, 0) / list.length) : 0;
  const high = list.filter((l) => l.intent === "high").length;

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function setStatus(id: string, status: LeadStatus) {
    const updated = await api<Lead>(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    setData((prev: Lead[] | null) => (prev || []).map((x) => (x.id === id ? updated : x)));
    notify(`Lead moved to ${status.toUpperCase()} — automation ledger updated`);
  }

  async function rescoreAll() {
    setRescoring(true);
    try {
      const res = await api<{ processed: number; high: number }>("/api/ai/qualify", { method: "POST" });
      const fresh = await api<Lead[]>("/api/leads");
      setData(fresh);
      notify(`AI re-qualified ${res.processed} lead(s) · ${res.high} marked HIGH intent`);
    } finally {
      setRescoring(false);
    }
  }

  return (
    <div className="space-y-5">
      {toast && <div className="fixed bottom-6 right-6 z-50 animate-pop-in rounded-xl bg-navy-950 px-4 py-3 text-xs font-bold text-white shadow-pop">{toast}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">AI Lead Qualification</h1>
          <p className="mt-0.5 text-xs font-semibold text-navy-400">
            Every landing &amp; chatbot enquiry is scored by the AI engine · avg score <b className="text-navy-700">{avg}/100</b> · {high} high-intent
          </p>
        </div>
        <button onClick={rescoreAll} disabled={rescoring} className="btn-dark text-xs">
          <RefreshCw size={14} className={rescoring ? "animate-spin" : ""} /> Re-score all with AI
        </button>
      </div>

      {/* Pipeline funnel */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STATUSES.map((s) => {
          const count = (leads || []).filter((l) => l.status === s).length;
          const pct = leads?.length ? Math.round((count / leads.length) * 100) : 0;
          return (
            <button key={s} onClick={() => setTab(tab === s ? "all" : s)} className={`card p-4 text-left transition hover:-translate-y-0.5 ${tab === s ? "ring-2 ring-brand-500" : ""}`}>
              <p className={`chip ${STATUS_COLOR[s]}`}>{s}</p>
              <p className="mt-2 text-2xl font-extrabold text-navy-900">{count}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-navy-100">
                <div className={`h-full rounded-full bg-gradient-to-r ${scoreColor(pct)}`} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1 text-[10px] font-bold text-navy-400">{pct}% of pipeline</p>
            </button>
          );
        })}
      </div>

      {/* Lead cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {loading && <div className="card col-span-full p-10 text-center text-sm font-bold text-navy-400">Loading leads…</div>}
        {!loading && list.length === 0 && (
          <div className="card col-span-full p-10 text-center text-sm font-bold text-navy-400">
            No leads yet — try the contact page or the AI assistant on the customer site.
          </div>
        )}
        {list.map((l) => (
          <div key={l.id} className="card p-5">
            <div className="flex items-start gap-4">
              {/* Score ring */}
              <div className="relative grid h-20 w-20 shrink-0 place-items-center">
                <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#F0F4FA" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="34" fill="none"
                    stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(l.score / 100) * 213.6} 213.6`}
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFB27D" />
                      <stop offset="100%" stopColor="#F05E00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-xl font-extrabold leading-none text-navy-900">{l.score}</p>
                  <p className="text-[8px] font-extrabold uppercase text-navy-400">AI score</p>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-extrabold text-navy-900">{l.name}</h3>
                  <span className={`chip ${l.intent === "high" ? "bg-red-50 text-red-600" : l.intent === "medium" ? "bg-amber-50 text-amber-600" : "bg-navy-50 text-navy-500"}`}>
                    {l.intent.toUpperCase()} intent
                  </span>
                  <span className={`chip ${STATUS_COLOR[l.status]}`}>{l.status}</span>
                </div>
                <p className="mt-0.5 flex items-center gap-2 text-[11px] font-semibold text-navy-400">
                  <Mail size={10} /> {l.email}
                  {l.phone && <><span>·</span><Phone size={10} /> {l.phone}</>}
                  <span>·</span> {timeAgo(l.createdAt)}
                </p>
                <p className="mt-1.5 rounded-xl bg-navy-50 px-3 py-2 text-xs italic leading-relaxed text-navy-600">“{l.message}”</p>

                <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold leading-relaxed text-navy-500">
                  <Fingerprint size={12} className="mt-0.5 shrink-0 text-brand-500" />
                  <span><b className="text-navy-800">Why: </b>{l.reason}</span>
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-navy-400">
                  <span className="chip bg-navy-50">Source: {l.source}</span>
                  <span className="chip bg-navy-50">Budget: ${l.budget || "—"}/day</span>
                  <span className="chip bg-navy-50">{l.durationDays} days</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-50 pt-3">
              <span className="mr-auto text-[10px] font-bold uppercase tracking-wider text-navy-300">Pipeline:</span>
              {STATUSES.filter((s) => s !== l.status).map((s) => (
                <button key={s} onClick={() => setStatus(l.id, s)} className="rounded-lg bg-navy-50 px-2.5 py-1 text-[10px] font-extrabold text-navy-600 transition hover:bg-navy-950 hover:text-white">
                  {s}
                </button>
              ))}
              {l.source === "chatbot" && (
                <span className="chip bg-brand-50 text-brand-600"><Bot size={10} /> via chat</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card flex flex-wrap items-center gap-4 p-5 text-xs font-semibold text-navy-500">
        <Sparkles size={16} className="text-brand-500" />
        <p className="flex-1">
          <b className="text-navy-800">Automation:</b> new leads → AI scores → Telegram alert to sales team → auto-reply email →
          CRM status sync — all recorded in the <b>Automation ledger</b>.
        </p>
        <Target size={14} className="text-navy-300" />
        <Trash2 size={14} className="text-navy-300" />
      </div>
    </div>
  );
}
