/**
 * Provider mock deterministe pour les tests (PRD §11.3, ROADMAP Phase 1).
 * Expose 3 matchs figes couvrant les 3 etats : SCHEDULED, LIVE, FINISHED.
 * Aucun appel reseau, aucun Date.now -> resultats reproductibles.
 */
import { groupByStage } from "@/lib/domain/bracket";
import { applyMatchFilter } from "@/lib/domain/filter";
import { computeStandings } from "@/lib/domain/standings";
import type {
  BracketRound,
  DataProvider,
  GroupStanding,
  Match,
  MatchDetail,
  MatchEvent,
  MatchFilter,
  Team,
  Venue,
} from "./types";

function team(id: string, name: string, code: string): Team {
  return { id, name, code, flagUrl: `https://flagcdn.com/w80/${code.toLowerCase()}.png` };
}

const FRANCE = team("fr", "France", "FRA");
const ARGENTINA = team("ar", "Argentine", "ARG");
const BRAZIL = team("br", "Bresil", "BRA");
const SPAIN = team("es", "Espagne", "ESP");

const VENUE: Venue = {
  id: "mock-venue",
  name: "Stade Test",
  city: "Testville",
  country: "Testland",
};

const FINISHED_EVENTS: MatchEvent[] = [
  { minute: 23, type: "GOAL", team: "home", player: "Mbappe" },
  { minute: 60, type: "GOAL", team: "away", player: "Messi" },
  { minute: 78, type: "GOAL", team: "home", player: "Giroud" },
];

const SCHEDULED_MATCH: Match = {
  id: "m-scheduled",
  stage: "GROUP",
  group: "A",
  kickoff: "2026-06-20T18:00:00.000Z",
  status: "SCHEDULED",
  minute: null,
  home: FRANCE,
  away: BRAZIL,
  score: { home: null, away: null },
  venue: VENUE,
};

const LIVE_MATCH: Match = {
  id: "m-live",
  stage: "GROUP",
  group: "A",
  kickoff: "2026-06-15T19:00:00.000Z",
  status: "LIVE",
  minute: 57,
  home: BRAZIL,
  away: SPAIN,
  score: { home: 1, away: 0 },
  venue: VENUE,
};

const FINISHED_MATCH: Match = {
  id: "m-finished",
  stage: "GROUP",
  group: "A",
  kickoff: "2026-06-11T19:00:00.000Z",
  status: "FINISHED",
  minute: null,
  home: FRANCE,
  away: ARGENTINA,
  score: { home: 2, away: 1 },
  venue: VENUE,
};

const MATCHES: Match[] = [FINISHED_MATCH, LIVE_MATCH, SCHEDULED_MATCH];

const GROUPS: Array<{ group: string; teams: Team[] }> = [
  { group: "A", teams: [FRANCE, ARGENTINA, BRAZIL, SPAIN] },
];

const EVENTS_BY_MATCH: ReadonlyMap<string, MatchEvent[]> = new Map([
  [FINISHED_MATCH.id, FINISHED_EVENTS],
]);

export const mockProvider: DataProvider = {
  async getMatches(filter?: MatchFilter): Promise<Match[]> {
    const sorted = [...MATCHES].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
    return applyMatchFilter(sorted, filter);
  },

  async getMatchById(id: string): Promise<MatchDetail | null> {
    const found = MATCHES.find((m) => m.id === id);
    if (!found) return null;
    return { ...found, events: EVENTS_BY_MATCH.get(id) ?? [] };
  },

  async getLiveMatches(): Promise<Match[]> {
    return MATCHES.filter((m) => m.status === "LIVE");
  },

  async getStandings(): Promise<GroupStanding[]> {
    return computeStandings(MATCHES, GROUPS);
  },

  async getBracket(): Promise<BracketRound[]> {
    return groupByStage(MATCHES);
  },
};
