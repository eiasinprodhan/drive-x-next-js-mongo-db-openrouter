"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CarFront, KeyRound, Loader2, Mail, Sparkles, UserPlus } from "lucide-react";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      // Try login endpoint first
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!data.ok) {
        // Fallback check admin verify if matching admin credentials
        const adminRes = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const adminData = await adminRes.json();
        if (adminData.ok) {
          localStorage.setItem("drivex_admin_token", adminData.token);
          localStorage.setItem(
            "drivex_user",
            JSON.stringify({ name: "Admin", email: adminData.email || email, role: "admin" })
          );
          window.dispatchEvent(new Event("drivex_auth_change"));
          router.push("/admin");
          return;
        }

        setErr(data.error || "Invalid email or password.");
        return;
      }

      // Customer login success
      localStorage.setItem("drivex_user", JSON.stringify(data.user));
      localStorage.setItem("drivex_token", data.token);
      window.dispatchEvent(new Event("drivex_auth_change"));

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/#deals");
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  }

  function fillDemoCustomer() {
    setEmail("customer@drivex.io");
    setPassword("password123");
    setErr("");
  }

  function fillDemoAdmin() {
    setEmail("admin@drivex.io");
    setPassword("drivex2026");
    setErr("");
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-4 py-16">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-500/15 blur-[110px]" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-brand-600/10 blur-[110px]" />
      </div>

      <div className="card relative w-full max-w-md p-8 sm:p-10 animate-pop-in">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <CarFront size={22} />
          </span>
          <div>
            <p className="text-xl font-extrabold leading-none text-navy-900">
              Drive<span className="text-brand-500">X</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-navy-400">Sign in to manage your bookings</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="email"
                required
                className="input !pl-10"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
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
          </div>

          {err && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600">{err}</p>}

          <button disabled={busy} className="btn-primary w-full !py-3.5 text-sm">
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo switcher */}
        <div className="mt-5 space-y-2 rounded-xl border border-navy-100 bg-[#F7F5F2] p-3.5 text-xs">
          <p className="font-bold text-navy-800">Quick Demo Accounts:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-bold text-brand-600 shadow-sm transition hover:bg-brand-50"
            >
              <Sparkles size={11} /> Customer Demo
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 font-bold text-navy-700 shadow-sm transition hover:bg-navy-50"
            >
              <Sparkles size={11} /> Admin Demo
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-navy-100 pt-4 text-xs">
          <span className="text-navy-500">Don't have an account?</span>
          <Link href="/register" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:text-brand-700">
            <UserPlus size={13} /> Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
