import { describe, expect, it } from "vitest";
import type { PlayerMatchStat } from "@/api/types";
import { sortPlayers } from "../sortPlayers";

function makePlayer(
  id: number,
  name: string,
  passes: number | null,
  tackles: number | null,
  dribbleAttempts: number | null
): PlayerMatchStat {
  return {
    player: { id, name, photo: "" },
    statistics: [
      {
        games: {
          position: "M",
          rating: "7.0",
          minutes: 90,
          captain: false,
          number: id,
        },
        shots: { total: 0, on: 0 },
        passes: { total: passes, accuracy: "80" },
        tackles: { total: tackles, interceptions: 0 },
        dribbles: { attempts: dribbleAttempts, success: 0 },
        fouls: { drawn: 0, committed: 0 },
        cards: { yellow: 0, red: 0 },
      },
    ],
  };
}

describe("sortPlayers", () => {
  const players = [
    makePlayer(1, "Alice", 50, 3, 2),
    makePlayer(2, "Bob", 80, 1, 5),
    makePlayer(3, "Charlie", 60, 5, 0),
    makePlayer(4, "Dave", 70, 2, 8),
    makePlayer(5, "Eve", 90, 4, 1),
    makePlayer(6, "Frank", 40, 0, 3),
  ];

  it("returns top 5 sorted by passes descending", () => {
    const result = sortPlayers(players, "passes");
    expect(result.map((p) => p.player.name)).toEqual([
      "Eve",
      "Bob",
      "Dave",
      "Charlie",
      "Alice",
    ]);
  });

  it("returns top 5 sorted by tackles descending", () => {
    const result = sortPlayers(players, "tackles");
    expect(result.map((p) => p.player.name)).toEqual([
      "Charlie",
      "Eve",
      "Alice",
      "Dave",
      "Bob",
    ]);
  });

  it("returns top 5 sorted by dribbles descending", () => {
    const result = sortPlayers(players, "dribbles");
    expect(result.map((p) => p.player.name)).toEqual([
      "Dave",
      "Bob",
      "Frank",
      "Alice",
      "Eve",
    ]);
  });

  it("excludes players with null stat value", () => {
    const withNulls = [
      makePlayer(1, "Alice", 50, null, 2),
      makePlayer(2, "Bob", 80, 1, 5),
    ];
    const result = sortPlayers(withNulls, "tackles");
    expect(result.map((p) => p.player.name)).toEqual(["Bob"]);
  });

  it("excludes players with zero stat value", () => {
    const result = sortPlayers(players, "dribbles");
    expect(result.find((p) => p.player.name === "Charlie")).toBeUndefined();
  });

  it("returns empty array for empty input", () => {
    expect(sortPlayers([], "passes")).toEqual([]);
  });

  it("returns fewer than 5 when not enough players", () => {
    const two = [makePlayer(1, "A", 10, 1, 1), makePlayer(2, "B", 20, 2, 2)];
    expect(sortPlayers(two, "passes")).toHaveLength(2);
  });
});
