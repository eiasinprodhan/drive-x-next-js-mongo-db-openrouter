"use client";

import { useState } from "react";
import { Bot, ExternalLink, Mail, Newspaper, Play, Workflow, Zap } from "lucide-react";
import { api, useFetch } from "@/lib/api";

const PIPELINE = [
  { icon: Zap, title: "1 · Capture", desc: "Landing form or AI chat captures the enquiry", color: "bg-navy-950 text-white" },
  { icon: Bot, title: "2 · AI Qualify", desc: "LLM scores the lead 0-100 & detects intent", color: "bg-brand-500 text-white" },
  { icon: Mail, title: "3 · Auto-email", desc: "Instant acknowledgement to the prospect (Resend)", color: "bg-sky-500 text-white" },
  { icon: Zap, title: "4 · Team alert", desc: "High-intent leads ping sales via Telegram bot", color: "bg-emerald-500 text-white" },
  { icon: Workflow, title: "5 · CRM sync", desc: "Status + score saved back to the pipeline", color: "bg-amber-500 text-white" },
];

export default function AutomationPage() {
  const [running, setRunning] = useState(false);
  const [digest, setDigest] = useState("");
  const { data: events, loading } = useFetch<any[]>("/api/admin/events");

  async function runDigest() {
    setRunning(true);
    try {
      const res = await api<{ ok: boolean; digest: string }>("/api/webhooks/digest", { method: "POST" });
      setDigest(res.digest);
    } finally {
      setRunning(false);
    }
    // refresh ledger
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">Automation Workspace</h1>
          <p className="mt-0.5 text-xs font-semibold text-navy-400">
            Lead pipeline + scheduled digests · every run is audited in the ledger below
          </p>
        </div>
        <button onClick={runDigest} disabled={running} className="btn-dark text-xs">
          <Play size={13} /> {running ? "Generating digest…" : "Run daily digest now"}
        </button>
      </div>

      {/* Pipeline */}
      <div className="card p-6">
        <p className="text-sm font-extrabold text-navy-900">Automated lead pipeline</p>
        <p className="mt-0.5 text-[11px] font-semibold text-navy-400">Triggered automatically on every new lead — no human in the loop.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.map((p, i) => (
            <div key={p.title} className="relative rounded-2xl border border-navy-100 p-4">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${p.color}`}><p.icon size={16} /></span>
              <p className="mt-2.5 text-xs font-extrabold text-navy-900">{p.title}</p>
              <p className="mt-1 text-[10px] leading-relaxed font-semibold text-navy-500">{p.desc}</p>
              {i < PIPELINE.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 place-items-center rounded-full border border-navy-100 bg-white text-[9px] font-extrabold text-navy-300 lg:grid">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Webhook info */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900"><ExternalLink size={15} className="text-brand-500" /> Cron webhook</p>
          <p className="mt-2 text-[11px] leading-relaxed font-semibold text-navy-500">
            Point any cron service (UptimeRobot, cron-job.org, GitHub Actions, n8n…) at:
          </p>
          <code className="mt-2 block overflow-x-auto rounded-xl bg-navy-950 px-4 py-3 text-[11px] font-bold text-brand-300">
            POST {typeof window !== "undefined" ? window.location.origin : ""}/api/webhooks/digest
            <br />
            headers: x-webhook-secret: {process.env.NEXT_PUBLIC_WEBHOOK_SECRET_HINT || "WEBHOOK_SECRET"}
          </code>
          <p className="mt-2 text-[10px] font-semibold text-navy-400">Returns the full daily digest; each run is logged below.</p>
        </div>

        <div className="card p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-navy-900"><Newspaper size={15} className="text-brand-500" /> Latest digest</p>
          {digest ? (
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-navy-950 p-4 text-[11px] font-bold leading-relaxed text-emerald-300">{digest}</pre>
          ) : (
            <p className="mt-2 text-[11px] font-semibold text-navy-400">
              Run the digest to preview the daily business summary here (Revenue, Bookings, Fleet, Top car). In production,
              set <code>DIGEST_WEBHOOK_URL</code> to push it to Slack/Discord/n8n.
            </p>
          )}
        </div>
      </div>

      {/* Ledger */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <h3 className="text-sm font-extrabold text-navy-900">Automation ledger</h3>
          <span className="chip bg-brand-50 text-brand-600">{events?.length || 0} events</span>
        </div>
        <div className="max-h-[420px] overflow-y-auto border-t border-navy-100">
          {loading && <p className="p-8 text-center text-xs font-bold text-navy-400">Loading ledger…</p>}
          {!loading && !events?.length && (
            <p className="p-8 text-center text-xs font-bold text-navy-400">
              No events yet — submit a lead via the customer site (or Run the digest) to see automation in action.
            </p>
          )}
          {(events || []).map((e) => (
            <div key={e.id} className="flex items-start gap-3 border-b border-navy-50 px-5 py-3.5 transition hover:bg-navy-50/40">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${e.status === "success" ? "bg-emerald-500" : e.status === "skipped" ? "bg-amber-400" : "bg-red-500"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-extrabold text-navy-900">{e.title}</p>
                  <span className="chip bg-navy-50 text-navy-400">{e.type}</span>
                  <span className={`chip text-[9px] uppercase tracking-wide ${e.status === "success" ? "bg-emerald-50 text-emerald-600" : e.status === "failed" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>{e.status}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-navy-500">{e.detail}</p>
              </div>
              <p className="shrink-0 text-[10px] font-bold text-navy-300">{new Date(e.ts).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
