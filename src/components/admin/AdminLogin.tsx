"use client";

import { useState } from "react";
import Link from "next/link";
import { CarFront, KeyRound, Loader2, Mail, ShieldAlert, Sparkles, UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/api";

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("admin@drivex.io");
  const [password, setPassword] = useState("drivex2026");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await api<{ ok: boolean; token: string }>("/api/admin/verify", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(
        "drivex_user",
        JSON.stringify({ name: email.split("@")[0].toUpperCase(), email, role: "admin" })
      );
      window.dispatchEvent(new Event("drivex_auth_change"));
      onLogin(res.token);
    } catch (e: any) {
      setErr("Invalid email or password. Use demo credentials or register an account.");
    } finally {
      setBusy(false);
    }
  }

  function fillDemoAdmin() {
    setEmail("admin@drivex.io");
    setPassword("drivex2026");
    setErr("");
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-4">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/15 blur-[110px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-600/10 blur-[110px]" />
      </div>

      <div className="card relative w-full max-w-md p-8 sm:p-10 animate-pop-in">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <CarFront size={22} />
          </span>
          <div>
            <p className="text-lg font-extrabold leading-none text-navy-900">
              Drive<span className="text-brand-500">X</span> Admin Suite
            </p>
            <p className="mt-1 text-[11px] font-semibold text-navy-400">Sign in with email &amp; password</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="label">Admin Email</span>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="email"
                required
                className="input !pl-10"
                placeholder="admin@drivex.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </label>

          <label className="block">
            <span className="label">Password</span>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="password"
                required
                className="input !pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>

          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{err}</p>}

          <button disabled={busy} className="btn-primary w-full !py-3.5 text-sm">
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Verifying credentials…
              </>
            ) : (
              "Sign in to Dashboard"
            )}
          </button>
        </form>

        {/* Demo switcher */}
        <div className="mt-5 space-y-2.5 rounded-xl border border-navy-100 bg-[#F7F5F2] p-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-800">Quick Demo Credentials:</span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700 underline"
            >
              <Sparkles size={11} /> Auto Fill
            </button>
          </div>
          <p className="text-[11px] text-navy-500">
            Email: <b className="text-navy-900">admin@drivex.io</b> · Pass: <b className="text-navy-900">drivex2026</b>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4 text-xs">
          <Link href="/register" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700">
            <UserPlus size={13} /> Customer Register
          </Link>
          <Link href="/" className="font-semibold text-navy-500 hover:text-navy-800">
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
