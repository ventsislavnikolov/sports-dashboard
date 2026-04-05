export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-bold text-[10px] text-accent-green">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-green" />
      LIVE
    </span>
  );
}
