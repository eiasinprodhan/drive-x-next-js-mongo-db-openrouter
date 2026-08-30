"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", budget: "", days: "3", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ score: number; intent: string } | null>(null);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await api<any>("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget) || 0,
          durationDays: Number(form.days) || 1,
          source: "landing",
        }),
      });
      setDone({ score: res.lead.score, intent: res.lead.intent });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <div className="card mx-auto max-w-lg animate-pop-in p-10 text-center">
        <CheckCircle2 size={52} className="mx-auto text-emerald-500" />
        <h3 className="mt-4 text-2xl font-extrabold text-navy-900">Request received!</h3>
        <p className="mt-2 text-sm text-navy-500">
          Thank you, <b>{form.name || "friend"}</b> — our team will call you within 30 minutes.
        </p>
        <div className="mt-5 rounded-2xl bg-navy-950 p-5 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-400">AI Lead Qualification (instant)</p>
          <p className="mt-1 text-2xl font-extrabold">
            {done.score}/100 <span className="text-sm font-bold text-brand-400">· {done.intent.toUpperCase()} intent</span>
          </p>
          <p className="mt-1 text-xs text-navy-300">Score computed by the LLM engine + rule fallback, logged to the automation ledger.</p>
        </div>
      </div>
    );

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <h3 className="text-xl font-extrabold text-navy-900">Tell us what you need</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required className="input" placeholder="Full name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" className="input" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Phone (for callback)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" className="input" placeholder="Budget $/day" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          <input type="number" className="input" placeholder="Days" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
        </div>
      </div>
      <textarea required rows={4} className="input" placeholder="What are you looking for? (car type, dates, location…)*" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{err}</p>}
      <button disabled={busy} className="btn-primary w-full !py-3">
        {busy ? (<><Loader2 size={15} className="animate-spin" /> Qualifying with AI…</>) : (<><Send size={15} /> Request a callback</>)}
      </button>
      <p className="text-center text-[11px] font-medium text-navy-400">
        🤖 Instantly qualified by our AI — score &amp; intent shown after submission. No spam, ever.
      </p>
    </form>
  );
}
