export type TeamStanding = {
  id: string;
  name: string;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

export type Scorer = {
  player: string;
  team: string;
  goals: number;
};

export type MatchRow = {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  field: string;
  home_goals: number | null;
  away_goals: number | null;
};
