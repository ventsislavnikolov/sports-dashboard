import { useQuery } from "@tanstack/react-query";
import { fetchLiveFixtures } from "@/api/client";
import type { Fixture } from "@/api/types";
import { useMemo } from "react";

interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
}

export function useLiveFixtures() {
  const query = useQuery({
    queryKey: ["fixtures", "live"],
    queryFn: fetchLiveFixtures,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });

  const fixtures = query.data ?? [];

  const leagues = useMemo(() => {
    const seen = new Map<number, League>();
    for (const f of fixtures) {
      if (!seen.has(f.league.id)) {
        seen.set(f.league.id, f.league);
      }
    }
    return Array.from(seen.values());
  }, [fixtures]);

  const fixturesByLeague = useMemo(() => {
    const grouped: Record<string, Fixture[]> = {};
    for (const f of fixtures) {
      const key = f.league.name;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(f);
    }
    return grouped;
  }, [fixtures]);

  return {
    fixtures,
    leagues,
    fixturesByLeague,
    isLoading: query.isLoading,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
  };
}
