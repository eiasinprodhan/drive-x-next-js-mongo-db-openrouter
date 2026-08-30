"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CheckCircle2, KeyRound, Loader2, Mail, Phone, ShieldCheck, Sparkles, User } from "lucide-react";

export default function RegisterClient() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: true,
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setErr("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setErr("Please accept the terms and conditions.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        setErr(data.error || "Registration failed. Please try again.");
        return;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("drivex_user", JSON.stringify(data.user));
        localStorage.setItem("drivex_token", data.token);
        window.dispatchEvent(new Event("drivex_auth_change"));
      }
      setDone(true);
    } catch (e: any) {
      setErr(e?.message || "Network error during registration.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-lg animate-pop-in p-8 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-lg shadow-emerald-500/15">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="mt-5 text-2xl font-extrabold text-navy-900">Welcome to DriveX!</h3>
        <p className="mt-2 text-sm text-navy-500">
          Account created for <b className="text-navy-900">{form.fullName}</b> ({form.email}).
        </p>
        <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-left">
          <p className="flex items-center gap-1.5 text-xs font-extrabold text-brand-700">
            <Sparkles size={14} className="text-brand-500" />
            VIP Benefits Activated
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-navy-700">
            <li className="flex items-center gap-2">
              <Check size={13} className="text-brand-500" /> 10% discount on your first rental
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-brand-500" /> Instant booking without paperwork
            </li>
            <li className="flex items-center gap-2">
              <Check size={13} className="text-brand-500" /> 24/7 Priority Rex AI Concierge
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/cars" className="btn-primary flex-1 !py-3 text-sm">
            Browse fleet &amp; book
          </Link>
          <Link href="/admin" className="btn-outline flex-1 !py-3 text-sm">
            Admin Suite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-extrabold text-navy-900">Create your account</h2>
        <p className="mt-1 text-xs text-navy-500">Join thousands of drivers enjoying seamless AI-assisted rentals.</p>
      </div>

      <div className="space-y-3.5">
        <div>
          <label className="label">Full Name *</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              required
              className="input !pl-10"
              placeholder="e.g. Alex Johnson"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className="label">Email Address *</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                required
                type="email"
                className="input !pl-10"
                placeholder="alex@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Phone Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                className="input !pl-10"
                placeholder="+880 1700-000000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className="label">Password *</label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                required
                type="password"
                className="input !pl-10"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="label">Confirm Password *</label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                required
                type="password"
                className="input !pl-10"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2 pt-1 text-xs text-navy-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.terms}
            onChange={(e) => setForm({ ...form, terms: e.target.checked })}
            className="rounded border-navy-300 text-brand-500 focus:ring-brand-400"
          />
          <span>I agree to DriveX terms of service, privacy policy and rental guidelines.</span>
        </label>
      </div>

      {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{err}</p>}

      <button disabled={busy} className="btn-primary w-full !py-3.5 text-sm">
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Creating account…
          </>
        ) : (
          "Complete Registration"
        )}
      </button>

      <div className="flex items-center justify-between border-t border-navy-100 pt-4 text-xs">
        <span className="text-navy-500">Already registered?</span>
        <Link href="/admin" className="font-bold text-brand-600 hover:text-brand-700">
          Sign In
        </Link>
      </div>
    </form>
  );
}
