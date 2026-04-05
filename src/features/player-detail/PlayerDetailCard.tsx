import { useStore } from "@tanstack/react-store";
import { activeFixtureStore } from "@/store/activeFixture";
import { CardShell } from "@/shared/CardShell";
import { PlayerAvatar } from "@/shared/PlayerAvatar";
import type { PlayerMatchStat } from "@/api/types";

interface PlayerDetailCardProps {
  allPlayers: PlayerMatchStat[];
  isLoading: boolean;
  dataUpdatedAt: number;
}

function RatingBadge({ rating }: { rating: string | null }) {
  if (!rating) return <span className="text-text-muted text-xs">—</span>;

  const num = parseFloat(rating);
  let colorClass = "text-accent-red";
  if (num >= 7) colorClass = "text-accent-green";
  else if (num >= 6) colorClass = "text-amber-400";

  return (
    <span className={`text-xl font-extrabold ${colorClass}`}>
      {num.toFixed(1)}
    </span>
  );
}

interface StatBoxProps {
  label: string;
  value: string | number | null;
}

function StatBox({ label, value }: StatBoxProps) {
  return (
    <div className="text-center">
      <div className="text-lg font-extrabold text-accent-blue">
        {value ?? "—"}
      </div>
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}

export function PlayerDetailCard({
  allPlayers,
  isLoading,
  dataUpdatedAt,
}: PlayerDetailCardProps) {
  const selectedPlayerId = useStore(
    activeFixtureStore,
    (s) => s.selectedPlayerId
  );

  const player = allPlayers.find((p) => p.player.id === selectedPlayerId);

  return (
    <div className="col-span-2">
      <CardShell
        title="PLAYER DETAIL"
        isLoading={isLoading}
        dataUpdatedAt={dataUpdatedAt}
      >
        {!player ? (
          <p className="text-text-muted text-xs text-center py-4">
            Click a player to see details
          </p>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3">
              <PlayerAvatar
                name={player.player.name}
                photo={player.player.photo}
                size={40}
              />
              <div>
                <div className="text-sm font-bold text-text-primary">
                  {player.player.name}
                  {player.statistics[0].games.number && (
                    <span className="text-text-muted ml-1">
                      #{player.statistics[0].games.number}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-text-muted">
                  {player.statistics[0].games.position}
                  {player.statistics[0].games.captain && " · Captain"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <RatingBadge rating={player.statistics[0].games.rating} />
              <span className="text-[10px] text-text-muted">Rating</span>
            </div>

            <div className="flex-1 flex items-center justify-evenly">
              <StatBox
                label="Shots"
                value={player.statistics[0].shots.total}
              />
              <StatBox
                label="Passes"
                value={player.statistics[0].passes.total}
              />
              <StatBox
                label="Tackles"
                value={player.statistics[0].tackles.total}
              />
              <StatBox
                label="Intercept."
                value={player.statistics[0].tackles.interceptions}
              />
              <StatBox
                label="Dribbles"
                value={player.statistics[0].dribbles.attempts}
              />
              <StatBox
                label="Pass Acc."
                value={
                  player.statistics[0].passes.accuracy
                    ? `${player.statistics[0].passes.accuracy}%`
                    : null
                }
              />
            </div>
          </div>
        )}
      </CardShell>
    </div>
  );
}
