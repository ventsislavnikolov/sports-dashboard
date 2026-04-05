export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-accent-green">
      <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
      LIVE
    </span>
  );
}
