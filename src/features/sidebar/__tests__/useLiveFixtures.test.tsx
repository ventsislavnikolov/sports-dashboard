import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import type { ReactNode } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import liveFixturesData from "@/mocks/fixtures/live-fixtures.json";
import { useLiveFixtures } from "../useLiveFixtures";

const server = setupServer(
  http.get("https://v3.football.api-sports.io/fixtures", () => {
    return HttpResponse.json(liveFixturesData);
  })
);

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useLiveFixtures", () => {
  it("returns fixtures from the API", async () => {
    const { result } = renderHook(() => useLiveFixtures(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fixtures).toHaveLength(3);
    });
  });

  it("derives unique leagues from fixtures", async () => {
    const { result } = renderHook(() => useLiveFixtures(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.leagues).toHaveLength(2);
      expect(result.current.leagues.map((l) => l.name)).toContain(
        "Premier League"
      );
      expect(result.current.leagues.map((l) => l.name)).toContain("Bundesliga");
    });
  });

  it("groups fixtures by league", async () => {
    const { result } = renderHook(() => useLiveFixtures(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.fixturesByLeague).toHaveProperty("Premier League");
      expect(result.current.fixturesByLeague["Premier League"]).toHaveLength(2);
      expect(result.current.fixturesByLeague).toHaveProperty("Bundesliga");
      expect(result.current.fixturesByLeague.Bundesliga).toHaveLength(1);
    });
  });

  it("returns isLoading true initially", () => {
    const { result } = renderHook(() => useLiveFixtures(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
