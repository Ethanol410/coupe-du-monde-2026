/**
 * Construction pure de l'arbre a elimination directe (aucune dependance reseau).
 * Ordonne les tours R32 -> FINAL ; les matchs de chaque tour sont tries par kickoff.
 */
import type { BracketRound, Match, Stage } from "@/lib/providers/types";

const KNOCKOUT_ORDER: readonly Stage[] = [
  "ROUND_OF_32",
  "ROUND_OF_16",
  "QUARTER_FINAL",
  "SEMI_FINAL",
  "THIRD_PLACE",
  "FINAL",
];

export function groupByStage(matches: Match[]): BracketRound[] {
  return KNOCKOUT_ORDER.map((stage) => ({
    stage,
    matches: matches
      .filter((m) => m.stage === stage)
      .sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
  })).filter((round) => round.matches.length > 0);
}
