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
import { fetchLive, type LiveEnrichment } from "./worldcup2026";
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

/**
 * Applique sur un match : openfootball (par nom) puis worldcup26 (par id, fait
 * autorite pour score/statut/minute car jointure fiable + gere le live).
 */
function enrichOne(
  match: Match,
  results: Map<string, ResultEnrichment>,
  live: Map<string, LiveEnrichment>,
): Match {
  let merged = match;
  const off = results.get(buildJoinKey(match.home.name, match.away.name));
  if (off) merged = { ...merged, score: off.score, status: off.status };
  const liveEnrichment = live.get(match.id);
  if (liveEnrichment) {
    merged = {
      ...merged,
      score: liveEnrichment.score,
      status: liveEnrichment.status,
      minute: liveEnrichment.minute,
    };
  }
  return merged;
}

/** Charge le squelette enrichi par les deux sources (degradation gracieuse). */
async function loadEnriched(): Promise<{
  matches: Match[];
  results: Map<string, ResultEnrichment>;
}> {
  const skeleton = getStaticMatches();
  const [results, live] = await Promise.all([fetchResults(), fetchLive()]);
  const matches = skeleton.map((m) => enrichOne(m, results, live.live));
  return { matches, results };
}

export const compositeProvider: DataProvider = {
  async getMatches(filter?: MatchFilter): Promise<Match[]> {
    return applyMatchFilter((await loadEnriched()).matches, filter);
  },

  async getMatchById(id: string): Promise<MatchDetail | null> {
    const { matches, results } = await loadEnriched();
    const found = matches.find((m) => m.id === id);
    if (!found) return null;
    // events depuis openfootball (buts) ; cartons/compositions non fournis -> "non disponible".
    const off = results.get(buildJoinKey(found.home.name, found.away.name));
    return { ...found, events: off?.events ?? [] };
  },

  async getLiveMatches(): Promise<Match[]> {
    return (await loadEnriched()).matches.filter(
      (m) => m.status === "LIVE" || m.status === "HALFTIME",
    );
  },

  async getStandings(): Promise<GroupStanding[]> {
    return computeStandings((await loadEnriched()).matches, getStaticGroups());
  },

  async getBracket(): Promise<BracketRound[]> {
    return groupByStage((await loadEnriched()).matches);
  },
};
