import { CalendarCheck, CarFront, MapPin } from "lucide-react";

const STEPS = [
  {
    icon: MapPin,
    step: "Step 01",
    title: "Choose Location",
    desc: "Select your pickup and drop-off locations, date and time — from 8 branches including 24/7 airport counters.",
  },
  {
    icon: CalendarCheck,
    step: "Step 02",
    title: "Pick-up Date",
    desc: "Browse AI-ranked vehicles, compare transparent all-inclusive pricing, and reserve your car in under 60 seconds.",
  },
  {
    icon: CarFront,
    step: "Step 03",
    title: "Book your car",
    desc: "Get instant confirmation with a booking reference, full insurance and 24/7 roadside support — no paperwork.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">How it works</p>
          <h2 className="section-title mt-3">Rent in 3 simple steps</h2>
          <p className="section-sub">A high-performing, well-designed car rental system — built for any car company and website.</p>
        </div>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {/* Continuous flowing wavy dashed line accurately centered between icons 1 -> 2 -> 3 */}
          <svg
            className="pointer-events-none absolute left-0 top-10 hidden h-16 w-full lg:block z-0"
            viewBox="0 0 900 64"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 150 32 C 260 -6, 340 68, 450 32 C 560 -4, 640 68, 750 32"
              stroke="#FFD9BD"
              strokeWidth="2.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </svg>

          {STEPS.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={title} className="group relative z-10 rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-card">
              {/* Step Icon Badge */}
              <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <Icon size={30} strokeWidth={1.8} />
                <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-navy-900 text-[10px] font-extrabold text-white">
                  {i + 1}
                </span>
              </div>

              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-widest text-brand-500">{step}</p>
              <h3 className="mt-1.5 text-lg font-extrabold text-navy-900">{title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-navy-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
