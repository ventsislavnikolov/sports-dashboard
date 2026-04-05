interface League {
  id: number;
  name: string;
}

interface LeagueFilterProps {
  leagues: League[];
  selectedLeagueId: number | null;
  onSelect: (leagueId: number | null) => void;
  collapsed: boolean;
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
        onClick={() => onSelect(null)}
        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
          selectedLeagueId === null
            ? "bg-accent-blue text-bg-primary"
            : "bg-bg-hover text-text-muted hover:text-text-primary"
        }`}
      >
        All
      </button>
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => onSelect(league.id)}
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-colors ${
            selectedLeagueId === league.id
              ? "bg-accent-blue text-bg-primary"
              : "bg-bg-hover text-text-muted hover:text-text-primary"
          }`}
        >
          {league.name}
        </button>
      ))}
    </div>
  );
}
