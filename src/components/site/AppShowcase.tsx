import Link from "next/link";
import { ArrowRight, Bot, Smartphone } from "lucide-react";

export default function AppShowcase() {
  return (
    <section className="bg-[#FAF7F2] py-20 lg:py-24">
      <div className="container-x grid gap-6 lg:grid-cols-2">
        {/* AI assistant card */}
        <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/25 blur-[80px]" />
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-300">
            <Bot size={13} /> AI Concierge
          </span>
          <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">Meet Rex — your AI rental assistant</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-300">
            Rex recommends cars in seconds, answers pricing &amp; insurance questions, checks availability and even
            qualifies booking leads automatically — powered by an LLM (OpenRouter) with an on-device fallback engine.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold">
            {["LLM-powered answers", "Instant car matching", "Lead qualification", "24/7 availability"].map((t) => (
              <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1">{t}</span>
            ))}
          </div>
          <Link href="/cars" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300">
            Try it on the Cars page <ArrowRight size={15} />
          </Link>
        </div>

        {/* App download card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white sm:p-10">
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/15 blur-[70px]" />
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
            <Smartphone size={13} /> DriveX App
          </span>
          <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">Take DriveX everywhere</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            Unlock with your phone, extend trips remotely and access 24/7 roadside support. Bookings sync instantly with
            the admin dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-900">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.09-.5-2.08-.52-3.2 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              App Store
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-navy-900">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.61 1.81L13.79 12 3.61 22.19c-.38-.2-.61-.6-.61-1.09V2.9c0-.49.23-.89.61-1.09zM14.85 13.06l2.72 2.72-11.6 6.66 8.88-9.38zm5.47-2.28l-2.19-1.25-2.72 2.72 2.72 2.72 2.2-1.25c.96-.55.96-2.39-.01-2.94zM6.27 2.06l11.6 6.66-2.72 2.72-8.88-9.38z"/></svg>
              Google Play
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
