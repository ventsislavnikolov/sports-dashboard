import { useCallback, useEffect, useState } from "react";
import type { Fixture } from "@/api/types";
import { LeagueFilter } from "./LeagueFilter";
import { MatchList } from "./MatchList";
import { useLiveFixtures } from "./useLiveFixtures";

const COLLAPSED_KEY = "sidebar-collapsed";
const COLLAPSE_BREAKPOINT = 1280;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    return stored === "true";
  });

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const { leagues, fixturesByLeague, isLoading, error } = useLiveFixtures();

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < COLLAPSE_BREAKPOINT) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredByLeague: Record<string, Fixture[]> =
    selectedLeagueId === null
      ? fixturesByLeague
      : Object.fromEntries(
          Object.entries(fixturesByLeague).filter(([, fixtures]) =>
            fixtures.some((f) => f.league.id === selectedLeagueId)
          )
        );

  return (
    <aside
      className={`${
        collapsed ? "w-[60px] min-w-[60px]" : "w-[260px] min-w-[260px]"
      } flex flex-col overflow-y-auto border-bg-hover border-r bg-bg-surface transition-all duration-200`}
    >
      <div className="flex items-center justify-between border-bg-hover border-b p-3">
        {!collapsed && (
          <span className="font-bold text-text-primary text-xs tracking-wide">
            CIRIOLAJI
          </span>
        )}
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-sm text-text-muted hover:text-text-primary"
          onClick={toggleCollapse}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <LeagueFilter
        collapsed={collapsed}
        leagues={leagues}
        onSelect={setSelectedLeagueId}
        selectedLeagueId={selectedLeagueId}
      />

      <MatchList
        collapsed={collapsed}
        error={error}
        fixturesByLeague={filteredByLeague}
        isLoading={isLoading}
        onRetry={() => void 0}
      />
    </aside>
  );
}
