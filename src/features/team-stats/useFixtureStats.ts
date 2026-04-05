import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { activeFixtureStore } from "@/store/activeFixture";
import { fetchFixtureStats } from "@/api/client";

export function useFixtureStats() {
  const fixtureId = useStore(activeFixtureStore, (s) => s.fixtureId);

  const query = useQuery({
    queryKey: ["fixtures", "statistics", fixtureId],
    queryFn: () => fetchFixtureStats(fixtureId!),
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
