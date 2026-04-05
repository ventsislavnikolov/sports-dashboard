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
  const { teams, isLoading, error, dataUpdatedAt, refetch } =
    useFixtureStats();

  const home = teams[0];
  const away = teams[1];

  return (
    <CardShell
      title="TEAM STATS"
      isLoading={isLoading}
      error={error}
      dataUpdatedAt={dataUpdatedAt}
      onRetry={() => void refetch()}
    >
      {home && away ? (
        <div>
          <div className="flex justify-between mb-2 text-[10px] font-semibold text-text-muted">
            <span>{home.team.name}</span>
            <span>{away.team.name}</span>
          </div>
          {DISPLAY_STATS.map((statType) => (
            <StatRow
              key={statType}
              label={statType}
              homeValue={findStat(home.statistics, statType)}
              awayValue={findStat(away.statistics, statType)}
            />
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-xs text-center py-2">
          No stats available
        </p>
      )}
    </CardShell>
  );
}
