type SkeletonProps = {
  className?: string;
};

export function SkeletonLine({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-full bg-slate-200 ${className}`} />;
}

export function SkeletonBlock({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}
