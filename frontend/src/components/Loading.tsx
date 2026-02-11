export default function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
      <span className="h-3 w-3 animate-pulse rounded-full bg-teal-500" />
      <span>{label}...</span>
    </div>
  );
}
