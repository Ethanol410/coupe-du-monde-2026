/**
 * Arbre a elimination directe. Le regroupement pur vit dans le domaine.
 */
import { getProvider } from "@/lib/providers";
import type { BracketRound } from "@/lib/providers/types";

export { groupByStage } from "@/lib/domain/bracket";

export function getBracket(): Promise<BracketRound[]> {
  return getProvider().getBracket();
}
