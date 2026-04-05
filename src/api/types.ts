export interface Team {
  id: number;
  logo: string;
  name: string;
  winner: boolean | null;
}

export interface Score {
  away: number | null;
  home: number | null;
}

export interface Fixture {
  fixture: {
    id: number;
    status: { elapsed: number | null; short: string; long: string };
    venue: { name: string; city: string };
  };
  goals: { home: number | null; away: number | null };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  score: { halftime: Score; fulltime: Score };
  teams: { home: Team; away: Team };
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
  players: PlayerMatchStat[];
  team: Team;
}

export interface TeamStatistic {
  type: string;
  value: number | string | null;
}

export interface TeamMatchStats {
  statistics: TeamStatistic[];
  team: Team;
}

export interface ApiResponse<T> {
  errors: Record<string, string>;
  get: string;
  response: T;
  results: number;
}
