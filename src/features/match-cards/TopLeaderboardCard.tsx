import { CardShell } from "@/shared/CardShell";
import { PlayerAvatar } from "@/shared/PlayerAvatar";
import { setSelectedPlayerId, toggleComparedPlayer } from "@/store/activeFixture";
import { sortPlayers } from "./sortPlayers";
import type { PlayerMatchStat } from "@/api/types";

type StatKey = "passes" | "tackles" | "dribbles";

interface TopLeaderboardCardProps {
  title: string;
  stat: StatKey;
  allPlayers: PlayerMatchStat[];
  isLoading: boolean;
  error: Error | null;
  dataUpdatedAt: number;
  onRetry: () => void;
}

const STAT_LABELS: Record<StatKey, string> = {
  passes: "TOP 5 — PASSES",
  tackles: "TOP 5 — TACKLES",
  dribbles: "TOP 5 — DRIBBLE ATTEMPTS",
};

function getStatDisplay(player: PlayerMatchStat, stat: StatKey): number {
  const s = player.statistics[0];
  switch (stat) {
    case "passes":
      return s.passes.total ?? 0;
    case "tackles":
      return s.tackles.total ?? 0;
    case "dribbles":
      return s.dribbles.attempts ?? 0;
  }
}

export function TopLeaderboardCard({
  title,
  stat,
  allPlayers,
  isLoading,
  error,
  dataUpdatedAt,
  onRetry,
}: TopLeaderboardCardProps) {
  const top5 = sortPlayers(allPlayers, stat);

  return (
    <CardShell
      title={title || STAT_LABELS[stat]}
      isLoading={isLoading}
      error={error}
      dataUpdatedAt={dataUpdatedAt}
      onRetry={onRetry}
    >
      <div className="space-y-1">
        {top5.map((player, index) => (
          <button
            key={player.player.id}
            onClick={() => {
              setSelectedPlayerId(player.player.id);
              toggleComparedPlayer(player.player.id);
            }}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-bg-hover transition-colors text-left"
          >
            <span className="text-[10px] text-text-muted w-4 text-right">
              {index + 1}
            </span>
            <PlayerAvatar
              name={player.player.name}
              photo={player.player.photo}
              size={22}
            />
            <span className="text-xs font-semibold text-text-primary flex-1 truncate">
              {player.player.name}
            </span>
            <span className="text-sm font-bold text-accent-blue">
              {getStatDisplay(player, stat)}
            </span>
          </button>
        ))}
        {top5.length === 0 && !isLoading && (
          <p className="text-text-muted text-xs text-center py-2">
            No data available
          </p>
        )}
      </div>
    </CardShell>
  );
}
