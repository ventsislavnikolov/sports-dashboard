import type { Fixture } from "@/api/types";
import { MatchItem } from "./MatchItem";

interface MatchListProps {
  collapsed: boolean;
  error: Error | null;
  fixturesByLeague: Record<string, Fixture[]>;
  isLoading: boolean;
  onRetry: () => void;
}

function SkeletonRows() {
  return (
    <div className="animate-pulse space-y-2 px-3 py-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="h-12 rounded bg-bg-hover" key={i} />
      ))}
    </div>
  );
}

export function MatchList({
  fixturesByLeague,
  collapsed,
  isLoading,
  error,
  onRetry,
}: MatchListProps) {
  if (isLoading) return <SkeletonRows />;

  if (error) {
    return (
      <div className="px-3 py-4 text-center">
        <p className="mb-2 text-accent-red text-xs">Failed to load matches</p>
        <button
          className="text-accent-blue text-xs hover:underline"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    );
  }

  const leagueNames = Object.keys(fixturesByLeague);

  if (leagueNames.length === 0) {
    return (
      <div className="px-3 py-8 text-center">
        <p className="text-text-muted text-xs">No live matches right now</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {leagueNames.map((leagueName) => (
        <div key={leagueName}>
          {!collapsed && (
            <div className="border-bg-hover border-b px-3 py-1.5 font-semibold text-[10px] text-text-muted uppercase tracking-wider">
              {leagueName}
            </div>
          )}
          {(fixturesByLeague[leagueName] ?? []).map((fixture) => (
            <MatchItem
              collapsed={collapsed}
              fixture={fixture}
              key={fixture.fixture.id}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
