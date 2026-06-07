/**
 * Filtrage pur des matchs (aucune dependance reseau/provider).
 * `day` compare la date UTC du kickoff (la vue affinera selon le fuseau navigateur en Phase 2).
 */
import type { Match, MatchFilter } from "@/lib/providers/types";

export function applyMatchFilter(matches: Match[], filter?: MatchFilter): Match[] {
  if (!filter) return matches;
  return matches.filter((m) => {
    if (filter.status && m.status !== filter.status) return false;
    if (filter.stage && m.stage !== filter.stage) return false;
    if (filter.group && m.group !== filter.group) return false;
    if (filter.day && m.kickoff.slice(0, 10) !== filter.day) return false;
    if (filter.teamId && m.home.id !== filter.teamId && m.away.id !== filter.teamId) {
      return false;
    }
    return true;
  });
}
