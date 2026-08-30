// ─── Data layer ─────────────────────────────────────────────────────────
// Switches between MongoDB Atlas (when MONGODB_URI is set & reachable)
// and an in-memory store (DEMO MODE) so the product always boots.

import mongoose, { Schema, model, models, type Model } from "mongoose";
import { buildBookings, buildCars, buildLeads } from "./seed-data";
import type { Booking, BookingStatus, Car, Lead, LeadStatus, User } from "./types";
import { uid } from "./utils";

let memory: {
  cars: Car[];
  bookings: Booking[];
  leads: Lead[];
  users: User[];
  messages: { id: string; session: string; role: "user" | "assistant"; text: string; ts: string }[];
  events: any[];
} | null = null;

let dbPromise: Promise<boolean> | null = null;

export async function usingMongo(): Promise<boolean> {
  if (!process.env.MONGODB_URI) return false;
  if (!dbPromise) {
    dbPromise = (async () => {
      try {
        await mongoose.connect(process.env.MONGODB_URI as string, { serverSelectionTimeoutMS: 2500 });
        return true;
      } catch {
        return false;
      }
    })();
  }
  return dbPromise;
}

function mem() {
  if (!memory) {
    const cars = buildCars();
    memory = {
      cars,
      bookings: buildBookings(cars),
      leads: buildLeads(),
      users: [
        {
          id: "usr-demo",
          name: "Alex Customer",
          email: "customer@drivex.io",
          phone: "+880 1700-000000",
          password: "password123",
          role: "customer",
          createdAt: new Date().toISOString(),
        },
      ],
      messages: [
        { id: uid("msg-"), session: "demo-session", role: "user", text: "Hi! Do you have any SUV available this weekend?", ts: new Date(Date.now() - 3 * 864e5).toISOString() },
        { id: uid("msg-"), session: "demo-session", role: "assistant", text: "Hi there! 👋 We have the Range Rover Sport ($260/day, ★4.9) and the Audi Q7 ($210/day, 7 seats) available. Both are automatic with AWD. Would you like me to check specific dates?", ts: new Date(Date.now() - 3 * 864e5 + 60000).toISOString() },
      ],
      events: [],
    };
  }
  return memory;
}

// ─── Mongoose schemas ────────────────────────────────────────────────────

const CarSchema = new Schema({ _id: String, name: String, brand: String, category: String, pricePerDay: Number, image: String, seats: Number, doors: Number, transmission: String, fuel: String, mpg: Number, rating: Number, reviews: Number, available: Boolean, popular: Boolean, year: Number, features: [String], description: String, createdAt: String }, { versionKey: false });
const BookingSchema = new Schema({ _id: String, ref: String, carId: String, carName: String, carImage: String, customer: String, email: String, phone: String, location: String, pickUp: String, dropOff: String, pickDate: String, dropDate: String, days: Number, total: Number, paymentMethod: String, status: String, createdAt: String }, { versionKey: false });
const LeadSchema = new Schema({ _id: String, name: String, email: String, phone: String, budget: Number, durationDays: Number, message: String, source: String, score: Number, intent: String, reason: String, status: String, createdAt: String }, { versionKey: false });
const UserSchema = new Schema({ _id: String, name: String, email: { type: String, unique: true }, phone: String, password: String, role: String, createdAt: String }, { versionKey: false });
const MsgSchema = new Schema({ _id: String, session: String, role: String, text: String, ts: String }, { versionKey: false });
const EventSchema = new Schema({ _id: String, type: String, title: String, detail: String, status: String, ts: String }, { versionKey: false });

const CarModel = (models.Car as Model<any>) || model("Car", CarSchema);
const BookingModel = (models.Booking as Model<any>) || model("Booking", BookingSchema);
const LeadModel = (models.Lead as Model<any>) || model("Lead", LeadSchema);
const UserModel = (models.User as Model<any>) || model("User", UserSchema);
const MsgModel = (models.Message as Model<any>) || model("Message", MsgSchema);
const EventModel = (models.AutoEvent as Model<any>) || model("AutoEvent", EventSchema);

async function autoSeedMongo() {
  if ((await CarModel.countDocuments()) > 0) return;
  const cars = buildCars();
  await CarModel.insertMany(cars.map((c) => ({ _id: c.id, ...c })));
  await BookingModel.insertMany(buildBookings(cars).map((b) => ({ _id: b.id, ...b })));
  await LeadModel.insertMany(buildLeads().map((l) => ({ _id: l.id, ...l })));
}

// ─── Cars ────────────────────────────────────────────────────────────────

function fromDoc<T>(d: any): T {
  const { _id, __v, ...rest } = d || {};
  return { id: _id, ...rest } as unknown as T;
}

export async function listCars(filter?: { category?: string; q?: string; available?: boolean }): Promise<Car[]> {
  if (await usingMongo()) {
    const q: any = {};
    if (filter?.category && filter.category !== "All") q.category = filter.category;
    if (filter?.available === false) q.available = false;
    else if (filter?.available === true) q.available = true;
    const docs: any[] = await CarModel.find(q).lean();
    let cars: Car[] = docs.map((d) => fromDoc<Car>(d));
    if (filter?.q) {
      const s = filter.q.toLowerCase();
      cars = cars.filter((c) => (c.name + c.brand + c.category + c.features.join(" ")).toLowerCase().includes(s));
    }
    return cars;
  }
  let cars = mem().cars;
  if (filter?.category && filter.category !== "All") cars = cars.filter((c) => c.category === filter.category);
  if (filter?.available === true) cars = cars.filter((c) => c.available);
  if (filter?.q) {
    const s = filter.q.toLowerCase();
    cars = cars.filter((c) => (c.name + c.brand + c.category + c.features.join(" ")).toLowerCase().includes(s));
  }
  return cars;
}

export async function getCar(id: string): Promise<Car | null> {
  if (await usingMongo()) {
    const d: any = await CarModel.findById(id).lean();
    return d ? fromDoc<Car>(d) : null;
  }
  return mem().cars.find((c) => c.id === id) || null;
}

export async function createCar(data: Omit<Car, "id" | "createdAt">): Promise<Car> {
  const car: Car = { ...data, id: uid("car-"), createdAt: new Date().toISOString() };
  if (await usingMongo()) await CarModel.create({ _id: car.id, ...car });
  else mem().cars.unshift(car);
  return car;
}

export async function updateCar(id: string, patch: Partial<Car>): Promise<Car | null> {
  if (await usingMongo()) {
    await CarModel.findByIdAndUpdate(id, { $set: patch });
  } else {
    const list = mem().cars;
    const i = list.findIndex((c) => c.id === id);
    if (i < 0) return null;
    list[i] = { ...list[i], ...patch };
  }
  return getCar(id);
}

export async function deleteCar(id: string): Promise<boolean> {
  if (await usingMongo()) {
    await CarModel.findByIdAndDelete(id);
  } else {
    const list = mem().cars;
    const i = list.findIndex((c) => c.id === id);
    if (i < 0) return false;
    list.splice(i, 1);
  }
  return true;
}

// ─── Bookings ────────────────────────────────────────────────────────────

export async function listBookings(filter?: { status?: string; email?: string; ids?: string[] }): Promise<Booking[]> {
  if (await usingMongo()) {
    const q: any = {};
    if (filter?.status && filter.status !== "All") q.status = filter.status;
    const orConds: any[] = [];
    if (filter?.email) {
      orConds.push({ email: { $regex: new RegExp(`^${filter.email.trim()}$`, "i") } });
    }
    if (filter?.ids && filter.ids.length) {
      orConds.push({ ref: { $in: filter.ids } });
      orConds.push({ id: { $in: filter.ids } });
    }
    if (orConds.length) q.$or = orConds;
    const docs: any[] = await BookingModel.find(q).sort({ createdAt: -1 }).lean();
    return docs.map((d) => fromDoc<Booking>(d));
  }
  let list = mem().bookings;
  if (filter?.status && filter.status !== "All") list = list.filter((b) => b.status === filter.status);
  if (filter?.email || (filter?.ids && filter.ids.length)) {
    const e = filter.email ? filter.email.trim().toLowerCase() : "";
    const idSet = new Set(filter.ids || []);
    list = list.filter((b) => {
      const matchEmail = e && b.email && b.email.trim().toLowerCase() === e;
      const matchId = idSet.has(b.ref) || idSet.has(b.id);
      return matchEmail || matchId;
    });
  }
  return list;
}

export async function getBooking(id: string): Promise<Booking | null> {
  if (await usingMongo()) {
    const d: any = await BookingModel.findById(id).lean();
    return d ? fromDoc<Booking>(d) : null;
  }
  return mem().bookings.find((b) => b.id === id) || null;
}

export async function createBooking(data: Omit<Booking, "id" | "ref" | "createdAt">): Promise<Booking> {
  const n = Math.floor(Math.random() * 90000) + 10000;
  const booking: Booking = { ...data, id: uid("bk-"), ref: `DX-${n}`, createdAt: new Date().toISOString() };
  if (await usingMongo()) await BookingModel.create({ _id: booking.id, ...booking });
  else mem().bookings.unshift(booking);
  return booking;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  if (await usingMongo()) await BookingModel.findByIdAndUpdate(id, { $set: { status } });
  else {
    const b = mem().bookings.find((x) => x.id === id);
    if (!b) return null;
    b.status = status;
  }
  return getBooking(id);
}

// ─── Leads ───────────────────────────────────────────────────────────────

export async function listLeads(filter?: { status?: string }): Promise<Lead[]> {
  if (await usingMongo()) {
    const q: any = {};
    if (filter?.status && filter.status !== "all") q.status = filter.status;
    const docs: any[] = await LeadModel.find(q).sort({ createdAt: -1 }).lean();
    return docs.map((d) => fromDoc<Lead>(d));
  }
  let list = mem().leads;
  if (filter?.status && filter.status !== "all") list = list.filter((l) => l.status === filter.status);
  return list;
}

export async function createLead(data: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const lead: Lead = { ...data, id: uid("ld-"), createdAt: new Date().toISOString() };
  if (await usingMongo()) await LeadModel.create({ _id: lead.id, ...lead });
  else mem().leads.unshift(lead);
  return lead;
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | null> {
  if (await usingMongo()) {
    const d: any = await LeadModel.findByIdAndUpdate(id, { $set: patch }, { new: true }).lean();
    return d ? fromDoc<Lead>(d) : null;
  }
  const l = mem().leads.find((x) => x.id === id);
  if (!l) return null;
  Object.assign(l, patch);
  return l;
}

// ─── Chat messages ───────────────────────────────────────────────────────

export async function listMessages(session?: string): Promise<any[]> {
  if (await usingMongo()) {
    const q: any = {};
    if (session) q.session = session;
    const docs: any[] = await MsgModel.find(q).sort({ ts: 1 }).lean();
    return docs.map((d) => fromDoc<any>(d));
  }
  const list = mem().messages;
  return session ? list.filter((m) => m.session === session) : list;
}

export async function saveMessage(msg: { session: string; role: "user" | "assistant"; text: string }): Promise<any> {
  const m = { id: uid("msg-"), ...msg, ts: new Date().toISOString() };
  if (await usingMongo()) await MsgModel.create({ _id: m.id, ...m });
  else mem().messages.push(m);
  return m;
}

// ─── Automation events ───────────────────────────────────────────────────

export async function listEvents(limit = 50): Promise<any[]> {
  if (await usingMongo()) {
    const docs: any[] = await EventModel.find().sort({ ts: -1 }).limit(limit).lean();
    return docs.map((d) => fromDoc<any>(d));
  }
  return mem().events.slice(0, limit);
}

export async function addEvent(ev: { type: string; title: string; detail: string; status: "success" | "skipped" | "failed" }): Promise<any> {
  const e = { id: uid("evt-"), ...ev, ts: new Date().toISOString() };
  if (await usingMongo()) await EventModel.create({ _id: e.id, ...e });
  else mem().events.unshift(e);
  return e;
}

// ─── Users & Customers ───────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<User | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (await usingMongo()) {
    const doc: any = await UserModel.findOne({ email: cleanEmail }).lean();
    return doc ? fromDoc<User>(doc) : null;
  }
  const u = mem().users.find((x) => x.email.toLowerCase() === cleanEmail);
  return u || null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (await usingMongo()) {
    const doc: any = await UserModel.findById(id).lean();
    return doc ? fromDoc<User>(doc) : null;
  }
  const u = mem().users.find((x) => x.id === id);
  return u || null;
}

export async function createUser(data: Omit<User, "id" | "createdAt">): Promise<User> {
  const user: User = {
    ...data,
    email: data.email.trim().toLowerCase(),
    role: data.role || "customer",
    id: uid("usr-"),
    createdAt: new Date().toISOString(),
  };
  if (await usingMongo()) await UserModel.create({ _id: user.id, ...user });
  else mem().users.unshift(user);
  return user;
}

export async function listUsers(): Promise<User[]> {
  if (await usingMongo()) {
    const docs: any[] = await UserModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((d) => fromDoc<User>(d));
  }
  return mem().users;
}

