import type { PlayerMatchStat } from "@/api/types";
import { CardShell } from "@/shared/CardShell";
import { PlayerAvatar } from "@/shared/PlayerAvatar";
import {
  setSelectedPlayerId,
  toggleComparedPlayer,
} from "@/store/activeFixture";
import { sortPlayers } from "./sortPlayers";

type StatKey = "passes" | "tackles" | "dribbles";

interface TopLeaderboardCardProps {
  allPlayers: PlayerMatchStat[];
  dataUpdatedAt: number;
  error: Error | null;
  isLoading: boolean;
  onRetry: () => void;
  stat: StatKey;
  title: string;
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
      dataUpdatedAt={dataUpdatedAt}
      error={error}
      isLoading={isLoading}
      onRetry={onRetry}
      title={title || STAT_LABELS[stat]}
    >
      <div className="space-y-1">
        {top5.map((player, index) => (
          <button
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-bg-hover"
            key={player.player.id}
            onClick={() => {
              setSelectedPlayerId(player.player.id);
              toggleComparedPlayer(player.player.id);
            }}
          >
            <span className="w-4 text-right text-[10px] text-text-muted">
              {index + 1}
            </span>
            <PlayerAvatar
              name={player.player.name}
              photo={player.player.photo}
              size={22}
            />
            <span className="flex-1 truncate font-semibold text-text-primary text-xs">
              {player.player.name}
            </span>
            <span className="font-bold text-accent-blue text-sm">
              {getStatDisplay(player, stat)}
            </span>
          </button>
        ))}
        {top5.length === 0 && !isLoading && (
          <p className="py-2 text-center text-text-muted text-xs">
            No data available
          </p>
        )}
      </div>
    </CardShell>
  );
}
