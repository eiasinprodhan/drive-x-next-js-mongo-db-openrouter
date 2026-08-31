/**
 * DriveX seed script — populates the database (MongoDB Atlas when
 * MONGODB_URI is set; otherwise the app auto-seeds its in-memory store).
 *
 *   npm run seed
 */
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dns from "dns";
import { buildBookings, buildCars, buildLeads } from "../src/lib/seed-data";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // ignore if not supported in environment
}

// Load .env.local if not already loaded in environment
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    }
  }
}

loadEnv();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️  No MONGODB_URI set — the app auto-seeds its in-memory store on first run. Nothing to do.");
    process.exit(0);
  }

  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 });
  const db = mongoose.connection.db!;
  const carsCollection = db.collection("cars");
  const bookingsCollection = db.collection("bookings");
  const leadsCollection = db.collection("leads");
  const usersCollection = db.collection("users");

  const cars = buildCars();
  const bookings = buildBookings(cars);
  const leads = buildLeads();
  const users = [
    {
      _id: "usr-admin",
      id: "usr-admin",
      name: "DriveX Admin",
      email: "admin@drivex.io",
      phone: "+880 1700-000000",
      password: process.env.ADMIN_PASSWORD || "drivex2026",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "usr-customer-1",
      id: "usr-customer-1",
      name: "Alex Customer",
      email: "customer@drivex.io",
      phone: "+880 1711-223344",
      password: "password123",
      role: "customer",
      createdAt: new Date().toISOString(),
    },
  ];

  // Wipe + reseed for a rich, realistic dataset
  await Promise.all([
    carsCollection.deleteMany({}),
    bookingsCollection.deleteMany({}),
    leadsCollection.deleteMany({}),
    usersCollection.deleteMany({}),
  ]);

  await carsCollection.insertMany(cars.map((c) => ({ _id: c.id, ...c })) as any);
  await bookingsCollection.insertMany(bookings.map((b) => ({ _id: b.id, ...b })) as any);
  await leadsCollection.insertMany(leads.map((l) => ({ _id: l.id, ...l })) as any);
  await usersCollection.insertMany(users as any);

  console.log("✅ Successfully Seeded Real Data to MongoDB Atlas:");
  console.log(`   🚗 ${cars.length} Fleet Vehicles`);
  console.log(`   📅 ${bookings.length} Bookings across 365 days`);
  console.log(`   🎯 ${leads.length} AI Qualified Leads`);
  console.log(`   👤 ${users.length} Initial Accounts (Admin: admin@drivex.io, Customer: customer@drivex.io)`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
