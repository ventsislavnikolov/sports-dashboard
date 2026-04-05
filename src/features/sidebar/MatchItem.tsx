import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import type { Fixture } from "@/api/types";
import { formatMinute } from "@/shared/formatMinute";
import { LiveBadge } from "@/shared/LiveBadge";
import { activeFixtureStore } from "@/store/activeFixture";

interface MatchItemProps {
  collapsed: boolean;
  fixture: Fixture;
}

export function MatchItem({ fixture, collapsed }: MatchItemProps) {
  const activeId = useStore(activeFixtureStore, (s) => s.fixtureId);
  const isActive = activeId === fixture.fixture.id;

  const { home, away } = fixture.teams;
  const { elapsed, short: statusShort } = fixture.fixture.status;

  if (collapsed) {
    return (
      <Link
        className={`block rounded px-1 py-2 text-center ${
          isActive
            ? "border-accent-blue border-l-2 bg-bg-hover"
            : "border-transparent border-l-2 hover:bg-bg-hover"
        }`}
        params={{ fixtureId: String(fixture.fixture.id) }}
        to="/fixture/$fixtureId"
      >
        <div className="font-bold text-text-primary text-xs">
          {fixture.goals.home}–{fixture.goals.away}
        </div>
        <div className="text-[10px] text-accent-green">
          {formatMinute(elapsed, statusShort)}
        </div>
      </Link>
    );
  }

  return (
    <Link
      className={`block rounded px-3 py-2 ${
        isActive
          ? "border-accent-blue border-l-2 bg-bg-hover"
          : "border-transparent border-l-2 hover:bg-bg-hover"
      }`}
      params={{ fixtureId: String(fixture.fixture.id) }}
      to="/fixture/$fixtureId"
    >
      <div className="flex items-center justify-between">
        <span className="truncate font-semibold text-text-primary text-xs">
          {home.name}
        </span>
        <span className="font-bold text-sm text-text-primary">
          {fixture.goals.home}–{fixture.goals.away}
        </span>
      </div>
      <div className="mt-0.5 flex items-center justify-between">
        <span className="truncate text-text-muted text-xs">{away.name}</span>
        <div className="flex items-center gap-1">
          <LiveBadge />
          <span className="text-[10px] text-accent-green">
            {formatMinute(elapsed, statusShort)}
          </span>
        </div>
      </div>
    </Link>
  );
}
