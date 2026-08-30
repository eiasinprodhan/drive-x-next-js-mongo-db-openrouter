import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const COLS = [
  {
    title: "About",
    links: ["About us", "Our fleet", "Careers", "News"],
  },
  {
    title: "Community",
    links: ["Driving tips", "Blog", "Reviews", "Support"],
  },
  {
    title: "Socials",
    links: ["Facebook", "LinkedIn", "Instagram", "YouTube"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-white">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11" />
                <path d="M3 16v-3a2 2 0 012-2h14a2 2 0 012 2v3" />
                <path d="M4 16h16v3a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 0116 19v-1H8v1a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 014 19v-3z" />
                <circle cx="7.5" cy="14.5" r=".8" fill="currentColor" />
                <circle cx="16.5" cy="14.5" r=".8" fill="currentColor" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Drive<span className="text-brand-500">X</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
            Our car-rental online booking system is crafted to meet the specific requirements of customers — with professional
            drivers or self-drive options, 24/7 support and full insurance.
          </p>
          <div className="mt-6 flex items-center gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-navy-300 transition hover:border-brand-500 hover:bg-brand-500 hover:text-white">
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-navy-400">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <Link href="#" className="text-sm font-medium text-navy-200 transition hover:text-brand-400">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-400 sm:flex-row">
          <p>©2026 DriveX Rentals. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-brand-400">Privacy &amp; Policy</Link>
            <Link href="#" className="hover:text-brand-400">Terms of Service</Link>
            <Link href="/admin" className="hover:text-brand-400">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
