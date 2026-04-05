interface StatRowProps {
  awayValue: string | number | null;
  homeValue: string | number | null;
  label: string;
}

export function StatRow({ label, homeValue, awayValue }: StatRowProps) {
  const home = homeValue ?? "—";
  const away = awayValue ?? "—";

  const homeNum =
    typeof homeValue === "number"
      ? homeValue
      : Number.parseFloat(String(homeValue));
  const awayNum =
    typeof awayValue === "number"
      ? awayValue
      : Number.parseFloat(String(awayValue));

  const homeHigher =
    !(Number.isNaN(homeNum) || Number.isNaN(awayNum)) && homeNum > awayNum;
  const awayHigher =
    !(Number.isNaN(homeNum) || Number.isNaN(awayNum)) && awayNum > homeNum;

  return (
    <div className="flex items-center justify-between py-1.5">
      <span
        className={`w-16 text-right font-semibold text-xs ${homeHigher ? "text-accent-blue" : "text-text-primary"}`}
      >
        {home}
      </span>
      <span className="flex-1 text-center text-[10px] text-text-muted">
        {label}
      </span>
      <span
        className={`w-16 text-left font-semibold text-xs ${awayHigher ? "text-accent-blue" : "text-text-primary"}`}
      >
        {away}
      </span>
    </div>
  );
}
