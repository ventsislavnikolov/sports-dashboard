import type { PlayerMatchStat } from "@/api/types";

type StatKey = "passes" | "tackles" | "dribbles";

function getStatValue(player: PlayerMatchStat, stat: StatKey): number | null {
  const s = player.statistics[0];
  switch (stat) {
    case "passes":
      return s.passes.total;
    case "tackles":
      return s.tackles.total;
    case "dribbles":
      return s.dribbles.attempts;
  }
}

export function sortPlayers(
  players: PlayerMatchStat[],
  stat: StatKey
): PlayerMatchStat[] {
  return players
    .filter((p) => {
      const val = getStatValue(p, stat);
      return val !== null && val > 0;
    })
    .sort((a, b) => {
      const aVal = getStatValue(a, stat) ?? 0;
      const bVal = getStatValue(b, stat) ?? 0;
      return bVal - aVal;
    })
    .slice(0, 5);
}
