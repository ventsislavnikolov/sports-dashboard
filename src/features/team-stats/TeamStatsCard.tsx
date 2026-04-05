import { CardShell } from "@/shared/CardShell";
import { StatRow } from "@/shared/StatRow";
import { useFixtureStats } from "./useFixtureStats";

const DISPLAY_STATS = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Total passes",
  "Fouls",
  "Yellow Cards",
  "Corner Kicks",
];

function findStat(
  statistics: Array<{ type: string; value: number | string | null }>,
  type: string
): string | number | null {
  return statistics.find((s) => s.type === type)?.value ?? null;
}

export function TeamStatsCard() {
  const { teams, isLoading, error, dataUpdatedAt, refetch } = useFixtureStats();

  const home = teams[0];
  const away = teams[1];

  return (
    <CardShell
      dataUpdatedAt={dataUpdatedAt}
      error={error}
      isLoading={isLoading}
      onRetry={() => void refetch()}
      title="TEAM STATS"
    >
      {home && away ? (
        <div>
          <div className="mb-2 flex justify-between font-semibold text-[10px] text-text-muted">
            <span>{home.team.name}</span>
            <span>{away.team.name}</span>
          </div>
          {DISPLAY_STATS.map((statType) => (
            <StatRow
              awayValue={findStat(away.statistics, statType)}
              homeValue={findStat(home.statistics, statType)}
              key={statType}
              label={statType}
            />
          ))}
        </div>
      ) : (
        <p className="py-2 text-center text-text-muted text-xs">
          No stats available
        </p>
      )}
    </CardShell>
  );
}
