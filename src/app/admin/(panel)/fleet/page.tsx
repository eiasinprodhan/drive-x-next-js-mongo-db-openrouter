"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useFetch, api } from "@/lib/api";
import { fmtMoney } from "@/lib/utils";
import type { Car } from "@/lib/types";

type EditCar = Partial<Car> & { featuresStr?: string };

const EMPTY: EditCar = {
  name: "", brand: "", category: "Large Car", pricePerDay: 100, image: "/images/cars/corolla.jpg",
  seats: 5, doors: 4, transmission: "Automatic", fuel: "Petrol", mpg: 25, rating: 4.5,
  reviews: 10, available: true, popular: false, year: 2024, features: [], description: "",
};

function FleetInner() {
  const params = useSearchParams();
  const [editing, setEditing] = useState<EditCar | null>(params.get("add") === "1" ? { ...EMPTY } : null);
  const { data: cars, loading, setData } = useFetch<Car[]>("/api/cars?view=all");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  function notify(m: string) {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  }

  async function toggleAvailable(c: Car) {
    const updated = await api<Car>(`/api/cars/${c.id}`, { method: "PUT", body: JSON.stringify({ available: !c.available }) });
    setData((prev: Car[] | null) => (prev || []).map((x) => (x.id === c.id ? updated : x)));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setBusy(true);
    try {
      const feats = (editing.featuresStr as string || "").split(",").map((f) => f.trim()).filter(Boolean);
      const payload = { ...editing, features: feats };
      delete (payload as any).featuresStr;
      if (editing.id) {
        const updated = await api<Car>(`/api/cars/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setData((prev: Car[] | null) => (prev || []).map((x) => (x.id === updated.id ? updated : x)));
        notify("Car updated ✓");
      } else {
        const created = await api<Car>("/api/cars", { method: "POST", body: JSON.stringify(payload) });
        setData((prev: Car[] | null) => [created, ...(prev || [])]);
        notify("Car added to fleet ✓");
      }
      setEditing(null);
    } catch (e: any) {
      notify(`Save failed: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this car from the fleet?")) return;
    await api(`/api/cars/${id}`, { method: "DELETE" });
    setData((prev: Car[] | null) => (prev || []).filter((x) => x.id !== id));
    notify("Car deleted");
  }

  return (
    <div className="space-y-5">
      {toast && <div className="fixed bottom-6 right-6 z-50 animate-pop-in rounded-xl bg-navy-950 px-4 py-3 text-xs font-bold text-white shadow-pop">{toast}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-navy-900 sm:text-2xl">Fleet Management</h1>
          <p className="mt-0.5 text-xs font-semibold text-navy-400">{cars?.length || 0} vehicles · toggling availability updates the customer site instantly</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-dark text-xs">
          <Plus size={14} /> Add new car
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading && [...Array(6)].map((_, i) => <div key={i} className="card h-56 animate-pulse bg-navy-50" />)}
        {(cars || []).map((c) => (
          <div key={c.id} className="card group overflow-hidden">
            <div className="relative aspect-[16/9] bg-navy-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">{c.category}</span>
              <span className={`chip absolute right-3 top-3 ${c.available ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {c.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-navy-900">{c.name}</h3>
                  <p className="text-[11px] font-semibold text-navy-400">{c.brand} · {c.year} · {c.seats} seats · {c.transmission}</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold text-navy-900">{fmtMoney(c.pricePerDay)}<span className="text-[10px] text-navy-400">/d</span></p>
                  <p className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500"><Star size={9} className="fill-amber-400" /> {c.rating} ({c.reviews})</p>
                </div>
              </div>

              {/* Availability switch */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-navy-50 px-3 py-2">
                <span className="text-[11px] font-extrabold text-navy-600">Listed on customer site</span>
                <button
                  onClick={() => toggleAvailable(c)}
                  className={`relative h-6 w-11 rounded-full transition ${c.available ? "bg-emerald-500" : "bg-navy-200"}`}
                  aria-label="Toggle availability"
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${c.available ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => setEditing({ ...c, featuresStr: c.features.join(", ") })} className="btn-outline flex-1 !py-2 text-[11px]">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => remove(c.id)} className="btn flex-1 !py-2 text-[11px] border border-red-100 text-red-500 hover:bg-red-50">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-navy-950/60 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="card my-8 w-full max-w-2xl animate-pop-in p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-navy-900">{editing.id ? "Edit car" : "Add new car"}</h2>
              <button type="button" onClick={() => setEditing(null)} className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-500 hover:bg-navy-100"><X size={15} /></button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="label">Name *</span><input required className="input" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="BMW X5" /></label>
              <label><span className="label">Brand</span><input className="input" value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} /></label>
              <label>
                <span className="label">Category</span>
                <select className="input" value={editing.category || "Large Car"} onChange={(e) => setEditing({ ...editing, category: e.target.value as any })}>
                  {["Popular", "Large Car", "Small Car", "Exclusive Car"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label><span className="label">Price/day ($)</span><input type="number" className="input" value={editing.pricePerDay ?? 100} onChange={(e) => setEditing({ ...editing, pricePerDay: Number(e.target.value) })} /></label>
              <label><span className="label">Image path</span><input className="input" value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label><span className="label">Seats</span><input type="number" className="input" value={editing.seats || 5} onChange={(e) => setEditing({ ...editing, seats: Number(e.target.value) })} /></label>
              <label>
                <span className="label">Transmission</span>
                <select className="input" value={editing.transmission || "Automatic"} onChange={(e) => setEditing({ ...editing, transmission: e.target.value as any })}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </label>
              <label>
                <span className="label">Fuel</span>
                <select className="input" value={editing.fuel || "Petrol"} onChange={(e) => setEditing({ ...editing, fuel: e.target.value as any })}>
                  {["Petrol", "Diesel", "Hybrid", "Electric"].map((f) => <option key={f}>{f}</option>)}
                </select>
              </label>
              <label><span className="label">Year</span><input type="number" className="input" value={editing.year || 2024} onChange={(e) => setEditing({ ...editing, year: Number(e.target.value) })} /></label>
              <label className="sm:col-span-2"><span className="label">Features (comma separated)</span><input className="input" value={(editing.featuresStr as string) || ""} onChange={(e) => setEditing({ ...editing, featuresStr: e.target.value })} placeholder="Sunroof, Heated seats, CarPlay" /></label>
              <label className="sm:col-span-2"><span className="label">Description</span><textarea rows={2} className="input" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm font-bold text-navy-700">
                <input type="checkbox" checked={!!editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} className="h-4 w-4 accent-brand-500" /> Available for booking
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-navy-700">
                <input type="checkbox" checked={!!editing.popular} onChange={(e) => setEditing({ ...editing, popular: e.target.checked })} className="h-4 w-4 accent-brand-500" /> Featured / Popular
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline text-xs">Cancel</button>
              <button disabled={busy} className="btn-primary text-xs">{busy ? "Saving…" : editing.id ? "Save changes" : "Add to fleet"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-sm font-bold text-navy-400">Loading…</div>}>
      <FleetInner />
    </Suspense>
  );
}
