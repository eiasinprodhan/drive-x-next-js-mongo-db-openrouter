export type CarCategory = "Popular" | "Large Car" | "Small Car" | "Exclusive Car";

export interface Car {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  pricePerDay: number;
  image: string;
  seats: number;
  doors: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  mpg: number;
  rating: number;
  reviews: number;
  available: boolean;
  popular: boolean;
  year: number;
  features: string[];
  description: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: "customer" | "admin";
  createdAt: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: "customer" | "admin";
  };
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type PaymentMethod = "Paypal" | "Stripe" | "PayU" | "Card";

export interface Booking {
  id: string;
  ref: string;
  carId: string;
  carName: string;
  carImage: string;
  customer: string;
  email: string;
  phone: string;
  location: string;
  pickUp: string;
  dropOff: string;
  pickDate: string;
  dropDate: string;
  days: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  createdAt: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "converted";
export type LeadIntent = "high" | "medium" | "low";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: number;
  durationDays: number;
  message: string;
  source: "landing" | "chatbot" | "manual";
  score: number; // 0-100 AI qualification score
  intent: LeadIntent;
  reason: string;
  status: LeadStatus;
  createdAt: string;
}

export interface ChatMsg {
  id: string;
  session: string;
  role: "user" | "assistant";
  text: string;
  ts: string;
}

export interface AutoEvent {
  id: string;
  type: "ai" | "email" | "webhook" | "digest" | "system";
  title: string;
  detail: string;
  status: "success" | "skipped" | "failed";
  ts: string;
}

export interface DashboardStats {
  revenue: number;
  revenueDelta: number;
  bookings: number;
  bookingsDelta: number;
  leads: number;
  leadsDelta: number;
  activeFleet: number;
  occupancy: number;
}

export interface RangePoint {
  label: string;
  revenue: number;
  bookings: number;
}

export interface LocationStat {
  name: string;
  count: number;
  pct: number;
}
