interface StatRowProps {
  label: string;
  homeValue: string | number | null;
  awayValue: string | number | null;
}

export function StatRow({ label, homeValue, awayValue }: StatRowProps) {
  const home = homeValue ?? "—";
  const away = awayValue ?? "—";

  const homeNum = typeof homeValue === "number" ? homeValue : parseFloat(String(homeValue));
  const awayNum = typeof awayValue === "number" ? awayValue : parseFloat(String(awayValue));

  const homeHigher = !isNaN(homeNum) && !isNaN(awayNum) && homeNum > awayNum;
  const awayHigher = !isNaN(homeNum) && !isNaN(awayNum) && awayNum > homeNum;

  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={`text-xs font-semibold w-16 text-right ${homeHigher ? "text-accent-blue" : "text-text-primary"}`}
      >
        {home}
      </span>
      <span className="text-[10px] text-text-muted flex-1 text-center">
        {label}
      </span>
      <span
        className={`text-xs font-semibold w-16 text-left ${awayHigher ? "text-accent-blue" : "text-text-primary"}`}
      >
        {away}
      </span>
    </div>
  );
}
