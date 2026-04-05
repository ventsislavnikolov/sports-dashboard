import { HttpResponse, http } from "msw";
import fixturePlayers from "./fixtures/fixture-players.json";
import fixtureStats from "./fixtures/fixture-stats.json";
import liveFixtures from "./fixtures/live-fixtures.json";

const BASE_URL = "https://v3.football.api-sports.io";

export const handlers = [
  http.get(`${BASE_URL}/fixtures`, ({ request }) => {
    const url = new URL(request.url);
    if (url.searchParams.get("live") === "all") {
      return HttpResponse.json(liveFixtures);
    }
    return HttpResponse.json({ response: [] });
  }),

  http.get(`${BASE_URL}/fixtures/players`, () => {
    return HttpResponse.json(fixturePlayers);
  }),

  http.get(`${BASE_URL}/fixtures/statistics`, () => {
    return HttpResponse.json(fixtureStats);
  }),
];
