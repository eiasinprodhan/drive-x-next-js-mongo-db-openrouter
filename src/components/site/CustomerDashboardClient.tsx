"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Headphones,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Phone,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import type { Booking } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";

const CUSTOMER_NAV = [
  {
    group: "Reservations",
    items: [
      { id: "all", label: "All Bookings", icon: LayoutDashboard },
      { id: "active", label: "Active Rentals", icon: CarFront, badge: "Live" },
      { id: "pending", label: "Pending Approval", icon: Clock },
      { id: "completed", label: "Completed Trips", icon: CalendarCheck },
    ],
  },
  {
    group: "Explore & Book",
    items: [
      { id: "fleet", label: "Browse Fleet", icon: Sparkles, href: "/cars" },
      { id: "book", label: "Book a Car", icon: Plus, href: "/booking" },
    ],
  },
];

export default function CustomerDashboardClient() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; role?: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [mobileDrawer, setMobileDrawer] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("drivex_user");
      if (!stored) {
        router.push("/login");
        return;
      }
      const parsed = JSON.parse(stored);
      setUser(parsed);
      loadBookings(parsed.email);
    } catch {
      router.push("/login");
    }
  }, [router]);

  async function loadBookings(email: string) {
    setLoading(true);
    try {
      let savedIds: string[] = [];
      try {
        savedIds = JSON.parse(localStorage.getItem("drivex_my_bookings") || "[]");
      } catch {}
      const idsParam = savedIds.length ? `&ids=${encodeURIComponent(savedIds.join(","))}` : "";
      const res = await fetch(`/api/booking?email=${encodeURIComponent(email || "")}${idsParam}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem("drivex_user");
    localStorage.removeItem("drivex_token");
    window.dispatchEvent(new Event("drivex_auth_change"));
    router.push("/login");
  }

  const activeCount = bookings.filter((b) => b.status === "Confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const totalSpent = bookings.reduce((sum, b) => (b.status !== "Cancelled" ? sum + (b.total || 0) : sum), 0);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "active" && b.status !== "Confirmed") return false;
    if (activeTab === "pending" && b.status !== "Pending") return false;
    if (activeTab === "completed" && b.status !== "Completed") return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCar = b.carName?.toLowerCase().includes(q);
      const matchRef = b.ref?.toLowerCase().includes(q);
      const matchLocation = b.pickUp?.toLowerCase().includes(q) || b.dropOff?.toLowerCase().includes(q);
      return matchCar || matchRef || matchLocation;
    }
    return true;
  });

  if (!user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F7F5F2] text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
          <p className="text-sm font-bold text-navy-600">Loading your rental portal…</p>
        </div>
      </div>
    );
  }

  const SidebarContent = (
    <aside className="flex h-full w-64 flex-col border-r border-navy-100 bg-white">
      {/* Brand Header */}
      <Link href="/" className="flex h-16 items-center gap-2.5 border-b border-navy-100 px-5">
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-white shadow-sm shadow-brand-500/30">
          <CarFront size={16} />
        </span>
        <div>
          <p className="text-sm font-extrabold leading-none text-navy-900">
            Drive<span className="text-brand-600">X</span>
          </p>
          <p className="mt-0.5 text-[10px] font-bold text-navy-400">Customer Portal</p>
        </div>
      </Link>

      {/* User Profile Mini Badge */}
      <div className="border-b border-navy-100 bg-[#FAF8F5]/80 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-xs font-black text-white shadow-sm shadow-brand-500/25">
            {user.name ? user.name.slice(0, 2).toUpperCase() : "CU"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-extrabold text-navy-900 truncate">{user.name || "Customer"}</p>
            <p className="text-[10px] text-navy-400 font-medium truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-extrabold text-amber-700 border border-amber-200">
            <Sparkles size={10} className="text-amber-500" /> VIP Member · 10% Off
          </span>
          <span className="text-[10px] font-bold text-emerald-600">● Active</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {CUSTOMER_NAV.map(({ group, items }) => (
          <div key={group}>
            <p className="px-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-navy-300">{group}</p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const isSelected = !item.href && activeTab === item.id;
                const Icon = item.icon;

                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMobileDrawer(false)}
                      className="group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-navy-600 transition hover:bg-navy-50 hover:text-navy-900"
                    >
                      <Icon size={16} className="text-navy-400 group-hover:text-brand-500" />
                      <span className="flex-1">{item.label}</span>
                      <ArrowUpRight size={13} className="text-navy-300 group-hover:text-navy-500" />
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileDrawer(false);
                    }}
                    className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-bold transition ${
                      isSelected ? "bg-brand-50 text-brand-600" : "text-navy-500 hover:bg-navy-50 hover:text-navy-900"
                    }`}
                  >
                    <Icon size={16} className={isSelected ? "text-brand-500" : "text-navy-400 group-hover:text-navy-600"} />
                    <span className="flex-1">{item.label}</span>
                    {item.id === "active" && activeCount > 0 && (
                      <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                        {activeCount}
                      </span>
                    )}
                    {isSelected && <ChevronRight size={13} className="text-brand-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-navy-100 p-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-bold text-navy-500 transition hover:bg-navy-50 hover:text-navy-900"
        >
          <ExternalLink size={15} className="text-navy-400" /> Back to Website
        </Link>
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-bold text-navy-700 bg-navy-50 transition hover:bg-navy-100"
          >
            <ShieldCheck size={15} className="text-brand-500" /> Admin Suite
          </Link>
        )}
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-bold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F5F2]">
      {/* Desktop Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{SidebarContent}</div>

      {/* Mobile Slide-Out Drawer */}
      {mobileDrawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-xs" onClick={() => setMobileDrawer(false)} />
          <div className="absolute inset-y-0 left-0 animate-fade-in">{SidebarContent}</div>
          <button
            className="absolute left-[16.5rem] top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-navy-700 shadow"
            onClick={() => setMobileDrawer(false)}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        {/* Sticky Executive Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-navy-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-xl border border-navy-200/80 bg-white text-navy-800 shadow-xs lg:hidden"
              onClick={() => setMobileDrawer(true)}
              aria-label="Open menu drawer"
            >
              <Menu size={18} />
            </button>

            {/* Quick search */}
            <div className="flex items-center gap-2 rounded-xl border border-navy-100 bg-navy-50/60 px-3 py-1.5 text-xs text-navy-700">
              <Search size={14} className="text-navy-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rentals, cars, ref…"
                className="w-36 sm:w-56 bg-transparent text-xs font-semibold outline-none placeholder:text-navy-300"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-navy-400 hover:text-navy-700">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => user?.email && loadBookings(user.email)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-bold text-navy-700 transition hover:bg-navy-50 shadow-xs"
              title="Refresh Bookings"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-brand-500" : "text-navy-500"} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Book Car</span>
            </Link>

            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-navy-950 text-xs font-extrabold text-white">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "CU"}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
          </div>
        </header>

        {/* Dashboard Main View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Welcome Banner Card */}
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-navy-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                  Welcome back, {user.name ? user.name.split(" ")[0] : "Customer"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                  <Sparkles size={11} className="text-emerald-500" /> Active Member
                </span>
              </div>
              <p className="mt-1 text-xs text-navy-500">Manage your reservations, view booking tickets, or explore the live fleet.</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/booking"
                className="btn-primary text-xs !py-2.5 !px-4"
              >
                <Plus size={13} /> Quick Reservation
              </Link>
            </div>
          </div>

          {/* KPI Stats Row */}
          <div className="mt-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">Total Bookings</p>
              <p className="mt-1.5 text-2xl font-black text-navy-900">{bookings.length}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active Rentals</p>
              <p className="mt-1.5 text-2xl font-black text-emerald-600">{activeCount}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending</p>
              <p className="mt-1.5 text-2xl font-black text-amber-600">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-navy-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">Total Spent</p>
              <p className="mt-1.5 text-2xl font-black text-brand-600">{fmtMoney(totalSpent)}</p>
            </div>
          </div>

          {/* Reservations List Section */}
          <div className="mt-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-navy-900">Your Reservations</h2>
                <p className="text-xs text-navy-500">
                  {filteredBookings.length} reservation{filteredBookings.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-navy-100 bg-white p-1 shadow-xs">
                {[
                  { id: "all", label: "All" },
                  { id: "active", label: "Active" },
                  { id: "pending", label: "Pending" },
                  { id: "completed", label: "Completed" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                      activeTab === t.id
                        ? "bg-navy-950 text-white shadow-xs"
                        : "text-navy-500 hover:text-navy-900 hover:bg-navy-50"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List / Cards */}
            {loading ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/70" />
                ))}
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-navy-200 bg-white p-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-navy-50 text-navy-400">
                  <CarFront size={28} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-navy-900">No reservations found</h3>
                <p className="mt-1 text-xs text-navy-500">
                  {searchQuery ? "Try adjusting your search terms." : "Ready for your next journey? Browse available vehicles."}
                </p>
                <Link
                  href="/cars"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600"
                >
                  <Sparkles size={13} /> Explore Fleet
                </Link>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="card flex flex-col justify-between overflow-hidden p-0 transition hover:shadow-md border border-navy-100"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {b.carImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={b.carImage}
                              alt={b.carName}
                              className="h-13 w-20 rounded-xl object-cover border border-navy-100 shadow-xs shrink-0"
                            />
                          ) : (
                            <div className="grid h-13 w-20 place-items-center rounded-xl bg-navy-100 text-navy-500 shrink-0">
                              <CarFront size={20} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] font-extrabold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">
                              #{b.ref || b.id}
                            </span>
                            <h3 className="text-sm font-extrabold text-navy-900 mt-1 truncate">{b.carName}</h3>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shrink-0 ${
                            b.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : b.status === "Completed"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : b.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      {/* Route Details */}
                      <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-[#FAF8F5] p-3 text-xs text-navy-700">
                        <div>
                          <p className="text-[9px] font-bold text-navy-400 uppercase">Pick-Up</p>
                          <p className="mt-0.5 font-bold flex items-center gap-1 text-navy-900 truncate">
                            <MapPin size={11} className="text-brand-500 shrink-0" /> {b.pickUp || "Dhaka"}
                          </p>
                          <p className="text-[10px] text-navy-500 mt-0.5">{b.pickDate}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-navy-400 uppercase">Drop-Off</p>
                          <p className="mt-0.5 font-bold flex items-center gap-1 text-navy-900 truncate">
                            <MapPin size={11} className="text-navy-400 shrink-0" /> {b.dropOff || "Dhaka"}
                          </p>
                          <p className="text-[10px] text-navy-500 mt-0.5">{b.dropDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between border-t border-navy-100 bg-white px-5 py-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy-400">{b.days}d rental</span>
                        <span className="text-navy-300">·</span>
                        <span className="text-xs font-black text-brand-600">{fmtMoney(b.total)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-lg border border-navy-200 bg-white px-3 py-1.5 text-xs font-bold text-navy-700 transition hover:bg-navy-50 shadow-xs"
                      >
                        View Voucher
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-navy-100 px-6 py-4 text-[11px] font-semibold text-navy-400 sm:flex-row">
          <p>©2026 DriveX Rentals. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <KeyRound size={11} /> Secured Customer Session
          </p>
        </footer>
      </div>

      {/* Voucher Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy-950/60 p-4 backdrop-blur-xs">
          <div className="card relative w-full max-w-lg p-6 sm:p-7 animate-pop-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
                  Official Confirmation Voucher
                </span>
                <h3 className="mt-2 text-lg sm:text-xl font-extrabold text-navy-900">
                  Reservation #{selectedBooking.ref}
                </h3>
                <p className="text-xs text-navy-400">Show this voucher or reference at the pickup counter</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-1.5 text-navy-400 transition hover:bg-navy-100 hover:text-navy-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl border border-navy-100 bg-[#FAF8F5] p-4 text-xs">
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <span className="text-navy-500 font-medium">Vehicle</span>
                <span className="font-bold text-navy-900">{selectedBooking.carName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <span className="text-navy-500 font-medium">Driver Name</span>
                <span className="font-bold text-navy-900">{selectedBooking.customer}</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <span className="text-navy-500 font-medium">Dates ({selectedBooking.days} days)</span>
                <span className="font-bold text-navy-900">
                  {selectedBooking.pickDate} → {selectedBooking.dropDate}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <span className="text-navy-500 font-medium">Pickup Branch</span>
                <span className="font-bold text-navy-900">{selectedBooking.pickUp}</span>
              </div>
              <div className="flex items-center justify-between border-b border-navy-100 pb-2.5">
                <span className="text-navy-500 font-medium">Drop-off Branch</span>
                <span className="font-bold text-navy-900">{selectedBooking.dropOff}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-navy-900">Total Paid</span>
                <span className="text-base font-black text-brand-600">{fmtMoney(selectedBooking.total)}</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-outline flex-1 text-xs !py-2.5 flex items-center justify-center gap-1.5"
              >
                <Printer size={13} /> Print / Save Voucher
              </button>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="btn-primary flex-1 text-xs !py-2.5"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
