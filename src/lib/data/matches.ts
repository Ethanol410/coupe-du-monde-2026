/**
 * Fonctions metier des matchs. Les vues passent UNIQUEMENT par ici (PRD §6),
 * jamais directement par un provider ou une API.
 */
import { getProvider } from "@/lib/providers";
import type { Match, MatchDetail, MatchFilter } from "@/lib/providers/types";

export function getMatches(filter?: MatchFilter): Promise<Match[]> {
  return getProvider().getMatches(filter);
}

export function getMatchById(id: string): Promise<MatchDetail | null> {
  return getProvider().getMatchById(id);
}

export function getLiveMatches(): Promise<Match[]> {
  return getProvider().getLiveMatches();
}
