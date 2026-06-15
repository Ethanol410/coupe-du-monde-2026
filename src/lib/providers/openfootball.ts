/**
 * Couche 2 — enrichissement scores + buts via openfootball (PRD §7).
 * Source distante gratuite, sans auth. DEGRADATION GRACIEUSE : toute erreur
 * reseau/parse renvoie une Map vide (jamais de throw) — l'app reste sur la couche statique.
 */
import {
  OpenfootballSchema,
  type OpenfootballData,
  type OpenfootballGoal,
} from "./raw";
import type { MatchEvent, MatchEventType, MatchStatus } from "./types";

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export interface ResultEnrichment {
  score: { home: number; away: number };
  status: MatchStatus;
  events: MatchEvent[];
}

function goalType(goal: OpenfootballGoal): MatchEventType {
  if (goal.owngoal) return "OWN_GOAL";
  if (goal.penalty) return "PENALTY";
  return "GOAL";
}

/** Minute d'un but : extrait les chiffres de tete ("45+5" -> 45, "9"/9 -> 9). */
function goalMinute(value: number | string): number {
  const digits = String(value).match(/\d+/);
  return digits ? Number(digits[0]) : 0;
}

/** Buts openfootball (goals1=domicile, goals2=exterieur) -> events tries par minute. */
export function mapGoalsToEvents(
  goals1?: OpenfootballGoal[],
  goals2?: OpenfootballGoal[],
): MatchEvent[] {
  const events: MatchEvent[] = [];
  for (const g of goals1 ?? []) {
    events.push({ minute: goalMinute(g.minute), type: goalType(g), team: "home", player: g.name });
  }
  for (const g of goals2 ?? []) {
    events.push({ minute: goalMinute(g.minute), type: goalType(g), team: "away", player: g.name });
  }
  return events.sort((a, b) => a.minute - b.minute);
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
      events: mapGoalsToEvents(m.goals1, m.goals2),
    });
  }
  return map;
}

/** Recupere et valide les resultats openfootball. Map vide en cas d'echec. */
export async function fetchResults(
  signal?: AbortSignal,
): Promise<Map<string, ResultEnrichment>> {
  try {
    const res = await fetch(OPENFOOTBALL_URL, {
      next: { revalidate: 900 }, // 15 min : permet l'ISR des pages serveur
      ...(signal ? { signal } : {}),
    });
    if (!res.ok) return new Map();
    const json: unknown = await res.json();
    const parsed = OpenfootballSchema.safeParse(json);
    if (!parsed.success) return new Map();
    return buildEnrichmentMap(parsed.data);
  } catch {
    return new Map();
  }
}
