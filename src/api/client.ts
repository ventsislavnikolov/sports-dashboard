import type {
  ApiResponse,
  Fixture,
  FixturePlayersResponse,
  TeamMatchStats,
} from "./types";

const getBaseUrl = () => import.meta.env.VITE_API_BASE_URL;
const getApiKey = () => import.meta.env.VITE_API_FOOTBALL_KEY;

async function apiFetch<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    headers: {
      "x-rapidapi-key": getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  return data.response;
}

export function fetchLiveFixtures(): Promise<Fixture[]> {
  return apiFetch<Fixture[]>("/fixtures?live=all");
}

export function fetchFixturePlayers(
  fixtureId: number
): Promise<FixturePlayersResponse[]> {
  return apiFetch<FixturePlayersResponse[]>(
    `/fixtures/players?fixture=${fixtureId}`
  );
}

export function fetchFixtureStats(
  fixtureId: number
): Promise<TeamMatchStats[]> {
  return apiFetch<TeamMatchStats[]>(
    `/fixtures/statistics?fixture=${fixtureId}`
  );
}
