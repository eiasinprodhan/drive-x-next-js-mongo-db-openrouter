import type { Booking, Car, Lead } from "./types";
import { timeAgo } from "./utils";

export const HELP_EMAIL = "support@drivex.io";
export const ADMIN_PASSWORD_DEFAULT = "drivex2026";

export const LOCATIONS = [
  "Dhaka, Bangladesh",
  "Chattogram, Bangladesh",
  "Sylhet, Bangladesh",
  "Cox's Bazar, Bangladesh",
  "Khulna, Bangladesh",
  "Singapore",
  "Kuala Lumpur, Malaysia",
  "Dubai, UAE",
];

export const CAR_IMAGES: Record<string, string> = {
  "Range Rover Sport": "/images/cars/range-rover.jpg",
  "Audi A6": "/images/cars/audi.jpg",
  "BMW 5 Series": "/images/cars/bmw.jpg",
  "Toyota Corolla": "/images/cars/corolla.jpg",
  "Porsche 911": "/images/cars/porsche.jpg",
  "Mercedes-Benz S-Class": "/images/cars/mercedes.jpg",
  "Honda Fit": "/images/cars/compact.jpg",
};

export function buildCars(): Car[] {
  const base = {
    available: true,
    createdAt: new Date(Date.now() - 240 * 864e5).toISOString(),
    doors: 4,
  };
  return [
    {
      ...base,
      id: "car-01",
      name: "Range Rover Sport",
      brand: "Land Rover",
      category: "Exclusive Car",
      pricePerDay: 260,
      image: CAR_IMAGES["Range Rover Sport"],
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      mpg: 22,
      rating: 4.9,
      reviews: 326,
      popular: true,
      year: 2024,
      features: ["4WD", "Panoramic roof", "Heated seats", "Adaptive cruise", "Apple CarPlay", "360° camera"],
      description:
        "Commanding presence and first-class comfort. The Range Rover Sport pairs a refined cabin with genuine off-road capability — our most requested executive SUV.",
    },
    {
      ...base,
      id: "car-02",
      name: "Audi A6",
      brand: "Audi",
      category: "Large Car",
      pricePerDay: 174,
      image: CAR_IMAGES["Audi A6"],
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      mpg: 27,
      rating: 4.8,
      reviews: 254,
      popular: true,
      year: 2024,
      features: ["Quattro AWD", "Virtual cockpit", "Leather seats", "Wireless charging", "LED matrix", "Lane assist"],
      description:
        "A business-class sedan with a tech-filled cabin and effortless Quattro grip. Ideal for long highway drives and client meetings.",
    },
    {
      ...base,
      id: "car-03",
      name: "BMW 5 Series",
      brand: "BMW",
      category: "Large Car",
      pricePerDay: 190,
      image: CAR_IMAGES["BMW 5 Series"],
      seats: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      mpg: 32,
      rating: 4.7,
      reviews: 198,
      popular: true,
      year: 2023,
      features: ["Hybrid drive", "Harman Kardon", "Heated seats", "Parking assistant", "Gesture control", "iDrive 8"],
      description:
        "The sportiest executive sedan in its class. Plug-in hybrid efficiency with genuine driver engagement — a fleet favourite.",
    },
    {
      ...base,
      id: "car-04",
      name: "Toyota Corolla",
      brand: "Toyota",
      category: "Small Car",
      pricePerDay: 78,
      image: CAR_IMAGES["Toyota Corolla"],
      seats: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      mpg: 52,
      rating: 4.6,
      reviews: 412,
      popular: true,
      year: 2024,
      features: ["Hybrid efficiency", "Toyota Safety Sense", "Adaptive cruise", "Android Auto", "Reverse camera", "ECO mode"],
      description:
        "The world's favourite compact sedan. Remarkably frugal, famously reliable and perfectly sized for city errands and airport runs.",
    },
    {
      ...base,
      id: "car-05",
      name: "Porsche 911",
      brand: "Porsche",
      category: "Exclusive Car",
      pricePerDay: 480,
      image: CAR_IMAGES["Porsche 911"],
      seats: 2,
      transmission: "Automatic",
      fuel: "Petrol",
      mpg: 19,
      rating: 5.0,
      reviews: 87,
      popular: true,
      year: 2024,
      features: ["Launch control", "Sport chrono", "PASM suspension", "Bose audio", "Carbon interior", "Track mode"],
      description:
        "An icon for special occasions. The 911 delivers visceral performance wrapped in everyday usability — weekends you'll never forget.",
    },
    {
      ...base,
      id: "car-06",
      name: "Mercedes-Benz S-Class",
      brand: "Mercedes-Benz",
      category: "Exclusive Car",
      pricePerDay: 340,
      image: CAR_IMAGES["Mercedes-Benz S-Class"],
      seats: 5,
      transmission: "Automatic",
      fuel: "Hybrid",
      mpg: 26,
      rating: 4.9,
      reviews: 143,
      popular: true,
      year: 2024,
      features: ["Chauffeur package", "MBUX rear tablet", "Air suspension", "Rear massage seats", "Burmester 4D", "Ambient lighting"],
      description:
        "The benchmark luxury sedan. Rear massage seats, whisper-quiet cabin and pillow-soft air suspension — arrive like a head of state.",
    },
    {
      ...base,
      id: "car-07",
      name: "Honda Fit",
      brand: "Honda",
      category: "Small Car",
      pricePerDay: 45,
      image: CAR_IMAGES["Honda Fit"],
      seats: 5,
      transmission: "Manual",
      fuel: "Petrol",
      mpg: 36,
      rating: 4.4,
      reviews: 356,
      popular: false,
      year: 2023,
      features: ["Magic seats", "Bluetooth", "Reverse camera", "ECON mode", "Cruise control", "ISOFIX"],
      description:
        "Compact outside, cavernous inside. The Fit's folding 'magic' seats swallow luggage a car twice its size can't.",
    },
    {
      ...base,
      id: "car-08",
      name: "Audi Q7",
      brand: "Audi",
      category: "Large Car",
      pricePerDay: 210,
      image: "/images/cars/audi.jpg",
      seats: 7,
      transmission: "Automatic",
      fuel: "Diesel",
      mpg: 28,
      rating: 4.7,
      reviews: 167,
      popular: false,
      year: 2023,
      features: ["7 seats", "Quattro AWD", "3-zone climate", "Bang & Olufsen", "Air suspension", "Tow package"],
      description:
        "A full-size family SUV with space for seven and luggage for all of them. Effortless mile-muncher for group trips.",
    },
    {
      ...base,
      id: "car-09",
      name: "Range Rover Evoque",
      brand: "Land Rover",
      category: "Large Car",
      pricePerDay: 165,
      image: "/images/cars/range-rover.jpg",
      seats: 5,
      transmission: "Automatic",
      fuel: "Diesel",
      mpg: 30,
      rating: 4.5,
      reviews: 208,
      popular: false,
      year: 2023,
      features: ["AWD", "Pano roof", "Meridian sound", "360 camera", "Heated seats", "CarPlay"],
      description:
        "The chic compact SUV. Fashion-forward design, city-friendly dimensions and a touch of Range Rover luxury.",
    },
    {
      ...base,
      id: "car-10",
      name: "Toyota Land Cruiser",
      brand: "Toyota",
      category: "Exclusive Car",
      pricePerDay: 290,
      image: "/images/cars/corolla.jpg",
      seats: 7,
      transmission: "Automatic",
      fuel: "Diesel",
      mpg: 23,
      rating: 4.8,
      reviews: 176,
      popular: false,
      year: 2024,
      features: ["4WD", "Crawl control", "7 seats", "Cool box", "JBL audio", "Diff lock"],
      description:
        "The unstoppable legend. Whether it's mountain roads or sand dunes, the Land Cruiser gets there — and gets you back.",
    },
    {
      ...base,
      id: "car-11",
      name: "Mercedes-Benz C-Class",
      brand: "Mercedes-Benz",
      category: "Large Car",
      pricePerDay: 140,
      image: "/images/cars/mercedes.jpg",
      seats: 5,
      transmission: "Automatic",
      fuel: "Petrol",
      mpg: 29,
      rating: 4.6,
      reviews: 231,
      popular: false,
      year: 2023,
      features: ["MBUX", "Ambient lighting", "Heated seats", "Wireless CarPlay", "Blind-spot assist", "Keyless go"],
      description:
        "A baby S-Class with the tech and polish to make every drive feel premium. The smart upgrade from a compact.",
    },
    {
      ...base,
      id: "car-12",
      name: "BMW i4",
      brand: "BMW",
      category: "Small Car",
      pricePerDay: 120,
      image: "/images/cars/bmw.jpg",
      seats: 5,
      transmission: "Automatic",
      fuel: "Electric",
      mpg: 0,
      rating: 4.7,
      reviews: 122,
      popular: false,
      year: 2024,
      features: ["300 mi range", "Fast charging", "Curved display", "Sport seats", "Adaptive cruise", "One-pedal"],
      description:
        "BMW's electric gran coupe. Instant torque, silent cruising and up to 300 miles of zero-emission range.",
    },
  ];
}

const NAMES = ["Mike Witzel", "Sarah Connor", "David Chen", "Ayesha Rahman", "James Carter", "Fatima Noor", "Liam Walker", "Nusrat Jahan", "Omar Faruk", "Elena Petrova", "Rafiq Ahmed", "Tanvir Hasan"];
const METHODS = ["Paypal", "Stripe", "PayU", "Card"] as const;

function iso(daysAgo: number, hourOffset = 0): string {
  const d = new Date(Date.now() - daysAgo * 864e5);
  d.setHours(10 + (hourOffset % 9), 15 + ((daysAgo * 7) % 40), 0, 0);
  return d.toISOString();
}

function pastDate(daysAhead: number): string {
  const d = new Date(Date.now() + daysAhead * 864e5);
  return d.toISOString().slice(0, 10);
}

export function buildBookings(cars: Car[]): Booking[] {
  const bookings: Booking[] = [];
  const now = Date.now();
  // Deterministic pseudo-random so the demo looks organic on every seed
  let s = 42;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  let n = 0;
  for (let d = 300; d >= 0; d -= d > 90 ? 3 : 1) {
    const perDay = 1 + Math.floor(rnd() * 3) + (d % 30 === 0 ? 2 : 0);
    for (let k = 0; k < perDay; k++) {
      const car = cars[Math.floor(rnd() * cars.length)];
      const days = 1 + Math.floor(rnd() * 6);
      const createdAt = iso(d, k);
      const statusRoll = rnd();
      const status =
        d > 3
          ? statusRoll < 0.72
            ? "Completed"
            : statusRoll < 0.86
              ? "Cancelled"
              : "Confirmed"
          : statusRoll < 0.4
            ? "Pending"
            : statusRoll < 0.85
              ? "Confirmed"
              : "Completed";
      n++;
      bookings.push({
        id: `bk-${String(n).padStart(4, "0")}`,
        ref: `DX-${String(10000 + n + (d * 7) % 5000)}`,
        carId: car.id,
        carName: car.name,
        carImage: car.image,
        customer: NAMES[n % NAMES.length],
        email: NAMES[n % NAMES.length].toLowerCase().replace(/\s+/g, ".") + "@mail.com",
        phone: `+8801${700000000 + Math.floor(rnd() * 99999999)}`,
        location: LOCATIONS[Math.floor(rnd() * LOCATIONS.length)],
        pickUp: LOCATIONS[Math.floor(rnd() * LOCATIONS.length)].split(",")[0],
        dropOff: LOCATIONS[Math.floor(rnd() * LOCATIONS.length)].split(",")[0],
        pickDate: pastDate(Math.floor(rnd() * 10)),
        dropDate: pastDate(Math.floor(rnd() * 10) + days),
        days,
        total: Math.round(car.pricePerDay * days * 100) / 100,
        paymentMethod: METHODS[Math.floor(rnd() * METHODS.length)],
        status: status as Booking["status"],
        createdAt,
      });
    }
  }
  // A few future-dated (pending/confirmed) bookings
  for (let i = 0; i < 6; i++) {
    const car = cars[i % cars.length];
    n++;
    bookings.push({
      id: `bk-${String(n).padStart(4, "0")}`,
      ref: `DX-${10000 + n}`,
      carId: car.id,
      carName: car.name,
      carImage: car.image,
      customer: NAMES[i % NAMES.length],
      email: NAMES[i % NAMES.length].toLowerCase().replace(/\s+/g, ".") + "@mail.com",
      phone: `+8801${700000000 + Math.floor(rnd() * 99999999)}`,
      location: LOCATIONS[i % LOCATIONS.length],
      pickUp: LOCATIONS[i % LOCATIONS.length].split(",")[0],
      dropOff: LOCATIONS[(i + 3) % LOCATIONS.length].split(",")[0],
      pickDate: pastDate(1 + i),
      dropDate: pastDate(3 + i),
      days: 2 + (i % 4),
      total: Math.round(car.pricePerDay * (2 + (i % 4)) * 100) / 100,
      paymentMethod: METHODS[i % METHODS.length],
      status: i % 2 ? "Pending" : "Confirmed",
      createdAt: iso(i),
    });
  }
  return bookings.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function buildLeads(): Lead[] {
  const samples: Array<[string, string, number, number, string]> = [
    ["Ayesha Rahman", "ayesha@studio.co", 150, 5, "Need a luxury sedan for a wedding shoot in Dhaka next weekend."],
    ["James Carter", "j.carter@outlook.com", 90, 3, "Looking for an automatic compact for a business trip, airport pickup preferred."],
    ["Fatima Noor", "fatima.noor@gmail.com", 0, 7, "Is the Range Rover available for Cox's Bazar trip? Also how does insurance work?"],
    ["Omar Faruk", "omar.faruk@brac.net", 200, 10, "Need 2 SUVs for a corporate retreat for 10 people, driver optional."],
  ];
  return samples.map(([name, email, budget, days, message], i) => {
    const score = budget > 0 ? 72 + i * 6 : 45;
    return {
      id: `ld-${1000 + i}`,
      name,
      email,
      phone: `+8801${700000000 + i * 137713}0`,
      budget,
      durationDays: days,
      message,
      source: (i % 2 ? "chatbot" : "landing") as Lead["source"],
      score: score > 90 ? 90 : score,
      intent: (budget > 0 ? "high" : "medium") as Lead["intent"],
      reason: budget > 0
        ? "Replied fast, provided budget + confirmed dates → high purchase intent."
        : "Detailed request but missing budget → needs a follow-up call.",
      status: (i < 2 ? "new" : "qualified") as Lead["status"],
      createdAt: iso(i * 2 + 1),
    };
  });
}

export function payoutInfo(method: string, seed: number) {
  const num = `${416645453773 + seed * 137}`.slice(0, 12);
  return { method, masked: `#${num.slice(0, 4)}${num.slice(4, 8)}${num.slice(8)}` };
}
