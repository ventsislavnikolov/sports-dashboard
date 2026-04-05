interface League {
  id: number;
  name: string;
}

interface LeagueFilterProps {
  collapsed: boolean;
  leagues: League[];
  onSelect: (leagueId: number | null) => void;
  selectedLeagueId: number | null;
}

export function LeagueFilter({
  leagues,
  selectedLeagueId,
  onSelect,
  collapsed,
}: LeagueFilterProps) {
  if (collapsed) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2">
      <button
        className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] transition-colors ${
          selectedLeagueId === null
            ? "bg-accent-blue text-bg-primary"
            : "bg-bg-hover text-text-muted hover:text-text-primary"
        }`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {leagues.map((league) => (
        <button
          className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] transition-colors ${
            selectedLeagueId === league.id
              ? "bg-accent-blue text-bg-primary"
              : "bg-bg-hover text-text-muted hover:text-text-primary"
          }`}
          key={league.id}
          onClick={() => onSelect(league.id)}
        >
          {league.name}
        </button>
      ))}
    </div>
  );
}
