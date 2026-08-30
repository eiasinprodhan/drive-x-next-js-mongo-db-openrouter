"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section className="relative overflow-x-clip bg-gradient-to-br from-[#FAF8F5] via-[#F4F1EC] to-[#ECE7DF] pb-0 pt-[100px] lg:pt-[128px]">
      {/* Ambient background glows matching admin brand accents */}
      <div className="pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full bg-brand-500/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-brand-400/[0.05] blur-[100px]" />

      <div className="container-x relative z-10 grid items-center gap-8 lg:min-h-[480px] lg:grid-cols-2 lg:gap-14">
        {/* Left copy — matches the wireframe text */}
        <div className="animate-fade-up lg:py-6">
          <p className="text-xs sm:text-[15px] font-semibold text-navy-700">100% Trusted Car rental platform in the UK</p>

          <h1 className="mt-3 sm:mt-5 text-2xl font-extrabold uppercase leading-[1.15] tracking-tight text-navy-950 sm:text-4xl md:text-5xl lg:text-[2.6rem] xl:text-[3.2rem] 2xl:text-[3.6rem]">
            <span className="block">Fast and easy way to</span>
            <span className="block text-navy-900">rent a car</span>
          </h1>


          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-navy-600 sm:text-base">
            Our Car Rental online booking system designed to meet the specific needs of car rental business owners. This
            easy-to-use car rental software will let you manage.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/booking"
              className="rounded-lg border border-brand-500 bg-brand-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-md shadow-brand-500/25 transition hover:bg-brand-600 hover:border-brand-600"
            >
              Booking Now
            </Link>
            <Link
              href="/cars"
              className="rounded-lg border border-navy-200 bg-white px-8 py-3.5 text-[15px] font-bold text-navy-800 shadow-sm transition hover:border-brand-400 hover:text-brand-600"
            >
              See all cars
            </Link>
          </div>
        </div>

        {/* Right visual spacer for desktop grid */}
        <div className="hidden lg:block lg:h-full lg:min-h-[460px]" aria-hidden="true" />
      </div>

      {/* Right visual — flush to hero section right edge and bottom edge */}
      <div className="container-x mt-6 lg:mt-0 lg:static">
        <div className="relative animate-fade-up [animation-delay:120ms] lg:absolute lg:bottom-0 lg:right-0 lg:top-[120px] lg:w-[48vw] xl:w-[46vw] 2xl:w-[44vw] lg:max-w-[820px]">
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-navy-900 shadow-[0_40px_80px_-32px_rgba(10,22,40,0.5)] sm:rounded-[3rem] lg:rounded-none lg:rounded-tl-[3.5rem] lg:shadow-[-20px_20px_50px_-20px_rgba(10,22,40,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-car.jpg"
              alt="DriveX premium car"
              className="aspect-[16/10] w-full object-cover object-center lg:aspect-auto lg:h-full lg:w-full"
            />
          </div>
        </div>
      </div>

      {/* Search bar — floats half on hero section bottom and half into the next section */}
      <div className="container-x relative z-30 mt-8 translate-y-1/2 sm:mt-12">
        <div className="mx-auto max-w-[1180px]">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
