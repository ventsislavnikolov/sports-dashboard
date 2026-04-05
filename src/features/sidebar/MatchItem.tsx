import { Link } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { activeFixtureStore } from "@/store/activeFixture";
import { formatMinute } from "@/shared/formatMinute";
import { LiveBadge } from "@/shared/LiveBadge";
import type { Fixture } from "@/api/types";

interface MatchItemProps {
  fixture: Fixture;
  collapsed: boolean;
}

export function MatchItem({ fixture, collapsed }: MatchItemProps) {
  const activeId = useStore(activeFixtureStore, (s) => s.fixtureId);
  const isActive = activeId === fixture.fixture.id;

  const { home, away } = fixture.teams;
  const { elapsed, short: statusShort } = fixture.fixture.status;

  if (collapsed) {
    return (
      <Link
        to="/fixture/$fixtureId"
        params={{ fixtureId: String(fixture.fixture.id) }}
        className={`block rounded px-1 py-2 text-center ${
          isActive
            ? "border-l-2 border-accent-blue bg-bg-hover"
            : "border-l-2 border-transparent hover:bg-bg-hover"
        }`}
      >
        <div className="text-xs font-bold text-text-primary">
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
      to="/fixture/$fixtureId"
      params={{ fixtureId: String(fixture.fixture.id) }}
      className={`block rounded px-3 py-2 ${
        isActive
          ? "border-l-2 border-accent-blue bg-bg-hover"
          : "border-l-2 border-transparent hover:bg-bg-hover"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-text-primary truncate">
          {home.name}
        </span>
        <span className="text-sm font-bold text-text-primary">
          {fixture.goals.home}–{fixture.goals.away}
        </span>
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-xs text-text-muted truncate">{away.name}</span>
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
