import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { activeFixtureStore } from "@/store/activeFixture";
import { fetchFixturePlayers } from "@/api/client";
import type { PlayerMatchStat } from "@/api/types";
import { useMemo } from "react";

export function useFixturePlayers() {
  const fixtureId = useStore(activeFixtureStore, (s) => s.fixtureId);

  const query = useQuery({
    queryKey: ["fixtures", "players", fixtureId],
    queryFn: () => fetchFixturePlayers(fixtureId!),
    enabled: fixtureId !== null,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });

  const allPlayers = useMemo(() => {
    if (!query.data) return [];
    const players: PlayerMatchStat[] = [];
    for (const team of query.data) {
      players.push(...team.players);
    }
    return players;
  }, [query.data]);

  return {
    allPlayers,
    teamData: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
  };
}
