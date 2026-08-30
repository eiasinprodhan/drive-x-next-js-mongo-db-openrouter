import { BadgeCheck, Headset, MapPin } from "lucide-react";

const REASONS = [
  {
    icon: Headset,
    title: "Customer Support",
    desc: "Every day, our dedicated support team assists customers worldwide — real humans, 24/7, across every channel.",
  },
  {
    icon: BadgeCheck,
    title: "Best-Price Guaranteed",
    desc: "Transparent, all-inclusive daily rates verified against the market. Find it cheaper elsewhere and we'll match it.",
  },
  {
    icon: MapPin,
    title: "Many Locations",
    desc: "Airport counters, city hubs and hotel delivery in 8 cities — car delivery is available on request.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container-x">
        <div className="text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Why choose us</p>
          <h2 className="section-title mt-3">Drive with confidence, every mile</h2>
          <p className="section-sub">A high-performing, well-designed car rental system — built for any car company and website.</p>
        </div>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* Visual */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 -m-2 rounded-[2.5rem] bg-gradient-to-tr from-brand-100 via-transparent to-navy-50" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/why-us.jpg" alt="DriveX concierge handing over keys" className="relative w-full rounded-[2rem] object-cover shadow-pop" />
            <div className="absolute -bottom-5 left-4 sm:left-6 rounded-2xl border border-navy-100 bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-pop">
              <p className="text-xl sm:text-2xl font-extrabold text-navy-900">12,000<span className="text-brand-500">+</span></p>
              <p className="text-[11px] sm:text-xs font-semibold text-navy-400">Happy customers worldwide</p>
            </div>
          </div>

          {/* Reasons */}
          <div className="order-1 space-y-4 lg:order-2">
            {REASONS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group flex gap-4 rounded-2xl border border-navy-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
                  <Icon size={22} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-extrabold text-navy-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-navy-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
