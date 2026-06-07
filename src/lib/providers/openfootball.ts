/**
 * Couche 2 — enrichissement des scores via openfootball (PRD §7).
 * Source distante gratuite, sans auth. DEGRADATION GRACIEUSE : toute erreur
 * reseau/parse renvoie une Map vide (jamais de throw) — l'app reste sur la couche statique.
 * Les events (goals1/goals2) sont ignores ici (Phase 4).
 */
import { OpenfootballSchema, type OpenfootballData } from "./raw";
import type { MatchStatus } from "./types";

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export interface ResultEnrichment {
  score: { home: number; away: number };
  status: MatchStatus;
}

/** Normalise un nom d'equipe pour la jointure (insensible casse/espaces). */
export function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

/** Cle de jointure stable : paire ordonnee (domicile, exterieur). */
export function buildJoinKey(homeName: string, awayName: string): string {
  return `${normalizeName(homeName)}|${normalizeName(awayName)}`;
}

/** Construit la table d'enrichissement a partir de donnees openfootball deja parsees. */
export function buildEnrichmentMap(
  data: OpenfootballData,
): Map<string, ResultEnrichment> {
  const map = new Map<string, ResultEnrichment>();
  for (const m of data.matches) {
    const final = m.score?.et ?? m.score?.ft;
    if (!final) continue;
    const home = final[0];
    const away = final[1];
    if (home === undefined || away === undefined) continue;
    map.set(buildJoinKey(m.team1, m.team2), {
      score: { home, away },
      status: "FINISHED",
    });
  }
  return map;
}

/** Recupere et valide les resultats openfootball. Map vide en cas d'echec. */
export async function fetchResults(
  signal?: AbortSignal,
): Promise<Map<string, ResultEnrichment>> {
  try {
    const res = await fetch(OPENFOOTBALL_URL, signal ? { signal } : undefined);
    if (!res.ok) return new Map();
    const json: unknown = await res.json();
    const parsed = OpenfootballSchema.safeParse(json);
    if (!parsed.success) return new Map();
    return buildEnrichmentMap(parsed.data);
  } catch {
    return new Map();
  }
}
