export interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface Score {
  home: number | null;
  away: number | null;
}

export interface Fixture {
  fixture: {
    id: number;
    status: { elapsed: number | null; short: string; long: string };
    venue: { name: string; city: string };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  teams: { home: Team; away: Team };
  goals: { home: number | null; away: number | null };
  score: { halftime: Score; fulltime: Score };
}

export interface PlayerMatchStat {
  player: { id: number; name: string; photo: string };
  statistics: [
    {
      games: {
        position: string;
        rating: string | null;
        minutes: number | null;
        captain: boolean;
        number: number | null;
      };
      shots: { total: number | null; on: number | null };
      passes: { total: number | null; accuracy: string | null };
      tackles: { total: number | null; interceptions: number | null };
      dribbles: { attempts: number | null; success: number | null };
      fouls: { drawn: number | null; committed: number | null };
      cards: { yellow: number; red: number };
    },
  ];
}

export interface FixturePlayersResponse {
  team: Team;
  players: PlayerMatchStat[];
}

export interface TeamStatistic {
  type: string;
  value: number | string | null;
}

export interface TeamMatchStats {
  team: Team;
  statistics: TeamStatistic[];
}

export interface ApiResponse<T> {
  get: string;
  results: number;
  errors: Record<string, string>;
  response: T;
}
