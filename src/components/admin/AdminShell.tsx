"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3, Bot, CalendarDays, CarFront, ChevronRight, LayoutDashboard, LogOut, Menu,
  Package, Settings, Sparkles, Star, Users, Workflow, X, Zap, KeyRound,
} from "lucide-react";
import LoginClient from "@/components/site/LoginClient";
import { TOKEN_KEY } from "@/lib/api";

export function useAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setToken(localStorage.getItem(TOKEN_KEY));
    setReady(true);
  }, []);
  return { token, ready, setToken };
}

const NAV = [
  {
    group: "Main",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
      { href: "/admin/leads", label: "AI Leads", icon: Users, badge: "AI" },
    ],
  },
  {
    group: "Inventory",
    items: [
      { href: "/admin/fleet", label: "Fleet / Cars", icon: CarFront },
      { href: "/admin/fleet?add=1", label: "Add Car", icon: Package },
    ],
  },
  {
    group: "AI & Automation",
    items: [
      { href: "/admin/assistant", label: "Assistant", icon: Bot, badge: "AI" },
      { href: "/admin/automation", label: "Automation", icon: Workflow, badge: "⚡" },
    ],
  },
  {
    group: "Sales",
    items: [
      { href: "/admin/dashboard#analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/dashboard#transactions", label: "Transactions", icon: Star },
    ],
  },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const { token, ready, setToken } = useAdmin();
  const path = usePathname();
  const router = useRouter();
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (ready && token) {
      (async () => {
        try {
          const res = await fetch(`/api/admin/verify?token=${token}`);
          const v = await res.json();
          if (!v.ok) {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
          }
        } catch {
          /* offline fallback: keep session */
        }
      })();
    }
  }, [ready, token, setToken]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-navy-50/50 text-sm font-semibold text-navy-400">Loading…</div>;
  if (!token) return <LoginClient />;

  const Sidebar = (
    <aside className="flex h-full w-60 flex-col border-r border-navy-100 bg-white">
      {/* Brand */}
      <Link href="/" className="flex h-16 items-center gap-2 border-b border-navy-100 px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500 text-white">
          <CarFront size={16} />
        </span>
        <div>
          <p className="text-sm font-extrabold leading-none text-navy-900">
            Drive<span className="text-brand-500">X</span>
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-navy-400">Admin Suite</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-navy-300">{group}</p>
            <div className="space-y-0.5">
              {items.map(({ href, label, icon: Icon, badge }) => {
                const active = path === href.split("?")[0];
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileNav(false)}
                    className={`group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold transition ${
                      active ? "bg-brand-50 text-brand-600" : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
                    }`}
                  >
                    <Icon size={16} className={active ? "text-brand-500" : "text-navy-400 group-hover:text-navy-600"} />
                    <span className="flex-1">{label}</span>
                    {badge && <span className={`chip ${active ? "bg-brand-500 text-white" : "bg-navy-100 text-navy-500"}`}>{badge}</span>}
                    {active && <ChevronRight size={13} className="text-brand-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-navy-100 p-3">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-navy-500 transition hover:bg-navy-50">
          <Settings size={16} className="text-navy-400" /> View customer site
        </Link>
        <button
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            setToken(null);
            router.push("/admin");
          }}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F5F2]">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{Sidebar}</div>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 animate-fade-in">{Sidebar}</div>
          <button className="absolute left-[15.5rem] top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-navy-700 shadow" onClick={() => setMobileNav(false)} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="grid h-9 w-9 place-items-center rounded-lg border border-navy-100 text-navy-600 lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu">
            <Menu size={17} />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/60 px-3 py-2 text-xs font-semibold text-navy-400 sm:flex">
            <input placeholder="Search… (Ctrl K)" className="w-40 bg-transparent outline-none placeholder:text-navy-300" />
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-navy-400 shadow-sm">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-navy-100 bg-white px-3 py-1.5 text-[11px] font-bold text-navy-500 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Coming Soon
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-950 px-3 py-1.5 text-[11px] font-bold text-white">
              <Sparkles size={12} className="text-brand-400" /> Add New
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-navy-100 bg-white text-navy-500" title="Notifications">
              <Zap size={15} />
              <span className="absolute ml-5 mt-4 h-2 w-2 rounded-full bg-brand-500" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-navy-100 bg-white text-navy-500">
              <Settings size={15} />
            </span>
            <span className="relative hidden h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-extrabold text-white sm:grid">
              AD
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-navy-100 px-6 py-4 text-[11px] font-semibold text-navy-400 sm:flex-row">
          <p>©2026 DriveX Rentals. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <KeyRound size={11} /> Secured session · Designed &amp; Developed by DriveX
          </p>
        </footer>
      </div>
    </div>
  );
}
