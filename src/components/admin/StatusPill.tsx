const STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600",
  Confirmed: "bg-sky-50 text-sky-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-500",
};

export default function StatusPill({ status }: { status: string }) {
  const s = STYLES[status] || "bg-navy-50 text-navy-500";
  return <span className={`chip ${s}`}>{status}</span>;
}
