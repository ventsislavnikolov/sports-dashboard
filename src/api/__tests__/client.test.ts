import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fetchLiveFixtures, fetchFixturePlayers, fetchFixtureStats } from "../client";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

beforeEach(() => {
  vi.stubEnv("VITE_API_FOOTBALL_KEY", "test-key-123");
  vi.stubEnv("VITE_API_BASE_URL", "https://v3.football.api-sports.io");
});

afterEach(() => {
  vi.unstubAllEnvs();
  mockFetch.mockReset();
});

describe("API client", () => {
  it("sets x-rapidapi-key header from env", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: [] }),
    });

    await fetchLiveFixtures();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-rapidapi-key": "test-key-123",
        }),
      })
    );
  });

  it("fetchLiveFixtures calls /fixtures?live=all", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: [] }),
    });

    await fetchLiveFixtures();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://v3.football.api-sports.io/fixtures?live=all",
      expect.any(Object)
    );
  });

  it("fetchFixturePlayers calls /fixtures/players with fixture id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: [] }),
    });

    await fetchFixturePlayers(12345);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://v3.football.api-sports.io/fixtures/players?fixture=12345",
      expect.any(Object)
    );
  });

  it("fetchFixtureStats calls /fixtures/statistics with fixture id", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: [] }),
    });

    await fetchFixtureStats(12345);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://v3.football.api-sports.io/fixtures/statistics?fixture=12345",
      expect.any(Object)
    );
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: "Too Many Requests",
    });

    await expect(fetchLiveFixtures()).rejects.toThrow("API error: 429 Too Many Requests");
  });
});
