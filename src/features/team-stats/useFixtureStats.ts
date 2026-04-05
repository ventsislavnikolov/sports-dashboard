import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { fetchFixtureStats } from "@/api/client";
import { activeFixtureStore } from "@/store/activeFixture";

export function useFixtureStats() {
  const fixtureId = useStore(activeFixtureStore, (s) => s.fixtureId);

  const query = useQuery({
    queryKey: ["fixtures", "statistics", fixtureId],
    queryFn: () => fetchFixtureStats(fixtureId as number),
    enabled: fixtureId !== null,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });

  return {
    teams: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    dataUpdatedAt: query.dataUpdatedAt,
    refetch: query.refetch,
  };
}
