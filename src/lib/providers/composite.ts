/**
 * Provider composite : squelette statique (couche 1) + enrichissement openfootball (couche 2).
 * DEGRADATION GRACIEUSE : si openfootball echoue, on garde les valeurs statiques (PRD §11.4).
 */
import { groupByStage } from "@/lib/domain/bracket";
import { applyMatchFilter } from "@/lib/domain/filter";
import { computeStandings } from "@/lib/domain/standings";
import {
  buildJoinKey,
  fetchResults,
  type ResultEnrichment,
} from "./openfootball";
import {
  getStaticGroups,
  getStaticMatches,
} from "./static";
import type {
  BracketRound,
  DataProvider,
  GroupStanding,
  Match,
  MatchDetail,
  MatchFilter,
} from "./types";

function enrich(match: Match, results: Map<string, ResultEnrichment>): Match {
  const found = results.get(buildJoinKey(match.home.name, match.away.name));
  if (!found) return match;
  return { ...match, score: found.score, status: found.status };
}

async function enrichedMatches(): Promise<Match[]> {
  const skeleton = getStaticMatches();
  const results = await fetchResults();
  if (results.size === 0) return skeleton;
  return skeleton.map((m) => enrich(m, results));
}

export const compositeProvider: DataProvider = {
  async getMatches(filter?: MatchFilter): Promise<Match[]> {
    return applyMatchFilter(await enrichedMatches(), filter);
  },

  async getMatchById(id: string): Promise<MatchDetail | null> {
    const base = getStaticMatches().find((m) => m.id === id);
    if (!base) return null;
    const results = await fetchResults();
    const enriched = enrich(base, results);
    const found = results.get(buildJoinKey(base.home.name, base.away.name));
    // events depuis openfootball ; lineups non fourni par la source -> "non disponible".
    return { ...enriched, events: found?.events ?? [] };
  },

  async getLiveMatches(): Promise<Match[]> {
    // Aucune source live en Phase 1 (branchee en Phase 3) -> aucun match LIVE.
    return (await enrichedMatches()).filter((m) => m.status === "LIVE");
  },

  async getStandings(): Promise<GroupStanding[]> {
    return computeStandings(await enrichedMatches(), getStaticGroups());
  },

  async getBracket(): Promise<BracketRound[]> {
    return groupByStage(await enrichedMatches());
  },
};
