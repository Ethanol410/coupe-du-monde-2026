/**
 * Source de vérité du modèle de domaine (PRD §8).
 * Les composants UI ne connaissent QUE ces types — jamais le format brut d'une API.
 * Aucun `any`. `kickoff` est stocké en UTC ISO 8601 ; la conversion de fuseau se fait à l'affichage.
 */

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "HALFTIME"
  | "FINISHED"
  | "POSTPONED";

export type Stage =
  | "GROUP"
  | "ROUND_OF_32"
  | "ROUND_OF_16"
  | "QUARTER_FINAL"
  | "SEMI_FINAL"
  | "THIRD_PLACE"
  | "FINAL";

export interface Team {
  id: string;
  /** Peut être un placeholder ("Vainqueur Groupe A", "Vainqueur Match 99"). */
  name: string;
  /** Code FIFA 3 lettres, null si indéterminé. */
  code: string | null;
  flagUrl: string | null;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: string;
  stage: Stage;
  /** "A".."L" en phase de groupes, sinon null. */
  group: string | null;
  /** ISO 8601 UTC. */
  kickoff: string;
  status: MatchStatus;
  /** Renseigné si LIVE, sinon null. */
  minute: number | null;
  home: Team;
  away: Team;
  score: MatchScore;
  venue: Venue;
}

export type MatchEventType =
  | "GOAL"
  | "OWN_GOAL"
  | "PENALTY"
  | "YELLOW"
  | "RED"
  | "SUBSTITUTION";

export interface MatchEvent {
  minute: number;
  type: MatchEventType;
  team: "home" | "away";
  player: string;
  assist?: string;
}

export interface LineupPlayer {
  name: string;
  number: number | null;
  position: string | null;
}

export interface TeamLineup {
  formation: string | null;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface Lineup {
  home: TeamLineup;
  away: TeamLineup;
}

export interface MatchDetail extends Match {
  events: MatchEvent[];
  lineups?: Lineup;
}

export interface GroupStandingRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface GroupStanding {
  group: string;
  rows: GroupStandingRow[];
}

export interface BracketRound {
  stage: Stage;
  matches: Match[];
}

/** Filtre optionnel pour la liste de matchs. `day` au format ISO date "YYYY-MM-DD". */
export interface MatchFilter {
  status?: MatchStatus;
  stage?: Stage;
  group?: string;
  day?: string;
  teamId?: string;
}

/**
 * Contrat unique d'accès aux données (PRD §7). Plusieurs implémentations :
 * composite (statique + openfootball), mock (tests).
 */
export interface DataProvider {
  getMatches(filter?: MatchFilter): Promise<Match[]>;
  getMatchById(id: string): Promise<MatchDetail | null>;
  getLiveMatches(): Promise<Match[]>;
  getStandings(): Promise<GroupStanding[]>;
  getBracket(): Promise<BracketRound[]>;
}
