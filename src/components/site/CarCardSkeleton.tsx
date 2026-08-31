export default function CarCardSkeleton() {
  return (
    <div className="card skeleton-shimmer flex flex-col overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-navy-100/90 via-navy-100 to-navy-200/60">
        {/* Category badge placeholder */}
        <div className="absolute left-3 top-3 h-5 w-20 rounded-full bg-navy-200/80 backdrop-blur" />
        {/* Heart button placeholder */}
        <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/70 shadow-sm" />
      </div>

      {/* Body Skeleton */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-2/3">
            <div className="h-5 w-4/5 rounded-md bg-navy-200/80" />
            <div className="mt-2 h-3.5 w-1/2 rounded bg-navy-100" />
          </div>
          <div className="h-6 w-14 rounded-full bg-emerald-100/60" />
        </div>

        {/* Specs 2x2 grid */}
        <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-brand-200/70" />
            <div className="h-3.5 w-14 rounded bg-navy-100/80" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-brand-200/70" />
            <div className="h-3.5 w-16 rounded bg-navy-100/80" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-brand-200/70" />
            <div className="h-3.5 w-12 rounded bg-navy-100/80" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-full bg-brand-200/70" />
            <div className="h-3.5 w-14 rounded bg-navy-100/80" />
          </div>
        </div>

        {/* Footer Pricing & CTA */}
        <div className="mt-5 flex items-center justify-between border-t border-navy-100/80 pt-4">
          <div>
            <div className="h-6 w-20 rounded bg-navy-200/80" />
            <div className="mt-1.5 h-3 w-32 rounded bg-navy-100/80" />
          </div>
          <div className="h-9 w-24 rounded-xl bg-brand-200/70" />
        </div>
      </div>
    </div>
  );
}
