"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown, Clock, MapPin, Search } from "lucide-react";
import { LOCATIONS } from "@/lib/seed-data";

const TIME_OPTIONS = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "08:00 PM"
];

function formatDateDisplay(isoDate: string) {
  if (!isoDate) return "";
  const parts = isoDate.split("-").map(Number);
  if (parts.length < 3) return isoDate;
  const [y, m, d] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d).padStart(2, "0")}-${months[m - 1]}-${y}`;
}

export default function SearchBar() {
  const [pickUp, setPickUp] = useState("Dhaka, Bangladesh");
  const [dropOff, setDropOff] = useState("Dhaka, Bangladesh");
  const [pickDate, setPickDate] = useState("2026-08-31");
  const [dropDate, setDropDate] = useState("2026-09-02");
  const [pickTime, setPickTime] = useState("10:00 AM");
  const [dropTime, setDropTime] = useState("10:00 AM");

  // Dropdown open states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLFormElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({
      pickup: pickUp.split(",")[0].trim(),
      dropoff: dropOff.split(",")[0].trim(),
      from: `${pickDate}T${pickTime.replace(" ", "")}`,
      to: `${dropDate}T${dropTime.replace(" ", "")}`,
    });
    window.location.href = `/cars?${q.toString()}`;
  }

  return (
    <form
      ref={containerRef}
      onSubmit={submit}
      className="relative z-30 w-full rounded-2xl border border-navy-100 bg-white p-4 shadow-[0_20px_50px_-16px_rgba(10,22,40,0.18)] sm:p-5"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-0">
        {/* ================= Pick-Up Section ================= */}
        <div className="flex-1 xl:pr-5">
          <p className="mb-2.5 flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-brand-500" />
              <span className="absolute h-1 w-1 rounded-full bg-brand-500" />
            </span>
            Pick-Up
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Pick-Up Location */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "pickup-loc" ? null : "pickup-loc")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "pickup-loc"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Locations</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{pickUp}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "pickup-loc" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "pickup-loc" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-navy-100 bg-white p-1.5 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <div className="max-h-60 overflow-y-auto">
                    {LOCATIONS.map((loc) => {
                      const selected = loc === pickUp;
                      return (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => {
                            setPickUp(loc);
                            setActiveDropdown(null);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                            selected
                              ? "bg-brand-50 font-bold text-brand-600"
                              : "text-navy-700 hover:bg-navy-50 hover:text-navy-950"
                          }`}
                        >
                          <MapPin size={13} className={selected ? "text-brand-500" : "text-navy-400"} />
                          <span className="flex-1 truncate">{loc}</span>
                          {selected && <Check size={14} className="text-brand-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pick-Up Date */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "pickup-date" ? null : "pickup-date")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "pickup-date"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Date</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{formatDateDisplay(pickDate)}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "pickup-date" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "pickup-date" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-2xl border border-navy-100 bg-white p-3 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Choose Pick-Up Date</p>
                  <input
                    type="date"
                    value={pickDate}
                    onChange={(e) => {
                      setPickDate(e.target.value);
                      if (e.target.value > dropDate) setDropDate(e.target.value);
                      setActiveDropdown(null);
                    }}
                    className="w-full rounded-xl border border-navy-200 bg-navy-50/60 px-3 py-2 text-xs font-bold text-navy-900 outline-none focus:border-brand-400 focus:bg-white"
                  />
                  <div className="mt-2.5 flex flex-col gap-1 border-t border-navy-100 pt-2">
                    {["2026-08-31", "2026-09-01", "2026-09-05"].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          setPickDate(d);
                          setActiveDropdown(null);
                        }}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          pickDate === d ? "bg-brand-50 font-bold text-brand-600" : "text-navy-700 hover:bg-navy-50"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className={pickDate === d ? "text-brand-500" : "text-navy-400"} />
                          {formatDateDisplay(d)}
                        </span>
                        {pickDate === d && <Check size={12} className="text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pick-Up Time */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "pickup-time" ? null : "pickup-time")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "pickup-time"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Time</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{pickTime}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "pickup-time" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "pickup-time" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-2xl border border-navy-100 bg-white p-1.5 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Select Time</p>
                  <div className="max-h-48 overflow-y-auto">
                    {TIME_OPTIONS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => {
                          setPickTime(t);
                          setActiveDropdown(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          pickTime === t ? "bg-brand-50 font-bold text-brand-600" : "text-navy-700 hover:bg-navy-50"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className={pickTime === t ? "text-brand-500" : "text-navy-400"} />
                          {t}
                        </span>
                        {pickTime === t && <Check size={12} className="text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px w-full bg-navy-100 xl:my-0 xl:h-auto xl:w-px xl:self-stretch" />

        {/* ================= Drop-Off Section ================= */}
        <div className="flex-1 xl:pl-5">
          <p className="mb-2.5 flex items-center gap-2 text-sm font-extrabold text-navy-900">
            <span className="grid h-4 w-4 place-items-center rounded-full border-2 border-navy-800">
              <span className="h-1.5 w-1.5 rounded-full bg-navy-800" />
            </span>
            Drop-Off
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {/* Drop-Off Location */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "dropoff-loc" ? null : "dropoff-loc")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "dropoff-loc"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Locations</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{dropOff}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "dropoff-loc" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "dropoff-loc" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-navy-100 bg-white p-1.5 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <div className="max-h-60 overflow-y-auto">
                    {LOCATIONS.map((loc) => {
                      const selected = loc === dropOff;
                      return (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => {
                            setDropOff(loc);
                            setActiveDropdown(null);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                            selected
                              ? "bg-brand-50 font-bold text-brand-600"
                              : "text-navy-700 hover:bg-navy-50 hover:text-navy-950"
                          }`}
                        >
                          <MapPin size={13} className={selected ? "text-brand-500" : "text-navy-400"} />
                          <span className="flex-1 truncate">{loc}</span>
                          {selected && <Check size={14} className="text-brand-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Drop-Off Date */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "dropoff-date" ? null : "dropoff-date")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "dropoff-date"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Date</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{formatDateDisplay(dropDate)}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "dropoff-date" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "dropoff-date" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-2xl border border-navy-100 bg-white p-3 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Choose Drop-Off Date</p>
                  <input
                    type="date"
                    value={dropDate}
                    min={pickDate}
                    onChange={(e) => {
                      setDropDate(e.target.value);
                      setActiveDropdown(null);
                    }}
                    className="w-full rounded-xl border border-navy-200 bg-navy-50/60 px-3 py-2 text-xs font-bold text-navy-900 outline-none focus:border-brand-400 focus:bg-white"
                  />
                  <div className="mt-2.5 flex flex-col gap-1 border-t border-navy-100 pt-2">
                    {["2026-09-02", "2026-09-04", "2026-09-08"].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          setDropDate(d);
                          setActiveDropdown(null);
                        }}
                        className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          dropDate === d ? "bg-brand-50 font-bold text-brand-600" : "text-navy-700 hover:bg-navy-50"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className={dropDate === d ? "text-brand-500" : "text-navy-400"} />
                          {formatDateDisplay(d)}
                        </span>
                        {dropDate === d && <Check size={12} className="text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Drop-Off Time */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "dropoff-time" ? null : "dropoff-time")}
                className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                  activeDropdown === "dropoff-time"
                    ? "border-brand-500 bg-white ring-2 ring-brand-500/20"
                    : "border-navy-100 bg-[#F7F5F2] hover:border-navy-200 hover:bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] font-extrabold uppercase tracking-wide text-navy-400">Time</span>
                  <span className="block truncate text-[13px] font-bold text-navy-900">{dropTime}</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-navy-400 transition-transform duration-200 ${
                    activeDropdown === "dropoff-time" ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </button>

              {activeDropdown === "dropoff-time" && (
                <div className="absolute left-0 top-full z-50 mt-1.5 w-48 rounded-2xl border border-navy-100 bg-white p-1.5 shadow-2xl shadow-navy-950/15 animate-pop-in">
                  <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-navy-400">Select Time</p>
                  <div className="max-h-48 overflow-y-auto">
                    {TIME_OPTIONS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => {
                          setDropTime(t);
                          setActiveDropdown(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                          dropTime === t ? "bg-brand-50 font-bold text-brand-600" : "text-navy-700 hover:bg-navy-50"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className={dropTime === t ? "text-brand-500" : "text-navy-400"} />
                          {t}
                        </span>
                        {dropTime === t && <Check size={12} className="text-brand-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search button */}
        <div className="flex items-end xl:pl-5">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-600 active:scale-[0.98] xl:w-auto xl:self-stretch"
          >
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}
