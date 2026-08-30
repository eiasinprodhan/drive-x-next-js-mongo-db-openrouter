"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How it Work" },
  { href: "/#deals", label: "Rental Details" },
  { href: "/#why-us", label: "Why Choose Us" },
  { href: "/#reviews", label: "Testimonial" },
];

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [customer, setCustomer] = useState<{ name: string; email: string; role?: "admin" | "customer" } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function loadCustomer() {
      try {
        const u = localStorage.getItem("drivex_user");
        if (u) setCustomer(JSON.parse(u));
        else setCustomer(null);
      } catch {
        setCustomer(null);
      }
    }
    loadCustomer();
    window.addEventListener("drivex_auth_change", loadCustomer);
    return () => window.removeEventListener("drivex_auth_change", loadCustomer);
  }, []);

  function signOutCustomer() {
    localStorage.removeItem("drivex_user");
    localStorage.removeItem("drivex_token");
    setCustomer(null);
    window.dispatchEvent(new Event("drivex_auth_change"));
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-[#F7F5F2]/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_4px_24px_-12px_rgba(10,22,40,0.18)]" : ""
      }`}
    >
      <div className="container-x flex h-[72px] lg:h-[76px] items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" />
              <path d="M3 16v-3a2 2 0 012-2h14a2 2 0 012 2v3" />
              <path d="M4 16h16v3a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 0116 19v-1H8v1a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 014 19v-3z" />
              <circle cx="7.5" cy="14.5" r=".8" fill="currentColor" />
              <circle cx="16.5" cy="14.5" r=".8" fill="currentColor" />
            </svg>
          </span>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-900">
            Drive<span className="text-brand-600">X</span>
          </span>
        </Link>

        {/* Right-aligned Navigation and Actions (Desktop: lg+) */}
        <div className="hidden items-center gap-4 xl:gap-6 lg:flex ml-auto">
          {/* Desktop links without underlines */}
          <nav className="flex items-center gap-0.5 xl:gap-1">
            {LINKS.map((l) => {
              const active = l.href === "/" ? path === "/" : path.startsWith(l.href.split("#")[0]);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm xl:text-[15px] font-semibold no-underline transition ${
                    active ? "text-brand-600 font-bold" : "text-navy-700 hover:text-brand-600"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Separator before Register / Account */}
          <span className="h-5 w-px bg-navy-900/15" />

          {/* Auth links / Profile */}
          {customer ? (
            <div className="flex items-center gap-3 xl:gap-4">
              <Link
                href={customer.role === "admin" ? "/admin" : "/dashboard"}
                className="rounded-lg border border-brand-500 bg-brand-500 px-4 xl:px-5 py-2 text-[13px] xl:text-[14px] font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 hover:border-brand-600 no-underline"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={signOutCustomer}
                className="text-[13px] xl:text-[14px] font-semibold text-navy-700 transition hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 xl:gap-5">
              <Link href="/register" className="text-[14px] xl:text-[15px] font-semibold text-navy-800 transition hover:text-brand-600 no-underline">
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-brand-500 bg-brand-500 px-5 xl:px-6 py-2 xl:py-2.5 text-[14px] xl:text-[15px] font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 hover:border-brand-600 no-underline"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle button (Hidden on lg+) */}
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-navy-200/80 bg-white text-navy-800 shadow-sm transition hover:bg-navy-50 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>

      {/* Mobile dropdown menu (for < lg) */}
      {open && (
        <div className="border-t border-navy-100 bg-[#F7F5F2]/98 backdrop-blur-md px-4 pb-6 pt-3 shadow-xl lg:hidden">
          <div className="space-y-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3.5 py-2.5 text-[14px] font-bold text-navy-800 transition hover:bg-white hover:text-brand-600"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {customer ? (
            <div className="mt-4 flex items-center gap-2.5 border-t border-navy-100 pt-4">
              <Link
                href={customer.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  signOutCustomer();
                  setOpen(false);
                }}
                className="rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-xs font-bold text-navy-700 transition hover:bg-red-50 hover:text-red-600"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2.5 border-t border-navy-100 pt-4">
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-navy-200 bg-white px-4 py-2.5 text-center text-xs font-bold text-navy-800 transition hover:border-brand-400 hover:text-brand-600"
              >
                Register
              </Link>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-center text-xs font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
