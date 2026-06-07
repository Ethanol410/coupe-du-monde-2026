/**
 * Fusion live (pure) : applique l'enrichissement temps reel sur le squelette,
 * et logique de polling conditionnel (PRD §9). Aucune dependance reseau.
 */
import type { LiveEnrichment } from "@/lib/providers/worldcup2026";
import type { Match } from "@/lib/providers/types";

/** Reponse de /api/live consommee par le client. */
export interface LivePayload {
  matches: Match[];
  /** true si la source live n'a rien renvoye (donnees differees). */
  deferred: boolean;
}

/**
 * Surcouche les scores/statuts/minute des matchs presents dans `map` (par id).
 * Map vide -> liste inchangee (on conserve le dernier etat connu : panne live geree).
 */
export function mergeLiveEnrichment(
  matches: Match[],
  map: Map<string, LiveEnrichment>,
): Match[] {
  if (map.size === 0) return matches;
  return matches.map((match) => {
    const live = map.get(match.id);
    if (!live) return match;
    return {
      ...match,
      score: live.score,
      status: live.status,
      minute: live.minute,
    };
  });
}

export function hasLiveMatches(matches: Match[]): boolean {
  return matches.some((m) => m.status === "LIVE" || m.status === "HALFTIME");
}

/** Intervalle de polling : 30 s s'il existe >=1 match live, sinon desactive (PRD §9). */
export function liveRefetchInterval(matches: Match[]): number | false {
  return hasLiveMatches(matches) ? 30_000 : false;
}
