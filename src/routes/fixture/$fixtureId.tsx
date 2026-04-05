import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@tanstack/react-store";
import { activeFixtureStore, setFixtureId } from "@/store/activeFixture";
import { useLiveFixtures } from "@/features/sidebar/useLiveFixtures";
import { useFixturePlayers } from "@/features/match-cards/useFixturePlayers";
import { TopLeaderboardCard } from "@/features/match-cards/TopLeaderboardCard";
import { TeamStatsCard } from "@/features/team-stats/TeamStatsCard";
import { PlayerDetailCard } from "@/features/player-detail/PlayerDetailCard";
import { ShotCompareCard } from "@/features/shot-compare/ShotCompareCard";
import { LiveBadge } from "@/shared/LiveBadge";
import { formatMinute } from "@/shared/formatMinute";

export const Route = createFileRoute("/fixture/$fixtureId")({
  component: FixturePage,
});

function MatchHeader() {
  const fixtureId = useStore(activeFixtureStore, (s) => s.fixtureId);
  const { fixtures } = useLiveFixtures();
  const fixture = fixtures.find((f) => f.fixture.id === fixtureId);

  if (!fixture) return null;

  const { home, away } = fixture.teams;
  const { elapsed, short: statusShort } = fixture.fixture.status;

  return (
    <div className="bg-bg-surface border-b border-bg-hover px-4 py-3 flex items-center justify-center gap-4 sticky top-0 z-10">
      <span className="text-sm font-semibold text-text-primary">
        {home.name}
      </span>
      <span className="text-xl font-extrabold text-text-primary">
        {fixture.goals.home} – {fixture.goals.away}
      </span>
      <span className="text-sm font-semibold text-text-primary">
        {away.name}
      </span>
      <LiveBadge />
      <span className="text-xs text-text-muted">
        {formatMinute(elapsed, statusShort)}
      </span>
      <span className="text-[10px] text-text-muted">
        {fixture.league.name} · {fixture.league.country}
      </span>
    </div>
  );
}

function FixturePage() {
  const { fixtureId } = Route.useParams();
  const numericId = Number(fixtureId);

  useEffect(() => {
    if (!isNaN(numericId)) {
      setFixtureId(numericId);
    }
  }, [numericId]);

  const { allPlayers, isLoading, error, dataUpdatedAt, refetch } =
    useFixturePlayers();

  return (
    <>
      <MatchHeader />
      <div className="flex-1 overflow-y-auto p-3.5">
        <div className="grid grid-cols-2 gap-3.5">
          <TopLeaderboardCard
            title="TOP 5 — PASSES"
            stat="passes"
            allPlayers={allPlayers}
            isLoading={isLoading}
            error={error}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={() => void refetch()}
          />
          <TopLeaderboardCard
            title="TOP 5 — TACKLES"
            stat="tackles"
            allPlayers={allPlayers}
            isLoading={isLoading}
            error={error}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={() => void refetch()}
          />
          <TopLeaderboardCard
            title="TOP 5 — DRIBBLE ATTEMPTS"
            stat="dribbles"
            allPlayers={allPlayers}
            isLoading={isLoading}
            error={error}
            dataUpdatedAt={dataUpdatedAt}
            onRetry={() => void refetch()}
          />
          <TeamStatsCard />
          <ShotCompareCard
            allPlayers={allPlayers}
            isLoading={isLoading}
            dataUpdatedAt={dataUpdatedAt}
          />
          <PlayerDetailCard
            allPlayers={allPlayers}
            isLoading={isLoading}
            dataUpdatedAt={dataUpdatedAt}
          />
        </div>
      </div>
    </>
  );
}
