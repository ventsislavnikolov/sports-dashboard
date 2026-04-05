import { MatchItem } from "./MatchItem";
import type { Fixture } from "@/api/types";

interface MatchListProps {
  fixturesByLeague: Record<string, Fixture[]>;
  collapsed: boolean;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

function SkeletonRows() {
  return (
    <div className="space-y-2 px-3 py-2 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 bg-bg-hover rounded" />
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
        <p className="text-accent-red text-xs mb-2">Failed to load matches</p>
        <button
          onClick={onRetry}
          className="text-xs text-accent-blue hover:underline"
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
            <div className="px-3 py-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-wider border-b border-bg-hover">
              {leagueName}
            </div>
          )}
          {fixturesByLeague[leagueName]!.map((fixture) => (
            <MatchItem
              key={fixture.fixture.id}
              fixture={fixture}
              collapsed={collapsed}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
