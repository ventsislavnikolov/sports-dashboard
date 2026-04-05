import { useState, useEffect, useCallback } from "react";
import { useLiveFixtures } from "./useLiveFixtures";
import { LeagueFilter } from "./LeagueFilter";
import { MatchList } from "./MatchList";
import type { Fixture } from "@/api/types";

const COLLAPSED_KEY = "sidebar-collapsed";
const COLLAPSE_BREAKPOINT = 1280;

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_KEY);
    return stored === "true";
  });

  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);

  const { leagues, fixturesByLeague, isLoading, error } =
    useLiveFixtures();

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= COLLAPSE_BREAKPOINT) {
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
      } bg-bg-surface border-r border-bg-hover overflow-y-auto transition-all duration-200 flex flex-col`}
    >
      <div className="flex items-center justify-between p-3 border-b border-bg-hover">
        {!collapsed && (
          <span className="text-xs font-bold text-text-primary tracking-wide">
            CIRIOLAJI
          </span>
        )}
        <button
          onClick={toggleCollapse}
          className="text-text-muted hover:text-text-primary text-sm"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <LeagueFilter
        leagues={leagues}
        selectedLeagueId={selectedLeagueId}
        onSelect={setSelectedLeagueId}
        collapsed={collapsed}
      />

      <MatchList
        fixturesByLeague={filteredByLeague}
        collapsed={collapsed}
        isLoading={isLoading}
        error={error}
        onRetry={() => void 0}
      />
    </aside>
  );
}
