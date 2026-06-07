/**
 * Acces aux equipes (nations). Source : couche statique embarquee.
 */
import { getStaticTeams } from "@/lib/providers/static";
import type { Team } from "@/lib/providers/types";

export function getTeams(): Team[] {
  return getStaticTeams();
}

/** Resout une equipe par son code FIFA (insensible a la casse). null si inconnue. */
export function getTeamByCode(code: string): Team | null {
  const upper = code.toUpperCase();
  return getStaticTeams().find((t) => t.code?.toUpperCase() === upper) ?? null;
}
