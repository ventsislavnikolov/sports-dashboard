import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import { TopLeaderboardCard } from "@/features/match-cards/TopLeaderboardCard";
import { useFixturePlayers } from "@/features/match-cards/useFixturePlayers";
import { PlayerDetailCard } from "@/features/player-detail/PlayerDetailCard";
import { ShotCompareCard } from "@/features/shot-compare/ShotCompareCard";
import { useLiveFixtures } from "@/features/sidebar/useLiveFixtures";
import { TeamStatsCard } from "@/features/team-stats/TeamStatsCard";
import { formatMinute } from "@/shared/formatMinute";
import { LiveBadge } from "@/shared/LiveBadge";
import { activeFixtureStore, setFixtureId } from "@/store/activeFixture";

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
    <div className="sticky top-0 z-10 flex items-center justify-center gap-4 border-bg-hover border-b bg-bg-surface px-4 py-3">
      <span className="font-semibold text-sm text-text-primary">
        {home.name}
      </span>
      <span className="font-extrabold text-text-primary text-xl">
        {fixture.goals.home} – {fixture.goals.away}
      </span>
      <span className="font-semibold text-sm text-text-primary">
        {away.name}
      </span>
      <LiveBadge />
      <span className="text-text-muted text-xs">
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
    if (!Number.isNaN(numericId)) {
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
            allPlayers={allPlayers}
            dataUpdatedAt={dataUpdatedAt}
            error={error}
            isLoading={isLoading}
            onRetry={() => void refetch()}
            stat="passes"
            title="TOP 5 — PASSES"
          />
          <TopLeaderboardCard
            allPlayers={allPlayers}
            dataUpdatedAt={dataUpdatedAt}
            error={error}
            isLoading={isLoading}
            onRetry={() => void refetch()}
            stat="tackles"
            title="TOP 5 — TACKLES"
          />
          <TopLeaderboardCard
            allPlayers={allPlayers}
            dataUpdatedAt={dataUpdatedAt}
            error={error}
            isLoading={isLoading}
            onRetry={() => void refetch()}
            stat="dribbles"
            title="TOP 5 — DRIBBLE ATTEMPTS"
          />
          <TeamStatsCard />
          <ShotCompareCard
            allPlayers={allPlayers}
            dataUpdatedAt={dataUpdatedAt}
            isLoading={isLoading}
          />
          <PlayerDetailCard
            allPlayers={allPlayers}
            dataUpdatedAt={dataUpdatedAt}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
